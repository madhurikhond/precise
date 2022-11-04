import { Component, OnInit } from '@angular/core';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { MyprofileService } from 'src/app/services/myprofile/myprofile.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationsComponent implements OnInit {
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any;
  currentFilter: any;
  contextMenu:any;
  showHeaderFilter: boolean;
  //// filter Properties
  notificationMessage:string='';
  dropDownValue:string='Show All';
  filterForm:string='';
  filterTo:string='';
  imagePath:string='';
  popUpNotificationMessage:string
   //////
  notificationList:any=[];
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  constructor(private readonly myprofileService:MyprofileService,
    private readonly notificationService:NotificationService,
    private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Notifications');
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately'
  }, {
      key: 'onClick',
      name: 'On Button Click'
  }];
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;
    this.contextMenu = [{text: 'Mark as Unread'},{ text: 'Mark as Incomplete' }];
    this.getNotification();
  }
  getNotification()
  {
    this.myprofileService.getNotification(true).subscribe((res)=>{
      if(res.response!=null)
      {
        this.notificationList=res.response;
      }
    },(err:any)=>{
       this.errorNotification(err);
    });
  }
 
  clearFilter()
  {
     this.filterTo='';
     this.filterForm='';
     this.notificationMessage='';
     this.dropDownValue='Show All'
     this.getNotification();
  }
  filterNoticifation()
  {
    
    this.notificationList=[];
     this.myprofileService.getNotificationByFilter(true,this.notificationMessage, this.filterForm, this.filterTo, this.dropDownValue).subscribe((res)=>{
      if(res.response!=null)
      {
        this.notificationList=res.response;
      }
    },(err:any)=>{
       this.errorNotification(err);
    });
  }
  contextMenuClick(row:any,e:any)
  {
  let notificatioId=row.data.NotificationID;
  if(notificatioId)
     {
        if(e.itemData.text.toLocaleLowerCase()==='mark as unread')
          { 
              this.markUnReadNotification(notificatioId);        
          }
          else if(e.itemData.text.toLocaleLowerCase()==='mark as incomplete')
          {
              this.markUnCompletedNotification(notificatioId);
          }
      } 
  }
  mrakCompleteOrUncomplete(row:any,e:any)
  {
    
    let notificatioId=row.data.NotificationID;
    if(notificatioId)
    {
     if(e.currentTarget.checked)
     {
       this.markCompletedNotification(notificatioId)
     }
     else if(e.currentTarget.checked===false)
     {
       this.markUnCompletedNotification(notificatioId)
     }
    }
  }
  markReadNotification(row:any,isNotificationShow:boolean)
  {
    
    this.popUpNotificationMessage=row.data.NotificationMessage;
    let IsNotificationRead=row.data.IsNotificationRead;
    if(IsNotificationRead===false && row.data.NotificationID)
    {
      
      this.readNotification(row.data.NotificationID,isNotificationShow);
    }
  }
  readNotification(notificatioId:number,isNotificationShow:boolean)
  { 

    let body={};
   this.myprofileService.readNotification(true,notificatioId,body).subscribe((res)=>{
    if(res.response!=null)
    {
      if(isNotificationShow)
      {
        this.successNotification(res,'Success');
      }
      this.getNotification();
    }
   },(err:any)=>{
     this.errorNotification(err);
   });
  }
  markUnReadNotification(notificatioId:number)
  { 
    let body={};
   this.myprofileService.unReadNotification(true,notificatioId,body).subscribe((res)=>{
    if(res.response!=null)
    {
      
     this.successNotification(res,'Success');
     this.getNotification();
    }
   },(err:any)=>{
     this.errorNotification(err);
   });
  }
  markUnCompletedNotification(notificatioId:number)
  {
    let body={};
     this.myprofileService.unCompletedNotification(true,notificatioId,body).subscribe((res)=>{
      if(res.response!=null)
      {
        
       this.successNotification(res,'Success');
       this.getNotification();
      }
     },(err:any)=>{
       this.errorNotification(err);
     });
  }
  

  markCompletedNotification(notificatioId:number)
  {
      let body={};
      this.myprofileService.completedNotification(true,notificatioId,body).subscribe((res)=>{
      if(res.response!=null)  
      {
        
       this.successNotification(res,'Success');
       this.getNotification();
      }
     },(err:any)=>{
       this.errorNotification(err);
     });
  }



  successNotification(res:any,msg:any)
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
