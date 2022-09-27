import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { JsonHubProtocol } from '@aspnet/signalr';


@Component({
  selector: 'app-ordered-sms',
  templateUrl: './ordered-sms.component.html',
  styleUrls: ['./ordered-sms.component.css']
})
export class OrderedSmsComponent implements OnInit {
  ordredSmsSettingForm: FormGroup;
  financialTypesList: any = [];
  statusList: any = [];
  modalityList: any = [];
  selectedStatusList: any = [];
  selectedFinancialTypeList: any = [];
  selectedModalityList: any = [];
  selectedDays: any = [];
  dayList: any[];
  id: number;
  submitted = false;
  body: any;
  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService,
    private readonly settingsService: SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.ordredSmsSettingForm = this.fb.group({
      isActive: [''],
      orderedFinacialType: [''],
      orderedModality: [''],
      runServiceTime: [''],
      orderedDelay: [''],
      orderedStatus: [''],
      orderedDays: [''],
      orderedDaysOfWeek: [''],
      orderedShedulercomment: ['']
    })
    this.getMasterFinancialTypesList()
    this.getMasterStatusNamesList()
    this.getMasterModalityList()
    this.getDays();
    this.getOrdredSmsSetting()
  }
  getOrdredSmsSetting() {
    this.settingsService.GetAllOrderedSMSSetting(true).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.id = data.response[0].id
        this.selectedFinancialTypeList = data.response[0].orderedFinacialType ? data.response[0].orderedFinacialType.split(',').map(function (item) {
          return item.trim();
        }) : null;
        this.selectedStatusList = data.response[0].orderedStatus ? data.response[0].orderedStatus.split(',').map(function (item) {
          return item.trim();
        }) : null;
        this.selectedModalityList = data.response[0].orderedModality ? data.response[0].orderedModality.split(',').map(function (item) {
          return item.trim();
        }) : null;
        this.selectedDays = data.response[0].orderedDaysOfWeek ? data.response[0].orderedDaysOfWeek.split(',').map(function (item) {
          return item.trim();
        }) : null;
        this.ordredSmsSettingForm.patchValue({
          isActive: data.response[0].isActive,
          runServiceTime: data.response[0].runServiceTime,
          orderedDelay: data.response[0].orderedDelay,
          orderedDays: data.response[0].orderedDays,
          orderedShedulercomment: data.response[0].orderedShedulercomment
        });
      }
    },
      (err: any) => {
        this.showError(err);
      });
  }

  getMasterFinancialTypesList() {
    this.settingsService.getMasterFinancialTypes(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.financialTypesList = data.response;
      }
    },
      (err: any) => {
        this.showError(err);
      });
  }
  // common Notification Method
  showNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: data.statusText,
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  // common Error Method
  showError(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  getMasterModalityList() {
    this.settingsService.getMasterModalities(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.modalityList = data.response;
      }
    }, (err: any) => {
      this.showError(err);
    });
  }
  getMasterStatusNamesList() {
    this.settingsService.getMasterStatusNames(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.statusList = data.response;
      }
    }, (err: any) => {
      this.showError(err);
    });
  }
  getDays() {
    this.dayList = this.commonMethodService.getWeekDays();
  }
  get getFromControls() { return this.ordredSmsSettingForm.controls; }
  onSubmit() {
    debugger
    this.submitted = true
    if (!this.ordredSmsSettingForm.valid) {
      return;
    }
    this.updateOrderedSmsSettings()
  }
  updateOrderedSmsSettings() {
    this.body = {
      'id': this.id,
      'isActive': Boolean(this.getFromControls.isActive.value),
      'orderedFinacialType': this.selectedFinancialTypeList.toString(),
      'orderedModality': this.selectedModalityList.toString(),
      'runServiceTime': this.getFromControls.runServiceTime.value,
      'orderedDelay': this.getFromControls.orderedDelay.value,
      'orderedStatus': this.selectedStatusList.toString(),
      'orderedDays': this.getFromControls.orderedDays.value,
      'orderedDaysOfWeek': this.selectedDays.toString(),
      'orderedShedulercomment': this.getFromControls.orderedShedulercomment.value
    }
    JSON.stringify(JSON.stringify(this.body))
    this.settingsService.updateOrderedSmsSettings(true, this.body).subscribe((res: any) => {
      if (res) {
        this.getOrdredSmsSetting();
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
