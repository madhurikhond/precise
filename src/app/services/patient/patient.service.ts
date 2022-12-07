import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/response';
import { HttpService } from '../common/http.service';

@Injectable()
export class PatientService {

  sendDataToPatientDetail: EventEmitter<any> = new EventEmitter<any>();
  sendDataToOrderedSchedular: EventEmitter<any> = new EventEmitter<any>();
  private sendDataToEsignrequest = new BehaviorSubject<boolean>(false);
  sendDataToEsignrequestKeeper = this.sendDataToEsignrequest.asObservable();
  constructor(private readonly _httpService:HttpService) { }

   sendDataToPatientDetailWindow(body:any): void {
    this.sendDataToPatientDetail.emit(body);
  }
  sendDataToOrderedSchedularWindow(body:any):void{ 
  this.sendDataToOrderedSchedular.emit(body)
}  
sendDataToEsignrequestWindow(EsignAgreeCheck:any): void {
    this.sendDataToEsignrequest.next(EsignAgreeCheck);
  }

  GetReportPath(showGlobalLoader:boolean=true){
    return this._httpService.get('Patient/GetReportPath', showGlobalLoader).pipe(map((res)=>res));
  }
  getPatientDetail(showGlobalLoader : boolean = true ,internalPatientId: string , internalStudyId: string,operation:number,pageNumber:number,pageSize:number){
    return this._httpService.get(`Patient/GetPatientDetail?internalPatientId=${internalPatientId}&internalStudyId=${internalStudyId}&operation=${operation}&pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updatePatientDetail(showGlobalLoader : boolean = true ,body: any){
    return this._httpService.post(`Patient/UpdatePatientDetail`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  GetCreateAlertByPatientId(showGlobalLoader : boolean=true,body:any){
    return this._httpService.post(`Patient/GetCreateAlertByPatientId`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  GetFullLogsByPatientId(showGlobalLoader : boolean=true,body:any){
    return this._httpService.post(`Patient/GetFullLogsByPatientId`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  markPatientStudyReadyToBill(showGlobalLoader : boolean = true ,body: any){
    return this._httpService.post(`Patient/MarkPatientStudyReadyToBill`,body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getFinancialTypes(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetFinancialTypes`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getInsuranceCompanies(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetInsuranceCompanies`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getFacilities(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetInstitutionNames`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getFacilityParentNames(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetFacilityParentNames`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getPriorityNames(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetPriorityNames`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getStatusNames(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetStatusNames`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getStatuForStatusOrder(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetStatuForStatusOrder`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getScheduledModality(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetScheduledModality`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getLogs(showGlobalLoader : boolean = true,body: any){
    return this._httpService.post(`Patient/getLogs`,body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }

  crudBillingPaymentDestination(showGlobalLoader : boolean = true,body: any){
    return this._httpService.post(`Patient/crudBillingPaymentDestination`,body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getMarketingUser(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetMarketingUser`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getBrokerNames(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetBrokerNames`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getAttorneys(showGlobalLoader : boolean = true ,body:any){
    return this._httpService.post(`MasterValues/GetAttorneys`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getReferringPhysicians(showGlobalLoader : boolean = true ,brokerId: string , referringPhysicians: string,userType:string){
    return this._httpService.get(`MasterValues/GetReferringPhysicians?BrokerId=${brokerId}&ReferringPhysicians=${referringPhysicians}&UserType=${userType}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getPatientData(showGlobalLoader : boolean = true ,body:any,pageNumber:any,pageSize:any){
    return this._httpService.post('Patient/GetPatientData?pageNumber='+pageNumber+'&pageSize='+pageSize,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updatePersistentGridSetting(showGlobalLoader : boolean = true ,body:any){
    return this._httpService.put('MasterValues/UpdatePersistentGridSetting',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getPersistentGridSetting(showGlobalLoader : boolean = true ,userId:any,pageName:any){
    return this._httpService.get('MasterValues/GetPersistentGridSetting/'+userId+'/'+pageName,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getReadyToBill(showGlobalLoader : boolean = true, body:string) {
    return this._httpService.post('Patient/GetReadyToBill',body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }

  // GetPatientDataForApplyChecks(showGlobalLoader : boolean = true ,body: any){
  //   return this._httpService.post(`Patient/GetPatientDataForApplyChecks`,body,showGlobalLoader).pipe(
  //     map((res:ApiResponse) => res)
  //   );
  // }

  getGrossReceipts(body:any, showGlobalLoader: boolean=true){
    return this._httpService.post(`Patient/GetGrossReceipts`, body,showGlobalLoader).pipe( 
      map((res:ApiResponse) => res)
      );
  }
  getGenerateEsignLink(PatientIdInternalStudyid: string , showGlobalLoader: boolean=true) {   
    return this._httpService.post(`Patient/GetGenerateEsignLink`,PatientIdInternalStudyid,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  // getGeneratePI_TC_P_PI_Lien(checkedPatientIdInternalStudyid: string , showGlobalLoader: boolean=true) {
  //   return this._httpService.get(`Patient/GetGeneratePI_TC_P_PI_Lien?PatientIdInternalStudyid=${checkedPatientIdInternalStudyid}`,showGlobalLoader).pipe(
  //     map((res:ApiResponse) => res)
  //   );
  // }
  getGeneratePI_TC_P_PI_Lien(showGlobalLoader : boolean = true ,body: any){
    return this._httpService.post(`Patient/GetGeneratePI_TC_P_PI_Lien`,body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getGeneratePI_TC_Lien(showGlobalLoader : boolean = true ,body: any){
    return this._httpService.post(`Patient/GetGenerate_PI_TC_Lien`,body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getGenerateP_PI_Lien(showGlobalLoader : boolean = true ,body: any){
    return this._httpService.post(`Patient/GetGenerate_PI_P_Lien`,body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  } 
  getGenerateAttorneyBill( showGlobalLoader: boolean=true, body: string ) {
    return this._httpService.post(`Patient/GetGenerateAttorneyBill`,body,showGlobalLoader, true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updateActionOnSelect(showGlobalLoader : boolean = true, body:string) {
    return this._httpService.post(`Patient/updateActionOnSelect`,body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  CreateIntakePacket(showGlobalLoader : boolean = true, body:any) {
    return this._httpService.post(`Patient/CreateIntakePacket`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  
  CreateXRAYPregWaiver(showGlobalLoader : boolean = true, body:string) {
    return this._httpService.post(`Patient/CreateXRAYPregWaiver`,body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }  
  
  CreateNoSMSPatient(showGlobalLoader : boolean = true, body:string) {
    return this._httpService.post(`Patient/CreateNoSMSPatient`,body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getEsignData(PatientId:string, Token:string){
    return this._httpService.get(`Patient/GetEsignData?PatientId=${PatientId}&Token=${Token}`,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  printPreview(PatientId:string, FullName:string, FromPage:string){
    return this._httpService.get(`Patient/printPreview?PatientId=${PatientId}&FullName=${FullName}&FromPage=${FromPage}&`,true).pipe(
      map((res:ApiResponse) => res)
    );
  }

  insertESignatureLien(body:any,FromPage:string, showGlobalLoader: boolean=true){
    return this._httpService.post(`Patient/InsertESignatureLien?FromPage=${FromPage}`, body,showGlobalLoader).pipe( 
      map((res:ApiResponse) => res)
      );
  }
  sendEmail(emailData:string){
    return this._httpService.post(`Patient/sendEmail`,emailData,true,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  download(PatientId:string, FullName:string,FromPage:string){
    return this._httpService.get(`Patient/downloadFile?PatientId=${PatientId}&FullName=${FullName}&FromPage=${FromPage}`,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getClearResultByPatientId(showGlobalLoader : boolean = true ,body: any) {
    return this._httpService.post(`Patient/ClearResultByPatientId`,body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  GetLastSearchRecord(showGlobalLoader : boolean = true ){
    return this._httpService.get(`Patient/GetLastSearchRecord`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  InsertLastSearchRecord(showGlobalLoader : boolean = true,body:any ){
    return this._httpService.post(`Patient/InsertLastSearchRecord`,body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }

  ManageSearch(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post(`Patient/ManageSearch`,body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getPatientDataForExportAllToExcel(showGlobalLoader : boolean = true ,body:any){
    return this._httpService.post('Patient/GetPatientDataForExportAllToExcel',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updateActionOnPatientForAll(showGlobalLoader : boolean = true ,body:any,Condition:Number){
    return this._httpService.post('Patient/UpdateActionOnPatientForAll?Condition='+Condition,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }


  downloadFile(data, filename='data') {
    
    let csvData = this.ConvertToCSV(data, ['FirstName','LastName', 'PATIENTIDEXPORT',  'Address','DOB','Gender','BillSent','InsuranceCompany','COVERAGELEVEL','INSUREDID','POLICYGROUP','Notes','ATTORNEY','BusinessPhoneNumber','DOS','CPT','ReferringPhysician','InternalStudyId','ReportSignedTime']);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement('a');
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') === -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}
ConvertToCSV(objArray, headerList) {
     let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
     let str = '';
     
     let row = 'S.No,';
for (let index in headerList) {
     
         row += headerList[index] + ',';
     }
     row = row.slice(0, -1);
     str += row + '\r\n';
     for (let i = 0; i < array.length; i++) {
         let line = (i+1)+'';
         for (let index in headerList) {
            let head = headerList[index];
              line += ',' + array[i][head];
         }
         str += line + '\r\n';
     }
     return str;
 }
}
