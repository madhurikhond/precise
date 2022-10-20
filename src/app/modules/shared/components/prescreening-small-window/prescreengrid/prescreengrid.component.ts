import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonHubProtocol } from '@aspnet/signalr';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import CheckBox from 'devextreme/ui/check_box';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
import { PreScreeningGeneralQuestion, PreScreeningMRIQuestion, PreScreeningCTQuestion, PreScreeningUSQuestion, GridRowState } from '../../../../../models/pre-screeing-question';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NoPatientExistPopupComponent } from './no-patient-exist-popup/no-patient-exist-popup.component';
import { SettingsService } from 'src/app/services/settings.service';
import { StorageService } from 'src/app/services/common/storage.service';


@Component({
  selector: 'app-prescreengrid',
  templateUrl: './prescreengrid.component.html',
  styleUrls: ['./prescreengrid.component.css']
})
export class PrescreengridComponent implements OnInit {
  @ViewChild('hiddenModalclose', { static: false }) hiddenModalclose: ElementRef;
  @ViewChild('hiddenNoExist', { static: false }) hiddenNoExist: ElementRef;
  @ViewChild('hiddenModality', { static: false }) hiddenModality: ElementRef;

  currentDate = new Date();
  today = this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getDate();
  preScreeningQuestionForm: FormGroup;
  preScreenGridList: any = [];
  resizingModes: string[] = ["nextColumn", "widget"];
  selectedRows: any = [];
  selectedModalities: any = [];
  columnResizingMode: string;
  modelValue: string = "modal";
  noExistPatientForm: FormGroup;
  smsSubmitted = false;
  submitted = false;
  preScreeningQuestionSubmitted = false;
  totalRecords: number = 1;
  pageNumber: number = 1;
  pageSize: number = 20;
  showDropdownLoader = true;
  smsModal: string = "modal";
  preScreeningQuestionModal: string = "modal";
  showSMSInfo = false;
  noOfSMS: number = 0;
  smsLength: number = 0;
  groupKey: any = [];
  changePatient: boolean = true;
  preScreeningQuestionData: any;
  preScreeningQuestionAnswerData: any = [];
  mrStudyDescription: any = []
  usStudyDescription: any = []
  ctStudies: any = [];
  modality: string = "";
  countData: boolean = false;
  totalOrder: string;
  newOrder: string;
  totalVM: string;
  leftVM: string;
  totalCB: string;
  leftCB: string;
  ordered: string;
  totalOrdered: string;
  noShow: string;
  totalNoShow: string;
  rescheduled: string;
  totalRescheduled: string;
  isPrescreeningQuestion: boolean = false;
  internalStudyId: string
  patientId: string
  patientIdExist : boolean = false;

  isMR: boolean = false;
  isMRWC: boolean = false;
  isCT: boolean = false;
  isUS: boolean = false;

  financialTypeList: any = [];

  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: "auto", name: "Immediately" }, { key: "onClick", name: "On Button Click" }];
  currentFilter: any;
  showHeaderFilter: boolean;

  pregnantMessage: string;
  isRxDocumentVerify = false;
  weightHeightMessage: string;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  expandedRow: any;

  modalitiesGridList: any = []

  IsShowNoPatient = false;
  constructor(private activatedroute: ActivatedRoute, private readonly router: Router,
    private readonly notificationService: NotificationService, private readonly settingsService: SettingsService,
    private readonly workflowService: WorkflowService, private _modalService: NgbModal,
    private fb: FormBuilder, private readonly commonMethodService: CommonMethodService,
    private readonly storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this.patientId = this.activatedroute.snapshot.queryParams.patientId;
    // this.commonMethodService.preScreenPatientID.subscribe(patientID => 
    //   this.patientId = patientID)
    if (!this.patientId) {
      this.router.navigate((this.storageService.LastPageURL === null || this.storageService.LastPageURL === '') ? ['login'] : [this.storageService.LastPageURL]);
    }
    else {
      this.columnResizingMode = this.resizingModes[0];
      this.getPreScreenGrid();
      this.prescreeningFormCreate();
      this.createNoexistPatientForm();
      this.getmodalities();
    }
    this.activatedroute.queryParams.subscribe(res => {
      if (this.IsShowNoPatient) {
        this.patientId = this.activatedroute.snapshot.queryParams.patientId;

        this.columnResizingMode = this.resizingModes[0];
        this.getPreScreenGrid();
        this.prescreeningFormCreate();
        this.createNoexistPatientForm();
        this.getmodalities();
      }
    });

    this.IsShowNoPatient = true;

  }

  getPreScreenGrid() {
    this.workflowService.GetPrescreenGridRecord(this.patientId, true).subscribe((res) => {
      if (res.response) {
        this.patientIdExist = true;
        this.preScreenGridList = JSON.parse(res.response);
        if (this.preScreenGridList.length > 0) {
          this.preScreenGridList.forEach((element, index) => {
            element.myId = index;
          });
        }
      }
      else {
        this.patientIdExist = false;
        var message = "Patient ID " + this.patientId.toString().replace(",", ", ") + " is not in the system yet. If the Patient ID is correct and was just added today, you may choose to proceed with the questions.\n";
        const modalReff = this._modalService.open(NoPatientExistPopupComponent,
          { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
        modalReff.componentInstance.message = message
        modalReff.componentInstance.notifyParent.subscribe((result) => {
          if (result === "true") {
            this.hiddenNoExist.nativeElement.click();
          }
          else {
            this.router.navigate((this.storageService.LastPageURL === null || this.storageService.LastPageURL === '') ? ['login'] : [this.storageService.LastPageURL]);
          }
        })
      }
    }, (err: any) => {

    })

  }

  onNoExistSubmit() {
    this.submitted = true;
    if (this.noExistPatientForm.invalid) {
      return;
    }
    this.hiddenModalclose.nativeElement.click();
    this.hiddenModality.nativeElement.click();
  }

  getmodalities() {
    this.settingsService.getModalityNames(true).subscribe((res) => {
      if (res.response) {
        this.modalitiesGridList = res.response;
      }
    });
  }

  clearNoPatient() {
    this.router.navigate((this.storageService.LastPageURL === null || this.storageService.LastPageURL === '') ? ['login'] : [this.storageService.LastPageURL]);
  }

  onModalitySubmit() {
    this.modelValue = "modal";
    if (!this.selectedModalities || this.selectedModalities.length == 0) {
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'Please select at least one modality.',
        alertType: ResponseStatusCode.BadRequest
      });
      this.modelValue = "";
      return;
    }
    this.isMR = false;
    this.isMRWC = false;
    this.isCT = false;
    this.isUS = false;
    this.prescreeningFormCreate();
    this.isPrescreeningQuestion = true;
    this.preScreeningQuestionSubmitted = false;
    this.preScreeningQuestionForm.reset();
    this.preScreeningQuestionForm.patchValue({
      gender: this.noExistForm.sex.value
    });
    this.preScreeningQuestionData = {};
    this.preScreeningQuestionData.patientData = {};
    this.preScreeningQuestionData.patientData.DOB = this.noExistForm.patientDOB.value;
    this.preScreeningQuestionData.patientData.FirstName = this.noExistForm.firstName.value;
    this.preScreeningQuestionData.patientData.LastName = this.noExistForm.lastName.value;
    this.preScreeningQuestionData.patientData.PatientId = this.noExistForm.patientID.value;
    this.preScreeningQuestionData.patientData.SEX = this.noExistForm.sex.value;
    // INTERNALSTUDYID  MODALITY PATIENTID STATUS STUDYDESCRIPTION
    this.preScreeningQuestionData.patientStudyData = [];



    this.changeGender(this.noExistForm.sex.value);
    var filterData = this.modalitiesGridList.filter((data) => this.selectedModalities.includes(data.Modality));

    filterData.forEach(study => {
      this.preScreeningQuestionData.patientStudyData.push({
        INTERNALSTUDYID: '',
        MODALITY: study.Modality,
        PATIENTID: this.patientId,
        STUDYDESCRIPTION: study.Description,
        STATUS: ''
      })
    });


    this.ctStudies = [];
    this.mrStudyDescription = [];
    this.usStudyDescription = [];

    filterData.forEach(study => {
      var studyDescription = study.Description.toLowerCase();
      switch (study.ShortFormModality) {
        case "MR":
          if (((studyDescription.includes("mri") || studyDescription.includes("mr"))
            && (!studyDescription.includes("w/o & w/contrast")
              && (!studyDescription.includes("w/ & w/o ")
                && (!studyDescription.includes("w/ contrast")
                  && !studyDescription.includes("w/contrast")))))) {
            this.isMR = true;
          }
          if (((studyDescription.includes("mri") || studyDescription.includes("mr"))
            && (studyDescription.includes("w/contrast")
              || (studyDescription.includes("w/ contrast")
                || (studyDescription.includes("w/o & w/contrast")
                  || studyDescription.includes("w/ & w/o ")))))) {
            this.isMRWC = true;
            this.isMR = true;
          }
          this.mrStudyDescription.push({
            'Study': study.STUDYDESCRIPTION,
            'Status': study.STATUS
          })

          break;
        case "DX":
        case "CT":
        case "RG":
        case "PT":
        case "CR":
          this.isCT = true;
          this.ctStudies.push({
            'Study': study.STUDYDESCRIPTION,
            'Status': study.STATUS
          })
          break;
        case "US":
          this.isUS = true;
          this.usStudyDescription.push({
            'Study': study.STUDYDESCRIPTION,
            'Status': study.STATUS
          })
          break;

      }
    });
    this.setPrescreeningQuestionFormValidation()

  }


  // PRESCREENING  MODAL

  preScreeningQuestionClick(id) {
    this.isMR = false;
    this.isMRWC = false;
    this.isCT = false;
    this.isUS = false;
    this.preScreeningQuestionAnswerData = [];
    this.prescreeningFormCreate();
    if (!this.selectedRows.includes(id)) {
      setTimeout(() => {
        this.selectedRows = this.selectedRows.filter(item => item !== id);
        if (this.selectedRows.length > 0) {
          this.isPrescreeningQuestion = true;
          this.getPrescreeningQuestionData();
        }
        else {
          this.notificationService.showNotification({
            alertHeader: null,
            alertMessage: 'Please select at least one record from the below table.',
            alertType: ResponseStatusCode.BadRequest
          });
        }
      }, 50);
    }
    else {
      setTimeout(() => {
        this.selectedRows.push(id);
        if (this.selectedRows.length > 0) {
          this.isPrescreeningQuestion = true;
          this.getPrescreeningQuestionData();
        }
        else {
          this.notificationService.showNotification({
            alertHeader: null,
            alertMessage: 'Please select at least one record from the below table.',
            alertType: ResponseStatusCode.BadRequest
          });
        }
      }, 50);
    }
  }

  onCellPrepared(e: any) {
    if (e.rowType === "header" && e.column.command === 'select') {
      var instance = CheckBox.getInstance(e.cellElement.querySelector('.dx-select-checkbox'));
      var dom = instance.$element() as any;
      dom.remove();
    }
    if (e.rowType === "data" && e.columnIndex) {
      e.cellElement.style.pointerEvents = 'none';
    }
  }

  createNoexistPatientForm() {
    this.noExistPatientForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      patientDOB: ['', [Validators.required]],
      patientID: [this.patientId, [Validators.required]],
      sex: ['', [Validators.required]]
    })
  }


  getPrescreeningQuestionData() {
    debugger;
    this.isMR = false;
    this.isMRWC = false;
    this.isCT = false;
    this.isUS = false;
    this.preScreeningQuestionSubmitted = false;
    this.preScreeningQuestionForm.reset();

    let filterData = this.preScreenGridList.filter((data) => this.selectedRows.includes(data.myId));
    let patientIds = filterData.map(a => a.PatientID);
    let internalStudyIds = filterData.map(a => a.InternalStudyId);
    var uniquePatientIds = patientIds.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });

    this.patientId = uniquePatientIds.toString()
    var uniqueInternalStudyIds = internalStudyIds.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    this.internalStudyId = uniqueInternalStudyIds.toString();
    var data = {
      "patientId": uniquePatientIds.toString(),
      "internalStudyId": uniqueInternalStudyIds.toString(),
    }
    this.workflowService.getPrescreeningQuestionData(data).subscribe((res) => {
      
      var data: any = res;
      if (data.response != null) {
        this.preScreeningQuestionData = data.response;

        this.populatePatientData(this.preScreeningQuestionData.patientData);
        this.populateStudyData(this.preScreeningQuestionData.patientStudyData);
        if (this.preScreeningQuestionData.preScreeningQuestionData) {
          this.populatePreScreeningQuestionData(this.preScreeningQuestionData.preScreeningQuestionData);
          this.onChangePregnantTime();
          this.ShowWeightAndHeightMessage();
        }
        //this.setPrescreeningQuestionFormValidation();
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
      this.showDropdownLoader = false;
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
        this.showDropdownLoader = false;
      });
  }

  prescreeningFormCreate() {
    this.preScreeningQuestionForm = null;
    this.preScreeningQuestionForm = this.fb.group({
      gender: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(20), Validators.max(999)]],
      heightFoot: ['', Validators.required],
      heightInch: ['', Validators.required],
      isStudyConfirmed: [false, Validators.requiredTrue],
      isPregnant: [''],
      pregnantTime: [''],

      //      M R I    (C O M M O N)
      isMriBefore: [''],
      isMriExperience: [''],
      mriExperienceQuestion: [''],
      isClaustrophobic: [''],
      isMedicalCondition: [''],
      medicalConditionQuestion: [''],
      isMetalWorked: [''],
      isPerformedXRAY: [''],
      isEyeInjury: [''],
      eyeInjuryQuestion: [''],
      isPhysicalLimitation: [''],
      isSelfTransferMriTable: [''],
      isMedicalDeviceOnBody: [''],
      medicalDeviceOnBodyQuestion: [''],
      isForeignMetalInjury: [''],
      foreignMetalInjuryQuestion: [''],
      isWearWig: [''],
      isRemovableMetal: [''],
      isRecentTattoo: [''],
      recentTattooQuestion: [''],
      isAnkleMonitorDevice: [''],
      isRemovableAnkleMonitorDevice: [''],
      isRemovablWhileScan: [''],
      priorSurgeryQuestion: [''],

      //    M R I   (W I T H   C O T R A S T)
      isDiabetesHistory: [''],
      isCancerHistory: [''],
      isHighBloodPressure: [''],
      isAllergyReaction: [''],
      allergyReactionQuestion: [''],
      isKidneyProblem: [''],

      //    U S 
      isAllergy: [''],
      allergyDescription: [''],

      //    C T  or  X R A Y
      isRecentXray: [''],
      xrayCTDescription: [''],
      isCancerHistoryCT: [''],
      radiationTreatment: ['']
    });

  }

  populatePatientData(sexData) {
    this.preScreeningQuestionForm.patchValue({
      gender: sexData.SEX
    });
    this.changeGender(sexData.SEX);
  }

  changeGender(val) {
    const isPregnantControl = this.preScreeningQuestionForm.get('isPregnant');
    const pregnantTimeControl = this.preScreeningQuestionForm.get('pregnantTime');
    if (val === 'M') {
      isPregnantControl.setValidators(null);
      pregnantTimeControl.setValidators(null);
    }
    else if (val === 'F') {
      isPregnantControl.setValidators([Validators.required]);
      pregnantTimeControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        isPregnant: ''
      });
    }
    isPregnantControl.updateValueAndValidity();
    pregnantTimeControl.updateValueAndValidity();

  }

  ShowWeightAndHeightMessage() {
    let feet = this.psqForm.heightFoot.value ? parseInt(this.psqForm.heightFoot.value.replace('ft', '')) : -1
    let inch = this.psqForm.heightInch.value ? parseInt(this.psqForm.heightInch.value.replace('in', '')) : -1
    let weight = this.psqForm.weight.value ? parseInt(this.psqForm.weight.value) : 0

    if (weight >= 300 && feet < 0 && inch < 0)
      this.weightHeightMessage = 'Ensure facility can accommodate their weight'
    else if (feet >= 5 && inch >= 5 && weight >= 220)
      this.weightHeightMessage = 'Patient might not fit inside MRI, consider scheduling at an open or stand up MRI.'
    else
      this.weightHeightMessage = '';
  }

  populateStudyData(studyData) {

    this.ctStudies = [];
    this.mrStudyDescription = [];
    this.usStudyDescription = [];

    studyData.forEach(study => {
      var studyDescription = study.STUDYDESCRIPTION.toLowerCase();
      switch (study.MODALITY) {
        case "MR":
          if (((studyDescription.includes("mri") || studyDescription.includes("mr"))
            && (!studyDescription.includes("w/o & w/contrast")
              && (!studyDescription.includes("w/ & w/o ")
                && (!studyDescription.includes("w/ contrast")
                  && !studyDescription.includes("w/contrast")))))) {
            this.isMR = true;
          }
          if (((studyDescription.includes("mri") || studyDescription.includes("mr"))
            && (studyDescription.includes("w/contrast")
              || (studyDescription.includes("w/ contrast")
                || (studyDescription.includes("w/o & w/contrast")
                  || studyDescription.includes("w/ & w/o ")))))) {
            this.isMRWC = true;
            this.isMR = true;
          }
          this.mrStudyDescription.push({
            'Study': study.STUDYDESCRIPTION,
            'Status': study.STATUS
          })

          break;
        case "DX":
        case "CT":
        case "RG":
        case "PT":
          case "CR":
          this.isCT = true;
          this.ctStudies.push({
            'Study': study.STUDYDESCRIPTION,
            'Status': study.STATUS
          })
          break;
        case "US":
          this.isUS = true;
          this.usStudyDescription.push({
            'Study': study.STUDYDESCRIPTION,
            'Status': study.STATUS
          })
          break;

      }
    });
    this.setPrescreeningQuestionFormValidation()
  }
  populatePreScreeningQuestionData(questionData) {
    questionData.forEach(data => {
      switch (data.Questions) {
        case PreScreeningGeneralQuestion.Gender:
          this.preScreeningQuestionForm.patchValue({
            gender: data.Answers
          });
          break; // gender was not binding properly. Mridula uncommented it 
        case PreScreeningGeneralQuestion.Weight:
          this.preScreeningQuestionForm.patchValue({
            weight: data.Answers
          });
          break;
        case PreScreeningGeneralQuestion.Height:
          if (data.Answers) {
            this.preScreeningQuestionForm.patchValue({
              heightFoot: data.Answers.split(" ")[0],
              heightInch: data.Answers.split(" ")[1]
            });
          }
          break;
        case PreScreeningGeneralQuestion.Pregnant:
          this.preScreeningQuestionForm.patchValue({
            isPregnant: data.Answers
          });
          this.changePregnant(data.Answers);
          break;
        case PreScreeningGeneralQuestion.PregnantTime:
          this.preScreeningQuestionForm.patchValue({
            pregnantTime: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriBefore:
          this.preScreeningQuestionForm.patchValue({
            isMriBefore: data.Answers
          });
          this.changeMRI(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriProblem:
          this.preScreeningQuestionForm.patchValue({
            isMriExperience: data.Answers
          });
          this.changeMRIExperience(data.Answers);
          break;
        case PreScreeningMRIQuestion.TextMriProblem:
          this.preScreeningQuestionForm.patchValue({
            mriExperienceQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriClaustrophobic:
          this.preScreeningQuestionForm.patchValue({
            isClaustrophobic: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriMedicalCondition:
          this.preScreeningQuestionForm.patchValue({
            isMedicalCondition: data.Answers
          });
          this.changeMedicalCondition(data.Answers);
          break;
        case PreScreeningMRIQuestion.WhatMriCondition:
          this.preScreeningQuestionForm.patchValue({
            medicalConditionQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriHobbyJob:
          this.preScreeningQuestionForm.patchValue({
            isMetalWorked: data.Answers
          });
          this.changeMetalWorked(data.Answers);
          break;
        case PreScreeningMRIQuestion.AuthorizationXRAY:
          this.preScreeningQuestionForm.patchValue({
            isPerformedXRAY: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.EyesInjuries:
          this.preScreeningQuestionForm.patchValue({
            isEyeInjury: data.Answers
          });
          this.changeEyeInjury(data.Answers);
          break;
        case PreScreeningMRIQuestion.InjuryEyesAnswer:
          this.preScreeningQuestionForm.patchValue({
            eyeInjuryQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriPhysicalLimition:
          this.preScreeningQuestionForm.patchValue({
            isPhysicalLimitation: data.Answers
          });
          this.changePhysicalLimitation(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriTransfer:
          this.preScreeningQuestionForm.patchValue({
            isSelfTransferMriTable: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriMedicaldevices:
          this.preScreeningQuestionForm.patchValue({
            isMedicalDeviceOnBody: data.Answers
          });
          this.changeMedicalDeviceOnBody(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriManufacturerCard:
          this.preScreeningQuestionForm.patchValue({
            medicalDeviceOnBodyQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriForeignMetalObj:
          this.preScreeningQuestionForm.patchValue({
            isForeignMetalInjury: data.Answers
          });
          this.changeForeignMetalInjury(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriObjLocated:
          this.preScreeningQuestionForm.patchValue({
            foreignMetalInjuryQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriWig:
          this.preScreeningQuestionForm.patchValue({
            isWearWig: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriRemovableMetal:
          this.preScreeningQuestionForm.patchValue({
            isRemovableMetal: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriRecentTattoos:
          this.preScreeningQuestionForm.patchValue({
            isRecentTattoo: data.Answers
          });
          this.changeRecentTattoo(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriTattooSize:
          this.preScreeningQuestionForm.patchValue({
            recentTattooQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriAnkleMonitorDevice:
          this.preScreeningQuestionForm.patchValue({
            isAnkleMonitorDevice: data.Answers
          });
          this.changeAnkleMonitorDevice(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriProcedure:
          this.preScreeningQuestionForm.patchValue({
            isRemovableAnkleMonitorDevice: data.Answers
          });
          this.changeRemovableAnkleMonitorDevice(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriPOMeetFacility:
          this.preScreeningQuestionForm.patchValue({
            isRemovablWhileScan: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriSurgeries:
          this.preScreeningQuestionForm.patchValue({
            priorSurgeryQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriDiabetes:
          this.preScreeningQuestionForm.patchValue({
            isDiabetesHistory: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriCancer:
          this.preScreeningQuestionForm.patchValue({
            isCancerHistory: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriBloodPressure:
          this.preScreeningQuestionForm.patchValue({
            isHighBloodPressure: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriAllergiesMedications:
          this.preScreeningQuestionForm.patchValue({
            isAllergyReaction: data.Answers
          });
          this.changeAllergyReaction(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriAllergiesMedicationsDescriptions:
          this.preScreeningQuestionForm.patchValue({
            allergyReactionQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriKidneyProblem:
          this.preScreeningQuestionForm.patchValue({
            isKidneyProblem: data.Answers
          });
          break;
        case PreScreeningUSQuestion.Allergy:
          this.preScreeningQuestionForm.patchValue({
            isAllergy: data.Answers
          });
          this.changeAllergy(data.Answers);
          break;
        case PreScreeningUSQuestion.AllergyDescription:
          this.preScreeningQuestionForm.patchValue({
            allergyDescription: data.Answers
          });
          break;
        case PreScreeningCTQuestion.RecentXaryOrCt:
          this.preScreeningQuestionForm.patchValue({
            isRecentXray: data.Answers
          });
          this.changeRecentXray(data.Answers);
          break;
        case PreScreeningCTQuestion.XrayWhichBodyPart:
          this.preScreeningQuestionForm.patchValue({
            xrayCTDescription: data.Answers
          });
          break;
        case PreScreeningCTQuestion.HaveCancer:
          this.preScreeningQuestionForm.patchValue({
            isCancerHistoryCT: data.Answers
          });
          this.changeCancerHistory(data.Answers);
          break;
        case PreScreeningCTQuestion.RecentRediation:
          this.preScreeningQuestionForm.patchValue({
            radiationTreatment: data.Answers
          });
          break;
      }
    });
  }

  changePregnant(val) {
    const pregnantTimeControl = this.preScreeningQuestionForm.get('pregnantTime');
    if (val === 'Yes') {
      pregnantTimeControl.setValidators([Validators.required]);
    }
    else {
      pregnantTimeControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        pregnantTime: ''
      });
    }
    pregnantTimeControl.updateValueAndValidity();
  }

  changeMRI(val) {
    const isMriExperienceControl = this.preScreeningQuestionForm.get('isMriExperience');
    const mriExperienceQuestionControl = this.preScreeningQuestionForm.get('mriExperienceQuestion');
    if (val === 'Yes') {
      isMriExperienceControl.setValidators([Validators.required]);
    }
    else {
      isMriExperienceControl.setValidators(null);
      mriExperienceQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        isMriExperience: '',
        mriExperienceQuestion: ''
      });
    }
    isMriExperienceControl.updateValueAndValidity();
    mriExperienceQuestionControl.updateValueAndValidity();
  }

  changeMRIExperience(val) {
    const mriExperienceQuestionControl = this.preScreeningQuestionForm.get('mriExperienceQuestion');
    if (val === 'Yes') {
      mriExperienceQuestionControl.setValidators([Validators.required]);
    }
    else {
      mriExperienceQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        mriExperienceQuestion: ''
      });
    }
    mriExperienceQuestionControl.updateValueAndValidity();
  }

  changeMedicalCondition(val) {
    const medicalConditionQuestionControl = this.preScreeningQuestionForm.get('medicalConditionQuestion');
    if (val === 'Yes') {
      medicalConditionQuestionControl.setValidators([Validators.required]);
    }
    else {
      medicalConditionQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        medicalConditionQuestion: ''
      });
    }
    medicalConditionQuestionControl.updateValueAndValidity();
  }

  changeMetalWorked(val) {
    const isPerformedXRAYControl = this.preScreeningQuestionForm.get('isPerformedXRAY');
    if (val === 'Yes') {
      isPerformedXRAYControl.setValidators([Validators.required]);
    }
    else {
      isPerformedXRAYControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        isPerformedXRAY: ''
      });
    }
    isPerformedXRAYControl.updateValueAndValidity();
  }

  changeEyeInjury(val) {
    const eyeInjuryQuestionControl = this.preScreeningQuestionForm.get('eyeInjuryQuestion');
    if (val === 'Yes') {
      eyeInjuryQuestionControl.setValidators([Validators.required]);
    }
    else {
      eyeInjuryQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        eyeInjuryQuestion: ''
      });
    }
    eyeInjuryQuestionControl.updateValueAndValidity();
  }

  changePhysicalLimitation(val) {
    const isSelfTransferMriTableControl = this.preScreeningQuestionForm.get('isSelfTransferMriTable');
    if (val === 'Yes') {
      isSelfTransferMriTableControl.setValidators([Validators.required]);
    }
    else {
      isSelfTransferMriTableControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        isSelfTransferMriTable: ''
      });
    }
    isSelfTransferMriTableControl.updateValueAndValidity();
  }

  changeMedicalDeviceOnBody(val) {
    const medicalDeviceOnBodyQuestionControl = this.preScreeningQuestionForm.get('medicalDeviceOnBodyQuestion');
    if (val === 'Yes') {
      medicalDeviceOnBodyQuestionControl.setValidators([Validators.required]);
    }
    else {
      medicalDeviceOnBodyQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        medicalDeviceOnBodyQuestion: ''
      });
    }
    medicalDeviceOnBodyQuestionControl.updateValueAndValidity();
  }

  changeForeignMetalInjury(val) {
    const foreignMetalInjuryQuestionControl = this.preScreeningQuestionForm.get('foreignMetalInjuryQuestion');
    if (val === 'Yes') {
      foreignMetalInjuryQuestionControl.setValidators([Validators.required]);
    }
    else {
      foreignMetalInjuryQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        foreignMetalInjuryQuestion: ''
      });
    }
    foreignMetalInjuryQuestionControl.updateValueAndValidity();
  }

  changeRecentTattoo(val) {
    const recentTattooQuestionControl = this.preScreeningQuestionForm.get('recentTattooQuestion');
    if (val === 'Yes') {
      recentTattooQuestionControl.setValidators([Validators.required]);
    }
    else {
      recentTattooQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        recentTattooQuestion: ''
      });
    }
    recentTattooQuestionControl.updateValueAndValidity();
  }

  changeAnkleMonitorDevice(val) {
    const isRemovableAnkleMonitorDeviceControl = this.preScreeningQuestionForm.get('isRemovableAnkleMonitorDevice');
    if (val === 'Yes') {
      isRemovableAnkleMonitorDeviceControl.setValidators([Validators.required]);
    }
    else {
      isRemovableAnkleMonitorDeviceControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        isRemovableAnkleMonitorDevice: '',
        isRemovablWhileScan: ''
      });
    }
    isRemovableAnkleMonitorDeviceControl.updateValueAndValidity();
  }

  changeRemovableAnkleMonitorDevice(val) {
    const isRemovablWhileScanControl = this.preScreeningQuestionForm.get('isRemovablWhileScan');
    if (val === 'N') {
      isRemovablWhileScanControl.setValidators([Validators.required]);
    }
    else {
      isRemovablWhileScanControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        isRemovablWhileScan: ''
      });
    }
    isRemovablWhileScanControl.updateValueAndValidity();
  }

  changeAllergy(val) {
    const allergyDescriptionControl = this.preScreeningQuestionForm.get('allergyDescription');
    if (val === 'Yes') {
      allergyDescriptionControl.setValidators([Validators.required]);
    }
    else {
      allergyDescriptionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        allergyDescription: ''
      });
    }
    allergyDescriptionControl.updateValueAndValidity();
  }

  changeRecentXray(val) {
    const xrayCTDescriptionControl = this.preScreeningQuestionForm.get('xrayCTDescription');
    if (val === 'Yes') {
      xrayCTDescriptionControl.setValidators([Validators.required]);
    }
    else {
      xrayCTDescriptionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        xrayCTDescription: ''
      });
    }
    xrayCTDescriptionControl.updateValueAndValidity();
  }

  changeCancerHistory(val) {
    const radiationTreatmentControl = this.preScreeningQuestionForm.get('radiationTreatment');
    if (val === 'Yes') {
      radiationTreatmentControl.setValidators([Validators.required]);
    }
    else {
      radiationTreatmentControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        radiationTreatment: ''
      });
    }
    radiationTreatmentControl.updateValueAndValidity();
  }

  changeAllergyReaction(val) {
    const allergyReactionQuestionControl = this.preScreeningQuestionForm.get('allergyReactionQuestion');
    if (val === 'Yes') {
      allergyReactionQuestionControl.setValidators([Validators.required]);
    }
    else {
      allergyReactionQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        allergyReactionQuestion: ''
      });
    }
    allergyReactionQuestionControl.updateValueAndValidity();
  }

  onChangePregnantTime() {
    let time = this.psqForm.pregnantTime.value
    if (!time)
      this.pregnantMessage = null;
    else if (parseInt(time.replace(' Week', '')) < 16)
      this.pregnantMessage = 'In order to proceed with your procedure we need an authorization letter from your OB doctor giving Precise Imaging approval to proceed with the procedure.'
    else
      this.pregnantMessage = 'When you arrive you will need to sign a waiver form'
  }

  setPrescreeningQuestionFormValidation() {

    //this.changePhysicalLimitation(data.Answers);
    //      M R I    ( C O M M O N)
    const formControl1 = this.preScreeningQuestionForm.get('isMriBefore');
    const formControl2 = this.preScreeningQuestionForm.get('isClaustrophobic');
    const formControl3 = this.preScreeningQuestionForm.get('isMedicalCondition');
    const formControl4 = this.preScreeningQuestionForm.get('isMetalWorked');
    const formControl5 = this.preScreeningQuestionForm.get('isEyeInjury');
    const formControl6 = this.preScreeningQuestionForm.get('isPhysicalLimitation');
    const formControl7 = this.preScreeningQuestionForm.get('isSelfTransferMriTable');
    const formControl8 = this.preScreeningQuestionForm.get('isMedicalDeviceOnBody');
    const formControl9 = this.preScreeningQuestionForm.get('isForeignMetalInjury');
    const formControl10 = this.preScreeningQuestionForm.get('isWearWig');
    const formControl11 = this.preScreeningQuestionForm.get('isRemovableMetal');
    const formControl12 = this.preScreeningQuestionForm.get('isRecentTattoo');
    const formControl13 = this.preScreeningQuestionForm.get('isAnkleMonitorDevice');
    const formControl14 = this.preScreeningQuestionForm.get('priorSurgeryQuestion');

    //    M R I   ( W I T H   C O N T R A S T)
    const formControl15 = this.preScreeningQuestionForm.get('isDiabetesHistory');
    const formControl16 = this.preScreeningQuestionForm.get('isCancerHistory');
    const formControl17 = this.preScreeningQuestionForm.get('isHighBloodPressure');
    const formControl18 = this.preScreeningQuestionForm.get('isAllergyReaction');
    const formControl19 = this.preScreeningQuestionForm.get('isKidneyProblem');

    //    C T  or  X R A Y
    const formControl20 = this.preScreeningQuestionForm.get('isRecentXray');
    const formControl21 = this.preScreeningQuestionForm.get('isCancerHistoryCT');

    //    U S
    const formControl22 = this.preScreeningQuestionForm.get('isAllergy');

    formControl1.clearValidators();
    formControl2.clearValidators();
    formControl3.clearValidators();
    formControl4.clearValidators();
    formControl5.clearValidators();
    formControl6.clearValidators();
    formControl7.clearValidators();
    formControl8.clearValidators();
    formControl9.clearValidators();
    formControl10.clearValidators();
    formControl11.clearValidators();
    formControl12.clearValidators();
    formControl13.clearValidators();
    formControl14.clearValidators();
    formControl15.clearValidators();
    formControl16.clearValidators();
    formControl17.clearValidators();
    formControl18.clearValidators();
    formControl19.clearValidators();
    formControl20.clearValidators();
    formControl21.clearValidators();
    formControl22.clearValidators();

    if (this.isMR) {
      formControl1.setValidators([Validators.required]);
      formControl2.setValidators([Validators.required]);
      formControl3.setValidators([Validators.required]);
      formControl4.setValidators([Validators.required]);
      formControl5.setValidators([Validators.required]);
      formControl6.setValidators([Validators.required]);
      formControl7.setValidators([Validators.required]);
      formControl8.setValidators([Validators.required]);
      formControl9.setValidators([Validators.required]);
      formControl10.setValidators([Validators.required]);
      formControl11.setValidators([Validators.required]);
      formControl12.setValidators([Validators.required]);
      formControl13.setValidators([Validators.required]);
      formControl14.setValidators([Validators.required]);
    }
    if (this.isMRWC) {
      formControl15.setValidators([Validators.required]);
      formControl16.setValidators([Validators.required]);
      formControl17.setValidators([Validators.required]);
      formControl18.setValidators([Validators.required]);
      formControl19.setValidators([Validators.required]);
    }
    if (this.isCT) {
      formControl20.setValidators([Validators.required]);
      formControl21.setValidators([Validators.required]);
    }
    if (this.isUS) {
      formControl22.setValidators([Validators.required]);
    }

    formControl1.updateValueAndValidity();
    formControl2.updateValueAndValidity();
    formControl3.updateValueAndValidity();
    formControl4.updateValueAndValidity();
    formControl5.updateValueAndValidity();
    formControl6.updateValueAndValidity();
    formControl7.updateValueAndValidity();
    formControl8.updateValueAndValidity();
    formControl9.updateValueAndValidity();
    formControl10.updateValueAndValidity();
    formControl11.updateValueAndValidity();
    formControl12.updateValueAndValidity();
    formControl13.updateValueAndValidity();
    formControl14.updateValueAndValidity();
    formControl15.updateValueAndValidity();
    formControl16.updateValueAndValidity();
    formControl17.updateValueAndValidity();
    formControl18.updateValueAndValidity();
    formControl19.updateValueAndValidity();
    formControl20.updateValueAndValidity();
    formControl21.updateValueAndValidity();
    formControl22.updateValueAndValidity();
  }

  createQuestionAnswerJsonObject(question, answer) {
    this.preScreeningQuestionAnswerData.push({ "Question": question, "Answer": answer });
  }

  savePreScreeningQuestionData(isSubmitAndSave: boolean) {
    this.preScreeningQuestionAnswerData = [];
    this.preScreeningQuestionData.patientStudyData.forEach((element, index) => {

      var studyDescription = element.STUDYDESCRIPTION.toLowerCase();
      this.psqForm.gender.value ? this.createQuestionAnswerJsonObject(PreScreeningGeneralQuestion.Gender, this.psqForm.gender.value) : null;
      if (this.psqForm.gender.value == "F") {
        this.psqForm.isPregnant.value ? this.createQuestionAnswerJsonObject(PreScreeningGeneralQuestion.Pregnant, this.psqForm.isPregnant.value) : null;
        if (this.psqForm.isPregnant.value == "Yes") {
          this.psqForm.pregnantTime.value ? this.createQuestionAnswerJsonObject(PreScreeningGeneralQuestion.PregnantTime, this.psqForm.pregnantTime.value) : null;
        }
      }
      this.psqForm.weight.value ? this.createQuestionAnswerJsonObject(PreScreeningGeneralQuestion.Weight, this.psqForm.weight.value) : null;
      this.psqForm.heightFoot.value ? this.createQuestionAnswerJsonObject(PreScreeningGeneralQuestion.Height, this.psqForm.heightFoot.value + " " + this.psqForm.heightInch.value) : null;
      this.psqForm.isMriBefore.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriBefore, this.psqForm.isMriBefore.value) : null;
      if (this.psqForm.isMriBefore.value == "Yes") {
        this.psqForm.isMriExperience.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriProblem, this.psqForm.isMriExperience.value) : null;
        if (this.psqForm.isMriExperience.value == "Yes")
          this.psqForm.mriExperienceQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.TextMriProblem, this.psqForm.mriExperienceQuestion.value) : null;
      }

      this.psqForm.isClaustrophobic.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriClaustrophobic, this.psqForm.isClaustrophobic.value) : null;
      this.psqForm.isMedicalCondition.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriMedicalCondition, this.psqForm.isMedicalCondition.value) : null;
      if (this.psqForm.isMedicalCondition.value == "Yes") {
        this.psqForm.medicalConditionQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.WhatMriCondition, this.psqForm.medicalConditionQuestion.value) : null;
      }
      this.psqForm.isMetalWorked.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriHobbyJob, this.psqForm.isMetalWorked.value) : null;
      if (this.psqForm.isMetalWorked.value == "Yes") {
        this.psqForm.isPerformedXRAY.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.AuthorizationXRAY, this.psqForm.isPerformedXRAY.value) : null;
      }
      this.psqForm.isEyeInjury.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.EyesInjuries, this.psqForm.isEyeInjury.value) : null;

      if (this.psqForm.isEyeInjury.value == "Yes") {
        this.psqForm.eyeInjuryQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.InjuryEyesAnswer, this.psqForm.eyeInjuryQuestion.value) : null;
      }
      this.psqForm.isPhysicalLimitation.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriPhysicalLimition, this.psqForm.isPhysicalLimitation.value) : null;

      if (this.psqForm.isPhysicalLimitation.value == "Yes") {
        this.psqForm.isSelfTransferMriTable.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriTransfer, this.psqForm.isSelfTransferMriTable.value) : null;
      }
      this.psqForm.isMedicalDeviceOnBody.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriMedicaldevices, this.psqForm.isMedicalDeviceOnBody.value) : null;
      if (this.psqForm.isMedicalDeviceOnBody.value == "Yes") {
        this.psqForm.medicalDeviceOnBodyQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriManufacturerCard, this.psqForm.medicalDeviceOnBodyQuestion.value) : null;
      }
      this.psqForm.isForeignMetalInjury.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriForeignMetalObj, this.psqForm.isForeignMetalInjury.value) : null;
      if (this.psqForm.isForeignMetalInjury.value == "Yes") {
        this.psqForm.foreignMetalInjuryQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriObjLocated, this.psqForm.foreignMetalInjuryQuestion.value) : null;
      }
      this.psqForm.isWearWig.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriWig, this.psqForm.isWearWig.value) : null;

      this.psqForm.isRemovableMetal.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriRemovableMetal, this.psqForm.isRemovableMetal.value) : null;

      this.psqForm.isRecentTattoo.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriRecentTattoos, this.psqForm.isRecentTattoo.value) : null;
      if (this.psqForm.isRecentTattoo.value == "Yes") {
        this.psqForm.recentTattooQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriTattooSize, this.psqForm.recentTattooQuestion.value) : null;
      }
      this.psqForm.isAnkleMonitorDevice.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriAnkleMonitorDevice, this.psqForm.isAnkleMonitorDevice.value) : null;

      if (this.psqForm.isAnkleMonitorDevice.value == "Yes") {
        this.psqForm.isRemovableAnkleMonitorDevice.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriProcedure, this.psqForm.isRemovableAnkleMonitorDevice.value) : null;

        if (this.psqForm.isRemovableAnkleMonitorDevice.value == "No") {
          this.psqForm.isRemovablWhileScan.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriPOMeetFacility, this.psqForm.isRemovablWhileScan.value) : null;
        }
      }
      this.psqForm.priorSurgeryQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriSurgeries, this.psqForm.priorSurgeryQuestion.value) : null;
      this.psqForm.isDiabetesHistory.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriDiabetes, this.psqForm.isDiabetesHistory.value) : null;
      this.psqForm.isCancerHistory.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriCancer, this.psqForm.isCancerHistory.value) : null;
      this.psqForm.isHighBloodPressure.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriBloodPressure, this.psqForm.isHighBloodPressure.value) : null;

      this.psqForm.isAllergyReaction.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriAllergiesMedications, this.psqForm.isAllergyReaction.value) : null;
      if (this.psqForm.isAllergyReaction.value == "Yes") {
        //Please check
        this.psqForm.allergyReactionQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningUSQuestion.AllergyDescription, this.psqForm.allergyReactionQuestion.value) : null;
      }
      this.psqForm.isKidneyProblem.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriKidneyProblem, this.psqForm.isKidneyProblem.value) : null;
      switch (element.MODALITY) {
        case "MR":
          this.modality = "MR"
          if (((studyDescription.includes("mri") || studyDescription.includes("mr"))
            && (!studyDescription.includes("w/o & w/contrast")
              && (!studyDescription.includes("w/ & w/o ")
                && (!studyDescription.includes("w/ contrast")
                  && !studyDescription.includes("w/contrast")))))) {
          }
          if (((studyDescription.includes("mri") || studyDescription.includes("mr"))
            && (studyDescription.includes("w/contrast")
              || (studyDescription.includes("w/ contrast")
                || (studyDescription.includes("w/o & w/contrast")
                  || studyDescription.includes("w/ & w/o ")))))) {
          }
          break;
        case "CR":
        case "DX":
        case "X-RAY":
        case "CT":
          this.modality = "CT"
          this.psqForm.isRecentXray.value ? this.createQuestionAnswerJsonObject(PreScreeningCTQuestion.RecentXaryOrCt, this.psqForm.isRecentXray.value) : null;
          if (this.psqForm.isRecentXray.value == "Yes") {
            this.psqForm.xrayCTDescription.value ? this.createQuestionAnswerJsonObject(PreScreeningCTQuestion.XrayWhichBodyPart, this.psqForm.xrayCTDescription.value) : null;
          }
          this.psqForm.isCancerHistoryCT.value ? this.createQuestionAnswerJsonObject(PreScreeningCTQuestion.HaveCancer, this.psqForm.isCancerHistoryCT.value) : null;
          if (this.psqForm.isCancerHistoryCT.value == "Yes") {
            this.psqForm.radiationTreatment.value ? this.createQuestionAnswerJsonObject(PreScreeningCTQuestion.RecentRediation, this.psqForm.radiationTreatment.value) : null;
          }
        case "RG":
        case "PT":

          break;
        case "US":
          this.psqForm.isAllergy.value ? this.createQuestionAnswerJsonObject(PreScreeningUSQuestion.Allergy, this.psqForm.isAllergy.value) : null;
          if (this.psqForm.isAllergy.value == "Yes") {
            this.psqForm.allergyDescription.value ? this.createQuestionAnswerJsonObject(PreScreeningUSQuestion.AllergyDescription, this.psqForm.allergyDescription.value) : null;
          }
          break;
      }
    });

    let StudyDetailJson = [{ INTERNALSTUDYID: this.internalStudyId, MODALITY: this.modality }]
    let PatientDetailJson = [{
      FirstName: this.preScreeningQuestionData.patientData.FirstName, LastName: this.preScreeningQuestionData.patientData.LastName, PatientDOB: this.preScreeningQuestionData.patientData.DOB,
      StudyDescription: this.mrStudyDescription, isMR: this.isMR, isMRWC: this.isMRWC, isCT: this.isCT, isUS: this.isUS
    }]
    var data = {
      "QuestionAnswerJson": JSON.stringify(this.preScreeningQuestionAnswerData),
      "StudyDetailJson": JSON.stringify(StudyDetailJson),
      "PatientId": this.patientId,
      "SchedulingPreScreeningComplete": isSubmitAndSave,
      "PatientDetailJson": JSON.stringify(PatientDetailJson)
    };
    if (isSubmitAndSave) {
      this.workflowService.savePreScreeningQuestionData(data, true).subscribe((res) => {
        if (res) {
          this.notificationService.showNotification({
            alertHeader: res.responseCode == ResponseStatusCode.OK ? 'Success' : 'Error',
            alertMessage: res.message,
            alertType: res.responseCode
          });
          // var file = res.description.split(",,", 2);
          this.downloadFile(res.description, 'txt.pdf');
          this.closePopup();
          this.onSearchSubmit();
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
    else {
      this.workflowService.SaveAndDontSubmitPreScreeningQuestionData(data, true).subscribe((res) => {
        if (res) {
          this.notificationService.showNotification({
            alertHeader: res.responseCode == ResponseStatusCode.OK ? 'Success' : 'Error',
            alertMessage: res.message,
            alertType: res.responseCode
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
  }

  onSearchSubmit() {
    this.selectedRows = [];
    this.pageNumber = 1;
  }

  downloadFile(fileData, fileName) {;
    let ArrayBuff = this._base64ToArrayBuffer(fileData);
    let file = new Blob([ArrayBuff], { type: 'application/pdf' });
    fileData = URL.createObjectURL(file)
    // FileSaver.saveAs(fileData, fileName);
    //window.open(fileData, '_blank');
  }

  showDocManager(patientId: any) {
    this.commonMethodService.sendDataToDocumentManager(patientId);
    this.isRxDocumentVerify = true;
  }

  cancelAndClose() {
    this.preScreeningQuestionForm.reset();
    this.preScreeningQuestionSubmitted = false;
    this.closePopup()
  }

  saveAndSubmit() {
    console.log(this.preScreeningQuestionForm.errors);

    this.preScreeningQuestionSubmitted = true;
    this.preScreeningQuestionModal = "modal";
    if (this.preScreeningQuestionForm.invalid) {
      this.preScreeningQuestionModal = "";
      return;
    }
    this.savePreScreeningQuestionData(true);
    //this.showDocManager(this.preScreeningQuestionData.patientData.PatientId)
    //alert('Form valid');
  }

  saveAndDoNotSubmit() {
    this.preScreeningQuestionSubmitted = false;
    this.preScreeningQuestionModal = "modal";
    // if (this.preScreeningQuestionForm.invalid) {
    //   this.preScreeningQuestionModal = "";
    //   return;
    // }
    this.preScreeningQuestionData.patientStudyData.forEach(element => console.log(element));
    this.savePreScreeningQuestionData(false);
  }


  _base64ToArrayBuffer(base64: any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  closePopup() {

    this.isPrescreeningQuestion = false;
    this.preScreeningQuestionSubmitted = false;
    if(!this.patientIdExist){
      this.clearNoPatient();
    }
  }
  closePopupPrescrenning() {
    this.isPrescreeningQuestion = false;
    this.preScreeningQuestionSubmitted = false; 
  }
     

  get psqForm() { return this.preScreeningQuestionForm.controls; }
  get noExistForm() { return this.noExistPatientForm.controls; }
}
