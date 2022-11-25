export enum LienPortalResponseStatus{
  Success = 'Success',
  Fail = 'Fail',
}

export enum PageTitleOption {
  LIEN_PORTAL = "Lien Portal",
}

export enum LienPortalStatusMessage {
  COMMON_ERROR = 'Request Failed',
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