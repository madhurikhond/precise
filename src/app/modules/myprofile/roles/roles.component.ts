import { Component, OnInit } from '@angular/core'; 
import { MyprofileService } from 'src/app/services/myprofile/myprofile.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  pageNumber: number = 1;
  pageSize: number = 10;
  totalRecords: number;
  roleList: any = [];
  name = 'ng2-ckeditor';
  //ckeConfig: CKEDITOR.config;
  ckeConfig:any;
  ckConfig:any;
  mycontent: string;
  log: string = '';
  search: string = '';
  noDataDisplay: boolean = false;

  constructor(private readonly commonMethodService: CommonMethodService,
  private readonly myprofileService: MyprofileService, private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Roles');
    this.getRoles();
    this.ckConfig = {
      allowedContent: false,
      forcePasteAsPlainText: true,
      removePlugins: 'blockquote,preview,save,print,newpage,templates,find,replace,selectall,SpellChecker,scayt,flash,smiley,about',
    removeButtons : 'Checkbox,Radio,Form,TextField,Textarea,Select,Button,ImageButton,HiddenField,PageBreak,SpecialChar,HorizontalRule,SpellChecker, Scayt',
    };
   
  
  }
  getRoles() {
    this.myprofileService.getRoles(true, this.pageNumber, this.pageSize, this.search).subscribe((res) => {
      if (res.response != null && res.response.length > 0) {   
        this.noDataDisplay = false;
        this.roleList = res.response;
        this.totalRecords = res.totalRecords;
      }
      else {
        this.noDataDisplay = true;
        this.totalRecords=1
        this.roleList = [];
      //  this.unSuccessNotification(res, 'Record not found.')
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  onChange($event: any): void {
    //this.log += new Date() + "<br />";
  }
  
  onPaste($event: any): void {
    //this.log += new Date() + "<br />";
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
  pageChanged(event) {
    this.pageNumber = event;
    this.getRoles();
  }
  applyFilter() {
    this.pageNumber = 1
    this.getRoles()
  }
  clearFilters() {
    this.pageNumber = 1
    this.search = ''
    this.getRoles()
  }
}
