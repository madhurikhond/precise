import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaskManagementApplyFilter } from 'src/app/models/taskManagementSlackGlobalSettings';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { TaskManagementService } from 'src/app/services/task-management/task-management.service';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { MyprofileService } from 'src/app/services/myprofile/myprofile.service';
import { PatientService } from 'src/app/services/patient/patient.service';
declare const $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('modalClose', { static: false }) modalClose: ElementRef;
  applyFilterBody: TaskManagementApplyFilter;
  allTaskArray: Array<object> = [];
  epicUserList: Array<object> = [];
  pageNumber: number = 1;
  pageSize: number = 10;
  totalRecords: number;
  linksList = [];
  name = 'ng2-ckeditor';
  //ckeConfig: CKEDITOR.config;
  ckeConfig: any;
  ckConfig: any;
  mycontent: string;
  log: string = '';

  taskDetail: any = <any>{};

  teamMemberList: any = [];
  resizingModes: string[] = ['widget', 'nextColumn'];

  isTaskManagementPopShow: boolean = true;
  assignedByFilter: string = '';
  assignedToFilter: string = '';

  DueDateFilter: string = '';
  LabelFilter: string = '';
  stausFilter: string = '';
  currentTaskId: any = null;
  taskAssignToOtherUserModel: any = null;
  divPateintId: any = 'dashboardPatientDetail';
  totalDoTasks: number = 0;

  public userDuties = '';
  userName: any;
  columnResizingMode: string;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  constructor(private readonly myprofileService: MyprofileService, private readonly storageService: StorageService, private readonly commonMethodService: CommonMethodService,
    private taskManagementService: TaskManagementService, private readonly notificationService: NotificationService, private patientService: PatientService) {
  }

  ngOnInit(): void {
    this.linkList();
    this.columnResizingMode = this.resizingModes[0];
    this.getEpicUser();
    this.commonMethodService.setTitle('Dashboard');
    this.applyFilter('', 'Self', '', '', 'ToDo');
    this.getTeamMembers();
    this.taskAssignToOtherUserModel = this.storageService.user.UserId;
    this.assignedByFilter = '';
    this.assignedToFilter = '';
    this.DueDateFilter = '';
    this.LabelFilter = '';
    this.stausFilter = '';
    // this.ckConfig = {
    //   allowedContent: false,
    //   extraPlugins: 'divarea',
    //   forcePasteAsPlainText: true,
    //   readOnly : true,
    //   removePlugins: 'blockquote,preview,save,print,newpage,templates,find,replace,SpellChecker,scayt,flash,smiley,about',
    // removeButtons : 'Checkbox,Radio,Form,TextField,Textarea,Select,Button,ImageButton,HiddenField,PageBreak,SpecialChar,HorizontalRule,SpellChecker, Scayt',
    // };

    this.ckConfig = {
      allowedContent: false,
      forcePasteAsPlainText: true,
      readOnly: true,
      removePlugins: 'blockquote,preview,save,print,newpage,templates,find,replace,SpellChecker,scayt,flash,smiley,about',
      removeButtons: 'Checkbox,Radio,Form,TextField,Textarea,Select,Button,ImageButton,HiddenField,PageBreak,SpecialChar,HorizontalRule,SpellChecker, Scayt',
    };
  }
  getRowCurrentDetail(CurrentRow: any) {
    this.userDuties = CurrentRow.data.UserDuties;
    this.userName = CurrentRow.data.FIRSTNAME + ' ' + CurrentRow.data.LASTNAME;
  }
  getTeamMembers() {
    this.myprofileService.getTeamMembers(true, this.pageNumber, this.pageSize).subscribe((res) => {
      if (res.response != null) {
        this.teamMemberList = res.response;
        this.totalRecords = res.totalRecords;
      }

    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  onChange($event: any): void {
    console.log("onChange");
    //this.log += new Date() + "<br />";
  }

  onPaste($event: any): void {
    console.log("onPaste");
    //this.log += new Date() + "<br />";
  }
  unSuccessNotification(res: any, msg: any) {

    this.notificationService.showNotification({
      alertHeader: msg,
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }

  pageChanged(event) {
    this.pageNumber = event;
    this.getTeamMembers();
  }
  applyFilter(assignedBy: string, assignedTo: string, dueDate: string, label: string, status: string) {

    this.applyFilterBody = new TaskManagementApplyFilter(assignedBy, assignedTo, dueDate, label, status, this.storageService.user.UserId);
    debugger
    this.taskManagementService.taskManagementApplyFilter(true, this.applyFilterBody).subscribe((res) => {
      this.allTaskArray = [];
      if (res.response != null && res.response?.length > 0) {
        this.allTaskArray = res.response;
      }
      else {
        this.allTaskArray = [];
      }
      if (res.toDoRecords > 0) {
        this.totalDoTasks = res.toDoRecords;
        this.commonMethodService.toDoTaskCountForHeader.emit(this.totalDoTasks);     
      }
      else {
        this.totalDoTasks = res.totalRecords;
      }

    }, (err: any) => {
      this.errorNotification(err);
    });

  }

  linkList() {
    this.myprofileService.getAllLinks(true, this.pageNumber, this.pageSize).subscribe((res) => {
      this.linksList = [];
      if (res.response != null) {
        this.linksList = res.response;
        console.log(this.linksList);
      }
      else {
        this.linksList = [];
      }
    });
  }

  showTaskManagementWindow() {
    this.commonMethodService.showTaskManagementWindow(true);
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  viewTask2(taskId: any) {
    debugger
    $('.no-collapsable').on('click', function (e) {
      e.stopPropagation();
    });
    this.taskDetail = {};
    this.taskManagementService.getTaskDetailById(true, taskId, this.storageService.user.UserId.toString()).subscribe((res) => {
      if (res.response.length > 0) {
        this.taskDetail = res.response.slice(0, 1).shift();
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  showDtailWindowMenu(taskStatus: string) {

    document.getElementById('menuArchive2').style.display = 'inline-block';
    document.getElementById('menuAssignToOther2').style.display = 'inline-block';
    document.getElementById('menuMoveToComplete2').style.display = 'inline-block';
    if (taskStatus === 'Completed') {
      document.getElementById('menuMoveToComplete2').style.display = 'none';
      document.getElementById('menuAssignToOther2').style.display = 'none';
      document.getElementById('menuArchive2').style.display = 'none';
    }

    else if (taskStatus === 'Archived') {
      document.getElementById('menuArchive2').style.display = 'none';
      document.getElementById('menuAssignToOther2').style.display = 'none';
    }
    else if (taskStatus === 'Completed and Archived') {
      document.getElementById('menuMoveToComplete2').style.display = 'none';
      document.getElementById('menuAssignToOther2').style.display = 'none';
      document.getElementById('menuArchive2').style.display = 'none';
    }
  }

  markTaskArchived(taskId: any) {
    debugger
    let body = { 'taskId': taskId }
    this.taskManagementService.markTaskArchived(true, body).subscribe((res) => {

      if (res.response.length > 0) {
        this.successNotification(res);
        this.modalClose.nativeElement.click();
        this.applyFilter('', '', '', '', 'ToDo');
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  successNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }

  taskAssignToMenuClick(taskId: any) {
    this.currentTaskId = taskId;
    this.taskAssignToOtherUserModel = this.storageService.user.UserId;
    this.modalClose.nativeElement.click();

  }
  taskAssignButtonClick(taskAssignToOtherId: any) {

    if (taskAssignToOtherId != '' && taskAssignToOtherId != null) {
      let body = {
        'taskId': this.currentTaskId,
        'taskAssignedToOtherUser': taskAssignToOtherId
      };
      this.taskManagementService.taskAssignToOther(true, body).subscribe((res) => {

        if (res.response.length > 0) {
          this.successNotification(res);
          this.applyFilter(this.assignedByFilter, this.assignedToFilter, this.DueDateFilter, this.LabelFilter, this.stausFilter);
        }
      }, (err: any) => {
        this.errorNotification(err);
      });
    }
  }
  markTaskCompleted(taskId: any) {
    let body = { 'taskId': taskId }
    this.taskManagementService.markTaskCompleted(true, body).subscribe((res) => {

      if (res.response.length > 0) {
        this.successNotification(res);
        this.modalClose.nativeElement.click();
        this.applyFilter('', '', '', '', 'ToDo');
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  
  openPatientDetailWindow(patientDetail: string) {
    debugger;
    let patient = patientDetail.split(',');
    let body = {
      'internalPatientId': patient[0],
      'internalStudyId': patient[1],
      'hasAlert': patient[2] == '1' ? 1 : 0
    }
    this.patientService.sendDataToPatientDetailWindow(body);
  }
  getEpicUser() {
    this.taskManagementService.getEpicUser(false, this.storageService.user.UserId).subscribe((res) => {
      if (res.response != null) {
        this.epicUserList = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

}