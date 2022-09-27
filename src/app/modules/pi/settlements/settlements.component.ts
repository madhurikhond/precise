import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
import CheckBox from 'devextreme/ui/check_box';
import { DxDataGridComponent } from 'devextreme-angular';
import { ReferrersService } from 'src/app/services/referrers.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { DatePipe } from '@angular/common';
import { Moment } from 'moment'
import * as moment from 'moment';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { threadId } from 'worker_threads';
declare const $: any;

@Component({
  selector: 'app-settlements',
  templateUrl: './settlements.component.html',
  styleUrls: ['./settlements.component.css']
})
export class SettlementsComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('btnCancel') myDiv: ElementRef<HTMLElement>;
  @ViewChildren('gridContainer') gridContainer: any;

  allMode: string;
  checkBoxesMode: string;
  modelValue: string = 'modal';
  modelValue1: string = 'modal';
  modelValue2: string = 'modal';
  isSettle: boolean = false;
  searchForm: FormGroup;
  addNoteForm: FormGroup;
  editSettleForm: FormGroup;
  editSettleForm1: FormGroup;
  showDropdownLoader = true;
  submitted = false;
  settleSubmitted = false;
  settleSubmitted1 = false;
  totalRecords: number = 1;
  pageNumber: number = 1;
  pageSize: number;
  dataList: any = [];
  noteList: any = [];
  studyDetail: any;
  patientId: string;
  editPopupTitle: string;
  filePath: string;
  settleId: string;
  internalStudyId: string;
  isShowColumnWithNoData = false;
  noteSubmitted = false;
  minSettleMent: number = 0;

  attorneyList: any = [];
  statusList: any = [];
  brokerList: any = [];
  insuranceCompanyList: any = [];
  financialTypeList: any = [];
  settledByList: any = [];
  workList: any = [];

  selectedStatus: any = [];
  selectedBroker: any = [];
  selectedInsuranceCompany: any = [];
  selectedBank: any = [];
  selectedQBAccount: any = [];
  selectedPaymentType: any = [];

  selectedRows: number[];

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  // isShowColumnWithNoData = true;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  readonly pageSizeArray = PageSizeArray;




  constructor(private fb: FormBuilder, private readonly commonMethodService: CommonMethodService,
    private referrersService: ReferrersService, private readonly workflowService: WorkflowService,
    private readonly notificationService: NotificationService, private readonly storageService: StorageService) {
    this.onCellPrepared = this.onCellPrepared.bind(this);
  }
  ngOnInit(): void {
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;
    this.selectedRows = [];

    this.commonMethodService.setTitle('Settlements');
    this.getDropdown();
    this.searchForm = this.fb.group({
      lastName: [''],
      firstName: [''],
      patientId: [''],
      dob: [''],
      attorney: [null],
      doi: [''],
      settledBy: [''],
      examFromDate: [''],
      examToDate: [''],
      status: [''],
      broker: [''],
      insuranceCompany: [''],
      financialType: [''],
      work: [null]
    });

    this.addNoteForm = this.fb.group({
      noteText: ['', Validators.required]
    });

    this.editSettleForm = this.fb.group({
      settlementAmount: ['', [Validators.required]],
      settlementDate: ['', [Validators.required]],
      totalCaseSettlement: [''],
      totalMedicalBills: [''],
      radEstPaymentDate: [''],
      prop123: [''],
      underPayment: [''],
      overPayment: ['']
    });

    this.editSettleForm1 = this.fb.group({
      settlementAmount: ['', [Validators.required]],
      settlementDate: ['', [Validators.required]],
      totalCaseSettlement: [''],
      totalMedicalBills: [''],
      radEstPaymentDate: [''],
      prop123: [''],
      underPayment: [''],
      overPayment: ['']
    });

    this.setGridSetting();
  }

  defaultVisibleColumn() {
    this.dataGrid.instance.columnOption('ACCESSIONNUMBER', 'visible', false);
    this.dataGrid.instance.columnOption('INTERNALPATIENTID', 'visible', false);
    this.dataGrid.instance.columnOption('INTERNALSTUDYID', 'visible', false);
    this.dataGrid.instance.columnOption('ProcGroupName', 'visible', false);
    this.dataGrid.instance.columnOption('Exiled', 'visible', false);
    this.dataGrid.instance.columnOption('ExiledComment', 'visible', false);
    this.dataGrid.instance.columnOption('ExiledDate', 'visible', false);
    this.dataGrid.instance.columnOption('REFERRINGPHYSICIAN', 'visible', false);
    this.dataGrid.instance.columnOption('BROKER', 'visible', false);
    this.dataGrid.instance.columnOption('FullAddress', 'visible', false);
    this.dataGrid.instance.columnOption('ATTORNEY', 'visible', false);
    this.dataGrid.instance.columnOption('Sex', 'visible', false);
    this.dataGrid.instance.columnOption('AttorneyPrice', 'visible', false);
    this.dataGrid.instance.columnOption('FAXNUMBER', 'visible', false);
    this.dataGrid.instance.columnOption('InjuryDate', 'visible', false);
  }

  columnChooserClick(e: any): void {
    $('.dx-overlay-content').toggle();
    this.gridContainer.first.columnChooser.mode = 'select';
    this.gridContainer.first.instance.showColumnChooser();
    var columnChooserView = this.gridContainer.first.instance.getView('columnChooserView');
    if (!columnChooserView._popupContainer) {
      columnChooserView._initializePopupContainer();
      columnChooserView.render();
    }
    $('.dx-datagrid-column-chooser').find('ul').find('.dx-item').unbind()
    $('.dx-datagrid-column-chooser').find('ul').find('.dx-item').click(function () {
      $(this).parent().find('.dx-checkbox').click();
    })
    columnChooserView._popupContainer.option('position', { of: e.element, my: 'right top', at: 'right top', offset: '0 50' });
    columnChooserView._popupContainer.option('dragEnabled', false)
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

    this.referrersService.getPersistentGridSetting(true, this.storageService.user.UserId, 'Settlement').subscribe((res) => {
      if (res.response != null) {
        let state = JSON.parse(res.response.GridSettings);
        this.dataGrid.instance.state(state);
      } else {
        this.defaultVisibleColumn();
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

  onInitialized(e) {
    setTimeout(() => {
      e.component.option('stateStoring', { ignoreColumnOptionNames: [true] });
    }, 100)
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getSettlements();
  }
  getDropdown() {
    this.workflowService.getSettlementDropDown(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.attorneyList = data.response.attorneyList;
        this.statusList = data.response.statusList;
        this.brokerList = data.response.brokerList;
        this.insuranceCompanyList = data.response.insuranceCompanyList;
        this.financialTypeList = data.response.financialTypeList;
        this.settledByList = data.response.settledByList;
        this.workList = data.response.workList;
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

  onClearSelection() {
    this.selectedRows = [];
  }

  onSearchSubmit() {
    this.selectedRows = [];
    var BreakException = {};
    this.submitted = true;
    var searchControl = false;
    try {
      Object.keys(this.searchForm.controls).forEach(key => {
        var val = this.searchForm.controls[key].value;
        if (val) {
          if (key == 'status' || key == 'broker' || key == 'insuranceCompany' || key == 'settledBy' || key == 'financialType') {
            if (val.length > 0) {
              this.getSettlements();
              searchControl = true;
              throw BreakException;
            }
          }
          else {
            this.getSettlements();
            searchControl = true;
            throw BreakException;
          }
        }
      });
      if (!searchControl) {
        this.notificationService.showNotification({
          alertHeader: null,
          alertMessage: 'Please set a criteria.',
          alertType: ResponseStatusCode.NotFound
        });
      }
    }
    catch (e) {

    }
  }

  getSettlements() {
    var data = {
      'patientId': this.sForm.patientId.value ? this.sForm.patientId.value : null,
      'lastName': this.sForm.lastName.value ? this.sForm.lastName.value : null,
      'firstName': this.sForm.firstName.value ? this.sForm.firstName.value : null,
      'birthDate': this.sForm.dob.value ? this.sForm.dob.value : null,
      'attorney': this.sForm.attorney.value,
      'injuryDate': this.sForm.doi.value ? this.sForm.doi.value : null,
      'examFrom': this.sForm.examFromDate.value ? this.sForm.examFromDate.value : null,
      'examTo': this.sForm.examToDate.value ? this.sForm.examToDate.value : null,
      'status': this.sForm.status.value ? this.sForm.status.value.toString() : null,
      'broker': this.sForm.broker.value ? this.sForm.broker.value.toString() : null,
      'insuranceCompany': this.sForm.insuranceCompany.value ? this.sForm.insuranceCompany.value.toString() : null,
      'financialType': this.sForm.financialType.value ? this.sForm.financialType.value.toString() : null,
      'settledBy': this.sForm.settledBy.value ? this.sForm.settledBy.value.toString() : null,
      'workList': this.sForm.work.value
    }
    this.workflowService.getSettlements(true, data, this.pageNumber, this.pageSize).subscribe((res) => {
      if (res) {
        var data: any = res;
        this.totalRecords = res.totalRecords;
        this.dataList = data.response;
        if (this.dataList != null) {
          this.dataList.forEach((element, index) => {
            element.myId = index;
          });
          // this.isShowColumnWithNoData = true;

          console.log(this.dataList);

        }
        else {
          this.totalRecords = 1;
          this.dataList = [];
          //  this.isShowColumnWithNoData = false;
        }
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
    this.getSettlements()
  }

  onReset() {
    this.submitted = false;
    this.searchForm.reset();
    this.totalRecords = null;
    this.pageNumber = 1;
    this.pageSize = 20;
    this.dataList = [];
  }

  onSettleClick() {

    this.resetSettleForm();
    var datePipe = new DatePipe('en-US');
    this.noteList = null;
    this.editPopupTitle = null;
    this.studyDetail = [];
    this.editPopupTitle = null;
    if (!this.selectedRows || this.selectedRows.length == 0) {
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'Please select at least one record from the below table.',
        alertType: ResponseStatusCode.BadRequest
      });
    }
    else {
      let filterData = this.dataList.filter((data) => this.selectedRows.includes(data.myId));
      let patientIds = filterData.map(a => a.PATIENTID);
      var uniquePatientIds = patientIds.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      });
      if (uniquePatientIds.length > 1) {
        this.notificationService.showNotification({
          alertHeader: null,
          alertMessage: `Can't settle multiple patients at once.`,
          alertType: ResponseStatusCode.BadRequest
        });
      }
      else {
        this.patientId = uniquePatientIds[0];
        this.isSettle = true;
        this.workflowService.getSettleStudyData(true, null, filterData.map(a => a.INTERNALSTUDYID).toString()).subscribe((res: any) => {
          if (res) {
            this.studyDetail = res.response.response;
            this.editPopupTitle = `${this.studyDetail.PATIENTID} - ${this.studyDetail.FAMILYNAME}, ${this.studyDetail.GIVENNAME} - 
                                   DOB: ${datePipe.transform(this.studyDetail.BIRTHDATE, 'MM-dd-yyyy')}${this.studyDetail.InjuryDate ? ', DOI: ' + datePipe.transform(this.studyDetail.InjuryDate, 'MM-dd-yyyy') : ''}
                                   ${this.studyDetail.FINANCIALTYPENAME ? ' - ' + this.studyDetail.FINANCIALTYPENAME : ''}`;
            this.filePath = this.studyDetail.FileName ? res.origin + this.studyDetail.FileName : null;
            this.editSettleForm1.patchValue({
              settlementAmount: this.studyDetail.SettlementAmount,
              settlementDate: this.studyDetail.SettlementDate ? this.studyDetail.SettlementDate : moment(new Date()),
              totalCaseSettlement: this.studyDetail.TotalCaseSettlement,
              totalMedicalBills: this.studyDetail.TotalMedicalBills,
              radEstPaymentDate: this.studyDetail.EstPaymentDate,
              prop123: this.studyDetail.Prop123,
              underPayment: this.studyDetail.UnderPayment,
              overPayment: this.studyDetail.OverPayment
            });
            this.getSettleNotes(this.patientId);
            this.getMinSettleMent();
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
    }
  }
  getMinSettleMent() {
    this.minSettleMent = 0;
    this.studyDetail.settleData.forEach(arg => {
      this.minSettleMent += (Number(arg.MinPrice) == 0 || arg.MinPrice == null) ? Number(arg.Defaulltprice) : Number(arg.MinPrice);
    });
  }

  closeMultiSettlePopup() {
    this.settleSubmitted1 = false;
    this.editSettleForm1.reset();
    this.isSettle = false;
    this.noteList = null;
    this.editPopupTitle = null;
    this.studyDetail = [];
    this.editPopupTitle = null;
  }

  goButtonClick(DropDownObject: HTMLInputElement) {

    if (DropDownObject.value == 'Save Grid') {
      this.saveGridSetting();
    }
    else if (DropDownObject.value == 'Approve & Settle') {
      if (this.dataList.length > 0) {
        let editableData = this.dataList.filter(a => a.Id != null);
        if (editableData.length > 0) {
          let settleIds = editableData.map(a => a.Id);
          let internalStudyIds = editableData.map(a => a.intId);

          var data = {
            'settleId': settleIds.toString(),
            'internalStudyId': internalStudyIds.toString()
          };
          this.workflowService.approveSettleStudy(data).subscribe((res) => {
            if (res) {
              var data: any = res;
              this.notificationService.showNotification({
                alertHeader: data.responseCode == ResponseStatusCode.OK ? 'Success' : 'Error',
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
        else {
          this.notificationService.showNotification({
            alertHeader: null,
            alertMessage: 'No record found to approve study.',
            alertType: ResponseStatusCode.NotFound
          });
        }
      }
      else {
        this.notificationService.showNotification({
          alertHeader: null,
          alertMessage: 'No record found.',
          alertType: ResponseStatusCode.NotFound
        });
      }
    }
  }

  saveGridSetting() {
    let state = this.dataGrid.instance.state();
    let gridSetting = JSON.stringify(state);
    let body =
    {
      'id': 0,
      'userId': this.storageService.user.UserId,
      'pageName': 'Settlement',
      'gridSettings': gridSetting
    }

    this.referrersService.updatePersistentGridSetting(true, body).subscribe((res) => {
      if (res.response != null) {
        this.notificationService.showNotification({
          alertHeader: 'Success',
          alertMessage: 'Grid setting saved successfully.',
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

  deleteSettlementClick() {
    this.modelValue1 = '';
  }

  deleteSettlement() {
    this.workflowService.deleteSettleData(this.settleId, this.internalStudyId).subscribe((res) => {
      if (res) {
        this.notificationService.showNotification({
          alertHeader: 'Success',
          alertMessage: res.message,
          alertType: res.responseCode
        })
        if (res.responseCode == ResponseStatusCode.OK) {
          this.modelValue = 'modal';
          this.modelValue1 = 'modal';
          this.settleId = null;
          this.internalStudyId = null;
          this.onSearchSubmit();
          let el: HTMLElement = this.myDiv.nativeElement;
          el.click();
        }
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

  getSettleStudyData(settleId, internalStudyId, patientId) {
    this.resetSettleForm();
    var datePipe = new DatePipe('en-US');
    this.noteList = null;
    this.editPopupTitle = null;
    this.studyDetail = [];
    this.patientId = patientId;
    this.settleId = settleId;
    this.internalStudyId = internalStudyId;
    this.workflowService.getSettleStudyData(true, settleId, internalStudyId).subscribe((res: any) => {
      if (res.response) {
        this.studyDetail = res.response.response;
        this.editPopupTitle = `${this.studyDetail.PATIENTID} - ${this.studyDetail.FAMILYNAME}, ${this.studyDetail.GIVENNAME} - 
                              DOB: ${datePipe.transform(this.studyDetail.BIRTHDATE, 'MM-dd-yyyy')}${this.studyDetail.InjuryDate ? ', DOI: ' + datePipe.transform(this.studyDetail.InjuryDate, 'MM-dd-yyyy') : ''}
                              ${this.studyDetail.FINANCIALTYPENAME ? ' - ' + this.studyDetail.FINANCIALTYPENAME : ''}`;
        this.filePath = this.studyDetail.FileName ? res.origin + this.studyDetail.FileName : null;
        //var p = (moment(this.studyDetail.startDate)).format('DD-MMM-YYYY');
        debugger
        this.editSettleForm.patchValue({
          settlementAmount: this.studyDetail.SettlementAmount,
          settlementDate: this.studyDetail.SettlementDate ? this.studyDetail.SettlementDate : null,
          //{startDate : (moment(this.studyDetail.SettlementDate)), 
          //  endDate: (moment(this.studyDetail.SettlementDate))} : 
          // {startDate: null, endDate: null},
          totalCaseSettlement: this.studyDetail.TotalCaseSettlement,
          totalMedicalBills: this.studyDetail.TotalMedicalBills,
          radEstPaymentDate: this.studyDetail.EstPaymentDate,
          prop123: this.studyDetail.Prop123,
          underPayment: this.studyDetail.UnderPayment,
          overPayment: this.studyDetail.OverPayment
        });
        this.getSettleNotes(patientId);
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

  scrollToItem(ele) {
    const element = document.getElementById(ele);
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }

  getSettleNotes(patientId) {
    this.workflowService.getSettlementNotes(true, patientId).subscribe((res) => {
      if (res) {
        var data: any = res;
        if (data.response != null) {
          this.noteList = data.response;
          setTimeout(() => {
            this.scrollToItem(this.noteList[this.noteList.length - 1].Id);
          }, 500);
        }
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

  addSettleNote() {
    this.noteSubmitted = true;
    this.modelValue = '';
    if (this.addNoteForm.invalid) {
      return;
    }

    var data = {
      'patientId': this.patientId,
      'notes': this.nForm.noteText.value,
    };
    this.workflowService.addSettledNote(true, data).subscribe((res) => {
      if (res) {
        var data: any = res;
        if (data.responseCode == ResponseStatusCode.OK) {
          if (this.noteList != null) {
            this.noteList.push(data.response);
          }
          else {
            this.noteList = [data.response];
          }
          setTimeout(() => {
            this.scrollToItem(this.noteList[this.noteList.length - 1].Id);
          }, 500);
          this.noteSubmitted = false;
          this.addNoteForm.reset();
        }
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

  onCellPrepared(e: any) {
    if (e.rowType === 'data' && e.column.command === 'select') {
      var instance = CheckBox.getInstance(e.cellElement.querySelector('.dx-select-checkbox'));
      //instance.option('disabled', true);
      if (e.data.IsEditable == 1) {
        var dom = instance.$element() as any;
        dom.remove();
      }
      // var p = e.data.IsEditable; 
      // var instance = e.cellElement.find('.dx-select-checkbox').dxCheckBox('instance');  
      // instance.option('disabled', true);  
      // e.cellElement.off();  
    }
  }

  resetSettleForm() {
    this.settleSubmitted = false;
    this.settleSubmitted1 = false;
    this.editSettleForm.reset();
    this.editSettleForm1.reset();
  }

  onSelectionChanged(e) {
    let filterData = this.dataList.filter((data) => e.currentSelectedRowKeys.includes(data.myId));
    let isEditableData = filterData.filter(a => a.IsEditable == 1);
    let myIds = isEditableData.map(a => a.myId);
    if (myIds.length > 0) {
      //e.component.deselectRows(myIds);
    }
  }

  approveStudy() {
    const sumAllocatedAmount = this.studyDetail.settleData.map(a => parseFloat(a.AllocatedAmount))
      .reduce((sum, current) => sum + current);
    if (sumAllocatedAmount === parseFloat(this.settleForm.settlementAmount.value ? this.settleForm.settlementAmount.value : 0)) {

      var data = {
        'settleId': this.settleId,
        'internalStudyId': this.internalStudyId
      };
      this.workflowService.approveSettleStudy(data).subscribe((res) => {
        if (res) {
          var data: any = res;
          this.notificationService.showNotification({
            alertHeader: data.responseCode == ResponseStatusCode.OK ? 'Success' : 'Error',
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
    else {
      this.modelValue = '';
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'Settlement amount must be equal to sum of allocation amount.',
        alertType: ResponseStatusCode.BadRequest
      });
    }
  }

  settleSubmit() {
    this.settleSubmitted = true;
    this.modelValue = 'modal';
    if (this.editSettleForm.invalid) {
      this.modelValue = '';
      return;
    }
    const sumAllocatedAmount = this.studyDetail.settleData.map(a => parseFloat(a.AllocatedAmount))
      .reduce((sum, current) => sum + current);
    if (sumAllocatedAmount === parseFloat(this.settleForm.settlementAmount.value ? this.settleForm.settlementAmount.value : 0)) {
      var allocationData = this.studyDetail.settleData.map(({ INTERNALSTUDYID, AllocatedAmount }) => ({ INTERNALSTUDYID, AllocatedAmount }));
      var data = {
        'settlementId': this.studyDetail.Id,
        'internalStudyId': this.studyDetail.settleData.map(a => a.INTERNALSTUDYID).toString(),
        'settlementAmount': this.settleForm.settlementAmount.value,
        'settlementDate': this.settleForm.settlementDate.value,
        'status': 'SETTLED PEND PMT',
        'totalCaseSettlement': this.settleForm.totalCaseSettlement.value ? this.settleForm.totalCaseSettlement.value : null,
        'totalMedicalBills': this.settleForm.totalMedicalBills.value ? this.settleForm.totalMedicalBills.value : null,
        'prop123': this.settleForm.prop123.value ? this.settleForm.prop123.value : false,
        'underPayment': this.settleForm.underPayment.value ? this.settleForm.underPayment.value : false,
        'overPayment': this.settleForm.overPayment.value ? this.settleForm.overPayment.value : false,
        'underPaymentDate': this.studyDetail.UnderPaymentDate,
        'attorney': '',
        'doctor': '',
        'facility': '',
        'minSettleMents': this.studyDetail.MinSettleMent,
        'patientId': this.studyDetail.PATIENTID,
        'isDeleted': false,
        'totalPrice': this.studyDetail.MinSettleMent,
        'radEstPaymentDate': this.settleForm.radEstPaymentDate.value ? this.settleForm.radEstPaymentDate.value : null,
        'jsonAllocationData': JSON.stringify(allocationData)
      };
      this.workflowService.settleStudy(data).subscribe((res) => {
        this.modelValue = 'modal';
        if (res) {
          this.notificationService.showNotification({
            alertHeader: res.responseCode == ResponseStatusCode.OK ? 'Success' : 'Error',
            alertMessage: JSON.parse(res.response).Message,
            alertType: res.responseCode
          });
          this.getSettlements();
        }
      },
        (err: any) => {
          this.modelValue = '';
          this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
          });
        });
    }
    else {
      this.modelValue = '';
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'Settlement amount must be equal to sum of allocation amount.',
        alertType: ResponseStatusCode.BadRequest
      });
    }
  }

  settleSubmit1(isPopUpStay: boolean) {
    this.settleSubmitted1 = true;
    this.modelValue2 = 'modal'; if (this.editSettleForm1.invalid) {
      this.modelValue2 = '';
      return;
    }
    const sumAllocatedAmount = this.studyDetail.settleData.map(a => parseFloat(a.AllocatedAmount))
      .reduce((sum, current) => sum + current);
    if (sumAllocatedAmount === parseFloat(this.settleForm1.settlementAmount.value ? this.settleForm1.settlementAmount.value : 0)) {
      var allocationData = this.studyDetail.settleData.map(({ INTERNALSTUDYID, AllocatedAmount }) => ({ INTERNALSTUDYID, AllocatedAmount }));
      var data = {
        'settlementId': this.studyDetail.Id,
        'internalStudyId': this.studyDetail.settleData.map(a => a.INTERNALSTUDYID).toString(),
        'settlementAmount': this.settleForm1.settlementAmount.value,
        'settlementDate': this.settleForm1.settlementDate.value,
        'status': 'SETTLED PEND PMT',
        'totalCaseSettlement': this.settleForm1.totalCaseSettlement.value ? this.settleForm1.totalCaseSettlement.value : null,
        'totalMedicalBills': this.settleForm1.totalMedicalBills.value ? this.settleForm1.totalMedicalBills.value : null,
        'prop123': this.settleForm1.prop123.value ? this.settleForm1.prop123.value : false,
        'underPayment': this.settleForm1.underPayment.value ? this.settleForm1.underPayment.value : false,
        'overPayment': this.settleForm1.overPayment.value ? this.settleForm1.overPayment.value : false,
        'underPaymentDate': this.studyDetail.UnderPaymentDate,
        'attorney': '',
        'doctor': '',
        'facility': '',
        'minSettleMents': this.studyDetail.MinSettleMent,
        'patientId': this.studyDetail.PATIENTID,
        'isDeleted': false,
        'totalPrice': this.studyDetail.MinSettleMent,
        'radEstPaymentDate': this.settleForm1.radEstPaymentDate.value ? this.settleForm1.radEstPaymentDate.value : null,
        'jsonAllocationData': JSON.stringify(allocationData)
      };
      this.workflowService.settleStudy(data).subscribe((res) => {
        if (res) {
          this.notificationService.showNotification({
            alertHeader: res.responseCode === ResponseStatusCode.OK ? 'Success' : 'Error',
            alertMessage: JSON.parse(res.response).Message,
            alertType: res.responseCode
          });
          this.getSettlements();
          if (res.responseCode === 200) {
            if (isPopUpStay) {
              this.closeMultiSettlePopup()
            } else {
              this.modelValue = '';
            }
          }
        }
      },
        (err: any) => {
          this.modelValue2 = '';
          this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
          });
        });
    }
    else {
      this.modelValue2 = '';
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'Settlement amount must be equal to sum of allocation amount.',
        alertType: ResponseStatusCode.BadRequest
      });
    }
  }
  showDocManager(patientId: any) {
    this.commonMethodService.sendDataToDocumentManager(patientId);
  }

  get sForm() { return this.searchForm.controls; }
  get nForm() { return this.addNoteForm.controls; }
  get settleForm() { return this.editSettleForm.controls; }
  get settleForm1() { return this.editSettleForm1.controls; }
}
