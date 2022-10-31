import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/response';
import { HttpService } from '../common/http.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { PageModules } from 'src/app/services/common/page-modules';

@Injectable({
  providedIn: 'root'
})
export class BlockLeaseSchedulerService {


  sendDataToCalendarScheduler: EventEmitter<any> = new EventEmitter<any>();

  sendDataToCalendarSchedulerWindow(body: any): void {
    this.sendDataToCalendarScheduler.emit(body);
  }
  
  constructor(private readonly _httpService: HttpService, private readonly storageService: StorageService,) { }
  getScheduleStatusList(showGlobalLoader: boolean = true) {
    return this._httpService.get(`BlockLeaseScheduler/GetScheduleStatusList`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getBlockLeaseSchedulerFilterData(showGlobalLoader: boolean = true, filterBody: any, pageNumber: number, pageSize: number) {
    return this._httpService.post(`BlockLeaseScheduler/GetBlockLeaseSchedulerFilterData?pageNumber=${pageNumber}&pageSize=${pageSize}`, filterBody, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getCalenderModalityResourceDropDownData(showGlobalLoader: boolean = true, FacilityId: string) {
    return this._httpService.get(`BlockLeaseScheduler/GetCalenderModalityResourceDropDownData?FacilityId=${FacilityId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  validateFacilityTimeAndClosedDays(showGlobalLoader: boolean = true, Body: any) {
    return this._httpService.post(`BlockLeaseScheduler/validateFacilityTimeAndClosedDays`, Body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAlreadyBlockedLease(showGlobalLoader: boolean = true, Body: any) {
    return this._httpService.post(`BlockLeaseScheduler/GetAlreadyBlockedLease`, Body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  saveBlockLeaseData(showGlobalLoader: boolean = true, Body: any) {
    return this._httpService.post(`BlockLeaseScheduler/SaveBlockLeaseData`, Body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getBlockLeaseData(showGlobalLoader: boolean = true, FacilityId: string) {
    return this._httpService.get(`BlockLeaseScheduler/GetBlockLeaseData?FacilityId=${FacilityId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllParentFacilitiesByFacilityId(showGlobalLoader: boolean = true, FacilityId: string) {
    return this._httpService.get(`BlockLeaseScheduler/GetAllParentFacilitiesByFacilityId?FacilityId=${FacilityId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addUpdateBlockLeaseCreditReason(showGlobalLoader: boolean = true, Body: any) {
    return this._httpService.post(`BlockLeaseScheduler/AddUpdateBlockLeaseCreditReason`, Body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  manageCredits(showGlobalLoader: boolean = true, Body: any) {
    return this._httpService.post(`BlockLeaseScheduler/ManageCredits`, Body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getBlockLeaseById(showGlobalLoader: boolean = true, LeaseBlockId: number) {
    return this._httpService.post(`BlockLeaseScheduler/GetBlockLeaseById`, LeaseBlockId, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  manageUserSettings(showGlobalLoader: boolean = true, frontendJsonInput: string) {
    return this._httpService.post(`BlockLeaseScheduler/ManageUserSettings`, frontendJsonInput, showGlobalLoader, true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getTotalLeaseAndCreditHoursOnEdit(showGlobalLoader: boolean = true, inputRm: any) {
    return this._httpService.post(`BlockLeaseScheduler/GetTotalLeaseAndCreditHoursOnEdit`, inputRm, showGlobalLoader, true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deleteBlockLeaseById(showGlobalLoader: boolean = true, LeaseBlockId: any) {
    return this._httpService.post(`BlockLeaseScheduler/DeleteBlockLeaseById`, LeaseBlockId, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  approveAndSendLeaseToFacility(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post(`BlockLeaseScheduler/ApproveAndSendLeaseToFacility`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getDashboardFacilityDropDownData(showGlobalLoader: boolean = true, FacilityParentId: any) {
    return this._httpService.post(`BlockLeaseScheduler/GetDashboardFacilityDropDownData`, FacilityParentId, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  saveAutoBlockOffData(showGlobalLoader: boolean = true, Body: any) {
    return this._httpService.post(`BlockLeaseScheduler/SaveAutoBlockOffData`, Body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAlreadyBlockedOffDays(showGlobalLoader: boolean = true, Body: any) {
    return this._httpService.post(`BlockLeaseScheduler/GetAlreadyBlockedOffDays`, Body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res));
  }
  getFacilityCreditsUnUsed(showGlobalLoader: boolean = true, frontendJsonInput: string) {
    return this._httpService.post(`BlockLeaseScheduler/GetFacilityCreditsUnUsed`, frontendJsonInput, showGlobalLoader, true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getUnpaidLeases(showGlobalLoader: boolean = true, frontendJsonInput: string) {
    return this._httpService.post(`BlockLeaseScheduler/GetUnpaidLeases`, frontendJsonInput, showGlobalLoader, true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getTotalAmountToPay(showGlobalLoader : boolean= true,frontendJsonInput:string){
    return this._httpService.post(`BlockLeaseScheduler/GetTotalAmountToPay`,frontendJsonInput,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  validateEmailLinkAndSaveFacilitySign(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post(`BlockLeaseScheduler/ValidateEmailLinkAndSaveFacilitySign`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getLeaseDetail(showGlobalLoader: boolean = true, key: string) {
    return this._httpService.post(`BlockLeaseScheduler/GetLeaseDetail`, key, showGlobalLoader,true).pipe(
      map((res: ApiResponse) => res)
    );   
  }
}

