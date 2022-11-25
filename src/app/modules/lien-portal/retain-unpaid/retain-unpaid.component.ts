import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { LienPortalPageTitleOption } from 'src/app/models/lien-portal-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
@Component({
  selector: 'app-retain-unpaid',
  templateUrl: './retain-unpaid.component.html',
  styleUrls: ['./retain-unpaid.component.css']
})
export class RetainUnpaidComponent implements OnInit {

  getfilterData: any;
  @Input()
  set filterData(val: any) {
    if (val && val != "") {
      this.getfilterData = val;
      this.getRetainUnPaidList();
    }
  }

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  // RetainARUnpaid =[{
  //   Batchname:'batch name 1',
  // },
  // {
  //   Batchname:'batch name 2',
  // },
  // {
  //   Batchname:'batch name 3',
  // },
  // {
  //   Batchname:'batch name 4',
  // }];


  // BatchDetailList =[{
  //   rad:'DR BOB',
  //   dateread:'2/2/20',
  //   arretained:'2/9/20',
  //   fundingco:'PRE9991',
  //   patientid:'PRE9991',
  //   lastname:'Last name',
  //   firstname:'First name',
  //   dob:'10/25/84',
  //   study:'MRI OF KNEE',
  //   access:'RAM88717',
  //   mri:'MRI',
  //   billamount:'$600.00'
  // },
  // {
  //   rad:'DR BOB',
  //   dateread:'2/2/20',
  //   arretained:'2/9/20',
  //   fundingco:'PRE9991',
  //   patientid:'PRE9991',
  //   lastname:'Last name',
  //   firstname:'First name',
  //   dob:'10/25/84',
  //   study:'MRI OF KNEE',
  //   access:'RAM88717',
  //   mri:'MRI',
  //   billamount:'$600.00'
  // },
  // {
  //   rad:'DR BOB',
  //   dateread:'2/2/20',
  //   arretained:'2/9/20',
  //   fundingco:'PRE9991',
  //   patientid:'PRE9991',
  //   lastname:'Last name',
  //   firstname:'First name',
  //   dob:'10/25/84',
  //   study:'MRI OF KNEE',
  //   access:'RAM88717',
  //   mri:'MRI',
  //   billamount:'$600.00'
  // },
  // {
  //   rad:'DR BOB',
  //   dateread:'2/2/20',
  //   arretained:'2/9/20',
  //   fundingco:'PRE9991',
  //   patientid:'PRE9991',
  //   lastname:'Last name',
  //   firstname:'First name',
  //   dob:'10/25/84',
  //   study:'MRI OF KNEE',
  //   access:'RAM88717',
  //   mri:'MRI',
  //   billamount:'$600.00'
  // },
  // {
  //   rad:'DR BOB',
  //   dateread:'2/2/20',
  //   arretained:'2/9/20',
  //   fundingco:'PRE9991',
  //   patientid:'PRE9991',
  //   lastname:'Last name',
  //   firstname:'First name',
  //   dob:'10/25/84',
  //   study:'MRI OF KNEE',
  //   access:'RAM88717',
  //   mri:'MRI',
  //   billamount:'$600.00'
  // },
  // {
  //   rad:'DR BOB',
  //   dateread:'2/2/20',
  //   arretained:'2/9/20',
  //   fundingco:'PRE9991',
  //   patientid:'PRE9991',
  //   lastname:'Last name',
  //   firstname:'First name',
  //   dob:'10/25/84',
  //   study:'MRI OF KNEE',
  //   access:'RAM88717',
  //   mri:'MRI',
  //   billamount:'$600.00'
  // },
  // {
  //   rad:'DR BOB',
  //   dateread:'2/2/20',
  //   arretained:'2/9/20',
  //   fundingco:'PRE9991',
  //   patientid:'PRE9991',
  //   lastname:'Last name',
  //   firstname:'First name',
  //   dob:'10/25/84',
  //   study:'MRI OF KNEE',
  //   access:'RAM88717',
  //   mri:'MRI',
  //   billamount:'$600.00'
  // },
  // {
  //   rad:'DR BOB',
  //   dateread:'2/2/20',
  //   arretained:'2/9/20',
  //   fundingco:'PRE9991',
  //   patientid:'PRE9991',
  //   lastname:'Last name',
  //   firstname:'First name',
  //   dob:'10/25/84',
  //   study:'MRI OF KNEE',
  //   access:'RAM88717',
  //   mri:'MRI',
  //   billamount:'$600.00'
  // },
  // {
  //   rad:'DR BOB',
  //   dateread:'2/2/20',
  //   arretained:'2/9/20',
  //   fundingco:'PRE9991',
  //   patientid:'PRE9991',
  //   lastname:'Last name',
  //   firstname:'First name',
  //   dob:'10/25/84',
  //   study:'MRI OF KNEE',
  //   access:'RAM88717',
  //   mri:'MRI',
  //   billamount:'$600.00'
  // },
  // {
  //   rad:'DR BOB',
  //   dateread:'2/2/20',
  //   arretained:'2/9/20',
  //   fundingco:'PRE9991',
  //   patientid:'PRE9991',
  //   lastname:'Last name',
  //   firstname:'First name',
  //   dob:'10/25/84',
  //   study:'MRI OF KNEE',
  //   access:'RAM88717',
  //   mri:'MRI',
  //   billamount:'$600.00'
  // }];



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
  dataSource : any = [];
  retainARUnpaid :any = [];
  checkboxSelectedData:any;

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
    this.commonService.setTitle(LienPortalPageTitleOption.RETAINED_AND_UNPAID);
  }

  getRetainUnPaidList(){
    try {
      this.dataSource = [];
      this.lienPortalService.GetRetainUnpaid(this.getfilterData).subscribe((res)=>{
        if(res.status == 0){
          if (res.result) {
            this.dataSource = res.result.retainedArUnPaidBatches;
          }
          this.retainARUnpaid = this.dataSource;
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

  changeCheckbox(item: any) {
    if (item) {
      this.checkboxSelectedData = item.selectedRowsData;
    }
  }
}
