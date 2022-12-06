import { Component, OnInit,ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';
import { DxDataGridComponent } from 'devextreme-angular';
import { LienPortalAPIEndpoint, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';

@Component({
  selector: 'app-funding-co-setting',
  templateUrl: './funding-co-setting.component.html',
  styleUrls: ['./funding-co-setting.component.css']
})
export class FundingCoSettingComponent implements OnInit {
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
  pageNumber: number = 1;
  totalRecord: number = 1;
  pageSize: number;
  isDefaultNamesEnable: boolean = true;
  isPendingTaskEnable: boolean = true;
  isDefaultSignature: boolean = true;
  defaultSignature: string ;



  constructor(private lienPortalService:LienPortalService) { }

  ngOnInit(): void {
    this.getFundingCompanSettings();
  }

  clearSign(): void {
    this.signaturePad.clear();
    this.defaultSignature = '';
    this.signaturePad.fromDataURL(this.defaultSignature);
  }
  onSignatureComplete() {
    this.defaultSignature = this.signaturePad.toDataURL();
  }

  getFundingCompanSettings(){
    var data = {};
    this.lienPortalService.PostAPI(data,LienPortalAPIEndpoint.GetFundingCompanySetting).subscribe(res=>{
      if(res.status == LienPortalResponseStatus.Success){
        // console.log(res);
        var data = res.result;
        this.isDefaultNamesEnable = data.isDefaultNamesEnable;
        this.isPendingTaskEnable = data.isPendingTaskEnable;
        this.isDefaultSignature = data.isDefaultSignature;
        if(data.defaultSign.defaultSign)
          this.signaturePad.fromDataURL(data.defaultSign.defaultSign);
      } else
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    },() => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  saveSettings(){
    var data = {
      "isDefaultNamesEnable": this.isDefaultNamesEnable,
      "isPendingTaskEnable": this.isPendingTaskEnable,
      "isDefaultSignature": this.isDefaultSignature,
      "defaultSign": {
        "defaultSign": this.defaultSignature
      },
    }
    this.lienPortalService.PostAPI(data,LienPortalAPIEndpoint.AddFundingUserSetting).subscribe(res=>{
      if(res.status == LienPortalResponseStatus.Success){
        this.lienPortalService.successNotification(LienPortalStatusMessage.SETTING_SAVED_SUCCESS);
        this.getFundingCompanSettings();
      }else
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

}
