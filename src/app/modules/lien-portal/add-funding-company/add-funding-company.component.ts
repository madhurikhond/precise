import { Component, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LienPortalAPIEndpoint, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { CommonRegex } from 'src/app/constants/commonregex';
import { AccountService } from 'src/app/services/account.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';

@Component({
  selector: 'app-add-funding-company',
  templateUrl: './add-funding-company.component.html',
  styleUrls: ['./add-funding-company.component.css']
})
export class AddFundingCompanyComponent implements OnInit {
  fundingCompanyId: number = 0;
  @Output() returnSuccess = new EventEmitter<Boolean>();

  @ViewChild("modal_close") modal_close: ElementRef;
  defaultSelectedTab: string = 'company-info';
  assignment = [];
  state = [];
  cptGroupList:any;
  fundingCompanyForm: FormGroup;
  fundingCompanyPriceForm: FormGroup;
  private editData: any = [];
  private readonly commonRegex = CommonRegex;
  isNotify_readonly: Boolean = false;
  popUpHeaderText : string;

  constructor(private fb: FormBuilder,
    private lienPortalService: LienPortalService,
    private readonly accountService: AccountService) {

    this.fundingCompanyForm = this.fb.group({
      fundingCompanyId: [0],
      fundingCompanyName: ['', Validators.required],
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      contactPhone: ['', [Validators.required,Validators.pattern(/^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}( ?x([0-9]{3}))?$/)]],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: [null, Validators.required],
      zip: [null, [Validators.required, Validators.minLength(5),Validators.pattern(/([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}/)]],
      taxId: ['', Validators.required],
      isActive: [false, Validators.required],
      defaultCompany: [false, Validators.required],
      fax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      notifyAssignment: [[], Validators.required]
    });
  }
434
  ngOnInit(): void {
    this.GetCPTGroupList();
    this.bindState_DDL();
  }

  onLoad(val): void {
    this.defaultSelectedTab = 'company-info';
    this.fundingCompanyPriceForm.reset();
    if (val != undefined && val != null) {
      this.fundingCompanyId = val;
      this.popUpHeaderText = this.fundingCompanyId == 0?'Add New Funding Company':'Edit Funding Company';
      this.fundingCompanyForm.markAsUntouched();
      this.fundingCompanyForm.patchValue({ fundingCompanyId: this.fundingCompanyId });
      if (this.fundingCompanyId > 0) {
        this.GetFundingCompanySellPrice(this.fundingCompanyId);
        this.bindFundingCompanyForm();
      } else {
        this.clearFundingCompanyForm();
      }
    }
  }

  defaultPreciseImagingFundingCo(){
    this.popUpHeaderText = 'Add Precise Imaging Funding Co.';
    this.defaultSelectedTab = 'company-info';
    this.fundingCompanyPriceForm.reset();
    this.fundingCompanyId = 0;
    this.bindDefaultFundingCompany();
  }


  onCompanyInfoTabClicked() { }

  onPricingTabClicked() { }

  private bindState_DDL() {
    this.accountService.getServiceStateList().subscribe((result) => {
      if (result.response)
        this.state = result.response;
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  private clearFundingCompanyForm() {
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
    this.setVarDefaultCompany(this.fundingCompanyForm.value)
  }

  private bindFundingCompanyForm() {
    var data = {
      "fundingCompanyId": this.fundingCompanyId,
    };

    this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.GetRadiologistFundingCompanyInfo).subscribe((result) => {
      if (result.status == LienPortalResponseStatus.Success) {
        if (result.result) {
          let data = result.result;
          this.editData = data;
          this.fillForm(data);
        }
      }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    });
  }

  private bindDefaultFundingCompany() {
    let data = {};
    this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.GetPreciseMriFundingCompanyInfo).subscribe((result) => {
      if (result.status == LienPortalResponseStatus.Success) {
        if (result.result) {
          var data = result.result;
          data.fundingCompanyId = this.fundingCompanyId;
          this.fillForm(data);
        }
      }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);

    })
  }

  private fillForm(data: any) {
    data = this.setVarDefaultCompany(data);
    data.phoneNumber = data.phoneNumber.replace('- x',' x');
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


  }

  mapGroupPrice(data){
    var obj = [];
    Object.keys(data).forEach(element => {
      obj.push({
        "groupId": Number(element),
        "sellPrice": parseFloat(this.fundingCompanyPriceForm.get(element.toString()).value)
      });
     });
     return obj;
  }

  onSubmit() {

    this.fundingCompanyForm.markAllAsTouched();
    if(this.fundingCompanyForm.valid && this.fundingCompanyPriceForm.valid)
    {
      let message = this.fundingCompanyId > 0 ? LienPortalStatusMessage.FUNDING_COMPANY_UPDATED : LienPortalStatusMessage.FUNDING_COMPANY_ADDED;
      this.saveFundingCompanyData(this.fundingCompanyForm.value,message);
    }
    else
    {
         this.lienPortalService.errorNotification(LienPortalStatusMessage.FILLOUT_REQUIRED_REQUIRED_FIELDS);
    }
  }

  saveFundingCompanyData(value:any,message){
    let contactSeprator = value.contactPhone.split(" x");
    if(contactSeprator[1])
    {
      if(contactSeprator[1].length == 0)
        value.contactPhone = value.contactPhone.replace(' x', '');
    }
    value.contactPhone = value.contactPhone.replace('(', '').replace(')', '').replace(' ', '-').replace('-x', ' x');
    this.lienPortalService.PostAPI(value, LienPortalAPIEndpoint.UpsertFundingCompanyInfo).subscribe((res) => {
      if (res.status == LienPortalResponseStatus.Success) {
        this.modal_close.nativeElement.click();
        let request = {
                   "fundingCompanyId": this.fundingCompanyId > 0 ? this.fundingCompanyId : res.result,
                   "groupPrice": this.mapGroupPrice(this.fundingCompanyPriceForm.value)
                 }
        this.lienPortalService.PostAPI(request, LienPortalAPIEndpoint.AddFundingCompanySellPrice).subscribe((res) => {
          this.lienPortalService.successNotification(message);
        })
        this.returnSuccess.emit(true);
      }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  onDefaultCompanyChanged() {
    let defaultCompany = this.fundingCompanyForm.get("defaultCompany").value;
    if (defaultCompany) {
      this.bindDefaultFundingCompany();
    } else {
      if (this.fundingCompanyId > 0) {
        let data = this.editData;
        data.defaultCompany = defaultCompany;
        data.notify = ['Email'];
        this.fillForm(data);
      } else {
        this.clearFundingCompanyForm();
      }
    }
  }

  private setVarDefaultCompany(data) {
    if (data.defaultCompany) {
      data.notify = ['Email','RadFlow API'];
      this.assignment = [
        { value: 'Email', text: 'Email' },
        { value: 'RadFlow API', text: 'RadFlow API' }
      ];
      this.isNotify_readonly = true;
    } else {
      data.notify = ['Email'];
      this.assignment = [
        { value: 'Email', text: 'Email' },
      ];
      this.isNotify_readonly = false;
    }
    return data;
  }

  GetFundingCompanySellPrice(fundingCompanyId){
    let data = {
      'fundingCompanyId' : fundingCompanyId
    }
    this.lienPortalService.PostAPI(data,LienPortalAPIEndpoint.GetFundingCompanySellPrice).subscribe((result)=>{
      if (result.status == LienPortalResponseStatus.Success) {
        if(result.result.fundingCompanySellPrices.length == 0){
          this.GetCPTGroupList();
        }else{
          this.cptGroupList = result.result.fundingCompanySellPrices;
          this.setGroupIdSellPrice();
        }
      }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  GetCPTGroupList(){
    let data ={};
    this.lienPortalService.PostAPI(data,LienPortalAPIEndpoint.GetCPTGroupList).subscribe((result)=>{
      if (result.status == LienPortalResponseStatus.Success) {
        console.log(result);
        this.cptGroupList = result.result;
        this.setGroupIdSellPrice();
        this.cptGroupList = this.cptGroupList.filter((value)=>{
          value.price = 0;
          return value;
        })
      }
    })
  }

  setGroupIdSellPrice() {

    let form = {};
    var formData = [];
    this.cptGroupList.forEach(element => {
      formData.push({
        "groupId": element.groupId,
        "price":(element.price)?element.price : ''
      });
    });

    for(let i=0;i<formData.length;i++)
    {
      form[formData[i].groupId] = new FormControl(formData[i].price,[Validators.required,Validators.pattern(/^(?=.*[1-9])(?:[1-9]\d*\.?|0?\.)\d*$/)]);
    }
    this.fundingCompanyPriceForm = new FormGroup(form);
  }

  getInputData(data, id) {
    if (data) {
      if (!((data.target.value).match('^[1-9][0-9]*$'))) {
        if (data.target.value.length == 1)
          this.fundingCompanyPriceForm.controls[id].setValue('');
      }
    }
  }

    onClickCompanyInfo(selectedTab){
      this.defaultSelectedTab = selectedTab;
    }

}
