import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-sftp',
  templateUrl: './sftp.component.html',
  styleUrls: ['./sftp.component.css']
})
export class SftpComponent implements OnInit {
  modelValue: string = 'modal';
  modelValue1: string = 'modal'; 
  editSftpForm: FormGroup;
  totalRecords: number;
  pageNumber: number = 1;
  pageSize: number;
  sftpList: any = []
  submitted = false;
  sftpId: number;
  isAdd = true;

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  readonly pageSizeArray = PageSizeArray;
  constructor(private fb: FormBuilder, private settingService: SettingsService,
    private notificationService: NotificationService, private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;

    this.commonMethodService.setTitle('SFTP');
    this.getSftpList();
    this.editSftpForm = this.fb.group({
      profileName: ['', [Validators.required]],
      hostName: ['', [Validators.required]],
      port: ['', [Validators.required]],
      user: ['', [Validators.required]],
      password: ['', [Validators.required]],
      defaultDirectory: [''],
      notesbox: ['']
    });

    this.editSftpForm = this.fb.group({
      profileName: ['', [Validators.required]],
      hostName: ['', [Validators.required]],
      port: ['', [Validators.required]],
      user: ['', [Validators.required]],
      password: ['', [Validators.required]],
      defaultDirectory: [''],
      notesbox: ['']
    });
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber=1;
    this.getSftpList();
  }
  onUpdateSubmit() {
    this.submitted = true;
    this.modelValue1 = 'modal';
    if (this.editSftpForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.saveSftp();
  }

  saveSftp() {

    var data = {
      'profileName': this.editForm.profileName.value,
      'hostName': this.editForm.hostName.value,
      'port': this.editForm.port.value,
      'user': this.editForm.user.value,
      'password': this.editForm.password.value,
      'defaultDirectory': this.editForm.defaultDirectory.value,
      'notesbox': this.editForm.notesbox.value,
      'Operation': 1,
      'sftpId':this.sftpId
    };

    if (!this.isAdd) {
      data.Operation = 2
    }
    this.settingService.CRUD_SFTP(true, JSON.stringify(JSON.stringify(data))).subscribe((res) => {
      if (res) {
        this.getSftpList()
        this.notificationService.showNotification({
          alertHeader: 'Success',
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      //this.getSftpList();    
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });


  }

  getSftpById(sftpId) {
    var data = {
      'sftpId': sftpId,
      'profileName': this.editForm.profileName.value,
      'hostName': this.editForm.hostName.value,
      'port': this.editForm.port.value,
      'user': this.editForm.user.value,
      'password': this.editForm.password.value,
      'defaultDirectory': this.editForm.defaultDirectory.value,
      'notesbox': this.editForm.notesbox.value,
      'Operation': 4
    };

    this.settingService.CRUD_SFTP(true, JSON.stringify(JSON.stringify(data))).subscribe((res) => {
      var data: any = res;
      if (data.response != null) { 
        this.editSftpForm.patchValue({
          profileName: JSON.parse(data.response)[0].ProfileName,
          hostName: JSON.parse(data.response)[0].HostName,
          port: JSON.parse(data.response)[0].Port,
          user: JSON.parse(data.response)[0].User,
          password: JSON.parse(data.response)[0].password,
          defaultDirectory: JSON.parse(data.response)[0].DefaultDirectory,
          notesbox: JSON.parse(data.response)[0].Notesbox,
        });
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

  getSftpList() {
    var data = {
      'pageSize': this.pageSize,
      'pageNumber': this.pageNumber,
      'Operation': 5
    }
    this.settingService.CRUD_SFTP(true, JSON.stringify(JSON.stringify(data))).subscribe((res) => {
      var data: any = res;
      this.totalRecords = data.totalRecords
      if (data.response != null && data.response.length > 0) {
        this.sftpList = JSON.parse(data.response)[0].response;
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

  pageChanged(event) {
    this.pageNumber = event;
    this.getSftpList()
  }

  add() {
    this.submitted = false;
    this.editSftpForm.reset();
    this.editSftpForm.patchValue({
      sftpId: 0,
      profileName: '',
      hostName: '',
      port: '',
      user: '',
      password: '',
      defaultDirectory: '',
      notesbox: '',
      Operation: 0
    });


    this.isAdd = true;
  }

  edit(sftpId) {
    this.submitted = false;
    this.editSftpForm.reset();
    this.sftpId = sftpId;
    this.getSftpById(sftpId);
    this.isAdd = false;
  }

  testConnection(sftpId) {
    this.settingService.testSftpConnection(true, sftpId).subscribe((res) => {
      if (res.response === true) {
        this.notificationService.showNotification({
          alertHeader: 'Success',
          alertMessage: res.message,
          alertType: res.responseCode
        });
      }
      else {
        this.notificationService.showNotification({
          alertHeader: 'Error',
          alertMessage: res.message,
          alertType: res.responseCode
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
 
  get editForm() { return this.editSftpForm.controls; }
}
