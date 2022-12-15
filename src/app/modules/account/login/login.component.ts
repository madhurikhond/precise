import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { noWhitespaceValidator } from '../../shared/directives/noWhitespace.validator';
// import { AuthService } from '../../../services/common/auth.service';
import { NotificationService } from '../../../services/common/notification.service';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { StorageService } from 'src/app/services/common/storage.service';
import { Router } from '@angular/router';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PageModules } from 'src/app/services/common/page-modules';
import { CommonRegex } from 'src/app/constants/commonregex';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { RADIOLOGIST_TYPE } from 'src/app/constants/route.constant';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
import { LienPortalURLName } from 'src/app/models/lien-portal-response';


declare const $: any;

export type LoginFormValue = {
  'email': string,
  'password': string
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // @HostListener('window:popstate', ['$event'])
  // onPopState(event) {
  //   this.commonMethodService.setTitle('Login');
  // }
  private loggedInUser: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  loginForm: FormGroup;
  submitted = false;
  loading: boolean = false;
  freshLogin: string;
  redirectLinkWithPermission: any;
  readonly commonRegex = CommonRegex;
  constructor(private fb: FormBuilder,
    private readonly accountService: AccountService,
    private readonly storageService: StorageService,
    private readonly patientPortalService: PatientPortalService,
    private readonly lienPortalService: LienPortalService,
    private readonly commonMethodService: CommonMethodService,
    private readonly router: Router,
    private readonly notificationService: NotificationService) {
    this.loggedInUser = new BehaviorSubject<any>('');
    this.currentUser = this.loggedInUser.asObservable();
    
  }
  public get currentUserValue(): any {
    return this.loggedInUser.value;
  }
  ngOnInit(): void {
    if (this.checkIsLoggedIn()) {
      //this.router.navigate(['dashboard']);
      this.redirectLinkWithPermission = this.redirectLinkPremission(this.storageService.UserRole)
      if(this.storageService.user.UserType === RADIOLOGIST_TYPE)
      {
        this.storageService.LastPageURL = null;
        this.onLienPortalLogin();
      }else{
        this.patientPortalService.refreshToken();
        this.lienPortalService.refreshLienToken();
        this.router.navigate((this.storageService.LastPageURL === null || this.storageService.LastPageURL === '') ? [this.redirectLinkWithPermission] : [this.storageService.LastPageURL]);
      }
    }
    else {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.pattern(this.commonRegex.EmailRegex)]],
        password: ['', [Validators.required, noWhitespaceValidator]],
        keepSignIn: [false]
      });

      this.commonMethodService.setTitle('Login');
    }
    // $(".modal-backdrop" ).remove();
  }

  get lgform() { return this.loginForm.controls; }
  //Method used for Is user logged in 
  checkIsLoggedIn() {
    if (this.storageService.user != null) {
      var tokenExpiry = new Date(this.storageService.user.exp * 1000);
      var today = new Date();
      if (tokenExpiry < today) {
        this.router.navigate(['login']);
        this.storageService.clearAll();
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }
  //Method to submit  form  for login
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value as (LoginFormValue);
    (this.accountService.login({
      Email: email,
      Password: password
    })).subscribe((res: any) => {
      if (res) {
        this.freshLogin = 'true';
        this.storageService.setFreshLogin = this.freshLogin
        this.storageService.JWTToken = res.token;
        this.storageService.JWTTokenRoles = res.roles;
        this.storageService.settCurrentUser(res.authentication.response);
        if (this.storageService.user.UserType === RADIOLOGIST_TYPE) {
          this.storageService.LastPageURL = null;
          this.lienPortalService.refreshLienToken();
          this.onLienPortalLogin();
        } else {
          if(this.storageService.LastPageURL == LienPortalURLName.LIEN_PORTAL || this.storageService.LastPageURL == LienPortalURLName.LIEN_PORTAL_SETTINGS)
            this.storageService.LastPageURL = '';
          this.redirectLinkWithPermission = this.redirectLinkPremission(this.storageService.UserRole)
          this.router.navigate((this.storageService.LastPageURL === null || this.storageService.LastPageURL === '') ? [this.redirectLinkWithPermission] : [this.storageService.LastPageURL]);
        }


        this.accountService.getValidToken(true);

        //this.storageService.UserRole = res.authentication.message;

        //New code created by Ajay for FacilityBilling
        // if(res.authentication.response.groupName){
        //     this.accountService.getPagePermission(res.authentication.response.groupName).subscribe((res:any)=>{             
        //       if (res) {            
        //         this.storageService.UserRole =  res.response;
        //       }
        //     });           
        //   }

        //   if(res.authentication.response.groupName.toLowerCase() === 'facility'){ 
        //     if (this.storageService.UserRole) {
        //           var data = JSON.parse(JSON.stringify(this.storageService.UserRole));                 
        //           let uPermission =  data.filter((object) =>  object.Module === PageModules.FacilityBilling);                   
        //             if(uPermission.length>0){
        //                 if(uPermission[0].IsView==true && res.authentication.response.assignFacilityDId){ 
        //                   this.router.navigate((this.storageService.LastPageURL == null || this.storageService.LastPageURL == '') ? ['facilities/facility-billing/'] : [this.storageService.LastPageURL]);                   
        //                 }
        //             }else{
        //               this.router.navigate((this.storageService.LastPageURL == null || this.storageService.LastPageURL == '') ? ['dashboard'] : [this.storageService.LastPageURL]);
        //              }
        //       }
        //   }
        // else{
        //    this.router.navigate((this.storageService.LastPageURL == null || this.storageService.LastPageURL == '') ? ['dashboard'] : [this.storageService.LastPageURL]);
        //   }

      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: null,
          alertMessage: err.error.message,
          alertType: ResponseStatusCode.InternalError
        })
      }
    );
  }

  onLienPortalLogin() {
    var expirydate = this.storageService.addHours(24);
    this.storageService.LienTimeout = expirydate.toJSON();
    this.router.navigate(['lien-portal']);
  }
  //Method to reset form 
  onReset() {
    this.submitted = false;
    this.loginForm.reset();
  }
  redirectLinkPremission(data: any) {
    var valReturn: any;
    let list: any = [];
    let responseHierarchy = JSON.parse(data);
    if (responseHierarchy && responseHierarchy.length) {
      responseHierarchy.forEach((value) => {
        if (value && value.hierarchy) {
          value.hierarchy = JSON.parse(value.hierarchy);
        }
      });
    }
    for (let i = 0; i < responseHierarchy.length; i++) {
      list.push(responseHierarchy[i].hierarchy);
      if (list[0].Url !== '') {
        valReturn = list[0].Url
      }
      else if (list[0].Url == '' && list[0].Children) {
        valReturn = list[0].Children[0].Url
      }
    }
    return valReturn;
  }
}
