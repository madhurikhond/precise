import { Injectable } from '@angular/core';
import { HttpService } from './common/http.service';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class AutodialerService {

  constructor(private _httpService: HttpService) { }
  //  #region Bi-> Auto Dialer
  //Get
  getTwilioCallingHistory(showGlobalLoader : boolean = true){
    return this._httpService.get(`AutoDialer/GetTwilioCallingHistory`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
//#endregion
}
