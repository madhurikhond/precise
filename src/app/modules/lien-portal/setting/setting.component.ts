import { Component, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';
import { DxDataGridComponent } from 'devextreme-angular';
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
  pageNumber: number = 1;
  totalRecord: number = 1;
  pageSize: number;
  defaultEmail:any;
  selectedValue:any;

  FundingCompanyDataSource = [{
    fundingcmp: 'Precise Imaging',
    defaultcmp: 'Yes',
    isactive: 'Yes',
  },
  {
    fundingcmp: 'ABC',
    defaultcmp: 'No',
    isactive: 'No',
  },
  {
    fundingcmp: 'XYZ',
    defaultcmp: 'Yes',
    isactive: 'No',
  },
  {
    fundingcmp: 'ZYC',
    defaultcmp: 'No',
    isactive: 'Yes',
  },
  {
    fundingcmp: 'Precise Imaging',
    defaultcmp: 'Yes',
    isactive: 'Yes',
  },
  {
    fundingcmp: 'Precise Imaging',
    defaultcmp: 'Yes',
    isactive: 'Yes',
  },
  {
    fundingcmp: 'Precise Imaging',
    defaultcmp: 'Yes',
    isactive: 'Yes',
  }

  ];

  constructor(private lienPortalService: LienPortalService, private storageService: StorageService) { }

  ngOnInit(): void {
    this.radiologistSign = 'data:image/png;base64,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';
    // this.signaturePad.fromDataURL(this.radiologistSign,this.signaturePadOptions);
    this.getDaysData();
    this.defaultEmail = this.storageService.user.WorkEmail;
  }

  onSettingTabClicked() {

  }
  onFundingCompanyTabClicked() {

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
    try {
      if (this.radiologistSign) {
        var data = {
          "defaultSign": this.radiologistSign,
          "loggedPartnerId": this.storageService.PartnerId,
          "jwtToken": this.storageService.PartnerJWTToken,
          "userId": Number(this.storageService.user.UserId)
        };

        this.lienPortalService.AddRadiologistDefaultSign(data).subscribe((result) => {
          // console.log(result);
          if (result.status == 1) {
            // this.lienPortalService.successNotification(result);
          }
          if (result.exception && result.exception.message) {
            this.lienPortalService.errorNotification(result.exception.message);
          }
        }, (error) => {
          if (error.message) {
            this.lienPortalService.errorNotification(error.message);
          }
        })
      }
    } catch (error) {
      if (error.message) {
        this.lienPortalService.errorNotification(error.message);
      }
    }
  }

  onSignatureComplete() {
    this.radiologistSign = this.signaturePad.toDataURL();
  }

  onSelected(time){

  }

}
