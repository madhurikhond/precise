import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonRegex } from 'src/app/constants/commonregex';
import { LanguageOption, PageTitleOption, patientPortalResponseStatus, PatientPortalStatusMessage, PatientPortalURL } from 'src/app/models/patient-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { TokenService } from 'src/app/services/common/token.service';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';

export type LoginFormValue = {
  'phone': string
};

@Component({
  selector: 'app-patient-login',
  templateUrl: './patient-login.component.html',
  styleUrls: ['./patient-login.component.css']
})

export class PatientLoginComponent implements OnInit {

  patientForm: FormGroup;
  currentLanguage: any = 'en';
  setLanguage: boolean = true;
  submitted = false;
  patientId: string;
  uniqueId: string;
  IsShowPatient: boolean = false;
  readonly commonRegex = CommonRegex;

  constructor(private fb: FormBuilder, private activatedroute: ActivatedRoute, public translate: TranslateService,
     private readonly router: Router,private readonly commonMethodService: CommonMethodService,
    private patientPortalService: PatientPortalService, private storageService: StorageService, private tokenService: TokenService) {
    this.patientForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(this.commonRegex.PhoneRegex)]]
    });
    this.clearStorage();
    this.patientId = this.activatedroute.snapshot.queryParams.patientid;
    this.uniqueId = this.activatedroute.snapshot.queryParams.Token;

    if (this.patientId != null && this.patientId.length > 0 && this.patientId != undefined)
      this.IsShowPatient = true;
  }

  ngOnInit(): void {
    this.commonMethodService.setTitle(PageTitleOption.PATIENT_PORTAL);
    this.addJWTToken();
    if (this.currentLanguage == LanguageOption.ES) {
      this.setLanguage = false;
    }
    this.storageService.setPatientLanguage(this.currentLanguage);
    this.translate.use(this.currentLanguage);
  }

  get lgform() { return this.patientForm.controls; }

  onSubmit() {
    if (this.patientForm.invalid) {
      this.submitted = true;
      return false;
    }
    else {
      this.getPatientsByMobileNumber(this.patientForm.controls['phone'].value);
      return true;
    }
  }
  clearStorage() {
    this.storageService.removePatientStudy();
    this.storageService.removePatientPreScreening();
    this.storageService.removePatientPregnancy();
    localStorage.removeItem("p_detail");
    localStorage.removeItem("p_timeout");
  }
  languageChange(lang: any) {
    this.storageService.setPatientLanguage(lang);
    this.translate.use(lang);
  }

  setGlobalLanguageFromURL(lang: any) {
    if (lang == 'spanish') {
      this.currentLanguage = 'es';
      this.storageService.fullLanguageName = 'spanish';
      this.setLanguage = false;
      this.storageService.setPatientLanguage(this.currentLanguage);
    }
    else {
      this.currentLanguage = 'en'
      this.storageService.fullLanguageName = 'english';
      this.setLanguage = true;
      this.storageService.setPatientLanguage(this.currentLanguage);
    }
    this.translate.use(this.currentLanguage);
  }

  addJWTToken() {
    var token = this.storageService.PartnerJWTToken;
    if (token != null) {
      var decodedToken = this.tokenService.getDecodedAccessToken(token);
      var tokenExpiry = new Date(decodedToken.exp * 1000);
      var today = new Date();
      if (tokenExpiry < today)
        this.refreshToken();
      else
        this.getMobileNumber();
    }
    else
      this.refreshToken();
  }

  refreshToken() {

    this.patientPortalService.GetPartnerToken().subscribe((res: any) => {
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success) {
          this.storageService.PartnerId = res.result.partnerId;
          this.storageService.PartnerJWTToken = res.result.jwtToken;
        }
      }
    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    );
    this.getMobileNumber();
  }

  getMobileNumber() {
    if (this.IsShowPatient) {
      var data = {
        patientId: this.patientId,
        uniqueId: this.uniqueId
      }
      this.patientPortalService.GetMobileNumber(data, true).subscribe((res: any) => {
        if (res) {
          if (res.responseStatus == patientPortalResponseStatus.Success) {
            if (res.result.patientPreferredLanguage)
              this.setGlobalLanguageFromURL(res.result.patientPreferredLanguage.toString().toLowerCase());
            if (res.result.cellPhone)
              this.patientForm.controls['phone'].setValue(res.result.cellPhone);
            else if (res.result.homePhone)
              this.patientForm.controls['phone'].setValue(res.result.homePhone);
            else
              this.patientPortalService.errorNotification(PatientPortalStatusMessage.NO_PHONE_NUMBER_FOUND);
          }
        }
      },
        (err: any) => {
          this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
        }
      );
    }
  }

  getPatientsByMobileNumber(phone: string) {
    var data = {
      mobileNumber: phone
    }
    this.patientPortalService.GetPatientsByNumber(data, true).subscribe((res: any) => {
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success && res.result.length > 0) {
          if (res.result[0].patientPreferredLanguage)
          {
            this.setGlobalLanguageFromURL(res.result[0].patientPreferredLanguage.toString().toLowerCase());
            this.storageService.fullLanguageName = res.result[0].patientPreferredLanguage.toString().toLowerCase();
          }

          this.patientPortalService.patientRecords = res.result;
          //data.mobileNumber = '8157809623';
          this.sendVerificationCode(data);
        }
        else
          this.patientPortalService.errorNotification(PatientPortalStatusMessage.PHONE_NUMBER_NOT_REGISTERED);
      }

    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    );

  }

  sendVerificationCode(data: any) {
    this.patientPortalService.SendVerificationCode(data, true).subscribe((res: any) => {
      if (res != undefined) {
        if (res.responseStatus == patientPortalResponseStatus.Success && res.result.isVerificationCodeSent) {
          this.patientPortalService.verificationId = res.result.verificationId;
          this.patientPortalService.mobileNumber = data.mobileNumber;

          if (this.IsShowPatient) {
            this.getPatientByPatientId(this.patientId);
            this.patientPortalService.uniqueId = this.uniqueId;
            this.patientPortalService.patientRecords = this.patientPortalService.patientRecords.filter(x=>x.patientId == this.patientId);
          }
          else if (this.patientPortalService.patientRecords.length == 1) {
            this.patientId = this.patientPortalService.patientRecords[0].patientId;
            this.patientPortalService.uniqueId = this.patientPortalService.patientRecords[0].uniqueId;
            this.getPatientByPatientId(this.patientId);
          }
          else {
            this.router.navigate([PatientPortalURL.PATIENT_CODE_VERIFICATION]);
          }
      }
     }
    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    );
  }

  getPatientByPatientId(patientId: any) {
    var request = {
      patientId: patientId
    }
    this.patientPortalService.GetPatientByPatientId(request, true).subscribe((res: any) => {
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success) {
          this.patientPortalService.patientDetail = res.result;
          this.router.navigate([PatientPortalURL.PATIENT_CODE_VERIFICATION]);
        }
      }

    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    );
  }

}
