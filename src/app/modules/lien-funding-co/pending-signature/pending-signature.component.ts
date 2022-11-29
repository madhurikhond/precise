import { Component, OnInit , ViewChild} from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SignaturePad } from 'angular2-signaturepad';
import themes from 'devextreme/ui/themes';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-pending-signature',
  templateUrl: './pending-signature.component.html',
  styleUrls: ['./pending-signature.component.css']
})
export class PendingSignatureComponent implements OnInit {

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
 
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 750,
    canvasHeight: 100,
    Placeholder:'test'
  };

  PendingSignature =[{
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
    datearassign:'2/9/20',
    patientid:'PRE999',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    accession:'RAM88717',
    cptgroup:'MRI',
    arprice:'$600.00'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    datearassign:'2/9/20',
    patientid:'PRE9996',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    accession:'RAM88717',
    cptgroup:'MRI',
    arprice:'$600.00'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    datearassign:'2/9/20',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    accession:'RAM88717',
    cptgroup:'MRI',
    arprice:'$600.00'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    datearassign:'2/9/20',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    accession:'RAM88717',
    cptgroup:'MRI',
    arprice:'$600.00'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    datearassign:'2/9/20',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    accession:'RAM88717',
    cptgroup:'MRI',
    arprice:'$600.00'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    datearassign:'2/9/20',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    accession:'RAM88717',
    cptgroup:'MRI',
    arprice:'$600.00'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    datearassign:'2/9/20',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    accession:'RAM88717',
    cptgroup:'MRI',
    arprice:'$600.00'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    datearassign:'2/9/20',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    accession:'RAM88717',
    cptgroup:'MRI',
    arprice:'$600.00'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    datearassign:'2/9/20',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    accession:'RAM88717',
    cptgroup:'MRI',
    arprice:'$600.00'
  },
  {
    rad:'DR BOB',
    dateread:'2/2/20',
    datearassign:'2/9/20',
    patientid:'PRE9991',
    lastname:'Last name',
    firstname:'First name',
    dob:'10/25/84',
    study:'MRI OF KNEE',
    accession:'RAM88717',
    cptgroup:'MRI',
    arprice:'$600.00'
  }];
  checkBoxesMode: string;
  allMode: string;
  pageNumber: number = 1;
  totalRecord: number = 1;
  pageSize: number;
  cities = [];
  selectedCityIds: string[];
  dummyData :string;

  constructor() {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
   
   }

  ngOnInit(): void {
  }

  onPageNumberChange(pageNumber: any) {
    this.pageNumber = pageNumber;
    // this.applyFilter();
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

  // selectAllForDropdownItems(items: any[]) {
  //   let allSelect = (items) => {
  //     items.forEach((element) => {
  //       element['selectedAllGroup'] = 'selectedAllGroup';
  //     });
  //   };

  //   allSelect(items);
  // }

}
 