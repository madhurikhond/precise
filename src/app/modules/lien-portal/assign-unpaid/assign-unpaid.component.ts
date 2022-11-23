import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { StorageService } from 'src/app/services/common/storage.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
@Component({
  selector: 'app-assign-unpaid',
  templateUrl: './assign-unpaid.component.html',
  styleUrls: ['./assign-unpaid.component.css']
})
export class AssignUnpaidComponent implements OnInit {
 getfilterData:any;
  @Input()
  set filterData(val: any) {
    if(val && val != ""){
      this.getfilterData = val;
      this.getListingData();
    }
  }
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  checkBoxesMode: string;
  allMode: string;
  pageNumber: number = 1;
  totalRecord: number = 1;
  pageSize: number = 10;
  columnResizingMode: string;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  applyFilterTypes: any;
  resizingModes: string[] = ['widget', 'nextColumn'];
  currentFilter: any;
  dataSource: any = [];
  AssignARUnpaid: any = [];

  constructor(private lienPortalService: LienPortalService, public storageService: StorageService) {
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
  }


  getListingData() {
    try {
      this.lienPortalService.GetAssignedARUnpaid(this.getfilterData).subscribe((result) => {
        console.log(result);
        if (result.status == 0) {
          if (result.result && result.result.length > 0) {
            this.dataSource = result.result
            this.AssignARUnpaid = this.dataSource;
            this.totalRecord = result.result.length;
            // this.dataSource = this.AssignARUnpaid.slice((this.pageNumber - 1) * this.pageSize, ((this.pageNumber - 1) * this.pageSize) + this.pageSize)
          }
        }
        if (!result.exception) {
          this.lienPortalService.errorNotification(result.exception.message);
        }
      }, (error) => {
        this.lienPortalService.errorNotification(error.message);
      })
    } catch (error) {
      this.lienPortalService.errorNotification(error.message);
    }
  }


}
