import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PatientPortalScreeningStatusCode, PatientPortalStatusCode } from 'src/app/constants/patient-portal-status-code.enum';
import { patientPortalResponseStatus } from 'src/app/models/patient-response';
import { PatintExamQuestionForUs } from 'src/app/models/pre-screeing-question';
import { StorageService } from 'src/app/services/common/storage.service';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';

@Component({
  selector: 'app-exam-questions-for-us',
  templateUrl: './exam-questions-for-us.component.html',
  styleUrls: ['./exam-questions-for-us.component.css']
})
export class ExamQuestionsForUsComponent implements OnInit {

  examQuestionUsForm: FormGroup;
  examQuestionForUS: PatintExamQuestionForUs;
  showCorrect = false;

  constructor(public translate: TranslateService,public storageService: StorageService,
    private readonly router: Router,
    private fb: FormBuilder,
    private readonly patientPortalService: PatientPortalService) {

      if(!this.storageService.PatientPreScreening || !this.storageService.PatientStudy)
      {
        this.examQuestionForUS = this.patientPortalService.patientScreeningQuestion.examQuestionForUs;
      }

      if(this.patientPortalService.patientScreeningQuestion.examQuestionForUs)
      {
        this.examQuestionForUS = this.patientPortalService.patientScreeningQuestion.examQuestionForUs;
      }
      else{
        this.examQuestionForUS = new PatintExamQuestionForUs();
        this.patientPortalService.patientScreeningQuestion.examQuestionForUs = this.examQuestionForUS;
      }
      this.examQuestionUsForm = this.fb.group({
        usAllergyDescription:['']
      });
    }

  ngOnInit() {
    if(this.examQuestionForUS)
      {
        if(this.examQuestionForUS.usAllergy)
        {
          this.showCorrect = true;
          if(this.examQuestionForUS.usAllergy == 'Yes')
            this.examQuestionUsForm.controls['usAllergyDescription'].setValidators(Validators.required);
          else
            this.examQuestionUsForm.controls['usAllergyDescription'].clearValidators();
        }
        if(this.examQuestionForUS.usAllergyDescription){

          this.examQuestionUsForm.controls['usAllergyDescription'].setValue(this.examQuestionForUS.usAllergyDescription);
        }else{
          this.examQuestionUsForm.controls['usAllergyDescription'].setValue('');
        }
    }
  }

  onSubmit() {
    this.patientPortalService.patientScreeningQuestion.examQuestionForUs.usAllergyDescription = this.examQuestionUsForm.controls['usAllergyDescription'].value;

    var examQuestionForUsOption = this.patientPortalService.internalStudyIdDetails.filter(x=>x.scheduledModality == PatientPortalScreeningStatusCode.US);

    if(examQuestionForUsOption.length > 0)
    {
      this.patientPortalService.patientScreeningQuestion.examQuestionForUs.studyId = examQuestionForUsOption[0].internalStudyId;
      this.patientPortalService.patientScreeningQuestion.examQuestionForUs.studyDescription = examQuestionForUsOption[0].modality;
      this.patientPortalService.patientScreeningQuestion.examQuestionForUs.modalityName = examQuestionForUsOption[0].studyDescription;
    }
    else{
      this.patientPortalService.patientScreeningQuestion.examQuestionForUs.studyId = this.patientPortalService.internalStudyIdDetails[0].internalStudyId;
      this.patientPortalService.patientScreeningQuestion.examQuestionForUs.studyDescription = this.patientPortalService.internalStudyIdDetails[0].modality;
      this.patientPortalService.patientScreeningQuestion.examQuestionForUs.modalityName = this.patientPortalService.internalStudyIdDetails[0].studyDescription;
    }
    this.storageService.PatientPreScreening = 'true';
    this.patientPortalService.patientScreeningQuestion.pageCompleted = PatientPortalStatusCode.PATIENT_EXAM_QUESTIONS_SCREEN;
    this.storageService.PatientStudy = JSON.stringify(this.patientPortalService.patientScreeningQuestion);
    this.patientPortalService.patientScreeningQuestion.isFinalSubmit = true;
    this.patientPortalService.AddPreScreeningQuestions(this.patientPortalService.patientScreeningQuestion).subscribe(res=>{
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success) {
          this.patientPortalService.remainingStudyCount = 0;
          this.router.navigate(['patient-home']);
        }
      }
    })
  }

  goBack() {

    if(this.patientPortalService.questionScreenTypes.indexOf(PatientPortalScreeningStatusCode.MRI_WITHOUT_CONTRAST) > -1 ||
    this.patientPortalService.questionScreenTypes.indexOf(PatientPortalScreeningStatusCode.MRI_WITH_CONTRAST) > -1)
      this.router.navigate(['exam-question']);
    else if(this.patientPortalService.questionScreenTypes.indexOf(PatientPortalScreeningStatusCode.CT) > -1 ||
    this.patientPortalService.questionScreenTypes.indexOf(PatientPortalScreeningStatusCode.CR) > -1)
      this.router.navigate(['exam-question-for-ct-cr']);
    else
      this.router.navigate(['pre-screening-question']);
  }

  CheckYesOrNo(condition:string,type:string){
    this.showCorrect = true;
    if(condition === 'Yes'){
      if(type === 'usAllergy'){
        this.examQuestionUsForm.controls['usAllergyDescription'].setValidators(Validators.required);
        this.examQuestionForUS.usAllergy = condition;
        this.patientPortalService.patientScreeningQuestion.examQuestionForUs.usAllergy = condition;
      }
    }
    else{
      if(type === 'usAllergy'){
        this.examQuestionUsForm.controls['usAllergyDescription'].clearValidators();
        this.examQuestionForUS.usAllergy = condition;
        this.examQuestionUsForm.controls['usAllergyDescription'].setValue('');
        this.patientPortalService.patientScreeningQuestion.examQuestionForUs.usAllergy = condition;
      }
    }
  }

}
