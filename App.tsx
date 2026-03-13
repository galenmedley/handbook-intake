import React, { useState, useEffect, useCallback } from 'react';
import { IntakeData } from './types';
import { INITIAL_DATA, STEPS } from './constants';
import StepRenderer from './components/StepRenderer';
import Sidebar from './components/Sidebar';
import { Save, Trash2, ChevronLeft, ChevronRight, CheckCircle, Download, FileText, Loader } from 'lucide-react';

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL as string;
const MICROSERVICE_URL = import.meta.env.VITE_MICROSERVICE_URL as string;

type Phase = 'form' | 'submitting' | 'waiting' | 'questions' | 'applying' | 'done';

interface Question {
  id: string;
  placeholder: string;
  question: string;
}

const App: React.FC = () => {
  const [currentStepId, setCurrentStepId] = useState(1);
  const [formData, setFormData] = useState<IntakeData>(INITIAL_DATA);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Post-submission state
  const [phase, setPhase] = useState<Phase>('form');
  const [sessionId, setSessionId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [docxBase64, setDocxBase64] = useState('');
  const [cleanDocxBase64, setCleanDocxBase64] = useState('');
  const [docxFilename, setDocxFilename] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('handbook_intake_draft');
    if (saved) setShowRestorePrompt(true);
  }, []);

  useEffect(() => {
    if (phase === 'form') {
      localStorage.setItem('handbook_intake_draft', JSON.stringify(formData));
    }
  }, [formData, phase]);

  // Poll session status while waiting
  useEffect(() => {
    if (phase !== 'waiting' || !sessionId) return;
    const interval = setInterval(async () => {
      try {
        const r = await fetch(`${MICROSERVICE_URL}/session/${sessionId}`);
        const data = await r.json();
        if (data.status === 'needs_input') {
          setQuestions(data.questions ?? []);
          clearInterval(interval);
          setPhase('questions');
        } else if (data.status === 'complete') {
          setDocxBase64(data.draft_docx_b64 ?? '');
          setDocxFilename(data.filename ?? 'Employee_Handbook.docx');
          clearInterval(interval);
          setPhase('done');
        }
      } catch {
        // keep polling on network errors
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [phase, sessionId]);

  const restoreDraft = () => {
    const saved = localStorage.getItem('handbook_intake_draft');
    if (saved) setFormData(JSON.parse(saved));
    setShowRestorePrompt(false);
  };

  const clearDraft = () => {
    if (window.confirm('Clear all progress? This cannot be undone.')) {
      localStorage.removeItem('handbook_intake_draft');
      setFormData(INITIAL_DATA);
      setCurrentStepId(1);
      setErrors({});
    }
  };

  const handleFieldChange = useCallback((path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = JSON.parse(JSON.stringify(prev));
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      if (path === 'locality_triggers.nyc_employee_flag') {
        newData.selection_inputs.net_income.net_income_required_flag = value;
      }
      return newData;
    });
  }, []);

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    const d = formData;
    const req = (val: any, key: string, msg = 'Required') => {
      if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
        newErrors[key] = msg;
      }
    };

    switch (currentStepId) {
      case 1:
        req(d.company_identity.company_legal_name, 'company_legal_name');
        req(d.company_identity.company_incorporation_state, 'company_incorporation_state');
        req(d.company_identity.company_hq_address.street, 'street');
        req(d.company_identity.company_hq_address.city, 'city');
        req(d.company_identity.company_hq_address.state, 'hq_state');
        req(d.company_identity.company_hq_address.zip, 'zip');
        req(d.company_identity.primary_contact.name, 'pname');
        req(d.company_identity.primary_contact.title, 'ptitle');
        req(d.company_identity.primary_contact.email, 'pemail');
        req(d.company_identity.primary_contact.phone, 'pphone');
        break;
      case 2:
        req(d.designated_contacts.publish_channels, 'channels');
        req(d.designated_contacts.hr_default_contact.title_or_department, 'hr_title');
        if (d.designated_contacts.hr_default_contact.contact_type === 'SpecificPerson') req(d.designated_contacts.hr_default_contact.person_name, 'hr_name');
        if (d.designated_contacts.leave_administration_contact.relationship_to_hr_default !== 'SameAsHRDefault') {
          req(d.designated_contacts.leave_administration_contact.org_or_vendor_name, 'leave_org');
          if (d.designated_contacts.leave_administration_contact.display_style === 'NameAndTitle') {
            req(d.designated_contacts.leave_administration_contact.person_name, 'leave_name');
          }
        }
        if (d.designated_contacts.attendance_call_out.call_out_method === 'AbsenceLine') req(d.designated_contacts.attendance_call_out.absence_line_phone, 'abs_phone');
        if (d.designated_contacts.attendance_call_out.call_out_method === 'EmailInbox') req(d.designated_contacts.attendance_call_out.designated_email_inbox, 'abs_email');
        if (d.designated_contacts.attendance_call_out.call_out_method === 'SystemPortal') req(d.designated_contacts.attendance_call_out.system_name_and_link, 'abs_portal');
        if (d.designated_contacts.attendance_call_out.call_out_method === 'Other') req(d.designated_contacts.attendance_call_out.other_method_description, 'abs_other');
        if (d.designated_contacts.ethics_whistleblower.reporting_configuration !== 'SameAsHRDefault') {
          if (d.designated_contacts.ethics_whistleblower.display_style === 'NameAndTitle') {
            req(d.designated_contacts.ethics_whistleblower.person_name, 'ethics_name');
          }
          if (['HotlineOrPortalOnly', 'BothPersonAndHotline'].includes(d.designated_contacts.ethics_whistleblower.reporting_configuration)) {
            req(d.designated_contacts.ethics_whistleblower.hotline_or_portal, 'ethics_hotline');
          }
        }
        if (d.designated_contacts.harassment_discrimination_complaints.configuration !== 'SameAsHRDefault') {
          req(d.designated_contacts.harassment_discrimination_complaints.primary_recipient.title_or_department, 'har_p_title');
          if (d.designated_contacts.harassment_discrimination_complaints.primary_recipient.display_style === 'NameAndTitle') {
            req(d.designated_contacts.harassment_discrimination_complaints.primary_recipient.person_name, 'har_p_name');
          }
          req(d.designated_contacts.harassment_discrimination_complaints.alternate_recipient.title_or_department, 'har_a_title');
          if (d.designated_contacts.harassment_discrimination_complaints.alternate_recipient.display_style === 'NameAndTitle') {
            req(d.designated_contacts.harassment_discrimination_complaints.alternate_recipient.person_name, 'har_a_name');
          }
        }
        if (d.designated_contacts.authorized_representative_handbook_changes.authorized_rep_option === 'OtherExecutiveTitleOnly') req(d.designated_contacts.authorized_representative_handbook_changes.other_executive_title, 'auth_title');
        if (d.designated_contacts.authorized_representative_handbook_changes.authorized_rep_option === 'NamedPerson') req(d.designated_contacts.authorized_representative_handbook_changes.named_person_name_and_title, 'auth_name');
        if (d.designated_contacts.written_notice_recipient.recipient_basis === 'Different') {
          req(d.designated_contacts.written_notice_recipient.recipient_details, 'write_details');
          req(d.designated_contacts.written_notice_recipient.accepted_delivery_methods, 'write_methods');
        }
        break;
      case 3:
        if (d.workforce_counts.total_employees < 0) newErrors.total = 'Must be positive';
        if (d.workforce_counts.seasonal_employees_flag && !d.workforce_counts.seasonal_employee_details) newErrors.seasonal = 'Details required';
        if (d.workforce_counts.temp_staff_flag && !d.workforce_counts.temp_staff_details) newErrors.temp = 'Details required';
        break;
      case 4:
        if (d.work_locations.onsite_locations.length === 0 && !d.work_locations.remote_flag) {
          newErrors.onsite_locs = 'Add at least one onsite location or enable Remote Employees.';
        }
        break;
      case 5:
        const hasOnsite = d.work_locations.onsite_locations.length > 0;
        const hasRemote = d.work_locations.remote_flag && d.work_locations.remote_locations.length > 0;
        if (!hasOnsite && !hasRemote) newErrors.locations = 'At least one work location (On-site or Remote) is required to proceed.';
        if (d.work_locations.remote_flag && d.work_locations.remote_locations.length === 0) newErrors.remote_list = 'Add 1+ remote location.';
        break;
      case 6:
        if (d.work_locations.non_us_flag && d.work_locations.non_us_locations.length === 0) newErrors.intl = 'Add 1+ international location.';
        break;
      case 7:
        if (d.locality_triggers.other_localities_present && d.locality_triggers.locality_counts.length === 0) newErrors.localities = 'Add 1+ locality count.';
        break;
      case 8:
        if (d.selection_inputs.allocation_method_choice === 'NotSure' && !d.selection_inputs.allocation_method_notes) newErrors.alloc_notes = 'Explanation required.';
        break;
      case 9:
        if (d.selection_inputs.net_income.net_income_known_flag && d.selection_inputs.net_income.annual_net_income <= 0) newErrors.income = 'Amount required.';
        if (!d.selection_inputs.net_income.net_income_known_flag && !d.selection_inputs.net_income.net_income_notes) newErrors.income_notes = 'Notes required.';
        break;
      case 10:
        req(d.other_template_inputs.benefit_year.benefit_year_type, 'ben_year_type');
        if (d.other_template_inputs.benefit_year.benefit_year_type === 'FiscalYear') {
          req(d.other_template_inputs.benefit_year.fiscal_year_start, 'fisc_start');
          req(d.other_template_inputs.benefit_year.fiscal_year_end, 'fisc_end');
        }
        if (d.other_template_inputs.benefit_year.benefit_year_type === 'Other') req(d.other_template_inputs.benefit_year.benefit_year_other_text, 'ben_other_text');
        req(d.other_template_inputs.access_and_timekeeping.timekeeping_hris_system, 'hris_system');
        if (d.other_template_inputs.access_and_timekeeping.timekeeping_hris_system === 'Other') req(d.other_template_inputs.access_and_timekeeping.timekeeping_hris_other_text, 'hris_other');
        req(d.other_template_inputs.access_and_timekeeping.hours_and_leave_balance_access, 'balance_access');
        if (d.other_template_inputs.access_and_timekeeping.hours_and_leave_balance_access === 'Other') req(d.other_template_inputs.access_and_timekeeping.hours_and_leave_balance_access_other_text, 'balance_other');
        req(d.other_template_inputs.sick_leave_company_practice.sick_leave_grant_method, 'sick_grant');
        req(d.other_template_inputs.sick_leave_company_practice.sick_leave_waiting_period, 'sick_wait');
        if (d.other_template_inputs.sick_leave_company_practice.sick_leave_waiting_period === 'Other') req(d.other_template_inputs.sick_leave_company_practice.sick_leave_waiting_period_other_text, 'sick_wait_other');
        req(d.other_template_inputs.sick_leave_company_practice.sick_leave_carryover_approach, 'sick_carry');
        if (d.other_template_inputs.sick_leave_company_practice.sick_leave_carryover_approach === 'CarryOverWithCap') req(d.other_template_inputs.sick_leave_company_practice.sick_leave_carryover_cap_hours, 'sick_cap');
        if (d.other_template_inputs.sick_leave_company_practice.sick_leave_min_increment === 'Other') req(d.other_template_inputs.sick_leave_company_practice.sick_leave_min_increment_other_text, 'sick_inc_other');
        req(d.other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_method, 'leave_method');
        if (d.other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_method === 'Other') req(d.other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_method_other_text, 'leave_method_other');
        req(d.other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_timing, 'leave_timing');
        if (d.other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_timing === 'XDaysInAdvance') req(d.other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_x_days, 'leave_days');
        req(d.other_template_inputs.pay_practices.workweek_definition, 'workweek');
        if (d.other_template_inputs.pay_practices.workweek_definition === 'Other') req(d.other_template_inputs.pay_practices.workweek_definition_other_text, 'workweek_other');
        req(d.other_template_inputs.pay_practices.overtime_approval_rule, 'ot_rule');
        req(d.other_template_inputs.pay_practices.payroll_deductions_authorization, 'deduction');
        if (d.other_template_inputs.pay_practices.payroll_deductions_authorization === 'Other') req(d.other_template_inputs.pay_practices.payroll_deductions_authorization_other_text, 'deduction_other');
        req(d.other_template_inputs.smoking_vaping.smoking_vaping_policy, 'smoke_policy');
        if (d.other_template_inputs.smoking_vaping.smoking_vaping_policy === 'Other') req(d.other_template_inputs.smoking_vaping.smoking_vaping_policy_other_text, 'smoke_other');
        req(d.other_template_inputs.safety_emergency.emergency_closure_communication_method, 'emerg_method');
        if (d.other_template_inputs.safety_emergency.emergency_closure_communication_method === 'Other') req(d.other_template_inputs.safety_emergency.emergency_closure_other_text, 'emerg_other');
        if (d.other_template_inputs.safety_emergency.emergency_closure_communication_method === 'Hotline') req(d.other_template_inputs.safety_emergency.emergency_hotline_number, 'emergency_hotline_number');
        if (d.other_template_inputs.safety_emergency.inclement_weather_reporting_method === 'Other') req(d.other_template_inputs.safety_emergency.inclement_weather_other_text, 'weather_other');
        if (d.other_template_inputs.safety_emergency.inclement_weather_reporting_method === 'Hotline') req(d.other_template_inputs.safety_emergency.inclement_weather_hotline_number, 'inclement_weather_hotline_number');
        req(d.other_template_inputs.accommodations.accommodation_request_channel, 'acc_channel');
        req(d.other_template_inputs.accommodations.medical_documentation_handling, 'med_docs');
        req(d.other_template_inputs.dispute_resolution.internal_complaint_escalation_path, 'disp_path');
        if (d.other_template_inputs.dispute_resolution.internal_complaint_escalation_path === 'Other') req(d.other_template_inputs.dispute_resolution.internal_complaint_escalation_other_text, 'disp_path_other');
        req(d.other_template_inputs.dispute_resolution.arbitration_policy_in_place, 'disp_arb');
        break;
      case 11:
        if (d.selection_inputs.has_cba) req(d.selection_inputs.cba_details, 'cba_details');
        break;
      case 12:
        req(d.core_operating_facts.employee_relations_contacts, 'er_contacts');
        req(d.core_operating_facts.hours_of_operation, 'hours_op');
        req(d.core_operating_facts.pay_frequency, 'pay_freq');
        if (d.core_operating_facts.pay_frequency === 'Other') req(d.core_operating_facts.pay_frequency_other, 'pay_freq_other');
        req(d.core_operating_facts.payday_description, 'payday_desc');
        req(d.core_operating_facts.dress_code, 'dress');
        break;
      case 13:
        if (d.pto_and_holidays.pto_offered_flag) {
          req(d.pto_and_holidays.pto_program_type, 'pto_type');
          if (d.pto_and_holidays.pto_program_type === 'Other') req(d.pto_and_holidays.pto_program_type_other, 'pto_type_other');
          req(d.pto_and_holidays.pto_eligibility, 'pto_elig');
          if (d.pto_and_holidays.pto_eligibility === 'Other') req(d.pto_and_holidays.pto_eligibility_other, 'pto_elig_other');
          req(d.pto_and_holidays.pto_amount_or_rate, 'pto_rate');
          req(d.pto_and_holidays.pto_carryover_policy, 'pto_carry');
          req(d.pto_and_holidays.pto_waiting_period, 'pto_wait');
          if (d.pto_and_holidays.pto_waiting_period === 'Other') req(d.pto_and_holidays.pto_waiting_period_other, 'pto_wait_other');
        }
        req(d.pto_and_holidays.holiday_schedule, 'hol_sched');
        if (d.pto_and_holidays.holiday_schedule.includes('Other')) req(d.pto_and_holidays.holiday_schedule_other_text, 'hol_sched_other');
        if (d.pto_and_holidays.holiday_business_closed_flag) req(d.pto_and_holidays.closed_holidays_list, 'hol_list');
        break;
      case 14:
        if (d.special_modules.ethics_hotline_flag) req(d.special_modules.ethics_hotline_details, 'eth_details');
        req(d.special_modules.expense_reimbursement_process, 'exp_process');
        break;
      case 15:
        if (!d.certification.certification_acknowledgment) newErrors.cert = 'Acknowledgment required.';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const visibleSteps = STEPS.filter(s => !s.conditional || s.conditional(formData));
  const currentIndexInVisible = visibleSteps.findIndex(s => s.id === currentStepId);

  const nextStep = () => {
    if (validateCurrentStep()) {
      const nextIndex = currentIndexInVisible + 1;
      if (nextIndex < visibleSteps.length) {
        setCurrentStepId(visibleSteps[nextIndex].id);
        window.scrollTo(0, 0);
      }
    }
  };

  const prevStep = () => {
    const prevIndex = currentIndexInVisible - 1;
    if (prevIndex >= 0) {
      setCurrentStepId(visibleSteps[prevIndex].id);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    const finalData = { ...formData, certification: { ...formData.certification, submitted_at_iso: new Date().toISOString() } };
    setFormData(finalData);
    setPhase('submitting');
    setSubmitError('');
    localStorage.removeItem('handbook_intake_draft');
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      if (!res.ok) throw new Error(`Webhook error: ${res.status}`);
      const data = await res.json();
      setSessionId(data.session_id);
      setPhase('waiting');
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
      setPhase('form');
    }
  };

  const submitAnswers = async () => {
    setPhase('applying');
    try {
      const res = await fetch(`${MICROSERVICE_URL}/apply-answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, answers }),
      });
      if (!res.ok) throw new Error(`Error applying answers: ${res.status}`);
      const data = await res.json();
      setDocxBase64(data.docx_base64);
      setCleanDocxBase64(data.clean_docx_base64);
      setDocxFilename(data.filename);
      setPhase('done');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to apply answers.');
      setPhase('questions');
    }
  };

  const downloadDocx = (base64: string, filename: string) => {
    const bytes = atob(base64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Post-submission screens ──────────────────────────────────────────

  if (phase === 'submitting') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Loader className="w-12 h-12 text-indigo-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Submitting your intake form...</h2>
          <p className="text-slate-500 text-sm">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (phase === 'waiting') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Loader className="w-12 h-12 text-indigo-500 mx-auto mb-6 animate-spin" />
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Generating Your Handbook</h2>
          <p className="text-slate-600 mb-6">
            We're selecting and assembling your policies. This typically takes about 2 minutes.
            Follow-up questions will appear here shortly.
          </p>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'questions') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 md:p-8 bg-indigo-50 border-b border-indigo-100">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Step 2 of 2</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Personalization Questions</h1>
              <p className="text-slate-600 mt-2 text-sm">
                The following information could not be filled automatically. All questions are <strong>optional</strong> —
                any you skip will be highlighted yellow in the handbook for attorney review.
              </p>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              {questions.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No follow-up questions needed — your handbook is ready!</p>
              ) : (
                questions.map((q) => (
                  <div key={q.id}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {q.question}
                      <span className="ml-2 text-xs text-slate-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                      rows={2}
                      placeholder="Leave blank to keep placeholder highlighted for attorney review..."
                      value={answers[q.placeholder] ?? ''}
                      onChange={e => setAnswers(prev => ({ ...prev, [q.placeholder]: e.target.value }))}
                    />
                    <p className="text-xs text-slate-400 mt-1 font-mono">{q.placeholder}</p>
                  </div>
                ))
              )}
              {submitError && <p className="text-sm text-rose-600">{submitError}</p>}
            </div>
            <div className="p-6 md:px-8 py-5 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3 justify-between items-center">
              <button
                onClick={() => submitAnswers()}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Skip All &amp; Download Draft
              </button>
              <button
                onClick={() => submitAnswers()}
                className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-md"
              >
                Submit Answers &amp; Download
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'applying') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Loader className="w-12 h-12 text-indigo-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Applying your answers...</h2>
          <p className="text-slate-500 text-sm">Almost there — generating your final handbook.</p>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    const cleanFilename = docxFilename.replace('.docx', '_clean.docx');
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-5" />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Handbook is Ready</h1>
          <p className="text-slate-500 mb-8 text-sm">
            A copy has also been saved to Google Drive.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button
              onClick={() => downloadDocx(docxBase64, docxFilename)}
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-md"
            >
              <Download className="w-5 h-5 mr-2" /> Download Review Copy
            </button>
            {cleanDocxBase64 && (
              <button
                onClick={() => downloadDocx(cleanDocxBase64, cleanFilename)}
                className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition shadow-md"
              >
                <FileText className="w-5 h-5 mr-2" /> Download Clean Copy
              </button>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left mb-6">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Review Copy</strong> includes colored highlights:
              <span className="inline-block mx-1 px-1.5 py-0.5 rounded text-xs font-medium" style={{background:'#ADD8E6'}}>light blue</span> = auto-filled from your intake,
              <span className="inline-block mx-1 px-1.5 py-0.5 rounded text-xs font-medium" style={{background:'#90EE90'}}>light green</span> = AI-written content,
              <span className="inline-block mx-1 px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-200">yellow</span> = needs attorney input.
              <br /><br />
              <strong>Clean Copy</strong> has all highlights removed and is ready for employee distribution after attorney review.
              <br /><br />
              This handbook should be reviewed by an attorney licensed in each jurisdiction covered before distribution.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold transition"
          >
            Start New Handbook
          </button>
        </div>
      </div>
    );
  }

  // ── Main intake form ──────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {showRestorePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Resume Session?</h3>
            <p className="text-slate-600 mb-6">Continue your existing progress or start over.</p>
            <div className="flex gap-3">
              <button onClick={restoreDraft} className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition">Restore</button>
              <button onClick={() => { setShowRestorePrompt(false); localStorage.removeItem('handbook_intake_draft'); }} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition">Start Fresh</button>
            </div>
          </div>
        </div>
      )}

      <Sidebar steps={visibleSteps} currentStepId={currentStepId} onStepClick={setCurrentStepId} />

      <main className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <div className="md:hidden sticky top-0 bg-white border-b border-slate-200 p-4 z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Step {currentIndexInVisible + 1} of {visibleSteps.length}</span>
            <span className="text-sm font-bold text-indigo-600">{Math.round(((currentIndexInVisible + 1) / visibleSteps.length) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${((currentIndexInVisible + 1) / visibleSteps.length) * 100}%` }} />
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8 lg:p-12 max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-2xl font-bold text-slate-900">{visibleSteps.find(s => s.id === currentStepId)?.title}</h2>
            </div>
            <div className="p-6 md:p-8">
              <StepRenderer stepId={currentStepId} data={formData} onChange={handleFieldChange} errors={errors} />
              {submitError && <p className="mt-4 text-sm text-rose-600">{submitError}</p>}
            </div>
            <div className="p-6 md:px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                <button onClick={() => alert('Saved!')} className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition"><Save className="w-4 h-4 mr-2" /> Save</button>
                <button onClick={clearDraft} className="inline-flex items-center px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 rounded-lg transition"><Trash2 className="w-4 h-4 mr-2" /> Clear</button>
              </div>
              <div className="flex gap-3">
                {currentIndexInVisible > 0 && <button onClick={prevStep} className="inline-flex items-center px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold transition shadow-sm"><ChevronLeft className="w-5 h-5 mr-1" /> Back</button>}
                {currentIndexInVisible < visibleSteps.length - 1
                  ? <button onClick={nextStep} className="inline-flex items-center px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-md">Next <ChevronRight className="w-5 h-5 ml-1" /></button>
                  : <button onClick={handleSubmit} className="inline-flex items-center px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition shadow-md">Submit <CheckCircle className="w-5 h-5 ml-2" /></button>
                }
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
