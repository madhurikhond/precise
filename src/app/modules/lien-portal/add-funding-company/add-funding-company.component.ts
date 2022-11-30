import { Component, Input, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LienPortalAPIEndpoint, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
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

  constructor(private fb: FormBuilder,
    private lienPortalService: LienPortalService,
    private readonly accountService: AccountService ,
    private storageService: StorageService) {

    this.fundingCompanyForm = this.fb.group({
      fundingCompanyId: [0],
      fundingCompanyName: ['', Validators.required],
      contactName: ['', Validators.required],
      contactEmail: ['', Validators.required],
      contactPhone: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: [undefined, Validators.required],
      zip: [0, Validators.required],
      taxId: ['', Validators.required],
      isActive: [false, Validators.required],
      defaultCompany: [false, Validators.required],
      fax: [''],
      notifyAssignment: [[], Validators.required],
      loggedPartnerId: [this.storageService.PartnerId],
      jwtToken: [this.storageService.PartnerJWTToken],
      userId: [this.storageService.user.UserId]
    });
  }

  ngOnInit(): void {
    this.bindAssignment_DDL();
    //this.bindState_DDL();
  }

  onLoad(): void {
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
      { id: 1, name: 'Email' },
      { id: 2, name: 'Radflow API' },
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
    state: '',
    zip: 0,
    taxId: '',
    isActive: false,
    defaultCompany: false,
    fax: '',
    notifyAssignment: []
  });
}

bindFundingCompanyForm(){

    var data = {
      "fundingCompanyId": this.fundingCompanyId
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
            fax: data.mainTax,
            notifyAssignment: data.notify
          });
        }
      }
      else 
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    });
}

onSubmit() {
 
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

}
