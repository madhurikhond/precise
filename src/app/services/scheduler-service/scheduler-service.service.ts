import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/response';
import { HttpService } from '../common/http.service';
import { StorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root'
})
export class SchedulerServiceService {

  constructor(private readonly _httpService:HttpService,private readonly storageService:StorageService,) { }

  getSchedulerById(showGlobalLoader : boolean = true, facilityParentId:number){
    return this._httpService.get(`FacilityScheduler/getschedulerById/` + facilityParentId ,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  createScheduler(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post('FacilityScheduler/createScheduler',body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updateScheduler(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post('FacilityScheduler/updateScheduler',body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  deleteScheduler(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post('FacilityScheduler/deleteScheduler',body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
}
