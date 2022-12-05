import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LienFundingCoTabName, LienPortalAPIEndpoint, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';


@Component({
  selector: 'app-lien-funding-co',
  templateUrl: './lien-funding-co.component.html',
  styleUrls: ['./lien-funding-co.component.css']
})
export class LienFundingCoComponent implements OnInit {

  list_ReferrerByUser: any = [];
  selectedMode:string;
  filter: any;
  filterForm: FormGroup;

  public readonly lienFundingCoTabName = LienFundingCoTabName;
  constructor(private lienPortalService: LienPortalService,
    private fb: FormBuilder) {
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
  }

  onFilter() {
    this.filter = {
      "patientId": this.filterForm.controls.patientId.value,
      "dateFrom": this.lienPortalService.convertDateFormat(this.filterForm.controls.dateFrom.value),
      "dateTo": this.lienPortalService.convertDateFormat(this.filterForm.controls.dateTo.value),
      "dateType": this.filterForm.controls.dateType.value,
      "referrers": this.filterForm.controls.readingRad.value,
    };

    switch (this.selectedMode) {
      case LienFundingCoTabName.PENDING:
        break;
      case LienFundingCoTabName.UNPAID:
        this.filter.batch = this.filterForm.controls.batch.value;
        break;
      case LienFundingCoTabName.PAID:
        this.filter.batch = this.filterForm.controls.batch.value;
        this.filter.check = this.filterForm.controls.check.value;
        break;
      default:
        this.filter = undefined;
        break;
    }
  }

  clearFilter() {
    this.filterForm.patchValue({
      patientId: '',
      readingRad: '',
      dateFrom: '',
      dateTo: '',
      dateType: '',
      batch: '',
      check: '',
    });
    this.onFilter();
  }
  
  private bindReferrerByUser_DDL() {
    let data = {};
    this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.GetReferrerByUser).subscribe((result) => {
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





