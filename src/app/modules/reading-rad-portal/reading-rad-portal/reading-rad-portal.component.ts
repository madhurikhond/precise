// import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/services/common/notification.service';
import { RadPortalService } from 'src/app/services/rad-portal-service/rad-portal.service';
import { SettingsService } from 'src/app/services/settings.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenerateBillAndSellLienPopupComponent, SellLien } from '../generate-bill-and-sell-lien-popup/generate-bill-and-sell-lien-popup.component';
import CheckBox from 'devextreme/ui/check_box';
import { Subscription } from 'rxjs';
import { GenerateBillAndHoldLienComponent } from '../generate-bill-and-hold-lien/generate-bill-and-hold-lien.component';
import { CommonMethodService } from 'src/app/services/common/common-method.service';

export interface tabModel {
  tabName: string;
  status: string;
  description: string;
  financialType: string;
  BulkLienAssignmentSignatureEmail: boolean;
}

@Component({
  selector: 'app-reading-rad-portal',
  templateUrl: './reading-rad-portal.component.html',
  styleUrls: ['./reading-rad-portal.component.css']
})

export class ReadingRadPortalComponent implements OnInit {

  @ViewChild('refDob', { static: true }) dobFilterRef: ElementRef;
  @ViewChild('refDosFrom', { static: true }) dosFromFilterRef: ElementRef;
  @ViewChild('refDosTo', { static: true }) dosToFilterRef: ElementRef;

  @ViewChild('ref1Dob', { static: true }) dob1FilterRef: ElementRef;
  @ViewChild('ref1DosFrom', { static: true }) dosFrom1FilterRef: ElementRef;
  @ViewChild('ref1DosTo', { static: true }) dosTo1FilterRef: ElementRef;

  @ViewChild('ref2Dob', { static: true }) dob2FilterRef: ElementRef;
  @ViewChild('ref2DosFrom', { static: true }) dosFrom2FilterRef: ElementRef;
  @ViewChild('ref2DosTo', { static: true }) dosTo2FilterRef: ElementRef;

  @ViewChild('ref3Dob', { static: true }) dob3FilterRef: ElementRef;
  @ViewChild('ref3DosFrom', { static: true }) dosFrom3FilterRef: ElementRef;
  @ViewChild('ref3DosTo', { static: true }) dosTo3FilterRef: ElementRef;

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  assignAndPendingToBeRead = [] as any;
  signedAndPendingBill = [] as any;
  billedAndLiensSold = [] as any;
  billedAndLiensSoldSubscription: Subscription | undefined;
  billedAndLiensHeld = [] as any;
  billedAndLiensHeldSubscription: Subscription | undefined;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  currentFilter: any;
  applyFilterTypes: any;
  assignAndPendingToBeReadTotalRecords: number;
  signedAndPendingBillTotalRecords: number;
  billedAndLiensSoldTotalRecords: number;
  billedAndLiensHeldTotalRecords: number;
  //--------------
  filterDOB: any;
  filterDOSFROM: any;
  filterDOSTO: any;
  //--------------
  filter1DOB: any;
  filter1DOSFROM: any;
  filter1DOSTO: any;
  //-----------------
  filter2DOB: any;
  filter2DOSFROM: any;
  filter2DOSTO: any;
  //---------------------
  filter3DOB: any;
  filter3DOSFROM: any;
  filter3DOSTO: any;
  //---------------------
  financialTypeList: any = [];
  statusList: any = [];
  radPortalTabs = [] as any;
  AssignedAndPendingToBeReadFilter = {} as any;
  SignedAndPendingBillFilter = {} as any;
  BilledAndLiensSoldFilter = {} as any;
  BilledAndLiensHeldFilter = {} as any;

  tab0Model = {} as tabModel;
  tab1Model = {} as tabModel;
  tab2Model = {} as tabModel;
  tab3Model = {} as tabModel;
  SubmitSellLienSubscription: Subscription | undefined;
  SubmitUpdateRadQCSubscription: Subscription | undefined;
  lienCompanyToAssignSignature = [] as SellLien[];
  clicked = [] as number[]

  constructor(
    private readonly settingsService: SettingsService,
    private readonly notificationService: NotificationService,
    private readonly workFlowService: WorkflowService,
    private readonly _radPortalService: RadPortalService,
    private datePipe: DatePipe,
    private _modalService: NgbModal,
    private readonly _commonMethodService: CommonMethodService,
  ) {
    this.setAssignedAndPendingToBeReadFilter();
    this._radPortalService.LienCompany$.subscribe(resp => {
      let oModel: any = resp && resp ? resp : null;
      oModel.OpType = 1;
      if (oModel.SellStudyTo) {
        if (this.lienCompanyToAssignSignature.length > 0) {
          oModel.BulkLienAssignmentSignature = JSON.stringify(this.lienCompanyToAssignSignature);
          this.ApiCallSellLiens(oModel, true);
          this.ApiCallUpdateRadQC(oModel, true);
          this.clicked.forEach((element, index) => {
            if (element == 2) this.clicked.splice(index, 1);
          });
        }
        else {
          this.errorNotification({ statusText: 'Select record', message: 'Please select at least one study', status: 'error' })
        }
      }
    })
    this._radPortalService.HoldLienCompany$.subscribe(resp => {
      let oModel: any = resp && resp ? resp : null;
      oModel.OpType = 0;
      if (this.lienCompanyToAssignSignature.length > 0 && oModel.isLoadApi) {
        oModel.BulkLienAssignmentSignature = JSON.stringify(this.lienCompanyToAssignSignature);
        this.ApiCallUpdateRadQC(oModel, true);
        this.clicked.forEach((element, index) => {
          if (element == 3) this.clicked.splice(index, 1);
        });
      }
      else if (oModel.isLoadApi) {
        this.errorNotification({ statusText: 'Select record', message: 'Please select at least one study', status: 'error' })
      }
    })
  }

  ngOnInit(): void {
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately'
    }, {
      key: 'onClick',
      name: 'On Button Click'
    }];
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.showHeaderFilter = false;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.getAllAssignedAndPendingToBeReadStudies();
    this.setSignedAndPendingBillFilter();
    this.setBilledAndLiensSoldFilter();
    this.setBilledAndLiensHeldFilter();
    this.getFinancialType();
    this.getDropdown();
    this.getRadPortalTabs();
  }

  setAssignedAndPendingToBeReadFilter() {
    this.AssignedAndPendingToBeReadFilter = {
      PatientId: '',
      FirstName: '',
      LastName: '',
      BirthDate: '',
      DOSFrom: '',
      DOSTo: '',
      PageSize: 20,
      PageNumber: 1
    }
  }
  setSignedAndPendingBillFilter() {
    this.SignedAndPendingBillFilter = {
      PatientId: '',
      FirstName: '',
      LastName: '',
      BirthDate: '',
      DOSFrom: '',
      DOSTo: '',
      PageSize: 20,
      PageNumber: 1
    }
  }
  setBilledAndLiensSoldFilter() {
    this.BilledAndLiensSoldFilter = {
      PatientId: '',
      FirstName: '',
      LastName: '',
      BirthDate: '',
      DOSFrom: '',
      DOSTo: '',
      LienBatch: '',
      PageSize: 20,
      PageNumber: 1,
      BatchName: ''
    }
  }
  setBilledAndLiensHeldFilter() {
    this.BilledAndLiensHeldFilter = {
      PatientId: '',
      FirstName: '',
      LastName: '',
      BirthDate: '',
      DOSFrom: '',
      DOSTo: '',
      LienBatch: '',
      PageSize: 20,
      PageNumber: 1
    }
  }
  //// Common Method Start
  unSuccessNotification(res: any) {
    this.notificationService.showNotification({
      alertHeader: 'No record found.',
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }
  successNotification(res: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  onCellPrepared(e: any) {
    if (e.rowType === 'data' && e.column.command === 'select') {
      var instance = CheckBox.getInstance(e.cellElement.querySelector('.dx-select-checkbox'));
      if (e.data.IsEditable == 1) {
        var dom = instance.$element() as any;
        dom.remove();
      }
    }
  }

  onSelectionChanged(e) {
    let filterData = this.signedAndPendingBill.filter((data) => e.currentSelectedRowKeys.includes(data.myId));
    let isEditableData = filterData.filter(a => a.IsEditable == 1);
    let myIds = isEditableData.map(a => a.myId);
    if (myIds.length > 0) {
      e.component.deselectRows(myIds);
    }
    this.lienCompanyToAssignSignature = e.selectedRowsData && e.selectedRowsData ? e.selectedRowsData : [];
  }
  recordNotFoundNotification(msg: string) {
    this.notificationService.showNotification({
      alertHeader: 'UnSuccess',
      alertMessage: msg,
      alertType: 400
    });
  }
  getFinancialType() {
    this.settingsService.getMasterFinancialTypes().subscribe((res) => {
      if (res.response != null) {
        this.financialTypeList = res.response;
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getRadPortalTabs() {
    this._radPortalService.getRadPortalTabs().subscribe((res) => {
      if (res.response != null) {
        let result: any = res.response ? res.response : [];
        this.radPortalTabs = result;
        this.tab0Model = this.radPortalTabs[0];
        this.tab1Model = this.radPortalTabs[1];
        this.tab2Model = this.radPortalTabs[2];
        this.tab3Model = this.radPortalTabs[3];
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getDropdown() {
    this.workFlowService.getActionNeededDropDown(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.statusList = data.response.statusList;
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
  getAllAssignedAndPendingToBeReadStudies() {
    this._radPortalService.getAllAssignAndPendingToBeReadStudies(true, this.AssignedAndPendingToBeReadFilter).subscribe((res) => {
      if (res.response != null) {
        this.assignAndPendingToBeRead = res.response[0].AssignedAndPendingToBeRead ? res.response[0].AssignedAndPendingToBeRead : [];
        this.assignAndPendingToBeReadTotalRecords = res.response[0].TotalRecords ? res.response[0].TotalRecords : 0;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getAllSignedAndPendingBillStudies() {

    debugger
    this._radPortalService.getAllSignedAndPendingBillStudies(true, this.SignedAndPendingBillFilter).subscribe((res) => {
      if (res.response != null) {
        this.signedAndPendingBill = res.response[0].SignedAndPendingBill ? res.response[0].SignedAndPendingBill : [];
        this.signedAndPendingBillTotalRecords = res.response[0].TotalRecords ? res.response[0].TotalRecords : 0;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getAllBiiledAndLiensSoldStudies() {
    if (this.billedAndLiensSoldSubscription) {
      this.billedAndLiensSoldSubscription.unsubscribe();
    }
    this.billedAndLiensSoldSubscription =
      this._radPortalService.getAllBiiledAndLiensSoldStudies(true, this.BilledAndLiensSoldFilter).subscribe((res) => {
        if (res.response != null) {
          this.billedAndLiensSold = res.response[0].BilledAndLiensSold ? res.response[0].BilledAndLiensSold : [];
          this.billedAndLiensSoldTotalRecords = res.response[0].TotalRecords ? res.response[0].TotalRecords : 0;
        }
      }, (err: any) => {
        this.errorNotification(err);
      });
  }
  getAllBiiledAndLiensHeldStudies() {
    if (this.billedAndLiensHeldSubscription) {
      this.billedAndLiensHeldSubscription.unsubscribe();
    }
    this.billedAndLiensHeldSubscription =
      this._radPortalService.getAllBiiledAndLiensHeldStudies(true, this.BilledAndLiensHeldFilter).subscribe((res) => {
        if (res.response != null) {
          this.billedAndLiensHeld = res.response[0].BilledAndLiensHeld ? res.response[0].BilledAndLiensHeld : [];
          this.billedAndLiensHeldTotalRecords = res.response[0].TotalRecords ? res.response[0].TotalRecords : 0;
        }
      }, (err: any) => {
        this.errorNotification(err);
      });
  }
  applyFilterAssignedAndPendingToBeReadStudies() {
    let filterDOB = this.datePipe.transform(this.filterDOB, 'MM/dd/yyyy');
    let filterDOSFROM = this.datePipe.transform(this.filterDOSFROM, 'MM/dd/yyyy');
    let filterDOSTO = this.datePipe.transform(this.filterDOSTO, 'MM/dd/yyyy');
    let oModel = {} as any;
    oModel = this.AssignedAndPendingToBeReadFilter;
    oModel.BirthDate = filterDOB == null ? '' : filterDOB;
    oModel.DOSFrom = filterDOSFROM == null ? '' : filterDOSFROM;
    oModel.DOSTo = filterDOSTO == null ? '' : filterDOSTO;

    this._radPortalService.getAllAssignAndPendingToBeReadStudies(true, oModel).subscribe((res) => {
      this.assignAndPendingToBeReadTotalRecords = 0;
      this.assignAndPendingToBeRead = [];
      if (res.response != null) {
        this.assignAndPendingToBeReadTotalRecords = res.totalRecords;
        this.assignAndPendingToBeRead = res.response;
      }
      else {
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  applyFiltersignedAndPendingBillStudies() {
    let filter1DOB = this.datePipe.transform(this.filter1DOB, 'MM/dd/yyyy');
    let filter1DOSFROM = this.datePipe.transform(this.filter1DOSFROM, 'MM/dd/yyyy');
    let filter1DOSTO = this.datePipe.transform(this.filter1DOSTO, 'MM/dd/yyyy');
    let oModel = {} as any;
    oModel = this.SignedAndPendingBillFilter;
    oModel.BirthDate = filter1DOB == null ? '' : filter1DOB;
    oModel.DOSFrom = filter1DOSFROM == null ? '' : filter1DOSFROM;
    oModel.DOSTo = filter1DOSTO == null ? '' : filter1DOSTO;

    this._radPortalService.getAllSignedAndPendingBillStudies(true, oModel).subscribe((res) => {
      this.signedAndPendingBillTotalRecords = 0;
      this.signedAndPendingBill = [];
      if (res.response != null) {
        this.signedAndPendingBill = res.response[0].SignedAndPendingBill ? res.response[0].SignedAndPendingBill : [];
        this.signedAndPendingBillTotalRecords = res.response[0].TotalRecords ? res.response[0].TotalRecords : 0;
      }
      else {
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  applyFilterBilledAndLiensSoldStudies() {
    let filter2DOB = this.datePipe.transform(this.filter2DOB, 'MM/dd/yyyy');
    let filter2DOSFROM = this.datePipe.transform(this.filter2DOSFROM, 'MM/dd/yyyy');
    let filter2DOSTO = this.datePipe.transform(this.filter2DOSTO, 'MM/dd/yyyy');
    let oModel = {} as any;
    oModel = this.BilledAndLiensSoldFilter;
    oModel.BirthDate = filter2DOB == null ? '' : filter2DOB;
    oModel.DOSFrom = filter2DOSFROM == null ? '' : filter2DOSFROM;
    oModel.DOSTo = filter2DOSTO == null ? '' : filter2DOSTO;

    this._radPortalService.getAllBiiledAndLiensSoldStudies(true, oModel).subscribe((res) => {
      this.billedAndLiensSoldTotalRecords = 0;
      this.billedAndLiensSold = [];
      if (res.response != null) {
        this.billedAndLiensSold = res.response[0].BilledAndLiensSold ? res.response[0].BilledAndLiensSold : [];
        this.billedAndLiensSoldTotalRecords = res.response[0].TotalRecords ? res.response[0].TotalRecords : 0;
      }
      else {
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  applyFilterBilledAndLiensHeldStudies() {
    let filter3DOB = this.datePipe.transform(this.filter3DOB, 'MM/dd/yyyy');
    let filter3DOSFROM = this.datePipe.transform(this.filter3DOSFROM, 'MM/dd/yyyy');
    let filter3DOSTO = this.datePipe.transform(this.filter3DOSTO, 'MM/dd/yyyy');
    let oModel = {} as any;
    oModel = this.BilledAndLiensHeldFilter;
    oModel.BirthDate = filter3DOB == null ? '' : filter3DOB;
    oModel.DOSFrom = filter3DOSFROM == null ? '' : filter3DOSFROM;
    oModel.DOSTo = filter3DOSTO == null ? '' : filter3DOSTO;

    this._radPortalService.getAllBiiledAndLiensHeldStudies(true, oModel).subscribe((res) => {
      this.billedAndLiensHeldTotalRecords = 0;
      this.billedAndLiensHeld = [];
      if (res.response != null) {
        this.billedAndLiensHeld = res.response[0].BilledAndLiensHeld ? res.response[0].BilledAndLiensHeld : [];
        this.billedAndLiensHeldTotalRecords = res.response[0].TotalRecords ? res.response[0].TotalRecords : 0;
      }
      else {
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  clearFilterAssignAndPendingToBeRead() {
    this.setAssignedAndPendingToBeReadFilter();
    this.assignAndPendingToBeRead = [];
    this.onNeedToAssignedAndPendingToBeReadStudies();
  }
  clearFilterSignedAndPendingBill() {
    this.setSignedAndPendingBillFilter();
    this.assignAndPendingToBeRead = [];
    this.onNeedToSignedAndPendingBillStudies();
  }
  clearFilterBilledAndLiensSold() {
    this.setBilledAndLiensSoldFilter();
    this.billedAndLiensSold = [];
    this.onNeedToBilledAndLiensSoldStudies();
  }
  onNeedToAssignedAndPendingToBeReadStudies() {
    this.assignAndPendingToBeRead = null;
    this.getAllAssignedAndPendingToBeReadStudies();
  }
  onNeedToSignedAndPendingBillStudies() {
    this.signedAndPendingBill = null;
    this.getAllSignedAndPendingBillStudies();
  }
  onNeedToBilledAndLiensSoldStudies() {
    this.billedAndLiensSold = null;
    this.getAllBiiledAndLiensSoldStudies();
  }
  onNeedToBilledAndLiensHeldToBeReadStudies() {
    this.assignAndPendingToBeRead = null;
    this.getAllBiiledAndLiensHeldStudies();
  }

  onUpdate0Tab(): void {
    let oModel = {};
    oModel = this.tab0Model;
    this.ApiCallUpdateTab(oModel, true);
  }
  onUpdate1Tab(): void {
    let oModel = {};
    oModel = this.tab1Model;
    this.ApiCallUpdateTab(oModel, true);
  }
  ApiCallUpdateTab(oModel: any, loader: boolean) {
    this._radPortalService.updateRadPortalTab(loader, oModel).subscribe((res) => {
      if (res.response != null) {
        let result: any = res.response && res.response.jsonData ? res.response.jsonData[0] : {};
        if (result.error === 'Success') {
          this.successNotification(res);
        } else {
          this.errorNotification(res);
        }
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  BilledAndLiensHeldPageChanged(pageNumber: any) {
    this.BilledAndLiensHeldFilter.PageNumber = pageNumber;
    this.onNeedToBilledAndLiensHeldToBeReadStudies();
  }
  AssignedPendingToBeReadPageChanged(pageNumber: any) {
    this.AssignedAndPendingToBeReadFilter.PageNumber = pageNumber;
    this.onNeedToAssignedAndPendingToBeReadStudies();
  }
  SignedAndPendingBillPageChanged(pageNumber: any) {
    this.SignedAndPendingBillFilter.PageNumber = pageNumber;
    this.getAllSignedAndPendingBillStudies();
  }
  BilledAndLiensSoldPageChanged(pageNumber: any) {
    this.BilledAndLiensSoldFilter.PageNumber = pageNumber;
    this.onNeedToBilledAndLiensSoldStudies();
  }

  GenerateBillAndSellLien() {
    const modalReff = this._modalService.open(GenerateBillAndSellLienPopupComponent,
      { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
    modalReff.componentInstance.lienCompInfo = null;
    modalReff.result.then((res: any) => {
      //on close
    }, (reson) => {
      //on dismiss
    })
  }
  GenerateBillAndHoldLien() {
    const modalReff = this._modalService.open(GenerateBillAndHoldLienComponent,
      { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
    modalReff.componentInstance.lienCompInfo = null;
    modalReff.result.then((res: any) => {
      //on close
    }, (reson) => {
      //on dismiss
    })
  }
  ApiCallSellLiens(oModel: any, loader: boolean) {
    if (this.SubmitSellLienSubscription) {
      this.SubmitSellLienSubscription.unsubscribe();
    }
    this.SubmitSellLienSubscription = this._radPortalService.postSellLien(loader, oModel).subscribe((res) => {
      if (res.response != null) {
        let result: any = res.response && res.response.jsonResult ? res.response.jsonResult : [];
        this.getAllSignedAndPendingBillStudies();
        this._modalService.dismissAll();
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  ApiCallUpdateRadQC(oModel: any, loader: boolean) {
    if (this.SubmitUpdateRadQCSubscription) {
      this.SubmitUpdateRadQCSubscription.unsubscribe();
    }
    this.SubmitUpdateRadQCSubscription = this._radPortalService.postUpdateRadQC(loader, oModel).subscribe((res) => {
      if (res.response != null) {
        let result: any = res.response && res.response.jsonResult ? res.response.jsonResult : [];
        this._modalService.dismissAll();
        this.getAllSignedAndPendingBillStudies();
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  bindData(index: any) {
    switch (index) {
      // case 0: // not required
      //   if (this.clicked.filter(x => x === index).length === 0) {
      //     this.getAllAssignedAndPendingToBeReadStudies();
      //     this.clicked.push(index);
      //   }
      //   break;
      case 1: if (this.clicked.filter(x => x === index).length === 0) {
        this.getAllSignedAndPendingBillStudies(); this.clicked.push(index);
      }
        break;
      case 2: if (this.clicked.filter(x => x === index).length === 0) {
        this.getAllBiiledAndLiensSoldStudies(); this.clicked.push(index);
      }
        break;
      case 3: if (this.clicked.filter(x => x === index).length === 0) {
        this.getAllBiiledAndLiensHeldStudies();
        this.clicked.push(index);
      }
        break;
      default:
        break;
    }
  }
  
  showDocManager(patientId:string)
  {
    this._commonMethodService.sendDataToDocumentManager(patientId,);
  }
}
