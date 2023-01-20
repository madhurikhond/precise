import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, mergeMap, tap } from 'rxjs/operators';
import { lienPortalrootPath, patientrootPath, rootPath } from '../../../constants/api.constant';
import { AUTH_HEADER } from '../../../constants/route.constant';
import { StorageService } from 'src/app/services/common/storage.service';
import { AccountService } from 'src/app/services/account.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PatientPortalURLName } from 'src/app/models/patient-response';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
import { LienPortalURLName } from 'src/app/models/lien-portal-response';

declare const $: any;


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  matches = [];
  constructor(private readonly _accountService: AccountService,
    private readonly storageService: StorageService,
    private readonly patientPortalService: PatientPortalService,
    private readonly lienPortalService: LienPortalService,
    private readonly _storageService: StorageService,
    private readonly _router: Router, private route: ActivatedRoute,
   ) {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      let url = this._router.url.toLocaleLowerCase();
      if (url.indexOf('/login') < 0 &&
        url.indexOf('/subpoena-pickup-status') < 0 &&
        url.indexOf('/esign') < 0 &&
        url.indexOf('/login-request') < 0 &&
        url.indexOf('/contact-us') < 0 &&
        url.indexOf('/forgot-password') < 0 &&
        url.indexOf('/unauthorize-access') < 0 &&
        url.indexOf('/prescreengrid') < 0 &&
        url.indexOf('/patient/esignrequest') < 0 &&
        url.indexOf('/bi') < 0 &&
        url.indexOf('/reset-password') < 0 &&
        url.indexOf('/facility-esign') < 0 &&
        url.indexOf(PatientPortalURLName.PATIENT_PORTAL) < 0) {
        this._storageService.LastPageURL = this._router.url;
      }
      
      if ( url.indexOf(PatientPortalURLName.ESIGN_REQUEST) > -1 || 
      url === PatientPortalURLName.PATIENT_PORTAL || 
      url === PatientPortalURLName.PATIENT_BASIC_CONTACT_INFO || 
      url === PatientPortalURLName.PATIENT_CODE_VERIFICATION || 
      url === PatientPortalURLName.MULTIPLE_RECORD_FOUND || 
      url === PatientPortalURLName.PATIENT_ADDRESS_CONTACT_INFO || 
      url === PatientPortalURLName.PATIENT_CONTACT_INFO || 
      url === PatientPortalURLName.PATIENT_EMERGENCY_CONTACT_INFO || 
      url === PatientPortalURLName.PATIENT_ATTORNEY_CONTACT_INFO || 
      url === PatientPortalURLName.PRE_SCREENING_QUESTION || 
      url === PatientPortalURLName.PATIENT_HOME || 
      url === PatientPortalURLName.MY_APPOINTMENT || 
      url === PatientPortalURLName.PATIENT_DASHBOARD || 
      url === PatientPortalURLName.EXAM_QUESTION || 
      url === PatientPortalURLName.EXAM_QUESTION_FOR_US || 
      url === PatientPortalURLName.EXAM_QUESTION_FOR_CT_CR ||
      url === PatientPortalURLName.PREGNANCY_WAIVER ||
      url === PatientPortalURLName.PREGNANCY_WAIVERS) {
        this._storageService.LastPageURL = null;
        this.makeActive();
      }
      else if(url === LienPortalURLName.LIEN_PORTAL || url === LienPortalURLName.LIEN_PORTAL)
      {
        this._storageService.LastPageURL = null;
        this.makeActiveTAB();
        this.makeActive();
      }
      else{
        this.makeActiveTAB();
        this.makeActive();
      }
    });
  }

  makeActiveTAB() {
    this.matches = [];
    var data = this.storageService.UserRole;
    if (data) {
      let list: any = [];
      let responseHierarchy = JSON.parse(data);
      if (responseHierarchy && responseHierarchy.length) {
        responseHierarchy.forEach(value => {
          if (value && value.hierarchy) {
            value.hierarchy = JSON.parse(value.hierarchy);
          }
        })
      }
      for (let i = 0; i < responseHierarchy.length; i++) {
        list.push(responseHierarchy[i].hierarchy);
      }
      var currentUrl = this.route['_routerState'].snapshot.url;
      if (currentUrl) {
        if (currentUrl.lastIndexOf('/') != -1) {
          let currentUrlItem = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1)
          if (currentUrlItem) {
            this.filter(list, currentUrlItem.toLowerCase());
            if (this.matches.length === 1) {
              this.UpdateActive();
            } else {
              currentUrlItem = currentUrlItem.substring(0, currentUrlItem.length - 1);
              currentUrlItem = currentUrlItem.substring(0, currentUrlItem.lastIndexOf('/') + 1);
              if (currentUrlItem) {
                this.filter(list, currentUrlItem.toLowerCase());
                if (this.matches.length === 1) {
                  this.UpdateActive();
                }else {
                  currentUrlItem = currentUrlItem.substring(0, currentUrlItem.length - 1);
                  currentUrlItem = currentUrlItem.substring(0, currentUrlItem.lastIndexOf('/') + 1);
                  if (currentUrlItem) {
                    this.filter(list, currentUrlItem.toLowerCase());
                    if (this.matches.length === 1) {
                      this.UpdateActive();
                    }
                  }
                }
              } 
            }
          }
        }
      }
    }
  }
  filter(arr, term) {
    arr.forEach((i) => {
      if (i.Url.includes(term)) {
        this.matches.push(i);
      }
      if (i.Children.length > 0) {
        this.filter(i.Children, term);
      }
    });
  }
  makeActive() {
    $('.left-menu').find('.nav-link').removeClass('active jClass');
    setTimeout(() => {
      for (let index = 0; index < 2; index++) {
        $('.left-menu').find('.nav-link.active').parents('ul').parents('li').children(0).addClass('active jClass')
      }
    }, 1000);
  }

  UpdateActive() {
    const ModuleId = this.matches[0].ModuleId;
    $('.left-menu').find('.nav-link').removeClass('active jClass');
    setTimeout(() => {
      for (let index = 0; index < 2; index++) {
        $('.left-menu').find(`#data_${ModuleId}`).parents('ul').parents('li').children(0).addClass('active jClass')
        $(`#data_${ModuleId}`).addClass('active');
      }
    }, 1000);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let req = request;

    if(req.url.includes(patientrootPath))
    {
      if(!this.storageService.pJWTValid)
      {

        return this.patientPortalService.GetPartnerToken()
              .pipe(
                mergeMap(configData => {
                  this._storageService.PartnerJWTToken = configData.result.jwtToken;
                  this._storageService.PartnerId = configData.result.partnerId;
                  req.body.jwtToken = this.storageService.PartnerJWTToken;
                  req.body.loggedPartnerId = this.storageService.PartnerId;
                  req = req.clone({
                    setHeaders: {
                      [AUTH_HEADER]: `Bearer ${this._storageService.PartnerJWTToken}`
                    }
                  });
                  return next.handle(req);
              })
              );
      }
      else{
        
        req = req.clone({
          setHeaders: {
            [AUTH_HEADER]: `Bearer ${this._storageService.PartnerJWTToken}`
          }
        });
        return next.handle(req);
      }
    }
    else if(req.url.includes(lienPortalrootPath))
    {
      if(!this.storageService.L_JWTValid)
      {

        return this.lienPortalService.GetLienPartnerToken()
              .pipe(
                mergeMap(configData => {
                  this._storageService.LienJWTToken = configData.result.jwtToken;
                  this._storageService.PartnerId = configData.result.partnerId;
                  req.body.jwtToken = this.storageService.LienJWTToken;
                  req.body.loggedPartnerId = this.storageService.PartnerId;
                  req = req.clone({
                    setHeaders: {
                      [AUTH_HEADER]: `Bearer ${this._storageService.LienJWTToken}`
                    }
                  });
                  return next.handle(req);
              })
              );
      }
      else{
        
        req = req.clone({
          setHeaders: {
            [AUTH_HEADER]: `Bearer ${this._storageService.LienJWTToken}`
          }
        });
        return next.handle(req);
      }
    }
    else{
    if (this._accountService.isTokenValid) {
      req = req.clone({
        setHeaders: {
          [AUTH_HEADER]: `Bearer ${this._storageService.JWTToken}`
        }
      });
    }

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.url.includes(rootPath)) {
          const header = event.headers.get(AUTH_HEADER);
          if (header) {
            this._storageService.JWTToken = header;
          }
        }
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this._storageService.clearAll();
          this._router.navigate(['login']);
        }
        return throwError(err);
      })
    );
  }
  }
}
