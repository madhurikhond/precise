import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/response';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  @Output() filterResult = new EventEmitter<any>();
  @Output() clearClickedEvent = new EventEmitter<string>();
  private searchTextBox = new Subject<string>();
  constructor(private readonly _httpService: HttpService) { }
  getFacilityText(searchText:any){
    this.filterResult.emit({searchText});
  }
  public setTextFilter(): Observable<string> {
    return this.searchTextBox.asObservable();
  }
  clearFilters(msg:string) {
    this.clearClickedEvent.emit(msg);
 }
  

  //  #region Accouting-> Collections Management
  //Get
  getOrderReviewedStudy(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number) {
    return this._httpService.get(`OrderedReviewer/GetOrderReviewedStudy?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllNeedsToBeReviewedStudies(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number) {
    return this._httpService.get(`OrderedReviewer/GetAllNeedsToBeReviewedStudies?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPatientDetailByPatientId(showGlobalLoader: boolean = true, patientId: any) {
    return this._httpService.get(`OrderedReviewer/GetPatientDetailByPatientId?patientId=${patientId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPatientStudyDetailByPatientId(showGlobalLoader: boolean = true, patientId: any) {
    return this._httpService.get(`OrderedReviewer/GetPatientStudyDetailByPatientId?patientId=${patientId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPatientCommentsAndHistoryByPatientId(showGlobalLoader: boolean = true, patientId: any) {
    return this._httpService.get(`OrderedReviewer/GetPatientCommentsAndHistoryByPatientId?patientId=${patientId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  applyFilterForNeedsToBeReviewedTab(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post(`OrderedReviewer/ApplyFilterForNeedsToBeReviewedTab`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  reviewedCurrentPatient(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post(`OrderedReviewer/ReviewedCurrentPatient`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  checkRXOrBrokerLienExistByPatientId(showGlobalLoader: boolean = true, patientId: any) {
    return this._httpService.get(`OrderedReviewer/CheckRXOrBrokerLienExistByPatientId?patientId=${patientId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getCommunicationFailure(flag: number, pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`CommFailure/GetCommunicationFailure?flag=${flag}&pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getSearchDataCommFailure(flag: number,SearchText:string, pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`CommFailure/GetCopyServiceSearchData?flag=${flag}&SearchText=${SearchText}&pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  resolveCommunicationFailure(logId: number, showGlobalLoader: boolean = true) {
    return this._httpService.post(`CommFailure/ResolveCommunicationFailure?logId=${logId}`, null, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getCallPatientConfirmationCount(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Scheduler/GetCallPatientConfirmationCount`, showGlobalLoader)
      .pipe(
        map((res: ApiResponse) => res)
      );
  }
  getCallPatientConfirmation(showGlobalLoader: boolean = true, patientId: string, lastName: string, firstName: string, pageNumber: number, pageSize: number) {
    return this._httpService.get(`Scheduler/GetCallPatientConfirmation?patientId=${patientId}&lastName=${lastName}&firstName=${firstName}&pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  saveCallPatientConfirmationLog(type: string, internalStudyIds: string, note:string,showGlobalLoader: boolean = true) {
    return this._httpService.post(`Scheduler/SaveCallPatientConfirmationLog/${type}/${internalStudyIds}/${note}`, null, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getQCAttorneyDropDown(showGlobalLoader: boolean = true) {
    return this._httpService.get(`QcAttorneyBills/GetQCAttorneyDropDown`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getQcPendingStudies(showGlobalLoader: boolean = true, body: any, pageNumber: number, pageSize: number) {
    return this._httpService.post(`QcAttorneyBills/GetQcPendingStatus?pageNumber=${pageNumber}&pageSize=${pageSize}`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getMissingASL(showGlobalLoader: boolean = true, body: any, pageNumber: number, pageSize: number) {
    return this._httpService.post(`QcAttorneyBills/GetQcMissingAsl?pageNumber=${pageNumber}&pageSize=${pageSize}`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getQcAttorneyStats(showGlobalLoader: boolean = true, attorney: string, pageNumber: number, pageSize: number) {
    return this._httpService.get(`QcAttorneyBills/GetQcAttorneyStats?attorney=${attorney}&pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updateQCAttorneyBillsDropDown(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post(`QcAttorneyBills/UpdateQCAttorneyBillsDropDown`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getSettlementDropDown(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settlement/GetSettlementDropDown`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getSettlements(showGlobalLoader: boolean = true, body: any, pageNumber: number, pageSize: number) {
    return this._httpService.post(`Settlement/GetSettlementData?pageNumber=${pageNumber}&pageSize=${pageSize}`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getOrderedSchedulerDropDown(showGlobalLoader: boolean = true) {
    return this._httpService.get(`OrderedScheduler/GetOrderedSchedulerDropDown`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getStatusCount(showGlobalLoader: boolean = true) {
    return this._httpService.get(`OrderedScheduler/GetStatusCount`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getOrderedSchedulerData(body: any, pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.post(`OrderedScheduler/GetOrderedSchedulerData?pageNumber=${pageNumber}&pageSize=${pageSize}`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addOrderedSchedulerActivity(body: any, showGlobalLoader: boolean = false) {
    return this._httpService.post(`OrderedScheduler/AddOrderSchedulerActivity`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deleteOrderedSchedulerActivity(showGlobalLoader: boolean = false) {
    return this._httpService.delete(`OrderedScheduler/DeleteOrderSchedulerActivity`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllOrderSchedulerActivity(showGlobalLoader: boolean = false) {
    return this._httpService.get(`OrderedScheduler/GetAllOrderSchedulerActivity`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPrescreeningQuestionData(body: any, showGlobalLoader: boolean = true) {
    return this._httpService.post(`OrderedScheduler/GetPrescreeningQuestionData`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  sendSMSOrderedScheduler(body: any, showGlobalLoader: boolean = true) {
    return this._httpService.post(`OrderedScheduler/SendSms`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getSettleStudyData(showGlobalLoader: boolean = true, settleId: string, internalStudyId: string) {
    return this._httpService.get(`Settlement/GetSettleStudyData?internalStudyId=${internalStudyId}${(settleId ? `&settleId=${settleId}` : '')}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  settleStudy(body: any, showGlobalLoader: boolean = true) {
    return this._httpService.post(`Settlement/SettleStudy`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deleteSettleData(settleId: string, internalStudyId: string, showGlobalLoader: boolean = true) {
    return this._httpService.delete(`Settlement/DeleteSettleRecord?settleId=${settleId}&internalStudyId=${internalStudyId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addSettledNote(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post(`Settlement/AddSettleNote`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  approveSettleStudy(body: any, showGlobalLoader: boolean = true) {
    return this._httpService.post(`Settlement/ApproveSettleStudy`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getSettlementNotes(showGlobalLoader: boolean = true, patientId: string) {
    return this._httpService.get(`Settlement/GetSettlementNotes/${patientId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getUpdatesAndCollectionDropDown(showGlobalLoader: boolean = true) {
    return this._httpService.get(`CollectionsManagement/GetUpdatesAndCollectionDropDown`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  CaseUpdateAndCollection(showGlobalLoader: boolean = true, body: any, pageNumber: number, pageSize: number) {
    return this._httpService.post(`CollectionsManagement/CaseUpdateAndCollection?pageNumber=${pageNumber}&pageSize=${pageSize}`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getActionNeededDropDown(showGlobalLoader: boolean = true) {
    return this._httpService.get(`CollectionsManagement/GetActionNeededDropDown`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getActionNeeded(showGlobalLoader: boolean = true, body: any, pageNumber: number, pageSize: number) {
    return this._httpService.post(`CollectionsManagement/GetActionNeeded?pageNumber=${pageNumber}&pageSize=${pageSize}`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  ResolveStudyData(showGlobalLoader: boolean = true, LogId: number) {
    return this._httpService.post(`CollectionsManagement/ResolveStudies?LogId=${LogId}`, null, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  //////////
  caseUpdateAndCollectionApplyFilterForPatientLevel(showGlobalLoader: boolean = true, body: any, pageSize: any, pageNumber: any) {
    return this._httpService.put(`CaseUpdateAndCollections/CaseUpdateAndCollectionApplyFilterForPatientLevel?pageSize=${pageSize}&pageNumber=${pageNumber}`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  caseUpdateAndCollectionApplyFilterForPatientStudyLevel(showGlobalLoader: boolean = true, body: any, pageSize: any, pageNumber: any) {
    return this._httpService.put(`CaseUpdateAndCollections/CaseUpdateAndCollectionApplyFilterForPatientStudyLevel?pageSize=${pageSize}&pageNumber=${pageNumber}`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  savePreScreeningQuestionData(body: any, showGlobalLoader: boolean = true,) {
    return this._httpService.post(`OrderedScheduler/SavePreScreeningQuestionData`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  SaveAndDontSubmitPreScreeningQuestionData(body: any, showGlobalLoader: boolean = true,) {
    return this._httpService.post(`OrderedScheduler/SaveAndDontSubmitPreScreeningQuestionData`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  GetRxDocumentByPatientId(showGlobalLoader: boolean = true, patientId: any) {
    return this._httpService.get(`OrderedReviewer/GetRxDocumentByPatientId?patientId=${patientId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  SaveOrderedSchedulerLog(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post(`OrderedScheduler/SaveOrderedSchedulerLog`, data, showGlobalLoader,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  UpdateStudyResolve(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post(`CollectionsManagement/UpdateStudyResolve`, data, showGlobalLoader,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  GetPrescreenGridRecord(patientID: string, showGlobalLoader: boolean = true) {
    return this._httpService.get(`OrderedScheduler/GetPrescreenGridRecord?patientId=${patientID}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
}
