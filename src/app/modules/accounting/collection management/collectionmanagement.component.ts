import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { AccoutingService } from 'src/app/services/accouting-service/accouting.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-collectionmanagement',
  templateUrl: './collectionmanagement.component.html',
  styleUrls: ['./collectionmanagement.component.css']
})
export class CollectionmanagementComponent implements OnInit {
  collectionManagementForm: FormGroup;
  isCurrentIdDivVisible: boolean = false;
  popUpTittle: string = 'Add';
  modelValue: string;
  collectionManagementList: any = [];
  IsSubmitted: boolean = false;
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any;
  currentFilter: any;
  showHeaderFilter: boolean;
  pageNumber: number = 1;
  pageSize: number;
  totalRecords: number = 1;
  financialTypeList: any = [];
  selectedFinancialTypeList: any = [];
  collectionsTypesList: any = [];
  selectedCollectionsTypes: any;
  isShownFinType: false;
  isShowColumnWithNoData = true;
  readonly pageSizeArray = PageSizeArray;
  customMask: [string, any];


  constructor(private fb: FormBuilder, private readonly notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService,
    private readonly accoutingService: AccoutingService, private readonly settingsService: SettingsService) {

  }

  ngOnInit(): void {
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.collectionManagementForm = this.fb.group({
      CompanyName: ['', [Validators.required]],
      ContactName: [''],
      PhoneNumber: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      FaxNumber: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      Email: ['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      Address: [''],
      City: [''],
      State: [''],
      Zip: [''],
      DoNotEmail: [''],
      PIN: [''],
      QBAccountName: [''],
      IsActive: [false],
      CommissionPercentage: ['', [Validators.min(0), Validators.max(100)]],
      BillerEmail1: ['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      BillerEmail2: ['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      BillerEmail3: ['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      BillerEmail4: ['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      BillerEmail5: ['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      BulkBillingFinancialType: [''],
      DefaultBiller: [''],
      Type: [''],
      CompanyID: [''],
      CompanyIds: [''],

    });
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
    this.commonMethodService.setTitle('Collection Management');
    this.getMasterFinancialTypesList();
    this.getCollectionsTypes();
    this.getAllCollectionsManagement();

    this.customMask = ['PPP-PPP', new RegExp('(000) 000-0000 (0000)')];

  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getAllCollectionsManagement();
  }
  getMasterFinancialTypesList() {
    this.settingsService.getMasterFinancialTypes(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.financialTypeList = data.response;
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


  getCollectionsTypes() {
    this.accoutingService.getCollectionsTypes(false).subscribe((res) => {
     
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.collectionsTypesList = data.response;
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
  getAllCollectionsManagement() {
    this.accoutingService.getAllCollectionsManagement(true, this.pageNumber, this.pageSize).subscribe((res) => {
      var data: any = res;
      this.totalRecords = res.totalRecords
      if (data.response != null && data.response.length > 0) {
        this.collectionManagementList = data.response;
        this.isShowColumnWithNoData = true;
      }
      else {
        this.collectionManagementList = [];
        this.totalRecords = 1;
        this.isShowColumnWithNoData = false;
        this.showNotification(data);
      }

    }, (err: any) => {
      this.showError(err);
    }
    );
  }
  // common Notification Method
  showNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  showNotificationOnSucess(data: any) {
    this.notificationService.showNotification({
      alertHeader: data.statusText,
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
    this.getAllCollectionsManagement();
  }
  rebindGrid() {
    this.getAllCollectionsManagement();
  }

  //get  row current detail

  getRowCurrentDetail(currentRow: any) {
    document.getElementById('btnUpdate').innerText = 'Save Changes';
    this.popUpTittle = currentRow.data.CompanyName;
    let CompanyID = currentRow.data.CompanyID;
    this.getCollectionsManagementById(CompanyID);
  }
  //get collections management by id

  getCollectionsManagementById(CompanyID: number) {
    this.accoutingService.getCollectionsManagementById(true, CompanyID).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.selectedFinancialTypeList = '';
        if (data.response.BulkBillingFinancialType) {
          this.selectedFinancialTypeList = data.response.BulkBillingFinancialType.split(',').map(function (item) {
            return item.trim();
          });
        }
        this.selectedCollectionsTypes = data.response.Type;
        this.isShownFinType = data.response.DefaultBiller;
        this.collectionManagementForm.patchValue({
          CompanyName: data.response.CompanyName,
          ContactName: data.response.ContactName,
          PhoneNumber: data.response.PhoneNum,
          FaxNumber: data.response.FaxNum,
          Email: data.response.Email,
          Address: data.response.Address,
          City: data.response.City,
          State: data.response.State,
          Zip: data.response.Zip,
          DoNotEmail: data.response.DoNotEmail,
          PIN: data.response.PIN,
          QBAccountName: data.response.QBAccountName,
          IsActive: data.response.IsActive,
          CommissionPercentage: data.response.CommissionPercentage,
          BillerEmail1: data.response.BillerEmail1,
          BillerEmail2: data.response.BillerEmail2,
          BillerEmail3: data.response.BillerEmail3,
          BillerEmail4: data.response.BillerEmail4,
          BillerEmail5: data.response.BillerEmail5,
          DefaultBiller: data.response.DefaultBiller,
          CompanyID: data.response.CompanyID,
          CompanyIds: data.response.CompanyIds,
          Type: this.selectedCollectionsTypes.toString(),
          BulkBillingFinancialType: this.selectedFinancialTypeList
        });
      }
      else {
        this.showNotification(data);
      }

    }, (err: any) => {
      this.showError(err);
    }
    );
  }

  onChangeTypeDropDown(Type: string) {
    this.selectedCollectionsTypes = Type;
  }

  onChangechecked(e) {
    this.isShownFinType = e.target.checked;
  }

  onSubmit() {
    this.IsSubmitted = true;
    this.modelValue = 'modal';
    if (this.collectionManagementForm.invalid) {
      this.modelValue = '';
      return;
    }
    if (typeof (this.selectedCollectionsTypes) === 'undefined') {
      this.selectedCollectionsTypes = '';
    }
    var body = {
      CompanyID: this.getFromControls.CompanyID.value,
      CompanyIds: this.getFromControls.CompanyIds.value,
      CompanyName: this.getFromControls.CompanyName.value,
      ContactName: this.getFromControls.ContactName.value,
      PhoneNum: this.getFromControls.PhoneNumber.value,
      FaxNum: this.getFromControls.FaxNumber.value,
      Email: this.getFromControls.Email.value,
      Address: this.getFromControls.Address.value,
      City: this.getFromControls.City.value,
      State: this.getFromControls.State.value,
      Zip: this.getFromControls.Zip.value,
      DoNotEmail: this.getFromControls.DoNotEmail.value,
      PIN: this.getFromControls.PIN.value,
      QBAccountName: this.getFromControls.QBAccountName.value,
      IsActive: this.getFromControls.IsActive.value,
      CommissionPercentage: this.getFromControls.CommissionPercentage.value,
      BillerEmail1: this.getFromControls.BillerEmail1.value,
      BillerEmail2: this.getFromControls.BillerEmail2.value,
      BillerEmail3: this.getFromControls.BillerEmail3.value,
      BillerEmail4: this.getFromControls.BillerEmail4.value,
      BillerEmail5: this.getFromControls.BillerEmail5.value,
      DefaultBiller: this.getFromControls.DefaultBiller.value,
      BulkBillingFinancialType: this.selectedFinancialTypeList.toString(),
      Type: this.selectedCollectionsTypes.toString()
    }
    if (body.CompanyID) {
      this.accoutingService.updateCollectionsManagement(true, body).subscribe((res) => {
        var data: any = res;
        if (data.response != null && data.response.length > 0) {
          this.restForm();
          this.collectionManagementList = data.response;
          this.showNotificationOnSucess(data);
          this.getAllCollectionsManagement();
        }
        else {
          this.showNotification(data);
        }

      }, (err: any) => {
        this.showError(err);
      }
      );
    }
    else {
      this.accoutingService.addCollectionsManagement(true, body).subscribe((res) => {
        var data: any = res;
        if (data.response !== null && data.responseCode === 200) {
          this.collectionManagementList = data.response;
          this.restForm();
          this.showNotificationOnSucess(data);
          this.getAllCollectionsManagement();
        }
        else {
          this.showNotification(data);
        }

      }, (err: any) => {
        this.showError(err);
      }
      );
    }
  }
  restForm() {
    this.popUpTittle = 'Add';
    this.IsSubmitted = false;
    document.getElementById('btnUpdate').innerText = 'Add';
    this.collectionManagementForm.reset();
    this.clearForm();
  }

  clearForm() {
    this.collectionManagementForm = this.fb.group({
      CompanyName: ['', [Validators.required]],
      ContactName: [''],
      PhoneNumber: [''],
      FaxNumber: [''],
      Email: ['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      Address: [''],
      City: [''],
      State: [''],
      Zip: [''],
      DoNotEmail: [''],
      PIN: [''],
      QBAccountName: [''],
      IsActive: [false],
      CommissionPercentage: ['', [Validators.min(0), Validators.max(100)]],
      BillerEmail1: ['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      BillerEmail2: ['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      BillerEmail3: ['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      BillerEmail4: ['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      BillerEmail5: ['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      BulkBillingFinancialType: [''],
      DefaultBiller: [''],
      Type: [''],
      CompanyID: [''],
      CompanyIds: [''],
    });
  }

  allowNumberOnly(event: any): boolean {
    return this.commonMethodService.alowNumberOnly(event);
  }

  get getFromControls() { return this.collectionManagementForm.controls; }
}
