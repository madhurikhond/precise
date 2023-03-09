import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-recurring-event-modal',
  templateUrl: './edit-recurring-event-modal.component.html',
  styleUrls: ['./edit-recurring-event-modal.component.css']
})
export class EditRecurringEventModalComponent implements OnInit {
  ModalResult = ModalResult;
  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {   
  }
  close() {
    this.modal.dismiss(ModalResult.CANCEL);
  }

  cancel() {
    this.modal.dismiss(ModalResult.CANCEL);
  }
  confirmOccurance(){
    this.modal.dismiss(ModalResult.confirmOccurance);
  }
  confirmSeries(){
    this.modal.dismiss(ModalResult.confirmSeries);
  }
}
export enum ModalResult { 
  CANCEL = 4,
  confirmOccurance = 1,
  confirmSeries = 2,
}

