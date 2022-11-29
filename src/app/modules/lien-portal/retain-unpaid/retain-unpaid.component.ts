import { Component, ElementRef, Input, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad';
import { DxDataGridComponent } from 'devextreme-angular';
import { LienPortalPageTitleOption } from 'src/app/models/lien-portal-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
@Component({
  selector: 'app-retain-unpaid',
  templateUrl: './retain-unpaid.component.html',
  styleUrls: ['./retain-unpaid.component.css']
})
export class RetainUnpaidComponent implements OnInit {

  getfilterData: any;
  @Input()
  set filterData(val: any) {
    if (val && val != "") {
      this.getfilterData = val;
      this.getRetainUnPaidList();
    }
  }

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 750,
    canvasHeight: 100,
    Placeholder: 'test'
  };


  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  assignARform: FormGroup;
  checkBoxesMode: string;
  allMode: string;
  pageNumber: number = 1;
  totalRecord: number = 1;
  pageSize: number;
  columnResizingMode: string;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  applyFilterTypes: any;
  resizingModes: string[] = ['widget', 'nextColumn'];
  currentFilter: any;
  dataSource : any = [];
  retainARUnpaid :any = [];
  checkboxSelectedData:any = [];
  fundingCompanies = [];
  selecteFundComp: number = 0;
  firstName: string;
  lastName: string;
  radiologistSign: string;

  constructor(private lienPortalService: LienPortalService, private commonService: CommonMethodService,private storageService:StorageService,
    private fb: FormBuilder) {
    this.allMode = 'page';
    this.checkBoxesMode = 'always';
    this.showFilterRow = true;
    this.showHeaderFilter = false;
    this.applyFilterTypes = [
      {
        key: 'auto',
        name: 'Immediately',
      },
      {
        key: 'onClick',
        name: 'On Button Click',
      },
    ];
    this.columnResizingMode = this.resizingModes[0];
    this.currentFilter = this.applyFilterTypes[0].key;
    this.assignARform = this.fb.group({
      fundingCompany:['',Validators.required],
      firstName:[this.storageService.user.FirstName,Validators.required],
      lastName:[this.storageService.user.LastName,Validators.required],
      radiologistSign:['',Validators.required]
    })
  }

  ngOnInit(): void {
    this.commonService.setTitle(LienPortalPageTitleOption.RETAINED_AND_UNPAID);
    this.bindFundComp_DDL();
  }


  getRetainUnPaidList(){
    try {
      this.dataSource = [];
      this.lienPortalService.GetRetainUnpaid(this.getfilterData).subscribe((res)=>{
        if(res.status == 1){
          if (res.result) {
            this.dataSource = res.result.retainedArUnPaidBatches;
          }
          this.retainARUnpaid = this.dataSource;
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

  changeCheckbox(item: any) {

    this.dataGrid.instance.expandRow((item.currentSelectedRowKeys[0]));
      setTimeout(() => {
        if(item) {
          this.checkboxSelectedData = item.selectedRowsData;
        }

        //selection

        if(item.currentSelectedRowKeys.length > 0){
          var selectedbatchName = item.currentSelectedRowKeys[0].batchName;
          var chkBatch = document.getElementsByName(selectedbatchName);
          chkBatch.forEach(item => {
            var element = <HTMLInputElement> item;
            element.checked = true;
          });
        }

        //Deselection

        if(item.currentDeselectedRowKeys.length > 0){
          var deSelectedbatchname = item.currentDeselectedRowKeys[0].batchName;
          var chkBatch = document.getElementsByName(deSelectedbatchname);
          this.dataGrid.instance.collapseRow((item.currentDeselectedRowKeys[0]));
          chkBatch.forEach(function(item) {
            var element = <HTMLInputElement> item;
            element.checked = false;
          });
        }
      }, 150);

  }

  drawComplete() {
    this.assignARform.patchValue({
      'radiologistSign': this.signaturePad.toDataURL()
    })
  }


  clearSign(): void {
    this.signaturePad.clear();
    this.assignARform.patchValue({
      'radiologistSign': ''
    })
  }

  bindFundComp_DDL() {
    try {
      var data = {
        "loggedPartnerId": this.storageService.PartnerId,
        "jwtToken": this.storageService.PartnerJWTToken,
        "userId": this.storageService.user.UserId
      };

      this.lienPortalService.GetFundingCompanyByUser(data).subscribe((result) => {
        if (result.status == 1) {
          if (result.result && result.result.length > 0) {
            this.fundingCompanies = result.result
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

  onAssignAR() {
    try {
      var request = [];
      if(this.assignARform.valid){
      this.checkboxSelectedData.map(data =>{
       data.retainedArUnPaidList.forEach(element => {
        var requestData = {
          'lienFundingId': element.lienFundingId,
          'cptGroup': element.cptGroup,
        }
        request.push(requestData);
       });

      });
        var assignData = {
          request: request,
          lienFundingMappingId: this.checkboxSelectedData[0].lienFundingMappingId,
          radiologistSign: this.assignARform.get("radiologistSign").value,
          firstName: this.assignARform.get("firstName").value,
          lastName: this.assignARform.get("lastName").value,
          fundingCompanyId: Number(this.assignARform.get("fundingCompany").value),
          loggedPartnerId: this.storageService.PartnerId,
          jwtToken: this.storageService.PartnerJWTToken,
          userId: Number(this.storageService.user.UserId)
        }
       this.lienPortalService.MoveRetainARToAssignAR(assignData).subscribe((res)=>{
        if(res.status == 1){
          this.closeAssignARModal();
          this.lienPortalService.successNotification('Studies assigned to Funding Co. Successfully');
          this.getRetainUnPaidList();
        }
       },(error)=>{
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

  closeAssignARModal(){
    document.getElementById('AssignARFundingModal').setAttribute('data-dismiss','modal');
    document.getElementById('AssignARFundingModal').click();
   }

   clearModalPopup(){
    this.assignARform.reset();
    this.signaturePad.clear();
    this.assignARform.patchValue({
      'fundingCompany': '',
      'firstName': this.storageService.user.FirstName,
      'lastName': this.storageService.user.LastName,
      'radiologistSign':''
    });
  }
}
