import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/response';

@Injectable({
  providedIn: 'root'
})
export class AccoutingService {

  constructor(private readonly _httpService:HttpService) { }
  //Get
  getAllCollectionsManagement(showGlobalLoader : boolean = true ,pageNumber: number, pageSize: number){
    return this._httpService.get(`CollectionsManagement/GetAllCollectionsManagement?pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getCollectionsTypes(showGlobalLoader : boolean = true )
  {
    return this._httpService.get(`CollectionsManagement/GetCollectionsTypes`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getCollectionsManagementById(showGlobalLoader : boolean = true ,CompanyID:number){
    return this._httpService.get(`CollectionsManagement/GetCollectionsManagementById?id=${CompanyID}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  addCollectionsManagement(showGlobalLoader : boolean = true ,body:any){
    return this._httpService.put(`CollectionsManagement/AddCollectionsManagement`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updateCollectionsManagement(showGlobalLoader : boolean = true ,body:any){
    return this._httpService.post(`CollectionsManagement/UpdateCollectionsManagement`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getPaymentHistoryDropDown(showGlobalLoader : boolean = true){
    return this._httpService.get(`Payment/GetPaymentHistoryDropDown`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getPaymentHistory(showGlobalLoader: boolean = true, body: any, pageNumber: number, pageSize: number){
    return this._httpService.post(`Payment/GetPaymentHistory?pageNumber=${pageNumber}&pageSize=${pageSize}`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getCheckPatientDetail(showGlobalLoader : boolean = true, arPaymentId: number){
    return this._httpService.get(`Payment/GetCheckPatientDetail/${arPaymentId}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  deletePaymentHistory(showGlobalLoader: boolean = true, transactionIds: string){
    return this._httpService.delete(`Payment/DeletePaymentHistory/${transactionIds}`, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getPatientPaymentCheck(showGlobalLoader : boolean = true, patientId: string, fileName: string){
    return this._httpService.get(`Payment/GetPatientPaymentCheck/${patientId}/${fileName}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getSettlementDropDown(showGlobalLoader : boolean = true){
    return this._httpService.get(`Settlement/GetSettlementDropDown`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getReceivePaymentDropDown(showGlobalLoader : boolean = true){
    return this._httpService.get(`ReceivePayments/GetReceivePaymentDropDown`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getARPaymentData(showGlobalLoader: boolean = true, body: any, pageNumber: number, pageSize: number){
    return this._httpService.post(`ReceivePayments/TopGridSearchData?pageNumber=${pageNumber}&pageSize=${pageSize}`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  CreateARPayments(showGlobalLoader:boolean=true,body:any){
    return this._httpService.post(`ReceivePayments/CreateARPayments`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  GetPendingCheque(showGlobalLoader : boolean = true, userID )
  {
    return this._httpService.get(`ReceivePayments/GetPendingCheque?userID=${userID}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  CreateARPaidStudies(showGlobalLoader:boolean=true, body:any){
    return this._httpService.post(`ReceivePayments/CreateARPaidStudies`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  ArPaymentUpdate(showGlobalLoader : boolean = true,body:any){
    return this._httpService.put('ReceivePayments/ArPaymentUpdate',body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getBottomGrid(showGlobalLoader : boolean = true, pageNumber: number, pageSize: number, userID : number )
  {
    return this._httpService.get(`ReceivePayments/BottomGridData?pageNumber=${pageNumber}&pageSize=${pageSize}&userID=${userID}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  removeChecks(showGlobalLoader: boolean = true, body:any){
    return this._httpService.post(`ReceivePayments/RemoveChecks`,body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getARBottomGridDetail(showGlobalLoader : boolean = true, arPaymentId: number){
    return this._httpService.get(`ReceivePayments/GetARBottomGridDetail?ArpaymentId=${arPaymentId}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  removeChecksandPayment(showGlobalLoader: boolean = true, arPaymentId : String){
    return this._httpService.get(`ReceivePayments/RemoveChecksandPayment?ArpaymentId=${arPaymentId}`, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  ExportAllChecks(showGlobalLoader: boolean = true, userId : String){
    return this._httpService.get(`ReceivePayments/ExportAllChecks?userId=${userId}`, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

}
