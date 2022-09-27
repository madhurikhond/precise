import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css']
})
export class EmailFormComponent implements OnInit {

  data:any=[];
  modelValue:string='modal';
  submitted = false
  emailForm:FormGroup;

  constructor( private readonly settingsService:  SettingsService,private fb: FormBuilder,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {    
    this.emailForm = this.fb.group({
      AttorneyLienReminder: ['',[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      BillsEmail: ['',[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      FacilityPackage: [''],
      LiabPersisRemind: [''],
      RefStudySum: [''],
      AutoEmailReport: [''],
      EmailReminder: [''],
    })
    this.getAllEmailSendFromSetting();
  }
  
onSubmit(){
  this.submitted = true;
  this.modelValue='modal';
  if (this.emailForm.invalid) {
    this.modelValue='';
    return;
  }
   let NewData =[];
   let email='';
    for(let i=0; i<this.data.length; i++){
      if(this.data[i].emailFrom == 'Attorney Lien Reminder'){
        email = this.Email_Form.AttorneyLienReminder.value;
      }
      else if(this.data[i].emailFrom == 'Bills Email'){
        email= this.Email_Form.BillsEmail.value
     }
    else if(this.data[i].emailFrom == 'Facility Package'){
      email= this.Email_Form.FacilityPackage.value
    }  
    else if(this.data[i].emailFrom == 'LiabPersisRemind'){
      email= this.Email_Form.LiabPersisRemind.value
    } 
    else if(this.data[i].emailFrom == 'RefStudySum'){
      email= this.Email_Form.RefStudySum.value
    } 
    else if(this.data[i].emailFrom == 'Auto Email Report'){
      email= this.Email_Form.AutoEmailReport.value
    } 
    else if(this.data[i].emailFrom == 'EmailReminder'){
      email= this.Email_Form.EmailReminder.value
    } 
        NewData.push({
        id: this.data[i].id,
        Email: email
      });
      email='';
  }
  
}
  getAllEmailSendFromSetting(){
   
  }
  editData(){
    this.emailForm.patchValue({
      AttorneyLienReminder: this.data.filter(x => x.emailFrom == 'Attorney Lien Reminder')[0].email,
      BillsEmail: this.data.filter(x => x.emailFrom == 'Bills Email')[0].email,
      FacilityPackage:this.data.filter(x => x.emailFrom == 'Facility Package')[0].email,
      LiabPersisRemind:this.data.filter(x => x.emailFrom == 'LiabPersisRemind')[0].email,
      RefStudySum: this.data.filter(x => x.emailFrom == 'RefStudySum')[0].email,
      AutoEmailReport:this.data.filter(x => x.emailFrom == 'Auto Email Report')[0].email,
      EmailReminder:this.data.filter(x => x.emailFrom == 'EmailReminder')[0].email,
    })
  }
  get Email_Form() { return this.emailForm.controls; }
}
