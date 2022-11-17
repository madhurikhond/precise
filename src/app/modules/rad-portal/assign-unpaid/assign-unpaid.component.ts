import { Component, OnInit,ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
@Component({
  selector: 'app-assign-unpaid',
  templateUrl: './assign-unpaid.component.html',
  styleUrls: ['./assign-unpaid.component.css']
})
export class AssignUnpaidComponent implements OnInit {

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  
  AssignARUnpaid =[{
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
    arassigneddate:'2/9/20',
    executiondate:'2/9/20',
    fundingco:'PRE9991',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    arassigneddate:'2/9/20',
    executiondate:'2/9/20',
    fundingco:'PRE9998',
    patientid:'PRE9998',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    arassigneddate:'2/9/20',
    executiondate:'2/9/20',
    fundingco:'PRE6770',
    patientid:'PRE6770',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    arassigneddate:'2/9/20',
    executiondate:'2/9/20',
    fundingco:'PRE6770',
    patientid:'PRE6770',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    arassigneddate:'2/9/20',
    executiondate:'2/9/20',
    fundingco:'PRE6770',
    patientid:'PRE6770',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    arassigneddate:'2/9/20',
    executiondate:'2/9/20',
    fundingco:'PRE6770',
    patientid:'PRE6770',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    arassigneddate:'2/9/20',
    executiondate:'2/9/20',
    fundingco:'PRE6770',
    patientid:'PRE6770',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    arassigneddate:'2/9/20',
    executiondate:'2/9/20',
    fundingco:'PRE6770',
    patientid:'PRE6770',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    arassigneddate:'2/9/20',
    executiondate:'2/9/20',
    fundingco:'PRE6770',
    patientid:'PRE6770',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    arassigneddate:'2/9/20',
    executiondate:'2/9/20',
    fundingco:'PRE77612',
    patientid:'PRE77612',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE'
  }];



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
