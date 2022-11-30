import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';
import { DxDataGridComponent } from 'devextreme-angular';
import { StorageService } from 'src/app/services/common/storage.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

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
  defaultEmail:any;
  firstEmail:any;
  secondEmail:any;
  selectedDays:any;
  selectedTimeToReminder:any;

  totalRecord: number = 0;
  pageNumber: number = 0;
  pageSize: number = 20;
  currentPageNumber: number = 1;

  fundingCompanyId: number;
  isReadonly:boolean;

  constructor(private lienPortalService: LienPortalService,
    private storageService: StorageService) { }

  ngOnInit(): void {
    this.getDaysData();
    this.getTimeData();
    this.onSettingTabClicked();
    this.GetRadiologistSettings();
    this.GetRadDefaultSign();
    this.defaultEmail = this.storageService.user.WorkEmail ? this.storageService.user.WorkEmail : '';
  }



  onFundingCompanyTabClicked() {
    this.bindFundComp_list();
    this.selectedMode = 'funding_company';
  }

  bindFundComp_list() {
    try {
      var data = {
        "loggedPartnerId": this.storageService.PartnerId,
        "jwtToken": this.storageService.PartnerJWTToken,
        "userId": this.storageService.user.UserId
      };

      this.lienPortalService.GetFundingCompanyList(data).subscribe((result) => {
        if (result.status == 1) {

          this.FundingCompanyDataSource = [];
          this.totalRecord = 0;
          this.pageNumber = 0;
          this.currentPageNumber = 1;

          this.totalRecord = result.result.length;
          if (result.result && result.result.length > 0) {
            this.FundingCompanyDataSource = result.result
          }
        }
        if (result.exception && result.exception.message) {
          this.lienPortalService.errorNotification(result.exception.message);
        }
      }, (error) => {
        if (error.message) {
          this.lienPortalService.errorNotification(error.message);
        }
      })
    } catch (error) {
      if (error.message) {
        this.lienPortalService.errorNotification(error.message);
      }
    }

  }

  onFundCompPageNumberChange(pageNumber: any) {
    this.currentPageNumber = pageNumber;
    if (pageNumber > 1)
      this.pageNumber = pageNumber - 1;
    else
      this.pageNumber = 0;
  }



  onSettingTabClicked() {
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

  getTimeData(){
this.time = [
  {timeValue : '12:00 AM'},
  {timeValue : '1:00 AM'},
  {timeValue : '2:00 AM'},
  {timeValue : '3:00 AM'},
  {timeValue : '4:00 AM'},
  {timeValue : '5:00 AM'},
  {timeValue : '6:00 AM'},
  {timeValue : '7:00 AM'},
  {timeValue : '8:00 AM'},
  {timeValue : '9:00 AM'},
  {timeValue : '10:00 AM'},
  {timeValue : '11:00 AM'},
  {timeValue : '12:00 PM'},
  {timeValue : '1:00 PM'},
  {timeValue : '2:00 PM'},
  {timeValue : '3:00 PM'},
  {timeValue : '4:00 PM'},
  {timeValue : '5:00 PM'},
  {timeValue : '6:00 PM'},
  {timeValue : '7:00 PM'},
  {timeValue : '8:00 PM'},
  {timeValue : '9:00 PM'},
  {timeValue : '10:00 PM'},
  {timeValue : '11:00 PM'},
]
  }


  clearSign(): void {
    this.signaturePad.clear();
    this.radiologistSign = '';
  }

  saveSign() {
    try {
      if (this.radiologistSign) {
        var data = {
          "defaultSign": this.radiologistSign,
          "loggedPartnerId": this.storageService.PartnerId,
          "jwtToken": this.storageService.PartnerJWTToken,
          "userId": Number(this.storageService.user.UserId)
        };

        this.lienPortalService.AddRadiologistDefaultSign(data).subscribe((result) => {
          if (result.status == 1) {
            this.lienPortalService.successNotification('Signature Updated Successfully');
          }
          if (result.exception && result.exception.message) {
            this.lienPortalService.errorNotification(result.exception.message);
          }
        }, (error) => {
          if (error.message) {
            this.lienPortalService.errorNotification(error.message);
          }
        })
      }
    } catch (error) {
      if (error.message) {
        this.lienPortalService.errorNotification(error.message);
      }
    }
  }

  onSignatureComplete() {
    this.radiologistSign = this.signaturePad.toDataURL();
  }


    onSelected(time){
      this.selectedTimeToReminder = time;
  }

  openFundCompPupup(fundingCompanyId: number = 0) {
    this.fundingCompanyId = fundingCompanyId;
  }

  onReturnSuccess(isSuccess: any) {
    if (isSuccess) {
      this.fundingCompanyId = undefined;
      this.bindFundComp_list();
    }
  }
  changeStatus(){
    if(this.isEmailReminder == true)
      this.isReadonly = false;
    else
      this.isReadonly = true;
  }

  GetRadiologistSettings(){
    try {
      var request = {
        "loggedPartnerId": this.storageService.PartnerId,
        "jwtToken": this.storageService.PartnerJWTToken,
        "userId": this.storageService.user.UserId
      }
      this.lienPortalService.GetRadiologistSettings(request).subscribe((res)=>{
        if (res.status == 1){
          var data = res.result;
          this.isEmailReminder = data.isEmailReminder;
          this.isEmailSendCopy = data.isEmailSendCopy;
          this.isDefaultSignature = data.isDefaultSignature;
          this.selectedDays = data.emailReminders.dayOfWeek;
          this.selectedTimeToReminder = data.emailReminders.timeOfDay;
          this.defaultEmail = data.emailSendCopies[0];
          if(data.emailReminders.length > 1)
            this.firstEmail = data.emailSendCopies[1]
          if(data.emailSendCopies.length >1)
          this.secondEmail = data.emailSendCopies[2]
        }
      },(error)=>{
        if (error.message) {
          this.lienPortalService.errorNotification(error.message);
        }
      })
    } catch (error) {
      if (error.message) {
        this.lienPortalService.errorNotification(error.message);
      }
    }
  }

  saveSettings(){
    this.AddRadiologistSetting();
  }

  GetRadDefaultSign(){
    var data = {
      "loggedPartnerId": this.storageService.PartnerId,
      "jwtToken": this.storageService.PartnerJWTToken,
      "userId": this.storageService.user.UserId
    }
    this.lienPortalService.GetRadDefaultSign(data).subscribe((res)=>{
      if (res.status == 1){
        this.signaturePad.fromDataURL(res.result.defaultSign);
      }
    },(error)=>{
      this.lienPortalService.errorNotification(error.message);
    })
  }

  AddRadiologistSetting(){
   try {
      var requestEmailReminders ={
        'dayOfWeek': this.selectedDays,
        'timeOfDay': this.selectedTimeToReminder,
      }
      var requestEmailSendCopies = [];
      requestEmailSendCopies.push(this.defaultEmail);
      if(this.firstEmail)
        requestEmailSendCopies.push(this.firstEmail);
      if(this.secondEmail)
        requestEmailSendCopies.push(this.secondEmail);
          var requestData = {
            "isEmailReminder": this.isEmailReminder,
            "isEmailSendCopy": this.isEmailSendCopy,
            "isDefaultSignature": this.isDefaultSignature,
            "emailReminders": requestEmailReminders,
            "emailSendCopies": requestEmailSendCopies,
            "loggedPartnerId": this.storageService.PartnerId,
            "jwtToken": this.storageService.PartnerJWTToken,
            "userId": this.storageService.user.UserId
          }
          this.lienPortalService.AddRadiologistSetting(requestData).subscribe((res)=>{
            if (res.status == 1){
              this.lienPortalService.successNotification('Setting saved successfully');
              this.GetRadiologistSettings();
              this.GetRadDefaultSign();
            }
          },(error)=>{
            if (error.message) {
              this.lienPortalService.errorNotification(error.message);
            }
          })
         } catch (error) {
          if (error.message) {
            this.lienPortalService.errorNotification(error.message);
          }
         }
    }
}
