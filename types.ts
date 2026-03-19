
export interface FileMetadata {
  file_name: string;
  file_type: string;
  file_size: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface OnsiteLocation extends Address {
  location_name: string;
  county: string;
  headcount: number;
  ft_count: number;
  pt_count: number;
}

export interface RemoteLocation {
  city: string;
  state: string;
  zip: string;
  headcount: number;
}

export interface NonUSLocation {
  country: string;
  city_region: string;
  headcount: number;
}

export interface LocalityCount {
  locality_name: string;
  headcount: number;
}

export interface ContactEntry {
  name: string;
  title: string;
  email: string;
  phone: string;
}

export interface IntakeData {
  company_identity: {
    company_legal_name: string;
    company_dba_names: string;
    company_incorporation_state: string;
    company_hq_address: Address;
    primary_contact: {
      name: string;
      title: string;
      email: string;
      phone: string;
    };
  };
  designated_contacts: {
    global_display_preference: 'TitleOnly' | 'NameAndTitle' | 'NameOnly';
    publish_channels: string[];
    hr_default_contact: {
      contact_type: 'TitleOnly' | 'SpecificPerson';
      title_or_department: string;
      person_name: string;
      email: string;
      phone: string;
      mailing_address: string;
      portal_url: string;
      special_instructions: string;
    };
    leave_administration_contact: {
      relationship_to_hr_default: 'SameAsHRDefault' | 'DifferentInternal' | 'OutsourcedTPA';
      display_style: 'TitleOnly' | 'NameAndTitle';
      org_or_vendor_name: string;
      person_name: string;
      email: string;
      phone: string;
      portal_url: string;
      mailing_or_fax: string;
      special_instructions: string;
    };
    attendance_call_out: {
      call_out_method: 'NotifySupervisor' | 'AbsenceLine' | 'EmailInbox' | 'SystemPortal' | 'Other';
      absence_line_phone: string;
      designated_email_inbox: string;
      system_name_and_link: string;
      required_timing: string;
      other_method_description: string;
    };
    ethics_whistleblower: {
      reporting_configuration: 'SameAsHRDefault' | 'DifferentInternal' | 'HotlineOrPortalOnly' | 'BothPersonAndHotline';
      display_style: 'TitleOnly' | 'NameAndTitle';
      title_or_department: string;
      person_name: string;
      email: string;
      phone: string;
      hotline_or_portal: string;
      anonymous_reporting_allowed: boolean;
      special_instructions: string;
    };
    harassment_discrimination_complaints: {
      configuration: 'SameAsHRDefault' | 'DifferentPrimaryAndAlternate' | 'HotlineOrPortalPlusHRAlternate';
      primary_recipient: {
        display_style: 'TitleOnly' | 'NameAndTitle';
        title_or_department: string;
        person_name: string;
        email: string;
        phone: string;
      };
      alternate_recipient: {
        display_style: 'TitleOnly' | 'NameAndTitle';
        title_or_department: string;
        person_name: string;
        email: string;
        phone: string;
      };
      hotline_or_portal_optional: string;
    };
    authorized_representative_handbook_changes: {
      authorized_rep_option: 'CEOorPresidentTitleOnly' | 'OwnerOrManagingMemberTitleOnly' | 'OtherExecutiveTitleOnly' | 'NamedPerson';
      other_executive_title: string;
      named_person_name_and_title: string;
    };
    written_notice_recipient: {
      recipient_basis: 'SameAsHRDefault' | 'SameAsLeaveAdmin' | 'Different';
      recipient_details: string;
      accepted_delivery_methods: string[];
      delivery_method_details: string;
    };
  };
  workforce_counts: {
    total_employees: number;
    full_time_employees: number;
    part_time_employees: number;
    full_time_hours_per_week: number;
    seasonal_employees_flag: boolean;
    seasonal_employee_details: string;
    temp_staff_flag: boolean;
    temp_staff_details: string;
  };
  work_locations: {
    onsite_locations: OnsiteLocation[];
    remote_flag: boolean;
    remote_locations: RemoteLocation[];
    non_us_flag: boolean;
    non_us_locations: NonUSLocation[];
  };
  locality_triggers: {
    nyc_employee_flag: boolean;
    other_localities_present: boolean;
    other_localities_selected: string[];
    other_localities_other_text: string;
    locality_counts: LocalityCount[];
  };
  selection_inputs: {
    employee_threshold_basis: 'TotalEmployees';
    allocation_method_choice: 'Accrual' | 'LumpSum' | 'NotSure';
    allocation_method_notes: string;
    net_income: {
      net_income_required_flag: boolean;
      net_income_known_flag: boolean;
      annual_net_income: number;
      net_income_notes: string;
    };
    has_cba: boolean;
    cba_details: string;
  };
  other_template_inputs: {
    benefit_year: {
      benefit_year_type: 'CalendarYear' | 'FiscalYear' | 'AnniversaryYear' | 'Other';
      fiscal_year_start: string;
      fiscal_year_end: string;
      benefit_year_other_text: string;
    };
    access_and_timekeeping: {
      timekeeping_hris_system: 'ADP' | 'UKG' | 'Workday' | 'Paychex' | 'Rippling' | 'Paycom' | 'BambooHR' | 'NoneManual' | 'Other';
      timekeeping_hris_other_text: string;
      hours_and_leave_balance_access: 'Portal' | 'Paystubs' | 'Both' | 'Other';
      hours_and_leave_balance_access_other_text: string;
      meal_break_recording_required_nonexempt: 'Yes' | 'No' | 'NotSure';
    };
    sick_leave_company_practice: {
      sick_leave_grant_method: 'Accrual' | 'LumpSum' | 'Hybrid' | 'LegalMinimumOnly';
      sick_leave_waiting_period: 'None' | '30Days' | '60Days' | '90Days' | 'Other' | 'FollowLegalOnly';
      sick_leave_waiting_period_other_text: string;
      sick_leave_min_increment: '1Hour' | '30Minutes' | '15Minutes' | 'Other' | 'FollowLegalOnly';
      sick_leave_min_increment_other_text: string;
      sick_leave_carryover_approach: 'CarryOverWithCap' | 'CarryOverNoCap' | 'NoCarryoverFrontloadResets' | 'FollowLegalOnly';
      sick_leave_carryover_cap_hours: number;
      sick_leave_payout_at_separation: 'Never' | 'LegalOnly' | 'Always' | 'CaseByCase';
    };
    leave_notice_procedures: {
      foreseeable_leave_notice_method: 'UseCallOutOnly' | 'SupervisorThenHR' | 'HRThenSupervisor' | 'Portal' | 'Other';
      foreseeable_leave_notice_method_other_text: string;
      foreseeable_leave_notice_timing: 'AsSoonAsPracticable' | 'XDaysInAdvance' | 'PerSchedulingPolicy' | 'FollowLegalOnly';
      foreseeable_leave_notice_x_days: number;
    };
    pay_practices: {
      workweek_definition: 'SundayToSaturday' | 'MondayToSunday' | 'Other';
      workweek_definition_other_text: string;
      overtime_approval_rule: 'PreApprovalRequired' | 'PreApprovalEncouraged' | 'NoPreApprovalButRecordAllHours' | 'NotSure';
      payroll_deductions_authorization: 'WrittenAuthorizationRequired' | 'CaseByCase' | 'Other';
      payroll_deductions_authorization_other_text: string;
    };
    smoking_vaping: {
      smoking_vaping_policy: 'CompletelySmokeFreeIncludingVaping' | 'DesignatedOutdoorAreasOnly' | 'OffsiteOnly' | 'Other';
      smoking_vaping_policy_other_text: string;
      designated_area_description: string;
    };
    safety_emergency: {
      emergency_closure_communication_method: 'TextAlerts' | 'Email' | 'IntranetPortal' | 'SupervisorCallTree' | 'Hotline' | 'Other';
      emergency_closure_other_text: string;
      emergency_hotline_number: string;
      emergency_system_name_or_link: string;
      inclement_weather_reporting_method: 'SameAsEmergencyMethod' | 'Hotline' | 'ManagerInstruction' | 'Other';
      inclement_weather_other_text: string;
      inclement_weather_hotline_number: string;
    };
    accommodations: {
      accommodation_request_channel: 'HREmail' | 'HRPortal' | 'ManagerInitiatesThenHR' | 'Other';
      accommodation_request_channel_other_text: string;
      medical_documentation_handling: 'HROnly' | 'TPAOnly' | 'HRAndTPA' | 'NotSure';
    };
    dispute_resolution: {
      internal_complaint_escalation_path: 'SupervisorToHR' | 'HRDirectly' | 'HotlineToHRFollowUp' | 'Other';
      internal_complaint_escalation_other_text: string;
      arbitration_policy_in_place: 'Yes' | 'No' | 'NotSure';
      arbitration_questions_contact: string;
    };
  };
  core_operating_facts: {
    employee_relations_contacts: string;
    hours_of_operation: string;
    pay_frequency: 'Weekly' | 'Biweekly' | 'SemiMonthly' | 'Monthly' | 'Other';
    pay_frequency_other: string;
    payday_description: string;
    dress_code: string;
  };
  pto_and_holidays: {
    pto_offered_flag: boolean;
    pto_program_type: 'CombinedPTO' | 'SeparateVacationAndSick' | 'SickOnly' | 'Other';
    pto_program_type_other: string;
    pto_eligibility: 'FTOnly' | 'FTAndPT' | 'Other';
    pto_eligibility_other: string;
    pto_amount_or_rate: string;
    pto_carryover_policy: string;
    pto_waiting_period: 'None' | '30Days' | '60Days' | '90Days' | 'Other';
    pto_waiting_period_other: string;
    holiday_schedule: string[];
    holiday_schedule_other_text: string;
    holiday_business_closed_flag: boolean;
    closed_holidays_list: string;
    holiday_pay_practice: string;
  };
  special_modules: {
    company_vehicles_flag: boolean;
    vehicle_policy_notes: string;
    travel_required_flag: boolean;
    expense_reimbursement_process: string;
    expense_policy_exists_flag: boolean;
    ethics_hotline_flag: boolean;
    ethics_hotline_details: string;
  };
  uploads: {
    cba_upload: FileMetadata | null;
    vehicle_policy_upload: FileMetadata | null;
    travel_policy_upload: FileMetadata | null;
    expense_policy_upload: FileMetadata | null;
    existing_handbook_upload: FileMetadata | null;
    additional_policies_upload: FileMetadata | null;
  };
  contact_directory: {
    ceo_president_owner: ContactEntry;
    general_counsel: ContactEntry;
    accounting_department: ContactEntry;
    benefits_representative: ContactEntry;
    eap: ContactEntry;
    hotline: ContactEntry;
    human_resources: ContactEntry;
    media_contact: ContactEntry;
    receptionist: ContactEntry;
    security: ContactEntry;
    travel_department: ContactEntry;
  };
  certification: {
    certification_acknowledgment: boolean;
    submitted_at_iso: string;
    additional_notes: string;
  };
}
