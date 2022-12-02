import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/response';
import { HttpService } from '../common/http.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { PageModules } from 'src/app/services/common/page-modules';

@Injectable()
export class FacilityService {
  sendDataToschdFacilities: EventEmitter<any> = new EventEmitter<any>();
  @Output() clearClickedEvent = new EventEmitter<string>();
  @Output() filterResult = new EventEmitter<any>();
  @Output() filterFacilityBilling = new EventEmitter<any>();
  @Output() filterFrontDesk = new EventEmitter<any>();
  @Output() filterRadFlowFacilityBilling = new EventEmitter<any>();
  @Output() docManagerFacility= new EventEmitter<any>();
  sendDataToFacilityDetail: EventEmitter<any> = new EventEmitter<any>();

  private searchTextBox = new Subject<string>();
  private userTypeDropDown = new Subject<number>();
  actionDropDown: EventEmitter<string>  = new EventEmitter<string>();
  actionDropDownEnum=ActionDropDownEnum;
  constructor(private readonly _httpService:HttpService,private readonly storageService:StorageService,) { }
  sendDataToschdFacilitiesWin(body:any): void 
  {
    this.sendDataToschdFacilities.emit(body);
  }
  getFacilityFilterText(searchText:any,userTypeText:any)
  {
    this.filterResult.emit({searchText,userTypeText});
  }
  getFacilityBillingFilterText(patientId: any, lastName: any, firstName: any, dob: any, isTodayAppointment: any, Modiality: any, Facility: any) {
    this.filterFacilityBilling.emit({patientId, lastName, firstName, dob, isTodayAppointment, Modiality, Facility})
  }
  getFrontDeskFilterText(patientId: any, lastName: any, firstName: any, dob: any, isTodayAppointment: any, Modiality: any, Facility: any) {
    this.filterFrontDesk.emit({patientId, lastName, firstName, dob, isTodayAppointment, Modiality, Facility})
  } 
  getRadFlowFacilityBillingFilterText(patientId: any, lastName: any, firstName: any, dob: any, isTodayAppointment: any, Modiality: any, Facility: any) {
    this.filterRadFlowFacilityBilling.emit({patientId, lastName, firstName, dob, isTodayAppointment, Modiality, Facility})
  }  
  getdocManagerFacility(dataAll:any)
  {
    this.docManagerFacility.emit({dataAll});
  }
  clearFilters(msg:string) {
      this.clearClickedEvent.emit(msg);
  }
  public setTextFilter(): Observable<string> {
    return this.searchTextBox.asObservable();
  }
  public setUserDropFilter(): Observable<number> {
    return this.userTypeDropDown.asObservable();
  }
  public updateDropDown(value: number): void {
    this.userTypeDropDown.next(value);
  }
  public updateSearchText(value: string): void {
    this.searchTextBox.next(value);
  }

  sendDataToPatientFacilityWindow(body: any): void {
    this.sendDataToFacilityDetail.emit(body);
  }

  sendActionDropText(actionValue:string)
  {
   this.actionDropDown.emit(actionValue);
  }
 getFacilityList(showGlobalLoader : boolean = true,body:any){
  return this._httpService.post('Facility/GetFacilityList',body, showGlobalLoader).pipe(
    map((res:ApiResponse) => res)
  );
}
getFacilityById(showGlobalLoader : boolean = true,facilityId:any){
  return this._httpService.get('Facility/GetFacilityById/'+facilityId, showGlobalLoader).pipe(
    map((res:ApiResponse) => res)
  );
}
getResourceDropDownData(showGlobalLoader : boolean = true,FacilityId:any){
  return this._httpService.get(`BlockLeaseScheduler/GetFacilityResourceDropDownData?FacilityId=${FacilityId}`,showGlobalLoader).pipe(
    map((res:ApiResponse) => res)
  );
}

// searchFacilities(showGlobalLoader : boolean = true,body:any){
//   return this._httpService.post('Facility/SearchFacility',body, showGlobalLoader).pipe(
//     map((res:ApiResponse) => res)
//   );
// }

getFacilityParentById(showGlobalLoader : boolean = true, facilityParentId:number){
    return this._httpService.get(`Facility/GetFacilityParentById/` + facilityParentId ,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  addFacilityParent(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post('Facility/AddFacilityParent',body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  updateFacilityParent(showGlobalLoader : boolean = true,body:any){
    return this._httpService.put('Facility/UpdateFacilityParent',body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getAllSearchFacilityParent(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post('Facility/SearchFacilityParent',body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getFacilitySearchData(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post('Facility/getFacilitySearchData',body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getAllFacilityNotesByFacililityId(showGlobalLoader : boolean = true,facilityId:any){
    return this._httpService.get('Facility/GetAllFacilityNotesByFacililityId/'+facilityId, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  addFacilityNote(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post('Facility/AddFacilityNote', body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getActiveEpicUsers(showGlobalLoader : boolean = true){
    return this._httpService.get('Automation/GetAllActiveEpicUsers',showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getTagListByFacilityId(showGlobalLoader : boolean = true,facilityId:any){
    return this._httpService.get('Facility/GetTagListByFacilityId/'+facilityId, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }


  addTagList(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post('Facility/AddTagList', body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getAllTagList(showGlobalLoader : boolean = true){
    return this._httpService.get('Facility/GetAllTagList',showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  deleteTagListById(showGlobalLoader : boolean = true,Id:number){
    return this._httpService.delete('Facility/DeleteTagList/'+Id,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getSchedulingFacilityLevel(showGlobalLoader : boolean = true){
    return this._httpService.get('MasterValues/GetSchedulingFacilityLevel',showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getFacilityParentNames(showGlobalLoader : boolean = true){
    // return this._httpService.get('MasterValues/GetFacilityParentNames',showGlobalLoader).pipe(
    //   map((res:ApiResponse) => res)
    // );
    return this._httpService.get('Facility/GetFacilityParentNamesForScheduling',showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updateFacility(showGlobalLoader : boolean = true,body:any){
    return this._httpService.put('Facility/UpdateFacility',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  addFacility(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post('Facility/AddFacility',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getFacilityPricing(showGlobalLoader : boolean = true,facilityId:any){
    return this._httpService.get('Facility/GetFacilityPricing/'+facilityId,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getFacilityPricingHistory(showGlobalLoader : boolean = true,facilityId:any){
    return this._httpService.get('Facility/GetFacilityPricingHistory/'+facilityId,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getFacilityParentPricing(showGlobalLoader : boolean = true, facilityParentId:number){
    return this._httpService.get(`Facility/GetFacilityParentPricing/` + facilityParentId ,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getFacilityParentPricingHistory(showGlobalLoader : boolean = true, facilityParentId:number){
    return this._httpService.get(`Facility/GetFacilityParentPricingHistory/` + facilityParentId ,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updateFacilityParentPricing(showGlobalLoader : boolean = true,currentPriceList:any){
    return this._httpService.post(`Facility/UpdateFacilityParentPricing`,currentPriceList,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updateFacilityPricing(showGlobalLoader : boolean = true,currentPriceList:any){
    return this._httpService.post(`Facility/UpdateFacilityPricing`,currentPriceList,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getSchedulingFacilityData(showGlobalLoader : boolean = true,filterBody:any,pageNumber:number,pageSize:number){
    return this._httpService.post(`Facility/GetSchedulingFacilityData?pageNumber=${pageNumber}&pageSize=${pageSize}`,filterBody,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getInstitutionNames(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetInstitutionNames`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getMasterModalities(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetMasterModalities`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getFinancialTypes(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetFinancialTypes`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getBrokerNames(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetBrokerNames`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getSchedulingFacilityPricing(showGlobalLoader : boolean = true,facilityId:string){
    return this._httpService.get(`Facility/GetSchedulingFacilityPricing/`+facilityId,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  createDuplicateFacility(showGlobalLoader : boolean = true,facilityId:number){
    return this._httpService.post('Facility/CreateDuplicateFacility?facilityId='+facilityId,null,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  uploadFileToFacility(showGlobalLoader : boolean = true,fromData:FormData){
    return this._httpService.post('Facility/UploadFileToFacility',fromData,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  
  GetFrontDeskListForFacilityBilling(showGlobalLoader : boolean = true,filterBody:any,pageNumber:number,pageSize:number){
    return this._httpService.post(`Facility/GetFrontDeskListForFacilityBilling?pageNumber=${pageNumber}&pageSize=${pageSize}`,filterBody,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  GetFrontDeskFacilityModalityDropDown(showGlobalLoader : boolean = true){
    return this._httpService.get(`Facility/GetFrontDeskFacilityModalityDropDown`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  UploadFilesForFacilityBilling(showGlobalLoader : boolean = true,fromData:FormData):Observable<ApiResponse>{  
    return this._httpService.post('Facility/UploadFilesForFacilityBilling',fromData,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  GetBillingListForFacility(showGlobalLoader : boolean = true,filterBody:any,pageNumber:number,pageSize:number){
    return this._httpService.post(`Facility/GetBillingListForFacilityBilling?pageNumber=${pageNumber}&pageSize=${pageSize}`,filterBody,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  NeedReviewForFacilityBilling(showGlobalLoader : boolean = true,filterBody:any,pageNumber:number,pageSize:number){
    return this._httpService.post(`Facility/NeedReviewForFacilityBilling?pageNumber=${pageNumber}&pageSize=${pageSize}`,filterBody,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }


  getPatientDocFacilityBilling(showGlobalLoader : boolean = true,ptId:any,DocId:any){
    return this._httpService.get(`Facility/GetPatientDocFacilityBilling/${ptId}/${DocId}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getNotBilledYetFacilityBilling(showGlobalLoader : boolean = true,filterBody:any,pageNumber:number,pageSize:number){
    return this._httpService.post(`Facility/GetNotBilledYetFacilityBilling?pageNumber=${pageNumber}&pageSize=${pageSize}`,filterBody,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getPendingPaymentFacilityBilling(showGlobalLoader : boolean = true,filterBody:any,pageNumber:number,pageSize:number){
    return this._httpService.post(`Facility/PendingPaymentFacilityBilling?pageNumber=${pageNumber}&pageSize=${pageSize}`,filterBody,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getNotBilledYetRadFlow(showGlobalLoader : boolean = true,filterBody:any,pageNumber:number,pageSize:number){
    return this._httpService.post(`Facility/GetNotBilledYetForRadFlow?pageNumber=${pageNumber}&pageSize=${pageSize}`,filterBody,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  GetMasterDocTypeFacilityBilling(showGlobalLoader:boolean=true){
    return this._httpService.get(`Facility/GetMasterDocTypeFacilityBilling`,showGlobalLoader).pipe(map((res:ApiResponse)=>res));
  }

  VerifedAttachFileFacilityBilling(showGlobalLoader:boolean=true,fromData:FormData){
    return this._httpService.post(`Facility/VerifedAttachUploadFile`,fromData,showGlobalLoader).pipe(map((res:ApiResponse)=>res));
  }
  DeleteUploadedFileBilling(showGlobalLoader:boolean=true,pId:any,DocId:any,UserId:string){
    return this._httpService.delete(`Facility/DeleteUploadedFileBilling/${pId}/${DocId}/${UserId}`,showGlobalLoader).pipe(map((res:ApiResponse)=>res));
  }
  getEmptyDirectory(showGlobalLoader : boolean = true,UserId:any){
    return this._httpService.get('Facility/EmptyDirectory/'+UserId,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  GetFileDocIdTypeBarCode(showGlobalLoader:boolean = true,formData:FormData){
       return this._httpService.post('Facility/GetFileDocIdTypeBarCode',formData,showGlobalLoader).pipe(map((res:ApiResponse)=>res));
  }

  CheckduplicacyUpload(showGlobalLoader : boolean = true,fromData:FormData):Observable<ApiResponse>{  
    return this._httpService.post('Facility/CheckduplicacyUpload',fromData,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  GetFacilityDepartment(showGlobalLoader : boolean = true){
    return this._httpService.get('Facility/GetFacilityDepartment',showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  GetTodayIntakePacket(){
    return this._httpService.get('Facility/TodayIntakePacket',true).pipe(map((res:ApiResponse) => res));
  }

  GetWarningForStudies(showGlobalLoader :true,body:any){
     return this._httpService.post('Facility/GetWarningForStudiesFacilityBilling',body,showGlobalLoader).pipe(map((res:ApiResponse)=>res));
  }
  RebillForFacilityBilling(showGlobalLoader :true,body:any){
    return this._httpService.post('Facility/RebillSelectedStudiesFacilityBilling',body,showGlobalLoader).pipe(map((res:ApiResponse)=>res));
 }
 RemoveSelectedStudies(showGlobalLoader :true,body:any){
  return this._httpService.post('Facility/RemoveSelectedStudiesFacilityBilling',body,showGlobalLoader).pipe(map((res:ApiResponse)=>res));
}
  FacilityBillingOverrideBill(showGlobalLoader :true,body:any){
    return this._httpService.post('Facility/OverrideBillSelectedStudiesFacilityBilling',body,showGlobalLoader).pipe(map((res:ApiResponse)=>res));
  }  

  ReviewForRadFlow(showGlobalLoader : boolean = true,filterBody:any,pageNumber:number,pageSize:number){
    return this._httpService.post(`Facility/ReviewForRadFlow?pageNumber=${pageNumber}&pageSize=${pageSize}`,filterBody,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  DisputeStudyByRadFlow(showGlobalLoader :true,body:any){
    return this._httpService.post('Facility/DisputeSendsForReviewByRadFlow',body,showGlobalLoader).pipe(map((res:ApiResponse)=>res));
  }  
  OkToPayStudies(showGlobalLoader :true,body:any){
    return this._httpService.post('Facility/OkToPayStudiesByRadFlow',body,showGlobalLoader).pipe(map((res:ApiResponse)=>res));
  }  
  PendingQbInvForRadFlow(showGlobalLoader : boolean = true,filterBody:any,pageNumber:number,pageSize:number){
    return this._httpService.post(`Facility/PendingQbInv?pageNumber=${pageNumber}&pageSize=${pageSize}`,filterBody,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  
  addUpdateFacilityClosedDays(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post('Facility/AddUpdateFacilityClosedDays',body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getBlockLeasePricing(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post('BlockLeaseScheduler/ManageLeaseFacilityPricing/',body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getAllBlockLeaseCredits(showGlobalLoader : boolean = true ,facilityId:Number,pageNumber:any,pageSize:any){
    return this._httpService.get(`BlockLeaseScheduler/GetAllBlockLeaseCredits?PageNo=${pageNumber}&pageSize=${pageSize}&facilityId=${facilityId}`, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getLeaseAgreementsByFacilityId(showGlobalLoader : boolean = true ,body:any){
    return this._httpService.post('BlockLeaseScheduler/GetLeaseAgreementsByFacilityId/',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  GetblockLeasePaymentByFacilityId(showGlobalLoader : boolean = true,facilityId:string, pageNumber:number,pageSize:number){
    return this._httpService.get(`BlockLeasePayment/GetBlockLeasepayment?facilityId=${facilityId}&pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  GetLeasePaymentMappingByFacilityId(showGlobalLoader : boolean = true,paymentId:string){
    return this._httpService.get(`BlockLeasePayment/GetLeasePaymentMapping?paymentId=${paymentId}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  GetBlockLeaseCreditsByFacilityId(showGlobalLoader : boolean = true,transactionNumber:string){
    return this._httpService.get(`BlockLeasePayment/GetBlockLeaseCredits?transactionNumber=${transactionNumber}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  checkUserType(){
    let checkUser = 0;
    var usertype = JSON.parse(localStorage.getItem('_cr_u_infor')).usertype;      
      if(usertype.toLowerCase() === 'facility'){         
        checkUser =2;    
      }else{
        checkUser =1;    
      }    
    return [checkUser];
  }
  
  GetUserFacilityDept(){
    // let checkUser = this.checkUserType()[0]; let FacilityDId:any = "0";    
    //   if(checkUser == 2){
    //   var data = JSON.parse(this.storageService.UserRole);                 
    //   let uPermission =  data.filter((object) =>  object.Module === PageModules.FacilityBilling); 
    //   if(uPermission.length>0){
    //     if(uPermission[0].IsView==true && JSON.parse(localStorage.getItem('_cr_u_infor')).assignFacilityDId){  
    //       FacilityDId = JSON.parse(localStorage.getItem('_cr_u_infor')).assignFacilityDId;
    //     }
    //   }
    // }  
      let FacilityDId:any = "0";   
      if(JSON.parse(localStorage.getItem('_cr_u_infor')).assignFacilityDId){  
        FacilityDId = JSON.parse(localStorage.getItem('_cr_u_infor')).assignFacilityDId;
      }
   return [FacilityDId];    
  }
  getActiveFacilityList(showGlobalLoader : boolean = true){
    return this._httpService.get(`Facility/GetActiveFacilityList`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
}

export enum ActionDropDownEnum {
  UpdatePrice=1,
  DuplicateFacility=2,
  ExportFacilitiesToExcel=3,
  UploadFacilities=4
}
