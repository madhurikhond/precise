import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
import CheckBox from 'devextreme/ui/check_box';
import { DxDataGridModule, DxDataGridComponent } from 'devextreme-angular';
import { PatientService } from 'src/app/services/patient/patient.service';

import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { PageSizeArray } from 'src/app/constants/pageNumber';

@Component({
  selector: 'app-action-needed',
  templateUrl: './action-needed.component.html',
  styleUrls: ['./action-needed.component.css']
})
export class ActionNeededComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  modelValue: string = 'modal';
  searchForm: FormGroup;
  addNoteForm: FormGroup;
  showDropdownLoader = true;
  submitted = false;
  totalRecords: number=1;
  pageNumber: number = 1;
  pageSize: number;
  dataList: any = [];
  noteList: any = [];
  UpdatesAndCollectionList: any = [];
  patientId: string;

  noteSubmitted = false
  statusList: any = [];
  brokerList: any = [];
  insuranceCompanyList: any = [];
  financialTypeList: any = [];
  priorityList: any = [];
  modalityList: any = [];

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
  isShowColumnWithNoData = true;
  readonly pageSizeArray=PageSizeArray;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  constructor(private fb: FormBuilder, private readonly commonMethodService: CommonMethodService,
    private readonly workflowService: WorkflowService, private readonly notificationService: NotificationService, private readonly patientService: PatientService) {
    this.onCellPrepared = this.onCellPrepared.bind(this);
  }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;

    this.commonMethodService.setTitle('Action Needed');
    this.getDropdown();
    this.searchForm = this.fb.group({
      patientId: [''],
      status: [''],
      broker: [''],
      financialType: [''],
      priority: [''],
      modality: ['']
    });

    this.addNoteForm = this.fb.group({
      noteText: ['', Validators.required]
    });
    this.getActionNeeded();
  }

  getDropdown() {
    this.workflowService.getActionNeededDropDown(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.statusList = data.response.statusList;
        this.brokerList = data.response.brokerList;
        this.financialTypeList = data.response.financialTypeList;
        this.priorityList = data.response.priorityList;
        this.modalityList = data.response.modalityList;
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
    var BreakException = {};
    this.submitted = true;
    var searchControl = false;
    try {
      Object.keys(this.searchForm.controls).forEach(key => {

        var val = this.searchForm.controls[key].value;
        if (val) {
          this.pageNumber = 1;
          if (key == 'status' || key == 'broker' || key == 'modality' || key == 'financialType') {
            if (val.length > 0) {
              this.getActionNeeded();
              searchControl = true;
              throw BreakException;
            }
          }
          else {
            this.getActionNeeded();
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

  getActionNeeded() {
    var data = {
      'patientId': this.sForm.patientId.value ? this.sForm.patientId.value : null,
      'status': this.sForm.status.value ? this.sForm.status.value.toString() : null,
      'broker': this.sForm.broker.value ? this.sForm.broker.value.toString() : null,
      'financialType': this.sForm.financialType.value ? this.sForm.financialType.value.toString() : null,
      'modality': this.sForm.modality.value ? this.sForm.modality.value.toString() : null,
      'priority': this.sForm.priority.value ? this.sForm.priority.value.toString() : null,
    }
    this.selectedRows = [];  
    this.workflowService.getActionNeeded(true, data, this.pageNumber, this.pageSize).subscribe((res) => {
      if (res) {
        var data: any = res;
        this.totalRecords = res.totalRecords;
        this.dataList = data.response;
        if (this.dataList != null) {
          this.dataList.forEach((element, index) => {
            element.myId = index;
          });
        
          this.isShowColumnWithNoData = true;
        }
        else{
          this.totalRecords = 1;
          this.dataList = [];
        
          this.isShowColumnWithNoData = false;

        }
      }
    },
      (err: any) => {
        this.totalRecords = 1;
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  pageChanged(event) {
    this.pageNumber = event;
    this.getActionNeeded()
    this.dataGrid.instance.pageCount();
  }
  
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getActionNeeded()
    this.dataGrid.instance.pageCount();
  }

  onReset() {
    this.submitted = false;
    this.searchForm.reset();
    this.getActionNeeded();
  }

  scrollToItem(ele) {
    const element = document.getElementById(ele);
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
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
    let filterData = this.dataList.filter((data) => e.currentSelectedRowKeys.includes(data.myId));
    let isEditableData = filterData.filter(a => a.IsEditable == 1);
    let myIds = isEditableData.map(a => a.myId);
    if (myIds.length > 0) {
      e.component.deselectRows(myIds);
    }
  }

  get sForm() { return this.searchForm.controls; }
  get nForm() { return this.addNoteForm.controls; }
  // customizeText(cellInfo) {
  //   return cellInfo.value + ' &deg;C';
  // }

  ResolveStudyData(LogId: number) {
    var data = this.workflowService.ResolveStudyData(true, LogId);
    return data;
  }

  getPatientDetailById(data) {
    let body = {
      'internalPatientId': data.data.INTERNALPATIENTID,
      'internalStudyId': data.data.InternalStudyId,
      'hasAlert': data.data.HasAlert,
    }
    this.patientService.sendDataToPatientDetailWindow(body);
  }


  goButtonClick(DropDownObject: HTMLInputElement) {
    debugger
    if (DropDownObject.value !== '0') {
      if (!this.selectedRows || this.selectedRows.length == 0) {
        this.notificationService.showNotification({
          alertHeader: null,
          alertMessage: 'Please select at least one record from the below table.',
          alertType: ResponseStatusCode.BadRequest
        });
      }
      else if (this.dataList.length > 0) {
        let filterData = this.dataList.filter((data) => this.selectedRows.includes(data.myId));
        const data = [];
        filterData.forEach(function (e) {
          data.push({
            PatientId: e.PATIENTID,
            InternalStudyId: e.INTERNALSTUDYID,
          });
        });
        debugger
        this.workflowService.UpdateStudyResolve(JSON.stringify(JSON.stringify(data)), true).subscribe((res) => {
          if (res) {
            const data: any = res;
            this.notificationService.showNotification({
              alertHeader: null,
              alertMessage: data.response[0].response,
              alertType: ResponseStatusCode.OK
            });
            this.getActionNeeded();
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
          alertMessage: 'Please select atleast one record from the table',
          alertType: ResponseStatusCode.NotFound
        });
      }
    }
    else {
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'Please select another option from dropdown',
        alertType: ResponseStatusCode.NotFound
      });
    }
  }

}
