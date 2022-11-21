import { Component, OnInit , ViewChild} from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SignaturePad } from 'angular2-signaturepad';
import themes from 'devextreme/ui/themes';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-pending-bill',
  templateUrl: './pending-bill.component.html',
  styleUrls: ['./pending-bill.component.css']
})
export class PendingBillComponent implements OnInit {

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

  dataSourse =[{
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '1',
    lastname:'lastname1',
    firstname:'firstname1',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  {
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '2',
    lastname:'lastname2',
    firstname:'firstname2',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  {
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '3',
    lastname:'lastname3',
    firstname:'firstname3',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  {
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '4',
    lastname:'lastname4',
    firstname:'firstname4',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  {
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '5',
    lastname:'lastname5',
    firstname:'firstname5',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  {
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '6',
    lastname:'lastname6',
    firstname:'firstname6',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  {
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '7',
    lastname:'lastname7',
    firstname:'firstname7',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  {
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '8',
    lastname:'lastname8',
    firstname:'firstname8',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  {
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '9',
    lastname:'lastname9',
    firstname:'firstname9',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  {
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '10',
    lastname:'lastname10',
    firstname:'firstname10',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  {
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '11',
    lastname:'lastname11',
    firstname:'firstname11',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  {
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '12',
    lastname:'lastname12',
    firstname:'firstname12',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  {
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '13',
    lastname:'lastname13',
    firstname:'firstname13',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  {
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '14',
    lastname:'lastname14',
    firstname:'firstname14',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  {
    rad:'dr bob',
    dateread:'2/2/22',
    patientid : '15',
    lastname:'lastname15',
    firstname:'firstname15',
    dob:'10/25/84',
    dos:'10/25/21',
    study:'mri of knee',
    access:'ram845881',
    cptgroup:'mri'
  },
  ];
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
    this.getData();
    //this.selectAllForDropdownItems(this.getData());
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

  getData() {
    return (this.cities = [
      { id: 1, name: 'Amar' },
      { id: 2, name: 'Akbhar' },
      { id: 3, name: 'Anthony' },
      { id: 4, name: 'BadkaG' },
      { id: 5, name: 'Baave' },
      { id: 6, name: 'samar' },
      { id: 7, name: 'vanraj' },
    ]);
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
 