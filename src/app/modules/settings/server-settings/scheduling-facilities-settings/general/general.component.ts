import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralTabComponent implements OnInit {
  addEditForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private settingService: SettingsService, 
    private notificationService: NotificationService, private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.getSchedulingFacilitySetting();
    this.commonMethodService.setTitle('General');
    this.addEditForm = this.fb.group({
      dollerweight:['', [Validators.required]],
      mileweight:['', [Validators.required]]
    });     
  }

  getSchedulingFacilitySetting(){
    this.settingService.getSchedulingFacilitySetting(true).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.addEditForm.patchValue({
          dollerweight: data.response.Dollerweight,
          mileweight: data.response.Mileweight
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

  onInsertSubmit(){
    this.submitted = true;
    if (this.addEditForm.invalid) {
      return;
    }
    this.saveSchedulingFacilitySetting();
  }

  saveSchedulingFacilitySetting(){
    var data = {
      'dollerweight': this.aeForm.dollerweight.value,
      'mileweight': this.aeForm.mileweight.value
    }
    this.settingService.addUpdateSchedulingFacilitySetting(true, data).subscribe((res) =>{      
      if (res.responseCode == ResponseStatusCode.OK) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getSchedulingFacilitySetting();    
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

  get aeForm() { return this.addEditForm.controls; }
}
