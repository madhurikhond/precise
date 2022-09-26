import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
import CheckBox from 'devextreme/ui/check_box';
import { PageSizeArray } from 'src/app/constants/pageNumber';
@Component({
  selector: 'app-case-update-and-collection',
  templateUrl: './case-update-and-collection.component.html',
  styleUrls: ['./case-update-and-collection.component.css']
})

export class CaseUpdateAndCollectionComponent implements OnInit {
  modelValue: string = 'modal';
  searchForm: FormGroup;
  addNoteForm: FormGroup;
  showDropdownLoader = true;
  submitted = false;
  totalRecords: number;
  pageNumber: number = 1;
  pageSize: number;
  dataList: any = [];
  noteList: any = [];
  UpdatesAndCollectionList: any = [];
  patientId: string;

  noteSubmitted = false;

  attorneyList: any = [];
  statusList: any = [];
  brokerList: any = [];
  insuranceCompanyList: any = [];
  financialTypeList: any = [];
  faciltyTypeList: any = [];
  dateRangeList: any = [];

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
  readonly pageSizeArray=PageSizeArray;
  constructor(private fb: FormBuilder, private readonly commonMethodService: CommonMethodService,
    private readonly workflowService: WorkflowService, private readonly notificationService: NotificationService) {
    this.onCellPrepared = this.onCellPrepared.bind(this);
  }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;

    this.commonMethodService.setTitle('Case Update & Collection');
    this.getDropdown();
    this.searchForm = this.fb.group({
      lastName: [''],
      firstName: [''],
      patientId: [''],
      dob: [''],
      ssn: [''],
      phone: [''],
      attorney: [null],
      doi: [''],
      refphysician: [''],
      status: [''],
      broker: [''],
      insuranceCompany: [''],
      imagingfacility: [''],
      financialType: [''],
      faciltyType: [''],
      dateRange:['']
    });

    this.addNoteForm = this.fb.group({
      noteText: ['', Validators.required]
    });
    this.getupdatesAndCollections();
  }

  getDropdown() {
    this.workflowService.getUpdatesAndCollectionDropDown(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.attorneyList = data.response.attorneyList;
        this.statusList = data.response.statusList;
        this.brokerList = data.response.brokerList;
        this.insuranceCompanyList = data.response.insuranceCompanyList;
        this.financialTypeList = data.response.financialTypeList;
        this.faciltyTypeList = data.response.faciltyTypeList;
        this.dateRangeList = data.response.dateRangeList;
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
          if (key == 'status' || key == 'broker' || key == 'insuranceCompany' || key == 'financialType') {
            if (val.length > 0) {
              this.getupdatesAndCollections();
              searchControl = true;
              throw BreakException;
            }
          }
          else {
            this.getupdatesAndCollections();
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

  getupdatesAndCollections() {
    var data = {
      'patientId': this.sForm.patientId.value ? this.sForm.patientId.value : null,
      'lastName': this.sForm.lastName.value ? this.sForm.lastName.value : null,
      'firstName': this.sForm.firstName.value ? this.sForm.firstName.value : null,
      'birthDate': this.sForm.dob.value ? this.sForm.dob.value : null,
      'attorney': this.sForm.attorney.value ? this.sForm.attorney.value : null,
      'injuryDate': this.sForm.doi.value ? this.sForm.doi.value : null,
      'status': this.sForm.status.value ? this.sForm.status.value.toString() : null,
      'broker': this.sForm.broker.value ? this.sForm.broker.value.toString() : null,
      'insuranceCompany': this.sForm.insuranceCompany.value ? this.sForm.insuranceCompany.value.toString() : null,
      'financialType': this.sForm.financialType.value ? this.sForm.financialType.value.toString() : null,
      'ssn': this.sForm.ssn.value ? this.sForm.ssn.value.toString() : null,
      'phone': this.sForm.phone.value ? this.sForm.phone.value.toString() : null,
      'refphysician': this.sForm.refphysician.value ? this.sForm.refphysician.value.toString() : null,
      'faciltyType': this.sForm.faciltyType.value ? this.sForm.faciltyType.value.toString() : null,
      'dateRange': this.sForm.dateRange.value ? this.sForm.dateRange.value.toString() : null,

    }
    //this.workflowService.getUpdatesAndCollection(true, data, this.pageNumber, this.pageSize).subscribe((res) => {
    //  if (res) {
    //    var data: any = res;
    //    this.totalRecords = res.totalRecords;
    //    this.dataList = data.response;
    //    if (this.dataList != null) {
    //      this.dataList.forEach((element, index) => {
    //        element.myId = index;
    //      });
    //    }
    //  }
    //},
    //  (err: any) => {
    //    this.notificationService.showNotification({
    //      alertHeader: err.statusText,
    //      alertMessage: err.message,
    //      alertType: err.status
    //    });
    //  });
  }

  pageChanged(event) {
    this.pageNumber = event;
    this.getupdatesAndCollections()
  }

  onReset() {
    this.submitted = false;
    this.searchForm.reset();
    this.getupdatesAndCollections();
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
}

