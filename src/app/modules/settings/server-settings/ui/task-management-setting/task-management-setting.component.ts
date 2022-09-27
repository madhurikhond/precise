import { Component, OnInit ,OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';

import { TaskManagementSlackGlobalSettings } from 'src/app/models/taskManagementSlackGlobalSettings';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { TaskManagementService } from 'src/app/services/task-management/task-management.service';


@Component({
  selector: 'app-task-management-setting',
  templateUrl: './task-management-setting.component.html',
  styleUrls: ['./task-management-setting.component.css'],
  providers:[TaskManagementService]
})
export class TaskManagementSettingComponent implements OnInit,OnDestroy {
  days:Array<Object>=[];
  taskManagementSlackGlobalSettingsForm:FormGroup;
  taskManagementSettingsFormForLabelTab:FormGroup;
  epicEmployees:Array<Object>=[];
  labelTabData:Array<Object>=[];
  SlackTabData:any={};
  currentEditLabelId:number=null;
  currentEditLabelName:string;
  
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  modalValue:string='modal';
  submitted:boolean=false;
  pageSize:number;
  pageNumber:number;
  readonly pageSizeArray=PageSizeArray;

  constructor(private readonly commonMethodService:CommonMethodService,private fb: FormBuilder,
    private readonly taskManagementService:TaskManagementService,
    private readonly notificationService:NotificationService) {
    this.commonMethodService.setTitle('Task Management Setting');
   }
  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.getDays();
    this.setGridSetting();
    this.createFormForSlackTab();
    this.createFormForLabelTab();
    this.getAllActiveEpicUsers();
    this.getTaskManagementSettingForLabelTab();
  }
  
 onPageSizeChange(event) {
  this.pageSize = event;
  this.pageNumber = 1;
}
  createFormForLabelTab() {
    this.taskManagementSettingsFormForLabelTab=this.fb.group({
      id:[null],
      labelName: ['', [Validators.required]],
      isLabelArchive: [false, [Validators.required]],
      isOverrideSlackGlobalSetting:[false],
      isNotifyOnTaskCreation:[false],
      notifyToUserOnTaskCreation:[''],
      isNotifyOnDueDay:[false],
      notifyToUserOnDueDay:[''],
      isNotifyAfterDueDay:[false],
      afterDueDay:[''],
      notifyToUserAfterDueDay:['']
    });
  }
  getTaskManagementSettingForLabelTab() {
    debugger;
    this.labelTabData=null;
    this.taskManagementService.getTaskManagementSettingForLabelTab(true).subscribe((res)=>{
      if(res.response!=null)
      {
        this.labelTabData=res.response;
        this.getTaskManagementSettingForSlackTab();
      }
    },(err:any)=>{
      this.errorNotification(err);
    });
  }

  getTaskManagementSettingForSlackTab() {
    debugger;
    this.SlackTabData=null;
    this.taskManagementService.getTaskManagementSettingForSlackTab(true).subscribe((res)=>{
      if(res.response!=null)
      {
        this.SlackTabData=res.response;
        this.bindSlackTabForm(this.SlackTabData);
      }
    },(err:any)=>{
      this.errorNotification(err);
    });
  }

  bindSlackTabForm(SlackTabData: any) {
    this.taskManagementSlackGlobalSettingsForm.patchValue({
      id:SlackTabData.Id,
      isNotifyOnTaskCreationGlobal:SlackTabData.IsNotifyOnTaskCreationGlobal,
      notifyToUserOnTaskCreationGlobal:SlackTabData.NotifyToUserOnTaskCreationGlobal,
      isNotifyOnDueDayGlobal:SlackTabData.IsNotifyOnDueDayGlobal,
      notifyToUserOnDueDayGlobal:SlackTabData.NotifyToUserOnDueDayGlobal,
      isNotifyAfterDueDayGlobal:SlackTabData.IsNotifyAfterDueDayGlobal,
      afterDueDayGlobal:SlackTabData.AfterDueDayGlobal,
      notifyToUserAfterDueDayGlobal:SlackTabData.NotifyToUserAfterDueDayGlobal,
      isSendDailySummaryGlobal:SlackTabData.IsSendDailySummaryGlobal,
      sendDailySummaryAtGlobal:SlackTabData.SendDailySummaryAtGlobal,
      sendDailySummaryOnDaysGlobal:SlackTabData.SendDailySummaryOnDaysGlobal? SlackTabData.SendDailySummaryOnDaysGlobal.split(','):null,
      epicUser: SlackTabData.EpicUser ? SlackTabData.EpicUser.split(',').map(a=>parseInt(a)):null,
      notes:SlackTabData.Notes
    });
  }
  setGridSetting() {
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;
  }
  createFormForSlackTab() {
    this.taskManagementSlackGlobalSettingsForm=this.fb.group({
      id:[null],
      isNotifyOnTaskCreationGlobal:[false],
      notifyToUserOnTaskCreationGlobal:[''],
      isNotifyOnDueDayGlobal:[false],
      notifyToUserOnDueDayGlobal:[''],
      isNotifyAfterDueDayGlobal:[false],
      afterDueDayGlobal:[null],
      notifyToUserAfterDueDayGlobal:[''],
      isSendDailySummaryGlobal:[false],
      sendDailySummaryAtGlobal:[''],
      sendDailySummaryOnDaysGlobal:[''],
      epicUser:[''],
      notes:['']
    });
  }
  getDays()
  {
    this.days=this.commonMethodService.getWeekDays();
  }
  getAllActiveEpicUsers() {
    this.taskManagementService.getAllActiveEpicUsers(false).subscribe((res)=>{
     if(res.response!=null)
     {
       this.epicEmployees=res.response;
     }
    },(err:any)=>{
      this.errorNotification(err);
    });
  }
  allowNumberOnly(event:any):boolean
  {
  return this.commonMethodService.alowNumberOnly(event);
  }
  updateTaskManagementSlackGlobalSettings()
  {
    debugger;
    let body=new TaskManagementSlackGlobalSettings(
      this.slackGlobleControls.id.value,
      this.slackGlobleControls.isNotifyOnTaskCreationGlobal.value?this.slackGlobleControls.isNotifyOnTaskCreationGlobal.value:false,
      this.slackGlobleControls.notifyToUserOnTaskCreationGlobal.value,
      this.slackGlobleControls.isNotifyOnDueDayGlobal.value?this.slackGlobleControls.isNotifyOnDueDayGlobal.value:false,
      this.slackGlobleControls.notifyToUserOnDueDayGlobal.value,
      this.slackGlobleControls.isNotifyAfterDueDayGlobal.value?this.slackGlobleControls.isNotifyAfterDueDayGlobal.value:false,
      this.slackGlobleControls.afterDueDayGlobal.value,
      this.slackGlobleControls.notifyToUserAfterDueDayGlobal.value,
      this.slackGlobleControls.isSendDailySummaryGlobal.value?this.slackGlobleControls.isSendDailySummaryGlobal.value:false,
      this.slackGlobleControls.sendDailySummaryAtGlobal.value,
      this.slackGlobleControls.sendDailySummaryOnDaysGlobal.value?this.slackGlobleControls.sendDailySummaryOnDaysGlobal.value.toString():'',
      this.slackGlobleControls.epicUser.value?this.slackGlobleControls.epicUser.value.toString():'',
      this.slackGlobleControls.notes.value);
      
      this.taskManagementService.updateTaskManagementSlackGlobalSettings(true,body).subscribe((res)=>{
        if(res.response!=null)
        {
          this.SlackTabData=res.response;
          this.successNotification(res);
          this.bindSlackTabForm(this.SlackTabData);
        }
      },(err:any)=>{
        this.errorNotification(err);
      });
  }

  actionArrowButtonClickForLabelTab(editRow:any)
  {
   debugger;
   this.submitted=false;
   this.modalValue='modal';
   this.currentEditLabelId=editRow.Id;
   this.bindLabelTabForm(editRow);

  }

   bindLabelTabForm(editRow:any) {
    this.taskManagementSettingsFormForLabelTab.reset();
    this.currentEditLabelName=editRow.LabelName;
    this.taskManagementSettingsFormForLabelTab.patchValue({
    id:editRow.Id,
    labelName:editRow.LabelName,
    isLabelArchive:editRow.IsLabelArchive,
    isOverrideSlackGlobalSetting:editRow.IsOverrideSlackGlobalSetting,
    isNotifyOnTaskCreation:editRow.IsNotifyOnTaskCreation,
    notifyToUserOnTaskCreation:editRow.NotifyToUserOnTaskCreation,
    isNotifyOnDueDay:editRow.IsNotifyOnDueDay,
    notifyToUserOnDueDay:editRow.NotifyToUserOnDueDay,
    isNotifyAfterDueDay:editRow.IsNotifyAfterDueDay,
    afterDueDay:editRow.AfterDueDay,
    notifyToUserAfterDueDay:editRow.NotifyToUserAfterDueDay,
 });
// this.taskManagementSettingsFormForLabelTab.controls['labelName'].disable();
  }
  SlackOverrideButtonClickForLabelTab(editRow:any)
  {
      this.bindLabelTabForm(editRow);
  }
  updateTaskManagementSettingForLabelTab() {

    this.submitted=true;
    this.modalValue='modal';
    if(this.taskManagementSettingsFormForLabelTab.invalid)
    {
      this.modalValue='';
      return ;
    }
    debugger;
    this.taskManagementService.updateTaskManagementSettingForLabel(true,this.taskManagementSettingsFormForLabelTab.value).subscribe((res)=>{
      if(res.response!=null)
      {
        this.successNotification(res);
        this.getTaskManagementSettingForLabelTab();
        this.taskManagementSettingsFormForLabelTab.reset();
      }
    },(err:any)=>{
      this.errorNotification(err);
    });
  }
  addNewLabelButtonClick()
  {
    this.currentEditLabelId=null;
    this.currentEditLabelName=null;
    this.submitted=false;
    this.modalValue='modal';
    this.taskManagementSettingsFormForLabelTab.reset();

  }
  lableTabCancelButtonClick()
  {
    this.submitted=false;
    this.modalValue='modal';
    this.taskManagementSettingsFormForLabelTab.reset();
  }
  addTaskManagementSettingForLabelTab()
  {
    this.submitted=true;
    this.modalValue='modal';
    if(this.taskManagementSettingsFormForLabelTab.invalid)
    {
      this.modalValue='';
      return ;
    }
    debugger
    this.taskManagementService.addTaskManagementSettingForLabel(true,this.taskManagementSettingsFormForLabelTab.value).subscribe((res)=>{

      if (res.response != null) {
        this.successNotification(res);
        this.getTaskManagementSettingForLabelTab();
        this.taskManagementSettingsFormForLabelTab.reset();
      }
      else {
        this.errorNotification(res)
      }
    },(err:any)=>{
      this.errorNotification(err);
    });
  }
  ngOnDestroy() {  
    debugger;
    this.days=null;
    this.epicEmployees=null;
    this.labelTabData=null;
    this.currentEditLabelId=null;
    this.currentEditLabelName=null;
    this.taskManagementSlackGlobalSettingsForm.reset();
    this.taskManagementSettingsFormForLabelTab.reset();
 } 

// common Notification Method
  successNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader : 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
        });
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
  }
  
  get slackGlobleControls(){ return this.taskManagementSlackGlobalSettingsForm.controls};

  get labelTabFormControl(){ return   this.taskManagementSettingsFormForLabelTab.controls}
  
}


