import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ckeConfig } from 'src/app/constants/Ckeditor';

@Component({
  selector: 'app-elec-agree',
  templateUrl: './elec-agree.component.html',
  styleUrls: ['./elec-agree.component.css']
})
export class ElecAgreeComponent implements OnInit {

  elecSignForm: FormGroup;
  submitted = false;
  readonly CkeConfig = ckeConfig;
  name = 'ng2-ckeditor';
  //ckeConfig: CKEDITOR.config;
  ckeConfig:any;
  ckConfig:any;
  mycontent: string;
  log: string = '';

  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Elec. Agree');
    this.elecSignForm = this.fb.group({
      body:['',[Validators.required]]
    });
    this.getASLSetting();
  }

  onChange($event: any): void {
    console.log("onChange");
    //this.log += new Date() + "<br />";
  }
  
  onPaste($event: any): void {
    console.log("onPaste");
    //this.log += new Date() + "<br />";
  }

  getASLSetting(){
    this.settingsService.getASLSetting(true).subscribe((res) =>{
      if(res){
        this.elecSignForm.patchValue({
          body:res.response.ElecAgree
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
  }

  onSubmit(){
    this.submitted = true;
    if (this.elecSignForm.invalid) {
      return;
    }
    var body={
      'Content': this.esForm.body.value,
    };
    this.settingsService.saveASLSetting(true, body).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : (res.responseCode === ResponseStatusCode.OK) ? 'Success' : 'Error',
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }      
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

  get esForm() { return this.elecSignForm.controls; }
}
