import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
import { PageSizeArray } from 'src/app/constants/pageNumber';
@Component({
  selector: 'app-missing-asl',
  templateUrl: './missing-asl.component.html',
  styleUrls: ['./missing-asl.component.css']
})
export class MissingAslComponent implements OnInit {
  searchForm: FormGroup;
  actionForm: FormGroup;
  totalRecords: number=1;
  pageNumber: number = 1;
  pageSize: number;
  dataList: any = [];
  showDropdownLoader = true;
  selectedRows: any = [];
  submitted = false;

  financialTypeList: any = [];
  brokerList: any = [];
  studyStatusList: any = [];
  priorityList: any = [];
  modalityList: any = [];

  selectedFinancialType: any = [];
  selectedBroker: any = [];
  selectedStudyStatus: any = [];
  selectedPriority: any = [];
  selectedModality: any = [];

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  isShowColumnWithNoData = true;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  readonly pageSizeArray = PageSizeArray;
  constructor(private fb: FormBuilder, private readonly commonMethodService: CommonMethodService,
    private readonly workflowService: WorkflowService, private readonly notificationService: NotificationService, private readonly patientService: PatientService) { }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;

    this.commonMethodService.setTitle('Missing ASL');
    this.getDropdown();
    this.searchForm = this.fb.group({
      patientId: [''],
      lastName: [''],
      firstName: [''],
      financialType: [''],
      broker: [''],
      studyStatus: [''],
      priority: [null],
      modality: [''],
      fromDate: [''],
      toDate: [''],
      dateRange: [null]
    });
    this.actionForm = this.fb.group({
      action: [null, Validators.required],
    });
    this.getMissingASL();
  }

  getDropdown() {
    this.workflowService.getQCAttorneyDropDown(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.financialTypeList = data.response.financialTypeList;
        this.brokerList = data.response.brokerList;
        this.studyStatusList = data.response.studyStatusList;
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

  onSearchSubmit() {
    this.getMissingASL();
  }

  getMissingASL() {
    var data = {
      'patientId': this.sForm.patientId.value,
      'lastName': this.sForm.lastName.value,
      'firstName': this.sForm.firstName.value,
      'broker': this.sForm.broker.value ? this.sForm.broker.value.toString() : null,
      'financialType': this.sForm.financialType.value ? this.sForm.financialType.value.toString() : null,
      'status': this.sForm.studyStatus.value ? this.sForm.studyStatus.value.toString() : null,
      'priority': this.sForm.priority.value ? this.sForm.priority.value.toString() : null,
      'modality': this.sForm.modality.value ? this.sForm.modality.value.toString() : null,
      'fromDate': this.sForm.fromDate.value ? this.sForm.fromDate.value : null,
      'toDate': this.sForm.toDate.value ? this.sForm.toDate.value : null,
      'dateRange': this.sForm.dateRange.value
    }
    this.workflowService.getMissingASL(true, data, this.pageNumber, this.pageSize).subscribe((res) => {
      if (res) { 
        var data: any = res;
        this.totalRecords = res.totalRecords;
        this.dataList = data.response;
        if (this.dataList) {
          this.dataList.forEach((element, index) => {
            element.myId = index;
          });
          this.isShowColumnWithNoData = true;
        }
        else {
          this.totalRecords = 1;
          this.dataList = [];
          this.isShowColumnWithNoData = false;
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

  onReset() {
    this.searchForm.reset();
    this.getMissingASL();
  }

  pageChanged(event) { 
    this.pageNumber = event;
    this.getMissingASL()
  }

  onPageSizeChange(event) { 
    this.pageNumber = 1;
    this.pageSize = event;
    this.getMissingASL()
  }

  onActionClick() {
    debugger;
    this.submitted = true;
    if (this.actionForm.invalid) {
      return;
    }
    if (!this.selectedRows || this.selectedRows.length == 0) {
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'Please select al least one record from the below table.',
        alertType: ResponseStatusCode.BadRequest
      });
    }
    else {
      var filterData = this.dataList.filter((data) => this.selectedRows.includes(data.myId));
      let patientIds = filterData.map(a => a.PatientId);
      let internalPatientIds = filterData.map(a => a.INTERNALPATIENTID);
      var data = {
        'PatientId': patientIds.toString(),
        'InternalStudyId': internalPatientIds.toString(),
        'Condition': this.aForm.action.value
      }
      this.workflowService.updateQCAttorneyBillsDropDown(true, data).subscribe((res) => {
        if (res) {
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.response? res.response[0].Result:'update',
            alertType: res.responseCode
          });
          this.submitted = false;
          this.actionForm.reset();
          this.selectedRows = null;
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

  get sForm() { return this.searchForm.controls; }
  get aForm() { return this.actionForm.controls; }

  getPatientDetailById(data) {
    let body = {
      'internalPatientId': data.data.INTERNALPATIENTID,
      'internalStudyId': data.data.InternalStudyId,
      'hasAlert': data.data.HasAlert,
    }
    this.patientService.sendDataToPatientDetailWindow(body);
  }
}
