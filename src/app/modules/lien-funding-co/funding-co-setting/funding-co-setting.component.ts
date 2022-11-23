import { Component, OnInit,ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-funding-co-setting',
  templateUrl: './funding-co-setting.component.html',
  styleUrls: ['./funding-co-setting.component.css']
})
export class FundingCoSettingComponent implements OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
 
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 500,
    canvasHeight: 100,
    Placeholder:'test'
  };
  selected: boolean = true;
  days = [];
  dummyData :string;
  pageNumber: number = 1;
  totalRecord: number = 1;
  pageSize: number;

  

  constructor() { }

  ngOnInit(): void {
    
  }

  onSettingTabClicked(){

  }
  onFundingCompanyTabClicked(){

  }
  onMaterialGroupChange(event) {
    console.log(event);
  }
  
  clearSign(): void {
    this.signaturePad.clear();
    this.dummyData = '';
  }
  drawComplete() {
    this.dummyData = this.signaturePad.toDataURL();
  }

  drawStart() {
    console.log('begin drawing');
  }

}
