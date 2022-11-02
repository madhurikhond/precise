import { EventEmitter, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/response';
import { HttpService } from './common/http.service';

@Injectable({
  providedIn: 'root'
})
export class BrokerService {

  sendDataToBrokerFromPatientDetail: EventEmitter<any> = new EventEmitter<any>();
  sendDataToBrokerFromOrderedSchedular: EventEmitter<any> = new EventEmitter<any>();
  sendDataToLoaderComponentFromBrokerComponent: EventEmitter<any> = new EventEmitter<any>();
  constructor(private _httpService: HttpService) { }

  //    A L L    T Y P E S    OF    H T T P     M E T H O D S

  // deleteQBAccount(showGlobalLoader : boolean = true, id: number){
  //   return this._httpService.delete(`Settings/DeleteQBAccount/${id}`,showGlobalLoader).pipe(
  //     map((res:ApiResponse) => res)
  //   );
  // }
  sendDataToBrokerFromPatientDetailWin(body:any): void {
    this.sendDataToBrokerFromPatientDetail.emit(body);
  }

  sendDataToBrokerFromOrderedSchedularComponent(body:any): void {
    this.sendDataToBrokerFromOrderedSchedular.emit(body);
  }
  sendDataToLoaderFromBrokerComponent(body:any): void {
    this.sendDataToLoaderComponentFromBrokerComponent.emit(body);
  }
  addBroker(showGlobalLoader : boolean = true, body:any){
    return this._httpService.post('Broker/AddBroker', body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  updateBroker(showGlobalLoader : boolean = true,body:any){
    return this._httpService.put('Broker/UpdateBroker',body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getBrokerDropwdowns(showGlobalLoader : boolean = true){
    return this._httpService.get(`Broker/GetBrokerDropwdowns`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getBrokerFacilityPricing(showGlobalLoader : boolean = true, id: number){
    return this._httpService.get(`Broker/GetBrokerFacilityPricing${(id) ? '/' + id : ''}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getBrokerById(showGlobalLoader : boolean = true, id: number){
    return this._httpService.get(`Broker/GetBrokerById/${id}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getAllBrokers(pageNumber: number, pageSize: number, showGlobalLoader : boolean = true){
    return this._httpService.get(`Broker/GetAllBrokers?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getBrokerPricingExportData(showGlobalLoader : boolean = true, BrokerId: number){
    return this._httpService.get(`Broker/GetBrokerPricingExportData/${BrokerId}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getPricingData(showGlobalLoader : boolean = true, brokerId: number){
    return this._httpService.get(`Broker/GetBrokerPricingData/${brokerId}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  
  sendEmailBroker(showGlobalLoader : boolean = true,sendEmailData:any){  
    return this._httpService.post('Broker/sendEmailBroker',sendEmailData,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  emptyTempDirectory(showGlobalLoader : boolean = true){
    return this._httpService.get('Broker/EmptyDirectory',showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getBrokerSearch(showGlobalLoader : boolean = true, search : string, pageNumber: number, pageSize: number){
    return this._httpService.get(`Broker/GetBrokerSearchData?SearchText=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

}
