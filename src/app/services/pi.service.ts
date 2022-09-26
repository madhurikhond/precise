import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/response';
import { HttpService } from './common/http.service';

@Injectable({
  providedIn: 'root'
})
export class PiService {

  constructor(private _httpService: HttpService) { }

  getUserProData(showGlobalLoader : boolean = true ,userId: number){
    return this._httpService.get(`PI/GetUserProRata/`+userId,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  calculateProRata(showGlobalLoader : boolean = true , body :any){
    return this._httpService.post(`PI/CalculateProRata`,body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getPatientDeatil(showGlobalLoader : boolean = true ,pageNumber: number, pageSize: number){
    return this._httpService.get(`PI/GetPatientDetail?pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getPatientStudyDetail(showGlobalLoader : boolean = true ,patientId: any){
    return this._httpService.get(`PI/GetPatientStudyDetail?patientId=${patientId}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

}
