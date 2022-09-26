import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';
import * as moment from 'moment';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-slack',
  templateUrl: './slack.component.html',
  styleUrls: ['./slack.component.css'],
  providers:[DatePipe]
})
export class SlackComponent implements OnInit {
  id : number;
  slackForm:FormGroup;
  slackList =[]
  pageNumber:number = 1;
  pageSize:number;
  totalRecords:number;
  submitted = false
  popUpTittle:string='Add';
  modelValue:string='modal';
  reminder:string = 'Patient'
  smsLogType:any
  reminderType:string = 'Patient';
  pageNo:number =1
  reminderList:any =[];
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  readonly pageSizeArray=PageSizeArray;

  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService,
    private datePipe: DatePipe) { 
    }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.slackForm = this.fb.group({
      isActive: [''],
      purpose: ['',[Validators.required]],
      channel: ['',[Validators.required]],
      timeToRun: ['',[Validators.required]],
      comment: ['',[Validators.required]]
    })
    this.getSlackSettingsList()
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getAllReminderSettings();
  }


  getAllReminderSettings(){ 
    this.reminderType = 'Patient'
    this.pageNo = 1
    this.pageSize = this.pageSize;
    this.settingsService.getAllReminderStatus(true, this.reminderType, this.pageNo,this.pageSize).subscribe((res) => {
      var data: any = res;
      this.totalRecords = data.response[0].totalRecords
      this.reminderList = data.response
    }, 

    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,  
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }
  getSlackSettingsList(){
    this.settingsService.getAllSlackSttings(true).subscribe((res) =>{
      var data: any = res;
      this.totalRecords = res.totalRecords;
      if (data.response != null && data.response.length > 0) {
       this.slackList = data.response
      }
      else {
        this.notificationService.showNotification({
          alertHeader : data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
    this.clearSlackRecords()
  }
  pageChanged(event){
    this.pageNumber = event;
    this.getSlackSettingsList()
  }

  refreshSlackSetting(){
    this.getSlackSettingsList()
  }

  getSlackBySettingID(id){
    this.submitted=false;
    this.id = id;
    this.settingsService.getSlackSettingByID(true, id).subscribe((res) =>{
    this.slackForm.patchValue({
        isActive: res.response.isActive,
        purpose: res.response.purpose,
        channel: res.response.channel,
        timeToRun: this.convertTime12to24(res.response.timeToRun),
        comment: res.response.comment
      })
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }
  convertTime12to24(time12h:any){
    const [time, modifier] = time12h.split(' ');    
    let [hours, minutes] = time.split(':');    
    if (hours === '12') {
      hours = '00';
    }    
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }    
    return `${hours}:${minutes}`;
  }  

  onSubmit(){
    this.submitted = true;
    this.modelValue='modal';
    if (this.slackForm.invalid) {
      this.modelValue='';
      return;
    }

    if (this.id != null){
      this.updateSlackSettingById();
    }
    else{
      this.addSlackSetting()
    }
  }

  clearSlackRecords(){
      this.id = null,
      this.slckForm.isActive.setValue(''),
      this.slckForm.purpose.setValue(''),
      this.slckForm.channel.setValue(''),
      this.slckForm.timeToRun.setValue(''),
      this.slckForm.comment.setValue('')
  }

  updateSlackSettingById(){
    var body={
      'id': this.id,
      'isActive': this.slckForm.isActive.value,
      'purpose': this.slckForm.purpose.value,
      'channel': this.slckForm.channel.value,
      'timeToRun':this.slckForm.timeToRun.value,
      'comment': this.slckForm.comment.value
    }
    this.settingsService.updateSlackSetting(true, body).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getSlackSettingsList(); 
      
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

  slackSetting(){
    this.submitted=false;
  }

  addSlackSetting(){
    var temp;
    if(this.slckForm.isActive.value === true){
      temp = true;
    }
    else{
      temp =false;
    }    
    var body={
      'id': 0,
      'isActive': temp,
      'purpose': this.slckForm.purpose.value,
      'channel': this.slckForm.channel.value,
      'timeToRun':this.slckForm.timeToRun.value,
      'comment': this.slckForm.comment.value
    }
 
    this.settingsService.addSlackSetting(true, body).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getSlackSettingsList(); 
      
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
    this.clearSlackRecords()
  }


  getRowCurrentDetail(currentRow:any)
  {
   this.popUpTittle=currentRow.data.purpose;
    let id=currentRow.data.id;
    this.getSlackBySettingID(id);
  }

  get slckForm() { return this.slackForm.controls; }
}
