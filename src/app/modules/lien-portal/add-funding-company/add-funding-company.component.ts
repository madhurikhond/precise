import { Component, Input, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LienPortalAPIEndpoint, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { CommonRegex } from 'src/app/constants/commonregex';
import { AccountService } from 'src/app/services/account.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';

@Component({
  selector: 'app-add-funding-company',
  templateUrl: './add-funding-company.component.html',
  styleUrls: ['./add-funding-company.component.css']
})
export class AddFundingCompanyComponent implements OnInit {
  fundingCompanyId: number = 0;
  @Input()
  set id(val: any) {
    if (val != undefined && val != null) {
      this.fundingCompanyId = val;
      this.onLoad();
    }
  }

  @Output() returnSuccess = new EventEmitter<Boolean>();

  @ViewChild("modal_close") modal_close: ElementRef
  assignment = [];
  state = [];
  fundingCompanyForm: FormGroup;
  readonly commonRegex = CommonRegex;
  constructor(private fb: FormBuilder,
    private lienPortalService: LienPortalService,
    private readonly accountService: AccountService) {

    this.fundingCompanyForm = this.fb.group({
      fundingCompanyId: [0],
      fundingCompanyName: ['', Validators.required],
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      contactPhone: ['', [Validators.required, Validators.pattern(this.commonRegex.PhoneRegex)]],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: [null, Validators.required],
      zip: [null, [Validators.required, Validators.minLength(5)]],
      taxId: ['', Validators.required],
      isActive: [false, Validators.required],
      defaultCompany: [false, Validators.required],
      fax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      notifyAssignment: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.bindAssignment_DDL();
    this.bindState_DDL();
  }

  onLoad(): void {
    this.fundingCompanyForm.markAsUntouched();
    this.fundingCompanyForm.patchValue({ fundingCompanyId: this.fundingCompanyId });
    if (this.fundingCompanyId > 0) {
      this.bindFundingCompanyForm();
    } else {
      this.clearFundingCompanyForm();
    }
  }

  onCompanyInfoTabClicked() { }

  onPricingTabClicked() { }

  bindAssignment_DDL() {
    this.assignment = [
      { value: 'email', text: 'Email' }
    ];
  }

  bindState_DDL() {
    this.accountService.getServiceStateList().subscribe((result) => {
      if (result.response)
        this.state = result.response;
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
}

  clearFundingCompanyForm() {
    this.fundingCompanyForm.patchValue({
      fundingCompanyName: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      address1: '',
      address2: '',
      city: '',
      state: null,
      zip: null,
      taxId: '',
      isActive: false,
      defaultCompany: false,
      fax: '',
      notifyAssignment: []
    });
  }

  bindFundingCompanyForm() {
      var data = {
        "fundingCompanyId": this.fundingCompanyId,
      };

      this.lienPortalService.PostAPI(data,LienPortalAPIEndpoint.GetRadiologistFundingCompanyInfo).subscribe((result) => {
        if (result.status == LienPortalResponseStatus.Success) {
          if (result.result) {
            let data = result.result;

            this.fundingCompanyForm.patchValue({
              fundingCompanyId: data.fundingCompanyId,
              fundingCompanyName: data.fundingCompanyName,
              contactName: data.contactName,
              contactEmail: data.contactEmail,
              contactPhone: data.phoneNumber,
              address1: data.address1,
              address2: data.address2,
              city: data.city,
              state: data.state,
              zip: data.zip,
              taxId: data.taxId,
              isActive: data.isActiveBroker,
              defaultCompany: data.defaultCompany,
              fax: data.mainFax,
              notifyAssignment: data.notify
            });

            let defaultCompany = this.fundingCompanyForm.get("defaultCompany").value;
            if (defaultCompany) {
              this.assignment = [
                { value: 'Email', text: 'Email' },
                { value: 'RadFlow API', text: 'RadFlow API' }
              ];
            } else {
              this.assignment = [
                { value: 'email', text: 'Email' },
              ];
            }
          }
        }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    });
}

  bindDefaultFundingCompany() {
    let data = {};
      this.lienPortalService.PostAPI(data,LienPortalAPIEndpoint.GetPreciseMriFundingCompanyInfo).subscribe((result) => {
        if (result.status == LienPortalResponseStatus.Success) {
          if (result.result) {
            let data = result.result;
            this.fundingCompanyForm.patchValue({
              fundingCompanyId: data.fundingCompanyId,
              fundingCompanyName: data.fundingCompanyName,
              contactName: data.contactName,
              contactEmail: data.contactEmail,
              contactPhone: data.phoneNumber,
              address1: data.address1,
              address2: data.address2,
              city: data.city,
              state: data.state,
              zip: data.zip,
              taxId: data.taxId,
              isActive: data.isActiveBroker,
              fax: data.mainFax,
              notifyAssignment: data.notify
            });
          }
        }
        else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      }, () => {
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);

      })
  }

  onSubmit() {

    this.fundingCompanyForm.markAllAsTouched();
    if (this.fundingCompanyForm.valid) {
        this.lienPortalService.PostAPI(this.fundingCompanyForm.value,LienPortalAPIEndpoint.UpsertFundingCompanyInfo).subscribe((res) => {
          if (res.status == LienPortalResponseStatus.Success) {
            let message = LienPortalStatusMessage.FUNDING_COMPANY_ADDED;
            if (this.fundingCompanyId > 0) {
              message = LienPortalStatusMessage.FUNDING_COMPANY_UPDATED;
            }
            this.lienPortalService.successNotification(message);
            this.modal_close.nativeElement.click();
            this.returnSuccess.emit(true);
          }
          else
            this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
        }, () => {
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
        })
      }

  }

  onDefaultComapny() {
    let defaultCompany = this.fundingCompanyForm.get("defaultCompany").value;
    if (defaultCompany) {
      this.assignment = [
        { value: 'Email', text: 'Email' },
        { value: 'RadFlow API', text: 'RadFlow API' }
      ];
      this.bindDefaultFundingCompany();
    } else {
      this.assignment = [
        { value: 'email', text: 'Email' },
      ];
      if (this.fundingCompanyId > 0) {
        this.bindFundingCompanyForm();
      } else {
        this.clearFundingCompanyForm();
      }
    }
  }
}
