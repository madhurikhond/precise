import { Component, OnInit,ViewChild } from '@angular/core';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { StorageService } from 'src/app/services/common/storage.service';
import { Subscription } from 'rxjs';
import { PageSizeArray } from 'src/app/constants/pageNumber';

@Component({
  selector: 'app-radflow-billing',
  templateUrl: './radflow-billing.component.html',
  styleUrls: ['./radflow-billing.component.css']
})
export class RadflowBillingComponent implements OnInit {  
  @ViewChild('Bill_Selected_Studies') modal_Bill_Selected_Studies:any;
  @ViewChild('add_to_quickbook') modal_add_to_quickbook:any;
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
   changeOkToPayDisputeBill:boolean;
   CreateQuickbooksInvoice:boolean;
   SearchOrWithout:boolean=true;
   readonly pageSizeArray=PageSizeArray;

   constructor(private readonly facilityService: FacilityService,private readonly storageService: StorageService,private readonly notificationService: NotificationService) { }

 ngOnInit(): void {      
   this.changeActionReview=false;
   this.changeOkToPayDisputeBill=false;  
   this.CreateQuickbooksInvoice=false;
   this.setGridSetting();
   this.now = new Date();    
   this.user__Id =  this.storageService.user.UserId;
   this.facilityService.filterRadFlowFacilityBilling.subscribe((res: any) => {  
     this.patientID = res.patientId;
     this.lastName = res.lastName;
     this.firstName = res.firstName;
     this.dob = res.dob;
     this.modality = res.Modiality;
     this.facility = res.Facility;
     this.SearchOrWithout = false;  
     this.getDataList(this.getApplyFilter(res.patientId, res.lastName, res.firstName, res.dob, res.Modiality, res.Facility,this.user__Id))
   });
   if(this.SearchOrWithout==true){
    this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName,this.dob, this.modality, this.facility,this.user__Id));  
  }
 }
//---------------Grid----------------

onPageSizeChange(event) {
  this.pageSize = event;
  this.pageNumber = 1;
  //this.GetBillingListForFacility()

} 

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
         if(this.optionTab == 6){         
         this.GetNotBilledYetRadFlow(this.getApplyFilter(this.patientID, this.lastName, this.firstName,this.dob, this.modality, this.facility,this.user__Id));        
         this.changeActionReview = true;
         this.changeOkToPayDisputeBill = false;
         this.CreateQuickbooksInvoice=false;
       }
      else if(this.optionTab == 5){
       this.CreateQuickbooksInvoice=false;
       this.changeActionReview = false;
       this.changeOkToPayDisputeBill = true;
       this.GetReviewForRadFlow(this.getApplyFilter(this.patientID, this.lastName, this.firstName,this.dob, this.modality, this.facility,this.user__Id));  
     }
     else if(this.optionTab == 4){
      this.CreateQuickbooksInvoice=true;
      this.changeActionReview = false;
      this.changeOkToPayDisputeBill = false;
      this.PendingQbInv(this.getApplyFilter(this.patientID, this.lastName, this.firstName,this.dob, this.modality, this.facility,this.user__Id));  
    }
     else{   
       this.changeActionReview = false;
       this.changeOkToPayDisputeBill = false;   
       this.CreateQuickbooksInvoice=false;
       this.GetBillingListForFacility(filterBody);   
       } 
}

GetBillingListForFacility(filterBody: any) {      
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
 errorNotification(err: any) {
   this.notificationService.showNotification({
     alertHeader: err.statusText,
     alertMessage: err.message,
     alertType: err.status
   });
 }

 GetNotBilledYetRadFlow(filterBody: any){
   this.facilityService.getNotBilledYetRadFlow(true, filterBody, this.pageNumber, this.pageSize).subscribe((res) => {
     this.GridData = [];  
     if (res.response != null && res.response.length > 0) {        
       this.totalFacility = res.totalRecords;
       this.GridData = res.response;    
     }
   }, (err: any) => {
     this.errorNotification(err);
   });    
 }

 GetReviewForRadFlow(filterBody: any){
  this.facilityService.ReviewForRadFlow(true, filterBody, this.pageNumber, this.pageSize).subscribe((res) => {
    this.GridData = [];  
    if (res.response != null && res.response.length > 0) {        
      this.totalFacility = res.totalRecords;
      this.GridData = res.response;    
    }
  }, (err: any) => {
    this.errorNotification(err);
  });    
}

PendingQbInv(filterBody: any){
  this.facilityService.PendingQbInvForRadFlow(true, filterBody, this.pageNumber, this.pageSize).subscribe((res) => {
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


 FacilityBillingPageChanged(event:any){
   this.pageNumber = event;
   this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName, this.dob, this.modality, this.facility,this.user__Id));
 }
 selectChange(){  
  let selectedPATIENTIDStudyid =[];   
  let Study_Status='';
  let Action='';
  let TabSelection='';
  if(this.checkedData.length >0){
    for (let i = 0; i < this.checkedData.length; i++) {
      if(this.selectedgroup === 1){
        Study_Status = 'PendingQB_INV'
        Action = 'OK to bill';
        TabSelection='Not Billed Yet - RadFlow'
      }else if(this.selectedgroup === 2){
        Study_Status = 'PendingQB_INV'
        Action = 'OK to Pay for study';
        TabSelection='Review - RadFlow'
      }
      else if(this.selectedgroup === 3){
        Study_Status = 'Need_Review'
        Action = 'Dispute';
        TabSelection='Review - RadFlow'
      }
      selectedPATIENTIDStudyid.push({
        InternalStudyID: Number(this.checkedData[i].INTERNALSTUDYID),
        PatientId : this.checkedData[i].PATIENTID,
        FacilityParentID: this.checkedData[i].FACILITYPARENTID,
        FacilityID: this.checkedData[i].FACILITYID,
        UserId: this.storageService.user.UserId,
        RadFlowOrFacility:'RadFlow',
        Rebill_Note:'',
        Remove_Note:'',
        Study_Status : Study_Status,
         Action:Action,
        TabSelection:TabSelection       
      });
    } 
    if(this.selectedgroup === 1) //OK to bill 
      {  
          this.facilityService.GetWarningForStudies(true,selectedPATIENTIDStudyid).subscribe((res)=>{
            if(res.response===null){
              this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName,this.dob, this.modality, this.facility,this.user__Id)); 
            }
          else if(res.response.length>0){          
            this.InsertandGetwarningBill(res.response);
          } 
        })
      }
      else if(this.selectedgroup === 2) //OK to Pay for study
        {
          this.facilityService.OkToPayStudies(true,selectedPATIENTIDStudyid).subscribe((res)=>{
            if (res) {
                this.notificationService.showNotification({ 
                alertHeader : (res.responseCode == ResponseStatusCode.OK) ? 'Success' : 'Error',
                alertMessage: res.message,
                alertType: (res.responseCode == ResponseStatusCode.OK) ? ResponseStatusCode.OK : ResponseStatusCode.InternalError                
              });
              this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName, this.dob, this.modality, this.facility,this.user__Id));
            }
          }) 
        }
      else if(this.selectedgroup === 3) //Dispute
          {
           this.facilityService.DisputeStudyByRadFlow(true,selectedPATIENTIDStudyid).subscribe((res)=>{
              if (res) {
                  this.notificationService.showNotification({ 
                  alertHeader : (res.responseCode == ResponseStatusCode.OK) ? 'Success' : 'Error',
                  alertMessage: res.message,
                  alertType: (res.responseCode == ResponseStatusCode.OK) ? ResponseStatusCode.OK : ResponseStatusCode.InternalError                
                });
                this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName, this.dob, this.modality, this.facility,this.user__Id));
              }
            }) 
          }
       else if(this.selectedgroup === 4) //Create Quickbooks Invoice
          {
            this.modal_add_to_quickbook.nativeElement.click();
          }
       
  }
  else{
    this.notificationService.showNotification({ 
     alertHeader : null,
     alertMessage: 'Please select al least one study from the below table to bill.',
     alertType: ResponseStatusCode.BadRequest
   });
  }   
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
 selectionChanged(data: any) { 
   this.checkedData = data.selectedRowsData;
 }
 onChangeDdlAction(selectedValue:any){
   this.selectedgroup = selectedValue
 }
 getCheckedBillStudies(checkedStudies:any){
     checkedStudies.checked ==!checkedStudies.checked;
 }
 
 getFacilityDetail(PatientId:any,DocType:any,row:any) {         
   if(DocType){
     let Doc_Id = (DocType !== null)?(DocType.split(',')[1]) : null;
         if(Doc_Id){
           this.FilePreview(PatientId,Doc_Id,row);
         }
     }
 }


 OverrideSelectedStudies(){
  let FacilityNeedReviewStudies: Array<{PatientID: string,InternalStudyID:string,FacilityParentID:string,FacilityID:string,UserId:string,RadFlowOrFacility:string,Rebill_Note:string,Remove_Note:string,Study_Status:string,Action:string,TabSelection:string}> = []; 
  for (let i = 0; i < this.WarningPopup.length; i++) { 
      if(this.WarningPopup[i].checked===true){
        FacilityNeedReviewStudies.push({PatientID: this.WarningPopup[i].PATIENTID, InternalStudyID:this.WarningPopup[i].INTERNALSTUDYID,FacilityParentID:this.WarningPopup[i].FacilityParentID,FacilityID:this.WarningPopup[i].FacilityID,UserId:this.storageService.user.UserId,RadFlowOrFacility:'RadFlow', Rebill_Note:'',Remove_Note:'',Study_Status:'Review',Action:'OverrideStudy',TabSelection:'Not Billed Yet - RadFlow'});  
      }
   }
   console.log(FacilityNeedReviewStudies);
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

 FilePreview(PatientId:string,DocID:string,row:any){  
   let Ret_Data = this.Get_MainDoc_IdUploadPreview(row,DocID);      
   const M_DocID = Ret_Data[0];
    //UserId = Ret_Data[1];   
   if(M_DocID && PatientId){
           this.PatientDocFacilityBilling =  this.facilityService.getPatientDocFacilityBilling(true,PatientId,M_DocID).subscribe((res)=>{
             if(res.response!==null)
             {
               let ArrayBuff = this._base64ToArrayBuffer(res.response); 
               let file = new Blob([ArrayBuff], { type: 'application/pdf' }); 
               window.open(URL.createObjectURL(file), '_blank');      
             }
         });  
     }
 }

   Get_MainDoc_IdUploadPreview(row: any,FromDocId:string){  
     var Tech_Lien = (row.data.Tech_Lien !== null)?(row.data.Tech_Lien.split(',')[1]) : null;
     var Radiologist_Lien = (row.data.Radiologist_Lien !== null)?(row.data.Radiologist_Lien.split(',')[1]) : null;
     var Patient_Demo =  (row.data.Patient_Demo !== null)?(row.data.Patient_Demo.split(',')[1]) : null;
     var Patient_Identification = (row.data.Patient_Identification!== null)?(row.data.Patient_Identification.split(',')[1]) : null;    
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
 
}
