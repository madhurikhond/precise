import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad';
import { BlockLeaseSchedulerService } from 'src/app/services/block-lease-scheduler-service/block-lease-scheduler.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-facility-esign',
  templateUrl: './facility-esign.component.html',
  styleUrls: ['./facility-esign.component.css']
})
export class FacilityEsignComponent implements OnInit {
  @ViewChild('hiddenViewFile', { read: ElementRef }) hiddenViewFile: ElementRef;
  @ViewChild('f', { static: true }) f: NgForm | any;
  model: any = { firstName: '', lastName: '', Title: '', signature: '' };
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  BlockLeaseNumber: string; alreadySignedbodyDisabled: boolean;
  LeaseDetail: any = [];
  fileData: any;
  apiUrl: any;
  leaseAgreementPath: any;
  isEsignValid: boolean = false;
  signaturePadOptions: Object = {
    'minWidth': 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 750,
    canvasHeight: 200
  };
  submitted = false; modelValue: string = 'modal';
  constructor(private Activatedroute: ActivatedRoute,
    private readonly blockLeaseSchedulerService: BlockLeaseSchedulerService,
    private readonly notificationService: NotificationService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.Activatedroute.paramMap.subscribe(params => {
      this.BlockLeaseNumber = params.get('BLS');
      this.getEsignData();
    });

  }
  getEsignData() {

    let body =
    {
      'key': this.BlockLeaseNumber
    }
    this.blockLeaseSchedulerService.getLeaseDetail(true, JSON.stringify(JSON.stringify(body))).subscribe((res) => {
      if (res.responseCode == 200 && res.response !== null) {
        this.LeaseDetail = res.response;
        this.leaseAgreementPath = res.response.LeaseAgreementPath;
        if (this.LeaseDetail.IsLinkExpired) {
          this.alreadySignedbodyDisabled = true;
        } else {
          this.alreadySignedbodyDisabled = false;
        }
      }
      else if (res.response == null) {
        this.isEsignValid = true;
      } else {
        this.error(res);
      }
    }, (err: any) => {
      this.error(err);
    });
  }
  signConfirm(isConfirmSign: boolean) {
    this.f.resetForm();
    this.signaturePad.clear();
    this.model.signature = '';
    this.model.firstName = '';
    this.model.lastName = '';
    this.model.Title = '';
  }
  clearSign(): void {
    this.signaturePad.clear();
    this.model.signature = '';
    this.model.firstName = '';
    this.model.lastName = '';
    this.model.Title = '';
  }

  getLeaseAggrementDetail(path: any, fileData: any) {

    this.apiUrl = `${environment.baseUrl}/v${environment.currentVersion}/`;
    fileData = this.apiUrl + 'BlockLeaseScheduler/OpenAgreement?path=' + path;
    this.fileData = this.sanitizer.bypassSecurityTrustResourceUrl(fileData);
    this.hiddenViewFile.nativeElement.click();
  }
  submitSign(f: NgForm) {
    if (this.model.signature == '') {
      return;
    }
    this.f = f;
    if (this.f.valid) {
      let data = {
        'BlockLeaseNumber': this.BlockLeaseNumber,
        'FacilitySignature': this.model.signature,
        'Title': this.model.Title,
        'FirstName': this.model.firstName,
        'LastName': this.model.lastName,
      }
      this.blockLeaseSchedulerService.validateEmailLinkAndSaveFacilitySign(true, data).subscribe((res) => {
        console.log(res);
        if (res.responseCode == 200) {
          this.successNotification(res);
          this.alreadySignedbodyDisabled = true;
        } else {
          this.error(res.response);
        }
      },
        (err: any) => {
          this.error(err);
        });
      this.f.submitted = false;
    }
  }
  successNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.Message,
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
      alertMessage: err.Message,
      alertType: err.status
    });
  }
  drawComplete() {
    this.model.signature = this.signaturePad.toDataURL();
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
}
