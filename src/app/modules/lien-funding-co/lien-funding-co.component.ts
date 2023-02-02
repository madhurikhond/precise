import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LienFundingCoTabName, LienPortalAPIEndpoint, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { StorageService } from 'src/app/services/common/storage.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';


@Component({
  selector: 'app-lien-funding-co',
  templateUrl: './lien-funding-co.component.html',
  styleUrls: ['./lien-funding-co.component.css']
})
export class LienFundingCoComponent implements OnInit {

  list_ReferrerByUser: any = [];
  selectedMode: string;
  filter: any;
  filterForm: FormGroup;
  dateType: any = [];

  public readonly lienFundingCoTabName = LienFundingCoTabName;
  constructor(private lienPortalService: LienPortalService,
    private fb: FormBuilder,private storageService : StorageService) {
      this.storageService.permission = null;
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      patientId: [''],
      readingRad: [''],
      dateFrom: [''],
      dateTo: [''],
      dateType: [''],
      batch: [''],
      check: [''],
    });

    this.bindReferrerByUser_DDL();
    this.onTabClicked(LienFundingCoTabName.PENDING);
  }

  onTabClicked(selectedMode) {
    this.selectedMode = selectedMode;
    this.clearFilter();
    this.bindDateType_list();
  }

  onFilter() {
    this.filter = {
      "patientId": this.filterForm.controls.patientId.value,
      "dateFrom": this.lienPortalService.convertDateFormat(this.filterForm.controls.dateFrom.value),
      "dateTo": this.lienPortalService.convertDateFormat(this.filterForm.controls.dateTo.value),
      "dateType": this.filterForm.controls.dateType.value,
      "radiologist": this.filterForm.controls.readingRad.value,
    };

    switch (this.selectedMode) {
      case LienFundingCoTabName.ORIGINALLIENOWNER:
        break;
      case LienFundingCoTabName.PENDING:
        break;
      case LienFundingCoTabName.UNPAID:
        this.filter.batch = this.filterForm.controls.batch.value;
        break;
      case LienFundingCoTabName.PAID:
        this.filter.batch = this.filterForm.controls.batch.value;
        this.filter.checkNumber = this.filterForm.controls.check.value;
        break;
      default:
        this.filter = undefined;
        break;
    }
  }

  bindDateType_list() {
    switch (this.selectedMode) {
      case LienFundingCoTabName.ORIGINALLIENOWNER:
        this.dateType = [
          {val:'studyDate',text:'Date Of Study'}
        ]
        break;
      case LienFundingCoTabName.PENDING:
        this.dateType = [
          {val:'birthDate',text:'Date Of Birth'},
          {val:'dateRead',text:'Date Of Read'},
          {val:'assignedDate',text:'Date AR Assigned'}
        ]
        break;
      case LienFundingCoTabName.UNPAID:
        this.dateType = [
          {val:'birthDate',text:'Date Of Birth'},
          {val:'dateRead',text:'Date Of Read'},
          {val:'assignedDate',text:'Date AR Assigned'},
          {val:'executeDate',text:'Execution Date'}
        ]
        break;
      case LienFundingCoTabName.PAID:
        this.dateType = [
          {val:'birthDate',text:'Date Of Birth'},
          {val:'dateRead',text:'Date Of Read'},
          {val:'executeDate',text:'Execution Date'},
          {val:'paidDate',text:'Paid Date'}
        ]
        break;
      default:
        break;
    }
  }

  clearFilter() {
    this.filterForm.reset();
    this.onFilter();
  }

  private bindReferrerByUser_DDL() {
    let data = {};
    this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.GetRadiologistUser).subscribe((result) => {
      if (result.status == LienPortalResponseStatus.Success) {
        if (result.result)
          this.list_ReferrerByUser = result.result
      }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    });
  }
}





