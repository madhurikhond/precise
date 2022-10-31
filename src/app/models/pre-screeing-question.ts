export const PreScreeningGeneralQuestion = {
  Height: "What Is your Height?",
  Weight: "What Is your weight?",
  Pregnant: "Are you currently pregnant?",
  PregnantTime: "How far along?",
  Gender: "What is your gender?"
};

export const PreScreeningCTQuestion = {
  RecentXaryOrCt: "Have you had a recent X-ray or CT performed?",
  XrayWhichBodyPart: "When was this performed and of what body part?",
  HaveCancer: "Do you have cancer or any history of cancer?",
  RecentRediation: "Did you have any recent radiation done?"
};

export const PreScreeningMRIQuestion = {
  MriBefore: "Have you ever had an MRI before?",
  MriProblem: "Did you experience any problems during the MRI?",
  TextMriProblem: "Problem Text?",
  MriMedicalCondition: "Do you currently have any medical conditions that prevent you from staying completely still during the exam?",
  WhatMriCondition: "What condition Do you have?",
  MriHobbyJob: "Have you EVER worked With metal In your entire life As a hobby Or job?",
  AuthorizationXRAY: "Have you had an MRI performed before And have a clearance authorization/XRAY report?",
  MriPhysicalLimition: "Any physical limitation such as  a cane, walker or wheelchair?",
  MriTransfer: "Are you able to transfer yourself onto the MRI table?",
  MriMedicaldevices: "Do you have ANY medical devices implanted in your body?",
  MriManufacturerCard: "Do you have the manufacturer's card stating that the device is MRI safe or do you know the model number for verification?",
  MriForeignMetalObj: "Do you have any foreign metal objects such as a bullet, a BB/Pellet or shrapnel in your body?",
  MriObjLocated: "Where is the object located?",
  MriWig: "Do you wear a wig or hair implants?",
  MriRemovableMetal: "Do you have removable metal in your mouth or braces?",
  MriRecentTattoos: "Do you have any recent tattoos that are less than 6 weeks old?",
  MriTattooSize: "What is the approximate size and location of the tattoo?",
  MriAnkleMonitorDevice: "Do you have an ankle monitor device?",
  MriProcedure: "Are you able to remove the device before the procedure?",
  MriPOMeetFacility: "Can your PO meet you at the facility to remove it while you are scanned?",
  MriClaustrophobic: "Are you claustrophobic?",
  MriSurgeries: "Any prior surgeries?",
  MriDiabetes: "Do you have diabetes or a history of diabetes?",
  MriCancer: "Do you have cancer or a history of cancer?",
  MriBloodPressure: "Do you have high blood pressure?",
  MriAllergiesMedications: "Do you have allergies or adverse reactions to medications?",
  MriAllergiesMedicationsDescriptions: "Allergies or adverse reactions Description",
  MriKidneyProblem: "Do you have kidney problems or issues?",
  EyesInjuries: "Have you ever had any injuries to your eyes?",
  InjuryEyesAnswer: "Please describe the injury"
};


export const PreScreeningUSQuestion = {
  Allergy: "Do you have allergies?",
  AllergyDescription: "Allergies Description?"
};

export const GridRowState = {
  Expand: "expanded",
  Collapse: "collapsed"
};

export class PatientScreeningQuestion {
  patientId: string = '';
  isFinalSubmit: boolean = false;
  preScreeningQuestion:PatientPreScreeningQuestion;
  examQuestionForMriWithContrast: PatientExamQuestionForMriWithContrast;
  examQuestionForMriWithoutContrast: PatientExamQuestionForMriWithoutContrast;
  examQuestionForCtOrCr: PatientExamQuestionForCtOrCr;
  examQuestionForUs: PatintExamQuestionForUs ;
  loggedPartnerId: number = 0;
  jwtToken: string = '';
  patientPreferredLanguage:string;
  pageCompleted: number;
  constructor(){
    this.preScreeningQuestion = new PatientPreScreeningQuestion();
    this.examQuestionForMriWithContrast = new PatientExamQuestionForMriWithContrast();
    this.examQuestionForMriWithoutContrast = new PatientExamQuestionForMriWithoutContrast();
    this.examQuestionForCtOrCr = new PatientExamQuestionForCtOrCr();
    this.examQuestionForUs = new PatintExamQuestionForUs();
  }
}

export class PatientPreScreeningQuestion {
  studyId: string = '';
  modalityName: string = '';
  studyDescription: string = '';
  weight: string = '';
  height: string = '';
  gender: string = '';
  isPregnant: string = '';
  pregnancyInWeek: string = '';
}

export class PatientExamQuestionForMriWithContrast {
  isDiabetesHistory: string = '';
  isCancerHistory: string = '';
  isHighBloodPressure: string = '';
  mriAllergiesMedications: string = '';
  allergyReactionQuestion: string = '';
  isKidneyProblem: string = '';
}

export class PatientExamQuestionForMriWithoutContrast {
  studyId: string = '';
  modalityName: string = '';
  studyDescription: string = '';
  mriBefore: string = '';
  mriProblem: string = '';
  textMriProblem: string = '';
  mriClaustrophobic: string = '';
  mriMedicalCondition: string = '';
  whatMriCondition: string = '';
  mriHobbyJob: string = '';
  authorizationXray: string = '';
  eyesInjuries: string = '';
  eyesInjuriesReason: string = '';
  mriPhysicalLimition: string = '';
  mriTransfer: string = '';
  mriMedicaldevices: string = '';
  mriManufacturerCard: string = '';
  mriForeignMetalObj: string = '';
  mriObjLocated: string = '';
  mriWig: string = '';
  mriRemovableMetal: string = '';
  isRecentTattoo: string = '';
  mriTattooSize: string = '';
  mriAnkleMonitorDevice: string = '';
  mriProcedure: string = '';
  mriPoMeetFacility: string = '';
  priorSurgeryQuestion :string;
}

export class PatientExamQuestionForCtOrCr {
  studyId: string = '';
  modalityName: string = '';
  studyDescription: string = '';
  recentXrayCt: string = '';
  recentXrayCtDescription: string = '';
  cancerHistory: string = '';
  recentRadiation: string = '';
}

export class PatintExamQuestionForUs {
  modalityName: string = '';
  studyDescription: string = '';
  studyId: string = '';
  usAllergy: string = '';
  usAllergyDescription: string = '';
}