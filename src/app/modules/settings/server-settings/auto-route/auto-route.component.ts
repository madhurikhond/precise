import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

export type AutoRouteSettingFormValue = {
  'autoRouteStatus': string,
  'daysNotFound': number,
  'daysPurge': number,
  'daysIntoAction': number,
  'fileExtension': string  
};

@Component({
  selector: 'app-auto-route',
  templateUrl: './auto-route.component.html',
  styles: [
  ]
})
export class AutoRouteComponent implements OnInit {
  autoRouteForm: FormGroup;
  submitted = false;

  documentList: any = [];
  fileExtensionList: any = [];
  defaultSettings: any = [];
  selectedDocumentList: any = [];
  
  selectedExtensionList: any = [];

  showDocumentDropdownLoader = true; 
  showFileExtensionDropdownLoader = true; 
  filter = false;

  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService: SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Auto route');
    this.getMasterDocumentTypeList();
    this.getFileExtensionList();
    this.getDefaultAutoRouteSetting();

    this.autoRouteForm = this.fb.group({
      docIds: ['', [Validators.required]],
      daysNotFound: [null, 
        [
          Validators.required,
          Validators.maxLength(3), 
          Validators.min(0), 
          Validators.max(999),   
          Validators.pattern(/^\d*\.?\d*$/)
      ]],
      daysIntoAction: [null, 
        [
          Validators.required,
          Validators.maxLength(3), 
          Validators.min(0), 
          Validators.max(999),   
          Validators.pattern(/^\d*\.?\d*$/)
      ]],
      daysPurge: [null, 
        [
          Validators.required,
          Validators.maxLength(3), 
          Validators.min(0),
    
          Validators.max(999),   
          Validators.pattern(/^\d*\.?\d*$/)
      ]],
      extensionIds: ['', [Validators.required]],
    });   
  }
  
  getMasterDocumentTypeList(){
debugger;
    this.settingsService.getMasterDocumentTypeList(false).subscribe((res) => {
      var data: any = res;
      debugger;
      if (data.response != null && data.response.length > 0) {
        this.documentList = data.response;
        console.log(this.documentList);
      }
      else {
        this.notificationService.showNotification({
          alertHeader : data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
      this.showDocumentDropdownLoader = false;
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
      this.showDocumentDropdownLoader = false;
    });
  }

  getFileExtensionList(){
    this.settingsService.getFileExtensionList(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.fileExtensionList = data.response;
      }
      // else {
      //   this.notificationService.showNotification({
      //     alertHeader : data.statusText,
      //     alertMessage: data.message,
      //     alertType: data.responseCode
      //   });
      // }
      this.showFileExtensionDropdownLoader = false;
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
      this.showFileExtensionDropdownLoader = false;
    });
  }

  getDefaultAutoRouteSetting(){debugger;
    this.settingsService.getDefaultAutoRouteSetting(true).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.defaultSettings = data.response;
        var result = data.response.DocumentTypes.map(function(a) {return a.DocId;});
        this.selectedDocumentList =result;
        this.selectedExtensionList = data.response.FileExtensions.map(function(a) {return a.ExtensionId;});
        this.autoRouteForm.patchValue({
          daysNotFound: data.response.DaysNotFound,
          daysPurge: data.response.DaysPurge,
          daysIntoAction: data.response.DaysIntoAction
        });
      }
      else {
        this.notificationService.showNotification({
          alertHeader : '',
          alertMessage: data.Message,
          alertType: data.ResponseCode
        });
      }
      this.showFileExtensionDropdownLoader = false;
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
      this.showFileExtensionDropdownLoader = false;
    });
  }

  onSubmit(){
    this.submitted = true
    if(!this.autoRouteForm.valid){
     return;
    }  
    const { daysNotFound, daysPurge, daysIntoAction } = this.autoRouteForm.value as (AutoRouteSettingFormValue);
    (this.settingsService.saveAutoRouteSetting({
      AutoRouteStatus: this.selectedDocumentList.toString(),
      DaysNotFound: daysNotFound,
      daysPurge: daysPurge,
      daysIntoAction: daysIntoAction,
      fileExtension: this.selectedExtensionList.toString()
    })).subscribe((res : any) => {
      // var response = this.commonMethod.genericResponse(res.responseCode, res.message, true);
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : res.response.Status ? 'Success' : 'Error',
          alertMessage: res.response.Message,
          alertType: res.response.Status ? ResponseStatusCode.OK : ResponseStatusCode.InternalError
        });
      }
    },
    (err : any) => {
      this.notificationService.showNotification({ 
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: ResponseStatusCode.InternalError
      });
    }
    );
  }
   onSelectAll() { debugger;
    var selected = this.documentList.map(item => item.docId);
    this.arForm.docIds.setValue(selected);
  }

   onClearAll() { debugger;
    this.arForm.docIds.setValue([]);
  }


  onSelectAllExtension(){
    var selected = this.fileExtensionList.map(item => item.ExtensionId);
    this.arForm.extensionIds.setValue(selected);
  }

  onClearAllExtension(){
    this.arForm.extensionIds.setValue([]);

  }
  onChange(event){
  }

  get arForm() { return this.autoRouteForm.controls; }
}
