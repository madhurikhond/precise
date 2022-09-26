import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
import { PageSizeArray } from 'src/app/constants/pageNumber';
@Component({
  selector: 'app-attorney-stats',
  templateUrl: './attorney-stats.component.html',
  styleUrls: ['./attorney-stats.component.css']
})
export class AttorneyStatsComponent implements OnInit {
  totalRecords: number = 1;
  pageNumber: number = 1;
  pageSize: number ;
  dataList: any = [];
  attorney: string = '';

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  readonly pageSizeArray=PageSizeArray;
  constructor(private readonly commonMethodService: CommonMethodService,
    private readonly workflowService: WorkflowService, private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;

    this.commonMethodService.setTitle('Attorney Stats');
    this.getAttorneyStats();
  }

  getAttorneyStats() {
    this.workflowService.getQcAttorneyStats(true, this.attorney, this.pageNumber, this.pageSize).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.dataList = data.response;
        this.totalRecords = res.totalRecords;
      }
      else {
        this.totalRecords = 1;
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
    debugger;
    this.pageNumber = event;
    this.getAttorneyStats();
  }
  onPageSizeChange(event) {
    debugger;
    this.pageNumber = 1;
    this.pageSize = event;
    this.getAttorneyStats();
  }
}
