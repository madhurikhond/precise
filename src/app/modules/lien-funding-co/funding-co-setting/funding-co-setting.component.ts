import { Component, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';
import { DxDataGridComponent } from 'devextreme-angular';
import { LienPortalAPIEndpoint, LienPortalFundingCoPermission, LienPortalPageTitleOption, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';
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
    Placeholder: 'test'
  };
  pageNumber: number = 1;
  totalRecord: number = 1;
  pageSize: number;
  isDefaultNamesEnable: boolean = true;
  isPendingTaskEnable: boolean = true;
  isDefaultSignature: boolean = true;
  defaultSignature: string;
  permission : any;
  permissionTitle = LienPortalFundingCoPermission.SignForAssignAR;

  constructor(private lienPortalService: LienPortalService, private storageService : StorageService,private readonly commonService: CommonMethodService) {
    this.storageService.permission = null;
  }

  ngOnInit(): void {
    this.commonService.setTitle(LienPortalPageTitleOption.SETTINGS);
    this.setPermission();
    this.getFundingCompanySettings();
  }

  clearSign(): void {
    this.signaturePad.clear();
    this.defaultSignature = '';
    this.signaturePad.fromDataURL(this.defaultSignature);
  }
  onSignatureComplete() {
    this.defaultSignature = this.signaturePad.toDataURL();
  }

  getFundingCompanySettings() {
    var data = {};
    this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.GetFundingCompanySetting).subscribe(res => {
      if (res.status == LienPortalResponseStatus.Success) {
        if (res.result) {
          var data = res.result;
          if(this.permission &&  this.permission.IsAdd === 'true'){
            this.isDefaultNamesEnable = data.isDefaultNamesEnable;
            this.isPendingTaskEnable = data.isPendingTaskEnable;
            this.isDefaultSignature = data.isDefaultSignature;
          }
          else{
            this.isDefaultNamesEnable = false;
            this.isPendingTaskEnable = false;
            this.isDefaultSignature = false;
          }
          if (data.defaultSign)
          {
            if (data.defaultSign.defaultSign)
              this.defaultSignature = data.defaultSign.defaultSign;
              this.signaturePad.fromDataURL(data.defaultSign.defaultSign);
          }
        }
      } else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  saveSettings() {
    var data = {
      "isDefaultNamesEnable": this.isDefaultNamesEnable,
      "isPendingTaskEnable": this.isPendingTaskEnable,
      "isDefaultSignature": this.isDefaultSignature,
      "defaultSign": {
        "defaultSign": this.defaultSignature
      },
    }
    this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.AddFundingUserSetting).subscribe(res => {
      if (res.status == LienPortalResponseStatus.Success)
        this.lienPortalService.successNotification(LienPortalStatusMessage.SETTING_SAVED_SUCCESS);
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }


  saveSign() {
    var data = {
      "defaultSign": this.defaultSignature
    };
    this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.AddRadDefaultSign).subscribe((result) => {
      if (result.status == LienPortalResponseStatus.Success)
        this.lienPortalService.successNotification(LienPortalStatusMessage.SIGNATURE_UPDATED_SUCCESS);
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  setPermission() {
    if (this.storageService.permission.length > 0) {
      var permission :any= this.storageService.permission[0];
      if (permission.Children){
        var data = permission.Children.filter(val => val.PageTitle == this.permissionTitle);
        if(data.length == 1)
          this.permission = data[0];
      }
    }
  }
}
