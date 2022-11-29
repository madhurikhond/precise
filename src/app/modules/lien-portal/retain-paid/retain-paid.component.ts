import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { LienPortalPageTitleOption } from 'src/app/models/lien-portal-response';
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
  dataSource:any = [];
  retainedARpaid : any = [];

  constructor(private lienPortalService : LienPortalService,private commonService:CommonMethodService) {
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

  GetRetainedArPaidList(){
    try {
      this.dataSource = [];
      this.lienPortalService.GetRetainedPaid(this.getfilterData).subscribe((res)=>{
        if(res.status == 1){
          if (res.result) {
            this.dataSource = res.result.retainedArPaidCheck;
          }
          this.retainedARpaid = this.dataSource;
          this.totalRecord = this.retainedARpaid.length;
        }
      },
      (error) => {
        if (error.message) {
          this.lienPortalService.errorNotification(error.message);
        }
      })
    } catch (error) {
      if (error.message) {
        this.lienPortalService.errorNotification(error.message);
      }
    }
  }

  onPageNumberChange(pageNumber: any) {
    this.currentPageNumber = pageNumber;
    if (pageNumber > 1)
      this.pageNumber = pageNumber - 1;
    else
      this.pageNumber = 0;
  }
}


