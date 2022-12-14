import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import DataGrid from 'devextreme/ui/data_grid';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { ckeConfig } from 'src/app/constants/Ckeditor';
import { CommonRegex } from 'src/app/constants/commonregex';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { BlockLeaseSchedulerService } from 'src/app/services/block-lease-scheduler-service/block-lease-scheduler.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PayInvoiceModalComponent } from './pay-invoice-modal/pay-invoice-modal.component';
import { environment } from '../../../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';

declare const $: any;

@Component({
  selector: 'app-schd-facilities',
  templateUrl: './schd-facilities.component.html',
  styleUrls: ['./schd-facilities.component.css'],
  providers: [DatePipe],
})
export class SchdFacilitiesComponent implements OnInit {
  @ViewChild('hiddenDeleteTagPopUpButton', { static: false })
  hiddenDeleteTagPopUpButton: ElementRef;
  @ViewChild('hiddenAddEditPopUpItem', { read: ElementRef })
  hiddenAddEditPopUpItem: ElementRef;
  @ViewChild('hiddenConfirmationLeaseBtn', { static: false })
  hiddenConfirmationLeaseBtn: ElementRef;
  @ViewChild('hiddenViewFile', { read: ElementRef }) hiddenViewFile: ElementRef;
  @ViewChild('hiddenDeleteUnusedCreditLink', { read: ElementRef }) hiddenDeleteUnusedCreditLink: ElementRef;
  @Input() isGridDisplay: boolean = true; 
   a1:any=20;
   generalInfoForm: FormGroup;
   displayStyle :any;
  facilityContactDetailForm: FormGroup;
  disableCheckbox:any
  modalityServiceForm: FormGroup;
  modalityMriForm: FormGroup;
  modalityCtForm: FormGroup;
  modalityExceptionsForm: FormGroup;
  facilitySchedulingDetailForm: FormGroup;
  facilityNotesForm: FormGroup;
  facilityPoliciesForm: FormGroup;
  facilityParentCompanyForm: FormGroup;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  facilityIntakeForm: FormGroup;
  facilityTagForm: FormGroup;
  schedulingPricing: any = [];
  public facilityPolicy: string = '' //// For Policies Tab
  public parentPolicy: string = '' ////  For Policies Tab
  searchText: string;
  facilityParentList: any[] = [];
  selectedCreditPayment: any = []; selectedLeasePayment: any = [];
  userType: number;
  facilityList: any = [];
  facilityDetail: any = [];
  facilityNotesList = [];
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  allMode: string;
  checkBoxesMode: string;
  selectedItemKeys: any[] = [];
  eventBlockLeasePricingData: any[] = [];
  facilityName: string = '';
  facilityNoteList: any = [];
  facilityId: number;
  isNoteRequired: boolean = false;
  isTagRequired: boolean = false;
  isIntakeEmailVisible: boolean = false;
  isIntakeFaxVisible: boolean = false;
  isIntakeScreeningAndWaiverVisible: boolean = false;
  facilityTagList: any = [];
  TagList: any = [];
  EpicUserList: any = [];
  ResourceNameList: any = [];
  selectedEpicUserList: any = [];
  noteBtnDisabled: boolean = true;
  tagBtnDisabled: boolean = true;
  schedulingFacilityLevelList: any = [];
  facilityParentCompanyList: any = [];
  parentDropDownModel: string = '';
  facilityPricingList: any = [];
  blockLeasePricingList: any = [];
  blockLeaseAgreementMRIList: any = [];
  fullblockLeaseAgreementMRIList: any = [];
  blockLeaseAgreementCTList: any = [];
  fullblockLeaseAgreementCTList: any = [];
  CreditDebitList: any = [];
  UnusedCreditsList: any = [];
  GetUnpaidLeasesList: any = [];
  pageSizeOfUnusdCredits: number = 20;
  pageSizeOfUnpaidLeases: number = 20;
  pageNumberOfUnpaidLeases: number = 1;
  pageNumberOfUnusedCredits: number = 1;
  facilityPricingHistoryList: any = [];
  updatedResourceName: any = [];
  submitted: boolean = false;
  modalValue: string = 'modal';
  isPopUpInEditMode: boolean = false;
  isApplyAndOkBtnVisisble: boolean = true;
  isInsertBtnVisisble: boolean = false;
  gridSelectedRows: [] = [];
  defaultPopupTab: string = 'General Info';
  isShowColumnWithNoData = true;
  deleteTagId: number;
  tagNameList = [];
  totalRecords: number = 1;
  totalRecordUnpaidLeases: number = 1;
  totalRecordBlockLeaseCredits: number = 1;
  totalRecordunUsedCredits: number = 1;
  pageNumber: number = 1;
  pageSize: number;
  MRIPageNumber: number = 1;
  MRIpageSize: number = 20;
  totalrecordsFull_MRI: number = 1;
  totalrecordsFull_CT: number = 1;
  submiited: boolean = false;
  fileData: SafeResourceUrl;
  numberPattern: any = /^\d{0,4}(\.\d{1,2})?$/;
  sendDataDocManager: any;
  allowUpdatingPrice: boolean = false;
  name = 'ng2-ckeditor';
  //ckeConfig: CKEDITOR.config;
  ckeConfig: any;
  ckConfig: any;
  mycontent: string;
  log: string = '';
  btnActive: number = 0;
  leaseIdArray: any = [];
  creditIdArray: any = [];
  apiUrl: any;
  deleteUnusedCreditDetail: any;

  ConfirmationLeaseCheckedFrom: string = '';
  readonly pageSizeArray = PageSizeArray;
  readonly CkeConfig = ckeConfig;
  blockLeasePaymentList: any = [];
  blockLeasePaymentMappingList: any;
  blockLeaseCreditList: [] = [];
  paymentMapping: any = [];
  pageNumberOfPaid: number = 1;
  pageSizeOfPaid: number = 20;
  totalRecordpaid: number = 1;
  selectedleaseArray: any = [];  selectedRows: any = [];
  readonly commonRegex=CommonRegex;

  //   config = {
  //     uiColor: '#ffffff',
  //     toolbarGroups: [{ name: 'clipboard', groups: ['clipboard', 'undo'] },
  //     { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
  //     { name: 'links' }, { name: 'insert' },
  //     { name: 'document', groups: ['mode', 'document', 'doctools'] },
  //     { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
  //     { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align'] },
  //     { name: 'styles' },
  //     { name: 'colors' }],
  //     skin: 'kama',
  //     resize_enabled: false,
  //     removePlugins: 'elementspath,save,magicline',
  //     extraPlugins: 'divarea,smiley,justify,indentblock,colordialog',
  //     colorButton_foreStyle: {
  //        element: 'font',
  //        attributes: { 'color': '#(color)' }
  //     },
  //     height: 188,
  //     removeDialogTabs: 'image:advanced;link:advanced',
  //     removeButtons: 'Subscript,Superscript,Anchor,Source,Table',
  //     format_tags: 'p;h1;h2;h3;pre;div'
  //  }
  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private readonly facilityService: FacilityService,
    private notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService,
    private readonly blockleasescheduler: BlockLeaseSchedulerService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private readonly storageService: StorageService,
  ) {
    this.commonMethodService.setTitle('Scheduling Facility');

    facilityService.sendDataToFacilityDetail.subscribe(res => {
      if (res) {
        this.isGridDisplay = false;
        if (res.facilityId) {
          this.getFacilityDetail(res.facilityId);
          this.defaultPopupTab = res.type;
        }
      }
    });
    facilityService.sendDataToschdFacilities.subscribe((res) => {
      if (res.FacilityID) {
        this.isGridDisplay = false;
        this.getFacilityDetail(res.FacilityID);
        if (res.isShowSchedulingTab) {
          this.defaultPopupTab = 'Scheduling Details';
        }
        this.hiddenAddEditPopUpItem.nativeElement.click();
      }
    });
  }

  ngOnInit(): void {
    this.pageSize =
      this.pageSizeArray.filter((x) => x.IsSelected).length > 0
        ? this.pageSizeArray.filter((x) => x.IsSelected)[0].value
        : this.pageSizeArray[0].value;
    this.getActiveEpicUsers();
    this.getAllTagList();
    this.getSchedulingFacilityLevel();
    this.getFacilityParentNames();
    this.setGridSetting();
    this.createGeneralInfoTabForm();
    this.createFacilityDetailTabForm();
    this.createModalityServiceTabForm();
    this.createModalityMriTabForm();
    this.createModalityCtTabForm();
    this.createModalityExceptionsTabForm();
    this.createSchedulingDetailTabForm();
    this.createNotesTabForm();
    this.createParentCompanyTabForm();
    this.createIntakeTabForm();
    this.createTagForm();
    this.createGeneralPoliciesForm();
    this.getFacilityParentList();

    // this.ckeConfig = {
    //   allowedContent: false,
    //   extraPlugins: 'divarea',
    //   forcePasteAsPlainText: true,
    //   removePlugins : 'blockquote'
    //   };

    this.ckConfig = {
      allowedContent: false,
      forcePasteAsPlainText: true,
      readOnly: true,
      removePlugins:
        'elementspath,blockquote,preview,save,print,newpage,templates,find,replace,SpellChecker,scayt,flash,smiley,about',
      removeButtons:
        'Checkbox,Radio,Form,TextField,Textarea,Select,Button,ImageButton,HiddenField,PageBreak,SpecialChar,HorizontalRule,SpellChecker, Scayt',
    };

    let lastSearchBody = {
      searchText: '',
      isActive: 0,
      tabName: 'Schd. Facilities',
      userId: this.storageService.user.UserId,
      clear: 2,
    };
    this.getFacilityLastFilterRecord(lastSearchBody);

    this.facilityService.filterResult.subscribe((res: any) => {
      this.searchText = res.searchText;
      this.userType = parseInt(res.userTypeText);
      this.pageNumber = 1;
      this.pageSize =
        this.pageSizeArray.filter((x) => x.IsSelected).length > 0
          ? this.pageSizeArray.filter((x) => x.IsSelected)[0].value
          : this.pageSizeArray[0].value;
      let lastSearchBody = {
        searchText: this.searchText,
        isActive: this.userType,
        tabName: 'Schd. Facilities',
        userId: this.storageService.user.UserId,
        clear: 0,
      };
      this.getFacilityLastFilterRecord(lastSearchBody);
    });
    this.facilityService.clearClickedEvent.subscribe((res: string) => {
      if (res === 'clearFilter') {
        this.searchText = '';
        this.userType = 1;
        let lastSearchBody = {
          searchText: '',
          isActive: 1,
          tabName: 'Schd. Facilities',
          userId: this.storageService.user.UserId,
          clear: 1,
        };
        this.getFacilityLastFilterRecord(lastSearchBody);
      }
    });
    this.facilityService.actionDropDown.subscribe((actionValue: any) => {
      if (
        actionValue ==
        this.facilityService.actionDropDownEnum.ExportFacilitiesToExcel
      ) {
        this.onExporting();
      } else if (
        actionValue == this.facilityService.actionDropDownEnum.DuplicateFacility
      ) {
        this.createDuplicateFacility();
      }
    });
  }
  onChange($event: any): void {
    console.log('onChange');
    //this.log += new Date() + "<br />";
  }

  onPaste($event: any): void {
    console.log('onPaste');
    //this.log += new Date() + "<br />";
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getSchedulingFacilities();
  }
  get3pLeaseFacilityData(path: any, fileData: any) {
    this.apiUrl = `${environment.baseUrl}/v${environment.currentVersion}/`;

    fileData = this.apiUrl + 'BlockLeaseScheduler/OpenAgreement?path=' + path;
    this.fileData = this.sanitizer.bypassSecurityTrustResourceUrl(fileData);
    this.hiddenViewFile.nativeElement.click();
  }
  closePDF()
  {
  //  debugger
  //  $('#viewFile_Doc').hide();
  }
  getActiveEpicUsers() {
    this.EpicUserList = [];
    this.facilityService.getActiveEpicUsers(true).subscribe(
      (userRes) => {
        if (userRes.response !== null) {
          this.EpicUserList = userRes.response;
        }
      },
      (err: any) => {
        this.errorNotification(err);
      }
    );
  }
  getAllTagList() {
    //Id:0, facilityId:11, recorceId, modality, modalityType:
    this.facilityService.getAllTagList(true).subscribe(
      (TagRes) => {
        if (TagRes.response !== null) {
          this.TagList = TagRes.response;
          this.tagNameList = [
            ...new Set(this.TagList.map((item) => item.tagName.toUpperCase())),
          ];
        }
      },
      (err: any) => {
        this.errorNotification(err);
      }
    );
  }
  getSchedulingFacilityLevel() {
    this.schedulingFacilityLevelList = [];
    this.facilityService.getSchedulingFacilityLevel(true).subscribe(
      (res) => {
        if (res.response != null) {
          this.schedulingFacilityLevelList = res.response;
        }
      },
      (err: any) => {
        this.errorNotification(err);
      }
    );
  }
  getFacilityParentNames() {
    this.facilityParentCompanyList = [];
    this.facilityService.getFacilityParentNames(true).subscribe(
      (res) => {
        if (res.response != null) {
          this.facilityParentCompanyList = res.response;
        }
      },
      (err: any) => {
        this.errorNotification(err);
      }
    );
  }

  setGridSetting() {
    this.allMode = 'page';
    this.checkBoxesMode = 'always';
    this.showFilterRow = true;
    this.showHeaderFilter = false;
    this.applyFilterTypes = [
      {
        key: 'auto',
        name: 'Immediately',
      },
      {
        key: 'onClick',
        name: 'On Button Click',
      },
    ];
    this.columnResizingMode = this.resizingModes[0];
    this.currentFilter = this.applyFilterTypes[0].key;
  }
  createGeneralInfoTabForm() {
    this.generalInfoForm = this.fb.group({
      facilityId: [''],
      facilityName: ['', Validators.required],
      parentCoName: [''],
      facilityParentId: ['', Validators.required],
      schedulingLevel: [''],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      lacounty: [''],
      overridePrice: [''],
      isActive: [''],
      doNotScheduleFacility: [''],
      useBlockLease: [''],
      facilityMile: [''],
      priceWeight: [''],
      latitude: [''],
      longitude: [''],
      previousFacilityName: [''],
      previousFacilityName1: [''],
      previousFacilityName2: [''],
      schedFacilityTaxID: [''],
    });
  }
  createFacilityDetailTabForm() {
    this.facilityContactDetailForm = this.fb.group({
      itsupportContact: [''],
      itsupportEmail: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex )]],
      itsupportOfficePhone: ['', [Validators.minLength(10)]],
      itsupportCellPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      itsupportHomePhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      itsupportFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],

      reportsContact: [''],
      reportsEmail: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex )]],
      reportsOfficePhone: ['', [Validators.minLength(10)]],
      reportsCellPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      reportsHomePhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      reportsFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],

      statusCheckContact: [''],
      statusCheckEmail: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex )]],
      statusCheckOfficePhone: ['', [Validators.minLength(10)]],
      statusCheckCellPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      statusCheckHomePhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      statusCheckFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],

      schedulingContact: [''],
      schedulingEmail: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      schedulingOfficePhone: ['', [Validators.minLength(10)]],
      schedulingCellPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      schedulingHomePhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      schedulingFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      defaultEmailAddress3P: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      emailAddress13P: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      emailAddress23P: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      imagesContact: [''],
      imagesEmail: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      imagesOfficePhone: ['', [Validators.minLength(10)]],
      imagesCellPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      imagesHomePhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      imagesFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],

      billingContact: [''],
      billingEmail: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex )]],
      billingOfficePhone: ['', [Validators.minLength(10)]],
      billingCellPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      billingHomePhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      billingFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],
    });

  }

  createModalityServiceTabForm() {
    this.modalityServiceForm = this.fb.group({
      arthrogramService: [''],
      boneDensityService: [''],
      ctservice: [''],
      mammographService: [''],
      mriservice: [''],
      nuclearMedicineService: [''],
      petscanService: [''],
      ultrasoundService: [''],
      xrayService: [''],
      MyElogramService: [''],
      dexaService: [''],
      ctArthroService: [''],
    });
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
      mri1ResourceName: [null],
      mri2ResourceName: [null],
      mri3ResourceName: [null],
    });
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

      ct1ResourceName: [null],
      ct2ResourceName: [null],
      ct3ResourceName: [null],
    });
  }
  createModalityExceptionsTabForm() {
    this.modalityExceptionsForm = this.fb.group({
      mriexception: [''],
      mriexceptionDescription: [''],
      mriexpires: [''],

      ctexception: [''],
      ctexceptionDescription: [''],
      ctexpires: [''],

      xrexception: [''],
      xrexceptionDescription: [''],
      xrayexpires: [''],

      arthoException: [''],
      arthoExceptionDescription: [''],
      arthoExpires: [''],

      bnexception: [''],
      bnexceptionDescription: [''],
      bnexpires: [''],

      mammoException: [''],
      mammoExceptionDescription: [''],
      mammoExpires: [''],

      nmexception: [''],
      nmexceptionDescription: [''],
      nmexpires: [''],

      psexception: [''],
      psexceptionDescription: [''],
      psexpires: [''],

      usexception: [''],
      usexceptionDescription: [''],
      usexpires: [''],

      myElogramServiceException: [''],
      myElogramServiceexpDescription: [''],
      myElogramExpires: [''],

      dexaServiceException: [''],
      dexaServiceexpDescription: [''],
      dexaExpires: [''],

      ctArthroServiceException: [''],
      ctArthroServiceexpDescription: [''],
      ctArthoExpires: [''],


    });
  }
  createSchedulingDetailTabForm() {
    this.facilitySchedulingDetailForm = this.fb.group({
      ///// Scheduling
      schedulingSunOpenFrom: [''],
      schedulingSunOpenTo: [''],
      schedulingSunOpenFrom2: [''],
      schedulingSunOpenTo2: [''],
      schedulingMonOpenFrom: [''],
      schedulingMonOpenTo: [''],
      schedulingMonOpenFrom2: [''],
      schedulingMonOpenTo2: [''],
      shedulingTueOpenFrom: [''],
      shedulingTueOpenTo: [''],
      shedulingTueOpenFrom2: [''],
      shedulingTueOpenTo2: [''],
      shedulingWedOpenFrom: [''],
      shedulingWedOpenTo: [''],
      shedulingWedOpenFrom2: [''],
      shedulingWedOpenTo2: [''],
      shedulingThuOpenFrom: [''],
      shedulingThuOpenTo: [''],
      shedulingThuOpenFrom2: [''],
      shedulingThuOpenTo2: [''],
      shedulingFriOpenFrom: [''],
      shedulingFriOpenTo: [''],
      shedulingFriOpenFrom2: [''],
      shedulingFriOpenTo2: [''],
      shedulingSatOpenFrom: [''],
      shedulingSatOpenTo: [''],
      shedulingSatOpenFrom2: [''],
      shedulingSatOpenTo2: [''],
      sundayschedulingIsClosed: [false],
      mondayschedulingIsClosed: [false],
      tuesdayschedulingIsClosed: [false],
      wednesdayschedulingIsClosed: [false],
      thursdayschedulingIsClosed: [false],
      fridayschedulingIsClosed: [false],
      saturdayschedulingIsClosed: [false],

      ///// MRI
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
      sundaymriIsClosed: [false],
      mondaymriIsClosed: [false],
      tuesdaymriIsClosed: [false],
      wednesdaymriIsClosed: [false],
      thursdaymriIsClosed: [false],
      fridaymriIsClosed: [false],
      saturdaymriIsClosed: [false],

      ///////// CT
      ctSunOpenFrom: [''],
      ctSunOpenTo: [''],
      ctSunOpenFrom2: [''],
      ctSunOpenTo2: [''],
      ctMonOpenFrom: [''],
      ctMonOpenTo: [''],
      ctMonOpenFrom2: [''],
      ctMonOpenTo2: [''],
      ctTueOpenFrom: [''],
      ctTueOpenTo: [''],
      ctTueOpenFrom2: [''],
      ctTueOpenTo2: [''],
      ctWedOpenFrom: [''],
      ctWedOpenTo: [''],
      ctWedOpenFrom2: [''],
      ctWedOpenTo2: [''],
      ctThuOpenFrom: [''],
      ctThuOpenTo: [''],
      ctThuOpenFrom2: [''],
      ctThuOpenTo2: [''],
      ctFriOpenFrom: [''],
      ctFriOpenTo: [''],
      ctFriOpenFrom2: [''],
      ctFriOpenTo2: [''],
      ctSatOpenFrom: [''],
      ctSatOpenTo: [''],
      ctSatOpenFrom2: [''],
      ctSatOpenTo2: [''],
      sundayctIsClosed: [false],
      mondayctIsClosed: [false],
      tuesdayctIsClosed: [false],
      wednesdayctIsClosed: [false],
      thursdayctIsClosed: [false],
      fridayctIsClosed: [false],
      saturdayctIsClosed: [false],

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
      sundayxrayIsClosed: [false],
      mondayxrayIsClosed: [false],
      tuesdayxrayIsClosed: [false],
      wednesdayxrayIsClosed: [false],
      thursdayxrayIsClosed: [false],
      fridayxrayIsClosed: [false],
      saturdayxrayIsClosed: [false],
    });
  }
  createNotesTabForm() {
    this.facilityNotesForm = this.fb.group({
      Note: [''],
    });
  }
  createGeneralPoliciesForm() {
    this.facilityPoliciesForm = this.fb.group({
      facilityPolicy: [''],
      parentPolicy: [''],
    });
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
      parentOwnerPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      parentOwnerEmail: [''],
      parentOwnerFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      parentManagerName: [''],
      parentManagerEmail: [''],
      parentManagerPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      parentManagerFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      parentITName: [''],
      parentITEmail: [''],
      parentITPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      parentITFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      parentBillingName: [''],
      parentBillingEmail: [''],
      parentBillingPhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      parentBillingFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],
    });
    this.facilityParentCompanyForm.disable();
  }
  createIntakeTabForm() {
    this.facilityIntakeForm = this.fb.group({
      isPacketDocOnly: [''],
      isMriScreeningForm: [''],
      IsXrayWaiverForm: [''],
      IsFaxIntakePacket: [''],
      intakeFax1: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      intakeFax2: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      intakeFax3: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      intakeFax4: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      intakeFax5: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      isEmailIntakePacket: [''],
      intakeEmail1: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex )]],
      intakeEmail2: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex )]],
      intakeEmail3: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex )]],
      intakeEmail4: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex )]],
      intakeEmail5: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex )]],
      isElectricIntake: [''],
      isElecScreenForm: [''],
      isRxnotification: [''],
      isPrescreening: [''],
      userList: [''],
    });
  }
  createTagForm() {
    this.facilityTagForm = this.fb.group({
      tagName: ['', Validators.required]
    });
  }
  getFacilityLastFilterRecord(body: any) {
    this.facilityService.getFacilitySearchData(true, body).subscribe(
      (res) => {
        if (res.response != null) {
          this.searchText = res.response[0].searchText;
          this.userType = res.response[0].isActive;
          this.facilityService.updateSearchText(this.searchText);
          this.facilityService.updateDropDown(this.userType);
          this.getSchedulingFacilities();
        } else {
          this.searchText = '';
          this.userType = 1;
          this.facilityService.updateSearchText(this.searchText);
          this.facilityService.updateDropDown(this.userType);
          this.getSchedulingFacilities();
        }
      },
      (err: any) => {
        this.errorNotification(err);
      }
    );
  }

  pageChanged(event) {
    this.pageNumber = event;
    this.getSchedulingFacilities();
  }
  AddUpdateIsClosedDays(Day: string, Modality: string, event: any) {
    let body = {
      FacilityId: this.facilityId,
      Modality: Modality,
      Day: Day,
      IsClosed: event.target.checked,
    };
    this.facilityService.addUpdateFacilityClosedDays(true, body).subscribe(
      (res) => {
        if (res.response != null) {
          this.showNotificationOnSucess(res);
        }
      },
      (err: any) => {
        this.errorNotification(err);
      }
    );
  }
  getSchedulingFacilities() {

    let body = { 'isActive': this.userType, 'pageSize': this.pageSize, 'pageNumber': this.pageNumber, 'searchText': this.searchText }

    this.facilityService.getFacilityList(true, body).subscribe((res) => {
      if (res.response != null && res.response.length > 0) {
        this.facilityList = res.response;
        this.totalRecords = res.totalRecords;
        this.isShowColumnWithNoData = true;
      }
      else {
        this.isShowColumnWithNoData = false;
        this.totalRecords = 1;
        this.facilityList = [];
      }
    });
  }

  getFacilityResourceDropDownData() {
    this.facilityService
      .getResourceDropDownData(true, this.facilityId)
      .subscribe(
        (res) => {
          if (res.response != null) {
            this.ResourceNameList = res.response;
          }
        },
        (err: any) => {
          this.errorNotification(err);
        }
      );
  }

  // common Error Method
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status,
    });
  }
  showNotificationOnSucess(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode,
    });
  }
  showNotificationOnFailure(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Fail',
      alertMessage: data.message,
      alertType: data.responseCode,
    });
  }

  selectionChanged(data: any) {
    this.selectedItemKeys = data.selectedRowKeys;
  }
  getFacilityDetail(facilityId: any) {
    this.resetFacilityForm();
    this.facilityId = facilityId;
    this.isPopUpInEditMode = true;
    this.getFacilityDetailById();
    this.getFacilityResourceDropDownData();
  }
  getFacilityDetailById() {
    //this.isFacilityNoteTabVisible=true;
    //this.isFacilityPricingTabVisible=true;
    //this.isFacilityDocumentTabVisible=true;
    //this.isFacilityAnalyticsTabVisible=true;
    this.isApplyAndOkBtnVisisble = true;
    this.isInsertBtnVisisble = false;
    this.facilityDetail = [];
    this.facilityPolicy = '';
    this.parentPolicy = '';
    this.updatedResourceName = [];

    this.facilityService.getFacilityById(true, this.facilityId).subscribe((res) => {
      if (res.response[0] != null) {
        this.facilityDetail = res.response[0];
        if (JSON.parse(res.response[0].facilitycloseddaysJSON)) {
          this.updateFacilityCloseddays(JSON.parse(res.response[0].facilitycloseddaysJSON));
        }
        if (JSON.parse(res.response[0].facilityResourceJson)) {
          setTimeout(() => {
            this.updateFacilityResources(JSON.parse(res.response[0].facilityResourceJson));
          }, 200);
        }
        this.SetPolicyForm(this.facilityDetail);
        this.setGeneralInfoTabForm(this.facilityDetail);
        this.setFacilityContactDetailTabForm(this.facilityDetail);
        this.setModalityServiceTabForm(this.facilityDetail);
        this.setModalityMriTabForm(this.facilityDetail);
        this.setModalityCtTabForm(this.facilityDetail);
        this.setModalityExceptionsTabForm(this.facilityDetail);
        this.setSchedulingDetailTabForm(this.facilityDetail);
        this.setParentCompanyTabForm(this.facilityDetail);
        this.setIntakeTabForm(this.facilityDetail);
        this.getFacilityPricing(this.facilityId);
        this.getFacilityPricingHistory(this.facilityId);
        this.getFacilityNotes(this.facilityId);
        this.getTagListByFacilityId(this.facilityId);
        this.getAllBlockLeaseCredits();
        this.getblockLeasePaymentByFacilityId(this.facilityId);
        this.getUnpaidLeases();
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  senddocManagerFacility() {
    this.sendDataDocManager = {
      facilityId: this.facilityId,
      facilityName: this.facilityDetail.facilityName,
      from: 'Facility',
    };
    this.facilityService.getdocManagerFacility(this.sendDataDocManager);
  }
  updateResourceName(ResourceId: Number, Modality, ModalitiyType) {

    //alert('Respource Id:' + ResourceId);
    var data = this.updatedResourceName.filter(x => x.Modality == Modality && x.ModalitiyType == ModalitiyType);
    if (data.length > 0)
      data[0].ResourceId = ResourceId;
    else {
      if (Modality == 'ct') {
        var test = this.modalityCtForm.controls["ct1ResourceName"].value;
        //alert('CT Test ' + test);
        if (
          (this.modalityCtForm.controls['ct1ResourceName'].value !=
            ResourceId &&
            this.modalityCtForm.controls['ct2ResourceName'].value !=
            ResourceId) ||
          (this.modalityCtForm.controls['ct1ResourceName'].value !=
            ResourceId &&
            this.modalityCtForm.controls['ct3ResourceName'].value !=
            ResourceId) ||
          (this.modalityCtForm.controls['ct3ResourceName'].value !=
            ResourceId &&
            this.modalityCtForm.controls['ct2ResourceName'].value != ResourceId)
        ) {
          this.updatedResourceName.push({
            ID: 0,
            ResourceId: ResourceId,
            FacilityId: this.facilityId,
            UserId: this.storageService.user.UserId,
            Modality: Modality,
            ModalitiyType: ModalitiyType,
          });
        }
      } else {
        var test = this.modalityMriForm.controls['mri1ResourceName'].value;
        //alert('MRI Test ' + test);
        if (
          (this.modalityMriForm.controls['mri1ResourceName'].value !=
            ResourceId &&
            this.modalityMriForm.controls['mri2ResourceName'].value !=
            ResourceId) ||
          (this.modalityMriForm.controls['mri1ResourceName'].value !=
            ResourceId &&
            this.modalityMriForm.controls['mri3ResourceName'].value !=
            ResourceId) ||
          (this.modalityMriForm.controls['mri3ResourceName'].value !=
            ResourceId &&
            this.modalityMriForm.controls['mri2ResourceName'].value !=
            ResourceId)
        ) {
          this.updatedResourceName.push({
            ID: 0,
            ResourceId: ResourceId,
            FacilityId: this.facilityId,
            UserId: this.storageService.user.UserId,
            Modality: Modality,
            ModalitiyType: ModalitiyType,
          });
        }
      }
    }
  }
  updateFacilityResources(arrayResources: any) {
    let getOnlyModality = arrayResources
      .map((item) => item.Modality)
      .filter((value, index, self) => self.indexOf(value) === index);
    if (getOnlyModality) {
      getOnlyModality.forEach((Modality) => {
        let getModalitiyType = arrayResources
          .filter((arr) => arr.Modality == Modality)
          .map((arr) => arr.ModalitiyType);
        getModalitiyType.forEach((ModalitiyType) => {
          let getAllId = arrayResources.filter(
            (data) =>
              data.Modality == Modality && data.ModalitiyType == ModalitiyType
          )[0];
          let controlName = `${Modality.toLowerCase()}${ModalitiyType}ResourceName`;
          if (Modality.toLowerCase() == 'mri') {
            this.updatedResourceName.push({
              ID: getAllId.ID,
              FacilityId: this.facilityId,
              UserId: this.storageService.user.UserId,
              ResourceId: getAllId.ResourceId,
              Modality: 'mri',
              ModalitiyType: ModalitiyType,
            });

            this.modalityMriForm.patchValue({
              [controlName]: getAllId.ResourceId,
            });
          } else if (Modality.toLowerCase() == 'ct') {
            this.updatedResourceName.push({
              ID: getAllId.ID,
              FacilityId: this.facilityId,
              UserId: this.storageService.user.UserId,
              ResourceId: getAllId.ResourceId,
              Modality: 'ct',
              ModalitiyType: ModalitiyType,
            });
            this.modalityCtForm.patchValue({
              [controlName]: getAllId.ResourceId,
            });
          }
        });
      });
    }
  }

  updateFacilityCloseddays(arrayUpdate: any) {
    let getOnlyModality = arrayUpdate
      .map((item) => item.Modality)
      .filter((value, index, self) => self.indexOf(value) === index);
    let getOnlyWeek = arrayUpdate
      .map((item) => item.Day)
      .filter((value, index, self) => self.indexOf(value) === index);
    if (getOnlyModality && getOnlyWeek) {
      getOnlyModality.forEach((Modality) => {
        let getOnlyWeekN = arrayUpdate
          .filter((arr) => arr.Modality == Modality)
          .map((arr) => arr.Day);
        getOnlyWeekN.forEach((Day) => {
          let isClosed = arrayUpdate.filter(
            (data) => data.Modality == Modality && data.Day == Day
          )[0].IsClosed;
          let controlName = `${Day}${Modality}IsClosed`;
          this.facilitySchedulingDetailForm.patchValue({
            [controlName]: isClosed,
          });
        });
      });
    }
  }

  getFacilityNotes(facilityId: number) {
    this.facilityNoteList = [];
    this.facilityService
      .getAllFacilityNotesByFacililityId(true, facilityId)
      .subscribe(
        (notesRes) => {
          if (notesRes.response != null) {
            this.facilityNoteList = notesRes.response;
          }
        },
        (err: any) => {
          this.errorNotification(err);
        }
      );
  }
  getFacilityPricing(facilityId: number) {
    this.facilityPricingList = [];
    this.facilityService
      .getFacilityPricing(true, facilityId)
      .subscribe((res) => {
        if (res.response != null) {
          this.facilityPricingList = res.response;
        }
      });
  }
  checkForLease(event: any, from: string) {
    this.ConfirmationLeaseCheckedFrom = from;
    if (!event.target.checked) {
      this.hiddenConfirmationLeaseBtn.nativeElement.click();
    }
  }
  confirmationLease(checked: boolean) {
    if (!checked) {
      if (this.ConfirmationLeaseCheckedFrom == 'isActive') {
        this.generalInfoForm.patchValue({
          isActive: true,
        });
      } else {
        this.generalInfoForm.patchValue({
          useBlockLease: true,
        });
      }
    }
  }
  getLeaseAgreementsByFacilityId(facilityId: number) {
    this.blockLeaseAgreementMRIList = [];
    let body: any;
    if (
      this.defaultPopupTab == 'LeaseAgreements' ||
      this.defaultPopupTab == 'LeaseAgreement_MRI'
    ) {
      body = { FacilityID: facilityId, Modality: 'MRI' };
    } else {
      body = { FacilityID: facilityId, Modality: 'CT' };
    }
    this.facilityService.getLeaseAgreementsByFacilityId(true, body).subscribe((res) => {
      if (res.response != null) {
        if (this.defaultPopupTab == 'LeaseAgreements' || this.defaultPopupTab == 'LeaseAgreement_MRI') {
          this.blockLeaseAgreementMRIList = res.response;
          this.fullblockLeaseAgreementMRIList = this.blockLeaseAgreementMRIList.slice(0, this.MRIpageSize);
          this.totalrecordsFull_MRI = res.response[0].TotalRecords;
        }
        else {
          this.blockLeaseAgreementCTList = res.response;
          this.totalrecordsFull_CT = res.response[0].TotalRecords;
          this.fullblockLeaseAgreementCTList = this.blockLeaseAgreementCTList.slice(0, this.MRIpageSize);
        }

      }
    });
  }
  onPageNumberChangedLeaseAgreements(pageNumber: number, type: any) {
    this.MRIPageNumber = pageNumber;
    if (type == 'MRI') {
      this.fullblockLeaseAgreementMRIList =
        this.blockLeaseAgreementMRIList.slice(
          (this.MRIPageNumber - 1) * this.MRIpageSize,
          (this.MRIPageNumber - 1) * this.MRIpageSize + this.MRIpageSize
        );
    } else {
      this.fullblockLeaseAgreementCTList = this.blockLeaseAgreementCTList.slice(
        (this.MRIPageNumber - 1) * this.MRIpageSize,
        (this.MRIPageNumber - 1) * this.MRIpageSize + this.MRIpageSize
      );
    }
  }
  getBlockLeasePricing(facilityId: number) {
    this.blockLeasePricingList = [];
    let body = [{ FacilityID: facilityId, Operation: 5 }];
    this.facilityService.getBlockLeasePricing(true, body).subscribe((res) => {
      if (res.response != null) {
        console.log(this.getBlockLeasePricing);
        this.blockLeasePricingList = res.response;
      }
    });
  }

  getAllBlockLeaseCredits() {
    this.CreditDebitList = [];
    this.pageSize = 20;
    this.facilityService
      .getAllBlockLeaseCredits(true, this.facilityId, this.pageNumber, this.pageSize)
      .subscribe(
        (res) => {
          if (res.response != null && res.response.length > 0) {
            this.CreditDebitList = res.response;
            this.totalRecordBlockLeaseCredits = res.response[0].TotalRecords;
          } else {
            this.totalRecords = 1;
            this.CreditDebitList = [];
          }
        },
        (err: any) => {
          this.errorNotification(err);
        }
      );
  }
  onPageNumberChange(pageNumber: any) {
    this.pageNumber = pageNumber;
    this.getAllBlockLeaseCredits();
  }
  onRowUpdated(e) {
    this.eventBlockLeasePricingData = e;
  }
  saveBlockLeasePricing() {
    this.submitted = true;
    console.log(this.eventBlockLeasePricingData);
    if (this.eventBlockLeasePricingData['data']) {
      let body = {
        ID: this.eventBlockLeasePricingData['data'].ID,
        FacilityID: this.facilityId,
        Modality: this.eventBlockLeasePricingData['data'].Modality,
        LeaseRatePerHour:
          this.eventBlockLeasePricingData['data'].LeaseRatePerHour,
        ContrastCostPerUnit:
          this.eventBlockLeasePricingData['data'].ContrastCostPerUnit,
        Operation: 2,
      };
      for (var i = 0; i < this.blockLeasePricingList.length; i++) {
        this.blockLeasePricingList[i]['Operation'] = 2;
      }
      this.facilityService
        .getBlockLeasePricing(true, this.blockLeasePricingList)
        .subscribe(
          (res) => {
            if (res.response != null) {
              this.blockLeasePricingList = res.response;
              // this.showNotificationOnSucess({
              //   message: res.response.message,
              //   responseCode: res.responseCode
              // });
            }

            if (this.isApplyAndOkBtnVisisble) {
              this.updateFacility(true);
            }
            else if (this.isInsertBtnVisisble) {
              this.addFacility();
            }


          },
          (err: any) => {
            this.errorNotification(err);
          }
        );
    }
  }
  getFacilityPricingHistory(facilityId: number) {
    this.facilityPricingHistoryList = [];
    this.facilityService
      .getFacilityPricingHistory(true, facilityId)
      .subscribe((res) => {
        if (res.response != null) {
          this.facilityPricingHistoryList = res.response;
        }
      });
  }
  getTagListByFacilityId(facilityId: number) {
    this.facilityTagList = [];
    this.facilityService.getTagListByFacilityId(true, facilityId).subscribe(
      (tagRes) => {
        if (tagRes.response != null) {
          this.facilityTagList = tagRes.response;
        }
      },
      (err: any) => {
        this.errorNotification(err);
      }
    );
  }

  getblockLeasePaymentByFacilityId(facilityId: number) {
    this.blockLeasePaymentList = [];
    this.facilityService
      .GetblockLeasePaymentByFacilityId(
        true,
        facilityId.toString(),
        this.pageNumberOfPaid,
        this.pageSizeOfPaid
      )
      .subscribe((res) => {
        if (res.response != null) {
          console.log(res);
          this.blockLeasePaymentList = res.response;
          if (this.blockLeasePaymentList.length > 0) {
            this.totalRecordpaid = res.totalRecords;
            this.getLeasePaymentMappingByFacilityId(this.blockLeasePaymentList[0]);
          }else {
            this.totalRecordpaid = 1;
            this.blockLeasePaymentList = [];
          }
        }
      });
  }

  onPageNumberChangePaid(event) {
    this.pageNumberOfPaid = event;
    this.getblockLeasePaymentByFacilityId(this.facilityId);
  }

  getLeasePaymentMappingByFacilityId(paymentMapping: any) {
    paymentMapping.component.collapseAll(-1);
    if (paymentMapping.isExpanded) {
      let PaymentId = '';
      if (paymentMapping.data === undefined) {
        PaymentId = paymentMapping.PaymentId;
      }
      else {
        PaymentId = paymentMapping.data.PaymentId;
      }
      this.facilityService
        .GetLeasePaymentMappingByFacilityId(true, PaymentId)
        .subscribe((res) => {
          if (res.response != null) {
            this.blockLeasePaymentMappingList = res.response;
            this.getBlockLeaseCreditsByFacilityId(paymentMapping.data.PaymentTXN);
            var key = paymentMapping.component.getKeyByRowIndex(paymentMapping.dataIndex);  
            paymentMapping.component.expandRow(key);  
          }
        });
      }
  }

  getBlockLeaseCreditsByFacilityId(transactionNumber: string) {
    this.blockLeaseCreditList = [];
    this.facilityService
      .GetBlockLeaseCreditsByFacilityId(true, transactionNumber.toString())
      .subscribe((res) => {
        if (res.response != null) {
          this.blockLeaseCreditList = res.response;
        }
      });
  }


  _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }


  downloadFile(fileData) {
    if (fileData.data.FileDetail != null || fileData.data.FileDetail != undefined) {
      var data = fileData.data.FileDetail.FileBytes;
      var fileName = fileData.data.FileDetail.FileName;
      var pdfData = this._base64ToArrayBuffer(data);
      var file = new Blob([pdfData], { type: 'application/pdf' });
      var fileUrl = URL.createObjectURL(file);
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.href = fileUrl;
      a.target = '_blank';
      a.click();
    } else {
      var notification = {
        alertType: ResponseStatusCode.NotFound,
        alertHeader: 'Error',
        alertMessage: 'Not Found'
      }
      this.notificationService.showNotification(notification)
    }
  }

  setGeneralInfoTabForm(data: any) {
    this.disableCheckbox = data.useBlockLease;
    this.parentDropDownModel = data.parentCoName;
    this.facilityName = data.facilityName;
    if (!data.useBlockLease) {

      $('#BlockLeaseRate')
        .not('.btn')
        .attr('disabled', true)
        .addClass('disabledClass');
      // $('#LeaseAgreementMRI')
      //   .not('.btn')
      //   .attr('disabled', true)
      //   .addClass('disabledClass');
      // $('#LeaseAgreementCT')
      //   .not('.btn')
      //   .attr('disabled', true)
      //   .addClass('disabledClass');
      $('#CreditandDebit')
        .not('.btn')
        .attr('disabled', true)
        .addClass('disabledClass');
      $('#LeasePaymentsUnPaid')
        .not('.btn')
        .attr('disabled', true)
        .addClass('disabledClass');
    } else {
      $('#BlockLeaseRate')
        .not('.btn')
        .attr('disabled', false)
        .removeClass('disabledClass');
      // $('#LeaseAgreementMRI')
      //   .not('.btn')
      //   .attr('disabled', false)
      //   .removeClass('disabledClass');
        $('#LeasePaymentsUnPaid')
        .not('.btn')
        .attr('disabled', false)
        .removeClass('disabledClass');
      // $('#LeaseAgreementCT')
      //   .not('.btn')
      //   .attr('disabled', false)
      //   .removeClass('disabledClass');
      $('#CreditandDebit')
        .not('.btn')
        .attr('disabled', false)
        .removeClass('disabledClass');

    }
    this.generalInfoForm.patchValue({
      facilityId: data.facilityId,
      facilityName: data.facilityName,
      parentCoName: data.parentCoName,
      facilityParentId: data.facilityParentId,
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip,
      lacounty: data.lacounty,
      overridePrice: data.overridePrice,
      isActive: data.isActive,
      doNotScheduleFacility: data.doNotScheduleFacility,
      useBlockLease: data.useBlockLease,
      facilityMile: data.facilityMile,
      priceWeight: data.priceWeight,
      latitude: data.latitude,
      longitude: data.longitude,
      previousFacilityName: data.previousFacilityName,
      previousFacilityName1: data.previousFacilityName1,
      previousFacilityName2: data.previousFacilityName2,
      schedulingLevel: data.schedulingLevel,
      schedFacilityTaxID: data.schedFacilityTaxID,
    });
    if (data.overridePrice) this.allowUpdatingPrice = true;
    else this.allowUpdatingPrice = false;
  }
  setFacilityContactDetailTabForm(data: any) {
    this.facilityContactDetailForm.patchValue({
      itsupportContact: data.itsupportContact,
      itsupportEmail: data.itsupportEmail,
      itsupportOfficePhone: data.itsupportOfficePhone,
      itsupportCellPhone: data.itsupportCellPhone,
      itsupportHomePhone: data.itsupportHomePhone,
      itsupportFax: data.itsupportFax,

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
      defaultEmailAddress3P: data.defaultEmailAddress3P,
      emailAddress13P: data.emailAddress13P,
      emailAddress23P: data.emailAddress23P,

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
  setModalityServiceTabForm(data: any) {
    this.modalityServiceForm.patchValue({
      arthrogramService: data.arthrogramService,
      boneDensityService: data.boneDensityService,
      ctservice: data.ctservice,
      mammographService: data.mammographService,
      mriservice: data.mriservice,
      nuclearMedicineService: data.nuclearMedicineService,
      petscanService: data.petscanService,
      ultrasoundService: data.ultrasoundService,
      xrayService: data.xrayService,
      MyElogramService: data.MyElogramService,
      dexaService: data.dexaService,
      ctArthroService: data.ctArthroService,
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

      mrinotes: data.mrinotes,
    });

    this.CheckSameCombinationMRI('Type1');
    this.CheckSameCombinationMRI('Type2');
    this.CheckSameCombinationMRI('Type3');
    this.CheckSameCombinationCT('Type1');
    this.CheckSameCombinationCT('Type2');
    this.CheckSameCombinationCT('Type3');
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

      ctnotes: data.ctnotes
    });
  }
  setModalityExceptionsTabForm(data: any) {
    this.modalityExceptionsForm.patchValue({
      mriexception: data.mriexception,
      mriexceptionDescription: data.mriexceptionDescription,
      mriexpires: data.mriexpires,

      ctexception: data.ctexception,
      ctexceptionDescription: data.ctexceptionDescription,
      ctexpires: data.ctexpires,

      xrexception: data.xrexception,
      xrexceptionDescription: data.xrexceptionDescription,
      xrayexpires: data.xrayexpires,

      arthoException: data.arthoException,
      arthoExceptionDescription: data.arthoExceptionDescription,
      arthoExpires: data.arthoExpires,

      bnexception: data.bnexception,
      bnexceptionDescription: data.bnexceptionDescription,
      bnexpires: data.bnexpires,

      mammoException: data.mammoException,
      mammoExceptionDescription: data.mammoExceptionDescription,
      mammoExpires: data.mammoExpires,

      nmexception: data.nmexception,
      nmexceptionDescription: data.nmexceptionDescription,
      nmexpires: data.nmexpires,

      psexception: data.psexception,
      psexceptionDescription: data.psexceptionDescription,
      psexpires: data.psexpires,

      usexception: data.usexception,
      usexceptionDescription: data.usexceptionDescription,
      usexpires: data.usexpires,

      myElogramServiceException: data.myElogramServiceException,
      myElogramServiceexpDescription: data.myElogramServiceexpDescription,
      myElogramExpires: data.myElogramExpires,

      dexaServiceException: data.dexaServiceException,
      dexaServiceexpDescription: data.dexaServiceexpDescription,
      dexaExpires: data.dexaExpires,

      ctArthroServiceException: data.ctArthroServiceException,
      ctArthroServiceexpDescription: data.ctArthroServiceexpDescription,
      ctArthoExpires: data.ctArthoExpires,
    });
  }
  setParentCompanyTabForm(data: any) {
    this.facilityParentCompanyForm.patchValue({
      facilityParentName: data.facilityParentName,
      facilityParentId: data.facilityParentId,
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
  setSchedulingDetailTabForm(data: any) {
    this.facilitySchedulingDetailForm.patchValue({
      schedulingSunOpenFrom: data.schedulingSunOpenFrom,
      schedulingSunOpenTo: data.schedulingSunOpenTo,
      schedulingSunOpenFrom2: data.schedulingSunOpenFrom2,
      schedulingSunOpenTo2: data.schedulingSunOpenTo2,
      schedulingMonOpenFrom: data.schedulingMonOpenFrom,
      schedulingMonOpenTo: data.schedulingMonOpenTo,
      schedulingMonOpenFrom2: data.schedulingMonOpenFrom2,
      schedulingMonOpenTo2: data.schedulingMonOpenTo2,
      shedulingTueOpenFrom: data.shedulingTueOpenFrom,
      shedulingTueOpenTo: data.shedulingTueOpenTo,
      shedulingTueOpenFrom2: data.shedulingTueOpenFrom2,
      shedulingTueOpenTo2: data.shedulingTueOpenTo2,
      shedulingWedOpenFrom: data.shedulingWedOpenFrom,
      shedulingWedOpenTo: data.shedulingWedOpenTo,
      shedulingWedOpenFrom2: data.shedulingWedOpenFrom2,
      shedulingWedOpenTo2: data.shedulingWedOpenTo2,
      shedulingThuOpenFrom: data.shedulingThuOpenFrom,
      shedulingThuOpenTo: data.shedulingThuOpenTo,
      shedulingThuOpenFrom2: data.shedulingThuOpenFrom2,
      shedulingThuOpenTo2: data.shedulingThuOpenTo2,
      shedulingFriOpenFrom: data.shedulingFriOpenFrom,
      shedulingFriOpenTo: data.shedulingFriOpenTo,
      shedulingFriOpenFrom2: data.shedulingFriOpenFrom2,
      shedulingFriOpenTo2: data.shedulingFriOpenTo2,
      shedulingSatOpenFrom: data.shedulingSatOpenFrom,
      shedulingSatOpenTo: data.shedulingSatOpenTo,
      shedulingSatOpenFrom2: data.shedulingSatOpenFrom2,
      shedulingSatOpenTo2: data.shedulingSatOpenTo2,

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

      ctSunOpenFrom: data.ctSunOpenFrom,
      ctSunOpenTo: data.ctSunOpenTo,
      ctSunOpenFrom2: data.ctSunOpenFrom2,
      ctSunOpenTo2: data.ctSunOpenTo2,
      ctMonOpenFrom: data.ctMonOpenFrom,
      ctMonOpenTo: data.ctMonOpenTo,
      ctMonOpenFrom2: data.ctMonOpenFrom2,
      ctMonOpenTo2: data.ctMonOpenTo2,
      ctTueOpenFrom: data.ctTueOpenFrom,
      ctTueOpenTo: data.ctTueOpenTo,
      ctTueOpenFrom2: data.ctTueOpenFrom2,
      ctTueOpenTo2: data.ctTueOpenTo2,
      ctWedOpenFrom: data.ctWedOpenFrom,
      ctWedOpenTo: data.ctWedOpenTo,
      ctWedOpenFrom2: data.ctWedOpenFrom2,
      ctWedOpenTo2: data.ctWedOpenTo2,
      ctThuOpenFrom: data.ctThuOpenFrom,
      ctThuOpenTo: data.ctThuOpenTo,
      ctThuOpenFrom2: data.ctThuOpenFrom2,
      ctThuOpenTo2: data.ctThuOpenTo2,
      ctFriOpenFrom: data.ctFriOpenFrom,
      ctFriOpenTo: data.ctFriOpenTo,
      ctFriOpenFrom2: data.ctFriOpenFrom2,
      ctFriOpenTo2: data.ctFriOpenTo2,
      ctSatOpenFrom: data.ctSatOpenFrom,
      ctSatOpenTo: data.ctSatOpenTo,
      ctSatOpenFrom2: data.ctSatOpenFrom2,
      ctSatOpenTo2: data.ctSatOpenTo2,

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

  SetPolicyForm(data: any) {
    this.facilityPoliciesForm.patchValue({
      facilityPolicy: data.facilityPolicy,
      parentPolicy: data.parentPolicy,
    });
  }

  setIntakeTabForm(data: any) {
    this.selectedEpicUserList = null;

    if (data.userList != null && data.userList != '') {
      this.selectedEpicUserList = data.userList.split(',').map(function (item) {
        return item.trim();
      });
    }
    this.isIntakeScreeningAndWaiverVisible = data.isPacketDocOnly;
    this.isIntakeFaxVisible = data.IsFaxIntakePacket;
    this.isIntakeEmailVisible = data.isEmailIntakePacket;
    this.facilityIntakeForm.patchValue({
      isPacketDocOnly: data.isPacketDocOnly,
      isMriScreeningForm: data.isMriScreeningForm,
      IsXrayWaiverForm: data.IsXrayWaiverForm,
      IsFaxIntakePacket: data.IsFaxIntakePacket,
      intakeFax1: data.intakeFax1,
      intakeFax2: data.intakeFax2,
      intakeFax3: data.intakeFax3,
      intakeFax4: data.intakeFax4,
      intakeFax5: data.intakeFax5,
      isEmailIntakePacket: data.isEmailIntakePacket,
      intakeEmail1: data.intakeEmail1,
      intakeEmail2: data.intakeEmail2,
      intakeEmail3: data.intakeEmail3,
      intakeEmail4: data.intakeEmail4,
      intakeEmail5: data.intakeEmail5,
      isElectricIntake: data.isElectricIntake,
      isElecScreenForm: data.isElecScreenForm,
      isRxnotification: data.isRxnotification,
      isPrescreening: data.isPrescreening,
    });
  }
  addNote(isNoteButtonClick: boolean) {
    if (this.facilityNotesFormControls.Note.value.trim() != '') {
      let body = {
        'facilityNoteId': 0,
        'facilityId': this.facilityId,
        'note': this.facilityNotesFormControls.Note.value,
        'username': this.storageService.user.FullName,
        'timestamp': this.datePipe.transform(new Date(),this.dateTimeFormatCustom.DateTime)
      }
      this.facilityNotesFormControls.Note.setValue('');
      this.facilityService.addFacilityNote(true, body).subscribe((res) => {
        if (res.response != null) {
          if (isNoteButtonClick) {
            this.showNotificationOnSucess(res);
          }
          this.getFacilityNotes(this.facilityId);
        }
      }, (err: any) => {
        this.errorNotification(err);
      });
    }
  }
  addFacilityTag(isTagButtonClick: boolean) {

    this.submiited = true;
    this.isTagRequired = false;
    if (this.facilityTagFormControls.tagName.errors) {
      return;
    }
    let body = {
      'facilityID': this.facilityId,
      'tagName': this.facilityTagFormControls.tagName.value.toString(),
    }

    this.facilityService.addTagList(true, body).subscribe((res) => {
      if (res.response != null) {
        this.submiited = false;
        if (res.responseCode === 200) {
          this.showNotificationOnSucess(res);
        } else {
          this.errorNotification(res);
        }
        this.getTagListByFacilityId(this.facilityId);
        this.facilityTagForm.reset();
        this.tagBtnDisabled = true;
        this.getAllTagList();
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  onPacketDocOnlyChanged(isPackDoc: any) {
    this.facilityIntakeFormControls.isPacketDocOnly.setValue(isPackDoc);
    this.isIntakeScreeningAndWaiverVisible = isPackDoc;
    this.facilityIntakeFormControls.IsFaxIntakePacket.setValue(false);
    this.facilityIntakeFormControls.isEmailIntakePacket.setValue(false);
    this.isIntakeFaxVisible = false;
    this.isIntakeEmailVisible = false;
  }
  onIntakeFaxChanged(isFax: any) {

    this.facilityIntakeFormControls.IsFaxIntakePacket.setValue(isFax);
    this.isIntakeFaxVisible = isFax;
    this.isIntakeScreeningAndWaiverVisible = false;
    this.facilityIntakeFormControls.isPacketDocOnly.setValue(false);
  }

  onIntakeEmailChanged(isEmail: any) {
    this.facilityIntakeFormControls.isEmailIntakePacket.setValue(isEmail);
    this.isIntakeEmailVisible = isEmail;
    this.isIntakeScreeningAndWaiverVisible = false;
  }

  onTagChange(tagVal: any) {
    if (tagVal) {
      this.tagBtnDisabled = false;
    } else {
      this.tagBtnDisabled = true;
    }
  }
  deleteTag(tagId: any) {
    this.deleteTagId = tagId;
    this.hiddenDeleteTagPopUpButton.nativeElement.click();
  }
  deleteFacilityTag() {
    if (this.deleteTagId) {
      this.facilityService.deleteTagListById(true, this.deleteTagId).subscribe((res) => {
        if (res.responseCode === 200) {

          this.showNotificationOnSucess(res);
          // this.getTagListByFacilityId(this.facilityId);
          let index = this.facilityTagList.findIndex(d => d.id === this.deleteTagId);
          this.facilityTagList.splice(index, 1);
          this.getAllTagList();
        }
      }, (err: any) => {
        this.errorNotification(err);
      });

    }
  }
  checkNotes(noteText: string) {
    if (noteText.trim() === '') {
      this.noteBtnDisabled = true;
      return;
    }
    this.noteBtnDisabled = false;
  }
  allowNumberOnly(event: any): boolean {
    return this.commonMethodService.alowNumberOnly(event);
  }

  getFacilityParentList() {
    this.facilityParentList = [];
    this.facilityService.getFacilityParentNames(true).subscribe(
      (res) => {
        if (res.response !== null) {
          this.facilityParentList = res.response;
        }
      },
      (err: any) => {
        this.errorNotification(err);
      }
    );
  }
  updateFacility(isPopUpStay: boolean) {
    this.modalValue = 'modal';
    this.submitted = true;
    this.setGeneralInfoTabForm(this.generalInfoForm.value);
    if (
      this.generalInfoForm.invalid ||
      this.facilityContactDetailForm.invalid ||
      this.facilityIntakeForm.invalid ||
      this.facilityPoliciesForm.invalid||
      this.modalityMriForm.invalid
    ) {
      this.modalValue = '';
      return;
    }
    let body = {
      ///// General Tab Form Controls
      facilityId: this.facilityId,
      facilityName: this.generalInfoFormControls.facilityName.value,
      parentCoName: this.parentDropDownModel,
      facilityParentId: this.generalInfoFormControls.facilityParentId.value,
      schedulingLevel: this.generalInfoFormControls.schedulingLevel.value,
      street: this.generalInfoFormControls.street.value,
      city: this.generalInfoFormControls.city.value,
      state: this.generalInfoFormControls.state.value,
      zip: this.generalInfoFormControls.zip.value,
      lacounty: this.generalInfoFormControls.lacounty.value,
      overridePrice: this.generalInfoFormControls.overridePrice.value,
      isActive: this.generalInfoFormControls.isActive.value,
      doNotScheduleFacility:
        this.generalInfoFormControls.doNotScheduleFacility.value,
      useBlockLease: this.generalInfoFormControls.useBlockLease.value,
      facilityMile: this.generalInfoFormControls.facilityMile.value,
      priceWeight: this.generalInfoFormControls.priceWeight.value,
      latitude: this.generalInfoFormControls.latitude.value,
      longitude: this.generalInfoFormControls.longitude.value,
      previousFacilityName:
        this.generalInfoFormControls.previousFacilityName.value,
      previousFacilityName1:
        this.generalInfoFormControls.previousFacilityName1.value,
      previousFacilityName2:
        this.generalInfoFormControls.previousFacilityName2.value,
      schedFacilityTaxID: this.generalInfoFormControls.schedFacilityTaxID.value,

      //// Contact Detail Tab Form Controls

      itsupportContact: this.facilityContactDetailFormControls.itsupportContact.value,
      itsupportEmail: this.facilityContactDetailFormControls.itsupportEmail.value,
      itsupportOfficePhone: this.facilityContactDetailFormControls.itsupportOfficePhone.value != null ? this.facilityContactDetailFormControls.itsupportOfficePhone.value.replace(/\D+/g, '') : '',
      itsupportCellPhone: this.facilityContactDetailFormControls.itsupportCellPhone.value != null ? this.facilityContactDetailFormControls.itsupportCellPhone.value.replace(/\D+/g, '') : '',
      itsupportHomePhone: this.facilityContactDetailFormControls.itsupportHomePhone.value != null ? this.facilityContactDetailFormControls.itsupportHomePhone.value.replace(/\D+/g, '') : '',
      itsupportFax: this.facilityContactDetailFormControls.itsupportFax.value != null ? this.facilityContactDetailFormControls.itsupportFax.value.replace(/\D+/g, '') : '',

      reportsContact: this.facilityContactDetailFormControls.reportsContact.value,
      reportsEmail: this.facilityContactDetailFormControls.reportsEmail.value,
      reportsOfficePhone: this.facilityContactDetailFormControls.reportsOfficePhone.value != null ? this.facilityContactDetailFormControls.reportsOfficePhone.value.replace(/\D+/g, '') : '',
      reportsCellPhone: this.facilityContactDetailFormControls.reportsCellPhone.value != null ? this.facilityContactDetailFormControls.reportsCellPhone.value.replace(/\D+/g, '') : '',
      reportsHomePhone: this.facilityContactDetailFormControls.reportsHomePhone.value != null ? this.facilityContactDetailFormControls.reportsHomePhone.value.replace(/\D+/g, '') : '',
      reportsFax: this.facilityContactDetailFormControls.reportsFax.value != null ? this.facilityContactDetailFormControls.reportsFax.value.replace(/\D+/g, '') : '',

      statusCheckContact: this.facilityContactDetailFormControls.statusCheckContact.value,
      statusCheckEmail: this.facilityContactDetailFormControls.statusCheckEmail.value,
      statusCheckOfficePhone: this.facilityContactDetailFormControls.statusCheckOfficePhone.value != null ? this.facilityContactDetailFormControls.statusCheckOfficePhone.value.replace(/\D+/g, '') : '',
      statusCheckCellPhone: this.facilityContactDetailFormControls.statusCheckCellPhone.value != null ? this.facilityContactDetailFormControls.statusCheckCellPhone.value.replace(/\D+/g, '') : '',
      statusCheckHomePhone: this.facilityContactDetailFormControls.statusCheckHomePhone.value != null ? this.facilityContactDetailFormControls.statusCheckHomePhone.value.replace(/\D+/g, '') : '',
      statusCheckFax: this.facilityContactDetailFormControls.statusCheckFax.value != null ? this.facilityContactDetailFormControls.statusCheckFax.value.replace(/\D+/g, '') : '',

      schedulingContact: this.facilityContactDetailFormControls.schedulingContact.value,
      schedulingEmail: this.facilityContactDetailFormControls.schedulingEmail.value,
      schedulingOfficePhone: this.facilityContactDetailFormControls.schedulingOfficePhone.value != null ? this.facilityContactDetailFormControls.schedulingOfficePhone.value.replace(/\D+/g, '') : '',
      schedulingCellPhone: this.facilityContactDetailFormControls.schedulingCellPhone.value != null ? this.facilityContactDetailFormControls.schedulingCellPhone.value.replace(/\D+/g, '') : '',
      schedulingHomePhone: this.facilityContactDetailFormControls.schedulingHomePhone.value != null ? this.facilityContactDetailFormControls.schedulingHomePhone.value.replace(/\D+/g, '') : '',
      schedulingFax: this.facilityContactDetailFormControls.schedulingFax.value != null ? this.facilityContactDetailFormControls.schedulingFax.value.replace(/\D+/g, '') : '',

      imagesContact: this.facilityContactDetailFormControls.imagesContact.value,
      imagesEmail: this.facilityContactDetailFormControls.imagesEmail.value,
      imagesOfficePhone: this.facilityContactDetailFormControls.imagesOfficePhone.value != null ? this.facilityContactDetailFormControls.imagesOfficePhone.value.replace(/\D+/g, '') : '',
      imagesCellPhone: this.facilityContactDetailFormControls.imagesCellPhone.value != null ? this.facilityContactDetailFormControls.imagesCellPhone.value.replace(/\D+/g, '') : '',
      imagesHomePhone: this.facilityContactDetailFormControls.imagesHomePhone.value != null ? this.facilityContactDetailFormControls.imagesHomePhone.value.replace(/\D+/g, '') : '',
      imagesFax: this.facilityContactDetailFormControls.imagesFax.value != null ? this.facilityContactDetailFormControls.imagesFax.value.replace(/\D+/g, '') : '',

      billingContact: this.facilityContactDetailFormControls.billingContact.value,
      billingEmail: this.facilityContactDetailFormControls.billingEmail.value,
      billingOfficePhone: this.facilityContactDetailFormControls.billingOfficePhone.value != null ? this.facilityContactDetailFormControls.billingOfficePhone.value.replace(/\D+/g, '') : '',
      billingCellPhone: this.facilityContactDetailFormControls.billingCellPhone.value != null ? this.facilityContactDetailFormControls.billingCellPhone.value.replace(/\D+/g, '') : '',
      billingHomePhone: this.facilityContactDetailFormControls.billingHomePhone.value != null ? this.facilityContactDetailFormControls.billingHomePhone.value.replace(/\D+/g, '') : '',
      billingFax: this.facilityContactDetailFormControls.billingFax.value != null ? this.facilityContactDetailFormControls.billingFax.value.replace(/\D+/g, '') : '',


      ///// Modality Service Tab Form Controls

      arthrogramService: this.modalityServiceFormControls.arthrogramService.value,
      boneDensityService: this.modalityServiceFormControls.boneDensityService.value,
      ctservice: this.modalityServiceFormControls.ctservice.value,
      mammographService: this.modalityServiceFormControls.mammographService.value,
      mriservice: this.modalityServiceFormControls.mriservice.value,
      nuclearMedicineService: this.modalityServiceFormControls.nuclearMedicineService.value,
      petscanService: this.modalityServiceFormControls.petscanService.value,
      ultrasoundService: this.modalityServiceFormControls.ultrasoundService.value,
      xrayService: this.modalityServiceFormControls.xrayService.value,
      MyElogramService: this.modalityServiceFormControls.MyElogramService.value,
      dexaService: this.modalityServiceFormControls.dexaService.value,
      ctArthroService: this.modalityServiceFormControls.ctArthroService.value,

      ///// Modality MRI Tab Form Controls
      mri1type: this.modalityMriFormControls.mri1type.value,
      mri1strength: this.modalityMriFormControls.mri1strength.value,
      mri1make: this.modalityMriFormControls.mri1make.value,
      mri1weight: this.modalityMriFormControls.mri1weight.value,
      mri1contrast: this.modalityMriFormControls.mri1contrast.value,
      mri1sedation: this.modalityMriFormControls.mri1sedation.value,
      mri1breast: this.modalityMriFormControls.mri1breast.value,
      mri2type: this.modalityMriFormControls.mri2type.value,
      mri2strength: this.modalityMriFormControls.mri2strength.value,
      mri2make: this.modalityMriFormControls.mri2make.value,
      mri2weight: this.modalityMriFormControls.mri2weight.value,
      mri2contrast: this.modalityMriFormControls.mri2contrast.value,
      mri2sedation: this.modalityMriFormControls.mri2sedation.value,
      mri2breast: this.modalityMriFormControls.mri2breast.value,
      mri3type: this.modalityMriFormControls.mri3type.value,
      mri3strength: this.modalityMriFormControls.mri3strength.value,
      mri3make: this.modalityMriFormControls.mri3make.value,
      mri3weight: this.modalityMriFormControls.mri3weight.value,
      mri3contrast: this.modalityMriFormControls.mri3contrast.value,
      mri3sedation: this.modalityMriFormControls.mri3sedation.value,
      mri3breast: this.modalityMriFormControls.mri3breast.value,
      mriwFlexandEXT: this.modalityMriFormControls.mriwFlexandEXT.value,
      mrI2WFlexandEXT: this.modalityMriFormControls.mrI2WFlexandEXT.value,
      mrI3WFlexandEXT: this.modalityMriFormControls.mrI3WFlexandEXT.value,
      mrinotes: this.modalityMriFormControls.mrinotes.value,

      ///// Modality CT Tab Form Controls

      ct1make: this.modalityCtFormControls.ct1make.value,
      ct1slices: this.modalityCtFormControls.ct1slices.value,
      ct1weight: this.modalityCtFormControls.ct1weight.value,
      ct1contrast: this.modalityCtFormControls.ct1contrast.value,
      ct1sedation: this.modalityCtFormControls.ct1sedation.value,
      ct1breast: this.modalityCtFormControls.ct1breast.value,

      ct2make: this.modalityCtFormControls.ct2make.value,
      ct2slices: this.modalityCtFormControls.ct2slices.value,
      ct2weight: this.modalityCtFormControls.ct2weight.value,
      ct2contrast: this.modalityCtFormControls.ct2contrast.value,
      ct2sedation: this.modalityCtFormControls.ct2sedation.value,
      ct2breast: this.modalityCtFormControls.ct2breast.value,

      ct3make: this.modalityCtFormControls.ct3make.value,
      ct3slices: this.modalityCtFormControls.ct3slices.value,
      ct3weight: this.modalityCtFormControls.ct3weight.value,
      ct3contrast: this.modalityCtFormControls.ct3contrast.value,
      ct3sedation: this.modalityCtFormControls.ct3sedation.value,
      ct3breast: this.modalityCtFormControls.ct3breast.value,
      ctnotes: this.modalityCtFormControls.ctnotes.value,


      ///// Modality Exceptions Tab Form Controls


      mriexception: this.modalityExceptionsFormControls.mriexception.value,
      mriexceptionDescription: this.modalityExceptionsFormControls.mriexceptionDescription.value,
      mriexpires: this.modalityExceptionsFormControls.mriexpires.value,

      ctexception: this.modalityExceptionsFormControls.ctexception.value,
      ctexceptionDescription: this.modalityExceptionsFormControls.ctexceptionDescription.value,
      ctexpires: this.modalityExceptionsFormControls.ctexpires.value,

      xrexception: this.modalityExceptionsFormControls.xrexception.value,
      xrexceptionDescription: this.modalityExceptionsFormControls.xrexceptionDescription.value,
      xrayexpires: this.modalityExceptionsFormControls.xrayexpires.value,

      arthoException: this.modalityExceptionsFormControls.arthoException.value,
      arthoExceptionDescription: this.modalityExceptionsFormControls.arthoExceptionDescription.value,
      arthoExpires: this.modalityExceptionsFormControls.arthoExpires.value,

      bnexception: this.modalityExceptionsFormControls.bnexception.value,
      bnexceptionDescription: this.modalityExceptionsFormControls.bnexceptionDescription.value,
      bnexpires: this.modalityExceptionsFormControls.bnexpires.value,

      mammoException: this.modalityExceptionsFormControls.mammoException.value,
      mammoExceptionDescription: this.modalityExceptionsFormControls.mammoExceptionDescription.value,
      mammoExpires: this.modalityExceptionsFormControls.mammoExpires.value,

      nmexception: this.modalityExceptionsFormControls.nmexception.value,
      nmexceptionDescription: this.modalityExceptionsFormControls.nmexceptionDescription.value,
      nmexpires: this.modalityExceptionsFormControls.nmexpires.value,

      psexception: this.modalityExceptionsFormControls.psexception.value,
      psexceptionDescription: this.modalityExceptionsFormControls.psexceptionDescription.value,
      psexpires: this.modalityExceptionsFormControls.psexpires.value,

      usexception: this.modalityExceptionsFormControls.usexception.value,
      usexceptionDescription: this.modalityExceptionsFormControls.usexceptionDescription.value,
      usexpires: this.modalityExceptionsFormControls.usexpires.value,

      myElogramServiceException: this.modalityExceptionsFormControls.myElogramServiceException.value,
      myElogramServiceexpDescription: this.modalityExceptionsFormControls.myElogramServiceexpDescription.value,
      myElogramExpires: this.modalityExceptionsFormControls.myElogramExpires.value,

      dexaServiceException: this.modalityExceptionsFormControls.dexaServiceException.value,
      dexaServiceexpDescription: this.modalityExceptionsFormControls.dexaServiceexpDescription.value,
      dexaExpires: this.modalityExceptionsFormControls.dexaExpires.value,

      ctArthroServiceException: this.modalityExceptionsFormControls.ctArthroServiceException.value,
      ctArthroServiceexpDescription: this.modalityExceptionsFormControls.ctArthroServiceexpDescription.value,
      ctArthoExpires: this.modalityExceptionsFormControls.ctArthoExpires.value,

      ///// Modality Scheduling Detail Tab Form Controls

      schedulingSunOpenFrom: this.facilitySchedulingDetailFormControls.schedulingSunOpenFrom.value,
      schedulingSunOpenTo: this.facilitySchedulingDetailFormControls.schedulingSunOpenTo.value,
      schedulingSunOpenFrom2: this.facilitySchedulingDetailFormControls.schedulingSunOpenFrom2.value,
      schedulingSunOpenTo2: this.facilitySchedulingDetailFormControls.schedulingSunOpenTo2.value,
      schedulingMonOpenFrom: this.facilitySchedulingDetailFormControls.schedulingMonOpenFrom.value,
      schedulingMonOpenTo: this.facilitySchedulingDetailFormControls.schedulingMonOpenTo.value,
      schedulingMonOpenFrom2: this.facilitySchedulingDetailFormControls.schedulingMonOpenFrom2.value,
      schedulingMonOpenTo2: this.facilitySchedulingDetailFormControls.schedulingMonOpenTo2.value,
      shedulingTueOpenFrom: this.facilitySchedulingDetailFormControls.shedulingTueOpenFrom.value,
      shedulingTueOpenTo: this.facilitySchedulingDetailFormControls.shedulingTueOpenTo.value,
      shedulingTueOpenFrom2: this.facilitySchedulingDetailFormControls.shedulingTueOpenFrom2.value,
      shedulingTueOpenTo2: this.facilitySchedulingDetailFormControls.shedulingTueOpenTo2.value,
      shedulingWedOpenFrom: this.facilitySchedulingDetailFormControls.shedulingWedOpenFrom.value,
      shedulingWedOpenTo: this.facilitySchedulingDetailFormControls.shedulingWedOpenTo.value,
      shedulingWedOpenFrom2: this.facilitySchedulingDetailFormControls.shedulingWedOpenFrom2.value,
      shedulingWedOpenTo2: this.facilitySchedulingDetailFormControls.shedulingWedOpenTo2.value,
      shedulingThuOpenFrom: this.facilitySchedulingDetailFormControls.shedulingThuOpenFrom.value,
      shedulingThuOpenTo: this.facilitySchedulingDetailFormControls.shedulingThuOpenTo.value,
      shedulingThuOpenFrom2: this.facilitySchedulingDetailFormControls.shedulingThuOpenFrom2.value,
      shedulingThuOpenTo2: this.facilitySchedulingDetailFormControls.shedulingThuOpenTo2.value,
      shedulingFriOpenFrom: this.facilitySchedulingDetailFormControls.shedulingFriOpenFrom.value,
      shedulingFriOpenTo: this.facilitySchedulingDetailFormControls.shedulingFriOpenTo.value,
      shedulingFriOpenFrom2: this.facilitySchedulingDetailFormControls.shedulingFriOpenFrom2.value,
      shedulingFriOpenTo2: this.facilitySchedulingDetailFormControls.shedulingFriOpenTo2.value,
      shedulingSatOpenFrom: this.facilitySchedulingDetailFormControls.shedulingSatOpenFrom.value,
      shedulingSatOpenTo: this.facilitySchedulingDetailFormControls.shedulingSatOpenTo.value,
      shedulingSatOpenFrom2: this.facilitySchedulingDetailFormControls.shedulingSatOpenFrom2.value,
      shedulingSatOpenTo2: this.facilitySchedulingDetailFormControls.shedulingSatOpenTo2.value,

      sunOpenFrom: this.facilitySchedulingDetailFormControls.sunOpenFrom.value,
      sunOpenTo: this.facilitySchedulingDetailFormControls.sunOpenTo.value,
      sunOpenFrom2: this.facilitySchedulingDetailFormControls.sunOpenFrom2.value,
      sunOpenTo2: this.facilitySchedulingDetailFormControls.sunOpenTo2.value,
      monOpenFrom: this.facilitySchedulingDetailFormControls.monOpenFrom.value,
      monOpenTo: this.facilitySchedulingDetailFormControls.monOpenTo.value,
      monOpenFrom2: this.facilitySchedulingDetailFormControls.monOpenFrom2.value,
      monOpenTo2: this.facilitySchedulingDetailFormControls.monOpenTo2.value,
      tueOpenFrom: this.facilitySchedulingDetailFormControls.tueOpenFrom.value,
      tueOpenTo: this.facilitySchedulingDetailFormControls.tueOpenTo.value,
      tueOpenFrom2: this.facilitySchedulingDetailFormControls.tueOpenFrom2.value,
      tueOpenTo2: this.facilitySchedulingDetailFormControls.tueOpenTo2.value,
      wedOpenFrom: this.facilitySchedulingDetailFormControls.wedOpenFrom.value,
      wedOpenTo: this.facilitySchedulingDetailFormControls.wedOpenTo.value,
      wedOpenFrom2: this.facilitySchedulingDetailFormControls.wedOpenFrom2.value,
      wedOpenTo2: this.facilitySchedulingDetailFormControls.wedOpenTo2.value,
      thuOpenFrom: this.facilitySchedulingDetailFormControls.thuOpenFrom.value,
      thuOpenTo: this.facilitySchedulingDetailFormControls.thuOpenTo.value,
      thuOpenFrom2: this.facilitySchedulingDetailFormControls.thuOpenFrom2.value,
      thuOpenTo2: this.facilitySchedulingDetailFormControls.thuOpenTo2.value,
      friOpenFrom: this.facilitySchedulingDetailFormControls.friOpenFrom.value,
      friOpenTo: this.facilitySchedulingDetailFormControls.friOpenTo.value,
      friOpenFrom2: this.facilitySchedulingDetailFormControls.friOpenFrom2.value,
      friOpenTo2: this.facilitySchedulingDetailFormControls.friOpenTo2.value,
      satOpenFrom: this.facilitySchedulingDetailFormControls.satOpenFrom.value,
      satOpenTo: this.facilitySchedulingDetailFormControls.satOpenTo.value,
      satOpenFrom2: this.facilitySchedulingDetailFormControls.satOpenFrom2.value,
      satOpenTo2: this.facilitySchedulingDetailFormControls.satOpenTo2.value,

      ctSunOpenFrom: this.facilitySchedulingDetailFormControls.ctSunOpenFrom.value,
      ctSunOpenTo: this.facilitySchedulingDetailFormControls.ctSunOpenTo.value,
      ctSunOpenFrom2: this.facilitySchedulingDetailFormControls.ctSunOpenFrom2.value,
      ctSunOpenTo2: this.facilitySchedulingDetailFormControls.ctSunOpenTo2.value,
      ctMonOpenFrom: this.facilitySchedulingDetailFormControls.ctMonOpenFrom.value,
      ctMonOpenTo: this.facilitySchedulingDetailFormControls.ctMonOpenTo.value,
      ctMonOpenFrom2: this.facilitySchedulingDetailFormControls.ctMonOpenFrom2.value,
      ctMonOpenTo2: this.facilitySchedulingDetailFormControls.ctMonOpenTo2.value,
      ctTueOpenFrom: this.facilitySchedulingDetailFormControls.ctTueOpenFrom.value,
      ctTueOpenTo: this.facilitySchedulingDetailFormControls.ctTueOpenTo.value,
      ctTueOpenFrom2: this.facilitySchedulingDetailFormControls.ctTueOpenFrom2.value,
      ctTueOpenTo2: this.facilitySchedulingDetailFormControls.ctTueOpenTo2.value,
      ctWedOpenFrom: this.facilitySchedulingDetailFormControls.ctWedOpenFrom.value,
      ctWedOpenTo: this.facilitySchedulingDetailFormControls.ctWedOpenTo.value,
      ctWedOpenFrom2: this.facilitySchedulingDetailFormControls.ctWedOpenFrom2.value,
      ctWedOpenTo2: this.facilitySchedulingDetailFormControls.ctWedOpenTo2.value,
      ctThuOpenFrom: this.facilitySchedulingDetailFormControls.ctThuOpenFrom.value,
      ctThuOpenTo: this.facilitySchedulingDetailFormControls.ctThuOpenTo.value,
      ctThuOpenFrom2: this.facilitySchedulingDetailFormControls.ctThuOpenFrom2.value,
      ctThuOpenTo2: this.facilitySchedulingDetailFormControls.ctThuOpenTo2.value,
      ctFriOpenFrom: this.facilitySchedulingDetailFormControls.ctFriOpenFrom.value,
      ctFriOpenTo: this.facilitySchedulingDetailFormControls.ctFriOpenTo.value,
      ctFriOpenFrom2: this.facilitySchedulingDetailFormControls.ctFriOpenFrom2.value,
      ctFriOpenTo2: this.facilitySchedulingDetailFormControls.ctFriOpenTo2.value,
      ctSatOpenFrom: this.facilitySchedulingDetailFormControls.ctSatOpenFrom.value,
      ctSatOpenTo: this.facilitySchedulingDetailFormControls.ctSatOpenTo.value,
      ctSatOpenFrom2: this.facilitySchedulingDetailFormControls.ctSatOpenFrom2.value,
      ctSatOpenTo2: this.facilitySchedulingDetailFormControls.ctSatOpenTo2.value,

      sunXrayFrom: this.facilitySchedulingDetailFormControls.sunXrayFrom.value,
      sunXrayTo: this.facilitySchedulingDetailFormControls.sunXrayTo.value,
      sunXrayFrom2: this.facilitySchedulingDetailFormControls.sunXrayFrom2.value,
      sunXrayTo2: this.facilitySchedulingDetailFormControls.sunXrayTo2.value,
      monXrayFrom: this.facilitySchedulingDetailFormControls.monXrayFrom.value,
      monXrayTo: this.facilitySchedulingDetailFormControls.monXrayTo.value,
      monXrayFrom2: this.facilitySchedulingDetailFormControls.monXrayFrom2.value,
      monXrayTo2: this.facilitySchedulingDetailFormControls.monXrayTo2.value,
      tueXrayFrom: this.facilitySchedulingDetailFormControls.tueXrayFrom.value,
      tueXrayTo: this.facilitySchedulingDetailFormControls.tueXrayTo.value,
      tueXrayFrom2: this.facilitySchedulingDetailFormControls.tueXrayFrom2.value,
      tueXrayTo2: this.facilitySchedulingDetailFormControls.tueXrayTo2.value,
      wedXrayFrom: this.facilitySchedulingDetailFormControls.wedXrayFrom.value,
      wedXrayTo: this.facilitySchedulingDetailFormControls.wedXrayTo.value,
      wedXrayFrom2: this.facilitySchedulingDetailFormControls.wedXrayFrom2.value,
      wedXrayTo2: this.facilitySchedulingDetailFormControls.wedXrayTo2.value,
      thuXrayFrom: this.facilitySchedulingDetailFormControls.thuXrayFrom.value,
      thuXrayTo: this.facilitySchedulingDetailFormControls.thuXrayTo.value,
      thuXrayFrom2: this.facilitySchedulingDetailFormControls.thuXrayFrom2.value,
      thuXrayTo2: this.facilitySchedulingDetailFormControls.thuXrayTo2.value,
      friXrayFrom: this.facilitySchedulingDetailFormControls.friXrayFrom.value,
      friXrayTo: this.facilitySchedulingDetailFormControls.friXrayTo.value,
      friXrayFrom2: this.facilitySchedulingDetailFormControls.friXrayFrom2.value,
      friXrayTo2: this.facilitySchedulingDetailFormControls.friXrayTo2.value,
      satXrayFrom: this.facilitySchedulingDetailFormControls.satXrayFrom.value,
      satXrayTo: this.facilitySchedulingDetailFormControls.satXrayTo.value,
      satXrayFrom2: this.facilitySchedulingDetailFormControls.satXrayFrom2.value,
      satXrayTo2: this.facilitySchedulingDetailFormControls.satXrayTo2.value,
      parking: this.facilitySchedulingDetailFormControls.parking.value,
      preArrivalTime: this.facilitySchedulingDetailFormControls.preArrivalTime.value,
      xrayWalkIn: this.facilitySchedulingDetailFormControls.xrayWalkIn.value,

      //// Notes TAB Have Different API's


      //// Facility Parent Detail Tab Form Controls

      facilityParentName: this.facilityParentCompanyFormControls.facilityParentName.value,
      //facilityParentId:this.facilityParentCompanyFormControls.facilityParentId.value,
      parentAddress: this.facilityParentCompanyFormControls.parentAddress.value,
      parentCity: this.facilityParentCompanyFormControls.parentCity.value,
      parentState: this.facilityParentCompanyFormControls.parentState.value,
      parentZip: this.facilityParentCompanyFormControls.parentZip.value,
      parentWebsite: this.facilityParentCompanyFormControls.parentWebsite.value,
      parentOwnerName: this.facilityParentCompanyFormControls.parentOwnerName.value,
      parentOwnerPhone: this.facilityParentCompanyFormControls.parentOwnerPhone.value != null ? this.facilityParentCompanyFormControls.parentOwnerPhone.value.replace(/\D+/g, '') : '',
      parentOwnerEmail: this.facilityParentCompanyFormControls.parentOwnerEmail.value,
      parentOwnerFax: this.facilityParentCompanyFormControls.parentOwnerFax.value != null ? this.facilityParentCompanyFormControls.parentOwnerFax.value.replace(/\D+/g, '') : '',
      parentManagerName: this.facilityParentCompanyFormControls.parentManagerName.value,
      parentManagerEmail: this.facilityParentCompanyFormControls.parentManagerEmail.value,
      parentManagerPhone: this.facilityParentCompanyFormControls.parentManagerPhone.value != null ? this.facilityParentCompanyFormControls.parentManagerPhone.value.replace(/\D+/g, '') : '',
      parentManagerFax: this.facilityParentCompanyFormControls.parentManagerFax.value != null ? this.facilityParentCompanyFormControls.parentManagerFax.value.replace(/\D+/g, '') : '',
      parentITName: this.facilityParentCompanyFormControls.parentITName.value,
      parentITEmail: this.facilityParentCompanyFormControls.parentITEmail.value,
      parentITPhone: this.facilityParentCompanyFormControls.parentITPhone.value != null ? this.facilityParentCompanyFormControls.parentITPhone.value.replace(/\D+/g, '') : '',
      parentITFax: this.facilityParentCompanyFormControls.parentITFax.value != null ? this.facilityParentCompanyFormControls.parentITFax.value.replace(/\D+/g, '') : '',
      parentBillingName: this.facilityParentCompanyFormControls.parentBillingName.value,
      parentBillingEmail: this.facilityParentCompanyFormControls.parentBillingEmail.value,
      parentBillingPhone: this.facilityParentCompanyFormControls.parentBillingPhone.value != null ? this.facilityParentCompanyFormControls.parentBillingPhone.value.replace(/\D+/g, '') : '',
      parentBillingFax: this.facilityParentCompanyFormControls.parentBillingFax.value != null ? this.facilityParentCompanyFormControls.parentBillingFax.value.replace(/\D+/g, '') : '',

      //// Intake Tab Form Controls

      isPacketDocOnly: this.facilityIntakeFormControls.isPacketDocOnly.value,
      isMriScreeningForm: this.facilityIntakeFormControls.isMriScreeningForm.value,
      IsXrayWaiverForm: this.facilityIntakeFormControls.IsXrayWaiverForm.value,
      IsFaxIntakePacket: this.facilityIntakeFormControls.IsFaxIntakePacket.value,
      intakeFax1: this.facilityIntakeFormControls.intakeFax1.value != null ? this.facilityIntakeFormControls.intakeFax1.value.replace(/\D+/g, '') : '',
      intakeFax2: this.facilityIntakeFormControls.intakeFax2.value != null ? this.facilityIntakeFormControls.intakeFax2.value.replace(/\D+/g, '') : '',
      intakeFax3: this.facilityIntakeFormControls.intakeFax3.value != null ? this.facilityIntakeFormControls.intakeFax3.value.replace(/\D+/g, '') : '',
      intakeFax4: this.facilityIntakeFormControls.intakeFax4.value != null ? this.facilityIntakeFormControls.intakeFax4.value.replace(/\D+/g, '') : '',
      intakeFax5: this.facilityIntakeFormControls.intakeFax5.value != null ? this.facilityIntakeFormControls.intakeFax5.value.replace(/\D+/g, '') : '',
      isEmailIntakePacket: this.facilityIntakeFormControls.isEmailIntakePacket.value,
      intakeEmail1: this.facilityIntakeFormControls.intakeEmail1.value,
      intakeEmail2: this.facilityIntakeFormControls.intakeEmail2.value,
      intakeEmail3: this.facilityIntakeFormControls.intakeEmail3.value,
      intakeEmail4: this.facilityIntakeFormControls.intakeEmail4.value,
      intakeEmail5: this.facilityIntakeFormControls.intakeEmail5.value,
      isElectricIntake: this.facilityIntakeFormControls.isElectricIntake.value,
      isElecScreenForm: this.facilityIntakeFormControls.isElecScreenForm.value,
      isRxnotification: this.facilityIntakeFormControls.isRxnotification.value,
      isPrescreening: this.facilityIntakeFormControls.isPrescreening.value,
      userList: this.selectedEpicUserList != null ? this.selectedEpicUserList.toString() : null,
      // facilityPolicy:this.facilityPolicy!=null?this.facilityPolicy.toString():'',
      // parentPolicy:this.parentPolicy!=null?this.parentPolicy.toString():''
      facilityPolicy: this.facilityPolicyFormControls.facilityPolicy.value,
      parentPolicy: this.facilityPolicyFormControls.parentPolicy.value
      /// For Tag Tab we are using Different API

    }

    this.facilityService.updateFacility(true, body).subscribe((res) => {
      if (res.response != null) {
        this.showNotificationOnSucess(res);
        if (this.facilityNotesFormControls.Note.value != null && this.facilityNotesFormControls.Note.value.toString().trim() != '') {
          this.addNote(false);
        }
        if (this.facilityTagFormControls.tagName.value != null && this.facilityTagFormControls.tagName.value.toString().trim() != '') {
          this.addFacilityTag(true);
        }
        this.getSchedulingFacilities();

      }
      else {
        this.showNotificationOnFailure(res);
      }

    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  addFacility() {
    this.modalValue = 'modal';
    this.submitted = true;
    if (
      this.generalInfoForm.invalid ||
      this.facilityContactDetailForm.invalid ||
      this.facilityIntakeForm.invalid ||
      this.facilityPoliciesForm.invalid
    ) {
      this.modalValue = '';
      return;
    }

    let body = {
      ///// General Tab Form Controls
      facilityId: 0,
      facilityName: this.generalInfoFormControls.facilityName.value,
      parentCoName: this.parentDropDownModel,
      facilityParentId: this.generalInfoFormControls.facilityParentId.value,
      schedulingLevel: this.generalInfoFormControls.schedulingLevel.value,
      street: this.generalInfoFormControls.street.value,
      city: this.generalInfoFormControls.city.value,
      state: this.generalInfoFormControls.state.value,
      zip: this.generalInfoFormControls.zip.value,
      lacounty: this.generalInfoFormControls.lacounty.value,
      overridePrice: this.generalInfoFormControls.overridePrice.value,
      isActive: this.generalInfoFormControls.isActive.value,
      doNotScheduleFacility:
        this.generalInfoFormControls.doNotScheduleFacility.value,
      useBlockLease: this.generalInfoFormControls.useBlockLease.value,
      facilityMile: this.generalInfoFormControls.facilityMile.value,
      priceWeight: this.generalInfoFormControls.priceWeight.value,
      latitude: this.generalInfoFormControls.latitude.value,
      longitude: this.generalInfoFormControls.longitude.value,
      previousFacilityName: this.generalInfoFormControls.previousFacilityName.value,
      previousFacilityName1: this.generalInfoFormControls.previousFacilityName1.value,
      previousFacilityName2: this.generalInfoFormControls.previousFacilityName2.value,
      schedFacilityTaxID: this.generalInfoFormControls.schedFacilityTaxID.value,

      //// Contact Detail Tab Form Controls

      itsupportContact: this.facilityContactDetailFormControls.itsupportContact.value,
      itsupportEmail: this.facilityContactDetailFormControls.itsupportEmail.value,
      itsupportOfficePhone: this.facilityContactDetailFormControls.itsupportOfficePhone.value != null ? this.facilityContactDetailFormControls.itsupportOfficePhone.value.replace(/\D+/g, '') : '',
      itsupportCellPhone: this.facilityContactDetailFormControls.itsupportCellPhone.value != null ? this.facilityContactDetailFormControls.itsupportCellPhone.value.replace(/\D+/g, '') : '',
      itsupportHomePhone: this.facilityContactDetailFormControls.itsupportHomePhone.value != null ? this.facilityContactDetailFormControls.itsupportHomePhone.value.replace(/\D+/g, '') : '',
      itsupportFax: this.facilityContactDetailFormControls.itsupportFax.value != null ? this.facilityContactDetailFormControls.itsupportFax.value.replace(/\D+/g, '') : '',

      reportsContact: this.facilityContactDetailFormControls.reportsContact.value,
      reportsEmail: this.facilityContactDetailFormControls.reportsEmail.value,
      reportsOfficePhone: this.facilityContactDetailFormControls.reportsOfficePhone.value != null ? this.facilityContactDetailFormControls.reportsOfficePhone.value.replace(/\D+/g, '') : '',
      reportsCellPhone: this.facilityContactDetailFormControls.reportsCellPhone.value != null ? this.facilityContactDetailFormControls.reportsCellPhone.value.replace(/\D+/g, '') : '',
      reportsHomePhone: this.facilityContactDetailFormControls.reportsHomePhone.value != null ? this.facilityContactDetailFormControls.reportsHomePhone.value.replace(/\D+/g, '') : '',
      reportsFax: this.facilityContactDetailFormControls.reportsFax.value != null ? this.facilityContactDetailFormControls.reportsFax.value.replace(/\D+/g, '') : '',

      statusCheckContact: this.facilityContactDetailFormControls.statusCheckContact.value,
      statusCheckEmail: this.facilityContactDetailFormControls.statusCheckEmail.value,
      statusCheckOfficePhone: this.facilityContactDetailFormControls.statusCheckOfficePhone.value != null ? this.facilityContactDetailFormControls.statusCheckOfficePhone.value.replace(/\D+/g, '') : '',
      statusCheckCellPhone: this.facilityContactDetailFormControls.statusCheckCellPhone.value != null ? this.facilityContactDetailFormControls.statusCheckCellPhone.value.replace(/\D+/g, '') : '',
      statusCheckHomePhone: this.facilityContactDetailFormControls.statusCheckHomePhone.value != null ? this.facilityContactDetailFormControls.statusCheckHomePhone.value.replace(/\D+/g, '') : '',
      statusCheckFax: this.facilityContactDetailFormControls.statusCheckFax.value != null ? this.facilityContactDetailFormControls.statusCheckFax.value.replace(/\D+/g, '') : '',

      schedulingContact: this.facilityContactDetailFormControls.schedulingContact.value,
      schedulingEmail: this.facilityContactDetailFormControls.schedulingEmail.value,
      schedulingOfficePhone: this.facilityContactDetailFormControls.schedulingOfficePhone.value != null ? this.facilityContactDetailFormControls.schedulingOfficePhone.value.replace(/\D+/g, '') : '',
      schedulingCellPhone: this.facilityContactDetailFormControls.schedulingCellPhone.value != null ? this.facilityContactDetailFormControls.schedulingCellPhone.value.replace(/\D+/g, '') : '',
      schedulingHomePhone: this.facilityContactDetailFormControls.schedulingHomePhone.value != null ? this.facilityContactDetailFormControls.schedulingHomePhone.value.replace(/\D+/g, '') : '',
      schedulingFax: this.facilityContactDetailFormControls.schedulingFax.value != null ? this.facilityContactDetailFormControls.schedulingFax.value.replace(/\D+/g, '') : '',

      imagesContact: this.facilityContactDetailFormControls.imagesContact.value,
      imagesEmail: this.facilityContactDetailFormControls.imagesEmail.value,
      imagesOfficePhone: this.facilityContactDetailFormControls.imagesOfficePhone.value != null ? this.facilityContactDetailFormControls.imagesOfficePhone.value.replace(/\D+/g, '') : '',
      imagesCellPhone: this.facilityContactDetailFormControls.imagesCellPhone.value != null ? this.facilityContactDetailFormControls.imagesCellPhone.value.replace(/\D+/g, '') : '',
      imagesHomePhone: this.facilityContactDetailFormControls.imagesHomePhone.value != null ? this.facilityContactDetailFormControls.imagesHomePhone.value.replace(/\D+/g, '') : '',
      imagesFax: this.facilityContactDetailFormControls.imagesFax.value != null ? this.facilityContactDetailFormControls.imagesFax.value.replace(/\D+/g, '') : '',

      billingContact: this.facilityContactDetailFormControls.billingContact.value,
      billingEmail: this.facilityContactDetailFormControls.billingEmail.value,
      billingOfficePhone: this.facilityContactDetailFormControls.billingOfficePhone.value != null ? this.facilityContactDetailFormControls.billingOfficePhone.value.replace(/\D+/g, '') : '',
      billingCellPhone: this.facilityContactDetailFormControls.billingCellPhone.value != null ? this.facilityContactDetailFormControls.billingCellPhone.value.replace(/\D+/g, '') : '',
      billingHomePhone: this.facilityContactDetailFormControls.billingHomePhone.value != null ? this.facilityContactDetailFormControls.billingHomePhone.value.replace(/\D+/g, '') : '',
      billingFax: this.facilityContactDetailFormControls.billingFax.value != null ? this.facilityContactDetailFormControls.billingFax.value.replace(/\D+/g, '') : '',


      ///// Modality Service Tab Form Controls

      arthrogramService: this.modalityServiceFormControls.arthrogramService.value,
      boneDensityService: this.modalityServiceFormControls.boneDensityService.value,
      ctservice: this.modalityServiceFormControls.ctservice.value,
      mammographService: this.modalityServiceFormControls.mammographService.value,
      mriservice: this.modalityServiceFormControls.mriservice.value,
      nuclearMedicineService: this.modalityServiceFormControls.nuclearMedicineService.value,
      petscanService: this.modalityServiceFormControls.petscanService.value,
      ultrasoundService: this.modalityServiceFormControls.ultrasoundService.value,
      xrayService: this.modalityServiceFormControls.xrayService.value,
      MyElogramService: this.modalityServiceFormControls.MyElogramService.value,
      dexaService: this.modalityServiceFormControls.dexaService.value,
      ctArthroService: this.modalityServiceFormControls.ctArthroService.value,

      ///// Modality MRI Tab Form Controls
      mri1type: this.modalityMriFormControls.mri1type.value,
      mri1strength: this.modalityMriFormControls.mri1strength.value,
      mri1make: this.modalityMriFormControls.mri1make.value,
      mri1weight: this.modalityMriFormControls.mri1weight.value,
      mri1contrast: this.modalityMriFormControls.mri1contrast.value,
      mri1sedation: this.modalityMriFormControls.mri1sedation.value,
      mri1breast: this.modalityMriFormControls.mri1breast.value,
      mri2type: this.modalityMriFormControls.mri2type.value,
      mri2strength: this.modalityMriFormControls.mri2strength.value,
      mri2make: this.modalityMriFormControls.mri2make.value,
      mri2weight: this.modalityMriFormControls.mri2weight.value,
      mri2contrast: this.modalityMriFormControls.mri2contrast.value,
      mri2sedation: this.modalityMriFormControls.mri2sedation.value,
      mri2breast: this.modalityMriFormControls.mri2breast.value,
      mri3type: this.modalityMriFormControls.mri3type.value,
      mri3strength: this.modalityMriFormControls.mri3strength.value,
      mri3make: this.modalityMriFormControls.mri3make.value,
      mri3weight: this.modalityMriFormControls.mri3weight.value,
      mri3contrast: this.modalityMriFormControls.mri3contrast.value,
      mri3sedation: this.modalityMriFormControls.mri3sedation.value,
      mri3breast: this.modalityMriFormControls.mri3breast.value,
      mriwFlexandEXT: this.modalityMriFormControls.mriwFlexandEXT.value,
      mrI2WFlexandEXT: this.modalityMriFormControls.mrI2WFlexandEXT.value,
      mrI3WFlexandEXT: this.modalityMriFormControls.mrI3WFlexandEXT.value,
      mrinotes: this.modalityMriFormControls.mrinotes.value,

      ///// Modality CT Tab Form Controls

      ct1make: this.modalityCtFormControls.ct1make.value,
      ct1slices: this.modalityCtFormControls.ct1slices.value,
      ct1weight: this.modalityCtFormControls.ct1weight.value,
      ct1contrast: this.modalityCtFormControls.ct1contrast.value,
      ct1sedation: this.modalityCtFormControls.ct1sedation.value,
      ct1breast: this.modalityCtFormControls.ct1breast.value,

      ct2make: this.modalityCtFormControls.ct2make.value,
      ct2slices: this.modalityCtFormControls.ct2slices.value,
      ct2weight: this.modalityCtFormControls.ct2weight.value,
      ct2contrast: this.modalityCtFormControls.ct2contrast.value,
      ct2sedation: this.modalityCtFormControls.ct2sedation.value,
      ct2breast: this.modalityCtFormControls.ct2breast.value,

      ct3make: this.modalityCtFormControls.ct3make.value,
      ct3slices: this.modalityCtFormControls.ct3slices.value,
      ct3weight: this.modalityCtFormControls.ct3weight.value,
      ct3contrast: this.modalityCtFormControls.ct3contrast.value,
      ct3sedation: this.modalityCtFormControls.ct3sedation.value,
      ct3breast: this.modalityCtFormControls.ct3breast.value,
      ctnotes: this.modalityCtFormControls.ctnotes.value,


      ///// Modality Exceptions Tab Form Controls


      mriexception: this.modalityExceptionsFormControls.mriexception.value,
      mriexceptionDescription: this.modalityExceptionsFormControls.mriexceptionDescription.value,
      mriexpires: this.modalityExceptionsFormControls.mriexpires.value,

      ctexception: this.modalityExceptionsFormControls.ctexception.value,
      ctexceptionDescription: this.modalityExceptionsFormControls.ctexceptionDescription.value,
      ctexpires: this.modalityExceptionsFormControls.ctexpires.value,

      xrexception: this.modalityExceptionsFormControls.xrexception.value,
      xrexceptionDescription: this.modalityExceptionsFormControls.xrexceptionDescription.value,
      xrayexpires: this.modalityExceptionsFormControls.xrayexpires.value,

      arthoException: this.modalityExceptionsFormControls.arthoException.value,
      arthoExceptionDescription: this.modalityExceptionsFormControls.arthoExceptionDescription.value,
      arthoExpires: this.modalityExceptionsFormControls.arthoExpires.value,

      bnexception: this.modalityExceptionsFormControls.bnexception.value,
      bnexceptionDescription: this.modalityExceptionsFormControls.bnexceptionDescription.value,
      bnexpires: this.modalityExceptionsFormControls.bnexpires.value,

      mammoException: this.modalityExceptionsFormControls.mammoException.value,
      mammoExceptionDescription: this.modalityExceptionsFormControls.mammoExceptionDescription.value,
      mammoExpires: this.modalityExceptionsFormControls.mammoExpires.value,

      nmexception: this.modalityExceptionsFormControls.nmexception.value,
      nmexceptionDescription: this.modalityExceptionsFormControls.nmexceptionDescription.value,
      nmexpires: this.modalityExceptionsFormControls.nmexpires.value,

      psexception: this.modalityExceptionsFormControls.psexception.value,
      psexceptionDescription: this.modalityExceptionsFormControls.psexceptionDescription.value,
      psexpires: this.modalityExceptionsFormControls.psexpires.value,

      usexception: this.modalityExceptionsFormControls.usexception.value,
      usexceptionDescription: this.modalityExceptionsFormControls.usexceptionDescription.value,
      usexpires: this.modalityExceptionsFormControls.usexpires.value,

      myElogramServiceException: this.modalityExceptionsFormControls.myElogramServiceException.value,
      myElogramServiceexpDescription: this.modalityExceptionsFormControls.myElogramServiceexpDescription.value,
      myElogramExpires: this.modalityExceptionsFormControls.myElogramExpires.value,

      dexaServiceException: this.modalityExceptionsFormControls.dexaServiceException.value,
      dexaServiceexpDescription: this.modalityExceptionsFormControls.dexaServiceexpDescription.value,
      dexaExpires: this.modalityExceptionsFormControls.dexaExpires.value,

      ctArthroServiceException: this.modalityExceptionsFormControls.ctArthroServiceException.value,
      ctArthroServiceexpDescription: this.modalityExceptionsFormControls.ctArthroServiceexpDescription.value,
      ctArthoExpires: this.modalityExceptionsFormControls.ctArthoExpires.value,

      ///// Modality Scheduling Detail Tab Form Controls

      schedulingSunOpenFrom: this.facilitySchedulingDetailFormControls.schedulingSunOpenFrom.value,
      schedulingSunOpenTo: this.facilitySchedulingDetailFormControls.schedulingSunOpenTo.value,
      schedulingSunOpenFrom2: this.facilitySchedulingDetailFormControls.schedulingSunOpenFrom2.value,
      schedulingSunOpenTo2: this.facilitySchedulingDetailFormControls.schedulingSunOpenTo2.value,
      schedulingMonOpenFrom: this.facilitySchedulingDetailFormControls.schedulingMonOpenFrom.value,
      schedulingMonOpenTo: this.facilitySchedulingDetailFormControls.schedulingMonOpenTo.value,
      schedulingMonOpenFrom2: this.facilitySchedulingDetailFormControls.schedulingMonOpenFrom2.value,
      schedulingMonOpenTo2: this.facilitySchedulingDetailFormControls.schedulingMonOpenTo2.value,
      shedulingTueOpenFrom: this.facilitySchedulingDetailFormControls.shedulingTueOpenFrom.value,
      shedulingTueOpenTo: this.facilitySchedulingDetailFormControls.shedulingTueOpenTo.value,
      shedulingTueOpenFrom2: this.facilitySchedulingDetailFormControls.shedulingTueOpenFrom2.value,
      shedulingTueOpenTo2: this.facilitySchedulingDetailFormControls.shedulingTueOpenTo2.value,
      shedulingWedOpenFrom: this.facilitySchedulingDetailFormControls.shedulingWedOpenFrom.value,
      shedulingWedOpenTo: this.facilitySchedulingDetailFormControls.shedulingWedOpenTo.value,
      shedulingWedOpenFrom2: this.facilitySchedulingDetailFormControls.shedulingWedOpenFrom2.value,
      shedulingWedOpenTo2: this.facilitySchedulingDetailFormControls.shedulingWedOpenTo2.value,
      shedulingThuOpenFrom: this.facilitySchedulingDetailFormControls.shedulingThuOpenFrom.value,
      shedulingThuOpenTo: this.facilitySchedulingDetailFormControls.shedulingThuOpenTo.value,
      shedulingThuOpenFrom2: this.facilitySchedulingDetailFormControls.shedulingThuOpenFrom2.value,
      shedulingThuOpenTo2: this.facilitySchedulingDetailFormControls.shedulingThuOpenTo2.value,
      shedulingFriOpenFrom: this.facilitySchedulingDetailFormControls.shedulingFriOpenFrom.value,
      shedulingFriOpenTo: this.facilitySchedulingDetailFormControls.shedulingFriOpenTo.value,
      shedulingFriOpenFrom2: this.facilitySchedulingDetailFormControls.shedulingFriOpenFrom2.value,
      shedulingFriOpenTo2: this.facilitySchedulingDetailFormControls.shedulingFriOpenTo2.value,
      shedulingSatOpenFrom: this.facilitySchedulingDetailFormControls.shedulingSatOpenFrom.value,
      shedulingSatOpenTo: this.facilitySchedulingDetailFormControls.shedulingSatOpenTo.value,
      shedulingSatOpenFrom2: this.facilitySchedulingDetailFormControls.shedulingSatOpenFrom2.value,
      shedulingSatOpenTo2: this.facilitySchedulingDetailFormControls.shedulingSatOpenTo2.value,

      sunOpenFrom: this.facilitySchedulingDetailFormControls.sunOpenFrom.value,
      sunOpenTo: this.facilitySchedulingDetailFormControls.sunOpenTo.value,
      sunOpenFrom2: this.facilitySchedulingDetailFormControls.sunOpenFrom2.value,
      sunOpenTo2: this.facilitySchedulingDetailFormControls.sunOpenTo2.value,
      monOpenFrom: this.facilitySchedulingDetailFormControls.monOpenFrom.value,
      monOpenTo: this.facilitySchedulingDetailFormControls.monOpenTo.value,
      monOpenFrom2: this.facilitySchedulingDetailFormControls.monOpenFrom2.value,
      monOpenTo2: this.facilitySchedulingDetailFormControls.monOpenTo2.value,
      tueOpenFrom: this.facilitySchedulingDetailFormControls.tueOpenFrom.value,
      tueOpenTo: this.facilitySchedulingDetailFormControls.tueOpenTo.value,
      tueOpenFrom2: this.facilitySchedulingDetailFormControls.tueOpenFrom2.value,
      tueOpenTo2: this.facilitySchedulingDetailFormControls.tueOpenTo2.value,
      wedOpenFrom: this.facilitySchedulingDetailFormControls.wedOpenFrom.value,
      wedOpenTo: this.facilitySchedulingDetailFormControls.wedOpenTo.value,
      wedOpenFrom2: this.facilitySchedulingDetailFormControls.wedOpenFrom2.value,
      wedOpenTo2: this.facilitySchedulingDetailFormControls.wedOpenTo2.value,
      thuOpenFrom: this.facilitySchedulingDetailFormControls.thuOpenFrom.value,
      thuOpenTo: this.facilitySchedulingDetailFormControls.thuOpenTo.value,
      thuOpenFrom2: this.facilitySchedulingDetailFormControls.thuOpenFrom2.value,
      thuOpenTo2: this.facilitySchedulingDetailFormControls.thuOpenTo2.value,
      friOpenFrom: this.facilitySchedulingDetailFormControls.friOpenFrom.value,
      friOpenTo: this.facilitySchedulingDetailFormControls.friOpenTo.value,
      friOpenFrom2: this.facilitySchedulingDetailFormControls.friOpenFrom2.value,
      friOpenTo2: this.facilitySchedulingDetailFormControls.friOpenTo2.value,
      satOpenFrom: this.facilitySchedulingDetailFormControls.satOpenFrom.value,
      satOpenTo: this.facilitySchedulingDetailFormControls.satOpenTo.value,
      satOpenFrom2: this.facilitySchedulingDetailFormControls.satOpenFrom2.value,
      satOpenTo2: this.facilitySchedulingDetailFormControls.satOpenTo2.value,

      ctSunOpenFrom: this.facilitySchedulingDetailFormControls.ctSunOpenFrom.value,
      ctSunOpenTo: this.facilitySchedulingDetailFormControls.ctSunOpenTo.value,
      ctSunOpenFrom2: this.facilitySchedulingDetailFormControls.ctSunOpenFrom2.value,
      ctSunOpenTo2: this.facilitySchedulingDetailFormControls.ctSunOpenTo2.value,
      ctMonOpenFrom: this.facilitySchedulingDetailFormControls.ctMonOpenFrom.value,
      ctMonOpenTo: this.facilitySchedulingDetailFormControls.ctMonOpenTo.value,
      ctMonOpenFrom2: this.facilitySchedulingDetailFormControls.ctMonOpenFrom2.value,
      ctMonOpenTo2: this.facilitySchedulingDetailFormControls.ctMonOpenTo2.value,
      ctTueOpenFrom: this.facilitySchedulingDetailFormControls.ctTueOpenFrom.value,
      ctTueOpenTo: this.facilitySchedulingDetailFormControls.ctTueOpenTo.value,
      ctTueOpenFrom2: this.facilitySchedulingDetailFormControls.ctTueOpenFrom2.value,
      ctTueOpenTo2: this.facilitySchedulingDetailFormControls.ctTueOpenTo2.value,
      ctWedOpenFrom: this.facilitySchedulingDetailFormControls.ctWedOpenFrom.value,
      ctWedOpenTo: this.facilitySchedulingDetailFormControls.ctWedOpenTo.value,
      ctWedOpenFrom2: this.facilitySchedulingDetailFormControls.ctWedOpenFrom2.value,
      ctWedOpenTo2: this.facilitySchedulingDetailFormControls.ctWedOpenTo2.value,
      ctThuOpenFrom: this.facilitySchedulingDetailFormControls.ctThuOpenFrom.value,
      ctThuOpenTo: this.facilitySchedulingDetailFormControls.ctThuOpenTo.value,
      ctThuOpenFrom2: this.facilitySchedulingDetailFormControls.ctThuOpenFrom2.value,
      ctThuOpenTo2: this.facilitySchedulingDetailFormControls.ctThuOpenTo2.value,
      ctFriOpenFrom: this.facilitySchedulingDetailFormControls.ctFriOpenFrom.value,
      ctFriOpenTo: this.facilitySchedulingDetailFormControls.ctFriOpenTo.value,
      ctFriOpenFrom2: this.facilitySchedulingDetailFormControls.ctFriOpenFrom2.value,
      ctFriOpenTo2: this.facilitySchedulingDetailFormControls.ctFriOpenTo2.value,
      ctSatOpenFrom: this.facilitySchedulingDetailFormControls.ctSatOpenFrom.value,
      ctSatOpenTo: this.facilitySchedulingDetailFormControls.ctSatOpenTo.value,
      ctSatOpenFrom2: this.facilitySchedulingDetailFormControls.ctSatOpenFrom2.value,
      ctSatOpenTo2: this.facilitySchedulingDetailFormControls.ctSatOpenTo2.value,

      sunXrayFrom: this.facilitySchedulingDetailFormControls.sunXrayFrom.value,
      sunXrayTo: this.facilitySchedulingDetailFormControls.sunXrayTo.value,
      sunXrayFrom2: this.facilitySchedulingDetailFormControls.sunXrayFrom2.value,
      sunXrayTo2: this.facilitySchedulingDetailFormControls.sunXrayTo2.value,
      monXrayFrom: this.facilitySchedulingDetailFormControls.monXrayFrom.value,
      monXrayTo: this.facilitySchedulingDetailFormControls.monXrayTo.value,
      monXrayFrom2: this.facilitySchedulingDetailFormControls.monXrayFrom2.value,
      monXrayTo2: this.facilitySchedulingDetailFormControls.monXrayTo2.value,
      tueXrayFrom: this.facilitySchedulingDetailFormControls.tueXrayFrom.value,
      tueXrayTo: this.facilitySchedulingDetailFormControls.tueXrayTo.value,
      tueXrayFrom2: this.facilitySchedulingDetailFormControls.tueXrayFrom2.value,
      tueXrayTo2: this.facilitySchedulingDetailFormControls.tueXrayTo2.value,
      wedXrayFrom: this.facilitySchedulingDetailFormControls.wedXrayFrom.value,
      wedXrayTo: this.facilitySchedulingDetailFormControls.wedXrayTo.value,
      wedXrayFrom2: this.facilitySchedulingDetailFormControls.wedXrayFrom2.value,
      wedXrayTo2: this.facilitySchedulingDetailFormControls.wedXrayTo2.value,
      thuXrayFrom: this.facilitySchedulingDetailFormControls.thuXrayFrom.value,
      thuXrayTo: this.facilitySchedulingDetailFormControls.thuXrayTo.value,
      thuXrayFrom2: this.facilitySchedulingDetailFormControls.thuXrayFrom2.value,
      thuXrayTo2: this.facilitySchedulingDetailFormControls.thuXrayTo2.value,
      friXrayFrom: this.facilitySchedulingDetailFormControls.friXrayFrom.value,
      friXrayTo: this.facilitySchedulingDetailFormControls.friXrayTo.value,
      friXrayFrom2: this.facilitySchedulingDetailFormControls.friXrayFrom2.value,
      friXrayTo2: this.facilitySchedulingDetailFormControls.friXrayTo2.value,
      satXrayFrom: this.facilitySchedulingDetailFormControls.satXrayFrom.value,
      satXrayTo: this.facilitySchedulingDetailFormControls.satXrayTo.value,
      satXrayFrom2: this.facilitySchedulingDetailFormControls.satXrayFrom2.value,
      satXrayTo2: this.facilitySchedulingDetailFormControls.satXrayTo2.value,
      parking: this.facilitySchedulingDetailFormControls.parking.value,
      preArrivalTime: this.facilitySchedulingDetailFormControls.preArrivalTime.value,
      xrayWalkIn: this.facilitySchedulingDetailFormControls.xrayWalkIn.value,

      //// Notes TAB Have Different API's


      //// Facility Parent Detail Tab Form Controls

      facilityParentName: this.facilityParentCompanyFormControls.facilityParentName.value,
      //facilityParentId:this.facilityParentCompanyFormControls.facilityParentId.value,
      parentAddress: this.facilityParentCompanyFormControls.parentAddress.value,
      parentCity: this.facilityParentCompanyFormControls.parentCity.value,
      parentState: this.facilityParentCompanyFormControls.parentState.value,
      parentZip: this.facilityParentCompanyFormControls.parentZip.value,
      parentWebsite: this.facilityParentCompanyFormControls.parentWebsite.value,
      parentOwnerName: this.facilityParentCompanyFormControls.parentOwnerName.value,
      parentOwnerPhone: this.facilityParentCompanyFormControls.parentOwnerPhone.value != null ? this.facilityParentCompanyFormControls.parentOwnerPhone.value.replace(/\D+/g, '') : '',
      parentOwnerEmail: this.facilityParentCompanyFormControls.parentOwnerEmail.value,
      parentOwnerFax: this.facilityParentCompanyFormControls.parentOwnerFax.value != null ? this.facilityParentCompanyFormControls.parentOwnerFax.value.replace(/\D+/g, '') : '',
      parentManagerName: this.facilityParentCompanyFormControls.parentManagerName.value,
      parentManagerEmail: this.facilityParentCompanyFormControls.parentManagerEmail.value,
      parentManagerPhone: this.facilityParentCompanyFormControls.parentManagerPhone.value != null ? this.facilityParentCompanyFormControls.parentManagerPhone.value.replace(/\D+/g, '') : '',
      parentManagerFax: this.facilityParentCompanyFormControls.parentManagerFax.value != null ? this.facilityParentCompanyFormControls.parentManagerFax.value.replace(/\D+/g, '') : '',
      parentITName: this.facilityParentCompanyFormControls.parentITName.value,
      parentITEmail: this.facilityParentCompanyFormControls.parentITEmail.value,
      parentITPhone: this.facilityParentCompanyFormControls.parentITPhone.value != null ? this.facilityParentCompanyFormControls.parentITPhone.value.replace(/\D+/g, '') : '',
      parentITFax: this.facilityParentCompanyFormControls.parentITFax.value != null ? this.facilityParentCompanyFormControls.parentITFax.value.replace(/\D+/g, '') : '',
      parentBillingName: this.facilityParentCompanyFormControls.parentBillingName.value,
      parentBillingEmail: this.facilityParentCompanyFormControls.parentBillingEmail.value,
      parentBillingPhone: this.facilityParentCompanyFormControls.parentBillingPhone.value != null ? this.facilityParentCompanyFormControls.parentBillingPhone.value.replace(/\D+/g, '') : '',
      parentBillingFax: this.facilityParentCompanyFormControls.parentBillingFax.value != null ? this.facilityParentCompanyFormControls.parentBillingFax.value.replace(/\D+/g, '') : '',

      //// Intake Tab Form Controls

      isPacketDocOnly: this.facilityIntakeFormControls.isPacketDocOnly.value,
      isMriScreeningForm: this.facilityIntakeFormControls.isMriScreeningForm.value,
      IsXrayWaiverForm: this.facilityIntakeFormControls.IsXrayWaiverForm.value,
      IsFaxIntakePacket: this.facilityIntakeFormControls.IsFaxIntakePacket.value,
      intakeFax1: this.facilityIntakeFormControls.intakeFax1.value != null ? this.facilityIntakeFormControls.intakeFax1.value.replace(/\D+/g, '') : '',
      intakeFax2: this.facilityIntakeFormControls.intakeFax2.value != null ? this.facilityIntakeFormControls.intakeFax2.value.replace(/\D+/g, '') : '',
      intakeFax3: this.facilityIntakeFormControls.intakeFax3.value != null ? this.facilityIntakeFormControls.intakeFax3.value.replace(/\D+/g, '') : '',
      intakeFax4: this.facilityIntakeFormControls.intakeFax4.value != null ? this.facilityIntakeFormControls.intakeFax4.value.replace(/\D+/g, '') : '',
      intakeFax5: this.facilityIntakeFormControls.intakeFax5.value != null ? this.facilityIntakeFormControls.intakeFax5.value.replace(/\D+/g, '') : '',
      isEmailIntakePacket: this.facilityIntakeFormControls.isEmailIntakePacket.value,
      intakeEmail1: this.facilityIntakeFormControls.intakeEmail1.value,
      intakeEmail2: this.facilityIntakeFormControls.intakeEmail2.value,
      intakeEmail3: this.facilityIntakeFormControls.intakeEmail3.value,
      intakeEmail4: this.facilityIntakeFormControls.intakeEmail4.value,
      intakeEmail5: this.facilityIntakeFormControls.intakeEmail5.value,
      isElectricIntake: this.facilityIntakeFormControls.isElectricIntake.value,
      isElecScreenForm: this.facilityIntakeFormControls.isElecScreenForm.value,
      isRxnotification: this.facilityIntakeFormControls.isRxnotification.value,
      isPrescreening: this.facilityIntakeFormControls.isPrescreening.value,
      userList: this.selectedEpicUserList ? this.selectedEpicUserList.toString() : '',
      //facilityPolicy:this.facilityPolicy!=null?this.facilityPolicy.toString():'',
      //parentPolicy:this.parentPolicy!=null?this.parentPolicy.toString():''
      facilityPolicy: this.facilityPolicyFormControls.facilityPolicy.value,
      parentPolicy: this.facilityPolicyFormControls.parentPolicy.value
      /// Tag Tab Have Different API
    }

    this.facilityService.addFacility(true, body).subscribe((res) => {
      if (res.response != null) {
        this.showNotificationOnSucess(res);
      }
      else {
        this.showNotificationOnFailure(res);
      }
    }, (err) => {
      this.errorNotification(err);
    })
  }

  parentDropDownOnChange($event: any) {

    this.parentDropDownModel = $event.target.options[$event.target.options.selectedIndex].text;
  }

  resetFacilityForm() {
    this.facilityName = 'Add New Facility'
    this.defaultPopupTab = 'General Info';
    this.isApplyAndOkBtnVisisble = false;
    this.isInsertBtnVisisble = true;
    this.generalInfoForm.reset();
    this.facilityContactDetailForm.reset();
    this.modalityServiceForm.reset();
    this.modalityMriForm.reset();
    this.modalityCtForm.reset();
    this.modalityExceptionsForm.reset();
    this.facilitySchedulingDetailForm.reset();
    this.facilityNotesForm.reset();
    this.facilityParentCompanyForm.reset();
    this.facilityPricingList = [];
    this.facilityPricingHistoryList = [];
    this.facilityIntakeForm.reset();
    this.facilityTagForm.reset();
    this.submitted = false;
    this.facilityPolicy = '';
    this.parentPolicy = '';
    this.isPopUpInEditMode = false;
    this.facilityPoliciesForm.reset();
    this.blockLeasePaymentList = [];
    this.blockLeasePaymentMappingList = [];
    this.blockLeaseCreditList = [];
  }
  reLoadAllFacility() {
    this.getSchedulingFacilities();
  }

  getSchedulingFacilityDetail(row: any) {

    this.facilityId = row.data.facilityId;
    if (this.facilityId) {
      this.getFacilityDetail1()
    }
  }
  getFacilityDetail1() {

    let body = this.getApplyFilter(true, this.facilityId.toString(), 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
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
      else if (res.responseCode === 400) {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  unSuccessNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Something went wrong.',
      alertMessage: '',
      alertType: data.responseCode
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

  getApplyFilter(isActive: boolean, facilityId: any, brokerId: any, facilityName: any, parentCompanyName: any,
    xraywalikIn: any, financialType: any, modality: any, daysOfWeek: any, xrayWeek: any, mriType: any, mriStrength: any,
    mriMake: any, mriWeight: any, mriContrast: any, mriSedation: any, mriBreast: any,
    ctSlices: any, ctMake: any, ctWeight: any, ctContrast: any,
    ctSedation: any, ctBreast: any, workZip: any, homeZip: any): any {
    return {
      'isActive': isActive, 'facilityId': facilityId.toString(), 'brokerId': brokerId, 'facilityName': facilityName,
      'parentCompanyName': parentCompanyName, 'xraywalikIn': xraywalikIn, 'financialType': financialType,
      'modality': modality, 'daysOfWeek': daysOfWeek, 'xrayWeek': xrayWeek,
      'mriType': mriType, 'mriStrength': mriStrength, 'mriMake': mriMake, 'mriWeight': mriWeight, 'mriContrast': mriContrast,
      'mriSedation': mriSedation, 'mriBreast': mriBreast, 'ctSlices': ctSlices,
      'ctMake': ctMake, 'ctWeight': ctWeight, 'ctContrast': ctContrast,
      'ctSedation': ctSedation, 'ctBreast': ctBreast, 'workZip': workZip, 'homeZip': homeZip
    }
  }

  saveChangesCurrentPricing() {
    this.submitted = true;
    this.facilityService.updateFacilityPricing(true, this.facilityPricingList).subscribe((res) => {
      if (res.response != null) {
        this.showNotificationOnSucess(res);
        setTimeout(() => {
          this.getFacilityDetailById();
        }, 200);

      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  onExporting() {

    let element = document.getElementById('scheduling-Facility-grid-container');
    let instance = DataGrid.getInstance(element) as DataGrid;
    this.commonMethodService.onExporting(instance, 'SchedulingFacility')
  }
  createDuplicateFacility() {
    if (this.gridSelectedRows.length === 0 || this.gridSelectedRows.length > 1) {
      if (this.gridSelectedRows.length === 0)
        this.CodeErrorNotification('Please select facility to duplicate');
      else
        this.CodeErrorNotification('Please select only one facility to duplicate');

      return;
    }
    this.duplicateFacility();
  }
  duplicateFacility() {
    const facilityId = Number(this.gridSelectedRows.toString())
    this.facilityService.createDuplicateFacility(true, facilityId).subscribe((res) => {

      if (res.response != null && res.response === true) {
        this.showNotificationOnSucess(res);
        this.reLoadAllFacility();
      }
      else {
        this.showNotificationOnFailure(res);
      }
    }, (err) => {
      this.errorNotification(err);
    });
  }
  tabClick(tabName) {
    this.defaultPopupTab = tabName;
    if (
      this.defaultPopupTab == 'LeaseAgreements' ||
      this.defaultPopupTab == 'LeaseAgreement_MRI' ||
      this.defaultPopupTab == 'LeaseAgreement_CT'
    ) {
      this.MRIPageNumber = 1;
      this.MRIpageSize = 20;
      this.getLeaseAgreementsByFacilityId(this.facilityId);
    }
    if (
      this.defaultPopupTab == 'BlockLeaseRate' ||
      this.defaultPopupTab == 'Leases'
    ) {
      this.getBlockLeasePricing(this.facilityId);
    }
    if (this.defaultPopupTab == 'LeasePayments' || this.defaultPopupTab == 'LeasePaymentsUnPaid') {
      this.getUnpaidLeases(); this.getFacilityCreditsUnUsed();
    }
    if (this.defaultPopupTab == 'LeasePaymentsPaid') {
      this.getblockLeasePaymentByFacilityId(this.facilityId);
    }
    if (this.defaultPopupTab == 'Credit/Debit') {
      this.getAllBlockLeaseCredits();
    }
  }
  CodeErrorNotification(msg: string) {
    this.notificationService.showNotification({
      alertHeader: msg,
      alertMessage: '',
      alertType: 400,
    });
  }
  onCellUpdating(currentRowData) {
    let Body = {
      'FID': currentRowData.key.facilityId,
      'Type': currentRowData.key.modType,
      'IsReadOnly': currentRowData.key.isReadOnly,
      'CurrentGlobal': currentRowData.key.currentGlobal ?? 0,
      'CurrentTech': currentRowData.key.currentTech ?? 0,
      'PricingCutOff': currentRowData.key.pricingCutOff,
      'NewGlobal': currentRowData.key.newGlobal ?? 0,
      'NewTech': currentRowData.key.newTech ?? 0,
      'PriceTier': currentRowData.key.priceTier,
      'IsCopyPrice': !currentRowData.key.isCopyPrice
    }
    this.facilityService.AddCopyPrice(true, Body).subscribe((res) => {
      if (res.response != null && res.responseCode === 200) {
        this.showNotificationOnSucess(res);
        this.reLoadAllFacility();
      }
      else {
        this.showNotificationOnFailure(res);
      }
    }, (err) => {
      // this.errorNotification(err);
    });
  }
  customizeText(cellInfo) {
    return cellInfo.valueText.replace('USD', '$');
  }

  getFacilityCreditsUnUsed() {
    var data = {
      FacilityId: this.facilityId,
      pageNo: this.pageNumberOfUnusedCredits,
      pageSize: this.pageSizeOfUnusdCredits,
    };

    this.blockleasescheduler.getFacilityCreditsUnUsed(
        true,
        JSON.stringify(JSON.stringify(data)).toString()
      ).subscribe(
        (res) => {
          if (res.response != null && res.response.length > 0) {
            this.UnusedCreditsList = res.response;
            this.totalRecordunUsedCredits = res.response[0].TotalRecords;
          } else {
            this.totalRecordunUsedCredits = 1;
            this.UnusedCreditsList = [];
          }
        },
        (err: any) => {
          this.errorNotification(err);
        }
      );
  }
  deleteUnusedCredit() {
    var unUsedCreditId: string = '';
    if (this.deleteUnusedCreditDetail.data.CreditId) {
      unUsedCreditId = this.deleteUnusedCreditDetail.data.CreditId;
      let body = {
        unUsedCreditId: unUsedCreditId,
      };
      this.blockleasescheduler
        .deleteUnusedCreditByCreditId(
          true,
          JSON.stringify(JSON.stringify(body)).toString()
        )
        .subscribe((res) => {
          if (res) {
            if (res.response.ResponseCode == 200) {
              this.showNotificationOnCreditDeleted(res.response);
              this.getAllBlockLeaseCredits();
            } else {
              this.showNotificationOnCreditDeleted(res.response);
            }
          }
        });
    }
  }
  deleteConfirmUnusedCredit(e) {
    this.hiddenDeleteUnusedCreditLink.nativeElement.click();
    this.deleteUnusedCreditDetail = e;
  }
  showNotificationOnCreditDeleted(data: any) {
    this.notificationService.showNotification({
      alertHeader: data.Message,
      alertMessage: '',
      alertType: data.ResponseCode,
    });
  }
  onPageNumberChangeunUsedcredits(pageNumber: any) {
    this.pageNumberOfUnusedCredits = pageNumber;
    this.getFacilityCreditsUnUsed();
  }
  getUnpaidLeases() {
    var data = {
      FacilityId: this.facilityId,
      PageNumber: this.pageNumberOfUnpaidLeases,
      PageSize: this.pageSizeOfUnpaidLeases,
    };
    this.blockleasescheduler
      .getUnpaidLeases(true, JSON.stringify(JSON.stringify(data)).toString())
      .subscribe(
        (res) => {
          if (res.response != null && res.response.length > 0) {
            this.GetUnpaidLeasesList = res.response;
            this.totalRecordUnpaidLeases = res.response[0].TotalRecords;
          } else {
            this.totalRecordUnpaidLeases = 1;
            this.GetUnpaidLeasesList = [];
          }
        },
        (err: any) => {
          this.errorNotification(err);
        }
      );
  }
  onPageNumberChangeUnpaidLesaes(pageNumber: any) {
    this.pageNumberOfUnpaidLeases = pageNumber;
    this.getUnpaidLeases();
  }
  onSelectionChangedLease(el) {
    var leaseID: any = [];
    this.selectedleaseArray = el.selectedRowsData;
    if (el.selectedRowsData.length !== 0) {
    this.selectedleaseArray = el.selectedRowsData;
      this.btnActive = 1;
      el.selectedRowsData.forEach((i) => {
        leaseID.push(i.LeaseId);
      });
      this.leaseIdArray = leaseID;
    } else {
      this.btnActive = 0;
    }
  }
  onSelectionChangedCredit(ec) {
    var CreditID: any = [];
    this.selectedCreditPayment = ec.selectedRowsData;
    if (ec.selectedRowsData.length !== 0) {
      ec.selectedRowsData.forEach((i) => {
        CreditID.push(i.CreditId);
      });
      this.creditIdArray = CreditID;
    }
  }
  UnpaidButtonClick(e) {
    var TotalLease = 0, TotalCredit = 0;
    for (let i = 0; i < this.selectedleaseArray.length; i++) {
      TotalLease += this.selectedleaseArray[i].TotalAmount;
    }
    for (let i = 0; i < this.selectedCreditPayment.length; i++) {
      TotalCredit += this.selectedCreditPayment[i]['Credit Amount'];
    }
    var leaseIdListTemp = this.leaseIdArray ? this.leaseIdArray.join(",") : '';
    var creditIdListTemp = this.creditIdArray ? this.creditIdArray.join(",") : '';
    var data = {
      "LeaseId": leaseIdListTemp,
      "CreditId": creditIdListTemp,
      "LeaseAmount": TotalLease,
      "CreditAmount": TotalCredit
    }
    this.blockleasescheduler.getTotalAmountToPay(true, JSON.stringify(JSON.stringify(data)).toString()).subscribe((res) => {
      if (res.response[0].TotalAmount >= 0) {
        const modalRef = this.modalService.open(PayInvoiceModalComponent, { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small payment-invoice-popup' });
        modalRef.componentInstance.AmountDetails = res.response[0];
        modalRef.componentInstance.selectedleases = this.selectedleaseArray;
        modalRef.componentInstance.selectedCreditIds = creditIdListTemp;
        modalRef.componentInstance.TotalCreditsAmount = TotalCredit;
        modalRef.componentInstance.TotalLeasesAmount = TotalLease;
        modalRef.componentInstance.facilityId = this.facilityId;
        modalRef.result.then(
          (result) => {
            modalRef.close();
          },
          (reason) => {
            if (reason == 5) {
              this.getUnpaidLeases();
              this.getFacilityCreditsUnUsed();
              modalRef.close();
            }
            else {
              // this.unSuccessNotification(reason);
            }
          }
        );
      }
      else{

        this.notificationService.showNotification({
          alertHeader: 'Error',
          alertMessage: 'Pay invoice amount should be greater than or equal to 0',
          alertType: 400,
        });  
      }
    });
  }
  CheckSameCombinationMRI(type: string) {
    const Mri1Type = this.modalityMriForm.controls['mri1type'].value;
    const Mri1ResourceName = this.modalityMriForm.controls['mri1ResourceName'].value
      ? this.modalityMriForm.controls['mri1ResourceName'].value
      : '';
    const Mri2Type = this.modalityMriForm.controls['mri2type'].value;
    const Mri2ResourceName = this.modalityMriForm.controls['mri2ResourceName']
      .value
      ? this.modalityMriForm.controls['mri2ResourceName'].value
      : '';
    const Mri3Type = this.modalityMriForm.controls['mri3type'].value;
    const Mri3ResourceName = this.modalityMriForm.controls['mri3ResourceName']
      .value
      ? this.modalityMriForm.controls['mri3ResourceName'].value
      : '';

    if (parseInt(Mri1ResourceName) == parseInt(Mri2ResourceName)) {
      this.modalityMriForm.patchValue({
        ['mri2ResourceName']: 0,
      });
      this.MRIDuplicateResourceNotification();

    }
    if (parseInt(Mri2ResourceName) == parseInt(Mri3ResourceName)) {
      this.modalityMriForm.patchValue({
        ['mri3ResourceName']: 0,
      });
      this.MRIDuplicateResourceNotification();

    }
    if (parseInt(Mri1ResourceName) == parseInt(Mri3ResourceName)) {
      this.modalityMriForm.patchValue({
        ['mri3ResourceName']: 0,
      });
      this.MRIDuplicateResourceNotification();

    }
    var Dictionary = {
      Type1: Mri1Type + ' ' + Mri1ResourceName,
      Type2: Mri2Type + ' ' + Mri2ResourceName,
      Type3: Mri3Type + ' ' + Mri3ResourceName,
    };
    if (type == 'Type1' || type == 'Resource1') {
      if (
        (Dictionary.Type1 == Dictionary.Type2 ||
          Dictionary.Type2 == Dictionary.Type3 ||
          Dictionary.Type1 == Dictionary.Type3) &&
        (Mri3ResourceName != '' ||
          Mri2ResourceName != '' ||
          Mri1ResourceName != '')
      ) {
        if (Dictionary.Type1 == Dictionary.Type2) {
          this.modalityMriForm.controls['mri2type'].setValue(null);
          this.modalityMriForm.patchValue({
            ['mri2ResourceName']: 0,
          });

        } else if (Dictionary.Type1 == Dictionary.Type3) {
          this.modalityMriForm.controls['mri3type'].setValue(null);
          this.modalityMriForm.patchValue({
            ['mri3ResourceName']: 0,
          });

        }
      }
    }
    if (type == 'Type2' || type == 'Resource2') {
      if (
        (Dictionary.Type1 == Dictionary.Type2 ||
          Dictionary.Type2 == Dictionary.Type3 ||
          Dictionary.Type1 == Dictionary.Type3) &&
        (Mri3ResourceName != '' ||
          Mri2ResourceName != '' ||
          Mri1ResourceName != '')
      ) {
        if (Dictionary.Type1 == Dictionary.Type2) {
          this.modalityMriForm.controls['mri2type'].setValue(null);

          this.modalityMriForm.patchValue({
            ['mri2ResourceName']: 0,
          });
        } else if (Dictionary.Type2 == Dictionary.Type3) {
          this.modalityMriForm.controls['mri3type'].setValue(null);
          this.modalityMriForm.patchValue({
            ['mri3ResourceName']: 0,
          });

        }
      }
    }
    if (type == 'Type3' || type == 'Resource3') {
      if (
        (Dictionary.Type1 == Dictionary.Type2 ||
          Dictionary.Type2 == Dictionary.Type3 ||
          Dictionary.Type1 == Dictionary.Type3) &&
        (Mri3ResourceName != '' ||
          Mri2ResourceName != '' ||
          Mri1ResourceName != '')
      ) {
        if (Dictionary.Type2 == Dictionary.Type3) {
          this.modalityMriForm.controls['mri2type'].setValue(null);

          this.modalityMriForm.patchValue({
            ['mri2ResourceName']: 0,
          });
        } else if (Dictionary.Type1 == Dictionary.Type3) {
          this.modalityMriForm.controls['mri3type'].setValue(null);

          this.modalityMriForm.patchValue({
            ['mri3ResourceName']: 0,
          });
        }
      }
    }
    if(Mri1Type){
      this.modalityMriForm.get('mri1ResourceName').setValidators([Validators.required, Validators.min(1)])
    }
    else{
      this.modalityMriForm.get('mri1ResourceName').clearValidators()
    }
    if(Mri2Type){
      this.modalityMriForm.get('mri2ResourceName').setValidators([Validators.required, Validators.min(1)])
    }
    else{
      this.modalityMriForm.get('mri2ResourceName').clearValidators()
    }
    if(Mri3Type){
      this.modalityMriForm.get('mri3ResourceName').setValidators([Validators.required, Validators.min(1)])
    }
    else{
      this.modalityMriForm.get('mri3ResourceName').clearValidators()
    }
    this.modalityMriForm.get('mri1ResourceName').updateValueAndValidity();
    this.modalityMriForm.get('mri2ResourceName').updateValueAndValidity();
    this.modalityMriForm.get('mri3ResourceName').updateValueAndValidity();
  }
  MRIDuplicateResourceNotification() {
    this.notificationService.showNotification({
      alertHeader: 'Duplicate MRI Resource Name',
      alertMessage: 'Selection of duplicate MRI resource name is not allowed.',
      alertType: 404,
    });
  }
  CTDuplicateResourceNotification() {
    this.notificationService.showNotification({
      alertHeader: 'Duplicate CT Resource Name',
      alertMessage: 'Selection of duplicate CT resource name is not allowed.',
      alertType: 404,
    });
  }
  CheckSameCombinationCT(type: string) {
    const Ct1Type = this.modalityCtForm.controls['ct1make'].value;
    const Ct1ResourceName = this.modalityCtForm.controls['ct1ResourceName']
      .value
      ? this.modalityCtForm.controls['ct1ResourceName'].value
      : '';
    const Ct2Type = this.modalityCtForm.controls['ct2make'].value;
    const Ct2ResourceName = this.modalityCtForm.controls['ct2ResourceName']
      .value
      ? this.modalityCtForm.controls['ct2ResourceName'].value
      : '';
    const Ct3Type = this.modalityCtForm.controls['ct3make'].value;
    const Ct3ResourceName = this.modalityCtForm.controls['ct3ResourceName']
      .value
      ? this.modalityCtForm.controls['ct3ResourceName'].value
      : '';

    if (parseInt(Ct1ResourceName) == parseInt(Ct2ResourceName)) {
      this.modalityCtForm.patchValue({
        ['ct2ResourceName']: 0,
      });
      this.CTDuplicateResourceNotification();

    }
    if (parseInt(Ct2ResourceName) == parseInt(Ct3ResourceName)) {
      this.modalityCtForm.patchValue({
        ['ct3ResourceName']: 0,
      });
      this.CTDuplicateResourceNotification();

    }
    if (parseInt(Ct3ResourceName) == parseInt(Ct1ResourceName)) {
      this.modalityCtForm.patchValue({
        ['ct3ResourceName']: 0,
      });
      this.CTDuplicateResourceNotification();

    }
    var Dictionary = {
      Type1: Ct1Type + ' ' + Ct1ResourceName,
      Type2: Ct2Type + ' ' + Ct2ResourceName,
      Type3: Ct3Type + ' ' + Ct3ResourceName,
    };
    if (type == 'Type1' || type == 'Resource1') {
      if (
        (Dictionary.Type1 == Dictionary.Type2 ||
          Dictionary.Type2 == Dictionary.Type3 ||
          Dictionary.Type1 == Dictionary.Type3) &&
        (Ct1ResourceName != '' ||
          Ct2ResourceName != '' ||
          Ct3ResourceName != '')
      ) {
        if (Dictionary.Type1 == Dictionary.Type2) {
          this.modalityCtForm.controls['ct2make'].setValue(null);
          this.modalityCtForm.patchValue({
            ['ct2ResourceName']: 0,
          });
          //this.modalityCtForm.controls['ct2ResourceName'].setValue(0);
        } else if (Dictionary.Type1 == Dictionary.Type3) {
          this.modalityCtForm.controls['ct3make'].setValue(null);
          this.modalityCtForm.controls['ct3ResourceName'].setValue(0);
        }
      }
    }
    if (type == 'Type2' || type == 'Resource2') {
      if (
        (Dictionary.Type1 == Dictionary.Type2 ||
          Dictionary.Type2 == Dictionary.Type3 ||
          Dictionary.Type1 == Dictionary.Type3) &&
        (Ct1ResourceName != '' ||
          Ct2ResourceName != '' ||
          Ct3ResourceName != '')
      ) {
        if (Dictionary.Type1 == Dictionary.Type2) {
          this.modalityCtForm.controls['ct2make'].setValue(null);
          this.modalityCtForm.patchValue({
            ['ct2ResourceName']: 0,
          });
          //this.modalityCtForm.controls['ct2ResourceName'].setValue(0);
        } else if (Dictionary.Type2 == Dictionary.Type3) {
          this.modalityCtForm.controls['ct3make'].setValue(null);
          this.modalityCtForm.controls['ct3ResourceName'].setValue(0);
        }
      }
    }
    if (type == 'Type3' || type == 'Resource3') {
      if (
        (Dictionary.Type1 == Dictionary.Type2 ||
          Dictionary.Type2 == Dictionary.Type3 ||
          Dictionary.Type1 == Dictionary.Type3) &&
        (Ct1ResourceName != '' ||
          Ct2ResourceName != '' ||
          Ct3ResourceName != '')
      ) {
        if (Dictionary.Type2 == Dictionary.Type3) {
          this.modalityCtForm.controls['ct2make'].setValue(null);
          this.modalityCtForm.patchValue({
            ['ct2ResourceName']: 0,
          });
          //this.modalityCtForm.controls['ct2ResourceName'].setValue(0);
        } else if (Dictionary.Type1 == Dictionary.Type3) {
          this.modalityCtForm.controls['ct3make'].setValue(null);
          this.modalityCtForm.patchValue({
            ['ct3ResourceName']: 0,
          });
          // this.modalityCtForm.controls['ct3ResourceName'].setValue(0);
        }
      }
    }

    if(Ct1Type){
      this.modalityCtForm.get('ct1ResourceName').setValidators([Validators.required, Validators.min(1)])
    }
    else{
      this.modalityCtForm.get('ct1ResourceName').clearValidators()
    }
    if(Ct2Type){
      this.modalityCtForm.get('ct2ResourceName').setValidators([Validators.required, Validators.min(1)])
    }
    else{
      this.modalityCtForm.get('ct2ResourceName').clearValidators()
    }
    if(Ct3Type){
      this.modalityCtForm.get('ct3ResourceName').setValidators([Validators.required, Validators.min(1)])
    }
    else{
      this.modalityCtForm.get('ct3ResourceName').clearValidators()
    }
    this.modalityCtForm.get('ct1ResourceName').updateValueAndValidity();
    this.modalityCtForm.get('ct2ResourceName').updateValueAndValidity();
    this.modalityCtForm.get('ct3ResourceName').updateValueAndValidity();
  }

  get generalInfoFormControls() {
    return this.generalInfoForm.controls;
  }
  get facilityContactDetailFormControls() {
    return this.facilityContactDetailForm.controls;
  }
  get modalityServiceFormControls() {
    return this.modalityServiceForm.controls;
  }
  get modalityMriFormControls() {
    return this.modalityMriForm.controls;
  }
  get modalityCtFormControls() {
    return this.modalityCtForm.controls;
  }
  get modalityExceptionsFormControls() {
    return this.modalityExceptionsForm.controls;
  }
  get facilitySchedulingDetailFormControls() {
    return this.facilitySchedulingDetailForm.controls;
  }
  get facilityNotesFormControls() {
    return this.facilityNotesForm.controls;
  }
  get facilityParentCompanyFormControls() {
    return this.facilityParentCompanyForm.controls;
  }
  get facilityIntakeFormControls() {
    return this.facilityIntakeForm.controls;
  }
  get facilityTagFormControls() {
    return this.facilityTagForm.controls;
  }
  get facilityPolicyFormControls() {
    return this.facilityPoliciesForm.controls;
  }
  CloseAddEditModal() {
    this.hiddenAddEditPopUpItem.nativeElement.click();
    this.commonMethodService.OpenFacilityDetailsModel('true');
  }
   ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
  onChangeService(type) {
    if (type == 'mri') {
      this.CheckSameCombinationMRI('Type1');
      this.CheckSameCombinationMRI('Type2');
      this.CheckSameCombinationMRI('Type3');
    }
    else {
      this.CheckSameCombinationCT('Type1');
      this.CheckSameCombinationCT('Type2');
      this.CheckSameCombinationCT('Type3');
    }
  }
}
