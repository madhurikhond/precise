import { Component, OnInit,ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';
import { DxDataGridComponent } from 'devextreme-angular';
import { LienPortalPageTitleOption } from 'src/app/models/lien-portal-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
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

  FundingCompanyDataSource =[{
    fundingcmp:'Precise Imaging',
    defaultcmp:'Yes',
    isactive : 'Yes',
  },
  {
    fundingcmp:'ABC',
    defaultcmp:'No',
    isactive : 'No',
  },
  {
    fundingcmp:'XYZ',
    defaultcmp:'Yes',
    isactive : 'No',
  },
  {
    fundingcmp:'ZYC',
    defaultcmp:'No',
    isactive : 'Yes',
  },
  {
    fundingcmp:'Precise Imaging',
    defaultcmp:'Yes',
    isactive : 'Yes',
  },
  {
    fundingcmp:'Precise Imaging',
    defaultcmp:'Yes',
    isactive : 'Yes',
  },
  {
    fundingcmp:'Precise Imaging',
    defaultcmp:'Yes',
    isactive : 'Yes',
  }
  
  ];

  constructor(private commonService: CommonMethodService) { }

  ngOnInit(): void {
    this.commonService.setTitle(LienPortalPageTitleOption.SETTINGS);
    this.getData();
  }

  onSettingTabClicked(){
    this.commonService.setTitle(LienPortalPageTitleOption.SETTINGS);
  }
  onFundingCompanyTabClicked(){
    this.commonService.setTitle(LienPortalPageTitleOption.FUNDING_COMPANY);
  }
  onMaterialGroupChange(event) {
    console.log(event);
  }
  getData() {
    return (this.days = [
      { id: 1, name: 'M' },
      { id: 2, name: 'T' },
      { id: 3, name: 'W' },
      { id: 4, name: 'Th' },
      { id: 5, name: 'F' },
      { id: 6, name: 'S' },
      { id: 7, name: 'Su' },
    ]);
    
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
