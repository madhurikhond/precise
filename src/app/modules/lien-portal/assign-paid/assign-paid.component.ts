import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
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
  }

  getAssigndPaidData(){
    this.lienPortalService.GetAssignedARPaid(this.getfilterData).subscribe((res)=>{
      res.result = [
        {
          "checkNumber": "78455645",
          "checkDate": "11-22-2022",
          "checkAmount": 120.23,
          "fileName": null,
          "checkWiseData": [
            {
              "batchName": "Test_Darshit_20221122_600",
              "batchId": 1,
              "batchWiseData": [
                {
                  "rad": "EllaTest",
                  "dateRead": "09-22-1966",
                  "patientId": "PRE605603",
                  "lastName": "FEHRMANN",
                  "firstName": "GARY",
                  "dateOfBirth": "09-22-1966",
                  "study": "MRI LUMBAR SPINE W/O CONTRAST",
                  "dateARAssiged": "11-22-2022",
                  "paidDate": null,
                  "fundingCompany": "CYPRESS CARED",
                  "executionDate": null
                },
                {
                  "rad": "EllaTest",
                  "dateRead": "09-22-1966",
                  "patientId": "PRE605603",
                  "lastName": "FEHRMANN",
                  "firstName": "GARY",
                  "dateOfBirth": "09-22-1966",
                  "study": "MRI LUMBAR SPINE W/O CONTRAST",
                  "dateARAssiged": "11-22-2022",
                  "paidDate": null,
                  "fundingCompany": "CYPRESS CARED",
                  "executionDate": null
                }
              ]
            },
            {
              "batchName": "Test_Darshit_20221122_6001",
              "batchId": 1,
              "batchWiseData": [
                {
                  "rad": "EllaTest",
                  "dateRead": "09-22-1966",
                  "patientId": "PRE605603",
                  "lastName": "FEHRMANN",
                  "firstName": "GARY",
                  "dateOfBirth": "09-22-1966",
                  "study": "MRI CERVICAL SPINE W/O CONTRAST",
                  "dateARAssiged": "11-22-2022",
                  "paidDate": null,
                  "fundingCompany": "BLEDIN",
                  "executionDate": null
                },
                {
                  "rad": "EllaTest",
                  "dateRead": "09-22-1966",
                  "patientId": "PRE605603",
                  "lastName": "FEHRMANN",
                  "firstName": "GARY",
                  "dateOfBirth": "09-22-1966",
                  "study": "MRI CERVICAL SPINE W/O CONTRAST",
                  "dateARAssiged": "11-22-2022",
                  "paidDate": null,
                  "fundingCompany": "BLEDIN",
                  "executionDate": null
                }
              ]
            }
          ]
        }
      ]
      this.dataSource = res.result;
      this.AssignARpaid = this.dataSource;
    })
  }

}

