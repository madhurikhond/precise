import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { LienPortalAPIEndpoint, LienPortalPageTitleOption, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
@Component({
  selector: 'app-retain-paid',
  templateUrl: './retain-paid.component.html',
  styleUrls: ['./retain-paid.component.css']
})
export class RetainPaidComponent implements OnInit {

  getfilterData: any;
  @Input()
  set filterData(val: any) {
    this.retainedARpaid = [];
    this.totalRecord = 0;
    if (val && val != "") {
      this.getfilterData = val;
      this.GetRetainedArPaidList();
    }
  }

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  checkBoxesMode: string;
  allMode: string;
  pageNumber: number = 0;
  totalRecord: number = 0;
  pageSize: number = 20;
  currentPageNumber: number = 1;
  columnResizingMode: string;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  applyFilterTypes: any;
  resizingModes: string[] = ['widget', 'nextColumn'];
  currentFilter: any;
  dataSource: any = [];
  retainedARpaid: any = [];
  expandAll = false;

  constructor(private lienPortalService: LienPortalService, private commonService: CommonMethodService) {
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
    this.commonService.setTitle(LienPortalPageTitleOption.RETAINED_AND_PAID);
  }

  GetRetainedArPaidList() {

    this.pageNumber = 0;
    this.currentPageNumber = 1;
    
    this.dataSource = [];
    this.lienPortalService.PostAPI(this.getfilterData, LienPortalAPIEndpoint.GetRetainedArPaidList).subscribe((res) => {
      if (res.status == LienPortalResponseStatus.Success) {
        if (res.result) {
          this.dataSource = res.result.retainedArPaidCheck;
          this.retainedARpaid = this.dataSource;
          this.totalRecord = this.retainedARpaid.length;
          this.retainedARpaid.forEach(element => {
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

  onCollapse() {
    this.expandAll = false;
    this.dataGrid.instance.collapseAll(-1);
  }
  onExpand() {
    this.expandAll = true;
    this.dataGrid.instance.expandAll(-1);
  }
}


