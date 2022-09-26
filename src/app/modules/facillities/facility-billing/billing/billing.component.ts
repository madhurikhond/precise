import { Component, OnInit,ViewChild } from '@angular/core';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { Subscription } from 'rxjs';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
   @ViewChild('adjust_lease_time') modal_adjust_lease_time:any;
   @ViewChild('Bill_Selected_Studies') modal_Bill_Selected_Studies:any;
   @ViewChild('rebill_popup') modal_rebill_popup:any;
   @ViewChild('removeBilling_popup') modal_removeBilling_popup:any;

   
    modelValue:string='modal';
    pageNumber: number = 1;
    pageSize: number = 100;
    selectedValue:Number;
    //// Grid setting fields
    GridData: [] = [];
    resizingModes: string[] = ['widget', 'nextColumn'];
    columnResizingMode: string;
    applyFilterTypes: any;
    currentFilter: any;
    showFilterRow: boolean;
    showHeaderFilter: boolean;
    allMode: string;
    checkBoxesMode: string;
    user__Id:string;
    RebillNoteForm:FormGroup;
    RemoveNoteForm:FormGroup;
    submitted = false;
    submittedRemove = false;
    //
    patientID: any = '';
    lastName: any = '';
    firstName: any = '';
    dob: any = '';    
    modality: any = '';
    facility: any = '';
    totalFacility: number;    
    now:Date;
    tabId:string='All';
    optionTab:Number=1;
    checkedData: any='';
    selectedgroup: any;
    WarningPopup: Array<{PATIENTID: string, LastName: string,FirstName: string,Error: string,checked:boolean,INTERNALSTUDYID:string,FacilityParentID:string,FacilityID:string}> = []; 
    PatientDocFacilityBilling:Subscription;
    changeActionReview:boolean;
    changeActionReBill:boolean;
    SearchOrWithout:boolean=true;

  constructor(private fb:FormBuilder,private readonly facilityService: FacilityService,private readonly storageService: StorageService,private readonly notificationService: NotificationService) { }

  ngOnInit(): void {      
    this.changeActionReview=false;
    this.changeActionReBill=false;  
    this.setGridSetting();
    this.now = new Date();    
    this.user__Id =  this.storageService.user.UserId;
    this.RebillNoteForm = this.fb.group({
      rebillNote:['',Validators.required]
    });
    this.RemoveNoteForm = this.fb.group({
      removeNote:['',Validators.required]
    });
    this.facilityService.filterFacilityBilling.subscribe((res: any) => {        
      this.patientID = res.patientID;
      this.lastName = res.lastName;
      this.firstName = res.firstName;
      this.dob = res.dob;
      this.modality = res.Modiality;
      this.facility = res.Facility;
      this.SearchOrWithout = false;     
      this.getDataList(this.getApplyFilter(res.patientId, res.lastName, res.firstName, res.dob, res.Modiality, res.Facility,this.user__Id))
    });
    if(this.SearchOrWithout===true){
      this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName,this.dob, this.modality, this.facility,this.user__Id));  
    }
  }
//---------------Grid----------------

setGridSetting() {
  this.allMode = 'page';
  this.checkBoxesMode = 'always'
  this.showFilterRow = true;
  this.showHeaderFilter = false;
  this.applyFilterTypes = [{
    key: 'auto',
    name: 'Immediately'
  }, {
    key: 'onClick',
    name: 'On Button Click'
  }];
  this.columnResizingMode = this.resizingModes[0];
  this.currentFilter = this.applyFilterTypes[0].key;
}

//-----------End---------------------------------------------
getApplyFilter(patientID: any, lastName: any, firstName: any, dob: any,
  modality: any, facility: any,userid:any): any {
  return {
    'patientID': patientID, 'lastName': lastName, 'firstName': firstName,
    'dob': dob, 'modality': modality, 'facility': facility,'userid':userid
  }
}

getDataList(filterBody: any) { 
    if(this.optionTab === 5){         
      this.GetNotBilledYetFacilityBilling(filterBody);        
      this.changeActionReview = true;
      this.changeActionReBill = false;
    }
    else if(this.optionTab === 4){
      this.GetNeedReview(filterBody);   
      this.changeActionReview = false;
      this.changeActionReBill = true;
    }
    else if(this.optionTab === 3){
      this.PendingPayment(filterBody);   
      this.changeActionReview = false;
      this.changeActionReBill = false;
    }
    // else{   
    //   this.GetBillingListForFacility(filterBody);
    //   this.changeActionReview = false;
    //   this.changeActionReBill = false;  
    //   }
}

GetBillingListForFacility(filterBody: any){
  this.facilityService.GetBillingListForFacility(true, filterBody, this.pageNumber, this.pageSize).subscribe((res) => {
    this.GridData = [];  
    if (res.response != null && res.response.length > 0) {        
      this.totalFacility = res.totalRecords;
      this.GridData = res.response;    
    } 
  }, (err: any) => {
    this.errorNotification(err);
  });
}

GetNeedReview(filterBody: any){
  this.facilityService.NeedReviewForFacilityBilling(true, filterBody, this.pageNumber, this.pageSize).subscribe((res) => {
    this.GridData = [];  
    if (res.response != null && res.response.length > 0) {        
      this.totalFacility = res.totalRecords;
      this.GridData = res.response;    
    }
  }, (err: any) => {
    this.errorNotification(err);
  });    
}


DisplayDataOnTabs(option : any,tabName:string){   
  this.tabId = tabName;  
  this.optionTab = option;
  this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName,this.dob, this.modality, this.facility,this.user__Id));     
}

  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }

  GetNotBilledYetFacilityBilling(filterBody: any){
    this.facilityService.getNotBilledYetFacilityBilling(true, filterBody, this.pageNumber, this.pageSize).subscribe((res) => {
      this.GridData = [];  
      console.log(res.response);
      if (res.response != null && res.response.length > 0) {        
        this.totalFacility = res.totalRecords;
        this.GridData = res.response;    
      }
    }, (err: any) => {
      this.errorNotification(err);
    });    
  }
  PendingPayment(filterBody: any){
    this.facilityService.getPendingPaymentFacilityBilling(true, filterBody, this.pageNumber, this.pageSize).subscribe((res) => {
      this.GridData = [];  
      if (res.response != null && res.response.length > 0) {        
        this.totalFacility = res.totalRecords;
        this.GridData = res.response;    
      }
    }, (err: any) => {
      this.errorNotification(err);
    });    
  }



  FacilityBillingPageChanged(event:any){
    this.pageNumber = event;
    this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName, this.dob, this.modality, this.facility,this.user__Id));
  }
  selectChange(){  
    this.submitted = false;   
    this.submittedRemove = false;
    this.addForm.rebillNote.setValue('');
    this.removeForm.removeNote.setValue('');
    if(this.checkedData.length >0){     

      if(this.selectedgroup === 1)//Bill Selected Studies
      {    
        this.GetWarningForStudies();
      }
      else if(this.selectedgroup === 2) //Adjust study lease time
      {
          if(this.checkedData.length === 1){
              this.adjustLeaseTime();
          }else{
            this.notificationService.showNotification({ 
              alertHeader : null,
              alertMessage: 'You may only select 1 study at a time to adjust lease time.',
              alertType: ResponseStatusCode.BadRequest
            });
          }
       
      }
      else if(this.selectedgroup === 3) //Rebill
      {
        this.modal_rebill_popup.nativeElement.click();
      }
      else if(this.selectedgroup === 4) //Removing the study
      {
        this.modal_removeBilling_popup.nativeElement.click();
      }      
    }
    else{           
      this.notificationService.showNotification({ 
        alertHeader : null,
        alertMessage: 'Please select at least one study from the below table.',
        alertType: ResponseStatusCode.BadRequest
      });
    } 
  }
  GetWarningForStudies(){
    let selectedPATIENTIDStudyid =[];  
    let CheckFacilityParentId = true;
    let FirstFacilityParentId=this.checkedData[0].FACILITYPARENTID
    for (let i = 0; i < this.checkedData.length; i++) {
      if(FirstFacilityParentId === this.checkedData[i].FACILITYPARENTID){
          selectedPATIENTIDStudyid.push({
            InternalStudyID: Number(this.checkedData[i].INTERNALSTUDYID),
            PatientId : this.checkedData[i].PATIENTID,
            FacilityParentID: this.checkedData[i].FACILITYPARENTID,
            FacilityID: this.checkedData[i].FACILITYID,
            UserId: this.storageService.user.UserId,
            RadFlowOrFacility:'3P Biller',
            Rebill_Note:'',
            Remove_Note:'',
            Study_Status:'PendingQB_INV',Action:'Bill Selected Studies',TabSelection:'Not Billed Yet - Facility'
          });
        }
        else{
          this.notificationService.showNotification({ 
            alertHeader : null,
            alertMessage: 'Please only select studies from 1 parent facility',
            alertType: ResponseStatusCode.BadRequest
          });
          CheckFacilityParentId=false;         
          break;
        }
    }
    if(CheckFacilityParentId===true){
        this.facilityService.GetWarningForStudies(true,selectedPATIENTIDStudyid).subscribe((res)=>{
          if(res.response.length>0){
                  this.InsertandGetwarningBill(res.response);
                } 
          }); 
     }
     this.checkedData=[];
}

  InsertandGetwarningBill(StudypatientDetail:any){  
   let LastName = '';let FirstName = '';let Error = '';
   this.WarningPopup = [];
      for (let i = 0; i < StudypatientDetail.length; i++) {        
        if(StudypatientDetail[i].INTERNALSTUDYID != ''){
          LastName =  this.GridData.filter((x:any) => x.INTERNALSTUDYID === StudypatientDetail[i].InternalStudyID)[0]['FAMILYNAME'];   
          FirstName = this.GridData.filter((x:any) => x.INTERNALSTUDYID === StudypatientDetail[i].InternalStudyID)[0]['GIVENNAME']; 
      }
      if(StudypatientDetail[i].NUMIMAGES === 0 || !StudypatientDetail[i]){
          Error  = 'No Images Found, ';
      }
      if(!StudypatientDetail[i].Tech_Lien){
        Error  += 'Missing Imaging Tech Lien, ';
      }
      if(!StudypatientDetail[i].Radiologist_Lien){
        Error  += 'Missing Imaging Rad Signed Lien, ';
      }
      if(!StudypatientDetail[i].Patient_Demo){
        Error  += 'Missing Demo, ';
      }
      if(!StudypatientDetail[i].STATUSORDER){
        Error  += 'Status is not completed, ';
      }
      Error = Error.replace(/,\s*$/, '');
      this.WarningPopup.push({PATIENTID: StudypatientDetail[i].PatientId, LastName:LastName, FirstName:FirstName,Error:Error,checked:false,INTERNALSTUDYID:StudypatientDetail[i].InternalStudyID,FacilityParentID:StudypatientDetail[i].FacilityParentID,FacilityID:StudypatientDetail[i].FacilityID});            
    }
    if( this.WarningPopup.length>0){
      this.modal_Bill_Selected_Studies.nativeElement.click();
    }  
  }

  adjustLeaseTime(){    
      this.modal_adjust_lease_time.nativeElement.click();
  }
  selectionChanged(data: any) {     
    this.checkedData = data.selectedRowsData;
  }
  onChangeDdlAction(selectedValue:any){
    this.selectedgroup = selectedValue
  }
  getCheckedBillStudies(checkedStudies:any){
      checkedStudies.checked = !checkedStudies.checked;
  }
  RebillSelectedStudies(){   
   this.submitted = true;
   this.modelValue='modal';
   if (this.RebillNoteForm.invalid) {
     this.modelValue='';
     return;
   }
   else{    
        let selectedPATIENTIDStudyid =[];  
        for (let i = 0; i < this.checkedData.length; i++) {
          selectedPATIENTIDStudyid.push({
            InternalStudyID: Number(this.checkedData[i].INTERNALSTUDYID),
            PatientId : this.checkedData[i].PATIENTID,
            FacilityParentID: this.checkedData[i].FACILITYPARENTID,
            FacilityID: this.checkedData[i].FACILITYID,
            UserId: this.storageService.user.UserId,
            RadFlowOrFacility:'3P Biller',
            Rebill_Note:this.addForm.rebillNote.value,
            Remove_Note:'',
            Study_Status:'Review',Action:'Rebill',TabSelection:'Need Review - Facility'
          });
        }
        
        this.facilityService.RebillForFacilityBilling(true,selectedPATIENTIDStudyid).subscribe((res)=>{
          if(res.response.length===1 && res.responseCode===200)
            {        
              this.GetNeedReview(this.getApplyFilter(this.patientID, this.lastName, this.firstName,this.dob, this.modality, this.facility,this.user__Id));   
            }else{
              this.notificationService.showNotification({ 
                alertHeader : null,
                alertMessage: 'Error',
                alertType: ResponseStatusCode.BadRequest
              });
            }
          });  
          this.checkedData=[];
    }   
  }
  RemoveSelectedStudies(){   
    this.submittedRemove = true;
    this.modelValue='modal';
    if (this.RemoveNoteForm.invalid) {
      this.modelValue='';
      return;
    }
    else{    
         let selectedPATIENTIDStudyid =[];  
         for (let i = 0; i < this.checkedData.length; i++) {
           selectedPATIENTIDStudyid.push({
             InternalStudyID: Number(this.checkedData[i].INTERNALSTUDYID),
             PatientId : this.checkedData[i].PATIENTID,
             FacilityParentID: this.checkedData[i].FACILITYPARENTID,
             FacilityID: this.checkedData[i].FACILITYID,
             UserId: this.storageService.user.UserId,
             RadFlowOrFacility:'3P Biller',
             Rebill_Note:'',
             Remove_Note:this.removeForm.removeNote.value,
             Study_Status:'Remove',Action:'Remove',TabSelection:'Need Review - Facility'
           });
         }         
         this.facilityService.RemoveSelectedStudies(true,selectedPATIENTIDStudyid).subscribe((res)=>{
          if(res.response.length===1 && res.responseCode===200)
            {        
              this.GetNeedReview(this.getApplyFilter(this.patientID, this.lastName, this.firstName,this.dob, this.modality, this.facility,this.user__Id));   
            }else{
              this.notificationService.showNotification({ 
                alertHeader : null,
                alertMessage: 'Error',
                alertType: ResponseStatusCode.BadRequest
              });
            }
          });  
          this.checkedData=[];
     }   
   }

  OverrideSelectedStudies(){
    let FacilityNeedReviewStudies: Array<{PatientID: string,InternalStudyID:string,FacilityParentID:string,FacilityID:string,UserId:string,RadFlowOrFacility:string,Rebill_Note:string,Remove_Note:string,Study_Status:string,Action:string,TabSelection:string}> = []; 
    for (let i = 0; i < this.WarningPopup.length; i++) { 
        if(this.WarningPopup[i].checked===true){
          FacilityNeedReviewStudies.push({PatientID: this.WarningPopup[i].PATIENTID, InternalStudyID:this.WarningPopup[i].INTERNALSTUDYID,FacilityParentID:this.WarningPopup[i].FacilityParentID,FacilityID:this.WarningPopup[i].FacilityID,UserId:this.storageService.user.UserId,RadFlowOrFacility:'3P Biller', Rebill_Note:'',Remove_Note:'',Study_Status:'Review',Action:'OverrideStudy',TabSelection:'Not Billed Yet - Facility'});  
        }
     }
 
     if(FacilityNeedReviewStudies.length>0){
          this.facilityService.FacilityBillingOverrideBill(true,FacilityNeedReviewStudies).subscribe((res)=>{
            if (res) {
                this.notificationService.showNotification({ 
                alertHeader : (res.responseCode === ResponseStatusCode.OK) ? 'Success' : 'Error',
                alertMessage: res.message,
                alertType: (res.responseCode === ResponseStatusCode.OK) ? ResponseStatusCode.OK : ResponseStatusCode.InternalError                
              });
              this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName, this.dob, this.modality, this.facility,this.user__Id));
            }
          })
     }else{
        alert('please select incomplete studies for need review');      
     }
  }
  getFacilityDetail(PatientId:any,DocType:any,row:any) {         
    if(DocType){
      let Doc_Id = (DocType != null)?(DocType.split(',')[1]) : null;
          if(Doc_Id){
            this.FilePreview(PatientId,Doc_Id,row);
          }
      }
  }

  FilePreview(PatientId:string,DocID:string,row:any){  
    let Ret_Data = this.Get_MainDoc_IdUploadPreview(row,DocID);      
    const M_DocID = Ret_Data[0];
     //UserId = Ret_Data[1];   
    if(M_DocID && PatientId){
            this.PatientDocFacilityBilling =  this.facilityService.getPatientDocFacilityBilling(true,PatientId,M_DocID).subscribe((res)=>{
              if(res.response!=null)
              {
                let ArrayBuff = this._base64ToArrayBuffer(res.response); 
                let file = new Blob([ArrayBuff], { type: 'application/pdf' }); 
                window.open(URL.createObjectURL(file), '_blank');      
              }
          });  
      }
  }

    Get_MainDoc_IdUploadPreview(row: any,FromDocId:string){  
      var Tech_Lien = (row.data.Tech_Lien != null)?(row.data.Tech_Lien.split(',')[1]) : null;
      var Radiologist_Lien = (row.data.Radiologist_Lien != null)?(row.data.Radiologist_Lien.split(',')[1]) : null;
      var Patient_Demo =  (row.data.Patient_Demo != null)?(row.data.Patient_Demo.split(',')[1]) : null;
      var Patient_Identification = (row.data.Patient_Identification!= null)?(row.data.Patient_Identification.split(',')[1]) : null;    
      let Main_DocId =''; let User_Id='';    
      if(FromDocId===Tech_Lien){ Main_DocId=row.data.Tech_Lien.split(',')[2];User_Id=row.data.Tech_Lien.split(',')[3];}
      if(FromDocId===Radiologist_Lien){ Main_DocId=row.data.Radiologist_Lien.split(',')[2];User_Id=row.data.Radiologist_Lien.split(',')[3];}
      if(FromDocId===Patient_Demo) { Main_DocId=row.data.Patient_Demo.split(',')[2];User_Id=row.data.Patient_Demo.split(',')[3];}
      if(FromDocId===Patient_Identification) { Main_DocId=row.data.Patient_Identification.split(',')[2];User_Id=row.data.Patient_Identification.split(',')[3];}   
      return [Main_DocId, User_Id];
  }

  _base64ToArrayBuffer(base64:any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  get addForm() { return this.RebillNoteForm.controls; }
  get removeForm() { return this.RemoveNoteForm.controls; }
  
}
