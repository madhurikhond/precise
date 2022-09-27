import { Component, ElementRef, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { SignaturePad } from 'angular2-signaturepad';
import { debug } from 'console';

declare const $: any;
@Component({
  selector: 'app-esignrequestas',
  templateUrl: './esignrequestas.component.html',
  styleUrls: ['./esignrequestas.component.css']
})
export class EsignrequestasComponent implements OnInit {

  @ViewChild('hiddenSignPopUp', { static: false }) hiddenSignPopUp: ElementRef;
  @ViewChild('hiddenSignDownloadModel', { static: false }) hiddenSignDownloadModel: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeDownloadModelBtn') closeDownloadBtn: ElementRef;


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
  patientid: string = '';
  token: string;
  emailSendForm: FormGroup;
  allSignData: SignDataItem;
  allreferrerData: ReferrerDataItem;
  patientSignature: any = '';
  currFFZoom: any = 1;
  currIEZoom: any = 100;
  firstNamePattern = '^\\W*(?:\\w+\\b\\W*){2,}$';
  AgreeEsignData: boolean = false;


  constructor(private Activatedroute: ActivatedRoute,
    private readonly patientService: PatientService,
    private fb: FormBuilder,
    private readonly notificationService: NotificationService,
    protected sanitizer: DomSanitizer,
    private readonly router: Router) { }


  ngOnInit(): void {
    this.emailSendForm = this.fb.group({
      emailTxt: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    });
    this.patientid = this.Activatedroute.snapshot.queryParams['patientid'];
    this.token = this.Activatedroute.snapshot.queryParams['Token'];
    if (this.patientid && this.token) {
      this.getEsignData();
      //this.previewAndSave(2);
    }

  }
  changelanguage(event) {
      this.router.navigate(['patient/esignrequesta'], { queryParams: { patientid: this.patientid, Token: this.token } });
      this.patientService.sendDataToEsignrequestWindow(this.AgreeEsignData);
  }
  getEsignData(fromSign = true) {
    this.patientService.getEsignData(this.patientid, this.token).subscribe((res) => {
      if (res.responseCode == 200) {
        this.elecAgree = res.response['elecAgree']
        if (res.response['signData'].length > 0)
          this.allSignData = res.response['signData'][0];

        if (res.response['referrerDetail'].length > 0)
          this.allreferrerData = res.response['referrerDetail'][0];

        if (this.allSignData.PatientSignature) {
          this.patientSignature = this.sanitizer.bypassSecurityTrustResourceUrl(this.allSignData.PatientSignature);
        }
        if (this.allSignData.asaslesign) {
          this.alreadySignedbodyDisabled = true;
        } else {
          if (!fromSign) {
            this.hiddenSignPopUp.nativeElement.click();
          }
        }
        if (fromSign) {
          debugger
          this.patientService.sendDataToEsignrequestKeeper.subscribe(res => {
            this.agreeCheck = res;
            this.AgreeEsignData = res;            
            if (!res) {
              if (!this.allSignData.asaslesign) {
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

  signConfirm(isConfirmSign: boolean) {
    //if(isConfirmSign){
    // this.hiddenSignPopUp.nativeElement.click();      
    this.emailSendForm.reset();
    this.f.resetForm();
    this.signaturePad.clear();
    this.model.signature = '';
    //}
  }
  downloadSignFile() {
    this.patientService.download(this.patientid, this.allSignData.fullname, 'esignrequesta').subscribe((res) => {
      if (res.responseCode == 200) {
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
    if (this.model.signature == '') {
      return;
    }
    if (this.f.valid) {
      let data = {
        'patientid': this.allSignData.PATIENTID,
        'AttorneyName': this.allSignData.AttorneyFullName,
        'attorneysignature': this.model.signature,
        'patientsignature': this.allSignData.PatientSignature,
        'AttorneySignatureName': this.model.firstName,
        'AttorneyDriverName': this.model.driverFirstName
      }
      this.patientService.insertESignatureLien(data, 'esignrequesta').subscribe((res) => {
        if (res.response == true) {
          this.closeBtn.nativeElement.click();
          this.hiddenSignDownloadModel.nativeElement.click();
          this.successNotification(res);

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
    debugger
    if (this.agreeCheck) {
      this.esignbodyDisabled = false;
      this.AgreeEsignData = true;
    } else {
      this.CodeErrorNotification('Acepte usar registros electrónicos y firma.');
    }
  }

  previewAndSave(type: number) {
    this.patientService.printPreview(this.patientid, this.allSignData.fullname, 'esignrequesta').subscribe((res) => {
      if (res.responseCode == 200) {
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
    iframe.src = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));
    document.body.appendChild(iframe);
    iframe.style.display = 'none';
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
          'givenname': this.allSignData.fullname,
          'MailTo': Email,
          'FromPage': 'esignrequesta'
        }
        this.patientService.sendEmail(JSON.stringify(JSON.stringify(data))).subscribe((res) => {
          if (res.responseCode == 200) {
            this.successNotification(res);
          } else {
            this.error(res);
          }
        }, (err: any) => {
          this.error(err);
        });

      }
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
      alertMessage: err.message,
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
  Currentdate: string;
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
  DriverName:string;
}
export class ReferrerDataItem {
  patientBillName: string;
  RadEmail: string;
  RadAddress: string;
  RadPhone: string;
  RadFax: string;
}
