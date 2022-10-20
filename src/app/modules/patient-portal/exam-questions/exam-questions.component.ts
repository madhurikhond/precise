import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PatientExamQuestionForMriWithContrast, PatientExamQuestionForMriWithoutContrast } from 'src/app/models/pre-screeing-question';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { PatientPortalScreeningStatusCode, PatientPortalStatusCode } from 'src/app/constants/patient-portal-status-code.enum';
import { TranslateService } from '@ngx-translate/core';
import { patientPortalResponseStatus } from 'src/app/models/patient-response';
import { StorageService } from 'src/app/services/common/storage.service';

@Component({
  selector: 'app-exam-questions',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.css'],
})
export class ExamQuestionsComponent implements OnInit {
  expanded: boolean = false;
  isWithContrast: boolean = false;
  examQuestionForm: FormGroup;
  btnText: boolean = false;
  examQuestionForMRIwithoutContrast: PatientExamQuestionForMriWithoutContrast;
  examQuestionForMRIwithContrast: PatientExamQuestionForMriWithContrast;

  constructor(
    public translate: TranslateService,
    public storageService: StorageService,
    private readonly router: Router,
    private fb: FormBuilder,
    private readonly patientPortalService: PatientPortalService
  ) {

    if (!this.storageService.PatientPreScreening || !this.storageService.PatientStudy) {
      this.examQuestionForMRIwithContrast = this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast;
      this.examQuestionForMRIwithoutContrast = this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast;
    }

    this.examQuestionForMRIwithoutContrast =
      this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast;
    if (!this.examQuestionForMRIwithoutContrast) {
      this.examQuestionForMRIwithoutContrast = new PatientExamQuestionForMriWithoutContrast();
      this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast = this.examQuestionForMRIwithoutContrast;
    }

    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast)
      this.examQuestionForMRIwithContrast =
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast;
    else
      this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast =
        this.examQuestionForMRIwithContrast;

    if (!this.examQuestionForMRIwithContrast) {
      this.examQuestionForMRIwithContrast = new PatientExamQuestionForMriWithContrast();
      this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast = this.examQuestionForMRIwithContrast;
    }


    this.examQuestionForm = this.fb.group({
      textMriProblem: [''],
      whatMriCondition: [''],
      injuryeyesanswer: [''],
      mriManufacturerCard: [''],
      mriObjLocated: [''],
      mritattoosize: [''],
      priorSurgeryQuestion: ['', Validators.required],
      allergydescriptionwithmricontrast: [''],
    });
    if (
      this.patientPortalService.questionScreenTypes.indexOf(
        PatientPortalScreeningStatusCode.MRI_WITH_CONTRAST
      ) > -1
    )
      this.isWithContrast = true;
  }

  ngOnInit(): void {
    if (
      this.patientPortalService.questionScreenTypes.indexOf(
        PatientPortalScreeningStatusCode.CT
      ) > -1 ||
      this.patientPortalService.questionScreenTypes.indexOf(
        PatientPortalScreeningStatusCode.CR
      ) > -1
    )
      this.btnText = true;
    else if (this.patientPortalService.questionScreenTypes.indexOf(PatientPortalScreeningStatusCode.US) > -1)
      this.btnText = true;
    if (this.examQuestionForMRIwithoutContrast) {
      if (this.examQuestionForMRIwithoutContrast.mriBefore === 'Yes' && (this.examQuestionForMRIwithoutContrast.mriProblem === '' || this.examQuestionForMRIwithoutContrast.mriProblem === null)) {
        this.examQuestionForm.setErrors({ 'invalid': true });
      }
      if (this.examQuestionForMRIwithoutContrast.mriHobbyJob === 'Yes' && (this.examQuestionForMRIwithoutContrast.authorizationXray === '' || this.examQuestionForMRIwithoutContrast.authorizationXray === null)) {
        this.examQuestionForm.setErrors({ 'invalid': true });
      }
      if (this.examQuestionForMRIwithoutContrast.mriPhysicalLimition === 'Yes' && (this.examQuestionForMRIwithoutContrast.mriTransfer === '' || this.examQuestionForMRIwithoutContrast.mriTransfer === null)) {
        this.examQuestionForm.setErrors({ 'invalid': true });
      }
      if (this.examQuestionForMRIwithoutContrast.mriAnkleMonitorDevice === 'Yes' && (this.examQuestionForMRIwithoutContrast.mriProcedure === '' || this.examQuestionForMRIwithoutContrast.mriProcedure === null)) {
        this.examQuestionForm.setErrors({ 'invalid': true });
      }
      if (this.examQuestionForMRIwithoutContrast.mriProcedure === 'No' && (this.examQuestionForMRIwithoutContrast.mriPoMeetFacility === '' || this.examQuestionForMRIwithoutContrast.mriPoMeetFacility === null)) {
        this.examQuestionForm.setErrors({ 'invalid': true });
      }


      if (this.examQuestionForMRIwithoutContrast.mriProblem === 'Yes') {
        this.examQuestionForm.controls['textMriProblem'].setValidators(
          Validators.required
        );
        if (this.examQuestionForMRIwithoutContrast.textMriProblem) {
          this.examQuestionForm.controls['textMriProblem'].setValue(
            this.examQuestionForMRIwithoutContrast.textMriProblem
          );
        } else {
          this.examQuestionForm.controls['textMriProblem'].setValue('');
        }
      } else {
        this.examQuestionForm.controls['textMriProblem'].clearValidators();
      }

      if (this.examQuestionForMRIwithoutContrast.mriMedicalCondition === 'Yes') {
        this.examQuestionForm.controls['whatMriCondition'].setValidators(
          Validators.required
        );
        if (this.examQuestionForMRIwithoutContrast.whatMriCondition) {
          this.examQuestionForm.controls['whatMriCondition'].setValue(
            this.examQuestionForMRIwithoutContrast.whatMriCondition
          );
        } else {
          this.examQuestionForm.controls['whatMriCondition'].setValue('');
        }
      } else {
        this.examQuestionForm.controls['whatMriCondition'].clearValidators();
      }

      if (this.examQuestionForMRIwithoutContrast.eyesInjuries === 'Yes') {
        this.examQuestionForm.controls['injuryeyesanswer'].setValidators(
          Validators.required
        );
        if (this.examQuestionForMRIwithoutContrast.eyesInjuriesReason) {
          this.examQuestionForm.controls['injuryeyesanswer'].setValue(
            this.examQuestionForMRIwithoutContrast.eyesInjuriesReason
          );
        } else {
          this.examQuestionForm.controls['injuryeyesanswer'].setValue('');
        }
      } else {
        this.examQuestionForm.controls['injuryeyesanswer'].clearValidators();
      }

      if (this.examQuestionForMRIwithoutContrast.mriMedicaldevices === 'Yes') {
        this.examQuestionForm.controls['mriManufacturerCard'].setValidators(
          Validators.required
        );
        if (this.examQuestionForMRIwithoutContrast.mriManufacturerCard) {
          this.examQuestionForm.controls['mriManufacturerCard'].setValue(
            this.examQuestionForMRIwithoutContrast.mriManufacturerCard
          );
        } else {
          this.examQuestionForm.controls['mriManufacturerCard'].setValue('');
        }
      } else {
        this.examQuestionForm.controls['mriManufacturerCard'].clearValidators();
      }

      if (this.examQuestionForMRIwithoutContrast.mriForeignMetalObj === 'Yes') {
        this.examQuestionForm.controls['mriObjLocated'].setValidators(
          Validators.required
        );
        if (this.examQuestionForMRIwithoutContrast.mriObjLocated) {
          this.examQuestionForm.controls['mriObjLocated'].setValue(
            this.examQuestionForMRIwithoutContrast.mriObjLocated
          );
        } else {
          this.examQuestionForm.controls['mriObjLocated'].setValue('');
        }
      } else {
        this.examQuestionForm.controls['mriObjLocated'].clearValidators();
      }

      if (this.examQuestionForMRIwithoutContrast.isRecentTattoo === 'Yes') {
        this.examQuestionForm.controls['mritattoosize'].setValidators(
          Validators.required
        );
        if (this.examQuestionForMRIwithoutContrast.mriTattooSize) {
          this.examQuestionForm.controls['mritattoosize'].setValue(this.examQuestionForMRIwithoutContrast.mriTattooSize);
        } else {
          this.examQuestionForm.controls['mritattoosize'].setValue('');
        }
      } else {
        this.examQuestionForm.controls['mritattoosize'].clearValidators();
      }

      if (this.examQuestionForMRIwithoutContrast.priorSurgeryQuestion) {
        this.examQuestionForm.controls['priorSurgeryQuestion'].setValue(this.examQuestionForMRIwithoutContrast.priorSurgeryQuestion);
      } else {
        this.examQuestionForm.controls['priorSurgeryQuestion'].setValue('');
      }

      if (this.examQuestionForMRIwithContrast) {
        if (this.examQuestionForMRIwithContrast.isDiabetesHistory === '') {
          this.examQuestionForm.setErrors({ 'invalid': true });
        }
        if (this.examQuestionForMRIwithContrast.isCancerHistory === '') {
          this.examQuestionForm.setErrors({ 'invalid': true });
        }
        if (this.examQuestionForMRIwithContrast.isHighBloodPressure === '') {
          this.examQuestionForm.setErrors({ 'invalid': true });
        }

        if (this.examQuestionForMRIwithContrast.mriAllergiesMedications === 'Yes') {
          this.examQuestionForm.controls['allergydescriptionwithmricontrast'].setValidators(Validators.required);
          if (this.examQuestionForMRIwithContrast.allergyReactionQuestion) {
            this.examQuestionForm.controls['allergydescriptionwithmricontrast'].setValue(this.examQuestionForMRIwithContrast.allergyReactionQuestion);
          } else {
            this.examQuestionForm.controls['allergydescriptionwithmricontrast'].setValue('');
          }
        } else {
          this.examQuestionForm.controls['allergydescriptionwithmricontrast'].clearValidators();
        }

        if (this.examQuestionForMRIwithContrast.isKidneyProblem === '') {
          this.examQuestionForm.setErrors({ 'invalid': true });
        }
      }
    }
  }

  onSubmit() {
    if (this.examQuestionForm.valid) {
      this.storageService.PatientPreScreening = 'true';
      this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.textMriProblem =
        this.examQuestionForm.controls['textMriProblem'].value;
      this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.whatMriCondition =
        this.examQuestionForm.controls['whatMriCondition'].value;
      this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.eyesInjuriesReason =
        this.examQuestionForm.controls['injuryeyesanswer'].value;
      this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriManufacturerCard =
        this.examQuestionForm.controls['mriManufacturerCard'].value;
      this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriObjLocated =
        this.examQuestionForm.controls['mriObjLocated'].value;
      this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriTattooSize =
        this.examQuestionForm.controls['mritattoosize'].value;
      this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.priorSurgeryQuestion =
        this.examQuestionForm.controls['priorSurgeryQuestion'].value;

      var studyWithMRIContrast =
        this.patientPortalService.internalStudyIdDetails.filter(
          (x) =>
            x.scheduledModality ==
            PatientPortalScreeningStatusCode.MRI_WITH_CONTRAST
        );

      if (this.isWithContrast) {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast.allergyReactionQuestion =
          this.examQuestionForm.controls[
            'allergydescriptionwithmricontrast'
          ].value;
      }

      var studyWithoutMRIContrast =
        this.patientPortalService.internalStudyIdDetails.filter(
          (x) =>
            x.scheduledModality ==
            PatientPortalScreeningStatusCode.MRI_WITHOUT_CONTRAST
        );

      if (studyWithoutMRIContrast.length > 0) {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.studyId =
          studyWithoutMRIContrast[0].internalStudyId;
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.studyDescription =
          studyWithoutMRIContrast[0].studyDescription;
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.modalityName =
          studyWithoutMRIContrast[0].modality;
      } else if (studyWithMRIContrast.length > 0) {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.studyId =
          studyWithMRIContrast[0].internalStudyId;
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.studyDescription =
          studyWithMRIContrast[0].studyDescription;
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.modalityName =
          studyWithMRIContrast[0].modality;
      } else {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.studyId =
          this.patientPortalService.internalStudyIdDetails[0].internalStudyId;
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.studyDescription =
          this.patientPortalService.internalStudyIdDetails[0].studyDescription;
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.modalityName =
          this.patientPortalService.internalStudyIdDetails[0].modality;
      }
      this.patientPortalService.patientScreeningQuestion.pageCompleted =
        PatientPortalStatusCode.PATIENT_EXAM_QUESTIONS_SCREEN;
      this.storageService.PatientStudy = JSON.stringify(this.patientPortalService.patientScreeningQuestion);
      if (
        this.patientPortalService.questionScreenTypes.indexOf(
          PatientPortalScreeningStatusCode.CT
        ) > -1 ||
        this.patientPortalService.questionScreenTypes.indexOf(
          PatientPortalScreeningStatusCode.CR
        ) > -1
      ) {
        this.patientPortalService
          .AddPreScreeningQuestions(
            this.patientPortalService.patientScreeningQuestion
          )
          .subscribe((res) => {
            if (res) {
              if (res.responseStatus == patientPortalResponseStatus.Success) {
                this.router.navigate(['exam-question-for-ct-cr']);
              }
            }
          });
      } else if (
        this.patientPortalService.questionScreenTypes.indexOf(
          PatientPortalScreeningStatusCode.US
        ) > -1
      ) {
        this.patientPortalService
          .AddPreScreeningQuestions(
            this.patientPortalService.patientScreeningQuestion
          )
          .subscribe((res) => {
            if (res) {
              if (res.responseStatus == patientPortalResponseStatus.Success) {
                this.router.navigate(['exam-question-for-us']);
              }
            }
          });
      } else {
        this.patientPortalService.patientScreeningQuestion.isFinalSubmit = true;
        this.patientPortalService
          .AddPreScreeningQuestions(
            this.patientPortalService.patientScreeningQuestion
          )
          .subscribe((res) => {
            if (res) {
              this.patientPortalService.remainingStudyCount = 0;

              if (res.responseStatus == patientPortalResponseStatus.Success) {
                this.router.navigate(['patient-home']);
              }
            }
          });
      }
    }
  }

  goBack() {
    this.router.navigate(['pre-screening-question']);
  }

  CheckForMriWithoutContrast(condition: string, type: string) {
    if (condition === 'Yes') {
      if (type === 'MriBefore') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriBefore = condition;
        if (this.examQuestionForMRIwithoutContrast.mriProblem === '' || this.examQuestionForMRIwithoutContrast.mriProblem === null)
          this.examQuestionForm.setErrors({ 'invalid': true });
      }
      if (type === 'MriProblem') {
        this.examQuestionForm.controls['textMriProblem'].setValidators(
          Validators.required
        );
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriProblem =
          condition;
      }
      if (type === 'MriClaustrophobic') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriClaustrophobic =
          condition;
      }
      if (type === 'MriMedicalCondition') {
        this.examQuestionForm.controls['whatMriCondition'].setValidators(
          Validators.required
        );
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriMedicalCondition =
          condition;
      }
      if (type === 'MriHobbyJob') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriHobbyJob =
          condition;
        if (this.examQuestionForMRIwithoutContrast.authorizationXray === '' || this.examQuestionForMRIwithoutContrast.authorizationXray === null)
          this.examQuestionForm.setErrors({ 'invalid': true });
      }
      if (type === 'AuthorizationXray') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.authorizationXray =
          condition;
        this.examQuestionForm.setErrors(null);
      }
      if (type === 'EyesInjuries') {
        this.examQuestionForm.controls['injuryeyesanswer'].setValidators(
          Validators.required
        );
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.eyesInjuries =
          condition;
      }
      if (type === 'MriPhysicalLimition') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriPhysicalLimition =
          condition;
        if (this.examQuestionForMRIwithoutContrast.mriTransfer === '' || this.examQuestionForMRIwithoutContrast.mriTransfer === null)
          this.examQuestionForm.setErrors({ 'invalid': true });
      }
      if (type === 'MriTransfer') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriTransfer =
          condition;
      }
      if (type === 'MriMedicaldevices') {
        this.examQuestionForm.controls['mriManufacturerCard'].setValidators(
          Validators.required
        );
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriMedicaldevices =
          condition;
      }
      if (type === 'MriForeignMetalObj') {
        this.examQuestionForm.controls['mriObjLocated'].setValidators(
          Validators.required
        );
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriForeignMetalObj =
          condition;
      }
      if (type === 'MriWig') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriWig =
          condition;
      }
      if (type === 'MriRemovableMetal') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriRemovableMetal =
          condition;
      }
      if (type === 'IsRecentTattoo') {
        this.examQuestionForm.controls['mritattoosize'].setValidators(
          Validators.required
        );
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.isRecentTattoo =
          condition;
      }
      if (type === 'MriAnkleMonitorDevice') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriAnkleMonitorDevice =
          condition;
        if (this.examQuestionForMRIwithoutContrast.mriProcedure === '' || this.examQuestionForMRIwithoutContrast.mriProcedure === null)
          this.examQuestionForm.setErrors({ 'invalid': true });
      }
      if (type === 'MriProcedure') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriProcedure =
          condition;
      }
      if (type === 'MriPoMeetFacility') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriPoMeetFacility =
          condition;
      }
    } else {
      if (type === 'MriBefore') {
        this.examQuestionForm.controls['textMriProblem'].clearValidators();
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriProblem =
          null;
        this.examQuestionForm.controls['textMriProblem'].setValue('');
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriBefore =
          condition;
      }
      if (type === 'MriProblem') {
        this.examQuestionForm.controls['textMriProblem'].clearValidators();
        this.examQuestionForm.controls['textMriProblem'].setValue('');
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriProblem =
          condition;
      }
      if (type === 'MriClaustrophobic') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriClaustrophobic =
          condition;
      }
      if (type === 'MriMedicalCondition') {
        this.examQuestionForm.controls['whatMriCondition'].clearValidators();
        this.examQuestionForm.controls['whatMriCondition'].setValue('');
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriMedicalCondition =
          condition;
      }
      if (type === 'MriHobbyJob') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.authorizationXray =
          null;
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriHobbyJob =
          condition;
      }
      if (type === 'AuthorizationXray') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.authorizationXray =
          condition;
        this.examQuestionForm.setErrors(null);
      }
      if (type === 'EyesInjuries') {
        this.examQuestionForm.controls['injuryeyesanswer'].clearValidators();
        this.examQuestionForm.controls['injuryeyesanswer'].setValue('');
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.eyesInjuries =
          condition;
      }
      if (type === 'MriPhysicalLimition') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriTransfer =
          null;
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriPhysicalLimition =
          condition;
      }
      if (type === 'MriTransfer') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriTransfer =
          condition;
      }
      if (type === 'MriMedicaldevices') {
        this.examQuestionForm.controls['mriManufacturerCard'].clearValidators();
        this.examQuestionForm.controls['mriManufacturerCard'].setValue('');
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriMedicaldevices =
          condition;
      }
      if (type === 'MriForeignMetalObj') {
        this.examQuestionForm.controls['mriObjLocated'].clearValidators();
        this.examQuestionForm.controls['mriObjLocated'].setValue('');
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriForeignMetalObj =
          condition;
      }
      if (type === 'MriWig') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriWig =
          condition;
      }
      if (type === 'MriRemovableMetal') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriRemovableMetal =
          condition;
      }
      if (type === 'IsRecentTattoo') {
        this.examQuestionForm.controls['mritattoosize'].clearValidators();
        this.examQuestionForm.controls['mritattoosize'].setValue('');
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.isRecentTattoo =
          condition;
      }
      if (type === 'MriAnkleMonitorDevice') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriProcedure =
          null;
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriPoMeetFacility =
          null;
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriAnkleMonitorDevice =
          condition;
      }
      if (type === 'MriProcedure') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriPoMeetFacility =
          null;
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriProcedure =
          condition;
        if (this.examQuestionForMRIwithoutContrast.mriPoMeetFacility === '' || this.examQuestionForMRIwithoutContrast.mriPoMeetFacility === null)
          this.examQuestionForm.setErrors({ 'invalid': true });
      }
      if (type === 'MriPoMeetFacility') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriPoMeetFacility =
          condition;
      }
    }
    this.CheckAllFieldsNotEmpty();
  }

  CheckYesOrNo(condition: string, type: string) {
    if (condition === 'Yes') {
      if (type === 'Diabitic') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast.isDiabetesHistory =
          condition;
      }
      if (type === 'Cancer') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast.isCancerHistory =
          condition;
      }
      if (type === 'BloodPressure') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast.isHighBloodPressure =
          condition;
      }
      if (type === 'IsAllergic') {
        this.examQuestionForm.controls['allergydescriptionwithmricontrast'].setValidators(Validators.required);
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast.mriAllergiesMedications =
          condition;
      }
      if (type === 'IsKidneyProblem') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast.isKidneyProblem =
          condition;
      }
    } else {
      if (type === 'Diabitic') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast.isDiabetesHistory =
          condition;
      }
      if (type === 'Cancer') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast.isCancerHistory =
          condition;
      }
      if (type === 'BloodPressure') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast.isHighBloodPressure =
          condition;
      }
      if (type === 'IsAllergic') {
        this.examQuestionForm.controls['allergydescriptionwithmricontrast'].clearValidators();
        this.examQuestionForm.controls['allergydescriptionwithmricontrast'].setValue('');
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast.mriAllergiesMedications =
          condition;
      }
      if (type === 'IsKidneyProblem') {
        this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithContrast.isKidneyProblem =
          condition;
      }
    }
    this.CheckAllFieldsNotEmpty();
  }

  CheckAllFieldsNotEmpty() {
    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriBefore != '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriBefore != null) {
      if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriBefore === 'Yes') {
        if (this.examQuestionForMRIwithoutContrast.mriProblem === '' || this.examQuestionForMRIwithoutContrast.mriProblem === null)
          this.examQuestionForm.setErrors({ 'invalid': true });
      }
    }
    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriClaustrophobic === '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriClaustrophobic === null) {
      this.examQuestionForm.setErrors({ 'invalid': true });
    }
    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriMedicalCondition === '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriMedicalCondition === null) {
      this.examQuestionForm.setErrors({ 'invalid': true });
    }
    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriHobbyJob != '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriHobbyJob != null) {
      if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriHobbyJob === 'Yes') {
        if (this.examQuestionForMRIwithoutContrast.authorizationXray === '' || this.examQuestionForMRIwithoutContrast.authorizationXray === null)
          this.examQuestionForm.setErrors({ 'invalid': true });
        if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.authorizationXray === '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.authorizationXray === null)
          this.examQuestionForm.setErrors({ 'invalid': true });
      }
    }
    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.eyesInjuries === '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.eyesInjuries === null) {
      this.examQuestionForm.setErrors({ 'invalid': true });
    }
    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriPhysicalLimition != '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriPhysicalLimition != null) {
      if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriPhysicalLimition === 'Yes') {
        if (this.examQuestionForMRIwithoutContrast.mriTransfer === '' || this.examQuestionForMRIwithoutContrast.mriTransfer === null)
          this.examQuestionForm.setErrors({ 'invalid': true });
      }
    }
    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriMedicaldevices === '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriMedicaldevices === null) {
      this.examQuestionForm.setErrors({ 'invalid': true });
    }
    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriForeignMetalObj === '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriForeignMetalObj === null)
      this.examQuestionForm.setErrors({ 'invalid': true });
    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriWig === '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriWig === null)
      this.examQuestionForm.setErrors({ 'invalid': true });
    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriRemovableMetal === '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriRemovableMetal === null)
      this.examQuestionForm.setErrors({ 'invalid': true });
    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.isRecentTattoo === '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.isRecentTattoo === null)
      this.examQuestionForm.setErrors({ 'invalid': true });
    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.isRecentTattoo === '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.isRecentTattoo === null)
      this.examQuestionForm.setErrors({ 'invalid': true });
    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriAnkleMonitorDevice === '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriAnkleMonitorDevice === null) {
      this.examQuestionForm.setErrors({ 'invalid': true });
    }
    if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriAnkleMonitorDevice != '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriAnkleMonitorDevice != null) {
      if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriAnkleMonitorDevice === 'Yes') {
        if (this.examQuestionForMRIwithoutContrast.mriProcedure === '' || this.examQuestionForMRIwithoutContrast.mriProcedure === null)
          this.examQuestionForm.setErrors({ 'invalid': true });
        if (this.examQuestionForMRIwithoutContrast.mriProcedure === 'No') {
          if (this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriPoMeetFacility === '' || this.patientPortalService.patientScreeningQuestion.examQuestionForMriWithoutContrast.mriPoMeetFacility === null)
            this.examQuestionForm.setErrors({ 'invalid': true });
        }
      } else {
        this.examQuestionForm.setErrors(null);
      }
    }
    if (this.isWithContrast) {
      if (this.examQuestionForMRIwithContrast.isDiabetesHistory === '' || this.examQuestionForMRIwithContrast.isDiabetesHistory === null) {
        this.examQuestionForm.setErrors({ 'invalid': true });
      }
      if (this.examQuestionForMRIwithContrast.isCancerHistory === '' || this.examQuestionForMRIwithContrast.isCancerHistory === null) {
        this.examQuestionForm.setErrors({ 'invalid': true });
      }
      if (this.examQuestionForMRIwithContrast.isHighBloodPressure === '' || this.examQuestionForMRIwithContrast.isHighBloodPressure === null) {
        this.examQuestionForm.setErrors({ 'invalid': true });
      }
      if (this.examQuestionForMRIwithContrast.mriAllergiesMedications === '' || this.examQuestionForMRIwithContrast.mriAllergiesMedications === null) {
        this.examQuestionForm.setErrors({ 'invalid': true });
      }
      if (this.examQuestionForMRIwithContrast.isKidneyProblem === '' || this.examQuestionForMRIwithContrast.isKidneyProblem === null) {
        this.examQuestionForm.setErrors({ 'invalid': true });
      }
    }
  }
}
