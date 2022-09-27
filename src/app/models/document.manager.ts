export class DocumentManagerModel {
    name: string;
    isDirectory: boolean;
    uploadedBy:string;
    docType: string;
    owner:number;
    uploadedOn:string;
    referreId:string;
    docId:number;
    docTypeId:number;
    fileBase64:string;
    patientLastName:string;
    patientFirstName:string;
    docFromAttorney:boolean;
  }

  export class DocumentManagerAlert
  {
    patientId:string;
    uploadedFileName:string;
    selectedDocType:string;
    selectedDocTypeId:number;
    isClearAlert:boolean;
    owner:number;
    fromPage:string;
    alertInfo: Array<AlertInfoPayload>=[];
    constructor()
    {
      this.alertInfo=new Array<AlertInfoPayload>();
    }
  }
  export class AlertInfoPayload
  {
    hasAlertId:number;
    hasAlert:string;
    isNewRX:boolean;
    alertType:string;
    reason:string;
    alertCreatedOn:string;
    alertCreatedBy:string;
  }