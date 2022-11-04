import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ckeConfig } from 'src/app/constants/Ckeditor';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.css']
})
export class PickupComponent implements OnInit {
 
  pickupForm: FormGroup;
  submitted = false;
  editorConfig:any;
  name = 'ng2-ckeditor';
  //ckeConfig: CKEDITOR.config;
  ckeConfig:any;
  ckConfig:any;
  mycontent: string;
  log: string = '';
  readonly CkeConfig = ckeConfig;
  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Pickup');
    this.pickupForm = this.fb.group({
      body:['',[Validators.required]]
    });
    this.getPickupStatus();  
    
      
    // this.editorConfig = {
    //   removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed'],
    //   placeholder: 'Type the content here!'
    //     };

      
  }
  onChange($event: any): void {
    //this.log += new Date() + "<br />";
  }
  
  onPaste($event: any): void {
    //this.log += new Date() + "<br />";
  }
  getPickupStatus(){
    this.settingsService.getPickupStatus(true).subscribe((res) =>{
      if(res){
        this.pickupForm.patchValue({
          body:res.response.PI_Name
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
    if (this.pickupForm.invalid) {
      return;
    }
    var body={
      'Content': this.pForm.body.value,
    };
    this.settingsService.savePickupStatus(true, body).subscribe((res) =>{      
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

  get pForm() { return this.pickupForm.controls; }
}
