import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-sms-test',
  templateUrl: './sms-test.component.html',
  styleUrls: ['./sms-test.component.css']
})
export class SmsTestComponent implements OnInit {
  smsTestForm: FormGroup;
  smsTemplateList:any[];
  templateID:number;
  constructor(private fb: FormBuilder,private readonly settingsService:  SettingsService) { }

  ngOnInit(): void {
    this.getDropdown();
    this.getSMSForm();
  }
  getSMSForm(){
    this.smsTestForm = this.fb.group({
      accessionNumber: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      templateID:['',Validators.required]});
  }

  getDropdown() {
    this.settingsService.getSMSTemplate(true).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.smsTemplateList = JSON.parse(data.response);
      }
      else {
      }
    },
      (err: any) => {

      });
  }


  onSubmit(){
    var body={
      'accessionNumber':this.smsForm.accessionNumber.value,
      'templateId':this.smsForm.templateID.value,
      'phoneNumber':this.smsForm.phoneNumber.value,
    } 
    this.settingsService.sendSMS(true,body).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
         this.getSMSForm();
      }
      else {
      }
    },
      (err: any) => {

      });

  }
  
  get smsForm() { return this.smsTestForm.controls; }
}
