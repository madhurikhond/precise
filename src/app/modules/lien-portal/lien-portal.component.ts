import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { StorageService } from 'src/app/services/common/storage.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';


@Component({
  selector: 'app-rad-portal',
  templateUrl: './lien-portal.component.html',
  styleUrls: ['./lien-portal.component.css']
})
export class LienPortalComponent implements OnInit {

  constructor(private lienPortalService: LienPortalService,
    private storageService: StorageService,
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

    // Dropdown Binding
    this.bindCPTGroup_DDL();
    this.bindReferrerByUser();

    // Default Pending Click
    this.onPendingBillTabClicked();
  }

  list_CPTGroup: any = [];
  bindCPTGroup_DDL() {
    try {
      var data = {
        "loggedPartnerId": this.storageService.PartnerId,
        "jwtToken": this.storageService.PartnerJWTToken,
        "userId": this.storageService.user.UserId
      };

      this.lienPortalService.GetCPTGroupList(data).subscribe((result) => {
        if (result.status == 0) {
          if (result.result && result.result.length > 0) {
            this.list_CPTGroup = result.result
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

  list_ReferrerByUser: any = [];
  bindReferrerByUser() {
    try {
      var data = {
        "loggedPartnerId": this.storageService.PartnerId,
        "jwtToken": this.storageService.PartnerJWTToken,
        "userId": this.storageService.user.UserId
      };

      this.lienPortalService.GetReferrerByUser(data).subscribe((result) => {
        if (result.status == 0) {
          if (result.result && result.result.length > 0) {
            this.list_ReferrerByUser = result.result
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

  filter: any;
  selectedMode: string;
  onPendingBillTabClicked() {
    this.selectedMode = "pending";
    this.clearFilter();
  }

  onAssignUnpaidTabClicked() {
    this.selectedMode = "assign_unpaid";
    this.clearFilter();
  }

  onAssignPaidTabClicked() {
    this.selectedMode = "assign_paid";
    this.clearFilter();
  }

  onRetainedUnpaidTabClicked() {
    this.selectedMode = "retain_unpaid";
    this.clearFilter();
  }

  onRetainedPaidTabClicked() {
    this.selectedMode = "retain_paid";
    this.clearFilter();
  }


  filterForm: FormGroup;
  onFilter() {
    switch (this.selectedMode) {
      case "pending":
        this.filter = {
          "referrers": this.filterForm.get("readingRad").value,
          "cptGroup": this.filterForm.get("cptGroup").value,
          "patientId": this.filterForm.get("patientId").value,
          "dateFrom": this.convertDateFormat(this.filterForm.get("dateFrom").value) == '' ? '' : this.convertDateFormat(this.filterForm.get("dateFrom").value),
          "dateTo": this.convertDateFormat(this.filterForm.get("dateTo").value) == '' ? '' : this.convertDateFormat(this.filterForm.get("dateFrom").value),
          "dateType": this.filterForm.get("dateType").value,
          "loggedPartnerId": this.storageService.PartnerId,
          "jwtToken": this.storageService.PartnerJWTToken,
          "userId": this.storageService.user.UserId
        };
        break;
      case "assign_unpaid":
        this.filter = {
          "fundingCompany": this.filterForm.get("fundingCompany").value,
          "isFundingCompanySigned": false,
          "patientId": this.filterForm.get("patientId").value,
          "dateFrom": this.convertDateFormat(this.filterForm.get("dateFrom").value),
          "dateTo": this.convertDateFormat(this.filterForm.get("dateTo").value),
          "dateType": this.filterForm.get("dateType").value,
          "loggedPartnerId": this.storageService.PartnerId,
          "jwtToken": this.storageService.PartnerJWTToken,
          "userId": this.storageService.user.UserId
        };
        break;
      case "assign_paid":
        this.filter = {
          "fundingCompany": this.filterForm.get("fundingCompany").value,
          "checkNumber": this.filterForm.get("checkNumber").value,
          "loggedPartnerId": this.storageService.PartnerId,
          "jwtToken": this.storageService.PartnerJWTToken,
          "patientId": this.filterForm.get("patientId").value,
          "dateFrom": this.convertDateFormat(this.filterForm.get("dateFrom").value),
          "dateTo": this.convertDateFormat(this.filterForm.get("dateTo").value),
          "dateType": this.filterForm.get("dateType").value,
          "userId": this.storageService.user.UserId
        };
        break;
      case "retain_unpaid":
        this.filter = {
        };
        break;
      case "retain_paid":
        this.filter = {
        };
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
      dateFrom: this.convertDateFormat(new Date()),
      dateTo: this.convertDateFormat(new Date()),
      dateType: '',
      fundingCompany: '',
      fundingCoSigned: '',
      check: '',
      checkNumber: '',
    });
    this.onFilter();
  }

  convertDateFormat(date){
    if(date == null){
      return ''
    }
    else{
      return moment(date).format('MM/DD/YYYY');
    }
  }

}




