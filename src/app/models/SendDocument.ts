export class SendDocumentInput {
    Email: any
    Fax: any
    PostMail: any
   // PostMail_A: PostMail
    IsIncludeCoverPage: boolean
    PatientId: string
    FileName: string
    DocType: string
    DocId: number
    CurrentUserId: string
    FromPage: string
    FromPageID: string
    CoverPage: CoverPage
    IsEmail:Boolean
    IsFax:Boolean
    IsPostMail:boolean
    AttorneyDetails: Array<AttorneySDDetails>
    PatientDetails: Array<PatientSDDetail>
    BrokerDetails: Array<BrokerSDDetails>
    FacilityDetails: Array<FacilitySDDetails>
    SendPostMailToUser: Array<SendPostMailToUser>
    constructor()
    {
      this.AttorneyDetails=new Array<AttorneySDDetails>();
      this.PatientDetails=new Array<PatientSDDetail>();
      this.BrokerDetails=new Array<BrokerSDDetails>();
      this.FacilityDetails=new Array<FacilitySDDetails>();
      this.SendPostMailToUser=new Array<SendPostMailToUser>();
      this.CoverPage = new CoverPage();
     // this.PostMail = new Array<PostMail>();
    }
  }
  export class CoverPage {
    From: string
    Body: string
    Attention: string
    PageCount: number
  }
  export class PostMail {
    Name: string
    Address: string
    City: string
    State: string
    ZIP: string
  }
  export class AttorneySDDetails {
    Id: number
    Email: string
    Fax: string
    Name: string
    Address: string
  }
  export class PatientSDDetail {
    Id: number
    Email: string
    Fax: string
    Name: string
    Address: string
  }
  export class BrokerSDDetails {
    Id: number
    Email: string
    Fax: string
    Name: string
    Address: string
  }
  export class FacilitySDDetails {
    Id: number
    Email: string
    Fax: string
    Name: string
    Address: string
  }
  export class SendPostMailToUser {
    ToUser: number
    PostMail: number
  }