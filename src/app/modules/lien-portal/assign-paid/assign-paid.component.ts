import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { LienPortalAPIEndpoint, LienPortalPageTitleOption, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
@Component({
  selector: 'app-assign-paid',
  templateUrl: './assign-paid.component.html',
  styleUrls: ['./assign-paid.component.css']
})
export class AssignPaidComponent implements OnInit {

  getfilterData: any;
  @Input()
  set filterData(val: any) {
    this.AssignARpaid = [];
    this.totalRecord = 0;
    if (val && val != "") {
      this.getfilterData = val;
      this.getAssigndPaidData();
    }
  }

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  checkBoxesMode: string;
  allMode: string;
  pageNumber: number = 1;
  totalRecord: number = 1;
  currentPageNumber: number = 1;
  pageSize: number = 20;
  columnResizingMode: string;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  applyFilterTypes: any;
  resizingModes: string[] = ['widget', 'nextColumn'];
  currentFilter: any;
  dataSource: any = [];
  AssignARpaid: any = [];
  expandAll = false;

  constructor(private lienPortalService: LienPortalService, private commonService: CommonMethodService
    ,private readonly notificationService: NotificationService) {
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

  ngOnInit(): void {
    this.commonService.setTitle(LienPortalPageTitleOption.ASSIGN_AND_PAID);
  }

  getAssigndPaidData() {
    this.pageNumber = 0;
    this.currentPageNumber = 1;
    
    this.lienPortalService.PostAPI(this.getfilterData, LienPortalAPIEndpoint.GetAssignedARPaid).subscribe((res) => {
      if (res.status == LienPortalResponseStatus.Success) {
        this.dataSource = [];
        if (res.result) {
          this.dataSource = res.result;
          this.AssignARpaid = this.dataSource;
          this.totalRecord = this.AssignARpaid.length;
          this.AssignARpaid.forEach(element => {
            this.dataGrid.instance.collapseRow(element);
          });
        }
      }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  onPageNumberChange(pageNumber: any) {
    this.currentPageNumber = pageNumber;
    if (pageNumber > 1)
      this.pageNumber = pageNumber - 1;
    else
      this.pageNumber = 0;
  }

  downloadPDF(data) {
    if (data.fileName)
      this.lienPortalService.downloadFile(data.fileByte);
  }


  onCollapse() {
    this.expandAll = false;
    this.dataGrid.instance.collapseAll(-1);
  }
  onExpand() {
    this.expandAll = true;
    this.dataGrid.instance.expandAll(-1);
  }

  copyToClipboard(trnNumber){
    navigator.clipboard.writeText(trnNumber).catch(() => {
      console.error("Unable to copy text");
    });
    this.notificationService.showToasterForTransaction({
      alertHeader: '',
      alertMessage: trnNumber,
      alertType: null
    });
  }
}

