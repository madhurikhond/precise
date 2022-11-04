import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/common/notification.service';
import { MyprofileService } from 'src/app/services/myprofile/myprofile.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';


@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.css']
})
export class TeamMembersComponent implements OnInit {
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any;
  currentFilter: any;
  showHeaderFilter: boolean;
  pageNumber: number = 1;
  pageSize: number = 20;
  totalRecords: number;
  teamMemberList: any = [];
  public userDuties = '';
  userName: any;
  name = 'ng2-ckeditor';
  //ckeConfig: CKEDITOR.config;
  ckeConfig: any;
  ckConfig: any;
  mycontent: string;
  log: string = '';
  search: string = '';

  constructor(private readonly myprofileService: MyprofileService, private readonly notificationService: NotificationService, private readonly commonMethodService: CommonMethodService) { }
  ngOnInit(): void {
    this.commonMethodService.setTitle('Team Members');
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
    this.showHeaderFilter = false;
    this.getTeamMembers();
    this.ckConfig = {
      allowedContent: false,
      //extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      readOnly: true,
      removePlugins: 'blockquote,preview,save,print,newpage,templates,find,replace,selectall,SpellChecker,scayt,flash,smiley,about',
      removeButtons: 'Checkbox,Radio,Form,TextField,Textarea,Select,Button,ImageButton,HiddenField,PageBreak,SpecialChar,HorizontalRule,SpellChecker, Scayt',
    };
  }

  onChange($event: any): void {
    //this.log += new Date() + "<br />";
  }

  onPaste($event: any): void {
    //this.log += new Date() + "<br />";
  }
  applyFilter() {
    this.pageNumber = 1
    this.getTeamMembers();
  }
  getTeamMembers() {
    this.myprofileService.getTeamMembersNew(true, this.pageNumber, this.pageSize, this.search).subscribe((res) => {
      if (res.response != null && res.response.length > 0) {
        this.teamMemberList = res.response;
        this.totalRecords = res.totalRecords;
      }
      else {
        this.totalRecords = 1
        this.teamMemberList = [];
        //this.unSuccessNotification(res,'Record not found.')
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  unSuccessNotification(res: any, msg: any) {

    this.notificationService.showNotification({
      alertHeader: msg,
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  getRowCurrentDetail(CurrentRow: any) {
    this.userDuties = CurrentRow.data.UserDuties;
    this.userName = CurrentRow.data.FIRSTNAME + ' ' + CurrentRow.data.LASTNAME;
  }

  pageChanged(event) {
    this.pageNumber = event;
    this.getTeamMembers();
  }
  clearFilters() {
    this.pageNumber = 1
    this.search = ''
    this.getTeamMembers();
  }
}
