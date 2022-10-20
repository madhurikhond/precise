import { Component, ElementRef, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { SignaturePad } from 'angular2-signaturepad';
import { CommonRegex } from 'src/app/constants/commonregex';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { PatientPortalStatusCode } from 'src/app/constants/patient-portal-status-code.enum';
import { patientPortalResponseStatus, PatientPortalStatusMessage, PatientPortalURL } from 'src/app/models/patient-response';
import { StorageService } from 'src/app/services/common/storage.service';

declare const $: any;

@Component({
  selector: 'app-esignrequest',
  templateUrl: './esignrequest.component.html',
  styleUrls: ['./esignrequest.component.css']
})
export class EsignrequestComponent implements OnInit {

  @ViewChild('hiddenSignPopUp', { static: false }) hiddenSignPopUp: ElementRef;
  @ViewChild('hiddenSignDownloadModel', { static: false }) hiddenSignDownloadModel: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeDownloadModelBtn') closeDownloadBtn: ElementRef;
  @ViewChild('hiddenAlreadyExistsDriverNamePopUp') hiddenAlreadyExistsDriverNamePopUp: ElementRef;

  @ViewChild('f', { static: true }) f: NgForm | any;
  model: any = { firstName: '', driverFirstName: '', signature: '' };
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 750,
    canvasHeight: 200
  };
  submitted = false; modelValue: string = 'modal';
  esignbodyDisabled: boolean = false;
  alreadySignedbodyDisabled: boolean = false;
  elecAgree: string;
  agreeCheck: boolean = false;
  AgreeEsignData: boolean = false;
  patientid: string = '';
  token: string;
  emailSendForm: FormGroup;
  allSignData: SignDataItem;
  allreferrerData: ReferrerDataItem;
  patientSignature: any = '';
  currFFZoom: any = 1;
  currIEZoom: any = 100;
  Name: string = '';
  firstNamePattern = '^\\W*(?:\\w+\\b\\W*){2,}$';
  isSignSuccessflyyMessage: boolean = false; isAlreadyExistsDriverName: boolean = false;
  message: string = '';
  readonly commonRegex = CommonRegex;
  constructor(private Activatedroute: ActivatedRoute,
    private readonly patientService: PatientService,
    private readonly patientPortalService: PatientPortalService,
    private readonly storageService: StorageService,
    private fb: FormBuilder,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    protected sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    this.emailSendForm = this.fb.group({
      emailTxt: ['', [Validators.required, Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]]
    });
    this.patientid = this.Activatedroute.snapshot.queryParams['patientid'];
    this.token = this.Activatedroute.snapshot.queryParams['Token'];
    if (this.patientid && this.token) {
      this.getEsignData();

    }

  }
  getEsignData(fromSign = true) {
    this.patientService.getEsignData(this.patientid, this.token).subscribe((res) => {
      if (res.responseCode === 200) {
        this.elecAgree = res.response['elecAgree']

        if (res.response['signData'].length > 0)
          this.allSignData = res.response['signData'][0];

        if (res.response['referrerDetail'].length > 0)
          this.allreferrerData = res.response['referrerDetail'][0];

        if (this.allSignData.PatientSignature) {
          this.patientSignature = this.sanitizer.bypassSecurityTrustResourceUrl(this.allSignData.PatientSignature);
        }
        this.Name = this.allSignData.FullNameLF.toString();
        if (this.Name) {
          var splits = this.allSignData.FullNameLF.toString().split(' ');
          if (splits.length > 1)
            this.Name = splits.slice(1).join(' ');
        }
        if (this.allSignData.pslesign) {
          this.alreadySignedbodyDisabled = true;
        } else {
          if (!fromSign) {
            this.hiddenSignPopUp.nativeElement.click();
          }
        }
        this.updateDriverName();
        if (fromSign) {
          this.patientService.sendDataToEsignrequestKeeper.subscribe(res => {
            this.agreeCheck = res;
            this.AgreeEsignData = res;
            if (!res) {
              if (!this.allSignData.pslesign) {
                this.esignbodyDisabled = true;
              }
            }
          });
        }


      } else {
        this.error(res);
      }
    }, (err: any) => {
      this.error(err);
    });
  }
  updateDriverName() {
    if (this.allSignData.AttorneyDriverName && this.allSignData.DriverName){
      this.model.driverFirstName = this.allSignData.DriverName;
      this.isAlreadyExistsDriverName=true;
    } 
    else if (this.allSignData.AttorneyDriverName){
      this.model.driverFirstName = this.allSignData.AttorneyDriverName;
      this.isAlreadyExistsDriverName=true;
    }  
    else if (this.allSignData.DriverName){
      this.model.driverFirstName = this.allSignData.DriverName;
      this.isAlreadyExistsDriverName=true;
    }
  }
  confirmDriverName(isTrue) {
    if (isTrue) {
      this.isAlreadyExistsDriverName = false;
      this.model.driverFirstName = "";
    } else {
      this.updateDriverName();
    }
  }

  checkdriverFirstName() {
    debugger;
    if (this.model.driverFirstName && this.isAlreadyExistsDriverName) {
      this.hiddenAlreadyExistsDriverNamePopUp.nativeElement.click();
    }
  }
  signConfirm(isConfirmSign: boolean) {
    this.emailSendForm.reset();
    this.f.resetForm();
    this.signaturePad.clear();
    this.model.signature = '';

  }
  downloadSignFile() {

    this.patientService.download(this.patientid, this.Name, 'esignrequest').subscribe((res) => {
      if (res.responseCode === 200) {
        let response = JSON.parse(res.response);
        this.downloadFile(response['FileName'], response['filebytes'])
        this.successNotification(res);
        //this.closeDownloadBtn.nativeElement.click(); 
      } else {
        this.error(res);
      }
    }, (err: any) => {
      this.error(err);
    });

  }
  plus() {
    var step = 0.02;
    this.currFFZoom += step;
    $('body').css('MozTransform', 'scale(' + this.currFFZoom + ')');
    var stepie = 2;
    this.currIEZoom += stepie;
    $('body').css('zoom', ' ' + this.currIEZoom + '%');

  };
  minus() {
    var step = 0.02;
    this.currFFZoom -= step;
    $('body').css('MozTransform', 'scale(' + this.currFFZoom + ')');
    var stepie = 2;
    this.currIEZoom -= stepie;
    $('body').css('zoom', ' ' + this.currIEZoom + '%');
  };
  submitSign(isItemSign: boolean) {
    if (this.model.signature === '') {
      return;
    }
    if (this.f.valid) {
      let data = {
        'patientid': this.allSignData.PATIENTID,
        'AttorneyName': this.allSignData.AttorneyFullName,
        'attorneysignature': this.allSignData.AttorneySignature,
        'patientsignature': this.model.signature,
        'Name': this.model.firstName,
        'DriverName': this.model.driverFirstName
      }
      this.patientService.insertESignatureLien(data, 'esignrequest').subscribe((res) => {
        if (res.response === true) {
          this.closeBtn.nativeElement.click();
          this.hiddenSignDownloadModel.nativeElement.click();
          this.message = res.message;
          //this.successNotification(res);
        } else {
          this.error(res);
        }
      },
        (err: any) => {
          this.error(err);
        });
      this.f.submitted = false;
    }
  }
  ngAfterViewInit() {
    if (this.signaturePad) {
      this.signaturePad.set('minWidth', 3);
      this.signaturePad.clear();
    }
  }
  clearSign(): void {
    this.signaturePad.clear();
    this.model.signature = '';
  }

  drawComplete() {
    this.model.signature = this.signaturePad.toDataURL();
  }
  drpactionChanges(event) {
    this.previewAndSave(event.target.value);
  }
  eventCheck(event) {
    this.agreeCheck = event.target.checked;
  }
  openlien() {
    if (this.agreeCheck) {
      this.esignbodyDisabled = false;
      this.AgreeEsignData = true;
    } else {
      this.CodeErrorNotification('Please Agree to use electronics records and signature.');
    }
  }

  previewAndSave(type: number) {
    this.patientService.printPreview(this.patientid, this.Name, 'esignrequest').subscribe((res) => {
      if (res.responseCode === 200) {
        let response = JSON.parse(res.response);
        if (type == 1) {
          this.print(response)
        } else if (type == 2) {
          this.downloadFile(response['FileName'], response['filebytes'])
        }
      } else {
        this.error(res);
      }
    }, (err: any) => {
      this.error(err);
    });
  }

  print(response: any) {
    let blobUrl = URL.createObjectURL(new Blob([this._base64ToArrayBuffer(response['filebytes'])], { type: 'application/pdf' }));
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }


  downloadFile(fileName, fileData) {
    var source;
    let fileExtension = fileName.split('.').pop();
    const link = document.createElement('a');
    if (fileName.match(/.(jpg|jpeg|png|gif)$/i)) {
      source = 'data:image/' + fileExtension + ';base64,' + fileData;
    }
    else if (fileName.match(/.(pdf)$/i)) {
      source = 'data:application/pdf;base64,' + fileData;
    }
    link.href = source;
    link.download = `${fileName}`
    link.click();
  }
  sendEmailbtn(isItemRename: boolean) {
    this.submitted = true;
    this.modelValue = 'modal';
    if (this.emailSendForm.invalid) {
      this.modelValue = '';
      return;
    }
    if (isItemRename) {
      let Email = this.refemailSendForm.emailTxt.value.trim();
      if (Email) {
        let data = {
          'patientid': this.patientid,
          'givenname': this.Name,
          'MailTo': Email,
          'FromPage': 'esignrequest'
        }
        this.patientService.sendEmail(JSON.stringify(JSON.stringify(data))).subscribe((res) => {
          
          if (res.responseCode === 200) {
            this.isSignSuccessflyyMessage = true;
            this.onSuccessRedirect();
            // this.successNotification(res);
          } else {
            this.error(res);
          }
        }, (err: any) => {
          this.error(err);
        });
      }
    }
  }
  onSuccessClose() {
    this.onSuccessRedirect();
  }

  onSuccessRedirect() {
    if (localStorage.getItem("p_detail") !== null && localStorage.getItem("p_detail") != undefined) {
      var data = {
        patientId: this.patientid,
        pageCompleted: PatientPortalStatusCode.LIEN_SIGNED,
        loggedPartnerId: this.storageService.PartnerId,
        jwtToken: this.storageService.PartnerJWTToken,
        patientPreferredLanguage: "english"
      }
      this.patientPortalService.UpdatePatientPageCompleted(data, true).subscribe((res: any) => {
        if (res) {
          if (res.responseStatus == patientPortalResponseStatus.Success)
            this.router.navigate([PatientPortalURL.PATIENT_HOME]);
        }
      },
        (err: any) => {
          this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
        }
      );
    }
    else {
      this.isSignSuccessflyyMessage = true;
    }
  }

  changelanguage(event) {
    if (event.target.checked === true) {
      this.router.navigate(['patient/esignrequests'], { queryParams: { patientid: this.patientid, Token: this.token } });
      this.patientService.sendDataToEsignrequestWindow(this.AgreeEsignData);
    }
  }

  scrollToElement($element): void {
    $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  _base64ToArrayBuffer(base64: any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  successNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  CodeErrorNotification(msg: string) {
    this.notificationService.showNotification({
      alertHeader: 'Error',
      alertMessage: msg,
      alertType: 400
    });
  }

  error(err: any) {
   
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.response,
      alertType: err.status
    });
  }
  get refemailSendForm() { return this.emailSendForm.controls; }
}
export class SignDataItem {
  PATIENTID: string;
  STUDYDATETIME: string;
  FullNameLF: string;
  BIRTHDATE: string;
  AttorneyFullName: string;
  AttorneyAddress: string;
  AttorneyCityState: string;
  AttorneyDriverName: string;
  Currentdate: string;
  DriverName: string;
  BusinessPhoneNumber: string;
  AttorneyFaxNumber: string;
  InjuryDate: string;
  phone: string;
  pslesign: string;
  AttorneySignature: string;
  PatientSignature: string;
  signdate: string;
  asaslesign: string;
  smslink: string;
  fullname: string;
}
export class ReferrerDataItem {
  patientBillName: string;
  RadEmail: string;
  RadAddress: string;
  RadPhone: string;
  RadFax: string;
}
