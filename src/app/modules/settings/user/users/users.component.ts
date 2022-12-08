import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ckeConfig } from 'src/app/constants/Ckeditor';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { DxDataGridComponent } from 'devextreme-angular';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { ReferrersService } from 'src/app/services/referrers.service';
import { CommonRegex } from 'src/app/constants/commonregex';
import { RADIOLOGIST_TYPE } from 'src/app/constants/route.constant';


export type EditUserFormValue = {
  'userId': number,
  'firstName': string,
  'lastName': string,
  'companyName': string,
  'dba': string,
  'npi': string,
  'licenceNumber': string,
  'address': string,
  'city': string,
  'state': string,
  'zip': string,
  'departmentId': string,
  'isActive': boolean,
  'cell': string,
  'birthday': string,
  'phone': string,
  'fax': string,
  'email': string,
  'workEmail': string,
  'eContactName1': string,
  'eContactName2': string,
  'eContactPhone1': string,
  'eContactPhone2': string,
  'userType': string,
  'extension': string,
  'lunchTime': string,
  'userPosition': string,
  'userHire': string,
  'userDuties': string,
  'groupName': string,
  'assignBrokerID': string,
  'assignFacilityParentID': string,
  'assignFacilityID': string,
  'assignReferrerID': string,
  'assignFacilityDId': string,
  'userTermination': string,
  'hours': string,
  'userSlackID': string,
  'officeLocation':string
};

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  a3: any = 20;
  a4: any = 20;
  maxDate = new Date();
  @ViewChild('gridContainer') dataGrid: DxDataGridComponent;
  editUserForm: FormGroup;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  totalRecords: number;
  pageNumber: number = 1;
  pageSize: number;
  userList: any = [];
  modelValue: string = 'modal';
  submitted = false;
  userId: number;
  userServiceForm: FormGroup;
  //  Dropdown
  showDropdownLoader = true;
  referrerList: any = [];
  facilityList: any = [];
  parentFacilityList: any = [];
  brokerList: any = [];
  departmentList: any = [];
  roleGroupList: any = [];
  userTypeList: any = [];
  FacilityDeptroleList: any = [];
  subscription: any;
  radiologistList: any = [];
  allReferrersList: any = [];
  selectedReferrerList: any = [];
  selectedFacilityList: any = [];
  selectedParentFacilityList: any = [];
  selectedBrokerList: any = [];
  selectedDepartmentList: any = [];
  selectedRoleGroupList: any = [];
  selectedUserTypeList: any = [];
  selectedFacilityDeptroleList: any = [];
  userServiceManagementList: any = [];
  fullName: string;
  userType: string;
  searchText: string;
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  name = 'ng2-ckeditor';
  tagBtnDisabled: boolean = true;
  //ckeConfig: CKEDITOR.config;
  ckeConfig: any;
  ckConfig: any;
  mycontent: string;
  log: string = '';
  groupingNames: boolean = false;
  isSearchReferrer: boolean = false;
  topSearchText: any = '';
  search_isactive: any = '';
  isShowColumnWithNoData = true;
  readonly pageSizeArray = PageSizeArray;
  readonly CkeConfig = ckeConfig;
  constructor(private fb: FormBuilder, private readonly commonMethodService: CommonMethodService,
    private readonly settingService: SettingsService, private readonly notificationService: NotificationService,
    private readonly referrersService: ReferrersService) { }
    readonly commonRegex=CommonRegex;
  ngOnInit(): void {
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;

    this.commonMethodService.setTitle('Users');
    this.getUsers(this.topSearchText, this.search_isactive);
    this.getDropdown();

    this.editUserForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      companyName: [''],
      dba: [''],
      npi: [''],
      licenceNumber: [''],
      address: [''],
      city: [''],
      state: [''],
      zip: [''],
      isActive: [false],
      cell: ['', [Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)]],
      phone: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      fax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      email: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      workEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      birthday: [''],
      eContactName1: [''],
      eContactName2: [''],
      eContactPhone1: [''],
      eContactPhone2: [''],
      hours: [''],
      extension: [''],
      lunchTime: [''],
      userPosition: [''],
      userHire: [''],
      userTermination: [''],
      userSlackID: [''],
      userDuties: [''],
      userType: ['', [Validators.required]],
      groupName: ['', [Validators.required]],
      departmentId: [''],
      assingBrokerID: [''],
      assignFacilityParentID: [''],
      assignFacilityID: [''],
      assignReferrerID: [''],
      assignFacilityDId: [''],
      officeLocation:['']
    });
    this.userServiceForm = this.fb.group({
      topSearchText: [''],
      search_isactive: ['']
    });
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getUsers(this.topSearchText, this.search_isactive);
  }

  onUpdateSubmit() {
    this.submitted = true;
    this.modelValue = '';
    if (this.editUserForm.invalid) {
      return;
    }


    const { userId, email, firstName, lastName, companyName, dba, npi, licenceNumber, cell, address, city, state, zip, phone, workEmail, fax,
      isActive, birthday, eContactName1, eContactPhone1, eContactName2, eContactPhone2, groupName, userType, userPosition, userHire, departmentId, extension,
      assignBrokerID, lunchTime, assignFacilityParentID, assignFacilityID, assignReferrerID, assignFacilityDId, userTermination, hours, userSlackID, userDuties, officeLocation } = this.editUserForm.value as (EditUserFormValue);
    (this.settingService.updateUser(true, {
      userId: this.userId,
      firstName: firstName,
      lastName: lastName,
      companyName: companyName,
      dba: dba,
      npi: npi,
      licenceNumber: licenceNumber,
      address: address,
      city: city,
      state: state,
      zip: zip,
      isActive: isActive,
      cell: cell,
      phone: phone,
      fax: fax,
      email: email,
      workEmail: workEmail,
      birthday: birthday,
      eContactName1: eContactName1,
      eContactName2: eContactName2,
      eContactPhone1: eContactPhone1,
      eContactPhone2: eContactPhone2,
      officeLocation:officeLocation,
      hours: hours,
      extension: extension,
      lunchTime: lunchTime,
      userPosition: userPosition,
      userHire: userHire,
      userTermination: userTermination,
      userSlackID: userSlackID,
      userDuties: userDuties,
      departmentId: departmentId.toString(),
      groupName: groupName,
      userType: userType,
      assingBrokerID: (this.selectedBrokerList == null) ? null : this.selectedBrokerList.toString(),
      assignFacilityParentID: (this.selectedParentFacilityList == null) ? null : this.selectedParentFacilityList.toString(),
      assignFacilityID: (this.selectedFacilityList == null) ? null : this.selectedFacilityList.toString(),
      assignReferrerID: (assignReferrerID) ? assignReferrerID.toString() : assignReferrerID,
      assignFacilityDId: (this.selectedFacilityDeptroleList == null) ? null : this.selectedFacilityDeptroleList.toString()
    })).subscribe((res: any) => {
      this.modelValue = 'modal';
      if (res) {
        this.getUsers(this.topSearchText, this.search_isactive);
        this.notificationService.showNotification({
          alertHeader: (res.responseCode == ResponseStatusCode.OK) ? 'Success' : 'Error',
          alertMessage: res.message,
          alertType: (res.responseCode == ResponseStatusCode.OK) ? ResponseStatusCode.OK : ResponseStatusCode.InternalError
        });
      }
    },
      (err: any) => {
        this.modelValue = 'modal';
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: ResponseStatusCode.InternalError
        });
      }
    );
  }
  onChange($event: any): void {

    //this.log += new Date() + "<br />";
  }

  onPaste($event: any): void {

    //this.log += new Date() + "<br />";
  }

  // common Error Method
  showError(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  searchUserMgt(pageNumber = 0) {
    //this.pageNumber = pageNumber > 0 ? pageNumber : this.pageNumber;
    this.pageNumber= 1;
    //this.pageSize = 20;
    this.isSearchReferrer = true;
    this.topSearchText = this.copyForm.topSearchText.value ?? '';
    this.search_isactive = this.copyForm.search_isactive.value;
    if (this.search_isactive === null) {
      this.search_isactive = '';
    }
    else {
      this.search_isactive = this.search_isactive;
    }

    if (this.search_isactive === '' && this.topSearchText === '')
      this.clearUserMgt();
    else
      //this.searchUserService();
      this.getUsers(this.topSearchText, this.search_isactive);
  }
  search(){

    this.pageNumber = 1;
    this.searchUserMgt()
  }
  clearUserMgt() {
    this.isSearchReferrer = false;
    this.topSearchText = ''
    this.search_isactive = ''
    this.copyForm.topSearchText.setValue('');

    this.userServiceForm.reset();
    this.userServiceForm = this.fb.group({
      topSearchText: [''],
      search_isactive: ['']
    });
    this.getUsers(this.topSearchText, this.search_isactive)
  }

  getGroupingNames() {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.referrersService.getGroupingNames(true, this.searchText).subscribe((res) => {
      this.referrerList = res.response;
    }, (err: any) => {
      this.notificationService.showNotification({
        alertHeader: err.statusText,
        alertMessage: err.message,
        alertType: err.status
      });
    });
  }
  getDropdown() {
    this.settingService.getUserEditDropdown(false).subscribe((res) => {

      var data: any = res;
      if (data.response != null) {
        this.referrerList = data.response.referrer;
        this.facilityList = data.response.facility;
        this.parentFacilityList = data.response.parentFacility;
        this.brokerList = data.response.broker;
        this.departmentList = data.response.department;
        this.roleGroupList = data.response.roleGroup;
        this.userTypeList = data.response.userType;
        this.allReferrersList = this.referrerList;
        this.radiologistList = this.referrerList.filter(value => {
          return value.PlayerType != null && value.PlayerType.split(',').filter(check => { return Number(check.trim()) == 0; }).length > 0;
        });
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
          alertType: err.status
        });
        this.showDropdownLoader = false;
      });
  }
  onTagChange(tagVal: any) {
    this.searchText = tagVal.target.value;
    //this.searchText = tagVal.event.target.value;

    this.groupingNames = true;
    if (tagVal) {
      if (this.searchText.trim() !== '') {
        this.getGroupingNames();
        this.groupingNames = false;
      }
      else {
        this.referrerList = []
      }
    }
    else {
      this.tagBtnDisabled = true;
    }
  }
  onFocus() {
    this.referrerList = []
  }
  getUsers(topSearchText, status) {

    this.settingService.getUsers(true, topSearchText, status, this.pageNumber, this.pageSize).subscribe((res) => {
      var data: any = res;
      this.userList = []
      this.totalRecords = 1;
      if (data.response != null && data.response.length > 0) {
        this.userList = data.response;
        this.totalRecords = res.totalRecords;
        this.dataGrid.instance.refresh();
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
    this.getUsers(this.topSearchText, this.search_isactive);
  }

  resendWelcomeEmail() {
    this.settingService.sendActivationEmail(true, this.userId).subscribe((res: any) => {
      if (res) {
        this.notificationService.showNotification({
          alertHeader: (res.responseCode == ResponseStatusCode.OK) ? 'Success' : 'Error',
          alertMessage: res.message,
          alertType: (res.responseCode == ResponseStatusCode.OK) ? ResponseStatusCode.OK : ResponseStatusCode.InternalError
        });
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: ResponseStatusCode.InternalError
        });
      });
  }
  shouldEnableVirtualScroll(items, size): boolean {
    if (!items) {
      return false;
    }
    return items.length > size;
  }

  edit(userId) {
    this.editUserForm.reset();
    this.modelValue = '';
    this.submitted = false;
    this.userId = userId;
    this.settingService.getUserById(true, userId).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.selectedUserTypeList = data.response.USERTYPE;
        this.selectedReferrerList = (data.response.Referrers != null) ? data.response.Referrers.map(function (a) { return a.ReferrerID; }) : null;
        this.onUserTypeWiseReferrers();
        this.fullName = data.response.FIRSTNAME + ' ' + data.response.LASTNAME;
        this.userType = data.response.USERTYPE;
        this.selectedBrokerList = (data.response.Brokers != null) ? data.response.Brokers.map(function (a) { return a.BrokerID; }) : null;
        this.selectedFacilityList = (data.response.Facilities != null) ? data.response.Facilities.map(function (a) { return a.FacilityID; }) : null;
        this.selectedParentFacilityList = (data.response.ParentFacilities != null) ? data.response.ParentFacilities.map(function (a) { return a.FacilityParentID; }) : null;
        this.selectedDepartmentList = Number((data.response.DepartmentId != null) ? data.response.DepartmentId : null);
        this.selectedRoleGroupList = data.response.GroupName;
        this.selectedFacilityDeptroleList = (data.response.FacilityDepartment != null) ? data.response.FacilityDepartment.map(function (a) { return a.FacilityDId; }) : null;

        this.editUserForm.patchValue({
          firstName: data.response.FIRSTNAME,
          lastName: data.response.LASTNAME,
          companyName: data.response.COMPANYNAME,
          dba: data.response.DBA,
          npi: data.response.NPI,
          licenceNumber: data.response.LICENSENUMBER,
          address: data.response.ADDRESS,
          city: data.response.CITY,
          state: data.response.STATE,
          zip: data.response.ZIP,
          isActive: data.response.ISACTIVE,
          cell: data.response.CELL,
          phone: data.response.PHONE,
          fax: data.response.FAX,
          email: data.response.EMAIL,
          workEmail: data.response.WORKEMAIL,
          birthday: data.response.BIRTHDAY,
          eContactName1: data.response.EContactName1,
          eContactName2: data.response.EContactName2,
          eContactPhone1: data.response.EContactPhone1,
          eContactPhone2: data.response.EContactPhone2,
          hours: data.response.Hours,
          userType: data.response.USERTYPE,
          extension: data.response.Extention,
          lunchTime: data.response.LunchTime,
          userPosition: data.response.UserPosition,
          userHire: data.response.UserHire,
          userTermination: data.response.UserTermination,
          userSlackID: data.response.UserSlackID,
          userDuties: data.response.UserDuties,
          officeLocation:data.response. OfficeLocation,
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

  clearBroker

  get editForm() { return this.editUserForm.controls; }
  get copyForm() { return this.userServiceForm.controls; }
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }

  onUserTypeWiseReferrers() {
    if (this.selectedUserTypeList == RADIOLOGIST_TYPE) {
      this.referrerList = this.radiologistList;
      var isRadiologistSelected = false;
      if(this.selectedReferrerList){
        this.selectedReferrerList.forEach(element => {
          if(this.radiologistList.some(e => e.ReferrerID == element))
            isRadiologistSelected = true;
          });
      }
      if(!isRadiologistSelected) this.selectedReferrerList = [];

    } else {
      this.referrerList = this.allReferrersList;
    }
  }
}
