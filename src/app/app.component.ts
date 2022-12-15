import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from './services/account.service';
import { CommonMethodService } from './services/common/common-method.service';
import { NotificationService } from './services/common/notification.service';
import { SignalRService } from './services/common/signalr.service';
import { StorageService } from './services/common/storage.service';
import { WorkflowService } from './services/work-flow-service/workflow.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NotificationService]
})
export class AppComponent implements OnInit {
  isValidToken: boolean = false;
  title = 'MyApp';
  userList: any;
  groupName: any;
  signalRSub: any;
  viewingData: any;
  isDocManagerShow: boolean = false;
  @ViewChild('hiddenRolePermissionChanged', { static: false }) hiddenRolePermissionChanged: ElementRef;
  constructor(private readonly commonService: CommonMethodService,
    private notificationService: NotificationService,
    private readonly _accountService: AccountService,
    private readonly storageService: StorageService,
    private readonly workflowService: WorkflowService,
    private readonly _storageService: StorageService, private readonly _router: Router,
    private readonly _commonMethodService: CommonMethodService, private _modalService: NgbModal,
    private signalRService: SignalRService) {

  }
  ngOnInit(): void {
    this.isValidToken = this._accountService.isTokenValid;
    this._accountService.$validToken.subscribe(res => {
      this.isValidToken = this._accountService.isTokenValid;
      this.signalRSub = this.signalRService.information.subscribe(response => {
        if (response !== null && response.message == 2 && response.response !== null) {
          if (response.response.length > 0) {
            this.userList = this.storageService.user
            if (this.userList.GroupName == response.response[0].GroupName) {
            this.storageService.setItem('isPermissionChanged', true)
              this.hiddenRolePermissionChanged.nativeElement.click();

            }
          }
          (err: any) => {
            this.notificationService.showNotification({
              alertHeader: err.statusText,
              alertMessage: err.message,
              alertType: err.status
            });
          }
        }
      });
    });

  }
  logoutLogin(): void {
    this.deleteOrderedSchedulerActivity()
    this._commonMethodService.clearAllSubjects();
    this._storageService.clearAll();
    localStorage.removeItem('p_jwt_t');
    localStorage.removeItem('l_jwt_t');
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
    this._router.navigate(['login']);
    localStorage.removeItem('_cr_u_infor');
    localStorage.removeItem('storage');
    localStorage.removeItem('isPermissionChanged');
  }
  deleteOrderedSchedulerActivity(): void {
    this.workflowService.deleteOrderedSchedulerActivity().subscribe((res) => {
    });
  }


}
