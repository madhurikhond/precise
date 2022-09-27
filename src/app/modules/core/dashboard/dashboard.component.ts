import { Component, OnInit } from '@angular/core';
import { TaskManagementApplyFilter } from 'src/app/models/taskManagementSlackGlobalSettings';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { TaskManagementService } from 'src/app/services/task-management/task-management.service';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { MyprofileService } from 'src/app/services/myprofile/myprofile.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {
  applyFilterBody: TaskManagementApplyFilter;
  allTaskArray: Array<object> = [];

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



  teamMemberList: any = [];
  resizingModes: string[] = ['widget', 'nextColumn'];


  public userDuties = '';
  userName: any;
  columnResizingMode: string;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  constructor(private readonly myprofileService: MyprofileService, private readonly storageService: StorageService, private readonly commonMethodService: CommonMethodService,
    private taskManagementService: TaskManagementService, private readonly notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.linkList();
    this.columnResizingMode = this.resizingModes[0];
    this.commonMethodService.setTitle('Dashboard');
    this.applyFilter('', '', '', '', 'ToDo');
    this.getTeamMembers();
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
    this.taskManagementService.taskManagementApplyFilter(true, this.applyFilterBody).subscribe((res) => {
      this.allTaskArray = [];
      if (res.response != null && res.response?.length > 0) {
        this.allTaskArray = res.response;
      }
      else {
        this.allTaskArray = [];
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
}
