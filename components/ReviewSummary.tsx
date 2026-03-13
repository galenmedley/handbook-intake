
import React from 'react';
import { IntakeData, FileMetadata } from '../types';

interface ReviewSummaryProps {
  data: IntakeData;
  onCertChange?: (v: boolean) => void;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ data, onCertChange }) => {
  const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="mb-8 border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <h3 className="bg-slate-50 px-6 py-3 text-xs font-bold text-slate-500 border-b border-slate-200 uppercase tracking-widest">{title}</h3>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
        {children}
      </div>
    </div>
  );

  const Entry = ({ label, value, fullWidth = false }: { label: string, value: any, fullWidth?: boolean }) => {
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return null;
    return (
      <div className={`flex flex-col ${fullWidth ? 'md:col-span-2' : ''}`}>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{label}</span>
        <span className="text-sm text-slate-800 font-semibold whitespace-pre-wrap leading-relaxed">
          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value.toString()}
        </span>
      </div>
    );
  };

  const FileEntry = ({ label, meta }: { label: string, meta: FileMetadata | null }) => {
    if (!meta) return null;
    return (
      <div className="flex flex-col bg-indigo-50/50 border border-indigo-100 p-3 rounded-lg">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter mb-1">{label}</span>
        <div className="flex items-center text-xs font-medium text-indigo-900">
          <span className="truncate">{meta.file_name}</span>
          <span className="ml-2 px-1.5 py-0.5 bg-indigo-200 rounded text-[10px]">{(meta.file_size/1024).toFixed(1)} KB</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm italic mb-6">
        Please review all provided details below. This information will serve as the factual basis for your legal employee handbook draft.
      </div>

      <Section title="1. Company Identity">
        <Entry label="Legal Name" value={data.company_identity.company_legal_name} />
        <Entry label="DBA" value={data.company_identity.company_dba_names} />
        <Entry label="State" value={data.company_identity.company_incorporation_state} />
        <Entry label="HQ Address" value={`${data.company_identity.company_hq_address.street}, ${data.company_identity.company_hq_address.city}, ${data.company_identity.company_hq_address.state} ${data.company_identity.company_hq_address.zip}`} />
        <Entry label="Primary Contact" value={`${data.company_identity.primary_contact.name} (${data.company_identity.primary_contact.title})`} />
        <Entry label="Contact Email" value={data.company_identity.primary_contact.email} />
        <Entry label="Contact Phone" value={data.company_identity.primary_contact.phone} />
      </Section>

      <Section title="2. Designated Contacts">
        <Entry label="Global Style" value={data.designated_contacts.global_display_preference} />
        <Entry label="Publish Channels" value={data.designated_contacts.publish_channels.join(', ')} />
        
        <Entry label="HR Contact Type" value={data.designated_contacts.hr_default_contact.contact_type} />
        <Entry label="HR Title/Dept" value={data.designated_contacts.hr_default_contact.title_or_department} />
        <Entry label="HR Person Name" value={data.designated_contacts.hr_default_contact.person_name} />
        <Entry label="HR Email" value={data.designated_contacts.hr_default_contact.email} />
        <Entry label="HR Phone" value={data.designated_contacts.hr_default_contact.phone} />
        <Entry label="HR Mailing" value={data.designated_contacts.hr_default_contact.mailing_address} />
        <Entry label="HR Portal" value={data.designated_contacts.hr_default_contact.portal_url} />
        <Entry label="HR Special Instructions" value={data.designated_contacts.hr_default_contact.special_instructions} fullWidth />

        <Entry label="Leave Admin Relation" value={data.designated_contacts.leave_administration_contact.relationship_to_hr_default} />
        <Entry label="Leave Admin Org" value={data.designated_contacts.leave_administration_contact.org_or_vendor_name} />
        <Entry label="Leave Admin Name" value={data.designated_contacts.leave_administration_contact.person_name} />
        <Entry label="Leave Admin Email" value={data.designated_contacts.leave_administration_contact.email} />
        <Entry label="Leave Admin Phone" value={data.designated_contacts.leave_administration_contact.phone} />
        <Entry label="Leave Admin Mailing/Fax" value={data.designated_contacts.leave_administration_contact.mailing_or_fax} />
        <Entry label="Leave Admin Instructions" value={data.designated_contacts.leave_administration_contact.special_instructions} fullWidth />

        <Entry label="Call-Out Method" value={data.designated_contacts.attendance_call_out.call_out_method} />
        <Entry label="Call-Out Timing" value={data.designated_contacts.attendance_call_out.required_timing} />
        
        <Entry label="Ethics Reporting" value={data.designated_contacts.ethics_whistleblower.reporting_configuration} />
        <Entry label="Ethics Anonymous" value={data.designated_contacts.ethics_whistleblower.anonymous_reporting_allowed} />
        <Entry label="Ethics Instructions" value={data.designated_contacts.ethics_whistleblower.special_instructions} fullWidth />

        <Entry label="Complaints Config" value={data.designated_contacts.harassment_discrimination_complaints.configuration} />
        <Entry label="Primary Recipient" value={data.designated_contacts.harassment_discrimination_complaints.primary_recipient.title_or_department} />
        <Entry label="Alternate Recipient" value={data.designated_contacts.harassment_discrimination_complaints.alternate_recipient.title_or_department} />
        
        <Entry label="Authorized Rep" value={data.designated_contacts.authorized_representative_handbook_changes.authorized_rep_option} />
        <Entry label="Written Notice Basis" value={data.designated_contacts.written_notice_recipient.recipient_basis} />
        <Entry label="Accepted Methods" value={data.designated_contacts.written_notice_recipient.accepted_delivery_methods.join(', ')} />
      </Section>

      <Section title="3. Workforce Counts">
        <Entry label="Total Employees" value={data.workforce_counts.total_employees} />
        <Entry label="Full-Time" value={data.workforce_counts.full_time_employees} />
        <Entry label="Part-Time" value={data.workforce_counts.part_time_employees} />
        <Entry label="Seasonal Flag" value={data.workforce_counts.seasonal_employees_flag} />
        <Entry label="Seasonal Details" value={data.workforce_counts.seasonal_employee_details} fullWidth />
        <Entry label="Temp Flag" value={data.workforce_counts.temp_staff_flag} />
        <Entry label="Temp Details" value={data.workforce_counts.temp_staff_details} fullWidth />
      </Section>

      <Section title="4-6. Work Locations">
        <Entry label="On-site Count" value={data.work_locations.onsite_locations.length} />
        <Entry label="Remote Employees" value={data.work_locations.remote_flag} />
        <Entry label="Remote Site Count" value={data.work_locations.remote_locations.length} />
        <Entry label="Intl Employees" value={data.work_locations.non_us_flag} />
        <Entry label="Intl Site Count" value={data.work_locations.non_us_locations.length} />
      </Section>

      <Section title="10. Operational Inputs">
        <Entry label="Benefit Year Type" value={data.other_template_inputs.benefit_year.benefit_year_type} />
        {data.other_template_inputs.benefit_year.benefit_year_type === 'FiscalYear' && (
          <Entry label="Fiscal Cycle" value={`${data.other_template_inputs.benefit_year.fiscal_year_start} to ${data.other_template_inputs.benefit_year.fiscal_year_end}`} />
        )}
        <Entry label="Benefit Year Other" value={data.other_template_inputs.benefit_year.benefit_year_other_text} />

        <Entry label="HRIS System" value={data.other_template_inputs.access_and_timekeeping.timekeeping_hris_system} />
        <Entry label="HRIS System Other" value={data.other_template_inputs.access_and_timekeeping.timekeeping_hris_other_text} />
        <Entry label="Balance Access" value={data.other_template_inputs.access_and_timekeeping.hours_and_leave_balance_access} />
        <Entry label="Meal Break Rec" value={data.other_template_inputs.access_and_timekeeping.meal_break_recording_required_nonexempt} />

        <Entry label="Sick Grant Method" value={data.other_template_inputs.sick_leave_company_practice.sick_leave_grant_method} />
        <Entry label="Sick Wait Period" value={data.other_template_inputs.sick_leave_company_practice.sick_leave_waiting_period} />
        <Entry label="Sick Min Increment" value={data.other_template_inputs.sick_leave_company_practice.sick_leave_min_increment} />
        <Entry label="Sick Carry Approach" value={data.other_template_inputs.sick_leave_company_practice.sick_leave_carryover_approach} />
        <Entry label="Sick Carry Cap" value={data.other_template_inputs.sick_leave_company_practice.sick_leave_carryover_cap_hours} />
        <Entry label="Sick Payout" value={data.other_template_inputs.sick_leave_company_practice.sick_leave_payout_at_separation} />

        <Entry label="Workweek" value={data.other_template_inputs.pay_practices.workweek_definition} />
        <Entry label="OT Approval Rule" value={data.other_template_inputs.pay_practices.overtime_approval_rule} />
        <Entry label="Deduction Auth" value={data.other_template_inputs.pay_practices.payroll_deductions_authorization} />

        <Entry label="Smoking Policy" value={data.other_template_inputs.smoking_vaping.smoking_vaping_policy} />
        <Entry label="Emerg Method" value={data.other_template_inputs.safety_emergency.emergency_closure_communication_method} />
        <Entry label="Weather Method" value={data.other_template_inputs.safety_emergency.inclement_weather_reporting_method} />
        
        <Entry label="Acc. Channel" value={data.other_template_inputs.accommodations.accommodation_request_channel} />
        <Entry label="Escalation Path" value={data.other_template_inputs.dispute_resolution.internal_complaint_escalation_path} />
        <Entry label="Arb Policy" value={data.other_template_inputs.dispute_resolution.arbitration_policy_in_place} />
      </Section>

      <Section title="11-12. Drafting Facts">
        <Entry label="Has CBA" value={data.selection_inputs.has_cba} />
        <Entry label="CBA Summary" value={data.selection_inputs.cba_details} fullWidth />
        <FileEntry label="CBA Upload" meta={data.uploads.cba_upload} />
        <Entry label="Hours of Op" value={data.core_operating_facts.hours_of_operation} fullWidth />
        <Entry label="Pay Frequency" value={data.core_operating_facts.pay_frequency} />
        <Entry label="Payday" value={data.core_operating_facts.payday_description} />
      </Section>

      <Section title="13. PTO & Holidays">
        <Entry label="PTO Offered" value={data.pto_and_holidays.pto_offered_flag} />
        <Entry label="PTO Type" value={data.pto_and_holidays.pto_program_type} />
        <Entry label="PTO Waiting" value={data.pto_and_holidays.pto_waiting_period} />
        <Entry label="Holidays" value={data.pto_and_holidays.holiday_schedule.join(', ')} />
        <Entry label="Closed Flag" value={data.pto_and_holidays.holiday_business_closed_flag} />
      </Section>

      <Section title="14. Special Modules">
        <Entry label="Vehicles" value={data.special_modules.company_vehicles_flag} />
        <FileEntry label="Vehicle Policy" meta={data.uploads.vehicle_policy_upload} />
        <Entry label="Travel Req" value={data.special_modules.travel_required_flag} />
        <FileEntry label="Travel Policy" meta={data.uploads.travel_policy_upload} />
        <Entry label="Exp Reimbursement" value={data.special_modules.expense_reimbursement_process} fullWidth />
      </Section>

      <Section title="15. Final Uploads">
        <FileEntry label="Existing Handbook" meta={data.uploads.existing_handbook_upload} />
        <FileEntry label="Additional Policies" meta={data.uploads.additional_policies_upload} />
        <Entry label="Additional Notes" value={data.certification.additional_notes} fullWidth />
      </Section>

      <div className="p-8 bg-indigo-900 rounded-2xl text-white shadow-lg">
        <h4 className="text-xl font-bold mb-4">Final Certification</h4>
        <div className="flex items-start gap-4">
          <input 
            type="checkbox" 
            id="review-cert-check" 
            className="mt-1 w-6 h-6 accent-indigo-400 cursor-pointer" 
            checked={data.certification.certification_acknowledgment}
            onChange={(e) => onCertChange?.(e.target.checked)}
          />
          <label htmlFor="review-cert-check" className="text-sm font-medium leading-relaxed opacity-90 cursor-pointer select-none">
            I certify that all information provided in this Employee Handbook Intake form is accurate, authorized for use in corporate policies, and that I have the legal capacity to authorize these drafting inputs.
          </label>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
