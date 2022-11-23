import { Component, OnInit,ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
@Component({
  selector: 'app-funding-co-paid',
  templateUrl: './funding-co-paid.component.html',
  styleUrls: ['./funding-co-paid.component.css']
})
export class FundingCoPaidComponent implements OnInit {

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  
  FundingCoPaid =[{
    checkno:'8887',
  },
  {
    checkno:'8889',
  },
  {
    checkno:'8889',
  },
  {
    checkno:'4589',
  },

  ];


  batchNameList=[{
    Batchname:'batch name 1',
  },
  {
    Batchname:'batch name 2',
  },
  {
    Batchname:'batch name 3',
  },
  {
    Batchname:'batch name 4',
  }];

  BatchDetailList =[{
    rad:'DR BOB',
    dateread:'2/2/20',
    executeddate:'2/9/20',
    paiddate:'2/9/20',
    fundingco:'PRE9991',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    access:'RAM007998',
    cptgroup:'MRI',
    arprice:'$500.00',
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    executeddate:'2/9/20',
    paiddate:'2/9/20',
    fundingco:'PRE9991',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    access:'RAM007998',
    cptgroup:'MRI',
    arprice:'$500.00',
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    executeddate:'2/9/20',
    paiddate:'2/9/20',
    fundingco:'PRE9991',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    access:'RAM007998',
    cptgroup:'MRI',
    arprice:'$500.00',
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    executeddate:'2/9/20',
    paiddate:'2/9/20',
    fundingco:'PRE9991',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    access:'RAM007998',
    cptgroup:'MRI',
    arprice:'$500.00',
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    executeddate:'2/9/20',
    paiddate:'2/9/20',
    fundingco:'PRE9991',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    access:'RAM007998',
    cptgroup:'MRI',
    arprice:'$500.00',
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    executeddate:'2/9/20',
    paiddate:'2/9/20',
    fundingco:'PRE9991',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    access:'RAM007998',
    cptgroup:'MRI',
    arprice:'$500.00',
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    executeddate:'2/9/20',
    paiddate:'2/9/20',
    fundingco:'PRE9991',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    access:'RAM007998',
    cptgroup:'MRI',
    arprice:'$500.00',
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    executeddate:'2/9/20',
    paiddate:'2/9/20',
    fundingco:'PRE9991',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    access:'RAM007998',
    cptgroup:'MRI',
    arprice:'$500.00',
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    executeddate:'2/9/20',
    paiddate:'2/9/20',
    fundingco:'PRE9991',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    access:'RAM007998',
    cptgroup:'MRI',
    arprice:'$500.00',
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    executeddate:'2/9/20',
    paiddate:'2/9/20',
    fundingco:'PRE9991',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    access:'RAM007998',
    cptgroup:'MRI',
    arprice:'$500.00',
  }
  ];




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

  constructor() { 
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

}


