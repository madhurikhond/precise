import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { BlockLeaseSchedulerService } from 'src/app/services/block-lease-scheduler-service/block-lease-scheduler.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SignaturePad } from 'angular2-signaturepad';
import { StorageService } from 'src/app/services/common/storage.service';

@Component({
  selector: 'app-credit-reasons-setting',
  templateUrl: './credit-reasons-settings.component.html',
  styleUrls: ['./credit-reasons-settings.component.css']
})
export class CreditReasonsSettingComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('hiddenSignPopUp', { static: false }) hiddenSignPopUp: ElementRef;
  tabId: string = 'Reasons'
  columnResizingMode: string;
  resizingModes: string[] = ['nextColumn', 'nextColumn'];
  addCreditReasonForm: FormGroup;
  creditReasonsList: any = [];
  PagecreditReasonsList: any = [];
  esignList: any = [];
  submitted = false;
  modelValue: string = 'modal';
  reasonId: number = 0;
  esignId: number = 0;
  @ViewChild('f', { static: true }) f: NgForm | any;
  model: any = { firstName: '', lastName: '', Title: '', signature: '' };
  pageSize: number = 20;
  pageNumber: number = 1;
  totalesignList: number = 0;
  totalcreditReasonsList: number = 0;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 750,
    canvasHeight: 200
  };
  constructor(private readonly blockLeaseSchedulerService: BlockLeaseSchedulerService,
    private notificationService: NotificationService, private fb: FormBuilder,
    private readonly storageService: StorageService) { }

  ngOnInit(): void {
    this.tabId = 'Reasons';
    this.columnResizingMode = this.resizingModes[0];
     this.getDocumentsTypes();
     this.getEsignData();
     this.creditReasonFormInitialize();
  }
  creditReasonFormInitialize() {
    this.addCreditReasonForm = this.fb.group({
      reason: ['', [Validators.required]],
      isActive: [true]
    });
  }
  updateTabId(tabName: string, val: boolean) {
    this.tabId = tabName;
  }
  getDocumentsTypes() {
    let body = {
      Operation: 5
    }
    this.blockLeaseSchedulerService.addUpdateBlockLeaseCreditReason(true, body).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.creditReasonsList = data.response;
        this.totalcreditReasonsList = this.creditReasonsList.length;
        this.PagecreditReasonsList = this.paginate(this.creditReasonsList, this.pageSize, this.pageNumber);
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }
  getEsignData() {
    this.blockLeaseSchedulerService.manageUserSettings(true, JSON.stringify(JSON.stringify({ Operation: 0 })).toString()).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.esignList = data.response;
        this.totalesignList = this.esignList.length;
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
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
  submitSign(isItemSign: boolean) {
    if (this.model.signature == '') {
      return;
    }
    if (this.f.valid) {
      var data;
      if (this.esignId == 0) {
        data = {
          'ID': this.esignId,
          'UserId': this.storageService.user.UserId,
          'DefaultSign': this.model.signature,
          'Title': this.model.Title,
          'FirstName': this.model.firstName,
          'LastName': this.model.lastName,
          'Operation': '1'
        }
      } else {
        data = {
          'ID': this.esignId,
          'UserId': this.storageService.user.UserId,
          'DefaultSign': this.model.signature,
          'Title': this.model.Title,
          'FirstName': this.model.firstName,
          'LastName': this.model.lastName,
          'Operation': '2'
        }
      }
      this.blockLeaseSchedulerService.manageUserSettings(true, JSON.stringify(JSON.stringify(data)).toString()).subscribe((res) => {
        if (res) {
          this.closeBtn.nativeElement.click();
          this.esignList = res.response;
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
      },
        (err: any) => {
          this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
          });
        });
      this.f.submitted = false;
    }
  }
  onInsertSubmit() {
    this.submitted = true;
    this.modelValue = 'modal';
    if (this.addCreditReasonForm.invalid) {
      this.modelValue = '';
      return;
    }
    this.saveDocumentType();
  }
  addEsign() {
    this.esignId = 0;
    this.model.name = this.storageService.user.FullName;
    this.submitted = false;
    this.signConfirm(false);
  }
  add() {
    this.reasonId = 0;
    this.submitted = false;
    this.addCreditReasonForm.reset();
    this.addCreditReasonForm.get('isActive')?.setValue(true);
  }
  edit(reasonId) {
    this.submitted = false;
    this.reasonId = reasonId;
    setTimeout(() => {
      this.getReasonById(reasonId);
    }, 200);
  }
  editEsignNw(esignId) {
    this.submitted = false;
    this.esignId = esignId;
    if (this.esignList) {
      setTimeout(() => {
        this.hiddenSignPopUp.nativeElement.click();
        this.model.firstName = this.esignList[0].FirstName;
        this.model.lastName = this.esignList[0].LastName;
        this.model.Title = this.esignList[0].Title;
        var wrapper = document.getElementById("SettingSignaturePad"),
          canvas = wrapper.querySelector("canvas")
        var ctx = canvas.getContext("2d");
        console.log(ctx);
        var img = new Image();
        img.src = this.esignList[0].DefaultSign;
        img.onload = function () {
          ctx.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
          );
        };
        this.model.signature = img.src;
      }, 1200);
    }
  }
  getReasonById(reasonId) {
    var data = {
      ID: reasonId,
      Operation: 4
    }
    this.blockLeaseSchedulerService.addUpdateBlockLeaseCreditReason(true, data).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.addCreditReasonForm.patchValue({
          reason: data.response[0].ReasonText,
          isActive: data.response[0].IsActive
        });
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }
  saveDocumentType() {
    var data: any;
    if (this.reasonId == 0) {
      data = {
        ID: this.reasonId,
        ReasonText: this.addForm.reason.value,
        isActive: (this.addForm.isActive.value == null ? false : this.addForm.isActive.value),
        Operation: 1
      }
    } else {
      data = {
        'Id': this.reasonId,
        'ReasonText': this.addForm.reason.value,
        'isActive': (this.addForm.isActive.value == null ? false : this.addForm.isActive.value),
        Operation: 2
      }
    }
    this.blockLeaseSchedulerService.addUpdateBlockLeaseCreditReason(true, data).subscribe((res) => {
      if (res) {
        this.notificationService.showNotification({
          alertHeader: 'Success',
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getDocumentsTypes();
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }
  get addForm() { return this.addCreditReasonForm.controls; }
  onPageNumberChange(pageNumber: any) {
    this.pageNumber = pageNumber;
    this.PagecreditReasonsList = this.paginate(this.creditReasonsList, this.pageSize, this.pageNumber);
  }
  paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}
}
