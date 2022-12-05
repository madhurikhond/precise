import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SignaturePad } from 'angular2-signaturepad';
import themes from 'devextreme/ui/themes';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { LienPortalAPIEndpoint, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';

@Component({
  selector: 'app-pending-signature',
  templateUrl: './pending-signature.component.html',
  styleUrls: ['./pending-signature.component.css']
})
export class PendingSignatureComponent implements OnInit {

  getfilterData: any;
  @Input()
  set filterData(val: any) {
    if (val && val != null) {
      this.getfilterData = val;
      this.getListingData();
    }
  }

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 750,
    canvasHeight: 100,
    Placeholder: 'test'
  };

  dataSource:any = [];

  checkBoxesMode: string;
  allMode: string;
  pageNumber: number = 1;
  totalRecord: number = 0;
  pageSize: number = 10;
  selectedCityIds: string[];
  dummyData: string;

  constructor(private lienPortalService: LienPortalService) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';

  }

  ngOnInit(): void {
  }

  getListingData() {
    this.lienPortalService.PostAPI(this.getfilterData, LienPortalAPIEndpoint.GetPendingSignature).subscribe((result) => {
      if (result.status == LienPortalResponseStatus.Success) {
        this.totalRecord = result.result.length;
        this.dataSource = [];
        if (result.result)
          this.dataSource = result.result
      }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }


  onPageNumberChange(pageNumber: any) {
    this.pageNumber = pageNumber;
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


}
