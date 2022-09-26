import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiUrl: string;
  header: any;
  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.baseUrl}/v${environment.currentVersion}/`;
    this.header = new HttpHeaders();
  }

  //  HTTP `POST`
  post(url: string, postData: any, isShowGlobalLoader:boolean,isJSONTypeAdd=false) {
    let headers = new HttpHeaders();
    if(isShowGlobalLoader)
    headers = headers.set('Loader', 'true');
    if(isJSONTypeAdd)
       headers = headers.set('Content-Type', 'application/json');
    return this.http.post(this.apiUrl + url, postData, { headers: headers }).pipe(map(res => {
      return res;
    }));
  }

  //  HTTP `GET`
  get(url: string, isShowGlobalLoader:boolean) {
    let headers = new HttpHeaders();
    if(isShowGlobalLoader)
      headers = headers.set('Loader', 'true');
    return this.http.get(this.apiUrl + url, { headers: headers }).pipe(map(res => {
      return res;
    }));
  }

  //  HTTP `PUT`
  put(url: string, putData: any, isShowGlobalLoader:boolean) {
    let headers = new HttpHeaders();
    if(isShowGlobalLoader)
      headers = headers.set('Loader', 'true');
    return this.http.put(this.apiUrl + url, putData,{ headers: headers }).pipe(map(res => {
      return res;
    }));
  }

  //  HTTP `DELETE`
  delete(url: string, isShowGlobalLoader:boolean) {
    let headers = new HttpHeaders();
    if(isShowGlobalLoader)
      headers = headers.set('Loader', 'true');
    return this.http.delete(this.apiUrl + url).pipe(map(res => {
      return res;
    }));
  }

   //  HTTP `POST` for file download
   export(url: string, postData: any, isShowGlobalLoader:boolean) {
    let headers = new HttpHeaders();
    if(isShowGlobalLoader)
      headers = headers.set('Loader', 'true');
      return this.http.post<Blob>(this.apiUrl + url, postData, { headers: headers, responseType: 'blob' as 'json' }).pipe(map(res => {
        return res;
      }));
  }
}
