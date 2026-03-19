
import React from 'react';
import { IntakeData, ContactEntry } from './types';

const EMPTY_CONTACT: ContactEntry = { name: '', title: '', email: '', phone: '' };

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export const INITIAL_DATA: IntakeData = {
  company_identity: {
    company_legal_name: '',
    company_dba_names: '',
    company_incorporation_state: '',
    company_hq_address: { street: '', city: '', state: '', zip: '' },
    primary_contact: { name: '', title: '', email: '', phone: '' }
  },
  designated_contacts: {
    global_display_preference: 'TitleOnly',
    publish_channels: [],
    hr_default_contact: {
      contact_type: 'TitleOnly',
      title_or_department: '',
      person_name: '',
      email: '',
      phone: '',
      mailing_address: '',
      portal_url: '',
      special_instructions: ''
    },
    leave_administration_contact: {
      relationship_to_hr_default: 'SameAsHRDefault',
      display_style: 'TitleOnly',
      org_or_vendor_name: '',
      person_name: '',
      email: '',
      phone: '',
      portal_url: '',
      mailing_or_fax: '',
      special_instructions: ''
    },
    attendance_call_out: {
      call_out_method: 'NotifySupervisor',
      absence_line_phone: '',
      designated_email_inbox: '',
      system_name_and_link: '',
      required_timing: '',
      other_method_description: ''
    },
    ethics_whistleblower: {
      reporting_configuration: 'SameAsHRDefault',
      display_style: 'TitleOnly',
      title_or_department: '',
      person_name: '',
      email: '',
      phone: '',
      hotline_or_portal: '',
      anonymous_reporting_allowed: false,
      special_instructions: ''
    },
    harassment_discrimination_complaints: {
      configuration: 'SameAsHRDefault',
      primary_recipient: { display_style: 'TitleOnly', title_or_department: '', person_name: '', email: '', phone: '' },
      alternate_recipient: { display_style: 'TitleOnly', title_or_department: '', person_name: '', email: '', phone: '' },
      hotline_or_portal_optional: ''
    },
    authorized_representative_handbook_changes: {
      authorized_rep_option: 'CEOorPresidentTitleOnly',
      other_executive_title: '',
      named_person_name_and_title: ''
    },
    written_notice_recipient: {
      recipient_basis: 'SameAsHRDefault',
      recipient_details: '',
      accepted_delivery_methods: [],
      delivery_method_details: ''
    }
  },
  workforce_counts: {
    total_employees: 0,
    full_time_employees: 0,
    part_time_employees: 0,
    full_time_hours_per_week: 40,
    seasonal_employees_flag: false,
    seasonal_employee_details: '',
    temp_staff_flag: false,
    temp_staff_details: ''
  },
  work_locations: {
    onsite_locations: [],
    remote_flag: false,
    remote_locations: [],
    non_us_flag: false,
    non_us_locations: []
  },
  locality_triggers: {
    nyc_employee_flag: false,
    other_localities_present: false,
    other_localities_selected: [],
    other_localities_other_text: '',
    locality_counts: []
  },
  selection_inputs: {
    employee_threshold_basis: 'TotalEmployees',
    allocation_method_choice: 'Accrual',
    allocation_method_notes: '',
    net_income: {
      net_income_required_flag: false,
      net_income_known_flag: false,
      annual_net_income: 0,
      net_income_notes: ''
    },
    has_cba: false,
    cba_details: ''
  },
  other_template_inputs: {
    benefit_year: {
      benefit_year_type: 'CalendarYear',
      fiscal_year_start: '',
      fiscal_year_end: '',
      benefit_year_other_text: ''
    },
    access_and_timekeeping: {
      timekeeping_hris_system: 'ADP',
      timekeeping_hris_other_text: '',
      hours_and_leave_balance_access: 'Portal',
      hours_and_leave_balance_access_other_text: '',
      meal_break_recording_required_nonexempt: 'NotSure'
    },
    sick_leave_company_practice: {
      sick_leave_grant_method: 'Accrual',
      sick_leave_waiting_period: 'None',
      sick_leave_waiting_period_other_text: '',
      sick_leave_min_increment: '1Hour',
      sick_leave_min_increment_other_text: '',
      sick_leave_carryover_approach: 'CarryOverWithCap',
      sick_leave_carryover_cap_hours: 0,
      sick_leave_payout_at_separation: 'Never'
    },
    leave_notice_procedures: {
      foreseeable_leave_notice_method: 'UseCallOutOnly',
      foreseeable_leave_notice_method_other_text: '',
      foreseeable_leave_notice_timing: 'AsSoonAsPracticable',
      foreseeable_leave_notice_x_days: 0,
      fmla_min_leave_increment: '1Hour'
    },
    pay_practices: {
      workweek_definition: 'SundayToSaturday',
      workweek_start_time: '',
      workweek_definition_other_text: '',
      overtime_approval_rule: 'PreApprovalRequired',
      overtime_workday_start_time: '',
      payroll_deductions_authorization: 'WrittenAuthorizationRequired',
      payroll_deductions_authorization_other_text: ''
    },
    leave_and_conduct: {
      consecutive_absence_days: 0
    },
    smoking_vaping: {
      smoking_vaping_policy: 'CompletelySmokeFreeIncludingVaping',
      smoking_vaping_policy_other_text: '',
      designated_area_description: ''
    },
    safety_emergency: {
      emergency_closure_communication_method: 'Email',
      emergency_closure_other_text: '',
      emergency_hotline_number: '',
      emergency_system_name_or_link: '',
      inclement_weather_reporting_method: 'SameAsEmergencyMethod',
      inclement_weather_other_text: '',
      inclement_weather_hotline_number: ''
    },
    accommodations: {
      accommodation_request_channel: 'HREmail',
      accommodation_request_channel_other_text: '',
      medical_documentation_handling: 'HROnly'
    },
    dispute_resolution: {
      internal_complaint_escalation_path: 'SupervisorToHR',
      internal_complaint_escalation_other_text: '',
      arbitration_policy_in_place: 'NotSure',
      arbitration_questions_contact: ''
    }
  },
  core_operating_facts: {
    employee_relations_contacts: '',
    hours_of_operation: '',
    pay_frequency: 'Biweekly',
    pay_frequency_other: '',
    payday_description: '',
    dress_code: ''
  },
  pto_and_holidays: {
    pto_offered_flag: false,
    pto_program_type: 'CombinedPTO',
    pto_program_type_other: '',
    pto_eligibility: 'FTOnly',
    pto_eligibility_other: '',
    pto_amount_or_rate: '',
    pto_carryover_policy: '',
    pto_waiting_period: 'None',
    pto_waiting_period_other: '',
    vacation_request_procedure: '',
    holiday_schedule: [],
    holiday_schedule_other_text: '',
    holiday_list_text: '',
    holiday_business_closed_flag: false,
    closed_holidays_list: '',
    holiday_pay_practice: '',
    bereavement_leave_days: 0,
    floating_holiday_schedule: ''
  },
  special_modules: {
    company_vehicles_flag: false,
    vehicle_policy_notes: '',
    travel_required_flag: false,
    expense_reimbursement_process: '',
    expense_policy_exists_flag: false,
    ethics_hotline_flag: false,
    ethics_hotline_details: ''
  },
  uploads: {
    cba_upload: null,
    vehicle_policy_upload: null,
    travel_policy_upload: null,
    expense_policy_upload: null,
    existing_handbook_upload: null,
    additional_policies_upload: null
  },
  contact_directory: {
    ceo_president_owner: { ...EMPTY_CONTACT },
    general_counsel: { ...EMPTY_CONTACT },
    accounting_department: { ...EMPTY_CONTACT },
    benefits_representative: { ...EMPTY_CONTACT },
    eap: { ...EMPTY_CONTACT },
    hotline: { ...EMPTY_CONTACT },
    human_resources: { ...EMPTY_CONTACT },
    media_contact: { ...EMPTY_CONTACT },
    receptionist: { ...EMPTY_CONTACT },
    security: { ...EMPTY_CONTACT },
    travel_department: { ...EMPTY_CONTACT },
  },
  certification: {
    certification_acknowledgment: false,
    submitted_at_iso: '',
    additional_notes: ''
  }
};

export const STEPS = [
  { id: 1, title: 'Company Identity' },
  { id: 2, title: 'Designated Contacts' },
  { id: 3, title: 'Workforce Counts' },
  { id: 4, title: 'Work Locations (On-site)' },
  { id: 5, title: 'Remote Employees' },
  { id: 6, title: 'Employees Outside U.S.' },
  { id: 7, title: 'Locality Triggers' },
  { id: 8, title: 'Sick Leave Allocation' },
  { id: 9, title: 'Net Income', conditional: (data: IntakeData) => data.locality_triggers.nyc_employee_flag },
  { id: 10, title: 'Other Template Inputs' },
  { id: 11, title: 'Union / CBA' },
  { id: 12, title: 'Core Operating Facts' },
  { id: 13, title: 'PTO + Holidays' },
  { id: 14, title: 'Special Modules' },
  { id: 15, title: 'Contact Directory' },
  { id: 16, title: 'Uploads + Certification' },
  { id: 17, title: 'Review & Submit' }
];
