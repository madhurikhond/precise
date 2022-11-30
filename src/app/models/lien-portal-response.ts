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
  STUDIES_ASSIGNED_TO_FUNDING_CO = 'Studies assigned to Funding Co. Successfully.',
  STUDIES_RETAINED_SUCCESS = 'Studies Retained Successfully.',
  SIGNATURE_UPDATED_SUCCESS = 'Signature Updated Successfully.',
  PAYMENT_RECEIVE_SUCCESS = 'Payment Updated Successfully.'
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
  FUNDING_COMPANY = "Funding Company"
}

export enum LienPortalTabName {
  PENDING = 'pending',
  ASSIGN_UNPAID = "assign_unpaid",
  ASSIGN_PAID = "assign_paid",
  RETAIN_UNPAID = "retain_unpaid",
  RETAIN_PAID = "retain_paid"
}

export enum LienPortalAPIEndpoint {

  // Radiologist
  GetPendingToBill = APIURL.LIEN_PORTAL + "GetPendingToBill",
  GetReferrerByUser = APIURL.LIEN_PORTAL + "GetReferrerByUser",
  GetCPTGroupList = APIURL.LIEN_PORTAL + "GetCPTGroupList",
  GetAssignedARUnpaid = APIURL.LIEN_PORTAL + "GetAssignedARUnpaid",
  GetAssignedARPaid = APIURL.LIEN_PORTAL + "GetAssignedARPaid",
  GetFundingCompanyByUser = APIURL.LIEN_PORTAL + "GetFundingCompanyByUser",
  AssignARStudiesToRadiologist = APIURL.LIEN_PORTAL + "AssignARStudiesToRadiologist",
  RetainARStudies = APIURL.LIEN_PORTAL + "RetainARStudies",
  GetRetainedUnPaid = APIURL.LIEN_PORTAL + "GetRetainedUnPaid",
  GetRetainedArPaidList = APIURL.LIEN_PORTAL + "GetRetainedArPaidList",
  MoveRetainARToAssignAR = APIURL.LIEN_PORTAL + "MoveRetainARToAssignAR",
  ReceivePaymentForSelectStudy = APIURL.LIEN_PORTAL + "ReceivePaymentForSelectStudy",

  //RadiologistSetting
  UpsertFundingCompanyInfo = APIURL.LIEN_PORTAL + "UpsertFundingCompanyInfo",
  AddRadDefaultSign = APIURL.LIEN_PORTAL + "AddRadDefaultSign",
  AddFundingCompanySellPrice = APIURL.LIEN_PORTAL + "AddFundingCompanySellPrice",
  GetFundingCompanyList = APIURL.LIEN_PORTAL + "GetFundingCompanyList",
  AddRadiologistSetting = APIURL.LIEN_PORTAL + "AddRadiologistSetting",
  GetRadiologistSettings = APIURL.LIEN_PORTAL + "GetRadiologistSettings",
  GetPreciseMriFundingCompanyInfo = APIURL.LIEN_PORTAL + "GetPreciseMriFundingCompanyInfo",
  GetRadiologistFundingCompanyInfo = APIURL.LIEN_PORTAL + "GetRadiologistFundingCompanyInfo",
}