import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ckeConfig, CkeEvent } from 'src/app/constants/Ckeditor';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { PageSizeArray } from 'src/app/constants/pageNumber';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styles: [
  ]
})

export class TemplateComponent implements OnInit {
  modelValue: string = 'modal';
  editTemplateForm: FormGroup;
  templateList: any = [];
  totalRecords: number;
  spanishCheckMark: boolean;
  templateId: number;

  submitted = false;
  pageNumber: number = 1;
  IsmodelShow = true;
  pageSize: number;
  showPickupDetailModal = 'none';
  pageOfItems: Array<any>;
  items = [];
  name = 'ng2-ckeditor';
  //ckeConfig: CKEDITOR.config;
  ckeConfig: any;
  ckConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor_spanishEmailBody") myckeditor_spanishEmailBody: any;
  @ViewChild("myckeditor_body") myckeditor_body: any;
  readonly CkeConfig = ckeConfig;
  readonly ckeEvent = new CkeEvent();
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  readonly pageSizeArray = PageSizeArray;
  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService,
    private readonly settingsService: SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;

    this.commonMethodService.setTitle('Templates');
    this.getEmailTemplates()
    this.editTemplateForm = this.fb.group({
      type: [''],
      title: [''],
      subject: [''],
      body: ['', [Validators.required]],
      spanishCheckMark: [''],
      spanishEmailBody: ['']
    });
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getEmailTemplates();
  }
  onChange($event: any): void {
    console.log("onChange");
  }
  onChange_body($event: any): void {

    var cssText = this.myckeditor_body.instance.getSelectedHtml().$.style.cssText.split(':')[1];
    if (cssText == ' Code128;') {
      var selectedText = this.myckeditor_body.instance.getSelection().getSelectedText();
      var htmlElement = this.myckeditor_body.instance.getSelectedHtml().$.innerHTML;
      var data = this.ckeEvent.getQRCodeString($event, selectedText, htmlElement);
      if (data != null) {
        this.myckeditor_body.instance.setData(data);
      }
    } else {
      this.myckeditor_body.instance.setData($event);
    }
  }
  onChange_spanishEmailBody($event: any): void {
    var cssText = this.myckeditor_spanishEmailBody.instance.getSelectedHtml().$.style.cssText.split(':')[1];
    if (cssText == ' Code128;') {
      var selectedText = this.myckeditor_spanishEmailBody.instance.getSelection().getSelectedText();
      var htmlElement = this.myckeditor_spanishEmailBody.instance.getSelectedHtml().$.innerHTML;
      var data = this.ckeEvent.getQRCodeString($event, selectedText, htmlElement);
      if (data != null) {
        this.myckeditor_spanishEmailBody.instance.setData(data);
      }
    } else {
      this.myckeditor_spanishEmailBody.instance.setData($event);
    }
    //this.log += new Date() + "<br />";
  }


  onPaste($event: any): void {
    console.log("onPaste");
    //this.log += new Date() + "<br />";
  }

  getEmailTemplates() {
    this.settingsService.getEmailTemplates(this.pageNumber, this.pageSize, true).subscribe((res) => {
      var data: any = res;
      this.totalRecords = res.totalRecords;
      if (data.response != null && data.response.length > 0) {
        this.templateList = data.response;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }
  checkValue(event) {
    if (event.target.checked) {
      this.editTemplateForm.controls['spanishEmailBody'].setValidators([Validators.required]);
    } else {
      this.editTemplateForm.controls['spanishEmailBody'].clearValidators();
    }
    this.editTemplateForm.controls['spanishEmailBody'].updateValueAndValidity();
  }

  pageChanged(event) {
    this.pageNumber = event;
    this.getEmailTemplates()
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
    // this.getEmailTemplates()
  }

  goFirstPage() {
    this.pageOfItems = [1];
  }

  refreshEmailTemplate() {
    this.getEmailTemplates()
  }

  getEmailTemplate(id) {
    this.submitted = false;
    this.templateId = id;
    this.settingsService.getEmailTemplateById(true, id).subscribe((res) => {
      this.editTemplateForm.setValue({
        type: res.response.emailType,
        body: res.response.emailBody,
        subject: res.response.emailSubject,
        title: res.response.emailTitle,
        spanishCheckMark: res.response.spanishCheckMark,
        spanishEmailBody: res.response.spanishEmailBody
      })
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  onSubmit() {
    console.log(this.editTemplateForm)
    this.submitted = true;
    this.modelValue = 'modal';
    if (this.editTemplateForm.invalid) {
      this.modelValue = '';
      return;
    }

    if (this.templateId != null)
      this.updateEmailTemplate();
  }

  updateEmailTemplate() {
    var body = {
      'templateId': this.templateId,
      'emailType': this.edtForm.type.value,
      'emailTitle': this.edtForm.title.value,
      'emailSubject': this.edtForm.subject.value,
      'emailBody': this.edtForm.body.value,
      'spanishEmailBody': this.edtForm.spanishEmailBody.value,
      'spanishCheckMark': this.edtForm.spanishCheckMark.value
    }
    this.settingsService.updateEmailTemplate(true, body).subscribe((res) => {

      if (res) {
        this.notificationService.showNotification({
          alertHeader: 'Success',
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getEmailTemplates();

    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  get edtForm() { return this.editTemplateForm.controls; }
}
