import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { LienPortalAPIEndpoint, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
@Component({
  selector: 'app-funding-co-paid',
  templateUrl: './funding-co-paid.component.html',
  styleUrls: ['./funding-co-paid.component.css']
})
export class FundingCoPaidComponent implements OnInit {

  getfilterData: any;
  @Input()
  set filterData(val: any) {
    if (val && val != null) {
      this.getfilterData = val;
      this.getFundingCoPaidList();
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
  dataSource : any = [];
  fundingCoPaid : any = [];
  checkboxSelectedData: any;

  constructor(private lienPortalService : LienPortalService) {
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
    this.getFundingCoPaidList();
  }

  getFundingCoPaidList(){
    this.lienPortalService.PostAPI(this.getfilterData,LienPortalAPIEndpoint.GetFundingCompanyPaidList).subscribe(res=>{
      if(res.status == LienPortalResponseStatus.Success){
        this.dataSource = [];
        var data = res.result;
        this.dataSource = data;
        this.fundingCoPaid = this.dataSource;
        this.totalRecord = this.fundingCoPaid.length;
      }else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  changeCheckbox(item: any) {
      if (item) {
        this.checkboxSelectedData = item.selectedRowsData;
      }
  }

}
