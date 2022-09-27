import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/response';
import { HttpService } from './common/http.service';

@Injectable()
export class ReferrersService {

  constructor(private _httpService: HttpService, private http: HttpClient) { }

  sendDataToReferrerDetail: EventEmitter<any> = new EventEmitter<any>();
  

   sendDataToReferrerDetailWindow(body:any): void {
    this.sendDataToReferrerDetail.emit(body);
  }

  getAllReferrers(showGlobalLoader : boolean = true ,pageNumber: number, pageSize: number){
    return this._httpService.get(`Facility/GetAllReferrers?pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  exportReferrerExcel(pageNumber: number, pageSize: number, isSearchExport: boolean, searchText: string = null, exiledOption: boolean = null): Observable<Blob> {
    if(isSearchExport){
      return this._httpService.export(`Facility/ExportReferrersSearchData?searchText=${searchText}&exiled=${exiledOption}&pageNumber=${pageNumber}&pageSize=${pageSize}`, null, true);
    }
    else{
      return this._httpService.export(`Facility/ExportExcel?pageNumber=${pageNumber}&pageSize=${pageSize}`, null, true);
    }
    
  }

  getReferrerById(showGlobalLoader : boolean = true ,referrerId :number){
    return this._httpService.get(`Facility/GetReferrerById/`+referrerId, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getReferrerProcGroupByReferrerId(showGlobalLoader : boolean = true ,referrerId :number){
    return this._httpService.get(`Facility/GetReferrerProcGroupByReferrerId/`+referrerId, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  updateReferrer(showGlobalLoader : boolean = true , body :any){
    return this._httpService.put(`Facility/UpdateReferrer`,body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  updateReferrerProcGroup(showGlobalLoader : boolean = true , body :any){
    return this._httpService.put(`Facility/UpdateReferrerProcGroup`,body, showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getReferrersSearch(showGlobalLoader : boolean = true, search : string, exiled:boolean,pageNumber: number, pageSize: number){
    return this._httpService.get(`Facility/GetReferrersSearchData?SearchText=${search}&Exiled=${exiled}&pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getSFTPProfiles(showGlobalLoader : boolean = true){
    return this._httpService.get(`MasterValues/GetSFTPProfiles`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getGroupingNames(showGlobalLoader : boolean = true,searchText:any){
    return this._httpService.get(`MasterValues/getGroupingNames?searchText=${searchText}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getAllDocumentTypes(showGlobalLoader : boolean = true ,pageNumber: number, pageSize: number){
    return this._httpService.get(`MasterDocumentType/GetAllDocumentTypes?pageNumber=${pageNumber}&pageSize=${pageSize}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getAllActiveEpicUsers(showGlobalLoader : boolean = true){
    return this._httpService.get(`Automation/GetAllActiveEpicUsers`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getReferrerNotes(showGlobalLoader : boolean = true,referrerId){
    return this._httpService.get(`Patient/GetReferrerNotes/`+referrerId,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  addPatientNote(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post(`Patient/AddPatientNote`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updatePersistentGridSetting(showGlobalLoader : boolean = true ,body:any){
    return this._httpService.put('MasterValues/UpdatePersistentGridSetting',body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getPersistentGridSetting(showGlobalLoader : boolean = true ,userId:any,pageName:any){
    return this._httpService.get('MasterValues/GetPersistentGridSetting/'+userId+'/'+pageName,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
}
