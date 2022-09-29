import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SubsService } from 'src/app/services/subs-service/subs.service';
import { ViewChild, ElementRef } from '@angular/core';
import { CommonRegex } from 'src/app/constants/commonregex';

declare const $: any;
@Component({
  selector: 'app-copyservicemanagement',
  templateUrl: './copyservicemanagement.component.html',
  styleUrls: ['./copyservicemanagement.component.css']
})
export class CopyservicemanagementComponent implements OnInit {
  @ViewChild('refresh_tab', { static: false }) refresh_tab: ElementRef;
  copyServiceManagementForm: FormGroup;
  copyServiceForm: FormGroup;
  repsForm: FormGroup;
  popUpTittle: string = '';
  modelValue: string;
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any;
  currentFilter: any;
  showHeaderFilter: boolean;
  pageNumber: number = 1;
  pageNumberRepsList: number = 1;
  pageSizeRepsList: number = 20;
  totalRecordsRepsList: number;
  pageSize: number;
  totalRecords: number = 1;
  pageNumberCG: number = 1;
  pageSizeCG: number = 20;
  totalRecordsCG: number;
  copyServiceManagementList: any = [];
  repsList: any = [];
  companyGroupingList: any = [];
  isRespsFormVisible: boolean = false;
  isRespsGridVisible: boolean = true;
  isRepsAddRefButtonDisabled: boolean = false;
  companyID: number;
  repID: number;
  isRepFormSubmitted: boolean = false;
  isCopyServiceFormSubmitted: boolean = false;
  isGroupTabVisible: boolean = true;
  isRepsTabVisible: boolean = true;
  isRepUpdateBtnVisible: boolean = true;
  isRepInsertBtnVisible: boolean = false;
  isSearchReferrer: boolean = false;
  searchText: any = '';
  search_isactive: any;
  readonly commonRegex = CommonRegex;
  isShowColumnWithNoData = true;
  activeTab: string = '';
  readonly pageSizeArray = PageSizeArray;
  repsTab: boolean = true;

  constructor(private fb: FormBuilder, private readonly subsService: SubsService,
    private readonly notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.copyServiceManagementForm = this.fb.group({
      CompanyID: [''],
      CompanyName: ['', [Validators.required]],
      ContactName: [''],
      PhoneNum: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      FaxNum: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      Email: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      Address: [''],
      City: [''],
      State: [''],
      Zip: [''],
      DoNotEmail: [''],
      PIN: [''],
      QBAccountName: [''],
      isactive: ['']

    });
    this.repsForm = this.fb.group({
      RepID: [''],
      CompanyID: [''],
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Email: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      Phone: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      DoNotEmail: ['']
    });
    this.commonMethodService.setTitle('Copy Service Management');
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
    this.getAllCopyServiceManagement();
    this.copyServiceForm = this.fb.group({
      searchText: [''],
      search_isactive: ['']
    });
  }
  getAllCopyServiceManagement() {

    this.subsService.getAllCopyServiceManagement(true, this.pageNumber, this.pageSize).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.copyServiceManagementList = data.response;
        this.totalRecords = res.totalRecords;
        this.isShowColumnWithNoData = true;
      }
      else {
        this.copyServiceManagementList = [];
        this.totalRecords = 1
        this.isShowColumnWithNoData = false;
      }
    }, (err: any) => {
      this.showError(err);
    }
    );
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getAllCopyServiceManagement();
  }
  setActiveTab(activeTab) {
    this.activeTab = activeTab;
    if (this.repsTab && activeTab === 'Reps') {
      this.refresh_tab.nativeElement.click();
      this.repsTab = false;
    }
  }
  // common Notification Method
  showNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Record not found.',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  showNotificationOnSucess(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  // common Error Method
  showError(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  pageChanged(event) {
    this.pageNumber = event;
    this.searchCopyServiceMgt();
  }
  pageChangedCG(event) {

    this.pageNumberCG = event;
    // if (this.isSearchReferrer) {
    //   this.searchCopyServiceMgt();
    // }
    // else {
    this.getCompanyGroupingById();
    //}
  }
  rebindCopyServiceManagementGrid() {
    this.copyServiceForm = this.fb.group({
      searchText: [''],
      search_isactive: ['']
    });
    this.pageNumber = 1;
    this.copyServiceForm.patchValue({
      searchText: '',
      search_isactive: '',
    });
    this.getAllCopyServiceManagement();
  }
  getCopyServiceManagementCurrentRowDetail(currentRow: any) {
    this.repsTab = true;
    this.activeTab = 'Company_Details';
    document.getElementById('btnUpdate').innerText = 'Update';
    //document.getElementById('btnUpdateReps').innerText='Update';
    this.popUpTittle = currentRow.data.CompanyName;
    this.companyID = currentRow.data.CompanyID;
    this.isGroupTabVisible = true;
    this.isRepsTabVisible = true;
    this.GetCopyServiceManagementById();
  }

  GetCopyServiceManagementById() {

    this.subsService.getCopyServiceManagementByCompanyId(true, this.companyID).subscribe((res) => {
      this.isCopyServiceFormSubmitted = false;
      this.copyServiceManagementForm.reset();
      this.repsForm.reset();
      this.showRepsGrid();
      let copyServiceData: any = res;
      if (copyServiceData.response != null) {
        this.copyServiceManagementForm.patchValue({
          CompanyID: copyServiceData.response.CompanyID,
          CompanyName: copyServiceData.response.CompanyName,
          ContactName: copyServiceData.response.ContactName,
          PhoneNum: copyServiceData.response.PhoneNum,
          FaxNum: copyServiceData.response.FaxNum,
          Email: copyServiceData.response.Email,
          Address: copyServiceData.response.Address,
          City: copyServiceData.response.City,
          State: copyServiceData.response.State,
          Zip: copyServiceData.response.Zip,
          DoNotEmail: copyServiceData.response.DoNotEmail,
          PIN: copyServiceData.response.PIN,
          QBAccountName: copyServiceData.response.QBAccountName,
          isactive: copyServiceData.response.isactive,
        });
      }
      this.getCopyServiceRepById();
      this.pageSizeCG = 20;
      this.pageNumberCG = 1;
      this.getCompanyGroupingById();

    }, (err: any) => { this.showError(err); });

  }
  getCopyServiceRepById(isShowLoader: boolean = true) {
    if (this.companyID) {
      this.subsService.getCopyServiceRepById(isShowLoader, this.companyID, this.pageNumberRepsList, this.pageSizeRepsList).subscribe((repsRes) => {
        var repsData = repsRes;
        this.repsList = [];
        if (repsData.response != null) {
          this.repsList = repsData.response;
          this.totalRecordsRepsList = repsData.totalRecords;
        }
      }, (err: any) => {
        this.showError(err);
      });
    }
  }
  pageChangedRepsList(event) {
    this.pageNumberRepsList = event;
    this.getCopyServiceRepById();
  }
  getCompanyGroupingById() {
    if (this.companyID) {
      this.subsService.getCompanyGroupingById(true, this.companyID, this.pageNumberCG, this.pageSizeCG).subscribe((companyGrpRes) => {
        this.companyGroupingList = '';

        if (companyGrpRes.response != null) {
          this.companyGroupingList = companyGrpRes.response;
          this.totalRecordsCG = companyGrpRes.totalRecords;
        }
      }, (err: any) => { this.showError(err); });
    }
  }

  resetCopyServiceForm() {
    this.companyID = 0 ;
    this.activeTab = 'Company_Details';
    this.popUpTittle = 'Add New Record';
    this.isCopyServiceFormSubmitted = false;
    document.getElementById('btnUpdate').innerText = 'Insert';
    this.copyServiceManagementForm.reset();
    this.repsForm.reset();
    this.companyGroupingList = '';
    this.repsList = '';
    this.isGroupTabVisible = false;
    this.isRepsTabVisible = false
    $('#companyDetailTab').click();
  }

  showRepsForm() {
    this.repsForm.reset();
    this.isRespsGridVisible = false;
    this.isRespsFormVisible = true;
    this.isRepsAddRefButtonDisabled = true;
    this.isRepFormSubmitted = false;
    this.isRepUpdateBtnVisible = false;
    this.isRepInsertBtnVisible = true;
  }

  showRepsGrid() {

    this.isRespsGridVisible = true;
    this.isRespsFormVisible = false;
    this.isRepsAddRefButtonDisabled = false;

  }
  insertUpdateCompanyGrouping(currentRow: any, checkBox: any) {

    let isChecked = checkBox.currentTarget.checked;
    let parentCompanyId = this.companyID;
    let body = {
      groupId: currentRow.data.GroupId,
      companyId: parentCompanyId,
      isSelected: isChecked,
      selectedCompany: currentRow.data.CompanyID
    };
    if (body.groupId) {
      // update
      this.updateCompanyGrouping(body);
    }
    else {
      // Insert
      this.insertCompanyGrouping(body);
    }
  }
  updateCompanyGrouping(body: any) {
    
    this.subsService.updateCompanyGrouping(true, body).subscribe((res) => {
      if (res.response != null) {
        this.showNotificationOnSucess(res);
        this.getCompanyGroupingById();
      }
      else {
        this.notificationService.showNotification({
          alertHeader: 'Record not found.',
          alertMessage: res.message,
          alertType: res.responseCode
        });
      }
    }, (err: any) => {
      this.showError(err);
    });
  }
  insertCompanyGrouping(body: any) {
    
    this.subsService.updateCompanyGrouping(true, body).subscribe((res) => {
      if (res.response != null) {
        this.showNotificationOnSucess(res);
        this.getCompanyGroupingById();
      }
      else {
        this.notificationService.showNotification({
          alertHeader: 'Record not found.',
          alertMessage: res.message,
          alertType: res.responseCode
        });
      }
    }, (err: any) => {
      this.showError(err);
    });
  }
  getRepServiceCurrentRowDetail(repCurrentRow: any) {

    this.showRepsForm();
    this.repsForm.patchValue({
      RepID: repCurrentRow.data.RepID,
      CompanyID: repCurrentRow.data.CompanyID,
      FirstName: repCurrentRow.data.FirstName,
      LastName: repCurrentRow.data.LastName,
      Email: repCurrentRow.data.Email,
      Phone: repCurrentRow.data.Phone,
      DoNotEmail: repCurrentRow.data.DoNotEmail,
    });
    this.isRepUpdateBtnVisible = true;
    this.isRepInsertBtnVisible = false;
  }

  getRepServiceCurrentId(repCurrentRow: any) {
    this.repID = repCurrentRow.data.RepID;
  }

  deleteRepServiceByRepId() {
    this.subsService.deleteCopyServiceRepById(true, this.repID).subscribe((res) => {
      let data = res.response
      if (res.responseCode == 200) {
        this.notificationService.showNotification({
          alertHeader: 'Success',
          alertMessage: res.message,
          alertType: res.responseCode
        });
        this.getCopyServiceRepById();
      }
      else {
        this.notificationService.showNotification({
          alertHeader: '',
          alertMessage: res.message,
          alertType: res.responseCode
        });
      }
    }, (err: any) => {
      this.showError(err);
    });
  }
  rebindCopyServiceRepGrid() {
    this.pageNumberRepsList = 1;
    this.getCopyServiceRepById();
  }
  onSubmitCopyServiceForm() {
    this.isCopyServiceFormSubmitted = true;
    this.modelValue = 'modal';
    if (this.copyServiceManagementForm.invalid) {
      this.modelValue = '';
      return;
    }
    let body = {
      companyID: this.getFromControls.CompanyID.value,
      companyName: this.getFromControls.CompanyName.value,
      contactName: this.getFromControls.ContactName.value,
      phoneNum: this.getFromControls.PhoneNum.value,
      faxNum: this.getFromControls.FaxNum.value,
      email: this.getFromControls.Email.value,
      address: this.getFromControls.Address.value,
      city: this.getFromControls.City.value,
      state: this.getFromControls.State.value,
      zip: this.getFromControls.Zip.value,
      doNotEmail: this.getFromControls.DoNotEmail.value,
      pin: this.getFromControls.PIN.value,
      qbAccountName: this.getFromControls.QBAccountName.value,
      isactive: this.getFromControls.isactive.value ? true : false,
    }

    if (body.companyID) {
      // Update Company
      this.subsService.updateCopyServiceManagement(true, body).subscribe((res) => {
        if (res.response != null) {
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.message,
            alertType: res.responseCode
          });
          this.searchCopyServiceMgt();
        }
        else {
          this.notificationService.showNotification({
            alertHeader: 'Something went wrong.',
            alertMessage: res.message,
            alertType: res.responseCode
          });
        }
      }, (err: any) => {
        this.showError(err);
      });
    }
    else {
      //Add Company
      this.subsService.addCopyServiceManagement(true, body).subscribe((res) => {
        if (res.response != null) {
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.message,
            alertType: res.responseCode
          });
          this.searchCopyServiceMgt();
        }
        else {
          this.notificationService.showNotification({
            alertHeader: 'Something went wrong.',
            alertMessage: res.message,
            alertType: res.responseCode
          });
        }
      }, (err: any) => {
        this.showError(err);
      });
    }
  }
  onSubmitRepsForm() {
    this.isRepFormSubmitted = true;
    //this.modelValue='modal';
    if (this.repsForm.invalid) {
      //this.modelValue='';
      return;
    }
    let body = {
      repID: this.getRepsFromControls.RepID.value,
      companyID: this.companyID,
      firstName: this.getRepsFromControls.FirstName.value,
      lastName: this.getRepsFromControls.LastName.value,
      email: this.getRepsFromControls.Email.value,
      phone: this.getRepsFromControls.Phone.value,
      doNotEmail: this.getRepsFromControls.DoNotEmail.value,
    }

    if (body.repID) {
      // Update Company
      this.subsService.updateCopyServiceRep(true, body).subscribe((res) => {
        if (res.response != null) {
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.message,
            alertType: res.responseCode
          });
          //this.searchCopyServiceMgt();
          this.showRepsGrid();
          this.getCopyServiceRepById()
        }
        else {
          this.notificationService.showNotification({
            alertHeader: 'Something went wrong.',
            alertMessage: res.message,
            alertType: res.responseCode
          });
        }
      }, (err: any) => {
        this.showError(err);
      });
    }
    else {
      //Add Company
      this.subsService.addCopyServiceRep(true, body).subscribe((res) => {
        if (res.response != null) {
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.message,
            alertType: res.responseCode
          });
          //this.searchCopyServiceMgt();
          this.showRepsGrid();
          this.getCopyServiceRepById()
        }
        else {
          this.notificationService.showNotification({
            alertHeader: 'Something went wrong.',
            alertMessage: res.message,
            alertType: res.responseCode
          });
        }
      }, (err: any) => {
        this.showError(err);
      });
    }
  }

  searchCopyServiceMgt(pageNumber = 0) {
    this.pageNumber = pageNumber > 0 ? pageNumber : this.pageNumber;
    //this.pageSize = 20;
    this.isSearchReferrer = true;
    this.searchText = this.copyForm.searchText.value ?? '';
    this.search_isactive = this.copyForm.search_isactive.value;
    console.log(this.pageNumber); console.log(this.pageSize);
    if (this.search_isactive === null) {
      this.search_isactive = ''
    }
    else {
      this.search_isactive = this.search_isactive
    }

    if (this.search_isactive === '' && this.searchText === '')
      this.clearCopyServiceMgt();
    else
      this.searchCopyService();
  }
  clearCopyServiceMgt() {
    //this.pageNumber = 1;
    //this.pageSize = 20;
    this.isSearchReferrer = false;

    this.searchText = ''
    this.search_isactive = ''
    this.copyForm.searchText.setValue('')
    this.getCompanyGroupingById()
    this.copyServiceForm.reset()
    this.copyServiceForm = this.fb.group({
      searchText: [''],
      search_isactive: ['']
    });
    this.copyServiceManagementList = [];
    this.getAllCopyServiceManagement();
  }
  searchCopyService() {
    this.subsService.GetCopyServiceSearch(true, this.searchText, this.search_isactive, this.pageNumber, this.pageSize).subscribe((res) => {
      var data: any = res;
      if (res.response != null && res.response.length > 0) {
        this.copyServiceManagementList = res.response;
        this.totalRecords = res.totalRecords;
        this.isShowColumnWithNoData = true;
      }
      else {
        this.copyServiceManagementList = [];
        this.totalRecords = 1;
        this.isShowColumnWithNoData = true;
      }
    }, (err: any) => {
      this.showError(err);
    });
  }
  get getFromControls() { return this.copyServiceManagementForm.controls; }
  get getRepsFromControls() { return this.repsForm.controls; }
  get copyForm() { return this.copyServiceForm.controls; }
}


