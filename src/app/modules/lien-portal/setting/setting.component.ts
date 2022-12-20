import { ThrowStmt } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';
import { DxDataGridComponent } from 'devextreme-angular';
import { LienPortalAPIEndpoint, LienPortalFundingCoPermission, LienPortalResponseStatus, LienPortalStatusMessage, OriginalLienOwnerPermission } from 'src/app/models/lien-portal-response';
import { StorageService } from 'src/app/services/common/storage.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
import { threadId } from 'worker_threads';
import { AddFundingCompanyComponent } from '../add-funding-company/add-funding-company.component';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild(AddFundingCompanyComponent) fundingCompanyComponent: AddFundingCompanyComponent;

  selectedMode: string = 'settings';
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 500,
    canvasHeight: 100
  };
  isEmailReminder: boolean = true;
  isEmailSendCopy: boolean = true;
  isDefaultSignature: boolean = true;

  days = [];
  time = [];
  radiologistSign: string;
  FundingCompanyDataSource = [];
  defaultEmail: any;
  firstEmail: any;
  secondEmail: any;
  selectedDays: any;
  selectedTimeToReminder: any;

  totalRecord: number = 0;
  pageNumber: number = 0;
  pageSize: number = 20;
  currentPageNumber: number = 1;

  isReadonly: boolean;
  permission : any;
  permissionTitle = OriginalLienOwnerPermission.BillStudiesAndAssignAR;

  constructor(private lienPortalService: LienPortalService,
    private storageService: StorageService) {
      this.storageService.permission = null;
    }

  ngOnInit(): void {
    this.setPermission();
    this.getDaysData();
    this.getTimeData();
    this.onSettingTabClicked();
    this.GetRadiologistSettings();
    this.defaultEmail = this.storageService.user.WorkEmail ? this.storageService.user.WorkEmail : '';
  }

  onFundingCompanyTabClicked() {
    this.bindFundComp_list();
    this.selectedMode = 'funding_company';
  }

  bindFundComp_list() {
    let data = {};
    this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.GetFundingCompanyList).subscribe((result) => {
      if (result.status == LienPortalResponseStatus.Success) {
        if (result.result) {
          this.FundingCompanyDataSource = [];
          this.totalRecord = 0;
          this.pageNumber = 0;
          this.currentPageNumber = 1;

          this.FundingCompanyDataSource = result.result
          this.totalRecord = result.result.length;
        }
      }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    });
  }

  onFundCompPageNumberChange(pageNumber: any) {
    this.currentPageNumber = pageNumber;
    if (pageNumber > 1)
      this.pageNumber = pageNumber - 1;
    else
      this.pageNumber = 0;
  }



  onSettingTabClicked() {
    if(this.selectedMode == 'funding_company')
    {
      this.getDaysData();
      this.getTimeData();
      this.GetRadiologistSettings();
      this.defaultEmail = this.storageService.user.WorkEmail ? this.storageService.user.WorkEmail : '';
    }
    this.selectedMode = 'settings';

  }

  getDaysData() {
    this.days = [
      { id: 'Monday', name: 'Mo' },
      { id: 'Tuesday', name: 'Tu' },
      { id: 'Wednesday', name: 'Wd' },
      { id: 'Thursday', name: 'Th' },
      { id: 'Friday', name: 'Fr' },
      { id: 'Saturday', name: 'St' },
      { id: 'Sunday', name: 'Su' },
    ];
  }

  getTimeData() {
    this.time = [
      { timeValue: '12:00 AM' },
      { timeValue: '1:00 AM' },
      { timeValue: '2:00 AM' },
      { timeValue: '3:00 AM' },
      { timeValue: '4:00 AM' },
      { timeValue: '5:00 AM' },
      { timeValue: '6:00 AM' },
      { timeValue: '7:00 AM' },
      { timeValue: '8:00 AM' },
      { timeValue: '9:00 AM' },
      { timeValue: '10:00 AM' },
      { timeValue: '11:00 AM' },
      { timeValue: '12:00 PM' },
      { timeValue: '1:00 PM' },
      { timeValue: '2:00 PM' },
      { timeValue: '3:00 PM' },
      { timeValue: '4:00 PM' },
      { timeValue: '5:00 PM' },
      { timeValue: '6:00 PM' },
      { timeValue: '7:00 PM' },
      { timeValue: '8:00 PM' },
      { timeValue: '9:00 PM' },
      { timeValue: '10:00 PM' },
      { timeValue: '11:00 PM' },
    ]
  }


  clearSign(): void {
    this.signaturePad.clear();
    this.radiologistSign = '';
    this.signaturePad.fromDataURL(this.radiologistSign);
  }

  saveSign() {
      var data = {
        "defaultSign": this.radiologistSign
      };
      this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.AddRadDefaultSign).subscribe((result) => {
        if (result.status == LienPortalResponseStatus.Success) {
          this.lienPortalService.successNotification(LienPortalStatusMessage.SIGNATURE_UPDATED_SUCCESS);
        }
        else
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      }, () => {
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      })
  }

  onSignatureComplete() {
    this.radiologistSign = this.signaturePad.toDataURL();
  }

  onSelected(time) {
    this.selectedTimeToReminder = time;
  }

  openFundCompPupup(fundingCompanyId: number = 0) {
    this.fundingCompanyComponent.onLoad(fundingCompanyId);
  }

  onReturnSuccess(isSuccess: any) {
    if (isSuccess) {
      this.bindFundComp_list();
    }
  }
  changeStatus() {
    if (this.isEmailReminder == true)
      this.isReadonly = false;
    else
      this.isReadonly = true;
  }

  GetRadiologistSettings() {
    let data = {};
    this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.GetRadiologistSettings).subscribe((res) => {
      if (res.status == LienPortalResponseStatus.Success) {
        var data = res.result;
        if(this.permission && this.permission.IsAdd == 'true'){
          this.isEmailReminder = data.isEmailReminder;
          this.isEmailSendCopy = data.isEmailSendCopy;
          this.isDefaultSignature = data.isDefaultSignature;
        }else{
          this.isEmailReminder = false;
          this.isEmailSendCopy = false;
          this.isDefaultSignature = false;
        }
        if(data.emailReminders){
          this.selectedDays = (data.emailReminders.dayOfWeek) ? data.emailReminders.dayOfWeek : [];
          this.selectedTimeToReminder = (data.emailReminders.timeOfDay) ? data.emailReminders.timeOfDay : '12:00 AM';
        }else{
          this.selectedDays = [];
          this.selectedTimeToReminder = '12:00 AM';
        }

        if (data.emailSendCopies.length > 0)
        {
          this.defaultEmail = data.emailSendCopies[0];
        if (data.emailSendCopies.length == 2)
          this.firstEmail = data.emailSendCopies[1]
        if (data.emailSendCopies.length == 3)
          this.firstEmail = data.emailSendCopies[1]
          this.secondEmail = data.emailSendCopies[2]
        }
        this.signaturePad.fromDataURL(data.defaultSign.defaultSign);
        this.radiologistSign = data.defaultSign.defaultSign;
      } else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  saveSettings() {
    if(!this.isEmailReminder){
      this.AddRadiologistSetting();
    }
    else if(this.selectedDays.length != 0 && this.selectedTimeToReminder != ''){
      this.AddRadiologistSetting();
    }else{
      this.lienPortalService.errorNotification('Please add Days and time for Email reminder')
    }
  }


  AddRadiologistSetting() {
      var requestEmailReminders = {
        'dayOfWeek': this.selectedDays,
        'timeOfDay': this.selectedTimeToReminder,
      }
      var requestEmailSendCopies = [];
      requestEmailSendCopies.push(this.defaultEmail);
      if (this.firstEmail)
        requestEmailSendCopies.push(this.firstEmail);
      if (this.secondEmail)
        requestEmailSendCopies.push(this.secondEmail);
      var requestData = {
        "isEmailReminder": this.isEmailReminder,
        "isEmailSendCopy": this.isEmailSendCopy,
        "isDefaultSignature": this.isDefaultSignature,
        "emailReminders": requestEmailReminders,
        "emailSendCopies": requestEmailSendCopies
      }
      this.lienPortalService.PostAPI(requestData, LienPortalAPIEndpoint.AddRadiologistSetting).subscribe((res) => {
        if (res.status == LienPortalResponseStatus.Success) {
          this.lienPortalService.successNotification(LienPortalStatusMessage.SETTING_SAVED_SUCCESS);
        }
        else
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      }, () => {
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      })
 }

 setPermission() {
  if (this.storageService.permission.length > 0) {
    var permission :any= this.storageService.permission[0];
    if (permission.Children){
      var data = permission.Children.filter(val => val.PageTitle == this.permissionTitle);
      if(data.length == 1)
        this.permission = data[0];
    }
  }
}
}
