import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-broker-psl',
  templateUrl: './broker-psl.component.html',
  styleUrls: ['./broker-psl.component.css']
})
export class BrokerPslComponent implements OnInit {
  brokerPslFormSettings: FormGroup;
  id:number;
  body:any;
  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

    ngOnInit(): void {
      this.brokerPslFormSettings = this.fb.group({
        isActive: [''],
        serviceTime: [''],
        comment: [''],
      });
      this.getBrokerPslSettings();
    }
    getBrokerPslSettings()
    {
      this.settingsService.GetAllPatientStudySchedulingSetting(true).subscribe((res)=>{
      var data=res;
      this.id=data.response[0].id;
      if (data.response != null && data.response.length > 0) {
        this.brokerPslFormSettings.patchValue({
          isActive:data.response[0].isBrokerPSL,
          serviceTime:data.response[0].brokerServiceTime,
          comment:data.response[0].brokePSLNote,
        });
      }
      else{
        this.showNotification(data);
      }
      },(err : any) => {
        this.showError(err);
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
    // common Notification Method
showNotification(data: any) {
  this.notificationService.showNotification({
        alertHeader : data.statusText,
        alertMessage: data.message,
        alertType: data.responseCode
      });
}
onSubmit()
{
  this.updateBrokerPslSettings();
}
updateBrokerPslSettings()
{
 this.body={
'id': this.id,
'isBrokerPSL': this.getFromControls.isActive.value,
'brokerServiceTime': this.getFromControls.serviceTime.value,
'brokePSLNote': this.getFromControls.comment.value,
'tabName':'Broker PSL'
  }
  if(this.id)
  {
    this.settingsService.UpdatePatientStudySchedulingSetting(true,this.body).subscribe((res : any) => {
      if (res) { 
          this.getBrokerPslSettings();
          this.notificationService.showNotification({ 
          alertHeader : 'Success',
          alertMessage: res.message,
          alertType: res.responseCode
        });
      }
    },
    (err : any) => {
      this.notificationService.showNotification({ 
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: ResponseStatusCode.InternalError
      });
    }
    );
  } 
}

get getFromControls() { return this.brokerPslFormSettings.controls; }

}
