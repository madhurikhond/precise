import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { ClipboardService } from 'ngx-clipboard';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';


@Component({
  selector: 'app-scheduling-facillities',
  templateUrl: './scheduling-facillities.component.html',
  styleUrls: ['./scheduling-facillities.component.css']
})
export class SchedulingFacillitiesComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  a3: any = 20;
  a4: any = 20;
  a5: any = 20;
  a6: any = 20;
  a7: any = 20;
  a8: any = 20;
  a9: any = 20;
  a10: any = 20;
  a11: any = 20;
  a12: any = 20;
  a13: any = 20;
  a14: any = 20;
  a15: any = 20;
  a16: any = 20;
  a17: any = 20;
  a18: any = 20;
  columnResizingMode: string;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  allMode: string;
  checkBoxesMode: string;
  resizingModes: string[] = ['widget', 'nextColumn'];
  selectedItemKeys: any[] = [];
  schedulingFacilityList: any[] = [];
  facilityList: any[] = [];
  facilityParentList: any[] = [];
  facilityNotesList = [];
  brokerList: any[] = [];
  modalityList: any[] = [];
  financialTypeList: any[] = [];
  selectedParentFacility: any;
  selectedHours: any = [];
  selectedBroker: any;
  selectedModality: any = [];
  selectedFacility: any;
  selectedFinancialType: any;
  selectedMriType: any = [];
  selectedMriStrength: any = [];
  selectedMriMake: any = [];
  selectedMriWeight: any = [];
  selectedMriContrast: any = [];
  selectedMriSedation: any = [];
  selectedMriBreast: any = [];
  selectedCtMake: any = [];
  selectedCtSlices: any = [];
  selectedCtWeight: any = [];
  selectedCtContrast: any = [];
  selectedCtSedation: any = [];
  selectedCtBreast: any = [];
  selectedXrayWalkIn: any = [];
  selectedXrayHours: any = [];
  workZipModel: string;
  homeZipModel: string;
  mriType: any = [{ type: 'Open' }, { type: 'Closed' }, { type: 'Stand Up' }, { type: 'Wide Bore' }];
  mriStrength: any = [{ strength: '.3T' }, { strength: '.6T' }, { strength: '1.0T' }, { strength: '1.2T' }, { strength: '1.5T' }, { strength: '3T' }];
  mriOrCtMake: any = [{ make: 'GE' }, { make: 'Fonar' }, { make: 'Hitachi' }, { make: 'Phillips' }, { make: 'Siemens' }, { make: 'Toshiba' }, { make: 'Other' }];
  mriOrCtWeight: any = [{ weight: '300' }, { weight: '350' }, { weight: '400' }, { weight: '450' }, { weight: '500' }];
  mriOrCtContrast: any = [{ contrast: 'IV' }, { contrast: 'No' }, { contrast: 'Oral' }, { contrast: 'Rectal' }];
  mriOrCtSedation: any = [{ sedation: 'Oral' }, { sedation: 'IV' }, { sedation: 'Both' }, { sedation: 'No' }];
  mriOrCtBreast: any = [{ breast: 'Yes' }, { breast: 'No' }];
  ctSlices: any = [{ slices: '1' }, { slices: '4' }, { slices: '6' }, { slices: '16' }, { slices: '32' }, { slices: '64' }, { slices: 'NA' }];
  hoursOrXrayHours: any = [{ day: 'Sunday' }, { day: 'Monday' }, { day: 'Tuesday' }, { day: 'Wednesday' }, { day: 'Thursday' }, { day: 'Friday' }, { day: 'Saturday' }];
  xrayWalkIn: any = [{ walkIn: 'Yes' }, { walkIn: 'No' }]

  //// Forms 
  generalInfoForm: FormGroup;
  facilityContactDetailForm: FormGroup;
  facilityParentCompanyForm: FormGroup;
  facilitySchedulingDetailForm: FormGroup;
  modalityServiceForm: FormGroup;
  modalityMriForm: FormGroup;
  modalityCtForm: FormGroup;
  modalityExceptionsForm: FormGroup;
  policyForm: FormGroup;

  public facilityPolicy: string = ''  //// For Policies Tab
  public parentPolicy: string = ''    ////  For Policies Tab
  parentFacilityDropDownModel: any;
  schedulingPricing: any = [];
  facilityName: string;
  facilityId: number;
  totalSchedulingFacility: number;
  filterBody: any = {};
  isMriDropDownDisabled: boolean = true;
  isCtDropDownDisabled: boolean = true;
  isXrayDropDownDisabled: boolean = true;
  pageNumber: number = 1;
  pageSize: number = 50;
  readonly pageSizeArray = PageSizeArray;
  name = 'ng2-ckeditor';
  //ckeConfig: CKEDITOR.config;
  ckeConfig: any;
  ckConfig: any;
  mycontent: string;
  ddlCurrentSelectedColumnValue: string = 'Facility Name';
  ddlCurrentSelectedColumnText: string = 'Facility Name';
  ddlSelectedSortingOrderText: string = 'ascending';
  ddlSelectedSortingOrderValue: string = 'asc';
  ddlAllColumns = [];
  ddlSortingOrder: any = [];
  log: string = '';
  @ViewChild('fPolicy', { static: false }) fPolicy: ElementRef;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  constructor(private readonly facilityService: FacilityService, private notificationService: NotificationService, private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, private readonly storageService: StorageService,
    private _clipboardService: ClipboardService) {
  }
  ngOnInit(): void {
    this.setGridSetting();
    this.setPageTitle();
    this.createGeneralInfoTabForm();
    this.createFacilityDetailTabForm();
    this.createParentCompanyTabForm();
    this.createSchedulingDetailTabForm();
    this.createModalityServiceTabForm();
    this.createModalityMriTabForm();
    this.createModalityCtTabForm();
    this.createModalityExceptionsTabForm();
    this.getFacilityList();
    this.getFacilityParentList();
    this.getModalityList();
    this.getBrokerList();
    this.getFinancialTypeList();
    this.totalSchedulingFacility = 1;
    this.filterBody = this.getApplyFilter(true, '', 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', this.ddlCurrentSelectedColumnValue, this.ddlSelectedSortingOrderValue);
    this.getAllSchedulingFacility(this.filterBody);
    // this.ckConfig = {
    //   allowedContent: false,
    //   extraPlugins: 'divarea',
    //   forcePasteAsPlainText: true,
    //   readOnly : true,
    //   removePlugins: 'blockquote,preview,save,print,newpage,templates,find,replace,selectall,SpellChecker,scayt,flash,smiley,about',
    // removeButtons : 'Checkbox,Radio,Form,TextField,Textarea,Select,Button,ImageButton,HiddenField,PageBreak,SpecialChar,HorizontalRule,SpellChecker, Scayt',
    // };
    this.ckConfig = {
      allowedContent: false,
      forcePasteAsPlainText: true,
      readOnly: true,
      removePlugins: 'elementspath,blockquote,preview,save,print,newpage,templates,find,replace,SpellChecker,scayt,flash,smiley,about',
      removeButtons: 'Checkbox,Radio,Form,TextField,Textarea,Select,Button,ImageButton,HiddenField,PageBreak,SpecialChar,HorizontalRule,SpellChecker, Scayt',
    };
    this.policyForm.patchValue({
      facilityPolicy: this.facilityPolicy,
      parentPolicy: this.parentPolicy
    })
    setTimeout(() => {
      this.ddlAllColumns = this.getAllcolumns();
      this.ddlSortingOrder = this.getSortingOrder()
    }, 200);
  };
  setPageTitle() {
    this.commonMethodService.setTitle('Scheduling Facilities');
  }
  setGridSetting() {
    this.allMode = 'page';
    this.checkBoxesMode = 'always'
    this.showFilterRow = true;
    this.showHeaderFilter = false;
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately'
    }, {
      key: 'onClick',
      name: 'On Button Click'
    }];
    this.columnResizingMode = this.resizingModes[0];
    this.currentFilter = this.applyFilterTypes[0].key;
  }
  createGeneralInfoTabForm() {
    this.generalInfoForm = this.fb.group({
      facilityId: [''],
      facilityName: [''],
      parentCoName: [''],
      facilityParentId: [''],
      schedulingLevel: [''],
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
      lacounty: [''],
      overridePrice: [''],
      isActive: [''],
      doNotScheduleFacility: [''],
      facilityMile: [''],
      priceWeight: [''],
      latitude: [''],
      longitude: [''],
      previousFacilityName: [''],
      previousFacilityName1: [''],
      previousFacilityName2: [''],
    });
    this.generalInfoForm.disable();

    this.policyForm = this.fb.group({
      facilityPolicy: [''],
      parentpolicy: ['']
    });
  }
  createFacilityDetailTabForm() {
    this.facilityContactDetailForm = this.fb.group({
      itSupportContact: [''],
      itSupportEmail: [''],
      itSupportOfficePhone: [''],
      itSupportCellPhone: [''],
      itSupportHomePhone: [''],
      itSupportFax: [''],

      reportsContact: [''],
      reportsEmail: [''],
      reportsOfficePhone: [''],
      reportsCellPhone: [''],
      reportsHomePhone: [''],
      reportsFax: [''],

      statusCheckContact: [''],
      statusCheckEmail: [''],
      statusCheckOfficePhone: [''],
      statusCheckCellPhone: [''],
      statusCheckHomePhone: [''],
      statusCheckFax: [''],

      schedulingContact: [''],
      schedulingEmail: [''],
      schedulingOfficePhone: [''],
      schedulingCellPhone: [''],
      schedulingHomePhone: [''],
      schedulingFax: [''],

      imagesContact: [''],
      imagesEmail: [''],
      imagesOfficePhone: [''],
      imagesCellPhone: [''],
      imagesHomePhone: [''],
      imagesFax: [''],

      billingContact: [''],
      billingEmail: [''],
      billingOfficePhone: [''],
      billingCellPhone: [''],
      billingHomePhone: [''],
      billingFax: [''],
    });
    this.facilityContactDetailForm.disable();
  }

  onChange($event: any): void {

    //this.log += new Date() + "<br />";
  }

  onPaste($event: any): void {

    //this.log += new Date() + "<br />";
  }

  createParentCompanyTabForm() {
    this.facilityParentCompanyForm = this.fb.group({
      facilityParentName: [''],
      facilityParentId: [''],
      parentAddress: [''],
      parentCity: [''],
      parentState: [''],
      parentZip: [''],
      parentWebsite: [''],
      parentOwnerName: [''],
      parentOwnerPhone: [''],
      parentOwnerEmail: [''],
      parentOwnerFax: [''],
      parentManagerName: [''],
      parentManagerEmail: [''],
      parentManagerPhone: [''],
      parentManagerFax: [''],
      parentITName: [''],
      parentITEmail: [''],
      parentITPhone: [''],
      parentITFax: [''],
      parentBillingName: [''],
      parentBillingEmail: [''],
      parentBillingPhone: [''],
      parentBillingFax: [''],
    });
    this.facilityParentCompanyForm.disable();
  }
  createSchedulingDetailTabForm() {
    this.facilitySchedulingDetailForm = this.fb.group({
      ///// HOURS OF OPERATION
      sunOpenFrom: [''],
      sunOpenTo: [''],
      sunOpenFrom2: [''],
      sunOpenTo2: [''],
      monOpenFrom: [''],
      monOpenTo: [''],
      monOpenFrom2: [''],
      monOpenTo2: [''],
      tueOpenFrom: [''],
      tueOpenTo: [''],
      tueOpenFrom2: [''],
      tueOpenTo2: [''],
      wedOpenFrom: [''],
      wedOpenTo: [''],
      wedOpenFrom2: [''],
      wedOpenTo2: [''],
      thuOpenFrom: [''],
      thuOpenTo: [''],
      thuOpenFrom2: [''],
      thuOpenTo2: [''],
      friOpenFrom: [''],
      friOpenTo: [''],
      friOpenFrom2: [''],
      friOpenTo2: [''],
      satOpenFrom: [''],
      satOpenTo: [''],
      satOpenFrom2: [''],
      satOpenTo2: [''],

      ///////// Xray
      sunXrayFrom: [''],
      sunXrayTo: [''],
      sunXrayFrom2: [''],
      sunXrayTo2: [''],
      monXrayFrom: [''],
      monXrayTo: [''],
      monXrayFrom2: [''],
      monXrayTo2: [''],
      tueXrayFrom: [''],
      tueXrayTo: [''],
      tueXrayFrom2: [''],
      tueXrayTo2: [''],
      wedXrayFrom: [''],
      wedXrayTo: [''],
      wedXrayFrom2: [''],
      wedXrayTo2: [''],
      thuXrayFrom: [''],
      thuXrayTo: [''],
      thuXrayFrom2: [''],
      thuXrayTo2: [''],
      friXrayFrom: [''],
      friXrayTo: [''],
      friXrayFrom2: [''],
      friXrayTo2: [''],
      satXrayFrom: [''],
      satXrayTo: [''],
      satXrayFrom2: [''],
      satXrayTo2: [''],
      parking: [''],
      preArrivalTime: [''],
      xrayWalkIn: [''],

    });
    this.facilitySchedulingDetailForm.disable();
  }
  createModalityServiceTabForm() {
    this.modalityServiceForm = this.fb.group({
      mriservice: [''],
      ctservice: [''],
      xrayService: [''],
      arthrogramService: [''],
      boneDensityService: [''],
      mammographService: [''],
      nuclearMedicineService: [''],
      ultrasoundService: [''],
    });
    this.modalityServiceForm.disable();
  }
  createModalityMriTabForm() {
    this.modalityMriForm = this.fb.group({
      mri1type: [''],
      mri1strength: [''],
      mri1make: [''],
      mri1weight: [''],
      mri1contrast: [''],
      mri1sedation: [''],
      mri1breast: [''],
      mri2type: [''],
      mri2strength: [''],
      mri2make: [''],
      mri2weight: [''],
      mri2contrast: [''],
      mri2sedation: [''],
      mri2breast: [''],
      mri3type: [''],
      mri3strength: [''],
      mri3make: [''],
      mri3weight: [''],
      mri3contrast: [''],
      mri3sedation: [''],
      mri3breast: [''],
      mrinotes: [''],
      mriwFlexandEXT: [''],
      mrI2WFlexandEXT: [''],
      mrI3WFlexandEXT: [''],
    });
    this.modalityMriForm.disable();
  }
  createModalityCtTabForm() {
    this.modalityCtForm = this.fb.group({
      ct1make: [''],
      ct1slices: [''],
      ct1weight: [''],
      ct1contrast: [''],
      ct1sedation: [''],
      ct1breast: [''],

      ct2make: [''],
      ct2slices: [''],
      ct2weight: [''],
      ct2contrast: [''],
      ct2sedation: [''],
      ct2breast: [''],

      ct3make: [''],
      ct3slices: [''],
      ct3weight: [''],
      ct3contrast: [''],
      ct3sedation: [''],
      ct3breast: [''],
      ctnotes: [''],
    });
    this.modalityCtForm.disable();
  }
  createModalityExceptionsTabForm() {
    this.modalityExceptionsForm = this.fb.group({
      mriexception: [''],
      mriexceptionDescription: [''],


      ctexception: [''],
      ctexceptionDescription: [''],


      xrexception: [''],
      xrexceptionDescription: [''],


      arthoException: [''],
      arthoExceptionDescription: [''],


      bnexception: [''],
      bnexceptionDescription: [''],


      mammoException: [''],
      mammoExceptionDescription: [''],
      mammoExpires: [''],

      nmexception: [''],
      nmexceptionDescription: [''],


      psexception: [''],
      psexceptionDescription: [''],

      usexception: [''],
      usexceptionDescription: [''],
    });
    this.modalityExceptionsForm.disable();
  }
  getFacilityList() {
    this.facilityList = [];
    this.facilityService.getActiveFacilityList(true).subscribe((res) => {
      if (res.response != null) {
        this.facilityList = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getFacilityParentList() {
    this.facilityParentList = [];
    this.facilityService.getFacilityParentNames(true).subscribe((res) => {
      if (res.response != null) {
        this.facilityParentList = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getModalityList() {
    this.modalityList = [];
    this.facilityService.getMasterModalities(true).subscribe((res) => {
      if (res.response != null) {
        this.modalityList = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getFinancialTypeList() {

    this.financialTypeList = [];
    this.facilityService.getFinancialTypes(true).subscribe((res) => {
      if (res.response != null) {
        this.financialTypeList = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getBrokerList() {
    this.brokerList = [];
    this.facilityService.getBrokerNames(true).subscribe((res) => {
      if (res.response != null) {
        this.brokerList = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  getAllSchedulingFacility(filterBody: any) {

    this.facilityService.getSchedulingFacilityData(true, filterBody, this.pageNumber, this.pageSize).subscribe((res) => {
      this.schedulingFacilityList = [];
      if (res.response != null) {
        this.totalSchedulingFacility = res.totalRecords;
        this.schedulingFacilityList = res.response;
      }
      else {
        this.schedulingFacilityList = [];
        this.totalSchedulingFacility = 1;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  unSuccessNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Something went wrong.',
      alertMessage: '',
      alertType: data.responseCode
    });
  }

  getSchedulingFacilityDetail(row: any) {

    this.facilityId = row.data.facilityID
    if (this.facilityId) {
      this.getFacilityDetail()
    }
  }
  getFacilityDetail() {

    let body = this.getApplyFilter(true, this.facilityId.toString(), 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', this.ddlCurrentSelectedColumnValue, this.ddlSelectedSortingOrderValue);
    this.facilityService.getSchedulingFacilityData(true, body, 1, 1).subscribe((res) => {
      if (res.response != null) {
        let facilityDetail = res.response[0];
        this.facilityPolicy = res.response[0].facilityPolicy ? res.response[0].facilityPolicy : '';
        this.parentPolicy = res.response[0].parentPolicy ? res.response[0].parentPolicy : '';
        this.setGeneralInfoTabForm(facilityDetail);
        this.setFacilityContactDetailTabForm(facilityDetail);
        this.setParentCompanyTabForm(facilityDetail);
        this.setModalityServiceTabForm(facilityDetail);
        this.setModalityMriTabForm(facilityDetail);
        this.setModalityCtTabForm(facilityDetail);
        this.setModalityExceptionsTabForm(facilityDetail);
        this.getSchedulingFacilityPricing();
        this.getAllFacilityNotesByFacililityId();
        this.setSchedulingDetailTabForm(facilityDetail);
      }
      else if (res.responseCode == 400) {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });

  }
  getSchedulingFacilityPricing() {

    this.schedulingPricing = [];
    this.facilityService.getSchedulingFacilityPricing(true, this.facilityId.toString()).subscribe((res) => {
      if (res.response != null) {
        this.schedulingPricing = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getAllFacilityNotesByFacililityId() {
    this.facilityService.getAllFacilityNotesByFacililityId(true, this.facilityId).subscribe((res) => {

      if (res.response != null) {
        this.facilityNotesList = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  setSchedulingDetailTabForm(data: any) {

    this.facilitySchedulingDetailForm.patchValue({
      sunOpenFrom: data.sunOpenFrom,
      sunOpenTo: data.sunOpenTo,
      sunOpenFrom2: data.sunOpenFrom2,
      sunOpenTo2: data.sunOpenTo2,
      monOpenFrom: data.monOpenFrom,
      monOpenTo: data.monOpenTo,
      monOpenFrom2: data.monOpenFrom2,
      monOpenTo2: data.monOpenTo2,
      tueOpenFrom: data.tueOpenFrom,
      tueOpenTo: data.tueOpenTo,
      tueOpenFrom2: data.tueOpenFrom2,
      tueOpenTo2: data.tueOpenTo2,
      wedOpenFrom: data.wedOpenFrom,
      wedOpenTo: data.wedOpenTo,
      wedOpenFrom2: data.wedOpenFrom2,
      wedOpenTo2: data.wedOpenTo2,
      thuOpenFrom: data.thuOpenFrom,
      thuOpenTo: data.thuOpenTo,
      thuOpenFrom2: data.thuOpenFrom2,
      thuOpenTo2: data.thuOpenTo2,
      friOpenFrom: data.friOpenFrom,
      friOpenTo: data.friOpenTo,
      friOpenFrom2: data.friOpenFrom2,
      friOpenTo2: data.friOpenTo2,
      satOpenFrom: data.satOpenFrom,
      satOpenTo: data.satOpenTo,
      satOpenFrom2: data.satOpenFrom2,
      satOpenTo2: data.satOpenTo2,


      sunXrayFrom: data.sunXrayFrom,
      sunXrayTo: data.sunXrayTo,
      sunXrayFrom2: data.sunXrayFrom2,
      sunXrayTo2: data.sunXrayTo2,
      monXrayFrom: data.monXrayFrom,
      monXrayTo: data.monXrayTo,
      monXrayFrom2: data.monXrayFrom2,
      monXrayTo2: data.monXrayTo2,
      tueXrayFrom: data.tueXrayFrom,
      tueXrayTo: data.tueXrayTo,
      tueXrayFrom2: data.tueXrayFrom2,
      tueXrayTo2: data.tueXrayTo2,
      wedXrayFrom: data.wedXrayFrom,
      wedXrayTo: data.wedXrayTo,
      wedXrayFrom2: data.wedXrayFrom2,
      wedXrayTo2: data.wedXrayTo2,
      thuXrayFrom: data.thuXrayFrom,
      thuXrayTo: data.thuXrayTo,
      thuXrayFrom2: data.thuXrayFrom2,
      thuXrayTo2: data.thuXrayTo2,
      friXrayFrom: data.friXrayFrom,
      friXrayTo: data.friXrayTo,
      friXrayFrom2: data.friXrayFrom2,
      friXrayTo2: data.friXrayTo2,
      satXrayFrom: data.satXrayFrom,
      satXrayTo: data.satXrayTo,
      satXrayFrom2: data.satXrayFrom2,
      satXrayTo2: data.satXrayTo2,
      parking: data.parking,
      preArrivalTime: data.preArrivalTime,
      xrayWalkIn: data.xrayWalkIn,

    });
  }
  setGeneralInfoTabForm(data: any) {
    this.parentFacilityDropDownModel = data.parentCoName;
    this.facilityName = data.facilityName;
    this.generalInfoForm.patchValue({
      facilityId: data.facilityID,
      facilityName: data.facilityName,
      parentCoName: data.parentCoName,
      facilityParentId: data.facilityParentID,
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip,
      lacounty: data.lacounty,
      overridePrice: data.overridePrice,
      isActive: data.isActive,
      doNotScheduleFacility: data.doNotScheduleFacility,
      facilityMile: data.facilityMile,
      priceWeight: data.priceWeight,
      latitude: data.latitude,
      longitude: data.longitude,
      previousFacilityName: data.previousFacilityName,
      previousFacilityName1: data.previousFacilityName1,
      previousFacilityName2: data.previousFacilityName2
    });
  }
  setFacilityContactDetailTabForm(data: any) {
    this.facilityContactDetailForm.patchValue({
      itSupportContact: data.itSupportContact,
      itSupportEmail: data.itSupportEmail,
      itSupportOfficePhone: data.itSupportOfficePhone,
      itSupportCellPhone: data.itSupportCellPhone,
      itSupportHomePhone: data.itSupportHomePhone,
      itSupportFax: data.itSupportFax,

      reportsContact: data.reportsContact,
      reportsEmail: data.reportsEmail,
      reportsOfficePhone: data.reportsOfficePhone,
      reportsCellPhone: data.reportsCellPhone,
      reportsHomePhone: data.reportsHomePhone,
      reportsFax: data.reportsFax,

      statusCheckContact: data.statusCheckContact,
      statusCheckEmail: data.statusCheckEmail,
      statusCheckOfficePhone: data.statusCheckOfficePhone,
      statusCheckCellPhone: data.statusCheckCellPhone,
      statusCheckHomePhone: data.statusCheckHomePhone,
      statusCheckFax: data.statusCheckFax,

      schedulingContact: data.schedulingContact,
      schedulingEmail: data.schedulingEmail,
      schedulingOfficePhone: data.schedulingOfficePhone,
      schedulingCellPhone: data.schedulingCellPhone,
      schedulingHomePhone: data.schedulingHomePhone,
      schedulingFax: data.schedulingFax,

      imagesContact: data.imagesContact,
      imagesEmail: data.imagesEmail,
      imagesOfficePhone: data.imagesOfficePhone,
      imagesCellPhone: data.imagesCellPhone,
      imagesHomePhone: data.imagesHomePhone,
      imagesFax: data.imagesFax,

      billingContact: data.billingContact,
      billingEmail: data.billingEmail,
      billingOfficePhone: data.billingOfficePhone,
      billingCellPhone: data.billingCellPhone,
      billingHomePhone: data.billingHomePhone,
      billingFax: data.billingFax,
    });
  }

  setParentCompanyTabForm(data: any) {
    this.facilityParentCompanyForm.patchValue({
      facilityParentName: data.facilityParentName,
      facilityParentId: data.facilityParentID,
      parentAddress: data.parentAddress,
      parentCity: data.parentCity,
      parentState: data.parentState,
      parentZip: data.parentZip,
      parentWebsite: data.parentWebsite,
      parentOwnerName: data.parentOwnerName,
      parentOwnerPhone: data.parentOwnerPhone,
      parentOwnerEmail: data.parentOwnerEmail,
      parentOwnerFax: data.parentOwnerFax,
      parentManagerName: data.parentManagerName,
      parentManagerEmail: data.parentManagerEmail,
      parentManagerPhone: data.parentManagerPhone,
      parentManagerFax: data.parentManagerFax,
      parentITName: data.parentITName,
      parentITEmail: data.parentITEmail,
      parentITPhone: data.parentITPhone,
      parentITFax: data.parentITFax,
      parentBillingName: data.parentBillingName,
      parentBillingEmail: data.parentBillingEmail,
      parentBillingPhone: data.parentBillingPhone,
      parentBillingFax: data.parentBillingFax,
    });
  }
  setModalityServiceTabForm(data: any) {
    this.modalityServiceForm.patchValue({
      mriservice: data.mriservice,
      ctservice: data.ctservice,
      xrayService: data.xrayService,
      arthrogramService: data.arthrogramService,
      boneDensityService: data.boneDensityService,
      mammographService: data.mammographService,
      nuclearMedicineService: data.nuclearMedicineService,
      ultrasoundService: data.ultrasoundService,
    });
  }
  setModalityMriTabForm(data: any) {
    this.modalityMriForm.patchValue({
      mri1type: data.mri1type,
      mri1strength: data.mri1strength,
      mri1make: data.mri1make,
      mri1weight: data.mri1weight,
      mri1contrast: data.mri1contrast,
      mri1sedation: data.mri1sedation,
      mri1breast: data.mri1breast,
      mri2type: data.mri2type,
      mri2strength: data.mri2strength,
      mri2make: data.mri2make,
      mri2weight: data.mri2weight,
      mri2contrast: data.mri2contrast,
      mri2sedation: data.mri2sedation,
      mri2breast: data.mri2breast,
      mri3type: data.mri3type,
      mri3strength: data.mri3strength,
      mri3make: data.mri3make,
      mri3weight: data.mri3weight,
      mri3contrast: data.mri3contrast,
      mri3sedation: data.mri3sedation,
      mri3breast: data.mri3breast,
      mriwFlexandEXT: data.mriwFlexandEXT,
      mrI2WFlexandEXT: data.mrI2WFlexandEXT,
      mrI3WFlexandEXT: data.mrI3WFlexandEXT,
      mrinotes: data.mriNotes,
    });
  }
  setModalityCtTabForm(data: any) {
    this.modalityCtForm.patchValue({
      ct1make: data.ct1make,
      ct1slices: data.ct1slices,
      ct1weight: data.ct1weight,
      ct1contrast: data.ct1contrast,
      ct1sedation: data.ct1sedation,
      ct1breast: data.ct1breast,
      ct2make: data.ct2make,
      ct2slices: data.ct2slices,
      ct2weight: data.ct2weight,
      ct2contrast: data.ct2contrast,
      ct2sedation: data.ct2sedation,
      ct2breast: data.ct2breast,
      ct3make: data.ct3make,
      ct3slices: data.ct3slices,
      ct3weight: data.ct3weight,
      ct3contrast: data.ct3contrast,
      ct3sedation: data.ct3sedation,
      ct3breast: data.ct3breast,
      ctnotes: data.ctNotes
    });
  }
  setModalityExceptionsTabForm(data: any) {
    this.modalityExceptionsForm.patchValue({
      mriexception: data.mriexception,
      mriexceptionDescription: data.mriexceptionDescription,
      ctexception: data.ctexception,
      ctexceptionDescription: data.ctexceptionDescription,
      xrexception: data.xrexception,
      xrexceptionDescription: data.xrexceptionDescription,
      arthoException: data.arthoException,
      arthoExceptionDescription: data.arthoExceptionDescription,
      bnexception: data.bnexception,
      bnexceptionDescription: data.bnexceptionDescription,
      mammoException: data.mammoException,
      mammoExceptionDescription: data.mammoExceptionDescription,
      nmexception: data.nmexception,
      nmexceptionDescription: data.nmexceptionDescription,
      psexception: data.psexception,
      psexceptionDescription: data.psexceptionDescription,
      usexception: data.usexception,
      usexceptionDescription: data.usexceptionDescription,
    });
  }
  filterFacility(modalityArray: any) {

    let isMriContain = modalityArray.map(x => x.ModalityName).toString().toLocaleLowerCase().includes('mri');
    let isCtContain = modalityArray.map(x => x.ModalityName).toString().toLocaleLowerCase().includes('ct');
    let isXrayContain = modalityArray.map(x => x.ModalityName).toString().toLocaleLowerCase().includes('xray');
    if (isMriContain) {
      this.isMriDropDownDisabled = false;
    }
    else {
      this.isMriDropDownDisabled = true;
    }
    if (isCtContain) {
      this.isCtDropDownDisabled = false;
    }
    else {
      this.isCtDropDownDisabled = true;
    }
    if (isXrayContain) {
      this.isXrayDropDownDisabled = false;
    }
    else {
      this.isXrayDropDownDisabled = true;
    }
  }
  onPageSizeChange(pageSize: any) {
    this.pageSize = pageSize
    this.pageNumber = 1
    this.getAllSchedulingFacility(this.filterBody);
  }
  onPageNoChange(pageNumber: any) {
    this.pageNumber = pageNumber
    this.getAllSchedulingFacility(this.filterBody);
  }
  clearApplyFilter() {
    this.selectedParentFacility = null;
    this.selectedHours = null;
    this.selectedBroker = null
    this.selectedModality = null;
    this.selectedFacility = null;
    this.selectedFinancialType = '';
    this.selectedMriType = null;
    this.selectedMriStrength = null;
    this.selectedMriMake = null;
    this.selectedMriWeight = null;
    this.selectedMriContrast = null;
    this.selectedMriSedation = null;
    this.selectedMriBreast = null;
    this.selectedCtMake = null;
    this.selectedCtSlices = null;
    this.selectedCtWeight = null;
    this.selectedCtContrast = null;
    this.selectedCtSedation = null;
    this.selectedCtBreast = null;
    this.selectedXrayWalkIn = null;
    this.selectedXrayHours = null;
    this.workZipModel = null;
    this.homeZipModel = null;
    this.filterBody = this.getApplyFilter(true, '', 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', this.ddlCurrentSelectedColumnValue, this.ddlSelectedSortingOrderValue);
    this.getAllSchedulingFacility(this.filterBody);
  }
  applyFilter() {

    let selectedFacility = this.selectedFacility ? this.selectedFacility.toString() : '';
    let selectedParentFacility = this.selectedParentFacility ? this.selectedParentFacility.toString() : '';
    let selectedXrayWalkIn = this.selectedXrayWalkIn ? this.selectedXrayWalkIn.toString() : '';
    let selectedFinancialType = this.selectedFinancialType ? this.selectedFinancialType.toString() : '';
    let selectedModality = this.selectedModality ? this.selectedModality.toString() : '';
    let selectedHours = this.selectedHours ? this.selectedHours.toString() : '';
    let selectedXrayHours = this.selectedXrayHours ? this.selectedXrayHours.toString() : '';
    let selectedMriType = this.selectedMriType ? this.selectedMriType.toString() : '';
    let selectedMriStrength = this.selectedMriStrength ? this.selectedMriStrength.toString() : '';
    let selectedMriMake = this.selectedMriMake ? this.selectedMriMake.toString() : '';
    let selectedMriWeight = this.selectedMriWeight ? this.selectedMriWeight.toString() : '';
    let selectedMriContrast = this.selectedMriContrast ? this.selectedMriContrast.toString() : '';
    let selectedMriSedation = this.selectedMriSedation ? this.selectedMriSedation.toString() : '';
    let selectedMriBreast = this.selectedMriBreast ? this.selectedMriBreast.toString() : '';
    let selectedCtSlices = this.selectedCtSlices ? this.selectedCtSlices.toString() : '';
    let selectedCtMake = this.selectedCtMake ? this.selectedCtMake.toString() : '';
    let selectedCtWeight = this.selectedCtWeight ? this.selectedCtWeight.toString() : '';
    let selectedCtContrast = this.selectedCtContrast ? this.selectedCtContrast.toString() : '';
    let selectedCtSedation = this.selectedCtSedation ? this.selectedCtSedation.toString() : '';
    let selectedCtBreast = this.selectedCtBreast ? this.selectedCtBreast.toString() : '';
    let workZipModel = this.workZipModel ? this.workZipModel.toString() : '';
    let homeZipModel = this.homeZipModel ? this.homeZipModel.toString() : '';

    this.filterBody = this.getApplyFilter(true, '', null, selectedFacility, selectedParentFacility, selectedXrayWalkIn,
      selectedFinancialType, selectedModality, selectedHours, selectedXrayHours, selectedMriType, selectedMriStrength,
      selectedMriMake, selectedMriWeight, selectedMriContrast, selectedMriSedation, selectedMriBreast, selectedCtSlices,
      selectedCtMake, selectedCtWeight, selectedCtContrast, selectedCtSedation, selectedCtBreast, workZipModel, homeZipModel, this.ddlCurrentSelectedColumnValue, this.ddlSelectedSortingOrderValue);
    this.getAllSchedulingFacility(this.filterBody);
  }

  getApplyFilter(isActive: boolean, facilityId: any, brokerId: any, facilityName: any, parentCompanyName: any,
    xraywalikIn: any, financialType: any, modality: any, daysOfWeek: any, xrayWeek: any, mriType: any, mriStrength: any,
    mriMake: any, mriWeight: any, mriContrast: any, mriSedation: any, mriBreast: any,
    ctSlices: any, ctMake: any, ctWeight: any, ctContrast: any,
    ctSedation: any, ctBreast: any, workZip: any, homeZip: any, sortingColumn: any, sortingOrder: any): any {
    return {
      'isActive': isActive, 'facilityId': facilityId.toString(), 'brokerId': this.selectedBroker, 'facilityName': facilityName,
      'parentCompanyName': parentCompanyName, 'xraywalikIn': xraywalikIn, 'financialType': financialType,
      'modality': modality, 'daysOfWeek': daysOfWeek, 'xrayWeek': xrayWeek,
      'mriType': mriType, 'mriStrength': mriStrength, 'mriMake': mriMake, 'mriWeight': mriWeight, 'mriContrast': mriContrast,
      'mriSedation': mriSedation, 'mriBreast': mriBreast, 'ctSlices': ctSlices,
      'ctMake': ctMake, 'ctWeight': ctWeight, 'ctContrast': ctContrast,
      'ctSedation': ctSedation, 'ctBreast': ctBreast, 'workZip': workZip, 'homeZip': homeZip, 'sortingColumn': sortingColumn, 'sortingOrder': sortingOrder
    }
  }
  calculateCellValueForPhoneNumber(row: any) {

    if (row.schedulingFax != null) {
      let phoneNumber = row.schedulingFax.match(/(\d{3})(\d{3})(\d{4})/);
      return phoneNumber[1] + '-' + phoneNumber[2] + '-' + phoneNumber[3];
    }

  }

  copyToClipboard(data: any) {
    var text = `${(data.street ? data.street : '')}, ${(data.city ? data.city : '')}, ${(data.state ? data.state : '')}, ${(data.zip ? data.zip : '')}`;
    this._clipboardService.copy(text);
    this.notificationService.showToaster({
      alertHeader: '',
      alertMessage: text,
      alertType: null
    });
  }

  onEditorPreparing(e: any) {

  }
  get refmodalityCtFormForm() { return this.modalityCtForm.controls; }
  get refmodalityMriForm() { return this.modalityMriForm.controls; }
  get getpolicyForm() { return this.policyForm.controls; }

  ValidateMultiSelectTextLength(id, a) {
    a = this.commonMethodService.ValidateMultiSelectTextLength(id, a);
    return a;
  }

  getSortingOrder() {
    return [
      { value: 'asc', Text: 'Ascending' },
      { value: 'desc', Text: 'Descending' }]
  }
  onChangeSelectedColumn(index) {
    this.ddlCurrentSelectedColumnValue = index.value;
    this.ddlCurrentSelectedColumnText = index.Text;
    this.applyFilter()
  }
  onChangeSortingOrder(index) {
    this.ddlSelectedSortingOrderValue = index.value;
    this.ddlSelectedSortingOrderText = index.Text;
    this.applyFilter()
  }
  getAllcolumns() {
    return [
      { value: 'Facility Name', Text: 'Facility Name' },
      { value: 'City', Text: 'City' },
      { value: 'State', Text: 'State' },
      { value: 'Zip', Text: 'Zip' },
      { value: 'Home Distance', Text: 'Home Distance' },
      { value: 'Work Distance', Text: 'Work Distance' },
      { value: 'Home Score', Text: 'Home Score' },
      { value: 'Work Score', Text: 'Work Score' },
    ];
  }

  nameChanged(arg: any, type: any) {
    if(!arg)
    {
      this.homeZipModel=type=='HomeZip'?'':this.homeZipModel;
      this.workZipModel=type=='WorkZip'?'':this.workZipModel;
    }
    if ((type == 'HomeZip' && arg) || this.homeZipModel ) {
      this.ddlCurrentSelectedColumnText = 'Home Score'
      this.ddlCurrentSelectedColumnValue = 'Home Score'
    }
    else if ((type == 'WorkZip' && arg) || (this.workZipModel && type == 'HomeZip')) {
      this.ddlCurrentSelectedColumnText = 'Work Score'
      this.ddlCurrentSelectedColumnValue = 'Work Score'
    } 
    else {
      this.ddlCurrentSelectedColumnText = 'Facility Name'
      this.ddlCurrentSelectedColumnValue = 'Facility Name'
    }
  }
}
