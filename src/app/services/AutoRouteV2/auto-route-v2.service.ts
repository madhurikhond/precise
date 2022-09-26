import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/response';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AutoRouteV2Service {

  constructor(private readonly _httpService:HttpService,private readonly _http:HttpClient) { }

  UploadFileToAutoRoute(showGlobalLoader : boolean = true,fromData:FormData):Observable<ApiResponse>{  
    return this._httpService.post('AutoRouteV2/UploadFileToAutoRoute',fromData,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getAutoRouteV2GetFileExtension(showGlobalLoader : boolean = true){
    return this._httpService.get('AutoRouteV2/AutoRouteV2GetFileExtension',showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getAutoRouteMasterDocumentType(showGlobalLoader : boolean = true){
    return this._httpService.get('AutoRouteV2/GetAutoRouteMasterDocumentType',showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  UpdateAlerts_AutoRoute(showGlobalLoader : boolean = true,alertList:any){  
    return this._httpService.post('AutoRouteV2/UpdateAlerts_AutoRoute',alertList,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  MergsPdfFiles_AutoRoute(showGlobalLoader : boolean = true,MergPdfList:any){  
    return this._httpService.post('AutoRouteV2/MergsPdfFiles',MergPdfList,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  UploadFileSplitBarCodesRead(showGlobalLoader : boolean = true,fromData:FormData):Observable<ApiResponse>{  
    return this._httpService.post('AutoRouteV2/UploadFileSplitBarCodesRead',fromData,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  async MultipleFileSplitBarCodesRead(showGlobalLoader : boolean = true,fromData:FormData){  
    return await this._httpService.post('AutoRouteV2/UploadFileSplitBarCodesRead',fromData,showGlobalLoader).toPromise();
  }

  
  getRadiologistDropdown(showGlobalLoader : boolean = true){
    return this._httpService.get('AutoRouteV2/GetAutoRouteRadiologist',showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }

  getEmptyDirectory(showGlobalLoader : boolean = true,UserId:any){
    return this._httpService.get('AutoRouteV2/EmptyDirectory/'+UserId,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  UpdateDoNotSplitFilesReadBarCodes(showGlobalLoader : boolean = true,inputJson:any){  
    return this._httpService.post('AutoRouteV2/UpdateDoNotSplitFilesDoNotReadBarCodes',inputJson,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  GetDoNotSplitFilesReadBarCodes(showGlobalLoader : boolean = true,inputJson:any){  
    return this._httpService.post('AutoRouteV2/GetDoNotSplitFilesReadBarCodes',inputJson,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  
   
}



