export enum PatientPortalStatusCode {
    LIEN_SIGNED = 1,
    PATIENT_BASIC_SCREEN = 2,
    PATIENT_ADDRESS_SCREEN = 3,
    PATIENT_CONTACT_SCREEN = 4,
    PATIENT_EMERGENCY_SCREEN = 5,
    PATIENT_ATTORNEY_SCREEN = 6,
    PATIENT_EXAM_QUESTIONS_SCREEN = 7
}

export enum PatientPortalScreeningStatusCode {
    MRI_WITH_CONTRAST = 'MRI w/ Contrast',
    MRI_WITHOUT_CONTRAST = 'MRI w/o Contrast',
    CT = 'CT',
    CR = 'CR',
    US = 'US',
}
