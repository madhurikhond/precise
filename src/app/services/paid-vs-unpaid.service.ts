import { Injectable } from '@angular/core';
import { HttpService } from './common/http.service';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class PaidVsUnpaidService {

  constructor(private _httpService: HttpService) { }
  
  getAttorneyReferrerPaidUnpaidStudies(showGlobalLoader : boolean = true ,playerType:string,pageNumber: number, pageSize: number){
    return this._httpService.get(`PaidVsUnpaidBI/GetAttorneyReferrerPaidUnpaidStudies?playerType=${playerType}&pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
}
