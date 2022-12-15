import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { StorageService } from 'src/app/services/common/storage.service';
import DataGrid from 'devextreme/ui/data_grid';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { ckeConfig } from 'src/app/constants/Ckeditor';
import { CommonRegex } from 'src/app/constants/commonregex';


@Component({
  selector: 'app-parent-comp',
  templateUrl: './parent-comp.component.html',
  styleUrls: ['./parent-comp.component.css']
})
export class ParentCompComponent implements OnInit {
  searchText: string;
  userType: number;
  parentFacilityList: any = [];
  isGoBtnDisabled: boolean;
  parentCompanyDetailForm: FormGroup;
  modalityServicesForm: FormGroup;
  modalityMriForm: FormGroup;
  modalityCtForm: FormGroup;
  pricingCurrentForm: FormGroup;
  historicalPricingForm: FormGroup;
  public parentPolicy: string = '';
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  allMode: string;
  checkBoxesMode: string;
  selectedItemKeys: any[] = [];
  facilityParentId: number;
  title: string = 'Add parent company';
  isInsertButtonVisible: boolean = false;
  isOkAndApplyButtonVisible: boolean = true;
  submitted: boolean = false;
  modalValue: string = 'modal';
  FacilityParentCurrentPricingList: any = [];
  FacilityParentPricingHistoryList: any = [];
  totalRecords: number = 1;
  pageNumber: number = 1;
  pageSize: number;
  isShowColumnWithNoData = true;
  numberPattern: any = /^\d{0,4}(\.\d{1,2})?$/;
  readonly pageSizeArray = PageSizeArray;
  readonly CkeConfig = ckeConfig;
  readonly commonRegex = CommonRegex;

  name = 'ng2-ckeditor';
  documentTabHide: boolean = false;
  isPopUpInEditMode: boolean = false;
  sendDataDocManager: any;
  FacilityParentName: string = '';
  //ckeConfig: CKEDITOR.config;
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  constructor(private readonly facilityService: FacilityService, private fb: FormBuilder, private notificationService: NotificationService,
    private commonMethodService: CommonMethodService, private readonly storageService: StorageService) {
  }
  ngOnInit(): void {
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.commonMethodService.setTitle('Parent Comp.');
    this.createParentCompanyDetailTabForm();
    this.createModalityServiceTabForm();
    this.createModalityMriTabForm();
    this.createModalityCtForm();
    this.setGridSetting();
    let lastSearchBody = {
      'searchText': '',
      'isActive': 0,
      'tabName': 'Parent Comp',
      'userId': this.storageService.user.UserId,
      'clear': 2
    }
    this.getFacilityLastFilterRecord(lastSearchBody);
    this.facilityService.filterResult.subscribe((res: any) => {
      this.pageNumber = 1;
      this.pageSize = 50;
      this.searchText = res.searchText;
      this.userType = parseInt(res.userTypeText);
      let lastSearchBody = {
        'searchText': this.searchText,
        'isActive': this.userType,
        'tabName': 'Parent Comp',
        'userId': this.storageService.user.UserId,
        'clear': 0
      }
      this.getFacilityLastFilterRecord(lastSearchBody);
    });

    this.facilityService.clearClickedEvent.subscribe((res: string) => {
      if (res === 'clearFilter') {
        this.searchText = '';
        this.userType = 1;
        let lastSearchBody = {
          'searchText': '',
          'isActive': 1,
          'tabName': 'Parent Comp',
          'userId': this.storageService.user.UserId,
          'clear': 1
        }
        this.getFacilityLastFilterRecord(lastSearchBody);
      }
    });
    this.facilityService.actionDropDown.subscribe((actionValue: any) => {
      if (actionValue == this.facilityService.actionDropDownEnum.ExportFacilitiesToExcel) {
        this.onExporting();
      }
    });

    // this.ckeConfig = {
    //   allowedContent: false,
    //   extraPlugins: 'divarea',
    //   forcePasteAsPlainText: true
    // };
  }
  onChange($event: any): void {
    //this.log += new Date() + "<br />";
  }

  onPaste($event: any): void {
    //this.log += new Date() + "<br />";
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getAllParentFacility();
  }
  pageChanged(event) {
    this.pageNumber = event;
    this.getAllParentFacility()
  }

  getFacilityLastFilterRecord(body: any) {
    this.facilityService.getFacilitySearchData(true, body).subscribe((res) => {
      if (res.response != null) {
        this.searchText = res.response[0].searchText;
        this.userType = res.response[0].isActive;
        this.facilityService.updateSearchText(this.searchText);
        this.facilityService.updateDropDown(this.userType);
        this.getAllParentFacility();
      }
      else {
        this.searchText = '';
        this.userType = 1;
        this.facilityService.updateSearchText(this.searchText);
        this.facilityService.updateDropDown(this.userType);
        this.getAllParentFacility();
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  senddocManagerFacility() {
    this.sendDataDocManager = {
      facilityParentId: this.facilityParentId,
      FacilityParentName: this.FacilityParentName,
      from: 'FacilityParent'
    }
    this.facilityService.getdocManagerFacility(this.sendDataDocManager);
  }
  setGridSetting() {
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately'
    }, {
      key: 'onClick',
      name: 'On Button Click'
    }];
    this.columnResizingMode = this.resizingModes[0];
    this.currentFilter = this.applyFilterTypes[0].key;
    this.allMode = 'page';
    this.checkBoxesMode = 'always'
    this.showFilterRow = true;
    this.showHeaderFilter = false;
  }

  createParentCompanyDetailTabForm() {
    this.parentCompanyDetailForm = this.fb.group({
      FacilityParentName: ['', Validators.required],
      DBA: [''],
      Address: ['', Validators.required],
      City: ['', Validators.required],
      State: ['', Validators.required],
      Zip: ['', Validators.required],
      Website: [''],
      IsActive: [''],
      IsSendLeaseToFacility:[''],
      OwnerName: [''],
      OwnerEmail: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      OwnerPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      OwnerFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      ManagerName: [''],
      ManagerEmail: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      ManagerPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      ManagerFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      ITName: [''],
      ITEmail: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      ITPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      ITFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      BillingName: [''],
      BillingEmail: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      BillingPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      BillingFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      DefaultEmailAddress3P: ['', [Validators.required, Validators.pattern(this.commonRegex.EmailRegex)]],
      EmailAddress13P: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      EmailAddress23P: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]]
    });
  }
  createModalityServiceTabForm() {
    this.modalityServicesForm = this.fb.group({
      ArthrogramService: [''],
      BoneDensityService: [''],
      CTService: [''],
      CTArthrogramService: [''],
      DEXAService: [''],
      MammographService: [''],
      MRIService: [''],
      MyElogramService: [''],
      NuclearMedicineService: [''],
      PETScanService: [''],
      UltrasoundService: [''],
      XrayService: []
    });
  }
  createModalityMriTabForm() {
    this.modalityMriForm = this.fb.group({
      MRI1Type: [''],
      MRI1Strength: [''],
      MRI1Make: [''],
      MRI1Weight: [''],
      MRI1Contrast: [''],
      MRIWFlexandEXT: [''],
      MRI1Sedation: [''],
      MRI1Breast: [''],

      MRI2Type: [''],
      MRI2Strength: [''],
      MRI2Make: [''],
      MRI2Weight: [''],
      MRI2Contrast: [''],
      MRI2WFlexandEXT: [''],
      MRI2Sedation: [''],
      MRI2Breast: [''],

      MRI3Type: [''],
      MRI3Strength: [''],
      MRI3Make: [''],
      MRI3Weight: [''],
      MRI3Contrast: [''],
      MRI3WFlexandEXT: [''],
      MRI3Sedation: [''],
      MRI3Breast: [''],
    });
  }
  createModalityCtForm() {
    this.modalityCtForm = this.fb.group({
      CT1Make: [''],
      CT1Slices: [''],
      CT1Weight: [''],
      CT1Contrast: [''],
      CT1Sedation: [''],
      CT1Breast: [''],

      CT2Make: [''],
      CT2Slices: [''],
      CT2Weight: [''],
      CT2Contrast: [''],
      CT2Sedation: [''],
      CT2Breast: [''],

      CT3Make: [''],
      CT3Slices: [''],
      CT3Weight: [''],
      CT3Contrast: [''],
      CT3Sedation: [''],
      CT3Breast: [''],
    });
  }
  getAllParentFacility() {
    let body = { 'isActive': this.userType, 'pageSize': this.pageSize, 'pageNumber': this.pageNumber, 'searchText': this.searchText }
    this.facilityService.getAllSearchFacilityParent(true, body).subscribe((res) => {

      this.parentFacilityList = [];
      if (res.response != null && res.response.length > 0) {
        this.parentFacilityList = res.response;
        this.totalRecords = res.totalRecords;
        this.isShowColumnWithNoData = true;
      }
      else {
        this.parentFacilityList = [];
        this.totalRecords = 1;
        this.isShowColumnWithNoData = false;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  getFacilityParentById() {
    this.facilityService.getFacilityParentById(true, this.facilityParentId).subscribe((res) => {
      this.parentPolicy = '';
      if (res.response != null) {
        this.isInsertButtonVisible = false;
        this.isOkAndApplyButtonVisible = true;
        this.parentPolicy = res.response.ParentPolicy;
        this.FacilityParentName = res.response.FacilityParentName;
        this.setParentCompanyDetailForm(res);
        this.setModalityServiceForm(res);
        this.setModalityMriForm(res);
        this.setModalityCtForm(res);
        this.getFacilityCurrentPricing();
        this.getFacilityHistoryPricing();

      }
    },
      (err: any) => {
        this.errorNotification(err);
      });
  }
  setParentCompanyDetailForm(res: any) {
    this.parentCompanyDetailForm.patchValue({
      FacilityParentName: res.response.FacilityParentName,
      DBA: res.response.DBA,
      Address: res.response.Address,
      City: res.response.City,
      State: res.response.State,
      Zip: res.response.Zip,
      Website: res.response.Website,
      IsActive: res.response.IsActive,
      IsSendLeaseToFacility:res.response.IsSendLeaseToFacility,
      OwnerName: res.response.OwnerName,
      OwnerEmail: res.response.OwnerEmail,
      OwnerPhone: res.response.OwnerPhone,
      OwnerFax: res.response.OwnerFax,
      ManagerName: res.response.ManagerName,
      ManagerEmail: res.response.ManagerEmail,
      ManagerPhone: res.response.ManagerPhone,
      ManagerFax: res.response.ManagerFax,
      ITName: res.response.ITName,
      ITEmail: res.response.ITEmail,
      ITPhone: res.response.ITPhone,
      ITFax: res.response.ITFax,
      BillingName: res.response.BillingName,
      BillingEmail: res.response.BillingEmail,
      BillingPhone: res.response.BillingPhone,
      BillingFax: res.response.BillingFax,
      DefaultEmailAddress3P: res.response.DefaultEmailAddress3P,
      EmailAddress13P: res.response.EmailAddress13P,
      EmailAddress23P: res.response.EmailAddress23P
    });
  }
  setModalityServiceForm(res: any) {
    this.modalityServicesForm.patchValue({
      ArthrogramService: res.response.ArthrogramService,
      BoneDensityService: res.response.BoneDensityService,
      CTService: res.response.CTService,
      CTArthrogramService: res.response.CTArthrogramService,
      DEXAService: res.response.DEXAService,
      MammographService: res.response.MammographService,
      MRIService: res.response.MRIService,
      MyElogramService: res.response.MyElogramService,
      NuclearMedicineService: res.response.NuclearMedicineService,
      PETScanService: res.response.PETScanService,
      UltrasoundService: res.response.UltrasoundService,
      XrayService: res.response.XrayService,
    });
  }
  setModalityMriForm(res: any) {
    this.modalityMriForm.patchValue({
      MRI1Type: res.response.MRI1Type,
      MRI1Strength: res.response.MRI1Strength,
      MRI1Make: res.response.MRI1Make,
      MRI1Weight: res.response.MRI1Weight,
      MRI1Contrast: res.response.MRI1Contrast,
      MRIWFlexandEXT: res.response.MRIWFlexandEXT,
      MRI1Sedation: res.response.MRI1Sedation,
      MRI1Breast: res.response.MRI1Breast,

      MRI2Type: res.response.MRI2Type,
      MRI2Strength: res.response.MRI2Strength,
      MRI2Make: res.response.MRI2Make,
      MRI2Weight: res.response.MRI2Weight,
      MRI2Contrast: res.response.MRI2Contrast,
      MRI2WFlexandEXT: res.response.MRI2WFlexandEXT,
      MRI2Sedation: res.response.MRI2Sedation,
      MRI2Breast: res.response.MRI2Breast,

      MRI3Type: res.response.MRI3Type,
      MRI3Strength: res.response.MRI3Strength,
      MRI3Make: res.response.MRI3Make,
      MRI3Weight: res.response.MRI3Weight,
      MRI3Contrast: res.response.MRI3Contrast,
      MRI3WFlexandEXT: res.response.MRI3WFlexandEXT,
      MRI3Sedation: res.response.MRI3Sedation,
      MRI3Breast: res.response.MRI3Breast,
    });
  }
  setModalityCtForm(res: any) {

    this.modalityCtForm.patchValue({
      CT1Make: res.response.CT1Make,
      CT1Slices: res.response.CT1Slices,
      CT1Weight: res.response.CT1Weight,
      CT1Contrast: res.response.CT1Contrast,
      CT1Sedation: res.response.CT1Sedation,
      CT1Breast: res.response.CT1Breast,

      CT2Make: res.response.CT2Make,
      CT2Slices: res.response.CT2Slices,
      CT2Weight: res.response.CT2Weight,
      CT2Contrast: res.response.CT2Contrast,
      CT2Sedation: res.response.CT2Sedation,
      CT2Breast: res.response.CT2Breast,

      CT3Make: res.response.CT3Make,
      CT3Slices: res.response.CT3Slices,
      CT3Weight: res.response.CT3Weight,
      CT3Contrast: res.response.CT3Contrast,
      CT3Sedation: res.response.CT3Sedation,
      CT3Breast: res.response.CT3Breast,
    });
  }
  getFacilityCurrentPricing() {

    this.FacilityParentCurrentPricingList = [];
    this.facilityService.getFacilityParentPricing(true, this.facilityParentId).subscribe((res) => {
      if (res.response != null) {
        this.FacilityParentCurrentPricingList = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getFacilityHistoryPricing() {

    this.FacilityParentPricingHistoryList = [];
    this.facilityService.getFacilityParentPricingHistory(true, this.facilityParentId).subscribe((res) => {
      if (res.response != null) {
        this.FacilityParentPricingHistoryList = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  selectionChanged(data: any) {
    this.selectedItemKeys = data.selectedRowKeys;
  }
  getFacilityDetail(event: any) {
    this.resetParentFacilityForm();
    this.facilityParentId = event.row.data.facilityParentID
    this.title = event.row.data.facilityParentName;
    this.isPopUpInEditMode = true;
    this.getFacilityParentById();
    this.documentTabHide = false;
  }
  setvalueFalse() {
    this.facilityParentId = null;
    this.pcForm.mriService.setValue(false),
      this.pcForm.xrayService.setValue(false),
      this.pcForm.ctService.setValue(false),
      this.pcForm.arthrogramService.setValue(false),
      this.pcForm.boneDensityService.setValue(false),
      this.pcForm.mammographService.setValue(false),
      this.pcForm.nuclearMedicineService.setValue(false),
      this.pcForm.petScanService.setValue(false),
      this.pcForm.ultrasoundService.setValue(false),
      this.pcForm.isActive.setValue(false)
  }
  resetParentFacilityForm() {
    this.documentTabHide = true;
    this.FacilityParentCurrentPricingList = [];
    this.FacilityParentPricingHistoryList = [];
    this.isInsertButtonVisible = true;
    this.isOkAndApplyButtonVisible = false;
    this.parentCompanyDetailForm.reset();
    this.modalityServicesForm.reset();
    this.modalityMriForm.reset();
    this.modalityCtForm.reset();
    this.submitted = false;
    this.parentPolicy = '';
    this.title = 'Add parent company';
    this.isPopUpInEditMode = false;
  }

  addParentFacility() {
    this.submitted = true;
    this.modalValue = 'modal';
    if (this.parentCompanyDetailForm.invalid) {
      this.modalValue = '';
      return;
    }
    var body = {
      //// Facility Form
      'facilityParentId': 0,
      'facilityParentName': this.pcForm.FacilityParentName.value,
      'dba': this.pcForm.DBA.value,
      'address': this.pcForm.Address.value,
      'city': this.pcForm.City.value,
      'state': this.pcForm.State.value,
      'zip': this.pcForm.Zip.value,
      'website': this.pcForm.Website.value,
      'isActive': this.pcForm.IsActive.value,
      'IsSendLeaseToFacility':this.pcForm.IsSendLeaseToFacility.value,
      'ownerName': this.pcForm.OwnerName.value,
      'ownerEmail': this.pcForm.OwnerEmail.value,
      'ownerPhone': this.pcForm.OwnerPhone.value != null ? this.pcForm.OwnerPhone.value.replace(/\D+/g, '') : '',
      'ownerFax': this.pcForm.OwnerFax.value != null ? this.pcForm.OwnerFax.value.replace(/\D+/g, '') : '',
      'managerName': this.pcForm.ManagerName.value,
      'managerEmail': this.pcForm.ManagerEmail.value,
      'managerPhone': this.pcForm.ManagerPhone.value != null ? this.pcForm.ManagerPhone.value.replace(/\D+/g, '') : '',
      'managerFax': this.pcForm.ManagerFax.value != null ? this.pcForm.ManagerFax.value.replace(/\D+/g, '') : '',
      'itname': this.pcForm.ITName.value,
      'itemail': this.pcForm.ITEmail.value,
      'itphone': this.pcForm.ITPhone.value != null ? this.pcForm.ITPhone.value.replace(/\D+/g, '') : '',
      'itfax': this.pcForm.ITFax.value != null ? this.pcForm.ITFax.value.replace(/\D+/g, '') : '',
      'billingName': this.pcForm.BillingName.value,
      'billingEmail': this.pcForm.BillingEmail.value,
      'billingPhone': this.pcForm.BillingPhone.value != null ? this.pcForm.BillingPhone.value.replace(/\D+/g, '') : '',
      'billingFax': this.pcForm.BillingFax.value != null ? this.pcForm.BillingFax.value.replace(/\D+/g, '') : '',
      'defaultEmailAddress3P':this.pcForm.DefaultEmailAddress3P.value,
      'emailAddress13P':this.pcForm.EmailAddress13P.value ,
      'emailAddress23P':this.pcForm.EmailAddress23P.value,

      //// Modality Service
      'arthrogramService': this.modalityServicesFormControl.ArthrogramService.value,
      'boneDensityService': this.modalityServicesFormControl.BoneDensityService.value,
      'ctservice': this.modalityServicesFormControl.CTService.value,
      'ctarthrogramService': this.modalityServicesFormControl.CTArthrogramService.value,
      'dexaservice': this.modalityServicesFormControl.DEXAService.value,
      'mammographService': this.modalityServicesFormControl.MammographService.value,
      'mriservice': this.modalityServicesFormControl.MRIService.value,
      'myElogramService': this.modalityServicesFormControl.MyElogramService.value,
      'nuclearMedicineService': this.modalityServicesFormControl.NuclearMedicineService.value,
      'petscanService': this.modalityServicesFormControl.PETScanService.value,
      'ultrasoundService': this.modalityServicesFormControl.UltrasoundService.value,
      'xrayService': this.modalityServicesFormControl.XrayService.value,


      ///// Modality MRI
      'mri1type': this.modalityMriFormControl.MRI1Type.value,
      'mri1strength': this.modalityMriFormControl.MRI1Strength.value,
      'mri1make': this.modalityMriFormControl.MRI1Make.value,
      'mri1weight': this.modalityMriFormControl.MRI1Weight.value,
      'mri1contrast': this.modalityMriFormControl.MRI1Contrast.value,
      'mriwflexandExt': this.modalityMriFormControl.MRIWFlexandEXT.value,
      'mri1sedation': this.modalityMriFormControl.MRI1Sedation.value,
      'mri1breast': this.modalityMriFormControl.MRI1Breast.value,

      'mri2type': this.modalityMriFormControl.MRI2Type.value,
      'mri2strength': this.modalityMriFormControl.MRI2Strength.value,
      'mri2make': this.modalityMriFormControl.MRI2Make.value,
      'mri2weight': this.modalityMriFormControl.MRI2Weight.value,
      'mri2contrast': this.modalityMriFormControl.MRI2Contrast.value,
      'mri2wflexandExt': this.modalityMriFormControl.MRI2WFlexandEXT.value,
      'mri2sedation': this.modalityMriFormControl.MRI2Sedation.value,
      'mri2breast': this.modalityMriFormControl.MRI2Breast.value,

      'mri3type': this.modalityMriFormControl.MRI3Type.value,

      'mri3strength': this.modalityMriFormControl.MRI3Strength.value,
      'mri3make': this.modalityMriFormControl.MRI3Make.value,
      'mri3weight': this.modalityMriFormControl.MRI3Weight.value,
      'mri3contrast': this.modalityMriFormControl.MRI3Contrast.value,
      'mri3wflexandExt': this.modalityMriFormControl.MRI3WFlexandEXT.value,
      'mri3sedation': this.modalityMriFormControl.MRI3Sedation.value,
      'mri3breast': this.modalityMriFormControl.MRI3Breast.value,

      //// Modality CT

      'ct1make': this.modalityCtFormControl.CT1Make.value,
      'ct1slices': this.modalityCtFormControl.CT1Slices.value,
      'ct1weight': this.modalityCtFormControl.CT1Weight.value,
      'ct1contrast': this.modalityCtFormControl.CT1Contrast.value,
      'ct1sedation': this.modalityCtFormControl.CT1Sedation.value,
      'ct1breast': this.modalityCtFormControl.CT1Breast.value,

      'ct2make': this.modalityCtFormControl.CT2Make.value,
      'ct2slices': this.modalityCtFormControl.CT2Slices.value,
      'ct2weight': this.modalityCtFormControl.CT2Weight.value,
      'ct2contrast': this.modalityCtFormControl.CT2Contrast.value,
      'ct2sedation': this.modalityCtFormControl.CT2Sedation.value,
      'ct2breast': this.modalityCtFormControl.CT2Breast.value,

      'ct3make': this.modalityCtFormControl.CT3Make.value,
      'ct3slices': this.modalityCtFormControl.CT3Slices.value,
      'ct3weight': this.modalityCtFormControl.CT3Weight.value,
      'ct3contrast': this.modalityCtFormControl.CT3Contrast.value,
      'ct3sedation': this.modalityCtFormControl.CT3Sedation.value,
      'ct3breast': this.modalityCtFormControl.CT3Breast.value,

      'parentPolicy': this.parentPolicy,
    }
    this.facilityService.addFacilityParent(true, body).subscribe((res) => {
      if (res) {
        this.showSuccessNotification(res);
        this.getAllParentFacility();
      }
    },
      (err: any) => {
        //this.resetParentFacilityForm();
        this.errorNotification(err);
      });

  }

  updateParentFacilityById() {


    this.submitted = true;
    this.modalValue = 'modal';
    if (this.parentCompanyDetailForm.invalid) {
      this.modalValue = '';
      return;
    }
    var body = {
      //// Facility Form
      'facilityParentId': this.facilityParentId,
      'facilityParentName': this.pcForm.FacilityParentName.value,
      'dba': this.pcForm.DBA.value,
      'address': this.pcForm.Address.value,
      'city': this.pcForm.City.value,
      'state': this.pcForm.State.value,
      'zip': this.pcForm.Zip.value,
      'website': this.pcForm.Website.value,
      'isActive': this.pcForm.IsActive.value,
      'IsSendLeaseToFacility':this.pcForm.IsSendLeaseToFacility.value,
      'ownerName': this.pcForm.OwnerName.value,
      'ownerEmail': this.pcForm.OwnerEmail.value,
      'ownerPhone': this.pcForm.OwnerPhone.value != null ? this.pcForm.OwnerPhone.value.replace(/\D+/g, '') : '',
      'ownerFax': this.pcForm.OwnerFax.value != null ? this.pcForm.OwnerFax.value.replace(/\D+/g, '') : '',
      'managerName': this.pcForm.ManagerName.value,
      'managerEmail': this.pcForm.ManagerEmail.value,
      'managerPhone': this.pcForm.ManagerPhone.value != null ? this.pcForm.ManagerPhone.value.replace(/\D+/g, '') : '',
      'managerFax': this.pcForm.ManagerFax.value != null ? this.pcForm.ManagerFax.value.replace(/\D+/g, '') : '',
      'itname': this.pcForm.ITName.value,
      'itemail': this.pcForm.ITEmail.value,
      'itphone': this.pcForm.ITPhone.value != null ? this.pcForm.ITPhone.value.replace(/\D+/g, '') : '',
      'itfax': this.pcForm.ITFax.value != null ? this.pcForm.ITFax.value.replace(/\D+/g, '') : '',
      'billingName': this.pcForm.BillingName.value,
      'billingEmail': this.pcForm.BillingEmail.value,
      'billingPhone': this.pcForm.BillingPhone.value != null ? this.pcForm.BillingPhone.value.replace(/\D+/g, '') : '',
      'billingFax': this.pcForm.BillingFax.value != null ? this.pcForm.BillingFax.value.replace(/\D+/g, '') : '',
      'defaultEmailAddress3P':this.pcForm.DefaultEmailAddress3P.value,
      'emailAddress13P':this.pcForm.EmailAddress13P.value ,
      'emailAddress23P':this.pcForm.EmailAddress23P.value,

      //// Modality Service
      'arthrogramService': this.modalityServicesFormControl.ArthrogramService.value,
      'boneDensityService': this.modalityServicesFormControl.BoneDensityService.value,
      'ctservice': this.modalityServicesFormControl.CTService.value,
      'ctarthrogramService': this.modalityServicesFormControl.CTArthrogramService.value,
      'dexaservice': this.modalityServicesFormControl.DEXAService.value,
      'mammographService': this.modalityServicesFormControl.MammographService.value,
      'mriservice': this.modalityServicesFormControl.MRIService.value,
      'myElogramService': this.modalityServicesFormControl.MyElogramService.value,
      'nuclearMedicineService': this.modalityServicesFormControl.NuclearMedicineService.value,
      'petscanService': this.modalityServicesFormControl.PETScanService.value,
      'ultrasoundService': this.modalityServicesFormControl.UltrasoundService.value,
      'xrayService': this.modalityServicesFormControl.XrayService.value,


      ///// Modality MRI
      'mri1type': this.modalityMriFormControl.MRI1Type.value,
      'mri1strength': this.modalityMriFormControl.MRI1Strength.value,
      'mri1make': this.modalityMriFormControl.MRI1Make.value,
      'mri1weight': this.modalityMriFormControl.MRI1Weight.value,
      'mri1contrast': this.modalityMriFormControl.MRI1Contrast.value,
      'mriwflexandExt': this.modalityMriFormControl.MRIWFlexandEXT.value,
      'mri1sedation': this.modalityMriFormControl.MRI1Sedation.value,
      'mri1breast': this.modalityMriFormControl.MRI1Breast.value,

      'mri2type': this.modalityMriFormControl.MRI2Type.value,
      'mri2strength': this.modalityMriFormControl.MRI2Strength.value,
      'mri2make': this.modalityMriFormControl.MRI2Make.value,
      'mri2weight': this.modalityMriFormControl.MRI2Weight.value,
      'mri2contrast': this.modalityMriFormControl.MRI2Contrast.value,
      'mri2wflexandExt': this.modalityMriFormControl.MRI2WFlexandEXT.value,
      'mri2sedation': this.modalityMriFormControl.MRI2Sedation.value,
      'mri2breast': this.modalityMriFormControl.MRI2Breast.value,

      'mri3type': this.modalityMriFormControl.MRI3Type.value,
      'mri3strength': this.modalityMriFormControl.MRI3Strength.value,
      'mri3make': this.modalityMriFormControl.MRI3Make.value,
      'mri3weight': this.modalityMriFormControl.MRI3Weight.value,
      'mri3contrast': this.modalityMriFormControl.MRI3Contrast.value,
      'mri3wflexandExt': this.modalityMriFormControl.MRI3WFlexandEXT.value,
      'mri3sedation': this.modalityMriFormControl.MRI3Sedation.value,
      'mri3breast': this.modalityMriFormControl.MRI3Breast.value,

      //// Modality CT

      'ct1make': this.modalityCtFormControl.CT1Make.value,
      'ct1slices': this.modalityCtFormControl.CT1Slices.value,
      'ct1weight': this.modalityCtFormControl.CT1Weight.value,
      'ct1contrast': this.modalityCtFormControl.CT1Contrast.value,
      'ct1sedation': this.modalityCtFormControl.CT1Sedation.value,
      'ct1breast': this.modalityCtFormControl.CT1Breast.value,

      'ct2make': this.modalityCtFormControl.CT2Make.value,
      'ct2slices': this.modalityCtFormControl.CT2Slices.value,
      'ct2weight': this.modalityCtFormControl.CT2Weight.value,
      'ct2contrast': this.modalityCtFormControl.CT2Contrast.value,
      'ct2sedation': this.modalityCtFormControl.CT2Sedation.value,
      'ct2breast': this.modalityCtFormControl.CT2Breast.value,

      'ct3make': this.modalityCtFormControl.CT3Make.value,
      'ct3slices': this.modalityCtFormControl.CT3Slices.value,
      'ct3weight': this.modalityCtFormControl.CT3Weight.value,
      'ct3contrast': this.modalityCtFormControl.CT3Contrast.value,
      'ct3sedation': this.modalityCtFormControl.CT3Sedation.value,
      'ct3breast': this.modalityCtFormControl.CT3Breast.value,

      'parentPolicy': this.parentPolicy,
      //// Facility Policy

    }
    this.facilityService.updateFacilityParent(true, body).subscribe((res) => {
      if (res) {
        this.showSuccessNotification(res);
        this.getFacilityParentById();
      }
    },
      (err: any) => {
        //this.resetParentFacilityForm();
        this.errorNotification(err);
      });

  }
  // common Error Method
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  showSuccessNotification(res: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }
  saveChangesCurrentPricing() {

    this.facilityService.updateFacilityParentPricing(true, this.FacilityParentCurrentPricingList).subscribe((res) => {
      if (res.response != null) {
        this.showSuccessNotification(res);
        this.getFacilityParentById();
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  customizeText(cellInfo) {
    return cellInfo.valueText.replace("USD", "$");
  }
  onExporting() {

    let element = document.getElementById('parent-Facility-grid-container');
    let instance = DataGrid.getInstance(element) as DataGrid;
    this.commonMethodService.onExporting(instance, 'ParentFacility')
  }
  get pcForm() { return this.parentCompanyDetailForm.controls; }
  get modalityServicesFormControl() { return this.modalityServicesForm.controls };
  get modalityMriFormControl() { return this.modalityMriForm.controls };
  get modalityCtFormControl() { return this.modalityCtForm.controls };

}
