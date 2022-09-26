import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { userDetail } from 'src/app/models/user-detail';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { MyprofileService } from 'src/app/services/myprofile/myprofile.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class ProfileComponent implements OnInit {
 user:userDetail;
 model:any={};
 submitted:boolean=false;
 readonly dateTimeFormatCustom = DateTimeFormatCustom;
 constructor(private readonly myprofileService:MyprofileService,
  private readonly notificationService:NotificationService,
  private readonly storageService:StorageService,
  private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('My Profile');
    this.GetUserById();
  }

  GetUserById()
  {
    if(this.storageService.user.UserId)
    {
      let userId=this.storageService.user.UserId;
      this.myprofileService.getUserById(true,userId).subscribe((res)=>{
        if(res.response!=null)
        {
          this.model=res.response;
          this.model.licenceNumber= this.model.LICENSENUMBER;
          
        }
        else{
       this.unSuccessNotification(res,'Record not found.')
        }
      },(err:any)=>{
        this.errorNotification(err);
      });
    }
  }

  updateUser()
  {
    this.onSubmit();
    let body=this.model;  
    console.log(this.model)
    if (this.model.FIRSTNAME && this.model.LASTNAME) {

      this.myprofileService.updateUser(true,body).subscribe((res)=>{
        if(res.response!=null)
        {
          this.model=res.response;
          this.model.licenceNumber = this.model.LICENSENUMBER;
        
          this.SuccessNotification(res,'Success');
        }
        else{
       this.unSuccessNotification(res,'Record not found.')
        }
      },(err:any)=>{
        this.errorNotification(err);
      });
  }
}
  unSuccessNotification(res:any,msg:any)
  {
    
    this.notificationService.showNotification({
      alertHeader : msg,
      alertMessage: res.message,
      alertType: res.responseCode
    });
  
  }

  onSubmit() {
    this.submitted=true; 
   
}
  SuccessNotification(res:any,msg:any)
  {
    
    this.notificationService.showNotification({
      alertHeader : msg,
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }
  errorNotification(err:any)
  {
    this.notificationService.showNotification({
      alertHeader : err.statusText,
      alertMessage:err.message,
      alertType: err.status
    });
  }
}
