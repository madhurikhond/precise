import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { SettingsService } from 'src/app/services/settings.service';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { DxDataGridComponent } from 'devextreme-angular';
import { StorageService } from 'src/app/services/common/storage.service';
import { Router } from '@angular/router';

export type PickupFormValue = {
  'companyId': string,
  'referenceNumber': string
};

@Component({
  selector: 'app-subpoena-pickup-status',
  templateUrl: './subpoena-pickup-status.component.html',
  styleUrls: ['./subpoena-pickup-status.component.css']
})
export class SubpoenaPickupStatusComponent implements OnInit {
  pickupForm: FormGroup;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent
  submitted = false;
  selectedRows: any = [];
  companyList: any = [];
  subDetails: any = [];
  subDetail: any;
  allMode: string;
  checkBoxesMode: string;
  showDropdownLoader = true;
  showTableLoader = true;
  showDivLoader = true;
  pageNumber = 1;
  pageSize = 20;
  totalRecords: any;
  currentRowIndex = 0;
  showPickupDetailModal = 'none';
  pageContent = '';
  Status: string;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService,
    private readonly accountService: AccountService,
    private readonly storageService: StorageService,
    private readonly settingService: SettingsService,
    // private readonly notificationService: NotificationService) { }
    private readonly notificationService: NotificationService, private router: Router) { }
  ngOnInit(): void {
    if (this.checkIsLoggedIn()) {
      this.router.navigate((this.storageService.LastPageURL === null || this.storageService.LastPageURL === '') ? ['dashboard'] : [this.storageService.LastPageURL]);
    }

    this.getCompanyList();
    this.pickupForm = this.fb.group({
      companyId: [null, [Validators.required]],
      referenceNumber: ['', [Validators.required]]
    });
    this.commonMethodService.setTitle('Subpoena pickup status');

  }
  checkIsLoggedIn() {
    if (this.storageService.user != null) {
      var tokenExpiry = new Date(this.storageService.user.exp * 1000);
      var today = new Date();
      if (tokenExpiry < today) {
        this.router.navigate(['login']);
        this.storageService.clearAll();
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }
  //method to get company list
  getCompanyList() {
    this.accountService.getServiceCompanies(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.companyList = data.response;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
      this.showDropdownLoader = false;
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: ResponseStatusCode.InternalError
        });
        this.showDropdownLoader = false;
      });
  }
  //method to get pickup detail
  getPickupDetail() {
    const { companyId, referenceNumber } = this.pickupForm.value as (PickupFormValue);
    this.accountService.getPickupDetails(companyId, referenceNumber.replace('-', '').replace('.', ''), this.pageNumber, this.pageSize, true).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.openPickupModal();
        this.subDetails = data.response;
        this.Status = data.response[0].Status;
        
        this.totalRecords = data.response[0].Totalrecords;
        this.dataGrid.focusedRowIndex = 0;
        this.getSubDetailById(this.subDetails[0].SubsID);
      }
      else {
        this.notificationService.showNotification({
          alertHeader: '',
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
      this.showTableLoader = false;
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: ResponseStatusCode.InternalError
        });
        this.showTableLoader = false;
      });
  }

  //method to pickupstatus
  getPickupStatus() {
    this.settingService.getPickupStatus(true).subscribe((res) => {
      if (res) {
        this.pageContent = res.response.PI_Name;
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
  //Method to Open Pop up for Pickup
  openPickupModal() {
    this.showPickupDetailModal = 'block';
    this.showDivLoader = true;
  }
  //Method To Close Pop up for Pickup
  closePickupModal() {
    this.showPickupDetailModal = 'none';
    this.showDivLoader = true;
  }
  //Method To submit Pickup form
  onSubmit() {
    this.submitted = true
    if (!this.pickupForm.valid) {
      return;
    }
    this.getPickupDetail();
  }
  //Method to reset
  onReset() {
    this.submitted = false;
    this.pickupForm.reset();
  }
  onPageChanged(event: any) {
    this.pageNumber = event;
    this.getPickupDetail();
  }
  //Method to get Subdetail by Id
  onFocusedRowChanged(e: any) {
    var rowData = e.row && e.row.data;
    this.Status = rowData.Status;
    this.getSubDetailById(rowData.SubsID)
  }
  getSubDetailById(subId) {
    // this.showDivLoader = true;
    this.accountService.getSubDetailsById(subId, true).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {

        this.subDetail = data.response[0];
        this.Status = data.response[0].Status;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
      this.showDivLoader = false
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: ResponseStatusCode.InternalError
        });
        this.showDivLoader = false;
      });

    // this.currentRowIndex = currentIndex;
  }

  get pForm() { return this.pickupForm.controls; }
}
