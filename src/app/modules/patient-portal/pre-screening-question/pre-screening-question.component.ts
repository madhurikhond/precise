import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PatientPreScreeningQuestion, PatientScreeningQuestion } from 'src/app/models/pre-screeing-question';
import { PatientPortalScreeningStatusCode, PatientPortalStatusCode } from 'src/app/constants/patient-portal-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { PageTitleOption } from 'src/app/models/patient-response';
import { StorageService } from 'src/app/services/common/storage.service';

@Component({
  selector: 'app-pre-screening-question',
  templateUrl: './pre-screening-question.component.html',
  styleUrls: ['./pre-screening-question.component.css'],
})
export class PreScreeningQuestionComponent implements OnInit {
  preQuestionForm: FormGroup;
  showCorrect = false;
  showPregnentSection = false;
  showPeriodSection = false;
  showCorrect1 = false;
  studyIds:any;

  preScreeningQuestions:PatientPreScreeningQuestion;
  heightInFeet:any;
  heightInInch:any;
  maleOrFemale:string;
  isPregnant:string;

  constructor(
    public translate: TranslateService,
    private readonly notificationService: NotificationService,
    private readonly patientPortalService: PatientPortalService,
    private readonly storageService: StorageService,
    private readonly router: Router,
    private readonly commonMethodService: CommonMethodService,
    private fb: FormBuilder
  ) {
    
    this.preQuestionForm = this.fb.group({
      weight: ['', [Validators.required]],
      timeperiod: [''],
      feet: ['', [Validators.required]],
      inches: ['', [Validators.required]],
    });
    if(!this.storageService.PatientPreScreening || !this.storageService.PatientStudy)
    {
      this.preScreeningQuestions = new PatientPreScreeningQuestion();
      this.patientPortalService.patientScreeningQuestion = new PatientScreeningQuestion();
      this.getStudyModalityByPatientId();
    }
    else
      {
        this.preScreeningQuestions = this.patientPortalService.patientScreeningQuestion.preScreeningQuestion;
        
        this.fillPreScreening();
      }

   
  }

  ngOnInit(): void {
    this.commonMethodService.setTitle(PageTitleOption.PRE_SCREENING_QUESTION);
    
  }

  fillPreScreening()
  {
    if(this.preScreeningQuestions){
      this.heightInFeet = this.preScreeningQuestions.height.substring(0, this.preScreeningQuestions.height.indexOf(' ')).split("");
      this.heightInInch = this.preScreeningQuestions.height.substring(this.preScreeningQuestions.height.indexOf(' ') + 1).split("");
      if(this.preScreeningQuestions.height){
        this.preQuestionForm.controls['feet'].setValue(this.heightInFeet[0]);
      }else{
        this.preQuestionForm.controls['feet'].setValue('');
      }
      if(this.heightInInch.length == 4){
        if(this.preScreeningQuestions.height){
          this.preQuestionForm.controls['inches'].setValue(this.heightInInch[0] + this.heightInInch[1]);
        }
        else{
          this.preQuestionForm.controls['inches'].setValue('');
        }
      }
      else{
        if(this.preScreeningQuestions.height){
          this.preQuestionForm.controls['inches'].setValue(this.heightInInch[0]);
        }else{
          this.preQuestionForm.controls['inches'].setValue('');
        }
      }  
     
      if(this.preScreeningQuestions.gender === 'F'){
        this.showCorrect = true;
        this.maleOrFemale = 'F';
        this.showPregnentSection = true;
       if(this.preScreeningQuestions.isPregnant){
        this.showCorrect1 = true;
        if(this.preScreeningQuestions.isPregnant === 'Yes'){
          this.isPregnant = 'Yes';
          if(this.isPregnant === 'Yes'){
            this.preQuestionForm.controls['timeperiod'].setValidators([Validators.required]);
          }
          this.showPeriodSection = true;
        }
        else{
          this.preQuestionForm.controls['timeperiod'].clearValidators();
          this.isPregnant = 'No';
          this.showPeriodSection = false;
        }
       }
      }

      else if(this.preScreeningQuestions.gender === 'M'){
        this.showCorrect = true;
        this.preQuestionForm.controls['timeperiod'].clearValidators();
        this.maleOrFemale = 'M';
        this.showPeriodSection = false;
        this.showCorrect1 = true;
      }
      else{
        this.preQuestionForm.controls['timeperiod'].clearValidators();
      }
     }
      if(this.preScreeningQuestions.weight){
        this.preQuestionForm.controls['weight'].setValue(this.preScreeningQuestions.weight);
      }else{
        this.preQuestionForm.controls['weight'].setValue('');
      }
      if(this.preScreeningQuestions.pregnancyInWeek){
         this.preQuestionForm.controls['timeperiod'].setValue(this.preScreeningQuestions.pregnancyInWeek);
        }
      else{
          this.preQuestionForm.controls['timeperiod'].setValue('');
        }
      
  }
 
  getStudyModalityByPatientId(){
    var request = {
      patientId: this.patientPortalService.patientDetail.patientId
    }
    this.patientPortalService.GetStudyModalityByPatientId(request).subscribe(res=>{
      if (res) {
        if(res.result){
          this.patientPortalService.internalStudyIdDetails = res.result;
          this.studyIds = this.patientPortalService.internalStudyIdDetails.map((item:any)=>{
            return item.internalStudyId;
          })
          this.patientPortalService.questionScreenTypes = this.patientPortalService.internalStudyIdDetails.map((item:any)=>{
            return item.scheduledModality
          })
          
          this.GetPreScreeningQuestions(this.studyIds);
        }
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: null,
          alertMessage: err.error.message,
          alertType: ResponseStatusCode.InternalError
        })
      }
    );
  }

  GetPreScreeningQuestions(studyIds:any){
    if(studyIds){
      var requestData ={
        patientId: this.patientPortalService.patientDetail.patientId,
        internalStudyIds : studyIds
      }
    this.patientPortalService.GetPreScreeningQuestions(requestData).subscribe(res=>{

      if(res.result.patientId)
      {
      this.patientPortalService.patientScreeningQuestion = res.result;
      this.preScreeningQuestions = res.result.preScreeningQuestion;
      }
      else{
        this.patientPortalService.patientScreeningQuestion.patientId = requestData.patientId;
        this.preScreeningQuestions = this.patientPortalService.patientScreeningQuestion.preScreeningQuestion;
        this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.studyId = this.patientPortalService.internalStudyIdDetails[0].internalStudyId;
        this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.studyDescription = this.patientPortalService.internalStudyIdDetails[0].modality;
        this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.modalityName = this.patientPortalService.internalStudyIdDetails[0].studyDescription;
        this.patientPortalService.patientScreeningQuestion.pageCompleted = PatientPortalStatusCode.PATIENT_EXAM_QUESTIONS_SCREEN;
      }
      this.fillPreScreening();
    })
    }
    else{
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'StudyId not Found',
        alertType: ResponseStatusCode.InternalError
      })
    }
  }

  onSubmit() {
    this.storageService.PatientPreScreening = 'false';
    this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.gender = this.maleOrFemale;
    if(this.heightInInch.length == 4){
      this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.height = this.heightInFeet +'ft'+' '+this.heightInInch+'in';
    }else{
      this.heightInFeet = this.preQuestionForm.controls['feet'].value;
      this.heightInInch = this.preQuestionForm.controls['inches'].value;
      this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.height = this.heightInFeet +'ft'+' '+this.heightInInch+'in';
    }
    if(!this.isPregnant){
      this.isPregnant = '';
    }
    this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.isPregnant = this.isPregnant;
    this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.weight = this.preQuestionForm.controls['weight'].value;
    this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.pregnancyInWeek = this.preQuestionForm.controls['timeperiod'].value;
    this.storageService.PatientStudy = JSON.stringify(this.patientPortalService.patientScreeningQuestion);
    if(this.patientPortalService.questionScreenTypes.indexOf(PatientPortalScreeningStatusCode.MRI_WITHOUT_CONTRAST) > -1 ||
    this.patientPortalService.questionScreenTypes.indexOf(PatientPortalScreeningStatusCode.MRI_WITH_CONTRAST) > -1)
      this.router.navigate(['exam-question']);
    else if(this.patientPortalService.questionScreenTypes.indexOf(PatientPortalScreeningStatusCode.CT) > -1 ||
    this.patientPortalService.questionScreenTypes.indexOf(PatientPortalScreeningStatusCode.CR) > -1)
      this.router.navigate(['exam-question-for-ct-cr']);
    else if(this.patientPortalService.questionScreenTypes.indexOf(PatientPortalScreeningStatusCode.US) > -1)
    this.router.navigate(['exam-question-for-us']);

  }

  changeCorrect(gender: string) {
    this.showCorrect = true;
    if (gender === 'Female') {
      this.maleOrFemale = 'F';
      this.showPregnentSection = true;
      this.showPeriodSection = false;
      this.showCorrect1 = false;
    }
    else {
      this.preQuestionForm.controls['timeperiod'].clearValidators();
      this.preQuestionForm.controls['timeperiod'].setValue('');
      this.maleOrFemale = 'M';
      this.showPregnentSection = false;
      this.showPeriodSection = false;
      this.showCorrect1 = true;
      this.isPregnant = '';
      this.patientPortalService.isPregnancyWaiverEnable = false;
    }
  }

  CheckPregnant(condition: string) {
    this.showCorrect1 = true;
    if (condition === 'Yes') {
      this.isPregnant = condition;
      this.preQuestionForm.controls['timeperiod'].setValidators([Validators.required]);
      this.showPeriodSection = true;
    }
    else {
      this.preQuestionForm.controls['timeperiod'].clearValidators();
      this.preQuestionForm.controls['timeperiod'].setValue('');
      this.isPregnant = condition;
      this.patientPortalService.isPregnancyWaiverEnable = false;
      this.showPeriodSection = false;
    }
  }

  goBack(){
    this.router.navigate(['patient-home']);
  }
}
