import { Component, OnInit } from '@angular/core';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';

@Component({
  selector: 'app-need-to-resolve',
  templateUrl: './need-to-resolve.component.html',
  styleUrls: ['./need-to-resolve.component.css']
})
export class NeedToResolveComponent implements OnInit {
  totalRecords: number = 1;
  pageNumber: number = 1;
  pageSize: number;
  dataList: any = [];

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  searchText: string = '';
  selectResolvedType: number;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  readonly pageSizeArray = PageSizeArray;


  constructor(private workflowService: WorkflowService, private notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService, private readonly patientService: PatientService) { }

  ngOnInit(): void {
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;

    this.commonMethodService.setTitle('Need to Resolve');

    this.getRecordList();

    this.workflowService.filterResult.subscribe((res: any) => {
      this.searchText = res.searchText;
      this.pageNumber = 1;
      this.pageSize = 20;
      this.getRecordList();
    });
    this.workflowService.clearClickedEvent.subscribe((res: string) => {
      if (res === 'clearFilter') {
        this.searchText = '';
        this.pageNumber = 1;
        this.pageSize = 20;
        this.getRecordList();
      }
    });

  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getRecordList();
  }

  getRecordList() {
    if (this.searchText == '') {
      this.workflowService.getCommunicationFailure(0, this.pageNumber, this.pageSize, true).subscribe((res) => {
        var data: any = res;
        this.totalRecords = 1;
        if (data.response != null && data.response.length > 0) {
          this.dataList = data.response;
          this.totalRecords = res.totalRecords
        }
        else {
          this.dataList = [];
        }
      },
        (err: any) => {
          this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
          });
        });
    } else {
      this.getSearchRecordList();
    }
  }

  getSearchRecordList() {
    this.workflowService.getSearchDataCommFailure(0, this.searchText, this.pageNumber, this.pageSize, true).subscribe((res) => {
      var data: any = res;
      this.totalRecords = 1;
      if (data.response != null && data.response.length > 0) {
        this.dataList = data.response;
        this.totalRecords = res.totalRecords
      }
      else {
        this.dataList = [];
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

  resolve(logId) {
    this.workflowService.resolveCommunicationFailure(logId, true).subscribe((res: any) => {
      if (res) {
        this.notificationService.showNotification({
          alertHeader: (res.responseCode == ResponseStatusCode.OK) ? 'Success' : 'Error',
          alertMessage: res.message,
          alertType: (res.responseCode == ResponseStatusCode.OK) ? ResponseStatusCode.OK : ResponseStatusCode.InternalError
        });
        this.getRecordList();
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: ResponseStatusCode.InternalError
        });
      });
  }

  pageChanged(event) {
    this.pageNumber = event;
    this.getRecordList()
  }
  getPatientDetailById(PatientID, InternalStudyId, HasAlert, data) {
    let body = {
      'internalPatientId': PatientID.toLowerCase().replace('pre', ''),
      'internalStudyId': InternalStudyId,
      'hasAlert': HasAlert,
    }
    this.patientService.sendDataToPatientDetailWindow(body);
  }
}
