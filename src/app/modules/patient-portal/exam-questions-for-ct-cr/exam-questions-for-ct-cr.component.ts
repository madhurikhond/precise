import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PatientPortalScreeningStatusCode, PatientPortalStatusCode } from 'src/app/constants/patient-portal-status-code.enum';
import { patientPortalResponseStatus, PatientPortalStatusMessage, PatientPortalURL } from 'src/app/models/patient-response';
import { PatientExamQuestionForCtOrCr } from 'src/app/models/pre-screeing-question';
import { StorageService } from 'src/app/services/common/storage.service';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';

@Component({
  selector: 'app-exam-questions-for-ct-cr',
  templateUrl: './exam-questions-for-ct-cr.component.html',
  styleUrls: ['./exam-questions-for-ct-cr.component.css']
})
export class ExamQuestionsForCtCrComponent implements OnInit {

  examQuestionCtCrForm: FormGroup;
  btnText:boolean = false;
  currentLanguage:string = 'en';
  examQuestionsForCtOrCr:PatientExamQuestionForCtOrCr;

  constructor(public translate: TranslateService,
    private readonly router: Router,
    private fb: FormBuilder, private readonly storageService: StorageService,
    private readonly patientPortalService: PatientPortalService) {

      if(!this.storageService.PatientPreScreening || !this.storageService.PatientStudy)
      {
        this.examQuestionsForCtOrCr = this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr;
      }

      this.currentLanguage = this.storageService.getPatientLanguage();
      if(this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr)
      {
        this.examQuestionsForCtOrCr = this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr;
      }else{
        this.examQuestionsForCtOrCr = new PatientExamQuestionForCtOrCr();
        this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr = this.examQuestionsForCtOrCr;
      }
      this.examQuestionCtCrForm = this.fb.group({
        recentXrayCtDescription:[''],
        recentRadiation:['']
      });
    }

  ngOnInit() {
    if(this.examQuestionsForCtOrCr)
    {
    if(this.examQuestionsForCtOrCr.recentXrayCt === ''){
      this.examQuestionCtCrForm.setErrors({ 'invalid': true });
    }
    if(this.examQuestionsForCtOrCr.cancerHistory === ''){
      this.examQuestionCtCrForm.setErrors({ 'invalid': true });
    }

    if(this.patientPortalService.questionScreenTypes.indexOf(PatientPortalScreeningStatusCode.US) > -1)
      this.btnText = true;

      if (this.examQuestionsForCtOrCr.recentXrayCt === 'Yes') {
        this.examQuestionCtCrForm.controls['recentXrayCtDescription'].setValidators(
          Validators.required
        );
        if(this.examQuestionsForCtOrCr.recentXrayCtDescription){
          this.examQuestionCtCrForm.controls['recentXrayCtDescription'].setValue(this.examQuestionsForCtOrCr.recentXrayCtDescription);
        }else{
          this.examQuestionCtCrForm.controls['recentXrayCtDescription'].setValue('');
        }
      } else if(this.examQuestionsForCtOrCr.recentXrayCt === 'No'){
        this.examQuestionCtCrForm.controls['recentXrayCtDescription'].clearValidators();
      }else{
        this.examQuestionCtCrForm.controls['recentXrayCtDescription'].setValidators(
          Validators.required
        );
      }

      if (this.examQuestionsForCtOrCr.cancerHistory === 'Yes') {
        this.examQuestionCtCrForm.controls['recentRadiation'].setValidators(
          Validators.required
        );
        if(this.examQuestionsForCtOrCr.recentRadiation){
          this.examQuestionCtCrForm.controls['recentRadiation'].setValue(this.examQuestionsForCtOrCr.recentRadiation);
        }else{
          this.examQuestionCtCrForm.controls['recentRadiation'].setValue('');
        }
      } else if(this.examQuestionsForCtOrCr.cancerHistory === 'No'){
        this.examQuestionCtCrForm.controls['recentRadiation'].clearValidators();
      }else{
        this.examQuestionCtCrForm.controls['recentRadiation'].setValidators(
          Validators.required
        );
      }
    }
  }

  onSubmit() {
    this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr.recentXrayCtDescription = this.examQuestionCtCrForm.controls['recentXrayCtDescription'].value;
    this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr.recentRadiation = this.examQuestionCtCrForm.controls['recentRadiation'].value;
    var examQuestionForCtOrCrOption = this.patientPortalService.internalStudyIdDetails.filter(x=>x.scheduledModality == PatientPortalScreeningStatusCode.CT || x.scheduledModality ==  PatientPortalScreeningStatusCode.CR);

    if(examQuestionForCtOrCrOption.length > 0)
    {
      this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr.studyId = examQuestionForCtOrCrOption[0].internalStudyId;
      this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr.studyDescription = examQuestionForCtOrCrOption[0].studyDescription;
      this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr.modalityName = examQuestionForCtOrCrOption[0].modality;
      this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.modalityName = examQuestionForCtOrCrOption[0].modality;
      this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.studyDescription = examQuestionForCtOrCrOption[0].studyDescription;
      this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.studyId = examQuestionForCtOrCrOption[0].internalStudyId;
    }
    else{
      this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr.studyId = this.patientPortalService.internalStudyIdDetails[0].internalStudyId;
      this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr.studyDescription = this.patientPortalService.internalStudyIdDetails[0].studyDescription;
      this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr.modalityName = this.patientPortalService.internalStudyIdDetails[0].modality;

    }
    this.patientPortalService.patientScreeningQuestion.pageCompleted = PatientPortalStatusCode.PATIENT_EXAM_QUESTIONS_SCREEN;
    this.storageService.PatientStudy = JSON.stringify(this.patientPortalService.patientScreeningQuestion);
    if(this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.gender == "F")
    {
      if(this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.isPregnant == "Yes")
        this.patientPortalService.isPregnancyWaiverEnable = true;
    }
    this.storageService.PatientPreScreening = 'true';
    if(this.patientPortalService.questionScreenTypes.indexOf(PatientPortalScreeningStatusCode.US) > -1)
    {
      this.patientPortalService.AddPreScreeningQuestions(this.patientPortalService.patientScreeningQuestion).subscribe(res=>{
        if (res) {
          if (res.responseStatus == patientPortalResponseStatus.Success) {
            this.router.navigate([PatientPortalURL.EXAM_QUESTION_FOR_US]);
          }
        }
        else
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      })
    }
    else{
      this.patientPortalService.patientScreeningQuestion.isFinalSubmit = true;
      this.patientPortalService.AddPreScreeningQuestions(this.patientPortalService.patientScreeningQuestion).subscribe(res=>{
        if (res) {
          if (res.responseStatus == patientPortalResponseStatus.Success) {
            this.patientPortalService.remainingStudyCount = 0;
            this.router.navigate([PatientPortalURL.PATIENT_HOME]);
          }
        }
        else
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      })
    }
  }

  goBack() {
    if(this.patientPortalService.questionScreenTypes.indexOf(PatientPortalScreeningStatusCode.MRI_WITHOUT_CONTRAST) > -1 ||
    this.patientPortalService.questionScreenTypes.indexOf(PatientPortalScreeningStatusCode.MRI_WITH_CONTRAST) > -1)
      this.router.navigate([PatientPortalURL.EXAM_QUESTION]);
    else
      this.router.navigate([PatientPortalURL.PRE_SCREENING_QUESTION]);
  }

  CheckYesOrNo(condition:string,type:string){
    if(condition === 'Yes'){
      if(type === 'recentXrayCt'){
        this.examQuestionCtCrForm.controls['recentXrayCtDescription'].setValidators(Validators.required);
        if(this.examQuestionCtCrForm.controls['recentXrayCtDescription'].value === ''){
          this.examQuestionCtCrForm.setErrors({ 'invalid': true });
        }
        this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr.recentXrayCt = condition;
      }
      if(type === 'cancerHistory'){
        this.examQuestionCtCrForm.controls['recentRadiation'].setValidators(Validators.required);
        if(this.examQuestionCtCrForm.controls['recentRadiation'].value === ''){
          this.examQuestionCtCrForm.setErrors({ 'invalid': true });
        }
        this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr.cancerHistory = condition;
      }
    }
    else{
      if(type === 'recentXrayCt'){
        this.examQuestionCtCrForm.controls['recentXrayCtDescription'].clearValidators();
        this.examQuestionCtCrForm.controls['recentXrayCtDescription'].setValue('');
        this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr.recentXrayCt = condition;
      }
      if(type === 'cancerHistory'){
        this.examQuestionCtCrForm.controls['recentRadiation'].clearValidators();
        this.examQuestionCtCrForm.controls['recentRadiation'].setValue('');
        this.patientPortalService.patientScreeningQuestion.examQuestionForCtOrCr.cancerHistory = condition;
      }
    }

  }
}
