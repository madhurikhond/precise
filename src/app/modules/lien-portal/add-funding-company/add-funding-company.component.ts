import { Component, Input, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private readonly accountService: AccountService,
    private storageService: StorageService) {

    this.fundingCompanyForm = this.fb.group({
      fundingCompanyId: [0],
      fundingCompanyName: ['', Validators.required],
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required,
      Validators.email,
      Validators.pattern(this.commonRegex.EmailRegex)]],
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
      notifyAssignment: [[], Validators.required],
      loggedPartnerId: [this.storageService.PartnerId],
      jwtToken: [this.storageService.PartnerJWTToken],
      userId: [this.storageService.user.UserId]
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
    try {
      this.accountService.getServiceStateList().subscribe((result) => {
        if (result.response != null && result.response.length > 0) {
          this.state = result.response;
        }
        if (result.message) {
          this.lienPortalService.errorNotification(result.message);
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
    try {
      var data = {
        "fundingCompanyId": this.fundingCompanyId,
        "loggedPartnerId": this.storageService.PartnerId,
        "jwtToken": this.storageService.PartnerJWTToken,
        "userId": this.storageService.user.UserId
      };

      this.lienPortalService.GetRadiologistFundingCompanyInfo(data).subscribe((result) => {
        if (result.status == 1) {
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
        if (result.exception && result.exception.message) {
          this.lienPortalService.errorNotification(result.exception.message);
        }
      }, (error) => {
        if (error.message) {
          this.lienPortalService.errorNotification(error.message);
        }
      });
    } catch (error) {
      if (error.message) {
        this.lienPortalService.errorNotification(error.message);
      }
    }
  }

  bindDefaultFundingCompany() {
    try {
      var data = {
        "loggedPartnerId": this.storageService.PartnerId,
        "jwtToken": this.storageService.PartnerJWTToken,
        "userId": this.storageService.user.UserId
      };

      this.lienPortalService.GetPreciseMriFundingCompanyInfo(data).subscribe((result) => {
        if (result.status == 1) {
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

  onSubmit() {
    try {
    this.fundingCompanyForm.markAllAsTouched();
    if (this.fundingCompanyForm.valid) {
        this.lienPortalService.UpsertFundingCompanyInfo(this.fundingCompanyForm.value).subscribe((res) => {
          if (res.status == 1) {
            let message = "Funding Company Added Successfully";
            if (this.fundingCompanyId > 0) {
              message = "Funding Company Updated Successfully";
            }
            this.lienPortalService.successNotification(message);
            this.modal_close.nativeElement.click();
            this.returnSuccess.emit(true);
          }
          if (res.exception && res.exception.message) {
            this.lienPortalService.errorNotification(res.exception.message);
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
