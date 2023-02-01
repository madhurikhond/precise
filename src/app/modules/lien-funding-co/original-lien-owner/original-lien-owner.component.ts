import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { DxDataGridComponent } from 'devextreme-angular';
import { LienPortalAPIEndpoint, LienPortalFundingCoPermission, LienPortalPageTitleOption, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';

enum actionDropdown {
  remove = 'remove',
  edit_payment = 'edit_payment',
}

@Component({
  selector: 'app-original-lien-owner',
  templateUrl: './original-lien-owner.component.html',
  styleUrls: ['./original-lien-owner.component.css']
})
export class OriginalLienOwnerComponent {

  getfilterData: any;
  permission: any;
  permissionTitle = LienPortalFundingCoPermission.PayForAR;
  @Input()
  set filterData(val: any) {
    if (val && val != null) {
      this.getfilterData = val;
      this.getOriginalLienOwnerData();
      this.setPermission();
    }
  }

  _actionDropdown = actionDropdown;

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild("modal_open") modal_open: ElementRef;
  @ViewChild("modal_edit_payment_close") modal_edit_payment_close: ElementRef;
  @ViewChild("modal_remove_close") modal_remove_close: ElementRef;

  checkBoxesMode: string;
  selectedData: any = [];
  isSelectAll: boolean = false;
  allMode: string;
  pageNumber: number = 0;
  totalRecord: number = 0;
  currentPageNumber: number = 1;
  pageSize: number = 20;

  dataSource: any = [];
  radiologistNameWiseCounts: any = [];
  checkboxSelectedData: any;
  defaultCheckDate = new Date();
  selectedAction = "";                                                                                                                              
  expandAll = false;


  constructor(private lienPortalService: LienPortalService, private commonService: CommonMethodService, private fb: FormBuilder,
    private storageService: StorageService) {
    this.allMode = 'page';
    this.checkBoxesMode = 'always';

    this.commonService.setTitle(LienPortalPageTitleOption.ORIGINALLIENOWNERDATA);
  }

  private getOriginalLienOwnerData() {
    this.pageNumber = 0;
    this.currentPageNumber = 1;
    let data = {
      "fromDate": this.getfilterData.dateFrom,
      "toDate": this.getfilterData.dateTo,
      "dateType": "studyDate",
    }
    this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.GetReferrersWisePendingToBillCount).subscribe(res => {
      if (res.status == LienPortalResponseStatus.Success) {
        this.totalRecord = 0;
        this.dataSource = [];
        if (res.result) {
          var data = res.result.radiologistNameWiseCounts;
          this.dataSource = data;
          this.radiologistNameWiseCounts = this.dataSource;
          this.totalRecord = this.radiologistNameWiseCounts.length;
        }
      } else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  onPageNumberChange(pageNumber: any) {
    this.currentPageNumber = pageNumber;
    if (pageNumber > 1)
      this.pageNumber = pageNumber - 1;
    else
      this.pageNumber = 0;
  }

  setPermission() {
    if (this.storageService.permission.length > 0) {
      var permission: any = this.storageService.permission;
      permission = permission.filter(val => val.PageTitle == LienPortalFundingCoPermission.LienFundingCompany);
      if (permission.length > 0) {
        var data = permission[0].Children.filter(val => val.PageTitle == this.permissionTitle);
        if (data.length == 1)
          this.permission = data[0];
      }
    }
  }
}
