import { EventEmitter, Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/response';

@Injectable()
export class SubsService {

  public static readonly  susbFieldsRequirdErrorMsg = 'The following fields are required: Company Name, Ref Number, Date Requested, Type and Media';
  public static readonly  susbFieldsSameValueErrorMsg = 'The following fields: Ref Number, Check Number cannot be same with other(s)';
  public static readonly  susbFieldCannotBlank='The Check Date and Check Amount cannot be blank for a Check Number';


  sendAndRecieveDataForRequestSearchDetailPage: EventEmitter<any> = new EventEmitter<any>();
  sendAndRecieveDataToRequestSearchDetailPageSubsID: EventEmitter<any> = new EventEmitter<any>();
  constructor(private readonly _httpService:HttpService) { }
  
  sendDataToRequestSearchDetailPage(data:any)
  {
    this.sendAndRecieveDataForRequestSearchDetailPage.emit(data);
  }

  sendDataToRequestSearchDetailPageSubsID(data:any)
  {
    this.sendAndRecieveDataToRequestSearchDetailPageSubsID.emit(data);
  }
  getAllCopyServiceManagement(showGlobalLoader : boolean = true ,pageNumber: number, pageSize: number){
    return this._httpService.get(`CopyService/GetAllCopyServiceManagement?pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getCopyServiceManagementByCompanyId(showGlobalLoader : boolean = true ,companyId: number){
    return this._httpService.get(`CopyService/GetCopyServiceManagementByCompanyId?companyId=${companyId}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getCopyServiceRepById(showGlobalLoader : boolean = true ,companyId: number,pageNumber: number, pageSize: number){
    return this._httpService.get(`CopyService/GetCopyServiceRepById?companyId=${companyId}&pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getCompanyGroupingById(showGlobalLoader : boolean = true ,companyId: number,pageNumber:number,pageSize:number){
    return this._httpService.get(`CopyService/GetCompanyGroupingById?pageNumber=${pageNumber}&pageSize=${pageSize}&companyId=${companyId}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updateCompanyGrouping(showGlobalLoader : boolean = true ,body:any){
    return this._httpService.post(`CopyService/updateCompanyGrouping`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  deleteCopyServiceRepById(showGlobalLoader : boolean = true ,repId: number){
    return this._httpService.delete(`CopyService/DeleteCopyServiceRepById?RepID=${repId}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  addCopyServiceManagement(showGlobalLoader : boolean = true ,body:any){
    return this._httpService.put(`CopyService/addCopyServiceManagement`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updateCopyServiceManagement(showGlobalLoader : boolean = true ,body:any){
    return this._httpService.post(`CopyService/UpdateCopyServiceManagement`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  addCopyServiceRep(showGlobalLoader : boolean = true ,body:any){
    return this._httpService.put(`CopyService/AddCopyServiceRep`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updateCopyServiceRep(showGlobalLoader : boolean = true ,body:any){
    return this._httpService.post(`CopyService/UpdateCopyServiceRep`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getAllCopyServiceCompany(showGlobalLoader : boolean){
    return this._httpService.get(`RequestSearch/GetAllCopyServiceCompany`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  GetCopyServiceSearch(showGlobalLoader : boolean = true, search : string, isactive:boolean,pageNumber: number, pageSize: number){
    return this._httpService.get(`CopyService/GetCopyServiceSearchData?SearchText=${search}&isactive=${isactive}&pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getSubsDataByFilter(showGlobalLoader : boolean,body:any,pageNumber:number,pageSize:number){
    return this._httpService.post('RequestSearch/GetSubsDataByFilter?pageNumber='+pageNumber+'&pageSize='+pageSize,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getSubsDetailBySubsId(showGlobalLoader : boolean,subsId:number,patientId:string){
    return this._httpService.get('RequestSearch/GetSubsDetailBySubsId?subsId='+subsId+'&patientId='+patientId,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getAllRepNameByCompanyId(showGlobalLoader : boolean,companyId:number){
    return this._httpService.get('RequestSearch/GetAllRepNameByCompanyId?companyId='+companyId,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
 getAllSubsNotes(showGlobalLoader : boolean,subsId:number){
    return this._httpService.get('RequestSearch/getAllSubsNotes?subsId='+subsId,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  addSubsNotes(showGlobalLoader : boolean,body:any){
    return this._httpService.post('RequestSearch/addSubsNotes',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  subsUpdateImageCount(showGlobalLoader : boolean,internalStudyId:number,userId:number){
    return this._httpService.put('RequestSearch/SubsUpdateImageCount?internalStudyId='+internalStudyId+'&userId='+userId,'',showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  subsReadyForPickup(showGlobalLoader : boolean,subsId:string,userId:number){
    return this._httpService.put('RequestSearch/SubsReadyForPickup?subsId='+subsId+'&userId='+userId,null,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  subsNotReadyForPickup(showGlobalLoader : boolean,subsId:string,userId:number){
    return this._httpService.put('RequestSearch/SubsNotReadyForPickup?subsId='+subsId+'&userId='+userId,null,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  subsDeletePickupConfirmation(showGlobalLoader : boolean,subsId:string,userId:number){
    return this._httpService.put('RequestSearch/SubsDeletePickupConfirmation?subsId='+subsId+'&userId='+userId,null,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  subsDeleteRequest(showGlobalLoader : boolean,subsId:string){
    return this._httpService.delete('RequestSearch/SubsDeleteRequest?subsId='+subsId,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  subsSeeNotes(showGlobalLoader : boolean,subsId:string,userId:number){
    return this._httpService.put('RequestSearch/SubsSeeNotes?subsId='+subsId+'&userId='+userId,null,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  subsClearSeeNotes(showGlobalLoader : boolean,subsId:string,userId:number){
    return this._httpService.put('RequestSearch/SubsClearSeeNotes?subsId='+subsId+'&userId='+userId,null,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updateSubsDetail(showGlobalLoader : boolean,body:any){
    return this._httpService.put('RequestSearch/UpdateSubsDetail',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  createNewSubs(showGlobalLoader : boolean,body:any){
    return this._httpService.post('RequestSearch/CreateNewSubs',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  createNewSubsInBulk(showGlobalLoader : boolean,internalPatientId:any,body:any){
    return this._httpService.post('RequestSearch/CreateNewSubsInBulk',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }


  emailFinalizeCustodianRecords(showGlobalLoader : boolean,body:any){
    return this._httpService.post('RequestSearch/EmailFinalizeCustodianRecords',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  emailCustodianRecords(showGlobalLoader : boolean,body:any){
    return this._httpService.post('RequestSearch/EmailCustodianRecords',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  emailFinalizeBreakDownRecords(showGlobalLoader : boolean,body:any){
    return this._httpService.post('RequestSearch/EmailFinalizeBreakDownRecords',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  emailBreakDownRecords(showGlobalLoader : boolean,body:any){
    return this._httpService.post('RequestSearch/EmailBreakDownRecords',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  printCustodianRecords(showGlobalLoader : boolean,body:any){
    return this._httpService.post('RequestSearch/PrintCustodianRecords',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  } 
  printBreakdownRecords(showGlobalLoader : boolean,body:any){
    return this._httpService.post('RequestSearch/PrintBreakdownRecords',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  } 
  printFilmJacketLabelRecords(showGlobalLoader : boolean,body:any){
    return this._httpService.post('RequestSearch/PrintFilmJacketLabelRecords',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
}
export class ActionMenuConstant {
  public static readonly  readyforPickup = 'Ready for Pickup';
  public static readonly notReadyforPickup = 'Not Ready for Pickup';
  public static readonly deletePickupConfirmation = 'Delete Pickup Confirmation';
  public static readonly deleteRequest = 'Delete Request';
  public static readonly seeNotes = 'See Notes';
  public static readonly clearSeeNotes = 'Clear See Notes';
}

