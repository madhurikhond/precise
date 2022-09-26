import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/response';
import { HttpService } from './common/http.service';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  
  @Output() filterResult = new EventEmitter<any>();
  private searchTextBox = new Subject<string>();
  @Output() clearClickedEvent = new EventEmitter<string>();

  constructor(private _httpService: HttpService) { }

  public setTextFilter(): Observable<string> {
    return this.searchTextBox.asObservable();
  }
  getCommunicationText(searchText:any){
    this.filterResult.emit({searchText});
  }
  clearFilters(msg:string) {
    this.clearClickedEvent.emit(msg);
 }

  getAllOutBound(showGlobalLoader : boolean = true, searchText : any ,pageNumber: number, pageSize: number){
    return this._httpService.get(`Log/GetOutboundLogs?searchText=${searchText}&pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getAllAttyBills(showGlobalLoader : boolean = true, searchText : any, pageNumber: number, pageSize: number){
    return this._httpService.get(`Log/GetAttorneyBillLogs?searchText=${searchText}&pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getAllFailure(showGlobalLoader : boolean = true, searchText : any ,pageNumber: number, pageSize: number){
    return this._httpService.get(`Log/GetFailedLogs?searchText=${searchText}&pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

}
