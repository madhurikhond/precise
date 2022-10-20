export enum patientPortalResponseStatus{
  Success = 'Success',
  Fail = 'Fail',
}

export enum LanguageOption {
  EN = 'en',
  ES = 'es',
}

export enum PageTitleOption {
  MOBILE_VERIFICATION = 'Mobile Verification',
  PATIENT_PORTAL = "Patient Portal",
  PATIENT_DASHBOARD = "Dashboard",
  PATIENT_BASIC_CONTACT_INFO = "Patient Basic Contact Info",
  PATIENT_CODE_VERIFICATION = "Patient Code Verification",
  MULTIPLE_RECORD_FOUND = "Multiple Record Found",
  PATIENT_ADDRESS_CONTACT_INFO = "Patient Address Contact Info",
  PATIENT_CONTACT_INFO = "Patient Contact Info",
  PATIENT_EMERGENCY_CONTACT_INFO = "Patient Emergency Contact Info",
  PATIENT_ATTORNEY_CONTACT_INFO = "Patient Attorney Contact Info",
  PRE_SCREENING_QUESTION = "Pre Screening Question",
  PATIENT_HOME = "Patient Home",
  MY_APPOINTMENT = 'My Appointment',
  EXAM_QUESTION = "Exam Question",
  EXAM_QUESTION_FOR_US = "Exam Question For Us", 
  EXAM_QUESTION_FOR_CT_CR = "Exam Question For CT CR"
}

export enum PatientPortalStatusMessage {
  COMMON_ERROR = 'Request Failed',
  NO_FURTHER_STUDY_ADDED = "No further study added.",
  PREGNANACY_LEAN_DOWNLOADED = "File Download Successfully.",
  CONTACT_INFO_REQUIRED_ERROR = 'Please fill contact info first.',
  NO_PHONE_NUMBER_FOUND = 'No Phone number found.',
  INVALID_CODE= "Invalid code. Click to resend code.",
  PHONE_NUMBER_NOT_REGISTERED = "Phone number is not registered.",
  CODE_SENT_SUCCESS = "Code sent successfully.",
  PATIENT_MODALITY_PREP_UPDATED = "Patient modality prep updated.",
  NO_PATIENT_MODALITY_PREP_FOUND = "No Patient modality prep found."
}
export enum PatientFinancialTypeName {
  BROKER = "BROKER",
  PERSONAL_INJURY = "PERSONAL INJURY"
}

export enum PatientPortalURLName{
  ESIGN_REQUEST = "/patient/esignrequest",
  ESIGN_REQUESTS = "/patient/esignrequests",
  PATIENT_PORTAL = "/patient-portal",
  PATIENT_BASIC_CONTACT_INFO = "/patient-basic-contact-info",
  PATIENT_CODE_VERIFICATION = "/patient-code-verification",
  MULTIPLE_RECORD_FOUND = "/multiple-record-found",
  PATIENT_ADDRESS_CONTACT_INFO = "/patient-address-contact-info",
  PATIENT_CONTACT_INFO = "/patient-contact-info",
  PATIENT_EMERGENCY_CONTACT_INFO = "/patient-emergency-contact-info",
  PATIENT_ATTORNEY_CONTACT_INFO = "/patient-attorney-contact-info",
  PRE_SCREENING_QUESTION = "/pre-screening-question",
  PATIENT_HOME = "/patient-home",
  MY_APPOINTMENT = '/my-appointment',
  PATIENT_DASHBOARD = "/patient-dashboard",
  EXAM_QUESTION = "/exam-question",
  EXAM_QUESTION_FOR_US = "/exam-question-for-us", 
  EXAM_QUESTION_FOR_CT_CR = "/exam-question-for-ct-cr",
  PREGNANCY_WAIVER = "/pregnancy-waiver",
  PREGNANCY_WAIVERS = "/pregnancy-waivers"
}

export enum PatientPortalURL{
  ESIGN_REQUEST = "patient/esignrequest",
  ESIGN_REQUESTS = "patient/esignrequests",
  PATIENT_PORTAL = "patient-portal",
  PATIENT_BASIC_CONTACT_INFO = "patient-basic-contact-info",
  PATIENT_CODE_VERIFICATION = "patient-code-verification",
  MULTIPLE_RECORD_FOUND = "multiple-record-found",
  PATIENT_ADDRESS_CONTACT_INFO = "patient-address-contact-info",
  PATIENT_CONTACT_INFO = "patient-contact-info",
  PATIENT_EMERGENCY_CONTACT_INFO = "patient-emergency-contact-info",
  PATIENT_ATTORNEY_CONTACT_INFO = "patient-attorney-contact-info",
  PRE_SCREENING_QUESTION = "pre-screening-question",
  PATIENT_HOME = "patient-home",
  MY_APPOINTMENT = 'my-appointment',
  PATIENT_DASHBOARD = "patient-dashboard",
  EXAM_QUESTION = "exam-question",
  EXAM_QUESTION_FOR_US = "exam-question-for-us", 
  EXAM_QUESTION_FOR_CT_CR = "exam-question-for-ct-cr",
  PREGNANCY_WAIVER = "pregnancy-waiver",
  PREGNANCY_WAIVERS = "pregnancy-waivers"
}

export class patientResponse {
  result: any;
  status: number;
  responseStatus: string;
  exception: any;
}