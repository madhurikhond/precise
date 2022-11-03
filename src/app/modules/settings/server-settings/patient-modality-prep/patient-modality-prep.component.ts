import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { ckeConfig } from 'src/app/constants/Ckeditor';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { patientPortalResponseStatus, PatientPortalStatusMessage } from 'src/app/models/patient-response';

@Component({
  selector: 'app-patient-modality-prep',
  templateUrl: './patient-modality-prep.component.html',
  styleUrls: ['./patient-modality-prep.component.scss']
})
export class PatientModalityPrepComponent implements OnInit {

  modelValue: string = 'modal';
  editModalityForm: FormGroup;
  patientModalityList: any = [];
  spanishCheckMark: boolean;
  templateId: number;
  modalityId: number;

  submitted = false;
  IsmodelShow = true;
  showPickupDetailModal = 'none';
  items = [];
  name = 'ng2-ckeditor';
  spanishValue: string = '';
  //ckeConfig: CKEDITOR.config;
  ckeConfig: any;
  ckConfig: any;
  mycontent: string;
  log: string = '';

  readonly CkeConfig = ckeConfig;
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService,
    private readonly patientPortalService: PatientPortalService) {
  }

  ngOnInit(): void {
    this.columnResizingMode = this.resizingModes[0];
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;
    this.commonMethodService.setTitle('Patient Modality Prep');
    this.GetPatientModalityTemplate()
    this.editModalityForm = this.fb.group({
      englishBody: ['', [Validators.required]],
      spanishCheckMark: [''],
      spanishBody: ['']
    });
  }

  onChange($event: any): void {
  }

  onPaste($event: any): void {
  }

  GetPatientModalityTemplate() {
    var request = {};
    this.patientPortalService.GetPatientModalityTemplate(request, true).subscribe((res) => {
      var data: any = res.result;
      if (data.length > 0)
        this.patientModalityList = data;
      else
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.NO_PATIENT_MODALITY_PREP_FOUND);
    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      });
  }
  checkValue(event) {

    if (event.target.checked) {
      this.editModalityForm.controls['spanishBody'].setValidators([Validators.required]);
      this.editModalityForm.controls['spanishBody'].setValue(this.spanishValue);
    } else {
      this.spanishValue = this.editModalityForm.controls['spanishBody'].value;
      this.editModalityForm.controls['spanishBody'].clearValidators();
      this.editModalityForm.controls['spanishBody'].setValue('');
    }
    this.editModalityForm.controls['spanishBody'].updateValueAndValidity();
  }

  refreshModalityTemplate() {
    this.GetPatientModalityTemplate()
  }

  getModalityTemplate(data) {
    this.submitted = false;
    this.templateId = data.templateId;
    this.modalityId = data.modalityId;
    this.spanishValue = data.spanishBody;
    this.editModalityForm.setValue({
      englishBody: data.englishBody,
      spanishCheckMark: data.spanishCheckMark,
      spanishBody: data.spanishBody
    });
  }

  onSubmit() {
    this.submitted = true;
    this.modelValue = 'modal';
    if (this.editModalityForm.invalid) {
      this.modelValue = '';
      return;
    }
    if (this.templateId != null && this.modalityId != null)
      this.updateModalityTemplate();
    this.editModalityForm.reset();
  }

  updateModalityTemplate() {
    var body = {
      modalityId: this.modalityId,
      englishBody: this.edtForm.englishBody.value,
      spanishBody: this.edtForm.spanishBody.value,
      spanishCheckMark: this.edtForm.spanishCheckMark.value
    }
    this.patientPortalService.InsertUpdatePatientModalityTemplate(body, true).subscribe((res) => {
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success) {
          this.patientPortalService.successNotification(PatientPortalStatusMessage.PATIENT_MODALITY_PREP_UPDATED);
        }
      }
      this.GetPatientModalityTemplate();
    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.INVALID_CODE);
      });
  }

  get edtForm() { return this.editModalityForm.controls; }
}
