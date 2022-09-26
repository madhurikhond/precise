import { Component, OnInit } from '@angular/core';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';

@Component({
  selector: 'app-resolved',
  templateUrl: './resolved.component.html',
  styleUrls: ['./resolved.component.css']
})
export class ResolvedComponent implements OnInit {
  totalRecords: number = 1;
  pageNumber: number = 1;
  pageSize: number ;
  dataList: any = [];

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  readonly pageSizeArray=PageSizeArray;
  searchText: string='';
  selectResolvedType: number;

  constructor(private workflowService: WorkflowService, private notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService, private readonly patientService: PatientService) { }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;

    this.getRecordList();     
    this.commonMethodService.setTitle('Resolved');
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
  this. getRecordList();
}

  getRecordList() {
    debugger
    if(this.searchText ===''){
    this.workflowService.getCommunicationFailure(1, this.pageNumber, this.pageSize, true).subscribe((res) => {
      var data: any = res;
      
      if (data.response != null && data.response.length > 0) {
        this.dataList = data.response;
        this.totalRecords = res.totalRecords
      }
      else {
        this.dataList = [];
        this.totalRecords = 1
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
     }else{
      this.getSearchRecordList();
   }
  }
  getSearchRecordList(){
    debugger
    this.workflowService.getSearchDataCommFailure(1,this.searchText, this.pageNumber, this.pageSize, true).subscribe((res) => {
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

  pageChanged(event) {
    this.pageNumber = event;
    this.getRecordList()
  }
  getPatientDetailById(data) {
    let body = {
      'internalPatientId': data.data.INTERNALPATIENTID,
      'internalStudyId': data.data.InternalStudyId,
      'hasAlert': data.data.HasAlert,
    }
    this.patientService.sendDataToPatientDetailWindow(body);
  }
}
