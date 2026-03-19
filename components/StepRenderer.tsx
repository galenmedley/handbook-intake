
import React from 'react';
import { IntakeData } from '../types';
import { Input, Select, RadioGroup, RepeatableSection, Checkbox, FileUpload, TextArea, MultiSelect } from './FormFields';
import { US_STATES } from '../constants';
import ReviewSummary from './ReviewSummary';

interface StepRendererProps {
  stepId: number;
  data: IntakeData;
  onChange: (path: string, value: any) => void;
  errors: Record<string, string>;
}

// Fixed SubHeader definition to explicitly include children prop and use React.FC
// This resolves "Property 'children' is missing in type '{}'" errors by ensuring 
// the component is typed correctly for JSX usage.
const SubHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2 mb-6 mt-8 first:mt-0">{children}</h3>
);

const StepRenderer: React.FC<StepRendererProps> = ({ stepId, data, onChange, errors }) => {
  switch (stepId) {
    case 1: // Company Identity
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Company Legal Name" value={data.company_identity.company_legal_name} onChange={(v) => onChange('company_identity.company_legal_name', v)} required error={errors.company_legal_name} />
            <Input label="DBA Names (Optional)" value={data.company_identity.company_dba_names} onChange={(v) => onChange('company_identity.company_dba_names', v)} />
            <Select label="Incorporation State" value={data.company_identity.company_incorporation_state} onChange={(v) => onChange('company_identity.company_incorporation_state', v)} options={US_STATES.map(s => ({ label: s, value: s }))} required error={errors.company_incorporation_state} />
          </div>
          <div className="space-y-4">
            <SubHeader>HQ Address</SubHeader>
            <Input label="Street Address" value={data.company_identity.company_hq_address.street} onChange={(v) => onChange('company_identity.company_hq_address.street', v)} required error={errors.street} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="City" value={data.company_identity.company_hq_address.city} onChange={(v) => onChange('company_identity.company_hq_address.city', v)} required error={errors.city} />
              <Select label="State" value={data.company_identity.company_hq_address.state} onChange={(v) => onChange('company_identity.company_hq_address.state', v)} options={US_STATES.map(s => ({ label: s, value: s }))} required error={errors.hq_state} />
              <Input label="Zip Code" value={data.company_identity.company_hq_address.zip} onChange={(v) => onChange('company_identity.company_hq_address.zip', v)} required error={errors.zip} />
            </div>
          </div>
          <div className="space-y-4">
            <SubHeader>Primary Contact</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" value={data.company_identity.primary_contact.name} onChange={(v) => onChange('company_identity.primary_contact.name', v)} required error={errors.pname} />
              <Input label="Title" value={data.company_identity.primary_contact.title} onChange={(v) => onChange('company_identity.primary_contact.title', v)} required error={errors.ptitle} />
              <Input label="Email" type="email" value={data.company_identity.primary_contact.email} onChange={(v) => onChange('company_identity.primary_contact.email', v)} required error={errors.pemail} />
              <Input label="Phone" value={data.company_identity.primary_contact.phone} onChange={(v) => onChange('company_identity.primary_contact.phone', v)} required error={errors.pphone} />
            </div>
          </div>
        </div>
      );

    case 2: // Designated Contacts
      return (
        <div className="space-y-12">
          <div className="bg-indigo-50 p-4 rounded-lg text-sm text-indigo-800 italic">“Title/Department only” is preferred if individual names should not appear in the handbook.</div>
          
          <section>
            <SubHeader>A) Global Preferences</SubHeader>
            <RadioGroup label="Global Display Preference" value={data.designated_contacts.global_display_preference} onChange={(v) => onChange('designated_contacts.global_display_preference', v)} options={[{label:'Title Only',value:'TitleOnly'},{label:'Name/Title',value:'NameAndTitle'},{label:'Name Only',value:'NameOnly'}]} required />
            <div className="mt-6">
              <MultiSelect label="Publish Channels" values={data.designated_contacts.publish_channels} onChange={(v) => onChange('designated_contacts.publish_channels', v)} options={['Email','Phone','MailingAddress','PortalLink','Hotline'].map(c => ({label:c, value:c}))} required error={errors.channels} />
            </div>
          </section>

          <section>
            <SubHeader>B) HR Default Contact</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Contact Type" value={data.designated_contacts.hr_default_contact.contact_type} onChange={(v) => onChange('designated_contacts.hr_default_contact.contact_type', v)} options={[{label:'Title Only',value:'TitleOnly'},{label:'Specific Person',value:'SpecificPerson'}]} required />
              <Input label="Title or Department" value={data.designated_contacts.hr_default_contact.title_or_department} onChange={(v) => onChange('designated_contacts.hr_default_contact.title_or_department', v)} required error={errors.hr_title} />
              {data.designated_contacts.hr_default_contact.contact_type === 'SpecificPerson' && (
                <Input label="Person Name" value={data.designated_contacts.hr_default_contact.person_name} onChange={(v) => onChange('designated_contacts.hr_default_contact.person_name', v)} required error={errors.hr_name} />
              )}
              <Input label="Email" value={data.designated_contacts.hr_default_contact.email} onChange={(v) => onChange('designated_contacts.hr_default_contact.email', v)} />
              <Input label="Phone" value={data.designated_contacts.hr_default_contact.phone} onChange={(v) => onChange('designated_contacts.hr_default_contact.phone', v)} />
              <Input label="Mailing Address" value={data.designated_contacts.hr_default_contact.mailing_address} onChange={(v) => onChange('designated_contacts.hr_default_contact.mailing_address', v)} />
              <Input label="Portal URL" value={data.designated_contacts.hr_default_contact.portal_url} onChange={(v) => onChange('designated_contacts.hr_default_contact.portal_url', v)} />
              <TextArea label="Special Instructions" value={data.designated_contacts.hr_default_contact.special_instructions} onChange={(v) => onChange('designated_contacts.hr_default_contact.special_instructions', v)} />
            </div>
          </section>

          <section>
            <SubHeader>C) Leave Administration Contact</SubHeader>
            <RadioGroup label="Relationship to HR Default" value={data.designated_contacts.leave_administration_contact.relationship_to_hr_default} onChange={(v) => onChange('designated_contacts.leave_administration_contact.relationship_to_hr_default', v)} options={[{label:'Same as HR Default',value:'SameAsHRDefault'},{label:'Different Internal',value:'DifferentInternal'},{label:'Outsourced TPA',value:'OutsourcedTPA'}]} required />
            {data.designated_contacts.leave_administration_contact.relationship_to_hr_default !== 'SameAsHRDefault' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 bg-slate-50 rounded-xl">
                <Select label="Display Style" value={data.designated_contacts.leave_administration_contact.display_style} onChange={(v) => onChange('designated_contacts.leave_administration_contact.display_style', v)} options={[{label:'Title Only',value:'TitleOnly'},{label:'Name and Title',value:'NameAndTitle'}]} required />
                <Input label="Org or Vendor Name" value={data.designated_contacts.leave_administration_contact.org_or_vendor_name} onChange={(v) => onChange('designated_contacts.leave_administration_contact.org_or_vendor_name', v)} required error={errors.leave_org} />
                {data.designated_contacts.leave_administration_contact.display_style === 'NameAndTitle' && (
                  <Input label="Person Name" value={data.designated_contacts.leave_administration_contact.person_name} onChange={(v) => onChange('designated_contacts.leave_administration_contact.person_name', v)} required error={errors.leave_name} />
                )}
                <Input label="Email" value={data.designated_contacts.leave_administration_contact.email} onChange={(v) => onChange('designated_contacts.leave_administration_contact.email', v)} />
                <Input label="Phone" value={data.designated_contacts.leave_administration_contact.phone} onChange={(v) => onChange('designated_contacts.leave_administration_contact.phone', v)} />
                <Input label="Portal URL" value={data.designated_contacts.leave_administration_contact.portal_url} onChange={(v) => onChange('designated_contacts.leave_administration_contact.portal_url', v)} />
                <Input label="Mailing/Fax" value={data.designated_contacts.leave_administration_contact.mailing_or_fax} onChange={(v) => onChange('designated_contacts.leave_administration_contact.mailing_or_fax', v)} />
                <TextArea label="Special Instructions" value={data.designated_contacts.leave_administration_contact.special_instructions} onChange={(v) => onChange('designated_contacts.leave_administration_contact.special_instructions', v)} />
              </div>
            )}
          </section>

          <section>
            <SubHeader>D) Attendance / Call-Out Notice</SubHeader>
            <Select label="Call-Out Method" value={data.designated_contacts.attendance_call_out.call_out_method} onChange={(v) => onChange('designated_contacts.attendance_call_out.call_out_method', v)} options={[{label:'Notify Supervisor',value:'NotifySupervisor'},{label:'Absence Line',value:'AbsenceLine'},{label:'Email Inbox',value:'EmailInbox'},{label:'System Portal',value:'SystemPortal'},{label:'Other',value:'Other'}]} required />
            <div className="mt-6 space-y-4">
              {data.designated_contacts.attendance_call_out.call_out_method === 'AbsenceLine' && <Input label="Absence Line Phone" value={data.designated_contacts.attendance_call_out.absence_line_phone} onChange={(v) => onChange('designated_contacts.attendance_call_out.absence_line_phone', v)} required error={errors.abs_phone} />}
              {data.designated_contacts.attendance_call_out.call_out_method === 'EmailInbox' && <Input label="Email Inbox" value={data.designated_contacts.attendance_call_out.designated_email_inbox} onChange={(v) => onChange('designated_contacts.attendance_call_out.designated_email_inbox', v)} required error={errors.abs_email} />}
              {data.designated_contacts.attendance_call_out.call_out_method === 'SystemPortal' && <Input label="System Name/Link" value={data.designated_contacts.attendance_call_out.system_name_and_link} onChange={(v) => onChange('designated_contacts.attendance_call_out.system_name_and_link', v)} required error={errors.abs_portal} />}
              {data.designated_contacts.attendance_call_out.call_out_method === 'Other' && <Input label="Describe Method" value={data.designated_contacts.attendance_call_out.other_method_description} onChange={(v) => onChange('designated_contacts.attendance_call_out.other_method_description', v)} required error={errors.abs_other} />}
              <Input label="Required Timing (e.g. 1 hour before shift)" value={data.designated_contacts.attendance_call_out.required_timing} onChange={(v) => onChange('designated_contacts.attendance_call_out.required_timing', v)} />
            </div>
          </section>

          <section>
            <SubHeader>E) Ethics / Whistleblower Reporting</SubHeader>
            <Select label="Reporting Configuration" value={data.designated_contacts.ethics_whistleblower.reporting_configuration} onChange={(v) => onChange('designated_contacts.ethics_whistleblower.reporting_configuration', v)} options={[{label:'Same as HR Default',value:'SameAsHRDefault'},{label:'Different Internal',value:'DifferentInternal'},{label:'Hotline/Portal Only',value:'HotlineOrPortalOnly'},{label:'Both Person and Hotline',value:'BothPersonAndHotline'}]} required />
            {data.designated_contacts.ethics_whistleblower.reporting_configuration !== 'SameAsHRDefault' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 bg-slate-50 rounded-xl">
                <Select label="Display Style" value={data.designated_contacts.ethics_whistleblower.display_style} onChange={(v) => onChange('designated_contacts.ethics_whistleblower.display_style', v)} options={[{label:'Title Only',value:'TitleOnly'},{label:'Name and Title',value:'NameAndTitle'}]} required />
                <Input label="Title or Department" value={data.designated_contacts.ethics_whistleblower.title_or_department} onChange={(v) => onChange('designated_contacts.ethics_whistleblower.title_or_department', v)} />
                {data.designated_contacts.ethics_whistleblower.display_style === 'NameAndTitle' && (
                  <Input label="Person Name" value={data.designated_contacts.ethics_whistleblower.person_name} onChange={(v) => onChange('designated_contacts.ethics_whistleblower.person_name', v)} required error={errors.ethics_name} />
                )}
                <Input label="Email" value={data.designated_contacts.ethics_whistleblower.email} onChange={(v) => onChange('designated_contacts.ethics_whistleblower.email', v)} />
                <Input label="Phone" value={data.designated_contacts.ethics_whistleblower.phone} onChange={(v) => onChange('designated_contacts.ethics_whistleblower.phone', v)} />
                {['HotlineOrPortalOnly', 'BothPersonAndHotline'].includes(data.designated_contacts.ethics_whistleblower.reporting_configuration) && (
                  <Input label="Hotline or Portal" value={data.designated_contacts.ethics_whistleblower.hotline_or_portal} onChange={(v) => onChange('designated_contacts.ethics_whistleblower.hotline_or_portal', v)} required error={errors.ethics_hotline} />
                )}
                <TextArea label="Special Instructions" value={data.designated_contacts.ethics_whistleblower.special_instructions} onChange={(v) => onChange('designated_contacts.ethics_whistleblower.special_instructions', v)} />
              </div>
            )}
            <div className="mt-4">
              <Checkbox label="Anonymous Reporting Allowed" checked={data.designated_contacts.ethics_whistleblower.anonymous_reporting_allowed} onChange={(v) => onChange('designated_contacts.ethics_whistleblower.anonymous_reporting_allowed', v)} />
            </div>
          </section>

          <section>
            <SubHeader>F) Harassment / Discrimination Complaints</SubHeader>
            <Select label="Configuration" value={data.designated_contacts.harassment_discrimination_complaints.configuration} onChange={(v) => onChange('designated_contacts.harassment_discrimination_complaints.configuration', v)} options={[{label:'Same as HR Default',value:'SameAsHRDefault'},{label:'Primary & Alternate Recipients',value:'DifferentPrimaryAndAlternate'},{label:'Hotline + HR Alternate',value:'HotlineOrPortalPlusHRAlternate'}]} required />
            {data.designated_contacts.harassment_discrimination_complaints.configuration !== 'SameAsHRDefault' && (
              <div className="space-y-6 mt-6 p-6 bg-slate-50 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="font-bold text-xs text-indigo-600 uppercase">Primary Recipient</p>
                    <Select label="Display Style" value={data.designated_contacts.harassment_discrimination_complaints.primary_recipient.display_style} onChange={(v) => onChange('designated_contacts.harassment_discrimination_complaints.primary_recipient.display_style', v)} options={[{label:'Title Only',value:'TitleOnly'},{label:'Name and Title',value:'NameAndTitle'}]} required />
                    <Input label="Title or Dept" value={data.designated_contacts.harassment_discrimination_complaints.primary_recipient.title_or_department} onChange={(v) => onChange('designated_contacts.harassment_discrimination_complaints.primary_recipient.title_or_department', v)} required error={errors.har_p_title} />
                    {data.designated_contacts.harassment_discrimination_complaints.primary_recipient.display_style === 'NameAndTitle' && <Input label="Person Name" value={data.designated_contacts.harassment_discrimination_complaints.primary_recipient.person_name} onChange={(v) => onChange('designated_contacts.harassment_discrimination_complaints.primary_recipient.person_name', v)} required error={errors.har_p_name} />}
                    <Input label="Email" value={data.designated_contacts.harassment_discrimination_complaints.primary_recipient.email} onChange={(v) => onChange('designated_contacts.harassment_discrimination_complaints.primary_recipient.email', v)} />
                  </div>
                  <div className="space-y-4">
                    <p className="font-bold text-xs text-indigo-600 uppercase">Alternate Recipient</p>
                    <Select label="Display Style" value={data.designated_contacts.harassment_discrimination_complaints.alternate_recipient.display_style} onChange={(v) => onChange('designated_contacts.harassment_discrimination_complaints.alternate_recipient.display_style', v)} options={[{label:'Title Only',value:'TitleOnly'},{label:'Name and Title',value:'NameAndTitle'}]} required />
                    <Input label="Title or Dept" value={data.designated_contacts.harassment_discrimination_complaints.alternate_recipient.title_or_department} onChange={(v) => onChange('designated_contacts.alternate_recipient.title_or_department', v)} required error={errors.har_a_title} />
                    {data.designated_contacts.harassment_discrimination_complaints.alternate_recipient.display_style === 'NameAndTitle' && <Input label="Person Name" value={data.designated_contacts.harassment_discrimination_complaints.alternate_recipient.person_name} onChange={(v) => onChange('designated_contacts.alternate_recipient.person_name', v)} required error={errors.har_a_name} />}
                    <Input label="Email" value={data.designated_contacts.harassment_discrimination_complaints.alternate_recipient.email} onChange={(v) => onChange('designated_contacts.alternate_recipient.email', v)} />
                  </div>
                </div>
                <Input label="Hotline or Portal (Optional)" value={data.designated_contacts.harassment_discrimination_complaints.hotline_or_portal_optional} onChange={(v) => onChange('designated_contacts.harassment_discrimination_complaints.hotline_or_portal_optional', v)} />
              </div>
            )}
          </section>

          <section>
            <SubHeader>G) Authorized Representative</SubHeader>
            <Select label="Authorized Representative Option" value={data.designated_contacts.authorized_representative_handbook_changes.authorized_rep_option} onChange={(v) => onChange('designated_contacts.authorized_representative_handbook_changes.authorized_rep_option', v)} options={[{label:'CEO or President (Title Only)',value:'CEOorPresidentTitleOnly'},{label:'Owner or Managing Member (Title Only)',value:'OwnerOrManagingMemberTitleOnly'},{label:'Other Executive (Title Only)',value:'OtherExecutiveTitleOnly'},{label:'Named Person',value:'NamedPerson'}]} required />
            <div className="mt-6">
              {data.designated_contacts.authorized_representative_handbook_changes.authorized_rep_option === 'OtherExecutiveTitleOnly' && <Input label="Executive Title" value={data.designated_contacts.authorized_representative_handbook_changes.other_executive_title} onChange={(v) => onChange('designated_contacts.authorized_representative_handbook_changes.other_executive_title', v)} required error={errors.auth_title} />}
              {data.designated_contacts.authorized_representative_handbook_changes.authorized_rep_option === 'NamedPerson' && <Input label="Name and Title" value={data.designated_contacts.authorized_representative_handbook_changes.named_person_name_and_title} onChange={(v) => onChange('designated_contacts.authorized_representative_handbook_changes.named_person_name_and_title', v)} required error={errors.auth_name} />}
            </div>
          </section>

          <section>
            <SubHeader>H) Written Notice Recipient</SubHeader>
            <Select label="Recipient Basis" value={data.designated_contacts.written_notice_recipient.recipient_basis} onChange={(v) => onChange('designated_contacts.written_notice_recipient.recipient_basis', v)} options={[{label:'Same as HR Default',value:'SameAsHRDefault'},{label:'Same as Leave Admin',value:'SameAsLeaveAdmin'},{label:'Different',value:'Different'}]} required />
            {data.designated_contacts.written_notice_recipient.recipient_basis === 'Different' && (
              <div className="mt-6 space-y-4">
                <TextArea label="Recipient Details" value={data.designated_contacts.written_notice_recipient.recipient_details} onChange={(v) => onChange('designated_contacts.written_notice_recipient.recipient_details', v)} required error={errors.write_details} />
                <MultiSelect label="Accepted Delivery Methods" values={data.designated_contacts.written_notice_recipient.accepted_delivery_methods} onChange={(v) => onChange('designated_contacts.written_notice_recipient.accepted_delivery_methods', v)} options={['Email','PortalUpload','MailingAddress','Fax'].map(c => ({label:c, value:c}))} required error={errors.write_methods} />
                <Input label="Delivery Method Details (Optional)" value={data.designated_contacts.written_notice_recipient.delivery_method_details} onChange={(v) => onChange('designated_contacts.written_notice_recipient.delivery_method_details', v)} />
              </div>
            )}
          </section>
        </div>
      );

    case 3: // Counts
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Total Employees" type="number" value={data.workforce_counts.total_employees} onChange={(v) => onChange('workforce_counts.total_employees', parseInt(v)||0)} required error={errors.total} />
            <Input label="Full-Time" type="number" value={data.workforce_counts.full_time_employees} onChange={(v) => onChange('workforce_counts.full_time_employees', parseInt(v)||0)} required />
            <Input label="Part-Time" type="number" value={data.workforce_counts.part_time_employees} onChange={(v) => onChange('workforce_counts.part_time_employees', parseInt(v)||0)} required />
            <Input label="Full-Time Defined As (hrs/week)" type="number" value={data.workforce_counts.full_time_hours_per_week} onChange={(v) => onChange('workforce_counts.full_time_hours_per_week', parseInt(v)||40)} helperText="Hours/week threshold for full-time classification" />
          </div>
          <div className="space-y-6">
            <RadioGroup label="Seasonal Employees?" value={data.workforce_counts.seasonal_employees_flag} onChange={(v) => onChange('workforce_counts.seasonal_employees_flag', v)} options={[{label:'Yes',value:true},{label:'No',value:false}]} inline required />
            {data.workforce_counts.seasonal_employees_flag && <TextArea label="Seasonal Details" value={data.workforce_counts.seasonal_employee_details} onChange={(v) => onChange('workforce_counts.seasonal_employee_details', v)} required error={errors.seasonal} />}
            
            <RadioGroup label="Temporary Staff?" value={data.workforce_counts.temp_staff_flag} onChange={(v) => onChange('workforce_counts.temp_staff_flag', v)} options={[{label:'Yes',value:true},{label:'No',value:false}]} inline required />
            {data.workforce_counts.temp_staff_flag && <TextArea label="Temp Staff Details" value={data.workforce_counts.temp_staff_details} onChange={(v) => onChange('workforce_counts.temp_staff_details', v)} required error={errors.temp} />}
          </div>
        </div>
      );

    case 4: // Onsite
      return (
        <div className="space-y-6">
          {errors.onsite_locs && <p className="text-rose-500 text-sm font-bold bg-rose-50 p-3 rounded-lg border border-rose-100">{errors.onsite_locs}</p>}
          <RepeatableSection title="On-site Locations" items={data.work_locations.onsite_locations} onAdd={()=>onChange('work_locations.onsite_locations', [...data.work_locations.onsite_locations, {location_name:'',street:'',city:'',state:'',zip:'',county:'',headcount:0,ft_count:0,pt_count:0}])} onRemove={(i)=>onChange('work_locations.onsite_locations', data.work_locations.onsite_locations.filter((_,idx)=>idx!==i))} renderItem={(item,idx)=>(
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Location Name (Optional)" value={item.location_name} onChange={(v)=>{const l=[...data.work_locations.onsite_locations];l[idx].location_name=v;onChange('work_locations.onsite_locations',l);}} />
              <Input label="Street" value={item.street} onChange={(v)=>{const l=[...data.work_locations.onsite_locations];l[idx].street=v;onChange('work_locations.onsite_locations',l);}} required />
              <Input label="City" value={item.city} onChange={(v)=>{const l=[...data.work_locations.onsite_locations];l[idx].city=v;onChange('work_locations.onsite_locations',l);}} required />
              <div className="grid grid-cols-2 gap-2">
                <Select label="State" value={item.state} onChange={(v)=>{const l=[...data.work_locations.onsite_locations];l[idx].state=v;onChange('work_locations.onsite_locations',l);}} options={US_STATES.map(s=>({label:s,value:s}))} required />
                <Input label="Zip" value={item.zip} onChange={(v)=>{const l=[...data.work_locations.onsite_locations];l[idx].zip=v;onChange('work_locations.onsite_locations',l);}} required />
              </div>
              <Input label="County (Optional)" value={item.county} onChange={(v)=>{const l=[...data.work_locations.onsite_locations];l[idx].county=v;onChange('work_locations.onsite_locations',l);}} />
              <Input label="Headcount" type="number" value={item.headcount} onChange={(v)=>{const l=[...data.work_locations.onsite_locations];l[idx].headcount=parseInt(v)||0;onChange('work_locations.onsite_locations',l);}} required />
            </div>
          )} />
        </div>
      );

    case 5: // Remote
      return (
        <div className="space-y-6">
          {errors.locations && <p className="text-rose-500 text-sm font-bold bg-rose-50 p-3 rounded-lg border border-rose-100">{errors.locations}</p>}
          <RadioGroup label="Remote Flag" value={data.work_locations.remote_flag} onChange={(v)=>onChange('work_locations.remote_flag', v)} options={[{label:'Yes',value:true},{label:'No',value:false}]} inline required />
          {data.work_locations.remote_flag && (
            <div className="mt-6">
              {errors.remote_list && <p className="text-rose-500 text-xs mb-2">{errors.remote_list}</p>}
              <RepeatableSection title="Remote Locations" items={data.work_locations.remote_locations} onAdd={()=>onChange('work_locations.remote_locations',[...data.work_locations.remote_locations,{city:'',state:'',zip:'',headcount:0}])} onRemove={(i)=>onChange('work_locations.remote_locations',data.work_locations.remote_locations.filter((_,idx)=>idx!==i))} renderItem={(item,idx)=>(
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label="City" value={item.city} onChange={(v)=>{const l=[...data.work_locations.remote_locations];l[idx].city=v;onChange('work_locations.remote_locations',l);}} required />
                  <Select label="State" value={item.state} onChange={(v)=>{const l=[...data.work_locations.remote_locations];l[idx].state=v;onChange('work_locations.remote_locations',l);}} options={US_STATES.map(s=>({label:s,value:s}))} required />
                  <Input label="Count" type="number" value={item.headcount} onChange={(v)=>{const l=[...data.work_locations.remote_locations];l[idx].headcount=parseInt(v)||0;onChange('work_locations.remote_locations',l);}} required />
                </div>
              )} />
            </div>
          )}
        </div>
      );

    case 6: // Intl
      return (
        <div className="space-y-6">
          <RadioGroup label="Employees Outside U.S.?" value={data.work_locations.non_us_flag} onChange={(v)=>onChange('work_locations.non_us_flag', v)} options={[{label:'Yes',value:true},{label:'No',value:false}]} inline required />
          {data.work_locations.non_us_flag && (
            <div className="mt-6">
              {errors.intl && <p className="text-rose-500 text-xs mb-2">{errors.intl}</p>}
              <RepeatableSection title="International Locations" items={data.work_locations.non_us_locations} onAdd={()=>onChange('work_locations.non_us_locations',[...data.work_locations.non_us_locations,{country:'',city_region:'',headcount:0}])} onRemove={(i)=>onChange('work_locations.non_us_locations',data.work_locations.non_us_locations.filter((_,idx)=>idx!==i))} renderItem={(item,idx)=>(
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label="Country" value={item.country} onChange={(v)=>{const l=[...data.work_locations.non_us_locations];l[idx].country=v;onChange('work_locations.non_us_locations',l);}} required />
                  <Input label="City/Region" value={item.city_region} onChange={(v)=>{const l=[...data.work_locations.non_us_locations];l[idx].city_region=v;onChange('work_locations.non_us_locations',l);}} />
                  <Input label="Count" type="number" value={item.headcount} onChange={(v)=>{const l=[...data.work_locations.non_us_locations];l[idx].headcount=parseInt(v)||0;onChange('work_locations.non_us_locations',l);}} required />
                </div>
              )} />
            </div>
          )}
        </div>
      );

    case 7: // Localities
      return (
        <div className="space-y-6">
          <Checkbox label="NYC Employee(s) Present?" checked={data.locality_triggers.nyc_employee_flag} onChange={(v)=>onChange('locality_triggers.nyc_employee_flag',v)} />
          <div className="mt-6">
            <RadioGroup label="Other Localities Present?" value={data.locality_triggers.other_localities_present} onChange={(v)=>onChange('locality_triggers.other_localities_present',v)} options={[{label:'Yes',value:true},{label:'No',value:false}]} inline required />
          </div>
          {data.locality_triggers.other_localities_present && (
            <div className="mt-6">
              <MultiSelect label="Localities Selected" values={data.locality_triggers.other_localities_selected} onChange={(v)=>onChange('locality_triggers.other_localities_selected',v)} options={['San Francisco','Los Angeles','Chicago','Philadelphia','Other'].map(l=>({label:l,value:l}))} />
              {data.locality_triggers.other_localities_selected.includes('Other') && (
                <div className="mt-4">
                  <Input label="Other Locality Description" value={data.locality_triggers.other_localities_other_text} onChange={(v)=>onChange('locality_triggers.other_localities_other_text',v)} />
                </div>
              )}
              <div className="mt-6">
                {errors.localities && <p className="text-rose-500 text-xs mb-2">{errors.localities}</p>}
                <RepeatableSection title="Locality Headcounts" items={data.locality_triggers.locality_counts} onAdd={()=>onChange('locality_triggers.locality_counts',[...data.locality_triggers.locality_counts,{locality_name:'',headcount:0}])} onRemove={(i)=>onChange('locality_triggers.locality_counts',data.locality_triggers.locality_counts.filter((_,idx)=>idx!==i))} renderItem={(item,idx)=>(
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Locality Name" value={item.locality_name} onChange={(v)=>{const l=[...data.locality_triggers.locality_counts];l[idx].locality_name=v;onChange('locality_triggers.locality_counts',l);}} required />
                    <Input label="Count" type="number" value={item.headcount} onChange={(v)=>{const l=[...data.locality_triggers.locality_counts];l[idx].headcount=parseInt(v)||0;onChange('locality_triggers.locality_counts',l);}} required />
                  </div>
                )} />
              </div>
            </div>
          )}
        </div>
      );

    case 8: // Allocation
      return (
        <div className="space-y-6">
          <RadioGroup label="Allocation Method Choice" value={data.selection_inputs.allocation_method_choice} onChange={(v) => onChange('selection_inputs.allocation_method_choice', v)} options={[{ label: 'Accrual', value: 'Accrual' }, { label: 'Lump Sum', value: 'LumpSum' }, { label: 'Not Sure', value: 'NotSure' }]} required />
          {data.selection_inputs.allocation_method_choice === 'NotSure' && <TextArea label="Explain Allocation Method logic/questions" value={data.selection_inputs.allocation_method_notes} onChange={(v) => onChange('selection_inputs.allocation_method_notes', v)} required error={errors.alloc_notes} />}
        </div>
      );

    case 9: // NYC
      return (
        <div className="space-y-6">
          <RadioGroup label="Is Annual Net Income Known?" value={data.selection_inputs.net_income.net_income_known_flag} onChange={(v) => onChange('selection_inputs.net_income.net_income_known_flag', v)} options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} inline required />
          {data.selection_inputs.net_income.net_income_known_flag ? (
            <Input label="Annual Net Income ($)" type="number" value={data.selection_inputs.net_income.annual_net_income} onChange={(v) => onChange('selection_inputs.net_income.annual_net_income', parseInt(v) || 0)} required error={errors.income} />
          ) : (
            <TextArea label="Net Income Notes" value={data.selection_inputs.net_income.net_income_notes} onChange={(v) => onChange('selection_inputs.net_income.net_income_notes', v)} required error={errors.income_notes} />
          )}
        </div>
      );

    case 10: // Other Template Inputs
      return (
        <div className="space-y-12">
          <section>
            <SubHeader>A) Benefit Year</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Type" value={data.other_template_inputs.benefit_year.benefit_year_type} onChange={(v) => onChange('other_template_inputs.benefit_year.benefit_year_type', v)} options={[{label:'Calendar Year',value:'CalendarYear'},{label:'Fiscal Year',value:'FiscalYear'},{label:'Anniversary Year',value:'AnniversaryYear'},{label:'Other',value:'Other'}]} required error={errors.ben_year_type} />
              {data.other_template_inputs.benefit_year.benefit_year_type === 'FiscalYear' && (
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Fiscal Start" placeholder="MM-DD" value={data.other_template_inputs.benefit_year.fiscal_year_start} onChange={(v) => onChange('other_template_inputs.benefit_year.fiscal_year_start', v)} required error={errors.fisc_start} />
                  <Input label="Fiscal End" placeholder="MM-DD" value={data.other_template_inputs.benefit_year.fiscal_year_end} onChange={(v) => onChange('other_template_inputs.benefit_year.fiscal_year_end', v)} required error={errors.fisc_end} />
                </div>
              )}
              {data.other_template_inputs.benefit_year.benefit_year_type === 'Other' && <Input label="Benefit Year Description" value={data.other_template_inputs.benefit_year.benefit_year_other_text} onChange={(v) => onChange('other_template_inputs.benefit_year.benefit_year_other_text', v)} required error={errors.ben_other_text} />}
            </div>
          </section>

          <section>
            <SubHeader>B) Timekeeping / HRIS</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="System" value={data.other_template_inputs.access_and_timekeeping.timekeeping_hris_system} onChange={(v) => onChange('other_template_inputs.access_and_timekeeping.timekeeping_hris_system', v)} options={['ADP','UKG','Workday','Paychex','Rippling','Paycom','BambooHR','NoneManual','Other'].map(s => ({label:s,value:s}))} required error={errors.hris_system} />
              {data.other_template_inputs.access_and_timekeeping.timekeeping_hris_system === 'Other' && <Input label="Other System Description" value={data.other_template_inputs.access_and_timekeeping.timekeeping_hris_other_text} onChange={(v) => onChange('other_template_inputs.access_and_timekeeping.timekeeping_hris_other_text', v)} required error={errors.hris_other} />}
              <Select label="Hours and Leave Balance Access" value={data.other_template_inputs.access_and_timekeeping.hours_and_leave_balance_access} onChange={(v) => onChange('other_template_inputs.access_and_timekeeping.hours_and_leave_balance_access', v)} options={[{label:'Portal',value:'Portal'},{label:'Paystubs',value:'Paystubs'},{label:'Both',value:'Both'},{label:'Other',value:'Other'}]} required error={errors.balance_access} />
              {data.other_template_inputs.access_and_timekeeping.hours_and_leave_balance_access === 'Other' && <Input label="Description" value={data.other_template_inputs.access_and_timekeeping.hours_and_leave_balance_access_other_text} onChange={(v) => onChange('other_template_inputs.access_and_timekeeping.hours_and_leave_balance_access_other_text', v)} required error={errors.balance_other} />}
              <RadioGroup label="Meal Break Recording (Non-Exempt)?" value={data.other_template_inputs.access_and_timekeeping.meal_break_recording_required_nonexempt} onChange={(v) => onChange('other_template_inputs.access_and_timekeeping.meal_break_recording_required_nonexempt', v)} options={[{label:'Yes',value:'Yes'},{label:'No',value:'No'},{label:'Not Sure',value:'NotSure'}]} required inline />
            </div>
          </section>

          <section>
            <SubHeader>C) Sick Leave Company Practice</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Grant Method" value={data.other_template_inputs.sick_leave_company_practice.sick_leave_grant_method} onChange={(v) => onChange('other_template_inputs.sick_leave_company_practice.sick_leave_grant_method', v)} options={[{label:'Accrual',value:'Accrual'},{label:'Lump Sum',value:'LumpSum'},{label:'Hybrid',value:'Hybrid'},{label:'Legal Minimum Only',value:'LegalMinimumOnly'}]} required error={errors.sick_grant} />
              <Select label="Waiting Period" value={data.other_template_inputs.sick_leave_company_practice.sick_leave_waiting_period} onChange={(v) => onChange('other_template_inputs.sick_leave_company_practice.sick_leave_waiting_period', v)} options={[{label:'None',value:'None'},{label:'30 Days',value:'30Days'},{label:'60 Days',value:'60Days'},{label:'90 Days',value:'90Days'},{label:'Other',value:'Other'},{label:'Follow Legal Only',value:'FollowLegalOnly'}]} required error={errors.sick_wait} />
              {data.other_template_inputs.sick_leave_company_practice.sick_leave_waiting_period === 'Other' && <Input label="Waiting Period Description" value={data.other_template_inputs.sick_leave_company_practice.sick_leave_waiting_period_other_text} onChange={(v) => onChange('other_template_inputs.sick_leave_company_practice.sick_leave_waiting_period_other_text', v)} required error={errors.sick_wait_other} />}
              <Select label="Min Increment" value={data.other_template_inputs.sick_leave_company_practice.sick_leave_min_increment} onChange={(v) => onChange('other_template_inputs.sick_leave_company_practice.sick_leave_min_increment', v)} options={[{label:'1 Hour',value:'1Hour'},{label:'30 Mins',value:'30Minutes'},{label:'15 Mins',value:'15Minutes'},{label:'Other',value:'Other'},{label:'Follow Legal Only',value:'FollowLegalOnly'}]} required />
              {data.other_template_inputs.sick_leave_company_practice.sick_leave_min_increment === 'Other' && <Input label="Min Increment Description" value={data.other_template_inputs.sick_leave_company_practice.sick_leave_min_increment_other_text} onChange={(v) => onChange('other_template_inputs.sick_leave_company_practice.sick_leave_min_increment_other_text', v)} required error={errors.sick_inc_other} />}
              <Select label="Carryover Approach" value={data.other_template_inputs.sick_leave_company_practice.sick_leave_carryover_approach} onChange={(v) => onChange('other_template_inputs.sick_leave_company_practice.sick_leave_carryover_approach', v)} options={[{label:'Carryover with Cap',value:'CarryOverWithCap'},{label:'Carryover No Cap',value:'CarryOverNoCap'},{label:'No Carryover',value:'NoCarryoverFrontloadResets'},{label:'Follow Legal Only',value:'FollowLegalOnly'}]} required error={errors.sick_carry} />
              {data.other_template_inputs.sick_leave_company_practice.sick_leave_carryover_approach === 'CarryOverWithCap' && <Input label="Cap Hours" type="number" value={data.other_template_inputs.sick_leave_company_practice.sick_leave_carryover_cap_hours} onChange={(v) => onChange('other_template_inputs.sick_leave_company_practice.sick_leave_carryover_cap_hours', parseInt(v)||0)} required error={errors.sick_cap} />}
              <Select label="Payout at Separation" value={data.other_template_inputs.sick_leave_company_practice.sick_leave_payout_at_separation} onChange={(v) => onChange('other_template_inputs.sick_leave_company_practice.sick_leave_payout_at_separation', v)} options={[{label:'Never',value:'Never'},{label:'Legal Only',value:'LegalOnly'},{label:'Always',value:'Always'},{label:'Case by Case',value:'CaseByCase'}]} required />
            </div>
          </section>

          <section>
            <SubHeader>D) Foreseeable Leave Notice</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Method" value={data.other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_method} onChange={(v) => onChange('other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_method', v)} options={[{label:'Use Call-Out Method',value:'UseCallOutOnly'},{label:'Supervisor then HR',value:'SupervisorThenHR'},{label:'HR then Supervisor',value:'HRThenSupervisor'},{label:'System Portal',value:'Portal'},{label:'Other',value:'Other'}]} required error={errors.leave_method} />
              {data.other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_method === 'Other' && <Input label="Method Description" value={data.other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_method_other_text} onChange={(v) => onChange('other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_method_other_text', v)} required error={errors.leave_method_other} />}
              <Select label="Timing" value={data.other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_timing} onChange={(v) => onChange('other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_timing', v)} options={[{label:'As Soon As Practicable',value:'AsSoonAsPracticable'},{label:'X Days in Advance',value:'XDaysInAdvance'},{label:'Per Scheduling Policy',value:'PerSchedulingPolicy'},{label:'Follow Legal Only',value:'FollowLegalOnly'}]} required error={errors.leave_timing} />
              {data.other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_timing === 'XDaysInAdvance' && <Input label="X Days" type="number" value={data.other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_x_days} onChange={(v) => onChange('other_template_inputs.leave_notice_procedures.foreseeable_leave_notice_x_days', parseInt(v)||0)} required error={errors.leave_days} />}
            </div>
          </section>

          <section>
            <SubHeader>E) Pay Practices</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Workweek Definition" value={data.other_template_inputs.pay_practices.workweek_definition} onChange={(v) => onChange('other_template_inputs.pay_practices.workweek_definition', v)} options={[{label:'Sunday-Saturday',value:'SundayToSaturday'},{label:'Monday-Sunday',value:'MondayToSunday'},{label:'Other',value:'Other'}]} required error={errors.workweek} />
              {data.other_template_inputs.pay_practices.workweek_definition === 'Other' && <Input label="Workweek Description" value={data.other_template_inputs.pay_practices.workweek_definition_other_text} onChange={(v) => onChange('other_template_inputs.pay_practices.workweek_definition_other_text', v)} required error={errors.workweek_other} />}
              <Select label="Overtime Approval Rule" value={data.other_template_inputs.pay_practices.overtime_approval_rule} onChange={(v) => onChange('other_template_inputs.pay_practices.overtime_approval_rule', v)} options={[{label:'Pre-approval Required',value:'PreApprovalRequired'},{label:'Pre-approval Encouraged',value:'PreApprovalEncouraged'},{label:'Record All Hours (No Pre-approval)',value:'NoPreApprovalButRecordAllHours'},{label:'Not Sure',value:'NotSure'}]} required error={errors.ot_rule} />
              <Select label="Payroll Deductions Auth" value={data.other_template_inputs.pay_practices.payroll_deductions_authorization} onChange={(v) => onChange('other_template_inputs.pay_practices.payroll_deductions_authorization', v)} options={[{label:'Written Required',value:'WrittenAuthorizationRequired'},{label:'Case by Case',value:'CaseByCase'},{label:'Other',value:'Other'}]} required error={errors.deduction} />
              {data.other_template_inputs.pay_practices.payroll_deductions_authorization === 'Other' && <Input label="Deduction Auth Description" value={data.other_template_inputs.pay_practices.payroll_deductions_authorization_other_text} onChange={(v) => onChange('other_template_inputs.pay_practices.payroll_deductions_authorization_other_text', v)} required error={errors.deduction_other} />}
            </div>
          </section>

          <section>
            <SubHeader>F) Smoking / Vaping</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Policy" value={data.other_template_inputs.smoking_vaping.smoking_vaping_policy} onChange={(v) => onChange('other_template_inputs.smoking_vaping.smoking_vaping_policy', v)} options={[{label:'Completely Smoke-Free',value:'CompletelySmokeFreeIncludingVaping'},{label:'Designated Areas Only',value:'DesignatedOutdoorAreasOnly'},{label:'Offsite Only',value:'OffsiteOnly'},{label:'Other',value:'Other'}]} required error={errors.smoke_policy} />
              {data.other_template_inputs.smoking_vaping.smoking_vaping_policy === 'DesignatedOutdoorAreasOnly' && <TextArea label="Designated Area Description" value={data.other_template_inputs.smoking_vaping.designated_area_description} onChange={(v) => onChange('other_template_inputs.smoking_vaping.designated_area_description', v)} />}
              {data.other_template_inputs.smoking_vaping.smoking_vaping_policy === 'Other' && <Input label="Policy Description" value={data.other_template_inputs.smoking_vaping.smoking_vaping_policy_other_text} onChange={(v) => onChange('other_template_inputs.smoking_vaping.smoking_vaping_policy_other_text', v)} required error={errors.smoke_other} />}
            </div>
          </section>

          <section>
            <SubHeader>G) Emergency Closure Communications</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Communication Method" value={data.other_template_inputs.safety_emergency.emergency_closure_communication_method} onChange={(v) => onChange('other_template_inputs.safety_emergency.emergency_closure_communication_method', v)} options={[{label:'Text Alerts',value:'TextAlerts'},{label:'Email',value:'Email'},{label:'Intranet Portal',value:'IntranetPortal'},{label:'Supervisor Call Tree',value:'SupervisorCallTree'},{label:'Hotline',value:'Hotline'},{label:'Other',value:'Other'}]} required error={errors.emerg_method} />
              {data.other_template_inputs.safety_emergency.emergency_closure_communication_method === 'Hotline' && <Input label="Hotline Number" value={data.other_template_inputs.safety_emergency.emergency_hotline_number} onChange={(v) => onChange('other_template_inputs.safety_emergency.emergency_hotline_number', v)} required error={errors.emergency_hotline_number} />}
              {data.other_template_inputs.safety_emergency.emergency_closure_communication_method === 'Other' && <Input label="Method Description" value={data.other_template_inputs.safety_emergency.emergency_closure_other_text} onChange={(v) => onChange('other_template_inputs.safety_emergency.emergency_closure_other_text', v)} required error={errors.emerg_other} />}
              <Input label="Emergency System Name or Link (Optional)" value={data.other_template_inputs.safety_emergency.emergency_system_name_or_link} onChange={(v) => onChange('other_template_inputs.safety_emergency.emergency_system_name_or_link', v)} />
              <Select label="Inclement Weather Reporting" value={data.other_template_inputs.safety_emergency.inclement_weather_reporting_method} onChange={(v) => onChange('other_template_inputs.safety_emergency.inclement_weather_reporting_method', v)} options={[{label:'Same as Emergency',value:'SameAsEmergencyMethod'},{label:'Hotline',value:'Hotline'},{label:'Manager Instruction',value:'ManagerInstruction'},{label:'Other',value:'Other'}]} required />
              {data.other_template_inputs.safety_emergency.inclement_weather_reporting_method === 'Hotline' && <Input label="Weather Hotline Number" value={data.other_template_inputs.safety_emergency.inclement_weather_hotline_number} onChange={(v) => onChange('other_template_inputs.safety_emergency.inclement_weather_hotline_number', v)} required error={errors.inclement_weather_hotline_number} />}
              {data.other_template_inputs.safety_emergency.inclement_weather_reporting_method === 'Other' && <Input label="Reporting Method Description" value={data.other_template_inputs.safety_emergency.inclement_weather_other_text} onChange={(v) => onChange('other_template_inputs.safety_emergency.inclement_weather_other_text', v)} required error={errors.weather_other} />}
            </div>
          </section>

          <section>
            <SubHeader>H) Accommodations Workflow</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Request Channel" value={data.other_template_inputs.accommodations.accommodation_request_channel} onChange={(v) => onChange('other_template_inputs.accommodations.accommodation_request_channel', v)} options={[{label:'HR Email',value:'HREmail'},{label:'HR Portal',value:'HRPortal'},{label:'Manager Initiates',value:'ManagerInitiatesThenHR'},{label:'Other',value:'Other'}]} required error={errors.acc_channel} />
              <Select label="Medical Documentation Handling" value={data.other_template_inputs.accommodations.medical_documentation_handling} onChange={(v) => onChange('other_template_inputs.accommodations.medical_documentation_handling', v)} options={[{label:'HR Only',value:'HROnly'},{label:'TPA Only',value:'TPAOnly'},{label:'HR and TPA',value:'HRAndTPA'},{label:'Not Sure',value:'NotSure'}]} required error={errors.med_docs} />
            </div>
          </section>

          <section>
            <SubHeader>I) Dispute Resolution / Arbitration</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Internal Escalation Path" value={data.other_template_inputs.dispute_resolution.internal_complaint_escalation_path} onChange={(v) => onChange('other_template_inputs.dispute_resolution.internal_complaint_escalation_path', v)} options={[{label:'Supervisor to HR',value:'SupervisorToHR'},{label:'HR Directly',value:'HRDirectly'},{label:'Hotline to HR Follow-Up',value:'HotlineToHRFollowUp'},{label:'Other',value:'Other'}]} required error={errors.disp_path} />
              {data.other_template_inputs.dispute_resolution.internal_complaint_escalation_path === 'Other' && <Input label="Escalation Path Description" value={data.other_template_inputs.dispute_resolution.internal_complaint_escalation_other_text} onChange={(v) => onChange('other_template_inputs.dispute_resolution.internal_complaint_escalation_other_text', v)} required error={errors.disp_path_other} />}
              <RadioGroup label="Arbitration Policy in Place?" value={data.other_template_inputs.dispute_resolution.arbitration_policy_in_place} onChange={(v) => onChange('other_template_inputs.dispute_resolution.arbitration_policy_in_place', v)} options={[{label:'Yes',value:'Yes'},{label:'No',value:'No'},{label:'Not Sure',value:'NotSure'}]} inline required error={errors.disp_arb} />
              {data.other_template_inputs.dispute_resolution.arbitration_policy_in_place === 'Yes' && <Input label="Arbitration Questions Contact" value={data.other_template_inputs.dispute_resolution.arbitration_questions_contact} onChange={(v) => onChange('other_template_inputs.dispute_resolution.arbitration_questions_contact', v)} />}
            </div>
          </section>
        </div>
      );

    case 11: // CBA
      return (
        <div className="space-y-6">
          <RadioGroup label="Collective Bargaining Agreement (CBA)?" value={data.selection_inputs.has_cba} onChange={(v) => onChange('selection_inputs.has_cba', v)} options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} inline required />
          {data.selection_inputs.has_cba && (
            <div className="space-y-6 mt-6 p-6 bg-slate-50 rounded-xl">
              <TextArea label="CBA Details" value={data.selection_inputs.cba_details} onChange={(v) => onChange('selection_inputs.cba_details', v)} required error={errors.cba_details} />
              <FileUpload label="CBA Document Upload (Optional)" metadata={data.uploads.cba_upload} onFileSelect={(v) => onChange('uploads.cba_upload', v)} />
            </div>
          )}
        </div>
      );

    case 12: // Operating Facts
      return (
        <div className="space-y-6">
          <TextArea label="Employee Relations Narrative (Keep high-level)" value={data.core_operating_facts.employee_relations_contacts} onChange={(v) => onChange('core_operating_facts.employee_relations_contacts', v)} required error={errors.er_contacts} />
          <TextArea label="Hours of Operation" value={data.core_operating_facts.hours_of_operation} onChange={(v) => onChange('core_operating_facts.hours_of_operation', v)} required error={errors.hours_op} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select label="Pay Frequency" value={data.core_operating_facts.pay_frequency} onChange={(v) => onChange('core_operating_facts.pay_frequency', v)} options={[{label:'Weekly',value:'Weekly'},{label:'Biweekly',value:'Biweekly'},{label:'Semi-Monthly',value:'SemiMonthly'},{label:'Monthly',value:'Monthly'},{label:'Other',value:'Other'}]} required error={errors.pay_freq} />
            {data.core_operating_facts.pay_frequency === 'Other' && <Input label="Description" value={data.core_operating_facts.pay_frequency_other} onChange={(v) => onChange('core_operating_facts.pay_frequency_other', v)} required error={errors.pay_freq_other} />}
            <Input label="Payday Description (e.g. Every Friday)" value={data.core_operating_facts.payday_description} onChange={(v) => onChange('core_operating_facts.payday_description', v)} required error={errors.payday_desc} />
          </div>
          <TextArea label="Dress Code" value={data.core_operating_facts.dress_code} onChange={(v) => onChange('core_operating_facts.dress_code', v)} required error={errors.dress} />
        </div>
      );

    case 13: // PTO + Holidays
      return (
        <div className="space-y-12">
          <section>
            <RadioGroup label="PTO Offered?" value={data.pto_and_holidays.pto_offered_flag} onChange={(v) => onChange('pto_and_holidays.pto_offered_flag', v)} options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} inline required />
            {data.pto_and_holidays.pto_offered_flag && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 bg-slate-50 rounded-xl">
                <Select label="Program Type" value={data.pto_and_holidays.pto_program_type} onChange={(v) => onChange('pto_and_holidays.pto_program_type', v)} options={[{label:'Combined PTO',value:'CombinedPTO'},{label:'Vacation/Sick Separate',value:'SeparateVacationAndSick'},{label:'Sick Only',value:'SickOnly'},{label:'Other',value:'Other'}]} required error={errors.pto_type} />
                {data.pto_and_holidays.pto_program_type === 'Other' && <Input label="PTO Type Description" value={data.pto_and_holidays.pto_program_type_other} onChange={(v) => onChange('pto_and_holidays.pto_program_type_other', v)} required error={errors.pto_type_other} />}
                <Select label="Eligibility" value={data.pto_and_holidays.pto_eligibility} onChange={(v) => onChange('pto_and_holidays.pto_eligibility', v)} options={[{label:'FT Only',value:'FTOnly'},{label:'FT and PT',value:'FTAndPT'},{label:'Other',value:'Other'}]} required error={errors.pto_elig} />
                {data.pto_and_holidays.pto_eligibility === 'Other' && <Input label="Eligibility Description" value={data.pto_and_holidays.pto_eligibility_other} onChange={(v) => onChange('pto_and_holidays.pto_eligibility_other', v)} required error={errors.pto_elig_other} />}
                <TextArea label="Amount or Rate Description" value={data.pto_and_holidays.pto_amount_or_rate} onChange={(v) => onChange('pto_and_holidays.pto_amount_or_rate', v)} required error={errors.pto_rate} />
                <TextArea label="Carryover Policy" value={data.pto_and_holidays.pto_carryover_policy} onChange={(v) => onChange('pto_and_holidays.pto_carryover_policy', v)} required error={errors.pto_carry} />
                <Select label="Waiting Period" value={data.pto_and_holidays.pto_waiting_period} onChange={(v) => onChange('pto_and_holidays.pto_waiting_period', v)} options={[{label:'None',value:'None'},{label:'30 Days',value:'30Days'},{label:'60 Days',value:'60Days'},{label:'90 Days',value:'90Days'},{label:'Other',value:'Other'}]} required error={errors.pto_wait} />
                {data.pto_and_holidays.pto_waiting_period === 'Other' && <Input label="Waiting Period Description" value={data.pto_and_holidays.pto_waiting_period_other} onChange={(v) => onChange('data.pto_and_holidays.pto_waiting_period_other', v)} required error={errors.pto_wait_other} />}
              </div>
            )}
          </section>

          <section>
            <SubHeader>Holidays</SubHeader>
            <MultiSelect label="Holiday Schedule" values={data.pto_and_holidays.holiday_schedule} onChange={(v) => onChange('pto_and_holidays.holiday_schedule', v)} options={['New Year','MLK','Presidents','Memorial','Juneteenth','Independence','Labor','Veterans','Thanksgiving','Christmas','Other'].map(h=>({label:h,value:h}))} required error={errors.hol_sched} />
            {data.pto_and_holidays.holiday_schedule.includes('Other') && (
              <div className="mt-4">
                <Input label="Other Holidays Description" value={data.pto_and_holidays.holiday_schedule_other_text} onChange={(v) => onChange('pto_and_holidays.holiday_schedule_other_text', v)} required error={errors.hol_sched_other} />
              </div>
            )}
            <div className="mt-6">
              <RadioGroup label="Business Closed for Holidays?" value={data.pto_and_holidays.holiday_business_closed_flag} onChange={(v) => onChange('pto_and_holidays.holiday_business_closed_flag', v)} options={[{label:'Yes',value:true},{label:'No',value:false}]} inline required />
              {data.pto_and_holidays.holiday_business_closed_flag && <TextArea label="Closed Holidays List" value={data.pto_and_holidays.closed_holidays_list} onChange={(v) => onChange('pto_and_holidays.closed_holidays_list', v)} required error={errors.hol_list} />}
            </div>
            <div className="mt-6">
              <TextArea label="Holiday Pay Practice (Optional)" value={data.pto_and_holidays.holiday_pay_practice} onChange={(v) => onChange('pto_and_holidays.holiday_pay_practice', v)} />
            </div>
          </section>
        </div>
      );

    case 14: // Special Modules
      return (
        <div className="space-y-12">
          <section>
            <RadioGroup label="Company Vehicles Offered?" value={data.special_modules.company_vehicles_flag} onChange={(v) => onChange('special_modules.company_vehicles_flag', v)} options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} inline required />
            {data.special_modules.company_vehicles_flag && (
              <div className="mt-6 space-y-4 p-6 bg-slate-50 rounded-xl">
                <FileUpload label="Vehicle Policy Upload (Optional)" metadata={data.uploads.vehicle_policy_upload} onFileSelect={(v) => onChange('uploads.vehicle_policy_upload', v)} />
                <TextArea label="Vehicle Policy Notes" value={data.special_modules.vehicle_policy_notes} onChange={(v) => onChange('special_modules.vehicle_policy_notes', v)} />
              </div>
            )}
          </section>

          <section>
            <RadioGroup label="Travel Required for Business?" value={data.special_modules.travel_required_flag} onChange={(v) => onChange('special_modules.travel_required_flag', v)} options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} inline required />
            {data.special_modules.travel_required_flag && (
              <div className="mt-6 p-6 bg-slate-50 rounded-xl">
                <FileUpload label="Travel Policy Upload (Optional)" metadata={data.uploads.travel_policy_upload} onFileSelect={(v) => onChange('uploads.travel_policy_upload', v)} />
              </div>
            )}
          </section>

          <section>
            <SubHeader>Expense Reimbursement</SubHeader>
            <TextArea label="Expense Reimbursement Process" value={data.special_modules.expense_reimbursement_process} onChange={(v) => onChange('special_modules.expense_reimbursement_process', v)} required error={errors.exp_process} />
            <div className="mt-6">
              <RadioGroup label="Separate Expense Policy Exists?" value={data.special_modules.expense_policy_exists_flag} onChange={(v) => onChange('special_modules.expense_policy_exists_flag', v)} options={[{label:'Yes',value:true},{label:'No',value:false}]} inline required />
              {data.special_modules.expense_policy_exists_flag && <div className="mt-4"><FileUpload label="Expense Policy Upload (Optional)" metadata={data.uploads.expense_policy_upload} onFileSelect={(v) => onChange('uploads.expense_policy_upload', v)} /></div>}
            </div>
          </section>

          <section>
            <RadioGroup label="Ethics Hotline / Whistleblower System?" value={data.special_modules.ethics_hotline_flag} onChange={(v) => onChange('special_modules.ethics_hotline_flag', v)} options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} inline required />
            {data.special_modules.ethics_hotline_flag && (
              <div className="mt-6 p-6 bg-slate-50 rounded-xl">
                <TextArea label="Ethics Hotline Details" value={data.special_modules.ethics_hotline_details} onChange={(v) => onChange('special_modules.ethics_hotline_details', v)} required error={errors.eth_details} />
              </div>
            )}
          </section>
        </div>
      );

    case 15: { // Contact Directory
      const cd = data.contact_directory ?? {};
      const e = (key: string) => (cd as any)[key] ?? { name: '', title: '', email: '', phone: '' };
      return (
        <div className="space-y-10">
          <div className="bg-indigo-50 p-4 rounded-lg text-sm text-indigo-800 italic">
            All fields are optional. Information provided will be used to populate the Contact Page and body text throughout the handbook.
          </div>

          <section>
            <SubHeader>CEO / President / Owner</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name" value={e('ceo_president_owner').name} onChange={(v) => onChange('contact_directory.ceo_president_owner.name', v)} />
              <Input label="Title" value={e('ceo_president_owner').title} onChange={(v) => onChange('contact_directory.ceo_president_owner.title', v)} />
              <Input label="Email" type="email" value={e('ceo_president_owner').email} onChange={(v) => onChange('contact_directory.ceo_president_owner.email', v)} />
              <Input label="Phone" value={e('ceo_president_owner').phone} onChange={(v) => onChange('contact_directory.ceo_president_owner.phone', v)} />
            </div>
          </section>

          <section>
            <SubHeader>General Counsel / Legal</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name" value={e('general_counsel').name} onChange={(v) => onChange('contact_directory.general_counsel.name', v)} />
              <Input label="Title" value={e('general_counsel').title} onChange={(v) => onChange('contact_directory.general_counsel.title', v)} />
              <Input label="Email" type="email" value={e('general_counsel').email} onChange={(v) => onChange('contact_directory.general_counsel.email', v)} />
              <Input label="Phone" value={e('general_counsel').phone} onChange={(v) => onChange('contact_directory.general_counsel.phone', v)} />
            </div>
          </section>

          <section>
            <SubHeader>Accounting Department</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name" value={e('accounting_department').name} onChange={(v) => onChange('contact_directory.accounting_department.name', v)} />
              <Input label="Title" value={e('accounting_department').title} onChange={(v) => onChange('contact_directory.accounting_department.title', v)} />
              <Input label="Email" type="email" value={e('accounting_department').email} onChange={(v) => onChange('contact_directory.accounting_department.email', v)} />
              <Input label="Phone" value={e('accounting_department').phone} onChange={(v) => onChange('contact_directory.accounting_department.phone', v)} />
            </div>
          </section>

          <section>
            <SubHeader>Benefits Representative</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name" value={e('benefits_representative').name} onChange={(v) => onChange('contact_directory.benefits_representative.name', v)} />
              <Input label="Title" value={e('benefits_representative').title} onChange={(v) => onChange('contact_directory.benefits_representative.title', v)} />
              <Input label="Email" type="email" value={e('benefits_representative').email} onChange={(v) => onChange('contact_directory.benefits_representative.email', v)} />
              <Input label="Phone" value={e('benefits_representative').phone} onChange={(v) => onChange('contact_directory.benefits_representative.phone', v)} />
            </div>
          </section>

          <section>
            <SubHeader>Employee Assistance Program (EAP)</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name / Organization" value={e('eap').name} onChange={(v) => onChange('contact_directory.eap.name', v)} />
              <Input label="Title" value={e('eap').title} onChange={(v) => onChange('contact_directory.eap.title', v)} />
              <Input label="Email" type="email" value={e('eap').email} onChange={(v) => onChange('contact_directory.eap.email', v)} />
              <Input label="Phone" value={e('eap').phone} onChange={(v) => onChange('contact_directory.eap.phone', v)} />
            </div>
          </section>

          <section>
            <SubHeader>Hotline</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name / Service" value={e('hotline').name} onChange={(v) => onChange('contact_directory.hotline.name', v)} />
              <Input label="Title" value={e('hotline').title} onChange={(v) => onChange('contact_directory.hotline.title', v)} />
              <Input label="Email" type="email" value={e('hotline').email} onChange={(v) => onChange('contact_directory.hotline.email', v)} />
              <Input label="Phone" value={e('hotline').phone} onChange={(v) => onChange('contact_directory.hotline.phone', v)} />
            </div>
          </section>

          <section>
            <SubHeader>Human Resources Department</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name" value={e('human_resources').name} onChange={(v) => onChange('contact_directory.human_resources.name', v)} />
              <Input label="Title" value={e('human_resources').title} onChange={(v) => onChange('contact_directory.human_resources.title', v)} />
              <Input label="Email" type="email" value={e('human_resources').email} onChange={(v) => onChange('contact_directory.human_resources.email', v)} />
              <Input label="Phone" value={e('human_resources').phone} onChange={(v) => onChange('contact_directory.human_resources.phone', v)} />
            </div>
          </section>

          <section>
            <SubHeader>Media Contact</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name" value={e('media_contact').name} onChange={(v) => onChange('contact_directory.media_contact.name', v)} />
              <Input label="Title" value={e('media_contact').title} onChange={(v) => onChange('contact_directory.media_contact.title', v)} />
              <Input label="Email" type="email" value={e('media_contact').email} onChange={(v) => onChange('contact_directory.media_contact.email', v)} />
              <Input label="Phone" value={e('media_contact').phone} onChange={(v) => onChange('contact_directory.media_contact.phone', v)} />
            </div>
          </section>

          <section>
            <SubHeader>Receptionist</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name" value={e('receptionist').name} onChange={(v) => onChange('contact_directory.receptionist.name', v)} />
              <Input label="Title" value={e('receptionist').title} onChange={(v) => onChange('contact_directory.receptionist.title', v)} />
              <Input label="Email" type="email" value={e('receptionist').email} onChange={(v) => onChange('contact_directory.receptionist.email', v)} />
              <Input label="Phone" value={e('receptionist').phone} onChange={(v) => onChange('contact_directory.receptionist.phone', v)} />
            </div>
          </section>

          <section>
            <SubHeader>Security</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name / Department" value={e('security').name} onChange={(v) => onChange('contact_directory.security.name', v)} />
              <Input label="Title" value={e('security').title} onChange={(v) => onChange('contact_directory.security.title', v)} />
              <Input label="Email" type="email" value={e('security').email} onChange={(v) => onChange('contact_directory.security.email', v)} />
              <Input label="Phone" value={e('security').phone} onChange={(v) => onChange('contact_directory.security.phone', v)} />
            </div>
          </section>

          <section>
            <SubHeader>Travel Department</SubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name / Agency" value={e('travel_department').name} onChange={(v) => onChange('contact_directory.travel_department.name', v)} />
              <Input label="Title" value={e('travel_department').title} onChange={(v) => onChange('contact_directory.travel_department.title', v)} />
              <Input label="Email" type="email" value={e('travel_department').email} onChange={(v) => onChange('contact_directory.travel_department.email', v)} />
              <Input label="Phone" value={e('travel_department').phone} onChange={(v) => onChange('contact_directory.travel_department.phone', v)} />
            </div>
          </section>
        </div>
      );
    }

    case 16: // Cert
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload label="Existing Handbook (Optional)" metadata={data.uploads.existing_handbook_upload} onFileSelect={(v)=>onChange('uploads.existing_handbook_upload',v)} />
            <FileUpload label="Additional Policies (Optional)" metadata={data.uploads.additional_policies_upload} onFileSelect={(v)=>onChange('uploads.additional_policies_upload',v)} />
          </div>
          <TextArea label="Additional Notes or Drafting Instructions" value={data.certification.additional_notes} onChange={(v)=>onChange('certification.additional_notes', v)} placeholder="Any special requests or nuances for the draft..." />
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <Checkbox label="I certify that the information provided is accurate and I am authorized to submit these policy drafting inputs." checked={data.certification.certification_acknowledgment} onChange={(v)=>onChange('certification.certification_acknowledgment',v)} required />
            {errors.cert && <div className="mt-2 text-rose-500 text-xs font-bold">{errors.cert}</div>}
          </div>
        </div>
      );

    case 17: // Review
      return <ReviewSummary data={data} onCertChange={(v) => onChange('certification.certification_acknowledgment', v)} />;

    default: return (
      <div className="p-8 text-center bg-rose-50 border border-rose-100 rounded-xl">
        <p className="text-rose-600 font-bold mb-2">Error: Step UI Missing</p>
        <p className="text-sm text-rose-500 italic">Implementation for step ID {stepId} is missing. Please notify the administrator.</p>
      </div>
    );
  }
};

export default StepRenderer;
