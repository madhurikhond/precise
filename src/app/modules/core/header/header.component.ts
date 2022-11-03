import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TaskManagementApplyFilter } from 'src/app/models/taskManagementSlackGlobalSettings';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { TaskManagementService } from 'src/app/services/task-management/task-management.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';

import { PrescreeningSmallWindowComponent } from 'src/app/modules/shared/components/prescreening-small-window/prescreening-small-window.component';

declare const $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],


})
export class HeaderComponent implements OnInit {
  @ViewChild('hiddenDocManager', { static: false }) hiddenDocManager: ElementRef;
  toDoTaskCount: number = 0;
  applyFilterBody: TaskManagementApplyFilter;
  isDocManagerShow: boolean = false;
  data: any = '';
  username: any = '';
  responseHierarchy: any = [];
  list:any= [];
  headerPopupList:any=[];
  rightNavList:any=[];
  docManager:any;
  taskManager:any;
  createAlert:any;
  preScreenQuestions:any;
  autoRouteV2:any;
  constructor(private readonly _storageService: StorageService, private readonly _router: Router, 
    private readonly _commonMethodService: CommonMethodService, private _modalService: NgbModal,
    private taskManagementService: TaskManagementService, private readonly notificationService: NotificationService, private readonly workflowService: WorkflowService) {
    this._commonMethodService.toDoTaskCountForHeader.subscribe((res: any) => {
      this.toDoTaskCount = res;
    });
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.deleteOrderedSchedulerActivity();
      }
    });
  }

  ngOnInit(): void {
    this.applyFilter('', '', '', '', '', 'ToDo');
    this.getUser();
    this.getPermission();
  }
  
  applyFilter(assignedBy: string, assignedTo: string, dueDate: string, label: string,savedSearch:string, status: string) {

    this.applyFilterBody = new TaskManagementApplyFilter(assignedBy, assignedTo, dueDate, label,savedSearch, status, this._storageService.user.UserId);
    this.taskManagementService.taskManagementApplyFilter(true, this.applyFilterBody).subscribe((res) => {
      if (res.response != null && res.response?.length > 0) {
        this.toDoTaskCount = res.toDoRecords;
      }
      else {
        this.toDoTaskCount = 0; 
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  logOut() {
    this.deleteOrderedSchedulerActivity()
    this._commonMethodService.clearAllSubjects();
    this._storageService.clearAll();
    localStorage.removeItem('user');
    localStorage.removeItem('roles');    
    this._router.navigate(['login']);
    localStorage.removeItem('_cr_u_infor');
    localStorage.removeItem('storage');
    localStorage.removeItem('isPermissionChanged');
  }

  deleteOrderedSchedulerActivity() {
    this.workflowService.deleteOrderedSchedulerActivity().subscribe((res) => {
    });
  }


  toggleSidenav() {
    this._commonMethodService.toggleSideNav(true);
  }
  showTaskManagementWindow() {
    this._commonMethodService.showTaskManagementWindow(true);
  }
  showCreateAlertPopup(){
    $('.caPatientID').val('');
    this._commonMethodService.sendDatatoCreateAlertPage(false);
  }

  showPreScreeningPopup(){
    const modalReff = this._modalService.open(PrescreeningSmallWindowComponent,
      { centered: true, size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
  }

  getNotification(evt) {
    console.log('Message received...');
}
  
  showDocManager(patientId: string) {
    patientId = patientId.toLowerCase().includes('pre') ? patientId : 'PRE' + patientId;
    {
      this._commonMethodService.checkPatientExist(true, patientId).subscribe((res) => {
        if (res.response === true) {
          this.hiddenDocManager.nativeElement.click();
          this._commonMethodService.sendDataToDocumentManager(patientId);
        }
        else {
          this.unSuccessNotification(res);
        }
      }, (err: any) => {
        this.errorNotification(err);
      })
    }
  }

  unSuccessNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: '',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }

  getUser() {
    this.data = this._storageService.user;
    this.username = this.data.FirstName;
   
  } 
  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.deleteOrderedSchedulerActivity();
  }
  @HostListener('window:beforeunload', ['$event'])

  beforeUnloadHandler(event) {
    this.deleteOrderedSchedulerActivity();
  }
  getPermission(){
    var pagetitleList:any=[];
    var data = this._storageService.UserRole;
      this.responseHierarchy = JSON.parse(data); 
      if (this.responseHierarchy && this.responseHierarchy.length) {
        this.responseHierarchy.forEach(value => {
          if (value && value.hierarchy) {
            value.hierarchy = JSON.parse(value.hierarchy);
          }
        })
      }
      for (let i = 0; i < this.responseHierarchy.length; i++) {      
        this.list.push(this.responseHierarchy[i].hierarchy);
     }
     this.splitListAccToType(this.list);
      let docManagertemp=this.headerPopupList.find(x=>x.PageTitle=='DOCUMENT MANAGER');
      this.docManager=docManagertemp&&docManagertemp.PageTitle?docManagertemp.PageTitle:"";
      let taskManagertemp=this.headerPopupList.find(x=>x.PageTitle=='TASK MANAGER');
      this.taskManager=taskManagertemp&&taskManagertemp.PageTitle?taskManagertemp.PageTitle:"";
      let creteAlerttemp=this.headerPopupList.find(x=>x.PageTitle=='CREATEALERT');
      this.createAlert=creteAlerttemp&&creteAlerttemp.PageTitle?creteAlerttemp.PageTitle:"";
      let preScreentemp=this.headerPopupList.find(x=>x.PageTitle=='PRE-SCREENING QUESTIONS');
      this.preScreenQuestions=preScreentemp&&preScreentemp.PageTitle?preScreentemp.PageTitle:"";
      let autoRoutetemp=this.headerPopupList.find(x=>x.PageTitle=='AUTOROUTEV2');
      this.autoRouteV2=autoRoutetemp&&autoRoutetemp.PageTitle?autoRoutetemp.PageTitle:"";
      console.log(this.rightNavList);
   }
   splitListAccToType(list1: any)
    {
      list1.forEach((i) => {
        if(i.Type)
        {
          if(i.Type==2)
          {
            this.headerPopupList.push(i);
          }
          if(i.Type==3)
          {
            this.rightNavList.push(i);  
          }
        }
      });
    }
  
}

