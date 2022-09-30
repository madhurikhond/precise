import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderedSchedulerComponent } from 'src/app/modules/work-flow/ordered-scheduler/ordered-scheduler.component';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
declare const $: any;
@Component({
  selector: 'app-prescreening-small-window',
  templateUrl: './prescreening-small-window.component.html',
  styleUrls: ['./prescreening-small-window.component.css']
})
export class PrescreeningSmallWindowComponent implements OnInit {
  @ViewChild('hiddenModalclose', { static: false }) hiddenModalclose: ElementRef;
  @HostListener('keydown', ['$event']) onKeyDown(e) {
    if (e.code === 'Escape')  {
     $('.modal.fade.modal-theme.show').find('.close-dismiss').click();
    }
    
  }
  patientIdModel: string = "";
  preScreeningForm: FormGroup;
  IsSubmitted: boolean = false;
  modelValue: string = "modal";
  data: any;


  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal, private readonly router: Router,
    private readonly workflowService: WorkflowService, private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.preScreeningForm = this.fb.group({
      patientID: ['', [Validators.required]],
    })

  }
  onSubmit() {
    this.IsSubmitted = true;
    if (this.preScreeningForm.invalid) {
      return;
    }
    this.workflowService.GetPrescreenGridRecord(this.preForm.patientID.value, true).subscribe((res) => {
      this.hiddenModalclose.nativeElement.click();
      this.commonMethodService.setPreScreenPatientID(this.preForm.patientID.value)
    }, (err: any) => {
 
    })
    this.router.navigate(["/shared/preScreenGrid"], { queryParams: { patientId: this.preForm.patientID.value } });

  }

  close(Condition: boolean) {
    this.activeModal.dismiss(true)
    this.hiddenModalclose.nativeElement.click();
    if (Condition) {
      // this.router.navigate(["/dashboard"]);
      //  this.router.navigate(["/shared/preScreenGrid"],{ queryParams: {patientId: 37, username: 'jimmy'}});
    }
  }
  get preForm() { return this.preScreeningForm.controls; }
}
