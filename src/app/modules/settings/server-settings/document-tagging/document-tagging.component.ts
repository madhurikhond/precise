import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-document-tagging',
  templateUrl: './document-tagging.component.html',
  styleUrls: ['./document-tagging.component.css']
})
export class DocumentTaggingComponent implements OnInit {
  modelValue:string='modal';
  modelValue1:string='modal';
  addDocumentTypeForm: FormGroup;
  editDocumentTypeForm: FormGroup;
  totalRecords: number;
  pageNumber: number =1;
  pageSize : number ;
  documentTypeList : any =[]
  submitted = false;
  documentTypeId: number;

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  readonly pageSizeArray=PageSizeArray;
  constructor(private fb: FormBuilder, private settingService: SettingsService, 
    private notificationService: NotificationService, private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;

    this.commonMethodService.setTitle('Document Tagging');
    this.getDocumentsTypes();
    this.addDocumentTypeForm = this.fb.group({
      docGroup:['', [Validators.required]],
      docType:['', [Validators.required]],
      docAbbreviation:['', [Validators.required]],
      isActive: [true, ]
    }); 

    this.editDocumentTypeForm = this.fb.group({
      docGroup:['', [Validators.required]],
      docType:['', [Validators.required]],
      docAbbreviation:['', [Validators.required]],
      isActive: ['']
    }); 
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getDocumentsTypes();
  }
  onInsertSubmit(){
    this.submitted = true;
    this.modelValue='modal';
    if (this.addDocumentTypeForm.invalid) {
      this.modelValue='';
      return;
    }
    this.saveDocumentType();
  }

  onUpdateSubmit(){
    this.submitted = true;
    this.modelValue1 = 'modal';
    if (this.editDocumentTypeForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.saveDocumentType();
  }

  saveDocumentType(){    
    if(this.documentTypeId == null){
      var data = {
        'docId': this.documentTypeId,
        'docType': this.addForm.docType.value,
        'abbreviation': this.addForm.docAbbreviation.value,
        'docGroup': this.addForm.docGroup.value,
        'isActive': (this.addForm.isActive.value == null ? false : this.addForm.isActive.value)
      }
      this.settingService.addDocumentType(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getDocumentsTypes();    
      }, 
      (err : any) => {
        this.notificationService.showNotification({
          alertHeader : err.statusText,
          alertMessage:err.message,
          alertType: err.status
        });
      });
    }
    else {
      var data = {
        'docId': this.documentTypeId,
        'docType': this.editForm.docType.value,
        'abbreviation': this.editForm.docAbbreviation.value,
        'docGroup': this.editForm.docGroup.value,
        'isActive': this.editForm.isActive.value
      }
      this.settingService.updateDocumentType(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getDocumentsTypes();    
      }, 
      (err : any) => {
        this.notificationService.showNotification({
          alertHeader : err.statusText,
          alertMessage:err.message,
          alertType: err.status
        });
      });
    }
  }

  getDocumentsTypes(){
    this.settingService.getDocumentTypesList(this.pageNumber, this.pageSize, true).subscribe((res) => {
      var data: any = res;
      this.totalRecords=res.totalRecords
      if (data.response != null && data.response.length > 0) {
        this.documentTypeList = data.response;
      }
      else {
        this.notificationService.showNotification({
          alertHeader : data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

  pageChanged(event){
    this.pageNumber = event;
    this.getDocumentsTypes()
  }

  add(){
    this.documentTypeId = null;
    this.submitted = false;
    this.addDocumentTypeForm.reset();
  }

  edit(documentTypeId){
    this.submitted = false;
    this.editDocumentTypeForm.reset();
    this.documentTypeId = documentTypeId;
    this.getDocumentTypeById(documentTypeId);
  }

  getDocumentTypeById(documentTypeId){
    this.settingService.getDocumentTypeById(true, documentTypeId).subscribe((res) => {
    var data: any = res;
    if (data.response != null) {
      this.editDocumentTypeForm.patchValue({
        docGroup: data.response.docGroup,
        docType: data.response.docType,
        isActive: data.response.isActive,
        docAbbreviation: data.response.abbreviation
      });
    }
    else {
      this.notificationService.showNotification({
        alertHeader : data.statusText,
        alertMessage: data.message,
        alertType: data.responseCode
      });
    }
  }, 
  (err : any) => {
    this.notificationService.showNotification({
      alertHeader : err.statusText,
      alertMessage:err.message,
      alertType: err.status
    });
  });
  }

  get addForm() { return this.addDocumentTypeForm.controls; }
  get editForm() { return this.editDocumentTypeForm.controls; }
}
