import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { ReferrerProcGroup } from 'src/app/models/ReferrerProcGroup';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { ReferrersService } from 'src/app/services/referrers.service';
import { ckeConfig } from 'src/app/constants/Ckeditor';
import { CommonRegex } from 'src/app/constants/commonregex';



@Component({
  selector: 'app-referrer-detail',
  templateUrl: './referrer-detail.component.html',
  styleUrls: ['./referrer-detail.component.css']
})
export class ReferrerDetailComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  @ViewChild('referrer_details', { static: false }) referrer_details: ElementRef;
  @ViewChild ('hiddenButton2', { static: false }) hiddenButton2: ElementRef;
  
  submitted = false;
  modelValue: string = 'modal';
  @ViewChild('content') testidRef: any;
  referrersForm: FormGroup;
  selectedReferrers: any = []
  tempreferrer: any = []
  referrerProcGroupList: ReferrerProcGroup[] = [];
  referrerList: any = [];
  resizingModes: string[] = ['widget', 'nextColumn'];
  sftpProfilesList: any = [];
  docTypeList: any = [];
  selectedDocType: any = [];
  epicUserList: any = [];
  referrerNoteList: any = [];
  popupVisible = false;
  isPoliciesTab :any = false ;
  editAccount = 'none';
  userType: number;
  columnResizingMode: string;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  allMode: string;
  checkBoxesMode: string;
  id: number;
  title: string = 'Add New Referrer';
  Issubmitted :boolean= false;
  //searchText: any ='';
  //exiledOption: any;
  noteText: string = '';
  isNoteButtonDisable: boolean = true;
  noteControl: any;
  //isModalShow:boolean=false;
  //styleBlock:string='none';
  //isPopUpDisplay:boolean=false;
  tagBtnDisabled: boolean = true;
  searchText : string ='';
  groupingNames:boolean = false;
  getBILink: string = '';
  subscription :any;
  ReferrerPoliciesForm: FormGroup;
  readonly commonRegex=CommonRegex;
  name = 'ng2-ckeditor';
  tabId: string = '1'
  //ckeConfig: CKEDITOR.config;
  ckeConfig:any;
  mycontent: string;
  log: string = '';
  readonly CkeConfig = ckeConfig;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;

  constructor(private fb: FormBuilder, private referrersService: ReferrersService, private notificationService: NotificationService,
    private commonMethodService: CommonMethodService, private renderer: Renderer2, private readonly storageService: StorageService) {
    referrersService.sendDataToReferrerDetail.subscribe(res => {
      debugger
      this.getCurrentReferrerDetail(res.title, res.referrerId)
      //this.isPopUpDisplay=true;
      //this.isModalShow=true;
    });
    referrersService.sendDataToReferrerDetailToOrderedSchedular.subscribe(res => {
      debugger
      if(!this.isPoliciesTab){   
        this.updateTabId('edit-referrer-details')
      }else{
       this.isPoliciesTab = res.isPoliciesTab
       this.onTabclick(true)
      }
      this.getCurrentReferrerDetails(res.title, res.referrerId,res.isPoliciesTab) 
    });
    
  }
 
  ngOnInit(): void {
    this.submitted = false;
    this.setGridSetting();
 
    //this.getreferrerById();
    this.referrersForm = this.fb.group({
      //searchText: [''],
      exiled: [''],
      type: [''],
      username: [''],
      groupName: [''],
      role: [''],
      fullName: [''],
      specialty: [''],
      npiphysicianId: [''],
      businessPhoneNumber: [''],
      faxNumber: [''],
      email: [''],
      birthDate: [''],
      sex: [''],
      delivery: [''],
      address: [''],
      zipPostalCode: [''],
      city: [''],
      stateProvince: [''],
      country: [''],
      cellPhoneNumber: [''],
      pagerPhoneNumber: [''],
      notes: [''],
      mri: [''],
      mriwithoutContrast: [''],
      mriwithContrast: [''],
      ct: [''],
      ctwithoutContrast: [''],
      ctwithContrast: [''],
      xray1View: [''],
      xray2Views: [''],
      xray3Views: [''],
      autoFaxFinal: [''],
      autoEmailFinal: [''],
      dateAdded: [''],
      accountContactName1: [''],
      accountEmail1: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      accountPhone1: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      billingContactName1: [''],
      billingEmail1: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      billingPhone1: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      accountContactName2: [''],
      accountEmail2: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      accountPhone2: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      billingContactName2: [''],
      billingEmail2: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      billingPhone2: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      accountContactName3: [''],
      accountEmail3: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      accountPhone3: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      billingContactName3: [''],
      billingEmail3: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      billingPhone3: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      otherContactEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      isAutoEmailReport: [''],
      autoEmailReport: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      autoEmailReportDateTime: [''],
      accountFax1: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      accountFax2: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      accountFax3: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      billingFax1: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      billingFax2: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      billingFax3: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      userid: [''],
      isScheduleEmail: [''],
      scheduleEmail: [''],
      isScheduleFax: [''],
      scheduleFax: [''],
      isNotLienReminder: [''],
      isNotPiLiablility: [''],
      isPatientSignature: [''],
      exiledOption: [''],
      notsendScheduledSummary: [''],
      exiledDate: [''],
      exiledComment: [''],
      doNotBlasts: [''],
      doNotSendEmail: [''],
      doNotSendFax: [''],
      doNotSendMail: [''],
      removeAllMarketingBlast: [''],
      doNotFaxReport: [''],
      reportEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      reportFax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      doNotCouldnotSchedule: [''],
      doNotSendCaseUpdates: [''],
      skipStatus1: [''],
      skipStatus2: [''],
      skipStatus3: [''],
      skipStatus4: [''],
      skipAllStatusUpdates: [''],
      groupingReferrer: [''],
      statusUpdateEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      statusUpdateFax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      isStatusEmail: [''],
      isStatusFax: [''],
      isCouldntStatusEmail: [''],
      couldntStatusEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      isCouldntStatusFax: [''],
      couldntStatusFax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      isAcceptLiabilityFax: [''],
      isAcceptLiabilityEmail: [''],
      acceptLiabilityEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      acceptLiabilityFax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      arpaymentEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      arpaymentFax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      isArpaymentSummaryEmail: [''],
      isArpaymentSummaryFax: [''],
      doNotSendArpaymentSummary: [''],
      doNotSendCaseStatusRequests: [''],
      isDocManage: [''],
      isSftp: [''],
      sftpprofileId: [''],
      docId: [''],
      isMarkettingCredit: [''],
      marketingUser: [''],
      marketingStartDate: [''],
      marketingEnddate: [''],
      verifiedUser: [''],
      verifiedOn: [''],
      isesignEmail: [''],
      noCreateAcceptLiability: [''],
      isReferrerReadingRadiologist: [''],
      isNotRequiredAsl: [''],
      PatientBillName: [''],
      NPI: [''],
      LicenseNumber: [''],
      RadAddress: [''],
      RadEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      RadBillingEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      RadPhone: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      RadFax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      TaxID:['']
    });
    this.createGeneralPoliciesForm();

    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      removePlugins: 'exportpdf'
    };
  }
  onTabclick(isPopOpen: boolean) {
    debugger
    if (this.isPoliciesTab) {
      this.isPoliciesTab = true;
      this.updateTabId('edit-policies')
    }
    else
      this.isPoliciesTab = false;
  }
  
  updateTabId(tabName: string) {
    debugger
    this.tabId = tabName;
  }

  createGeneralPoliciesForm() {
    this.ReferrerPoliciesForm = this.fb.group({
      referrerPolicy: ['',]     
    })
  }
  onChange($event: any): void {
    console.log("onChange");
    //this.log += new Date() + "<br />";
  }
  
  onPaste($event: any): void {
    console.log("onPaste");
    //this.log += new Date() + "<br />";
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
  //   addStyles() {
  //     let styles = {
  //         'display:': this.styleBlock,
  //         'padding-left': '5.99219px',
  //     };
  //     return styles;
  // }
  getCurrentReferrerDetail(title: any, referrerId: any) {
    debugger
    this.title = title;
    this.id = referrerId;
    this.getreferrerById();
    this.referrer_details.nativeElement.click();
  }

  getCurrentReferrerDetails(title: any, referrerId: any,isPoliciesTab:any) {
    debugger
    this.title = title;
    this.id = referrerId;
    this.isPoliciesTab = isPoliciesTab;
    this.getreferrerById();
    this.hiddenButton2.nativeElement.click();
  }

  viewUrl() {
    window.open(this.getBILink, '_blank');
    }

  getreferrerById() { 
    debugger 
    this.onTabclick(true)
    this.referrersService.getReferrerById(true, this.id).subscribe((res) => { 
      this.title = res.response.FullName
      var stringIds = res.response.GroupingReferrer?res.response.GroupingReferrer.split(',').filter(x => x.length>0).toString():''; // split (,).filter(not NULl),.toString
      var array = JSON.parse('[' + stringIds + ']');
      this.getBILink = res.response.BILink;
      this.selectedReferrers = array
      var docId = res.response.DocID?res.response.DocID.split(',').filter(x => x.length>0).toString():'';
      this.selectedDocType = JSON.parse('[' + docId + ']');
      this.ReferrerPoliciesForm.patchValue({
        referrerPolicy:  res.response.Policy      
      });
      this.referrersForm.patchValue({
        type: res.response.Type,
        username: res.response.Username,
        groupName: res.response.GroupName,
        role: res.response.Role,
        fullName: res.response.FullName,
        specialty: res.response.Specialty,
        npiphysicianId: res.response.NPIPhysicianId,
        businessPhoneNumber: res.response.BusinessPhoneNumber,
        faxNumber: res.response.FaxNumber,
        email: res.response.Email,
        birthDate: res.response.BirthDate,
        sex: res.response.Sex,
        delivery: res.response.Delivery,
        address: res.response.Address,
        zipPostalCode: res.response.ZipPostalCode,
        city: res.response.City,
        stateProvince: res.response.StateProvince,
        country: res.response.Country,
        cellPhoneNumber: res.response.CellPhoneNumber,
        pagerPhoneNumber: res.response.PagerPhoneNumber,
        notes: res.response.Notes,
        mri: res.response.MRI,
        mriwithoutContrast: res.response.MRIWithoutContrast,
        mriwithContrast: res.response.MRIWithContrast,
        ct: res.response.CT,
        ctwithoutContrast: res.response.CTWithoutContrast,
        ctwithContrast: res.response.CTWithContrast,
        xray1View: res.response.Xray1View,
        xray2Views: res.response.Xray2Views,
        xray3Views: res.response.Xray3Views,
        autoFaxFinal: res.response.AutoFaxFinal,
        autoEmailFinal: res.response.AutoEmailFinal,
        dateAdded: res.response.DateAdded,
        accountContactName1: res.response.AccountContactName1,
        accountEmail1: res.response.AccountEmail1,
        accountPhone1: res.response.AccountPhone1,
        billingContactName1: res.response.BillingContactName1,
        billingEmail1: res.response.BillingEmail1,
        billingPhone1: res.response.BillingPhone1,
        accountContactName2: res.response.AccountContactName2,
        accountEmail2: res.response.AccountEmail2,
        accountPhone2: res.response.AccountPhone2,
        billingContactName2: res.response.BillingContactName2,
        billingEmail2: res.response.BillingEmail2,
        billingPhone2: res.response.BillingPhone2,
        accountContactName3: res.response.AccountContactName3,
        accountEmail3: res.response.AccountEmail3,
        accountPhone3: res.response.AccountPhone3,
        billingContactName3: res.response.BillingContactName3,
        billingEmail3: res.response.BillingEmail3,
        billingPhone3: res.response.BillingPhone3,
        otherContactEmail: res.response.OtherContactEmail,
        isAutoEmailReport: res.response.IsAutoEmailReport,
        autoEmailReport: res.response.AutoEmailReport,
        autoEmailReportDateTime: res.response.AutoEmailReportDateTime,
        accountFax1: res.response.AccountFax1,
        accountFax2: res.response.AccountFax2,
        accountFax3: res.response.AccountFax3,
        billingFax1: res.response.BillingFax1,
        billingFax2: res.response.BillingFax2,
        billingFax3: res.response.BillingFax3,
        userid: res.response.USERID,
        isScheduleEmail: res.response.IsScheduleEmail,
        scheduleEmail: res.response.ScheduleEmail,
        isScheduleFax: res.response.IsScheduleFax,
        scheduleFax: res.response.ScheduleFax,
        isNotLienReminder: res.response.IsNotLienReminder,
        isNotPiLiablility: res.response.IsNotPiLiablility,
        isPatientSignature: res.response.IsPatientSignature,
        exiled: res.response.Exiled,
        notsendScheduledSummary: res.response.NotsendScheduledSummary,
        exiledDate: res.response.ExiledDate,
        exiledComment: res.response.ExiledComment,
        doNotBlasts: res.response.DoNotBlasts,
        doNotSendEmail: res.response.DoNotSendEmail,
        doNotSendFax: res.response.DoNotSendFax,
        doNotSendMail: res.response.DoNotSendMail,
        removeAllMarketingBlast: res.response.RemoveAllMarketingBlast,
        doNotFaxReport: res.response.DoNotFaxReport,
        reportEmail: res.response.ReportEmail,
        reportFax: res.response.ReportFax,
        doNotCouldnotSchedule: res.response.DoNotCouldnotSchedule,
        doNotSendCaseUpdates: res.response.DoNotSendCaseUpdates,
        skipStatus1: res.response.SkipStatus1,
        skipStatus2: res.response.SkipStatus2,
        skipStatus3: res.response.SkipStatus3,
        skipStatus4: res.response.SkipStatus4,
        skipAllStatusUpdates: res.response.SkipAllStatusUpdates,
        statusUpdateEmail: res.response.StatusUpdateEmail,
        statusUpdateFax: res.response.StatusUpdateFax,
        isStatusEmail: res.response.IsStatusEmail,
        isStatusFax: res.response.IsStatusFax,
        isCouldntStatusEmail: res.response.IsCouldntStatusEmail,
        couldntStatusEmail: res.response.CouldntStatusEmail,
        isCouldntStatusFax: res.response.IsCouldntStatusFax,
        couldntStatusFax: res.response.CouldntStatusFax,
        isAcceptLiabilityFax: res.response.IsAcceptLiabilityFax,
        isAcceptLiabilityEmail: res.response.IsAcceptLiabilityEmail,
        acceptLiabilityEmail: res.response.AcceptLiabilityEmail,
        acceptLiabilityFax: res.response.AcceptLiabilityFax,
        arpaymentEmail: res.response.ARPaymentEmail,
        arpaymentFax: res.response.ARPaymentFax,
        isArpaymentSummaryEmail: res.response.IsARPaymentSummaryEmail,
        isArpaymentSummaryFax: res.response.IsARPaymentSummaryFax,
        doNotSendArpaymentSummary: res.response.DoNotSendARPaymentSummary,
        doNotSendCaseStatusRequests: res.response.DoNotSendCaseStatusRequests,
        isDocManage: res.response.IsDocManage,
        isSftp: res.response.IsSFTP,
        sftpprofileId: parseInt(res.response.SFTPProfileID),
        //docId:  parseInt(res.response.DocID),
        isMarkettingCredit: res.response.IsMarkettingCredit,
        marketingUser: parseInt(res.response.MarketingUser),
        marketingStartDate: res.response.MarketingStartDate,
        marketingEnddate: res.response.MarketingEnddate,
        verifiedUser: res.response.VerifiedUser,
        verifiedOn: res.response.VerifiedOn,
        isesignEmail: res.response.ISESignEmail,
        noCreateAcceptLiability: res.response.NoCreateAcceptLiability,
        isReferrerReadingRadiologist: res.response.IsReferrerReadingRadiologist,
        isNotRequiredAsl: res.response.IsNotRequiredAsl,
        PatientBillName: res.response.PatientBillName,
        NPI: res.response.NPI,
        LicenseNumber: res.response.LicenseNumber,
        RadEmail: res.response.RadEmail,
        RadAddress: res.response.RadAddress,
        RadPhone: res.response.RadPhone,
        RadFax: res.response.RadFax,
        RadBillingEmail: res.response.RadBillingEmail,
        TaxID:res.response.TaxID
      });
      this.getReferrerNotesById();
      this.getReferrerProcGroupByReferrerId();
      this.getSFTPProfiles();
      this.getGroupingNames();
      this.getAllDocumentTypes();
      this.getAllEpicUsers();
      this.textBoxDisabled(res.response.IsAutoEmailReport);
      this.updateExileValidations(this.referrersForm.get('exiled').value);

    },
      (err: any) => {
        this.errorNotification(err);
      });
  }
  getReferrerNotesById() {
    this.referrersService.getReferrerNotes(true, this.id).subscribe((res) => {
      this.referrerNoteList = res.response;
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getReferrerProcGroupByReferrerId() {
    this.referrersService.getReferrerProcGroupByReferrerId(true, this.id).subscribe((res) => {
      this.referrerProcGroupList = res.response;
      this.referrerProcGroupList.forEach(x => {
        this.referrersForm.addControl('PI' + x.ProcGroupId.toString(), new FormControl(x.PIBillingFee));
        this.referrersForm.addControl('Rad' + x.ProcGroupId.toString(), new FormControl(x.RadCost))
      })
    },
      (err: any) => {
        this.errorNotification(err);
      });
  }
  getSFTPProfiles() {
    this.referrersService.getSFTPProfiles(true).subscribe((res) => {
      this.sftpProfilesList = res.response;

    }, (err: any) => {
      this.notificationService.showNotification({
        alertHeader: err.statusText,
        alertMessage: err.message,
        alertType: err.status
      });
    });
  }
  getGroupingNames() {
    if(this.subscription)
    {
      this.subscription.unsubscribe();
    }
      this.subscription  =  this.referrersService.getGroupingNames(true,this.searchText).subscribe((res) => {
      this.referrerList = res.response;
    }, (err: any) => {
      this.notificationService.showNotification({
        alertHeader: err.statusText,
        alertMessage: err.message,
        alertType: err.status
      });
    });
  }
  getAllDocumentTypes() {

    this.referrersService.getAllDocumentTypes(true, 1, 0).subscribe((res) => {
      this.docTypeList = res.response;
    }, (err: any) => {
      this.notificationService.showNotification({
        alertHeader: err.statusText,
        alertMessage: err.message,
        alertType: err.status
      });
    });
  }
  getAllEpicUsers() {
    this.referrersService.getPreciseImagingEmployee(true).subscribe((res) => {
      this.epicUserList = res.response;

    }, (err: any) => {
      this.notificationService.showNotification({
        alertHeader: err.statusText,
        alertMessage: err.message,
        alertType: err.status
      });
    });
  }
  onCheckboxChange(e) {
    this.updateExileValidations(e.target.checked);
  }

  updateExileValidations(isApply) {
    if (isApply) {
      this.referrersForm.get('exiledDate').setValidators([Validators.required]);
      this.referrersForm.get('exiledComment').setValidators([Validators.required]);
    }
    else {
      this.referrersForm.get('exiledDate').clearValidators();
      this.referrersForm.get('exiledComment').clearValidators();

      this.referrersForm.get('exiledDate').setValue('');
      this.referrersForm.get('exiledComment').setValue('');
    }

    this.referrersForm.get('exiledDate').updateValueAndValidity();
    this.referrersForm.get('exiledComment').updateValueAndValidity();
  }

  updateReferrer(isPopUpStay: boolean) {
    this.noteText = null;
    this.submitted = true;
    this.modelValue = 'modal';
    if (this.referrersForm.invalid) {
      this.modelValue = '';
      return;
    }

    var body = {
      'referrerId': this.id,
      'type': this.refForm.type.value,
      'username': this.refForm.username.value,
      'groupName': this.refForm.groupName.value, 
      'role': this.refForm.role.value,
      'fullName': this.refForm.fullName.value,
      'specialty': this.refForm.specialty.value,
      'npiphysicianId': this.refForm.npiphysicianId.value,
      'businessPhoneNumber': this.refForm.businessPhoneNumber.value,
      'faxNumber': this.refForm.faxNumber.value,
      'email': this.refForm.email.value,
      'birthDate': this.refForm.birthDate.value,
      'sex': this.refForm.sex.value,
      'delivery': this.refForm.delivery.value,
      'address': this.refForm.address.value,
      'zipPostalCode': this.refForm.zipPostalCode.value,
      'city': this.refForm.city.value,
      'stateProvince': this.refForm.stateProvince.value,
      'country': this.refForm.country.value,
      'cellPhoneNumber': this.refForm.cellPhoneNumber.value,
      'pagerPhoneNumber': this.refForm.pagerPhoneNumber.value,
      'notes': this.refForm.notes.value,
      'mri': parseInt(this.refForm.mri.value),
      'mriwithoutContrast': parseInt(this.refForm.mriwithoutContrast.value),
      'mriwithContrast': parseInt(this.refForm.mriwithContrast.value),
      'ct': parseInt(this.refForm.ct.value),
      'ctwithoutContrast': parseInt(this.refForm.ctwithoutContrast.value),
      'ctwithContrast': parseInt(this.refForm.ctwithContrast.value),
      'xray1View': parseInt(this.refForm.xray1View.value),
      'xray2Views': parseInt(this.refForm.xray2Views.value),
      'xray3Views': parseInt(this.refForm.xray3Views.value),
      'autoFaxFinal': this.refForm.autoFaxFinal.value,
      'autoEmailFinal': this.refForm.autoEmailFinal.value,
      'dateAdded': this.refForm.dateAdded.value,
      'accountContactName1': this.refForm.accountContactName1.value,
      'accountEmail1': this.refForm.accountEmail1.value,
      'accountPhone1': this.refForm.accountPhone1.value,
      'billingContactName1': this.refForm.billingContactName1.value,
      'billingEmail1': this.refForm.billingEmail1.value,
      'billingPhone1': this.refForm.billingPhone1.value,
      'accountContactName2': this.refForm.accountContactName2.value,
      'accountEmail2': this.refForm.accountEmail2.value,
      'accountPhone2': this.refForm.accountPhone2.value,
      'billingContactName2': this.refForm.billingContactName2.value,
      'billingEmail2': this.refForm.billingEmail2.value,
      'billingPhone2': this.refForm.billingPhone2.value,
      'accountContactName3': this.refForm.accountContactName3.value,
      'accountEmail3': this.refForm.accountEmail3.value,
      'accountPhone3': this.refForm.accountPhone3.value,
      'billingContactName3': this.refForm.billingContactName3.value,
      'billingEmail3': this.refForm.billingEmail3.value,
      'billingPhone3': this.refForm.billingPhone3.value,
      'otherContactEmail': this.refForm.otherContactEmail.value,
      'isAutoEmailReport': this.refForm.isAutoEmailReport.value,
      'autoEmailReport': this.refForm.autoEmailReport.value,
      'autoEmailReportDateTime': this.refForm.autoEmailReportDateTime.value,
      'accountFax1': this.refForm.accountFax1.value,
      'accountFax2': this.refForm.accountFax2.value,
      'accountFax3': this.refForm.accountFax3.value,
      'billingFax1': this.refForm.billingFax1.value,
      'billingFax2': this.refForm.billingFax2.value,
      'billingFax3': this.refForm.billingFax3.value,
      'userid': this.refForm.userid.value,
      'isScheduleEmail': this.refForm.isScheduleEmail.value,
      'scheduleEmail': this.refForm.scheduleEmail.value,
      'isScheduleFax': this.refForm.isScheduleFax.value,
      'scheduleFax': this.refForm.scheduleFax.value,
      'isNotLienReminder': this.refForm.isNotLienReminder.value,
      'isNotPiLiablility': this.refForm.isNotPiLiablility.value,
      'isPatientSignature': this.refForm.isPatientSignature.value,
      'exiled': this.refForm.exiled.value,
      'notsendScheduledSummary': this.refForm.notsendScheduledSummary.value,
      'exiledDate': this.refForm.exiledDate.value,
      'exiledComment': this.refForm.exiledComment.value,
      'doNotBlasts': this.refForm.doNotBlasts.value,
      'doNotSendEmail': this.refForm.doNotSendEmail.value,
      'doNotSendFax': this.refForm.doNotSendFax.value,
      'doNotSendMail': this.refForm.doNotSendMail.value,
      'removeAllMarketingBlast': this.refForm.removeAllMarketingBlast.value,
      'doNotFaxReport': this.refForm.doNotFaxReport.value,
      'reportEmail': this.refForm.reportEmail.value,
      'reportFax': this.refForm.reportFax.value,
      'doNotCouldnotSchedule': this.refForm.doNotCouldnotSchedule.value,
      'doNotSendCaseUpdates': this.refForm.doNotSendCaseUpdates.value,
      'skipStatus1': this.refForm.skipStatus1.value,
      'skipStatus2': this.refForm.skipStatus2.value,
      'skipStatus3': this.refForm.skipStatus3.value,
      'skipStatus4': this.refForm.skipStatus4.value,
      'skipAllStatusUpdates': this.refForm.skipAllStatusUpdates.value,
      'groupingReferrer': this.refForm.groupingReferrer.value ? this.refForm.groupingReferrer.value.toString() :'',
      'statusUpdateEmail': this.refForm.statusUpdateEmail.value,
      'statusUpdateFax': this.refForm.statusUpdateFax.value,
      'isStatusEmail': this.refForm.isStatusEmail.value,
      'isStatusFax': this.refForm.isStatusFax.value,
      'isCouldntStatusEmail': this.refForm.isCouldntStatusEmail.value,
      'couldntStatusEmail': this.refForm.couldntStatusEmail.value,
      'isCouldntStatusFax': this.refForm.isCouldntStatusFax.value,
      'couldntStatusFax': this.refForm.couldntStatusFax.value,
      'isAcceptLiabilityFax': this.refForm.isAcceptLiabilityFax.value,
      'isAcceptLiabilityEmail': this.refForm.isAcceptLiabilityEmail.value,
      'acceptLiabilityEmail': this.refForm.acceptLiabilityEmail.value,
      'acceptLiabilityFax': this.refForm.acceptLiabilityFax.value,
      'arpaymentEmail': this.refForm.arpaymentEmail.value,
      'arpaymentFax': this.refForm.arpaymentFax.value,
      'isArpaymentSummaryEmail': this.refForm.isArpaymentSummaryEmail.value,
      'isArpaymentSummaryFax': this.refForm.isArpaymentSummaryFax.value,
      'doNotSendArpaymentSummary': this.refForm.doNotSendArpaymentSummary.value,
      'doNotSendCaseStatusRequests': this.refForm.doNotSendCaseStatusRequests.value,
      'isDocManage': this.refForm.isDocManage.value,
      'isSftp': this.refForm.isSftp.value,
      'sftpprofileId': this.refForm.sftpprofileId.value.toString(),
      //'docId':this.refForm.docId.value,
      'docId': this.selectedDocType.toString(),
      'isMarkettingCredit': this.refForm.isMarkettingCredit.value,
      'marketingUser': parseInt(this.refForm.marketingUser.value),
      'marketingStartDate': this.refForm.marketingStartDate.value,
      'marketingEnddate': this.refForm.marketingEnddate.value,
      'verifiedUser': this.refForm.verifiedUser.value,
      'verifiedOn': this.refForm.verifiedOn.value,
      'isesignEmail': this.refForm.isesignEmail.value,
      'noCreateAcceptLiability': this.refForm.noCreateAcceptLiability.value,
      'isReferrerReadingRadiologist': this.refForm.isReferrerReadingRadiologist.value,
      'isNotRequiredAsl': this.refForm.isNotRequiredAsl.value,
      'PatientBillName': this.refForm.PatientBillName.value,
      'NPI': this.refForm.NPI.value,
      'LicenseNumber': this.refForm.LicenseNumber.value,
      'RadEmail': this.refForm.RadEmail.value,
      'RadAddress': this.refForm.RadAddress.value,
      'RadPhone': this.refForm.RadPhone.value,
      'RadFax': this.refForm.RadFax.value,
      'RadBillingEmail': this.refForm.RadBillingEmail.value,
      'TaxID':this.refForm.TaxID.value,
      'Policy':this.referrerPolicyFormControls.referrerPolicy.value,
    }
    let txt;
    Object.keys(this.referrersForm.value).forEach(key => {
      txt = key;
      if (key.startsWith('Rad')) {
        const n = txt.replace('Rad', '');
        var AIndex = this.referrerProcGroupList.findIndex(val => val.ProcGroupId === parseInt(n));
        if (AIndex != -1)
          this.referrerProcGroupList[AIndex].RadCost = this.referrersForm.value[key]
      }
      else if (key.startsWith('PI')) {
        const n = txt.replace('PI', '');
        var AIndex = this.referrerProcGroupList.findIndex(val => val.ProcGroupId === parseInt(n));
        if (AIndex != -1)
          this.referrerProcGroupList[AIndex].PIBillingFee = this.referrersForm.value[key]
      }
    });

    this.referrersService.updateReferrer(true, body).subscribe((res) => { 
      if (res) {
        //this.updateReferrerProcGroup();
        if (this.noteText != '' && this.noteText != null) {
          this.addNote(false);
        }
        this.showNotificationOnSucess(res);
        if (!isPopUpStay) {
          this.getreferrerById();
        }
        this.submitted = false;
      }
    },
      (err: any) => {
        // this.clearRecords();
        this.errorNotification(err);
      });
    if (!isPopUpStay) {
      this.closePopUp();
    }
  }

  updateReferrerProcGroup() {
    this.referrersService.updateReferrerProcGroup(false, this.referrerProcGroupList).subscribe((res) => {
    },
      (err: any) => {
        //this.clearRecords();
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  allowNumberOnly(event: any): boolean {
    return this.commonMethodService.alowNumberOnly(event);
  }
  closePopUp() {
    this.submitted = false;
    this.referrersForm.reset();
    this.ReferrerPoliciesForm.reset();

    //this.isModalShow=false;
    //this.styleBlock='none';
    //this.isPopUpDisplay=false;
  }
  // clearRecords(){
  //   this.referrersForm.reset()
  //   // this.searchText = ''
  //   // this.exiledOption = ''
  //   // this.refForm.searchText.setValue('')
  //   // this.refForm.exiledOption.setValue('')
  // }
  textBoxDisabled(val: any) {
    if (val) {
      this.referrersForm.controls['autoEmailReport'].enable();
    } else {
      this.referrersForm.controls['autoEmailReport'].disable();
    }
  }
 
  addNote(isNoteButtonClick: boolean) {
    this.isNoteButtonDisable = true;
    this.noteControl.value = '';
    if (this.noteText != '') {
      let body = {
        'id': 0,
        'internalPatientID': '',
        'referrerId': this.id,
        'userId': this.storageService.user.UserId,
        'notesForPage': 'Referrer',
        'patientNote': this.noteText,
        'username': this.storageService.user.FullName
      }
      this.referrersService.addPatientNote(true, body).subscribe((res) => {
        if (res.responseCode == 200) {
          if (isNoteButtonClick) {
            this.showNotificationOnSucess(res);
            this.getReferrerNotesById();
          }
        }
      }, (err: any) => {
        this.errorNotification(err);
      });
    }
  }
  checkNotes(notesId: any) {
    if (notesId.value == '') {
      this.noteText = '';
      this.isNoteButtonDisable = true;
      return;
    }
    this.isNoteButtonDisable = false
    this.noteText = notesId.value;
    this.noteControl = notesId
  }

  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  showNotificationOnSucess(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  
//   trackByFn(item: username:any) {
//     return item.id;
// }
  onTagChange(tagVal: any) {
   debugger
    this.groupingNames = true;
    this.searchText = tagVal.target.value;
     //this.searchText = tagVal.event.target.value;
    if (tagVal) {
      this.tagBtnDisabled = false;
      if(this.searchText != ''){
        this.getGroupingNames();
        this.groupingNames = false;
      }
    }
    else {
      this.tagBtnDisabled = true;
    }
  }
  showDocManager() {
    let Data = {
      UploadedPage: 'Referrer',
      ReferreId: this.id,
      ReferrerName: this.title
    }
    this.commonMethodService.sendDataToDocumentManagerForRefAndFundingCo(Data);
  }
   get refForm() { return this.referrersForm.controls; }
   get referrerPolicyFormControls() { return this.ReferrerPoliciesForm.controls; }
   ValidateMultiSelectTextLength(id, a)
   {
     a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
   return a;
   }
}
