import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css']
})
export class GeneralSettingsComponent implements OnInit {
  generalSettingForm: FormGroup;
  financialTypesList: any = [];
  statusNamesList: any = [];
  showFinancialDropdownLoader = true;
  showStatusDropdownLoader = true;
  selectedStatusList: any = [];
  selectedFinancialList: any = []
  selectedweekDays: any = [];

  responseData: any
  selectedService: any
  timepickerVisible = false;
  id: number
  submitted = false
  body: any
  tempFinancialList = []
  tempStatusList = []
  tempServiveRun = []
  weekDays: any[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];

  readonly dateTimeFormatCustom = DateTimeFormatCustom;

  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService,
    private readonly settingsService: SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.generalSettingForm = this.fb.group({
      isActive: [''],
      serviceRunAt: ['', [Validators.required]],
      twilioStatus: ['', [Validators.required]],
      twilioFinancialType: ['', [Validators.required]],
      twilioNotRunAt: ['',],
      twilioDaysOfWeekRun: ['', [Validators.required]],
      twilioWaitDaysToRun: ['', [Validators.required]],
      twilioPhone: ['', [
        Validators.required, Validators.min(1111111111), Validators.max(999999999999),
        Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
      ]],
      twilioMaxAttemptToStudy: ['', [Validators.required]],
      twilioCommnet: ['', [Validators.required]],
      serviceLastRunDate: [''],
      apiServiceRunOn: ['']
    })
    this.getMasterFinancialTypesList()
    this.getMasterStatusNamesList()
    this.getGeneralSettings()

  }
  getGeneralSettings() {
    this.settingsService.getGeneralSetting(true).subscribe((res) => {
      var data: any = res;
      this.responseData = res.response[0].twilioCommnet;
      this.id = data.response[0].id
      if (data.response != null && data.response.length > 0) {
        this.tempFinancialList = data.response[0].twilioFinancialType.split(',')
        this.selectedFinancialList = this.tempFinancialList.map(function (a) { return a; });
        this.selectedweekDays = data.response[0].twilioDaysOfWeekRun.split(',').map(function (a) { return a; });
        this.tempStatusList = data.response[0].twilioStatus.split(',')
        this.selectedStatusList = this.tempStatusList.map(function (a) { return a; })
        this.generalSettingForm.patchValue({
          isActive: data.response[0].isActive,
          serviceRunAt: data.response[0].serviceRunAt,
          twilioNotRunAt: data.response[0].twilioNotRunAt,
          // twilioDaysOfWeekRun: data.response[0].twilioDaysOfWeekRun,
          twilioWaitDaysToRun: data.response[0].twilioWaitDaysToRun,
          twilioPhone: data.response[0].twilioPhone,
          twilioMaxAttemptToStudy: data.response[0].twilioMaxAttemptToStudy,
          twilioCommnet: data.response[0].twilioCommnet,
          serviceLastRunDate: data.response[0].serviceLastRunDate,
          apiServiceRunOn: data.response[0].apiServiceRunOn
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

  getMasterFinancialTypesList() {
    this.settingsService.getMasterFinancialTypes(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.financialTypesList = data.response;

      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
      this.showFinancialDropdownLoader = false;
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
        this.showFinancialDropdownLoader = false;
      });
  }

  getMasterStatusNamesList() {
    this.settingsService.getMasterStatusNames(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.statusNamesList = data.response;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
      this.showStatusDropdownLoader = false;
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
        this.showStatusDropdownLoader = false;
      });
  }

  onChange($event) {

  }

  allowNumberOnly(event: any): boolean {
    return this.commonMethodService.alowNumberOnly(event);
  }

  onSubmit() {
    this.submitted = true
    if (!this.generalSettingForm.valid) {
      return;
    }
    else {
      this.updateGeneralSetting()
    }
  }

  updateGeneralSetting() {
    this.body = {
      'id': this.id,
      'isActive': this.gsForm.isActive.value,
      'serviceRunAt': this.gsForm.serviceRunAt.value,
      'twilioStatus': this.gsForm.twilioStatus.value.toString(),
      'twilioFinancialType': this.selectedFinancialList.toString(),
      'twilioNotRunAt': this.gsForm.twilioNotRunAt.value,
      'twilioDaysOfWeekRun': this.selectedweekDays.toString(),
      'twilioWaitDaysToRun': this.gsForm.twilioWaitDaysToRun.value,
      'twilioPhone': this.gsForm.twilioPhone.value.toString(),
      'twilioMaxAttemptToStudy': parseInt(this.gsForm.twilioMaxAttemptToStudy.value),
      'twilioCommnet': this.gsForm.twilioCommnet.value,
      'serviceLastRunDate': this.gsForm.serviceLastRunDate.setValue(''),
      'apiServiceRunOn': this.gsForm.apiServiceRunOn.setValue('')
    }
    this.settingsService.updateGeneralSettings(this.body, true).subscribe((res: any) => {
      if (res) {
        this.getGeneralSettings()
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
  get gsForm() { return this.generalSettingForm.controls; }
}
