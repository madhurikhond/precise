import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/response';
import { HttpService } from '../common/http.service';


@Injectable()
export class RadPortalService {

  private LienCompany = new BehaviorSubject({});
  LienCompany$ = this.LienCompany.asObservable();

  private HoldLienCompany = new BehaviorSubject({});
  HoldLienCompany$ = this.HoldLienCompany.asObservable();

  constructor(private readonly _httpService: HttpService) {

  }
  setLienCompany(oModel: any) {
    this.LienCompany.next(oModel);
  }
  setHoldLienCompany(oModel: any) {
    this.HoldLienCompany.next(oModel);
  }
  getAllAssignAndPendingToBeReadStudies(showGlobalLoader: boolean = true, oModel: any) {
    return this._httpService.post(`RadPortal/GetAssignedAndPendingToBeRead`,oModel, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getRadPortalTabs(showGlobalLoader : boolean = true){
    return this._httpService.get('RadPortal/GetRadPortalTabs',showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updateRadPortalTab(showGlobalLoader: boolean = true, body: any){
    return this._httpService.post(`RadPortal/UpdateRadPortalTab`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getAllSignedAndPendingBillStudies(showGlobalLoader: boolean = true, oModel: any) {
    return this._httpService.post(`RadPortal/GetSignedAndPendingBill`,oModel, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllBiiledAndLiensSoldStudies(showGlobalLoader: boolean = true, oModel: any) {
    return this._httpService.post(`RadPortal/GetBilledAndLiensSold`,oModel, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllBiiledAndLiensHeldStudies(showGlobalLoader: boolean = true, oModel: any) {
    return this._httpService.post(`RadPortal/GetBilledAndLiensHeld`,oModel, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  GetLienCompanies(pageNumber,pageSize,id, showGlobalLoader: boolean = true) {
    return this._httpService.get(`RadPortal/GetLienHoldingCompanies?pageNumber=${pageNumber}&pageSize=${pageSize}&id=${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse)=> res)
    );
  }
  GetLienCompanyDetails(id?: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`RadPortal/GetLienHoldingCompanyDetails/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse)=> res)
    );
  }
  postLienHoldingCompany(showGlobalLoader: boolean = true, oModel: any) {
    return this._httpService.post(`RadPortal/UpdateLienHoldingCompany`,oModel, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  postSellLien(showGlobalLoader: boolean = true, oModel: any) {
    return this._httpService.post(`RadPortal/SellLien`,oModel, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  postUpdateRadQC(showGlobalLoader: boolean = true, oModel: any) {
    return this._httpService.post(`RadPortal/UpdateRadQC`,oModel, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
}
