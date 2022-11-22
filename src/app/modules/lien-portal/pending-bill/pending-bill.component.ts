import { Component, OnInit , ViewChild} from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SignaturePad } from 'angular2-signaturepad';
import themes from 'devextreme/ui/themes';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';

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

  dataSource = [];
  checkBoxesMode: string;
  allMode: string;
  pageNumber: number = 1;
  totalRecord: number = 0;
  pageSize: number = 20;
  cities = [];
  fundingCompanies = [];
  selectedCityIds: string[];
  dummyData :string;

  constructor(private lienPortalService: LienPortalService) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
   
   }

  ngOnInit(): void {
    this.getListingData();
    this.getData();
    //this.selectAllForDropdownItems(this.getData());
  }

  onPageNumberChange(pageNumber: any) {
    this.pageNumber = pageNumber;
    this.dataSource = this.fundingCompanies.slice((this.pageNumber - 1) * this.pageSize, ((this.pageNumber - 1) * this.pageSize) + this.pageSize)
  }
  onMaterialGroupChange(event) {
    console.log(event);
  }

  clearSign(): void {
    this.signaturePad.clear();
    this.dummyData = '';
  }

  getListingData() {
    try {
      var data = {
        "userType": "",
        "procGroupName": "",
        "loggedPartnerId": 1,
        "jwtToken": "",
        "patientId": "",
        "dateFrom": "2022-11-22T06:20:26.206Z",
        "dateTo": "2022-11-22T06:20:26.206Z",
        "dateType": "",
        "userId": 268
      };

      this.lienPortalService.GetPendingToBill(data).subscribe((result) => {
        if (result.status == 0) {
          if (result.result && result.result.length > 0) {
            this.dataSource = result.result
            this.fundingCompanies = this.dataSource;
            this.totalRecord = result.result.length;
            this.dataSource = this.fundingCompanies.slice((this.pageNumber - 1) * this.pageSize, ((this.pageNumber - 1) * this.pageSize) + this.pageSize)
          }
        }
        if (!result.exception) {
          this.lienPortalService.errorNotification(result.exception.message);
        }
      }, (error) => {
        this.lienPortalService.errorNotification(error.message);
      })
    } catch (error) {
      this.lienPortalService.errorNotification(error.message);
    }
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
 