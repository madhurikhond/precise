import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SignaturePad } from 'angular2-signaturepad';
import themes from 'devextreme/ui/themes';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';

@Component({
  selector: 'app-pending-bill',
  templateUrl: './pending-bill.component.html',
  styleUrls: ['./pending-bill.component.css']
})
export class PendingBillComponent implements OnInit {

  getfilterData: any;
  @Input()
  set filterData(val: any) {
    if (val && val != "") {
      this.getfilterData = val;
      this.getListingData();
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

  radiologistSign: string;

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  
  dataSource = [];
  checkBoxesMode: string;
  allMode: string;
  pageNumber: number = 0;
  currentPageNumber: number = 1;
  totalRecord: number = 0;
  pageSize: number = 20;
  fundingCompanies = [];
  selecteFundComp: number = 0;
  checkboxSelectedData: any = [];
  firstName: string;
  lastName: string;


  constructor(private lienPortalService: LienPortalService, private commonService: CommonMethodService, private storageService: StorageService) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  ngOnInit(): void {
    this.firstName = this.storageService.user.FirstName;
    this.lastName = this.storageService.user.LastName;
    this.bindFundComp_DDL();
  }

  onPageNumberChange(pageNumber: any) {
    this.currentPageNumber = pageNumber;
    if (pageNumber > 1)
      this.pageNumber = pageNumber - 1;
    else
      this.pageNumber = 0;
  }

  onMaterialGroupChange(event) {
  }

  clearSign(): void {
    this.signaturePad.clear();
    this.radiologistSign = '';
  }

  showDocManager(patientId: any) {
    this.commonService.sendDataToDocumentManager(patientId);
  }

  getListingData() {
    try {
      this.lienPortalService.GetPendingToBill(this.getfilterData).subscribe((result) => {
        if (result.status == 0) {
          this.totalRecord = result.result.length;
          this.dataSource = [];
          if (result.result && result.result.length > 0) {
            this.dataSource = result.result
          }
        }
        if (result.exception && result.exception.message) {
          this.lienPortalService.errorNotification(result.exception.message);
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

  drawComplete() {
    this.radiologistSign = this.signaturePad.toDataURL();
  }

  onAssignAR() {
    if (this.onAssignARValidation()) {
      var checkboxSelectedData = this.checkboxSelectedData.map(data => ({
        patientId: data.patientId,
        internalStudyId: data.internalStudyId,
        cptGroup: data.cptGroup
      }));
      var assignData = {
        request: checkboxSelectedData,
        radiologistSign: this.radiologistSign,
        firstName: this.firstName,
        lastName: this.lastName,
        fundingCompanyId: this.selecteFundComp,
        loggedPartnerId: this.storageService.PartnerId,
        jwtToken: this.storageService.PartnerJWTToken,
        userId: this.storageService.user.UserId
      }

      console.log(assignData);
    }
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
