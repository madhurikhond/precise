import { Component, OnInit } from '@angular/core';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.css']
})
export class RolePermissionComponent implements OnInit {
  isAdd: boolean = false;
  isUpdate: boolean = false;
  isDisabled: boolean = true;
  groupList: any = [];
  generalPermissionList: any = [];
  arPermissionList: any = [];
  selectedGroup = '';
  groupName = '';
  oldGroupName = '';
  submitted = false;
  tabId: string = '1'
  Isadd: any;
  IsEdit: any;
  IsDelete: any;
  IsView: any;
  ispermitted: any;
  selectAll: any;
  rid: number;

  constructor(private readonly commonMethodService: CommonMethodService,
    private readonly settingService: SettingsService, private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Role Permission');
    this.getGroups();
  }

  getGroups() {
    this.settingService.getGroups(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.groupList = data.response
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  updateTabId(tabName: string) {
    this.tabId = tabName;
  }

  getPermission(groupName: string) {
    this.settingService.getPermission(true, groupName).subscribe((res) => {
      
      var data: any = res;
      if (data.response != null) {
        this.isDisabled = false;
        this.generalPermissionList = data.response.generalPermission;
        this.Isadd = data.response.generalPermission[0]['IsAdd']
        this.IsEdit = data.response.generalPermission[0]['IsEdit']
        this.IsDelete = data.response.generalPermission[0]['IsDelete']
        this.IsView = data.response.generalPermission[0]['IsView']
        this.IsView = data.response.generalPermission[0]['IsAssignStudy']
        this.IsView = data.response.generalPermission[0]['IsPatientActionHide']
        this.ispermitted = data.response.arPermission[0]['ispermitted']
        this.selectAll = this.generalPermissionList.length
        this.arPermissionList = data.response.arPermission;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  selectUnselectAll(data, event) {
    var status = event.target.checked;
    var index = this.generalPermissionList.findIndex(x => x.ModuleId === data.data.ModuleId)
    this.generalPermissionList[index].IsAdd = status;
    this.generalPermissionList[index].IsEdit = status;
    this.generalPermissionList[index].IsDelete = status;
    this.generalPermissionList[index].IsView = status;
    this.generalPermissionList[index].IsAssignStudy = status;
    this.generalPermissionList[index].IsPatientActionHide = status;
  }

  selectCheckbox(data, event) {
    var status = event.target.checked;
    var index = this.generalPermissionList.findIndex(x => x.ModuleId === data.data.ModuleId)
    // if(status){
    //   this.generalPermissionList[index].IsView = status;
    // }
    if (!this.generalPermissionList[index].IsAdd && !this.generalPermissionList[index].IsEdit
      && !this.generalPermissionList[index].IsDelete && !this.generalPermissionList[index].IsAssignStudy
      && !this.generalPermissionList[index].IsPatientActionHide) {
      this.generalPermissionList[index].IsView = status;
    }
  }

  changeView(index, event) {
    var status = event.target.checked;
    if (!status) {
      this.generalPermissionList[index].IsAdd = status;
      this.generalPermissionList[index].IsEdit = status;
      this.generalPermissionList[index].IsDelete = status;
      this.generalPermissionList[index].IsAssignStudy = status;
      this.generalPermissionList[index].IsPatientActionHide = status;
      this.generalPermissionList[index].IsView = status;
    }
  }

  selectGroup() {
    if (this.selectedGroup != '') {
      this.getPermission(this.selectedGroup);
      this.groupName = this.selectedGroup;
      this.oldGroupName = this.selectedGroup;
      this.isAdd = false;
      this.isUpdate = true;
    }
  }

  addPremission() {
    this.groupName = '';
    this.isAdd = true;
    this.isUpdate = false;
    this.getPermission('NEW');
  }
  setSubmitted() {
    this.submitted = false;
  }
  savePremission() {
    
    if (this.isAdd && this.groupName === '') {
      //alert('Please enter Group name.')
      this.submitted = true;
    }
    if ((this.isAdd && this.groupName != '') || (this.isUpdate)) {
      var data = {
        'IsNewRolePermission': this.isAdd,
        'GroupName': this.groupName,
        'GeneralPremissions': this.generalPermissionList,
        'ArPermissions': this.arPermissionList
      };
      this.settingService.saveRolePermission(true, data).subscribe((res) => {
        if (res) {
          if (res.responseCode == ResponseStatusCode.OK && this.groupName!=this.oldGroupName)  {
            this.updateRoleGroupName();
          }
          this.notificationService.showNotification({
            alertHeader: (res.responseCode === ResponseStatusCode.OK) ? 'Success' : 'Error',
            alertMessage: res.message,
            alertType: res.responseCode
          })
        } 
        
      },
        (err: any) => {
          this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
          });
        });
    }
  }

  resetPage() {
    this.isAdd = false;
    this.isUpdate = false;
    this.isDisabled = true;
    this.selectedGroup = '';
    this.groupName = '';
  }
  deleteRoleGroupName() {
    if (this.groupName) {
      this.settingService.deleteRoleGroupName(true, this.groupName).subscribe((res) => {
        var data: any = res;
        if ((res.responseCode === ResponseStatusCode.OK)) {
          this.isDisabled = false;
          this.generalPermissionList = []
          this.getGroups();
        }
        this.notificationService.showNotification({
          alertHeader: (res.responseCode === ResponseStatusCode.OK) ? 'Success' : 'Error',
          alertMessage: res.message,
          alertType: res.responseCode
        })

      }
      )
    }
  }
  updateRoleGroupName() {

    if (this.groupName && this.oldGroupName)
      this.settingService.updateRoleGroupName(false, this.groupName, this.oldGroupName).subscribe((res) => {
        this.resetPage()
        this.getGroups()
      })
  }

  editRolePermision() {
    this.isAdd = true;
  }


}
