import React, { useMemo } from 'react';
import { Policy } from '../types';
import { Lock, Check } from 'lucide-react';

interface Props {
  policies: Policy[];
  selected: Set<string>;
  onToggle: (policyId: string) => void;
  onBulkSet: (policyIds: string[], selected: boolean) => void;
  onSubmit: () => void;
  error?: string;
}

/**
 * Strip path, .docx, and bracket variant suffixes from a file_path.
 *   'Federal/About Our Company.docx'                          → 'About Our Company'
 *   'State and Local/CA/Crime Victim Leave [25+ Emp].docx'    → 'Crime Victim Leave'
 *   'State and Local/CA/SF/Paid Sick Leave (San Francisco) [Accr].docx'
 *                                                              → 'Paid Sick Leave (San Francisco)'
 * Mirrors _policy_display_title() in docx_processor.py.
 */
function policyDisplayTitle(filePath: string): string {
  const fname = filePath.split('/').pop()?.replace(/\.docx$/i, '') ?? '';
  return fname.replace(/\s*\[[^\]]+\]\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

function isAcknowledgement(p: Policy): boolean {
  const fname = p.file_path.split('/').pop()?.toLowerCase() ?? '';
  return fname.includes('acknowledgement') || fname.includes('acknowledgment') || fname.includes('receipt');
}

/** Pull the sub-locality name (city/county) from a State and Local sub-folder path. */
function subLocality(p: Policy): string {
  const parts = p.file_path.split('/');
  // 'State and Local / StateName / Locality / file.docx' → parts[2] is locality
  if (parts.length >= 4 && parts[0] === 'State and Local') return parts[2];
  return '';
}

interface PolicyGroup {
  label: string;
  policies: Policy[];
  // For state addenda: nested sub-localities (city/county) under the state.
  subgroups?: { label: string; policies: Policy[] }[];
}

/** Group policies into the sections rendered by the accordion. */
function groupPolicies(policies: Policy[]): PolicyGroup[] {
  const groups: PolicyGroup[] = [];

  // Federal — split out acknowledgements; group remainder by topic.
  const federal = policies.filter(
    (p) => p.jurisdiction === 'Federal' && !isAcknowledgement(p),
  );
  const acks = policies.filter(isAcknowledgement);

  if (federal.length > 0) {
    // Group federal by topic, preserving sort_key order.
    const byTopic = new Map<string, Policy[]>();
    for (const p of [...federal].sort((a, b) => a.sort_key - b.sort_key)) {
      const topic = p.topic || 'General';
      if (!byTopic.has(topic)) byTopic.set(topic, []);
      byTopic.get(topic)!.push(p);
    }
    groups.push({
      label: 'Federal',
      policies: federal,
      subgroups: Array.from(byTopic.entries()).map(([label, ps]) => ({ label, policies: ps })),
    });
  }

  // State / locality — one group per state code, with sub-localities nested.
  const stateMap = new Map<string, Policy[]>();
  for (const p of policies) {
    if (p.jurisdiction === 'Federal') continue;
    if (isAcknowledgement(p)) continue;
    if (!stateMap.has(p.jurisdiction)) stateMap.set(p.jurisdiction, []);
    stateMap.get(p.jurisdiction)!.push(p);
  }
  // Sort state codes alphabetically.
  const stateCodes = Array.from(stateMap.keys()).sort();
  for (const state of stateCodes) {
    const statePols = stateMap.get(state)!;
    const stateLevel = statePols.filter((p) => !subLocality(p));
    const localitiesMap = new Map<string, Policy[]>();
    for (const p of statePols) {
      const loc = subLocality(p);
      if (!loc) continue;
      if (!localitiesMap.has(loc)) localitiesMap.set(loc, []);
      localitiesMap.get(loc)!.push(p);
    }
    const subgroups: { label: string; policies: Policy[] }[] = [];
    if (stateLevel.length > 0) {
      subgroups.push({ label: `${state} (state-wide)`, policies: stateLevel });
    }
    for (const loc of Array.from(localitiesMap.keys()).sort()) {
      subgroups.push({ label: loc, policies: localitiesMap.get(loc)! });
    }
    groups.push({ label: `${state} Addendum`, policies: statePols, subgroups });
  }

  if (acks.length > 0) {
    groups.push({ label: 'Acknowledgements', policies: acks });
  }
  return groups;
}

const PolicySelectionScreen: React.FC<Props> = ({
  policies,
  selected,
  onToggle,
  onBulkSet,
  onSubmit,
  error,
}) => {
  const groups = useMemo(() => groupPolicies(policies), [policies]);

  const totalSelected = selected.size;
  const requiredCount = useMemo(
    () => policies.filter((p) => p.required_policy).length,
    [policies],
  );

  const selectableIds = (ps: Policy[]) =>
    ps.filter((p) => !p.required_policy).map((p) => p.policy_id);

  const groupSelectedCount = (ps: Policy[]) =>
    ps.filter((p) => selected.has(p.policy_id)).length;

  const renderRow = (p: Policy) => {
    const isChecked = selected.has(p.policy_id);
    const isLocked = p.required_policy;
    return (
      <label
        key={p.policy_id}
        className={`flex items-start gap-3 px-3 py-2 rounded hover:bg-slate-50 ${
          isLocked ? 'cursor-default' : 'cursor-pointer'
        }`}
      >
        <span className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            className="sr-only"
            checked={isChecked}
            disabled={isLocked}
            onChange={() => !isLocked && onToggle(p.policy_id)}
          />
          <span
            className={`flex items-center justify-center w-5 h-5 rounded border-2 transition ${
              isChecked
                ? isLocked
                  ? 'bg-slate-400 border-slate-400'
                  : 'bg-indigo-600 border-indigo-600'
                : 'bg-white border-slate-300'
            }`}
          >
            {isChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
          </span>
        </span>
        <span className="flex-1 min-w-0">
          <span className="text-sm text-slate-800">{policyDisplayTitle(p.file_path)}</span>
          {isLocked && (
            <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
              <Lock className="w-3 h-3" /> Required
            </span>
          )}
        </span>
      </label>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4 pb-32">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8 bg-indigo-50 border-b border-indigo-100">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Step 1.5 of 2
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Review Your Policies</h1>
            <p className="text-slate-600 mt-2 text-sm">
              Based on your intake answers, we've selected{' '}
              <strong>{policies.length}</strong> policies for your handbook
              ({requiredCount} required, {policies.length - requiredCount} optional).
              Uncheck any optional policy you don't want included. Required policies are locked
              and will always be in the handbook when applicable to your workforce.
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-3">
            {groups.map((group) => {
              const groupCount = groupSelectedCount(group.policies);
              const groupSelectableIds = selectableIds(group.policies);
              return (
                <details key={group.label} className="group border border-slate-200 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer px-4 py-3 bg-slate-50 hover:bg-slate-100 transition flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      {group.label}{' '}
                      <span className="text-sm font-normal text-slate-500">
                        ({groupCount} / {group.policies.length})
                      </span>
                    </span>
                    {groupSelectableIds.length > 0 && (
                      <span className="flex gap-2 text-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            onBulkSet(groupSelectableIds, true);
                          }}
                          className="px-2 py-1 text-indigo-600 hover:bg-indigo-50 rounded"
                        >
                          Select all
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            onBulkSet(groupSelectableIds, false);
                          }}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded"
                        >
                          Deselect all
                        </button>
                      </span>
                    )}
                  </summary>
                  <div className="px-2 py-2 bg-white">
                    {group.subgroups ? (
                      group.subgroups.map((sg) => (
                        <div key={sg.label} className="mb-3">
                          <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {sg.label} ({groupSelectedCount(sg.policies)} / {sg.policies.length})
                          </div>
                          {sg.policies
                            .slice()
                            .sort((a, b) => a.sort_key - b.sort_key)
                            .map(renderRow)}
                        </div>
                      ))
                    ) : (
                      group.policies
                        .slice()
                        .sort((a, b) => a.sort_key - b.sort_key)
                        .map(renderRow)
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg py-4 px-4 z-10">
        {error && (
          <div className="max-w-3xl mx-auto mb-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <span className="text-sm text-slate-600">
            <strong className="text-slate-900">{totalSelected}</strong> of {policies.length} policies selected
          </span>
          <button
            onClick={onSubmit}
            disabled={totalSelected === 0}
            className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition shadow-md"
          >
            Continue with {totalSelected} Selected →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicySelectionScreen;
