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
  LIEN_PORTAL = "/radportal",
  LIEN_PORTAL_SETTINGS = "/radsetting",
}

export enum LienPortalURL{
  LIEN_PORTAL = "radportal",
  LIEN_PORTAL_SETTINGS = "radsetting",
}

export class LienPortalResponse {
  result: any;
  status: number;
  responseStatus: string;
  exception: any;
}