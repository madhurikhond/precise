import { HttpService } from '../common/http.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/response';

@Injectable({
providedIn: 'root'
  })
  export class CreateAlertService{
  constructor(private readonly _httpService:HttpService) { }

  getAlertTypes(showGlobalLoader : boolean = true )
  {
    return this._httpService.get(`CreateAlert/GetTblAlert`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getPatientRefAttInfoForAlert(showGlobalLoader : boolean = true, PatientID )
  {
    return this._httpService.get(`CreateAlert/GetPatientRefAttInfoForAlert?PatientID=${PatientID}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  createAlert( form : any,showGlobalLoader:boolean=true)
  {
    return this._httpService.post(`CreateAlert/CreateAlert`,form,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  sendEmail(emailData:string){
    return this._httpService.post(`CreateAlert/sendEmail`,emailData,true,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  sendSMS(smsData: string) {
    return this._httpService.post(`CreateAlert/SendSms`, smsData, true,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  sendFax(faxData: string) {
    return this._httpService.post(`CreateAlert/SendFax`, faxData, true,true).pipe(
      map((res: ApiResponse) => res)
    );
  }

  sendSlack(slackData: string) {
    return this._httpService.post(`CreateAlert/SendSlack`, slackData, true,true).pipe(
      map((res: ApiResponse) => res)
    );
  }

  patientAttRefData(emailBody: any) {
    return this._httpService.post(`CreateAlert/patientAttRefData`, emailBody, true,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
}