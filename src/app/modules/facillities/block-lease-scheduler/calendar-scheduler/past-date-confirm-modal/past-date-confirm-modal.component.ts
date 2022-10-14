import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-past-date-confirm-modal',
  templateUrl: './past-date-confirm-modal.component.html' 
})
export class PastDateConfirmModalComponent implements OnInit {
  ModalResult = ModalResult;
  @Input() isPastDateOrOffDays: boolean;
  constructor(public modal: NgbActiveModal) {}
  ngOnInit(): void {   
  }
  close() {
    this.modal.dismiss(ModalResult.CANCEL);
  }

  cancel() {
    this.modal.dismiss(ModalResult.CANCEL);
  }
  confirm(){
    this.modal.dismiss(ModalResult.confirm);
  }
}
export enum ModalResult { 
  CANCEL = 4,
  confirm = 5,
  
}

