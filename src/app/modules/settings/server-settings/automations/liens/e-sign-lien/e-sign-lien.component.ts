import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-e-sign-lien',
  templateUrl: './e-sign-lien.component.html',
  styleUrls: ['./e-sign-lien.component.css']
})
export class ESignLienComponent implements OnInit {
  eSignLienSettingForm: FormGroup;
  statusList: any = [];
  financialTypeList: any = [];
  selectedStatusList: any = [];
  selectedFinancialTypeList: any = [];
  body: any;
  id: number;
  submitted = false
  constructor(private fb: FormBuilder,
    private readonly settingsService: SettingsService,
    private readonly commonService: CommonMethodService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.eSignLienSettingForm = this.fb.group({
      isActive: [''],
      status: [''],
      financialType: [''],
      phone: ['', [Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)]],
      daysAfterSend: [''],
      comments: ['']
    });
    this.getMasterStatusNamesList();
    this.getMasterFinancialTypesList();
    this.getEsignLienSetting();

  }
  getMasterStatusNamesList() {
    this.settingsService.getMasterStatusNames(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.statusList = data.response;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }

    }, (err: any) => {
      this.notificationService.showNotification({
        alertHeader: err.statusText,
        alertMessage: err.message,
        alertType: err.status
      });
    });
  }
  getMasterFinancialTypesList() {
    this.settingsService.getMasterFinancialTypes(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.financialTypeList = data.response;
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
  getEsignLienSetting() {
    this.settingsService.getEsignLiensSettings(true).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.id = data.response[0].id
        if(data.response[0].status){
        this.selectedStatusList = data.response[0].status.split(',').map(function (item) {
          return item.trim();
        });
      } if(data.response[0].financialType){
        this.selectedFinancialTypeList = data.response[0].financialType.split(',').map(function (item) {
          return item.trim();
        });
      }
        this.eSignLienSettingForm.patchValue({
          isActive: data.response[0].isActive,
          phone: data.response[0].phone,
          daysAfterSend: data.response[0].daysAfterSend,
          comments: data.response[0].comments
        });
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    }, (err: any) => {
      this.notificationService.showNotification({
        alertHeader: err.statusText,
        alertMessage: err.message,
        alertType: err.status
      });
    });
  }
  allowNumberOnly(event: any): boolean {
    return this.commonService.alowNumberOnly(event);
  }
  get getFromControls() { return this.eSignLienSettingForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.eSignLienSettingForm.invalid) {
      return;
    }
    this.updateEsignLienSettings()
  }
  updateEsignLienSettings() {
    this.body = {
      'id': this.id,
      'isActive': this.getFromControls.isActive.value,
      'status': this.selectedStatusList.toString(),
      'financialType': this.selectedFinancialTypeList.toString(),
      'phone': this.getFromControls.phone.value,
      'daysAfterSend': this.getFromControls.daysAfterSend.value,
      'comments': this.getFromControls.comments.value
    }

    if (this.id) {
      this.settingsService.updateEsignLiensSettings(true, this.body).subscribe((res: any) => {
        if (res) {
          this.getEsignLienSetting();
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.message,
            alertType: res.responseCode
          });
        }
      },
        (err: any) => {
          this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: ResponseStatusCode.InternalError
          });
        }
      );
    }
  }
}
