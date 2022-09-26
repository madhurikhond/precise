import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';
//import { Local } from 'protractor/built/driverProviders';

@Injectable()
export class LoadingInterceptorService {

  constructor(private loadingService: LoadingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
    // emit onStarted event before request execution
    if (req.headers.get('Loader'))
      this.loadingService.onStarted(req);
    return next
      .handle(req)
      // emit onFinished event after request execution
      .pipe(finalize(() => {        
        this.loadingService.onFinished(req)
      }));   
  }
}
