import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { LienPortalPageTitleOption } from 'src/app/models/lien-portal-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
@Component({
  selector: 'app-assign-paid',
  templateUrl: './assign-paid.component.html',
  styleUrls: ['./assign-paid.component.css']
})
export class AssignPaidComponent implements OnInit {

  getfilterData:any;
  @Input()
  set filterData(val: any) {
    if(val && val != ""){
      this.getfilterData = val;
      this.getAssigndPaidData();
    }
  }

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  checkBoxesMode: string;
  allMode: string;
  pageNumber: number = 1;
  totalRecord: number = 1;
  pageSize: number;
  columnResizingMode: string;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  applyFilterTypes: any;
  resizingModes: string[] = ['widget', 'nextColumn'];
  currentFilter: any;
  dataSource: any = [];
  AssignARpaid:any = [];

  constructor(private lienPortalService : LienPortalService,private commonService: CommonMethodService) {
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

  getAssigndPaidData(){
       try {
        this.lienPortalService.GetAssignedARPaid(this.getfilterData).subscribe((res)=>{
          if (res.status == 1) {
            this.dataSource = [];
            if(res.result.length > 0){
              this.dataSource = res.result;
            }
            this.AssignARpaid = this.dataSource;
          }
          if (res.exception && res.exception.message) {
            this.lienPortalService.errorNotification(res.exception.message);
          }
        }, (error) => {
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


}

