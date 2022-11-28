import { Component, ElementRef, Input, OnInit,ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';
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

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 750,
    canvasHeight: 100,
    Placeholder: 'test'
  };


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
  dataSource : any = [];
  retainARUnpaid :any = [];
  checkboxSelectedData:any = [];
  fundingCompanies = [];
  selecteFundComp: number = 0;
  firstName: string;
  lastName: string;
  radiologistSign: string;

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
        if(res.status == 1){
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

    this.dataGrid.instance.expandRow((item.currentSelectedRowKeys[0]));
      setTimeout(() => {
        if(item) {
          this.checkboxSelectedData = item.selectedRowsData;
        }
    
        //selection
    
        if(item.currentSelectedRowKeys.length > 0){
          var selectedbatchName = item.currentSelectedRowKeys[0].batchName;
          var chkBatch = document.getElementsByName(selectedbatchName);
          chkBatch.forEach(item => {
            var element = <HTMLInputElement> item;
            element.checked = true;
          });
        }
    
        //Deselection
        
        if(item.currentDeselectedRowKeys.length > 0){
          var deSelectedbatchname = item.currentDeselectedRowKeys[0].batchName;
          var chkBatch = document.getElementsByName(deSelectedbatchname);
          this.dataGrid.instance.collapseRow((item.currentDeselectedRowKeys[0]));
          chkBatch.forEach(function(item) {
            var element = <HTMLInputElement> item;
            element.checked = false;
          });
        }
      }, 150);
    
  }

  drawComplete() {
    this.radiologistSign = this.signaturePad.toDataURL();
  }


  clearSign(): void {
    this.signaturePad.clear();
    this.radiologistSign = '';
  }

  bindFundComp_DDL() {
    this.fundingCompanies = [
      { id: 0, name: 'Select' },
      { id: 1, name: 'Amar' },
      { id: 2, name: 'Akbhar' },
      { id: 3, name: 'Anthony' },
      { id: 4, name: 'BadkaG' },
      { id: 5, name: 'Baave' },
      { id: 6, name: 'samar' },
      { id: 7, name: 'vanraj' },
    ];
  }

  onAssignARValidation(): boolean {
    return (
      this.radiologistSign &&
      this.radiologistSign != "" &&

      this.checkboxSelectedData &&
      this.checkboxSelectedData.length > 0 &&

      this.selecteFundComp &&
      this.selecteFundComp > 0 &&

      this.firstName &&
      this.firstName != "" &&

      this.lastName &&
      this.lastName != ""
    );
  }
}
