import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { ckeConfig } from 'src/app/constants/Ckeditor';
import { CommonRegex } from 'src/app/constants/commonregex';


@Component({
  selector: 'app-reason',
  templateUrl: './reason.component.html',
  styleUrls: ['./reason.component.css']
})
export class ReasonComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  a3: any = 20;
  a4: any = 20;
  a5: any = 20;
  a6: any = 20;
  a7: any = 20;
  a8: any = 20;
  a9: any = 20;
  a10: any = 20;
  a11: any = 20;

  IsSubmitted:boolean=false;
  isBtnVisible:boolean=true;
  modelValue:string;
  popUpTitle:string='Add';
  rid:number;
  reasonForm : FormGroup
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;


  reasonList:any=[]
  statusList:any=[];
  financialTypeList:any=[];
  docTypeList:any=[];
  alertTypeList:any=[];
  patientLevelColumnList:any=[];
  patientStudyLevelColumnList:any=[];
  defaultContactList=[{name: 'Doctor'},
  {name: 'Attorney'},];
  defaultContactMethodList=[{name: 'Email'},
  {name: 'Fax'},];

  selectedAlertType:string;
  selectedDefaultContactList=[];
  selectedContactMethodList=[];
  selectedResendStatusForReferrerList=[];
  selectedResendFinancialTypeForReferrerList=[];
  selectedResendStatusForPatientList=[];
  selectedResendFinancialTypeForPatientList=[];
  selectedResendStatusForActionNeededList=[];
  selectedResendFinancialTypeForNeededList=[];
  selectedPatientLevelColumn:string;
  selectedPatientStudyLevelColumn:string;
  selectedAutoClearStatusList:any=[];
  selectedAutoClearFinancialTypeList:any=[];
  selectedDocTypeList:any=[];
  pageNumber:number=1;
  pageSize:number;
  totalRecords: number=1;
  readonly pageSizeArray=PageSizeArray;
  readonly CkeConfig = ckeConfig;
  buttonText :string = '';
  name = 'ng2-ckeditor';
  //ckeConfig: CKEDITOR.config;
  ckeConfig:any;
  ckConfig:any;
  mycontent: string;
  log: string = '';
  readonly commonRegex=CommonRegex;

  constructor(private fb: FormBuilder,
    private settingsService:SettingsService,
    private notificationService:NotificationService,
    private commonMethodService: CommonMethodService,private storageService:StorageService,) { 
      this.showFilterRow = true;
      this.showHeaderFilter = false;
      this.applyFilterTypes = [{
        key: 'auto',
        name: 'Immediately'
      }, {
        key: 'onClick',
        name: 'On Button Click'
      }];
      this.columnResizingMode = this.resizingModes[0];
      this.currentFilter = this.applyFilterTypes[0].key;
    }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.commonMethodService.setTitle('Reasons');
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;

    this.reasonForm = this.fb.group({
      rid:[''],
      reason: ['', [Validators.required]],
      alerttype: [null, [Validators.required]],
      defaultContact: [''],
      defaultEmailSubject: [''],
      defaultBody: [''],
      defaultSms: [''],
      isNewRX: [''],
      pendingInfo: [''],
      isActive: [''],
      isCreatedAlertUserSendEmail: [''],
      isSendEmailToOthers: [''],
      notifyEmails: ['' ,[Validators.pattern(this.commonRegex.EmailRegex)]],
      currentUserID: [''],
      isReasonEdit: [''],
      docType: [''],
      isSystemAutoCreateAlert: [''],
      isSystemAutoClearAlert: [''],
      patientHeader: [''],
      patientStudyHeader: [''],
      defaultContactMethod: [''],
      isAutoDialerUse: [''],
      isOrderedSmsUse: [''],
      id: [''],
      isResendAlert: [''],
      resendStatus: [''],
      resendFinancial: [''],
      resendAfterDays: [''],
      isAutoClearAlert: [''],
      autoClearStatus: [''],
      autoClearFinancial: [''],
      autoClearAfterDays: [''],
      isPatientSendSms: [''],
      patientStatus: [''],
      patientFinancial: [''],
      sendSmsAfterDays: [''],
      patientSendText: [''],
      isActionNeededAdded: [''],
      actionNeededStatus: [''],
      actionNeededFinancial: [''],
      actionNeededAddedAfterDays: ['']
    });
    this.getAllReasons()
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getAllReasons();
  }

  getAllReasons() {
    this.settingsService.getAlertReasonsSetting(true,this.pageNumber, this.pageSize).subscribe((res)=>{
      var data:any=res;
      this.totalRecords = res.totalRecords;
    if (res.response != null && res.response.length > 0) { 
      this.reasonList=res.response;  
    }
    else{
      this.totalRecords = 1;        
      this.reasonList = [];
    }
    },(err : any) => {
      this.showError(err);
    });
  }

  onChange($event: any): void {
    console.log("onChange");
    //this.log += new Date() + "<br />";
  }
  
  onPaste($event: any): void {
    console.log("onPaste");
    //this.log += new Date() + "<br />";
  }
  refresh(){
    this.pageNumber=1;
    this.getAllReasons();
  }
  getCurrentRowDetail(event:any){
    this.buttonText = 'update'
    this.isBtnVisible=true;
    this.rid =event.data.rid;
    this.popUpTitle=event.data.reason;
    this.getAlertEditDropDown();
    this.getReasonSettingById()
  } 
  getAlertEditDropDown()
  {
    
    this.settingsService.getAlertEditDropdown(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.statusList = data.response[0][0].Status;
        this.financialTypeList=data.response[1][0].FinancialType;
        this.docTypeList=data.response[2][0].DocType;
        this.alertTypeList=data.response[3][0].AlterType;
        this.patientLevelColumnList=data.response[4][0].PatientModule;
        this.patientStudyLevelColumnList=data.response[5][0].PatientStudy;
      }
      else {
        this.showNotification(res);
      }
    }, 
    (err : any) => {
      this.showError(err);
    });
  }

  getReasonSettingById(){

    this.settingsService.getAlertReasonSettingById(true, this.rid).subscribe((res) =>{
      if (res.response!= null) {
        this.selectedDefaultContactList =res.response.defaultContact?res.response.defaultContact.split(',').map(function(item) {
          return item.trim();
        }):'';
        this.selectedContactMethodList=res.response.defaultContactMethod?res.response.defaultContactMethod.split(',').map(function(item) {
          return item.trim();
        }):'';
        this.selectedResendStatusForReferrerList=res.response.resendStatus?res.response.resendStatus.split(',').map(function(item) {
          return item.trim();
        }):'';
        this.selectedResendFinancialTypeForReferrerList=res.response.resendFinancial?res.response.resendFinancial.split(',').map(function(item) {
          return item.trim();
        }):'';
        this.selectedResendStatusForPatientList=res.response.patientStatus?res.response.patientStatus.split(',').map(function(item) {
          return item.trim();
        }):'';

        this.selectedResendFinancialTypeForPatientList=res.response.patientFinancial?res.response.patientFinancial.split(',').map(function(item) { 
          return item.trim();
        }):'';
        this.selectedResendStatusForActionNeededList=res.response.actionNeededStatus?res.response.actionNeededStatus.split(',').map(function(item) {
          return item.trim();
        }):'';
        this.selectedResendFinancialTypeForNeededList=res.response.actionNeededFinancial?res.response.actionNeededFinancial.split(',').map(function(item) {
          return item.trim();
        }):'';
        this.selectedPatientLevelColumn=res.response.patientHeader?res.response.patientHeader.split(',').map(function(item) {
          return item.trim();
        }):'';
        this.selectedPatientStudyLevelColumn=res.response.patientStudyHeader?res.response.patientStudyHeader.split(',').map(function(item) {
          return item.trim();
        }):'';
        this.selectedAutoClearStatusList=res.response.autoClearStatus?res.response.autoClearStatus.split(',').map(function(item) {
          return item.trim();
        }):'';
        this.selectedAutoClearFinancialTypeList=res.response.autoClearFinancial?res.response.autoClearFinancial.split(',').map(function(item) {
          return item.trim();
        }):'';
        this.selectedDocTypeList=res.response.docType?res.response.split(',').map(function(item) {
          return item.trim();
        }):'';
         this.selectedAlertType=res.response.alerttype;
          this.reasonForm.patchValue({
            rid:res.response.rid,
            id:res.response.id,
            currentUserID:res.response.currentUserID,
            isActive:res.response.isActive,
            reason: res.response.reason,
            alerttype: res.response.alerttype,
            defaultEmailSubject: res.response.defaultEmailSubject,
            defaultBody: res.response.defaultBody,
            defaultSms:res.response.defaultSms,
            isResendAlert:res.response.isResendAlert,
            resendAfterDays:res.response.resendAfterDays,
            isActionNeededAdded:res.response.isActionNeededAdded,
            actionNeededAddedAfterDays:res.response.actionNeededAddedAfterDays,
            isPatientSendSms:res.response.isPatientSendSms,
            sendSmsAfterDays:res.response.sendSmsAfterDays,
            patientSendText:res.response.patientSendText,
            isNewRX:res.response.isNewRX,
            isSystemAutoCreateAlert:res.response.isSystemAutoCreateAlert,
            pendingInfo:res.response.pendingInfo,
            isSystemAutoClearAlert:res.response.isSystemAutoClearAlert,
            isCreatedAlertUserSendEmail:res.response.isCreatedAlertUserSendEmail,
            isSendEmailToOthers:res.response.isSendEmailToOthers,
            notifyEmails:res.response.notifyEmails,
            isAutoClearAlert:res.response.isAutoClearAlert,
            autoClearAfterDays:res.response.autoClearAfterDays,
            isAutoDialerUse:res.response.isAutoDialerUse,
            isOrderedSmsUse:res.response.isOrderedSmsUse,
            isReasonEdit:res.response.isReasonEdit,
      });
    }
    else{
      
        this.showNotification(res);
    }
    }, 
    (err : any) => {
      this.showError(err);
    });
  }
  onChangeTypeDropDown(alertType: string) 
  {
    this.selectedAlertType = alertType;
  }
  onChangePatientLevelDropDown(column:string)
  {
   this.selectedPatientLevelColumn=column;
  }
  onChangePatientStudyLevelDropDown(column:string)
  {
   this.selectedPatientStudyLevelColumn=column;
  }
 // common Notification Method
 showNotification(data: any) {
  this.notificationService.showNotification({
    alertHeader : 'No Record Found.',
    alertMessage: data.message,
    alertType: data.responseCode
      });
}
showNotificationOnSucess(data: any) {
  this.notificationService.showNotification({
        alertHeader : data.statusText,
        alertMessage: data.message,
        alertType: data.responseCode
      });
}
// common Error Method
showError(err: any) {
  this.notificationService.showNotification({
      alertHeader : err.statusText,
      alertMessage:err.message,
      alertType: err.status
    });
}

  clearRecords(){
    this.reasonForm.reset()
  }

  generateDulicateRow(){
    this.settingsService.generateDuplicateReasonSetting(true, this.rid).subscribe((res) =>{
      if (res.response!= null) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        });
        this.getAllReasons(); 
      }
      else{
        this.notificationService.showNotification({ 
          alertHeader : 'Something went wrong.' ,
          alertMessage: res.message,
          alertType: res.responseCode
        });
        this.getAllReasons();
      }
    }, 
    (err : any) => {
      this.showError(err);
    });
  }
  
  onSubmit()
  {
  this.IsSubmitted=true;
  this.modelValue='modal';
    if (this.reasonForm.invalid){
      this.modelValue='';
      return;
    }
    var body={
      rid: this.getFromControls.rid.value,
      reason:  this.getFromControls.reason.value,
      alerttype: this.selectedAlertType==null ? '' : this.selectedAlertType.toString() ,
      defaultContact:  this.selectedDefaultContactList==null ? '' : this.selectedDefaultContactList.toString(),
      defaultEmailSubject:  this.getFromControls.defaultEmailSubject.value,
      defaultBody:  this.getFromControls.defaultBody.value,
      defaultSms:  this.getFromControls.defaultSms.value,
      isNewRX:  this.getFromControls.isNewRX.value == null ? false : this.getFromControls.isNewRX.value,
      pendingInfo:  this.getFromControls.pendingInfo.value == null ? false : this.getFromControls.pendingInfo.value,
      isActive:  this.getFromControls.isActive.value == null ? false : this.getFromControls.isActive.value,
      isCreatedAlertUserSendEmail:  this.getFromControls.isCreatedAlertUserSendEmail.value == null ? false :this.getFromControls.isCreatedAlertUserSendEmail.value,
      isSendEmailToOthers:  this.getFromControls.isSendEmailToOthers.value == null ? false : this.getFromControls.isSendEmailToOthers.value,
      notifyEmails:  this.getFromControls.notifyEmails.value,
      currentUserID:  this.storageService.user.UserId.toString(),
      isReasonEdit:  this.getFromControls.isReasonEdit.value == null ? false : this.getFromControls.isReasonEdit.value,
      docType:  this.selectedDocTypeList==null ? '' : this.selectedDocTypeList.toString(),
      isSystemAutoCreateAlert:  this.getFromControls.isSystemAutoCreateAlert.value == null ? false : this.getFromControls.isSystemAutoCreateAlert.value,
      isSystemAutoClearAlert:  this.getFromControls.isSystemAutoClearAlert.value == null ? false : this.getFromControls.isSystemAutoClearAlert.value,
      patientHeader:  this.selectedPatientLevelColumn==null ? '' : this.selectedPatientLevelColumn.toString(),
      patientStudyHeader:  this.selectedPatientStudyLevelColumn==null ? '' : this.selectedPatientStudyLevelColumn.toString(),
      defaultContactMethod:  this.selectedContactMethodList==null ? '' : this.selectedContactMethodList.toString(),
      isAutoDialerUse:  this.getFromControls.isAutoDialerUse.value == null ? false : this.getFromControls.isAutoDialerUse.value,
      isOrderedSmsUse:  this.getFromControls.isOrderedSmsUse.value == null ? false : this.getFromControls.isOrderedSmsUse.value,
      id:  this.getFromControls.id.value,
      isResendAlert:  this.getFromControls.isResendAlert.value == null ? false : this.getFromControls.isResendAlert.value,
      //resendStatus:  this.selectedResendStatusForReferrerList.toString() == ''  ? null : this.selectedResendStatusForReferrerList.toString(),
      resendStatus: !this.selectedResendStatusForReferrerList ? '' : this.selectedResendStatusForReferrerList.toString(),
      //resendFinancial:  this.selectedResendFinancialTypeForReferrerList.toString() == ''  ? null : this.selectedResendFinancialTypeForReferrerList.toString(),
      resendFinancial : !this.selectedResendFinancialTypeForReferrerList? '' :this.selectedResendFinancialTypeForReferrerList.toString(),
      resendAfterDays:  this.getFromControls.resendAfterDays.value,
      isAutoClearAlert:  this.getFromControls.isAutoClearAlert.value == null ? false : this.getFromControls.isAutoClearAlert.value,
      autoClearStatus:  this.selectedAutoClearStatusList==null ? '' : this.selectedAutoClearStatusList.toString(),
      autoClearFinancial:  this.selectedAutoClearFinancialTypeList==null ? '' : this.selectedAutoClearFinancialTypeList.toString(),
      autoClearAfterDays:  this.getFromControls.autoClearAfterDays.value,
      isPatientSendSms:  this.getFromControls.isPatientSendSms.value == null ? false : this.getFromControls.isPatientSendSms.value,
      patientStatus: !this.selectedResendStatusForPatientList  ? '': this.selectedResendStatusForPatientList.toString() ,
      patientFinancial: !this.selectedResendFinancialTypeForPatientList ? '' : this.selectedResendFinancialTypeForPatientList.toString() ,
      sendSmsAfterDays:  this.getFromControls.sendSmsAfterDays.value,
      patientSendText:  this.getFromControls.patientSendText.value,
      isActionNeededAdded:  this.getFromControls.isActionNeededAdded.value == null ? false : this.getFromControls.isActionNeededAdded.value,
      actionNeededStatus:  !this.selectedResendStatusForActionNeededList ? '' : this.selectedResendStatusForActionNeededList.toString(),
      actionNeededFinancial:  !this.selectedResendFinancialTypeForNeededList  ? '' : this.selectedResendFinancialTypeForNeededList.toString(),
      actionNeededAddedAfterDays: this.getFromControls.actionNeededAddedAfterDays.value 
    }
    
    if (body.rid)
    {
      this.settingsService.updateAlertReasonSetting(true, body).subscribe((res) =>{      
        if (res.response!=null) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          });
          this.getAllReasons(); 
        }
        else{
          this.notificationService.showNotification({ 
            alertHeader : 'Something went wrong.' ,
            alertMessage: res.message,
            alertType: res.responseCode
          });
          this.getAllReasons();
        }
      }, 
      (err : any) => {
        this.showError(err);
      });
    }
    else{
      this.settingsService.addAlertReasonSetting(true, body).subscribe((res) =>{      
        if (res.response!=null) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          });
          this.getAllReasons();
        }
        else{
          this.notificationService.showNotification({ 
            alertHeader : 'Something went wrong.' ,
            alertMessage: res.message,
            alertType: res.responseCode
          });
          this.getAllReasons();
        }
      }, 
      (err : any) => {
        this.showError(err);
      });
    }
  }
  restForm()
  {
    this.isBtnVisible=false;
    this.popUpTitle='Add';
    this.IsSubmitted=false;
    this.buttonText= 'Add';
    this.reasonForm.reset();
    this.getAlertEditDropDown();
  }
  
  pageChanged(event) { 
    this.pageNumber = event;
    this.getAllReasons()
  }


  get getFromControls() { return this.reasonForm.controls; }

  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
