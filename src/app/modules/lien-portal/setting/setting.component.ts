import { Component, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';
import { DxDataGridComponent } from 'devextreme-angular';
import { LienPortalAPIEndpoint, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { StorageService } from 'src/app/services/common/storage.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  selectedMode: string = 'settings';
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 500,
    canvasHeight: 100
  };
  selected_reminder_to_bill: boolean = true;
  selected_pdf_copy: boolean = true;
  selected_signature: boolean = true;
  days = [];
  radiologistSign: string;

  FundingCompanyDataSource = [];
  defaultEmail: any;
  selectedValue: any;

  totalRecord: number = 0;
  pageNumber: number = 0;
  pageSize: number = 20;
  currentPageNumber: number = 1;

  fundingCompanyId: number;

  constructor(private lienPortalService: LienPortalService,
    private storageService: StorageService) { }

  ngOnInit(): void {
   
    this.getDaysData();
    this.onSettingTabClicked();
    this.defaultEmail = this.storageService.user.WorkEmail;
  }

  onFundingCompanyTabClicked() {
    this.bindFundComp_list();
    this.selectedMode = 'funding_company';
  }

  bindFundComp_list() {
    let data = {};
    this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.GetFundingCompanyList).subscribe((result) => {
      if (result.status == LienPortalResponseStatus.Success) {
        if (result.result) {
           this.FundingCompanyDataSource = [];
          this.totalRecord = 0;
          this.pageNumber = 0;
          this.currentPageNumber = 1;

          this.FundingCompanyDataSource = result.result
          this.totalRecord = result.result.length;
        }
      }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    });
  }

  onFundCompPageNumberChange(pageNumber: any) {
    this.currentPageNumber = pageNumber;
    if (pageNumber > 1)
      this.pageNumber = pageNumber - 1;
    else
      this.pageNumber = 0;
  }



  onSettingTabClicked() {
    this.selectedMode = 'settings';
  }

  getDaysData() {
    this.days = [
      { id: 1, name: 'M' },
      { id: 2, name: 'T' },
      { id: 3, name: 'W' },
      { id: 4, name: 'Th' },
      { id: 5, name: 'F' },
      { id: 6, name: 'S' },
      { id: 7, name: 'Su' },
    ];
  }


  clearSign(): void {
    this.signaturePad.clear();
    this.radiologistSign = '';
  }

  saveSign() {
    if (this.radiologistSign) {
      var data = {
        "defaultSign": this.radiologistSign
      };

      this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.AddRadDefaultSign).subscribe((result) => {
        if (result.status == LienPortalResponseStatus.Success) {
          this.lienPortalService.successNotification(LienPortalStatusMessage.SIGNATURE_UPDATED_SUCCESS);
        }
        else
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);

      }, () => {
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      })
    }
  }

  onSignatureComplete() {
    this.radiologistSign = this.signaturePad.toDataURL();
  }

  openFundCompPupup(fundingCompanyId: number = 0) {
    this.fundingCompanyId = fundingCompanyId;
  }

  onReturnSuccess(isSuccess: any) {
    if (isSuccess) {
      this.fundingCompanyId = undefined;
      this.bindFundComp_list();
    }
  }
}
