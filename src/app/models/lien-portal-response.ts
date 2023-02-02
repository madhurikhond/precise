export enum LienPortalResponseStatus{
  Success = 1,
  Fail = 0,
}

export enum APIURL {
  LIEN_PORTAL = "LienPortal/",
}

export enum LienPortalStatusMessage {
  COMMON_ERROR = 'Request Failed',
  FUNDING_COMPANY_ADDED = 'Funding Company Added Successfully.',
  FUNDING_COMPANY_UPDATED = 'Funding Company Updated Successfully.',
  STUDIES_ASSIGNED_TO_FUNDING_CO = 'Studies Assigned to Funding Co. Successfully.',
  STUDIES_RETAINED_SUCCESS = 'Studies Retained Successfully.',
  SIGNATURE_UPDATED_SUCCESS = 'Signature Updated Successfully.',
  PAYMENT_RECEIVE_SUCCESS = 'Payment Updated Successfully.',
  SETTING_SAVED_SUCCESS = 'Setting Saved Successfully.',
  FUNDING_COMPANY_REQUIRED = 'Please Select a Funding Company.',
  FUNDING_COMPANY_PAID_RECORD = 'Please Select a Paid Record.',
  FILLOUT_REQUIRED_REQUIRED_FIELDS = 'Please fill out all required fields.',
  PAYMENT_DELETED_SUCCESS = 'Payment Removed Successfully.',

  PAYMENT_RECEIVE_STUDIES_SUCCESS = 'Payment received Successfully for Studies.',
  SIGN_AR_SUCCESS = 'Sign assigned AR Successfully.',
  ASSIGNED_AR_EXECUTED = 'Assigned AR Executed',
  PAY_BATCHES_SUCCESS = 'Selected AR has been marked as paid.',
  PAYMENT_INFO_UPDATE_SUCCESS = 'Payment info updated Successfully.',

}

export enum LienPortalURLName{
  LIEN_PORTAL = "/lien-portal",
  LIEN_PORTAL_SETTINGS = "/lien-portal-setting",
}

export enum LienPortalURL{
  LIEN_PORTAL = "lien-portal",
  LIEN_PORTAL_SETTINGS = "lien-portal-setting",
}

export class LienPortalResponse {
  result: any;
  status: number;
  responseStatus: string;
  exception: any;
}

export enum LienPortalPageTitleOption {
  PENDING_TO_BILL = 'Pending to Bill',
  ASSIGN_AND_UNPAID = "Assigned & Unpaid",
  ASSIGN_AND_PAID = "Assigned & Paid",
  RETAINED_AND_UNPAID = "Retained & Unpaid",
  RETAINED_AND_PAID = "Retained & Paid",
  SETTINGS = "Settings",
  FUNDING_COMPANY = "Funding Company",
  PENDING_SIGNATURE = "Pending Signature",
  PAID = "Paid",
  UNPAID = "Unpaid",
  ORIGINALLIENOWNERDATA = "Original Lien Owner Data"
}

export enum LienPortalTabName {
  PENDING = 'pending',
  ASSIGN_UNPAID = "assign_unpaid",
  ASSIGN_PAID = "assign_paid",
  RETAIN_UNPAID = "retain_unpaid",
  RETAIN_PAID = "retain_paid"
}

export enum LienFundingCoTabName {
  ORIGINALLIENOWNER = 'originallien',
  PENDING = 'pending',
  UNPAID = "unpaid",
  PAID = "paid",
}

export enum LienPortalAPIEndpoint {

  // Radiologist
  GetPendingToBill = APIURL.LIEN_PORTAL + "GetPendingToBill",
  GetReferrerByUser = APIURL.LIEN_PORTAL + "GetReferrerByUser",
  GetCPTGroupList = APIURL.LIEN_PORTAL + "GetCPTGroupList",
  GetAssignedARUnpaid = APIURL.LIEN_PORTAL + "GetAssignedARUnpaidRequest",
  GetAssignedARPaid = APIURL.LIEN_PORTAL + "GetAssignedARPaid",
  GetFundingCompanyByUser = APIURL.LIEN_PORTAL + "GetFundingCompanyByUser",
  AssignARStudiesToRadiologist = APIURL.LIEN_PORTAL + "AssignARStudiesToRadiologist",
  RetainARStudies = APIURL.LIEN_PORTAL + "RetainARStudies",
  GetRetainedUnPaid = APIURL.LIEN_PORTAL + "GetRetainedUnPaid",
  GetRetainedArPaidList = APIURL.LIEN_PORTAL + "GetRetainedArPaidList",
  MoveRetainARToAssignAR = APIURL.LIEN_PORTAL + "MoveRetainARToAssignAR",
  AssignARPreviewAssignment = APIURL.LIEN_PORTAL + "AssignARPreviewAssignment",
  MarkRetainBatchPaid = APIURL.LIEN_PORTAL + "MarkRetainBatchPaid",

  //RadiologistSetting
  UpsertFundingCompanyInfo = APIURL.LIEN_PORTAL + "UpsertFundingCompanyInfo",
  AddRadDefaultSign = APIURL.LIEN_PORTAL + "AddRadDefaultSign",
  AddFundingCompanySellPrice = APIURL.LIEN_PORTAL + "AddFundingCompanySellPrice",
  GetFundingCompanyList = APIURL.LIEN_PORTAL + "GetFundingCompanyList",
  AddRadiologistSetting = APIURL.LIEN_PORTAL + "AddRadiologistSetting",
  GetRadiologistSettings = APIURL.LIEN_PORTAL + "GetRadiologistSettings",
  GetPreciseMriFundingCompanyInfo = APIURL.LIEN_PORTAL + "GetPreciseMriFundingCompanyInfo",
  GetRadiologistFundingCompanyInfo = APIURL.LIEN_PORTAL + "GetRadiologistFundingCompanyInfo",
  GetRadDefaultSign = APIURL.LIEN_PORTAL + "GetRadDefaultSign",
  GetFundingCompanySellPrice = APIURL.LIEN_PORTAL + "GetFundingCompanySellPrice",

  //Funding Company
  GetPendingSignature = APIURL.LIEN_PORTAL + "GetPendingSignature",
  GetFundingCompanyUnpaidList = APIURL.LIEN_PORTAL + "GetFundingCompanyUnpaidList",
  SaveFundingCompany = APIURL.LIEN_PORTAL + "SaveFundingCompany",
  LienPayment = APIURL.LIEN_PORTAL + "LienPayment",
  GetFundingCompanyPaidList = APIURL.LIEN_PORTAL + "GetFundingCompanyPaidList",
  GetRadiologistUser = APIURL.LIEN_PORTAL + "GetRadiologistUser",
  RemovePayment = APIURL.LIEN_PORTAL + "RemovePayment",
  EditPaymentInformation = APIURL.LIEN_PORTAL + "EditPaymentInformation",
  GetReferrersWisePendingToBillCount = APIURL.LIEN_PORTAL + "GetReferrersWisePendingToBillCount",
  //Funding Company Setting
  AddFundingUserSetting = APIURL.LIEN_PORTAL + "AddFundingUserSetting",
  GetFundingCompanySetting = APIURL.LIEN_PORTAL + "GetFundingCompanySetting",
}


export enum LienPortalFundingCoPermission {
  LienFundingCompany = "LIEN FUNDING COMPANY",
  PayForAR = "PAY FOR AR",
  SignForAssignAR = "SIGN FOR ASSIGNED AR"
}

export enum OriginalLienOwnerPermission {
  OriginalLienOwner = "ORIGINAL LIEN OWNER",
  BillStudiesAndAssignAR = "BILL STUDIES & ASSIGN AR",
  BillStudiesAndRetainAR = "BILL STUDIES & RETAIN AR",
  MarkPaidForRetainedAR = "MARK PAID FOR RETAINED AR"
}
