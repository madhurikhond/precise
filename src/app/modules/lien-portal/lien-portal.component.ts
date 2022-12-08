import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { LienPortalAPIEndpoint, LienPortalResponseStatus, LienPortalStatusMessage, LienPortalTabName } from 'src/app/models/lien-portal-response';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';


@Component({
  selector: 'app-rad-portal',
  templateUrl: './lien-portal.component.html',
  styleUrls: ['./lien-portal.component.css']
})
export class LienPortalComponent implements OnInit {

  list_CPTGroup: any = [];
  list_ReferrerByUser: any = [];
  list_FundingCompanyByUser: any = [];
  filter: any;
  selectedMode: string;
  filterForm: FormGroup;
  dateType:any = [];


  constructor(private lienPortalService: LienPortalService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      patientId: [''],
      readingRad: [''],
      cptGroup: [''],
      dateFrom: [''],
      dateTo: [''],
      dateType: [''],
      fundingCompany: [''],
      fundingCoSigned: [''],
      check: [''],
      checkNumber: [''],
    });

    this.dateType = [
      {val:'birthDate',text:'Date Of Birth'},
      {val:'dateRead',text:'Date Of Read'},
      {val:'studyDate',text:'Date Of Study'}
    ]
    // Dropdown Binding
    this.bindCPTGroup_DDL();
    this.bindReferrerByUser_DDL();
    this.bindFundingCompanyByUser_DDL();

    // Default Pending Click
    this.onPendingBillTabClicked();
  }

  bindCPTGroup_DDL() {
    let data = {};
      this.lienPortalService.PostAPI(data,LienPortalAPIEndpoint.GetCPTGroupList).subscribe((result) => {
        if (result.status == LienPortalResponseStatus.Success) {
          if (result.result)
            this.list_CPTGroup = result.result
        }
        else
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      }, () => {
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      });
  }

  bindReferrerByUser_DDL() {
    let data = {};
      this.lienPortalService.PostAPI(data,LienPortalAPIEndpoint.GetReferrerByUser).subscribe((result) => {
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

  bindFundingCompanyByUser_DDL() {
    let data = {};
      this.lienPortalService.PostAPI(data,LienPortalAPIEndpoint.GetFundingCompanyByUser).subscribe((result) => {
        if (result.status == LienPortalResponseStatus.Success) {
          if (result.result)
            this.list_FundingCompanyByUser = result.result
        }
        else
            this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      }, () => {
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      });
  }

  onPendingBillTabClicked() {
    this.selectedMode = LienPortalTabName.PENDING;
    this.dateType = [
      {val:'birthDate',text:'Date Of Birth'},
      {val:'dateRead',text:'Date Of Read'},
      {val:'studyDate',text:'Date Of Study'}
    ]
    this.clearFilter();
  }

  onAssignUnpaidTabClicked() {
    this.selectedMode = LienPortalTabName.ASSIGN_UNPAID;
    this.dateType = [
      {val:'birthDate',text:'Date Of Birth'},
      {val:'dateRead',text:'Date Of Read'},
      {val:'assignedDate',text:'AR Assigned Date'},
      {val:'executeDate',text:'Execution Date'}
    ]
    this.clearFilter();
  }

  onAssignPaidTabClicked() {
    this.selectedMode = LienPortalTabName.ASSIGN_PAID;
    this.dateType = [
      {val:'birthDate',text:'Date Of Birth'},
      {val:'dateRead',text:'Date Of Read'},
      {val:'assignedDate',text:'AR Assigned Date'},
      {val:'executeDate',text:'Execution Date'},
      {val:'paidDate',text:'Paid Date'}
    ]
    this.clearFilter();
  }

  onRetainedUnpaidTabClicked() {
    this.selectedMode = LienPortalTabName.RETAIN_UNPAID;
    this.dateType = [
      {val:'birthDate',text:'Date Of Birth'},
      {val:'dateRead',text:'Date Of Read'},
      {val:'retainDate',text:'AR Retained'}
    ]
    this.clearFilter();
  }

  onRetainedPaidTabClicked() {
    this.selectedMode = LienPortalTabName.RETAIN_PAID;
    this.dateType = [
      {val:'birthDate',text:'Date Of Birth'},
      {val:'dateRead',text:'Date Of Read'},
      {val:'retainDate',text:'AR Retained'},
      {val:'paidDate',text:'Paid Date'}
    ]
    this.clearFilter();
  }

  onFilter() {
    this.filter = {
      "patientId": this.filterForm.controls.patientId.value,
      "dateFrom": this.lienPortalService.convertDateFormat(this.filterForm.controls.dateFrom.value),
      "dateTo": this.lienPortalService.convertDateFormat(this.filterForm.controls.dateTo.value),
      "dateType": this.filterForm.controls.dateType.value,
    };

    switch (this.selectedMode) {
      case LienPortalTabName.PENDING:
        this.filter.referrers = this.filterForm.controls.readingRad.value;
        this.filter.cptGroup = this.filterForm.controls.cptGroup.value;
        break;
      case LienPortalTabName.ASSIGN_UNPAID:
        this.filter.fundingCompany = this.filterForm.controls.fundingCompany.value;
        this.filter.isFundingCompanySigned = Boolean(this.filterForm.controls.fundingCoSigned.value);
        break;
      case LienPortalTabName.ASSIGN_PAID:
        this.filter.fundingCompany = this.filterForm.controls.fundingCompany.value;
        this.filter.checkNumber = this.filterForm.controls.check.value;
        break;
      case LienPortalTabName.RETAIN_UNPAID:
        break;
      case LienPortalTabName.RETAIN_PAID:
        this.filter.checkNumber = this.filterForm.controls.checkNumber.value;
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
      cptGroup: '',
      dateFrom: '',
      dateTo: '',
      dateType: '',
      fundingCompany: '',
      fundingCoSigned: false,
      check: '',
      checkNumber: '',
    });
    this.onFilter();
  }
}




