import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { PatientPortalStatusCode } from "src/app/constants/patient-portal-status-code.enum";
import { ResponseStatusCode } from "src/app/constants/response-status-code.enum";
import { LanguageOption, PageTitleOption, PatientFinancialTypeName, patientPortalResponseStatus, PatientPortalStatusMessage, PatientPortalURL } from "src/app/models/patient-response";
import { CommonMethodService } from "src/app/services/common/common-method.service";
import { NotificationService } from "src/app/services/common/notification.service";
import { StorageService } from "src/app/services/common/storage.service";
import { PatientPortalService } from "src/app/services/patient-portal/patient.portal.service";

@Component({
  selector: "app-patient-code-verification",
  templateUrl: "./patient-code-verification.component.html",
  styleUrls: ["./patient-code-verification.component.css"],
})
export class PatientCodeVerificationComponent implements OnInit {
  codeVerificationForm: FormGroup;
  currentLanguage: any = "en";
  setLanguage: boolean = true;
  code: string;
  mobileNumber: string;

  constructor(public translate: TranslateService, private storageService: StorageService,private readonly commonMethodService: CommonMethodService,
    private readonly patientPortalService: PatientPortalService, private readonly notificationService: NotificationService,
    private fb: FormBuilder, public router: Router, private elementRef: ElementRef) {

    document.addEventListener("paste", function (e) {
      var data = e.clipboardData.getData("Text");
      if (/^-?[\d.]+(?:e-?\d+)?$/.test(data) == true) {
        var content = Array.from(data);
        [].forEach.call(
          document.querySelectorAll("input[type=text]"),
          (node, index) => {
            node.value = content[index];
            node.focus();
          }
        );
      }
    });

    this.codeVerificationForm = this.fb.group({
      code1: ['', Validators.required],
      code2: ['', Validators.required],
      code3: ['', Validators.required],
      code4: ['', Validators.required],
      code5: ['', Validators.required],
      code6: ['', Validators.required]
    });
    this.mobileNumber = this.patientPortalService.mobileNumber.substring(0, 3) + '-' + this.patientPortalService.mobileNumber.substring(3, 6) + '-' + this.patientPortalService.mobileNumber.substring(6, 10);
  }

  ngOnInit() {
    this.commonMethodService.setTitle(PageTitleOption.MOBILE_VERIFICATION);
    this.currentLanguage = this.storageService.getPatientLanguage();
    if (this.currentLanguage == LanguageOption.ES) {
      this.setLanguage = false;
    }
    this.translate.use(this.currentLanguage);
  }

  get lgform() { return this.codeVerificationForm.controls; }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.querySelector('#six')
      .addEventListener('focus', this.onSubmit.bind(this));
  }

  onSubmit() {

    this.codeVerificationForm = this.fb.group({
      code1: [this.elementRef.nativeElement.querySelector("#one").value, Validators.required],
      code2: [this.elementRef.nativeElement.querySelector("#two").value, Validators.required],
      code3: [this.elementRef.nativeElement.querySelector("#three").value, Validators.required],
      code4: [this.elementRef.nativeElement.querySelector("#four").value, Validators.required],
      code5: [this.elementRef.nativeElement.querySelector("#five").value, Validators.required],
      code6: [this.elementRef.nativeElement.querySelector("#six").value, Validators.required]
    });
    this.checkEmpty();
  }

  keytab(event) {
    let element = event.srcElement.nextElementSibling;

    if (event.keyCode === 8) {
      event.srcElement.previousSibling.focus();
    } else if (
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105)
    ) {
      element.focus();
    }
  }

  checkEmpty() {
    if (this.codeVerificationForm.valid) {
      this.code = this.codeVerificationForm.controls['code1'].value + this.codeVerificationForm.controls['code2'].value +
        this.codeVerificationForm.controls['code3'].value + this.codeVerificationForm.controls['code4'].value +
        this.codeVerificationForm.controls['code5'].value + this.codeVerificationForm.controls['code6'].value
      this.VerifyVerificationCode(this.code);
    }
  }

  languageChange(lang: any) {
    this.storageService.setPatientLanguage(lang);
    this.translate.use(lang);
  }

  VerifyVerificationCode(code: string) {
    var data = {
      verificationCode: code,
      verificationId: this.patientPortalService.verificationId
    }
    this.patientPortalService.VerifyVerificationCode(data, true).subscribe((res: any) => {
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success && res.result.isVerificationCodeVerified) {
            var expirydate = this.storageService.addHours(24);
            this.storageService.PTimeout = expirydate.toJSON();
            if (this.patientPortalService.patientRecords.length > 1) {
                  this.router.navigate([PatientPortalURL.MULTIPLE_RECORD_FOUND]);
              }
              else {
                var patient = this.patientPortalService.patientRecords[0];
                this.patientPortalService.patientDetail.pageCompleted = patient.pageCompleted;
                this.patientPortalService.uniqueId = patient.uniqueId;
                this.patientPortalService.remainingStudyCount = patient.remainingStudyCount;
                this.patientPortalService.totalStudyCount = patient.totalStudyCount;
                this.patientPortalService.isPregnancyWaiverEnable = patient.isPregnancyWaiverEnable;
                this.patientPortalService.isPregnancyWaiverDownloadable = patient.isPregnancyWaiverDownloadable;
                this.patientPortalService.globalPageNumber = patient.pageCompleted;
                this.storageService.setItem("p_detail", this.patientPortalService.patientDetail);

                if (patient.redPSL == "False" && patient.techPSL == "False" && patient.pageCompleted === 0 &&
                 (this.patientPortalService.patientDetail.financialTypeName == PatientFinancialTypeName.PERSONAL_INJURY || this.patientPortalService.patientDetail.financialTypeName == PatientFinancialTypeName.BROKER)) {
                  if (this.currentLanguage == "es")
                    this.router.navigate([PatientPortalURL.ESIGN_REQUESTS], {
                      queryParams:
                        { patientid: patient.patientId, Token: patient.uniqueId }
                    });
                  else
                    this.router.navigate([PatientPortalURL.ESIGN_REQUEST], {
                      queryParams:
                        { patientid: patient.patientId, Token: patient.uniqueId }
                    });
                }
                else
                  this.router.navigate([PatientPortalURL.PATIENT_HOME]);
         }
        }
        else {
          this.patientPortalService.errorNotification(PatientPortalStatusMessage.INVALID_CODE);
        }
      }
    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    );
  }

  resendCode() {
    this.codeVerificationForm.reset();
    this.elementRef.nativeElement.querySelector("#one").focus();
    var data = {
      mobileNumber: this.patientPortalService.mobileNumber
    }
    this.patientPortalService.SendVerificationCode(data, true).subscribe((res: any) => {
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success && res.result.isVerificationCodeSent) {
          this.patientPortalService.verificationId = res.result.verificationId;
          this.patientPortalService.successNotification(PatientPortalStatusMessage.CODE_SENT_SUCCESS);
        }
        else
          this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    );
  }
}
