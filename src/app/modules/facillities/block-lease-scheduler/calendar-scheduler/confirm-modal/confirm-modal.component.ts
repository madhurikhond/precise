import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {
  @Output() deleted: EventEmitter<Event> = new EventEmitter();

  ModalResult = ModalResult;
  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
  }
  close() {
    this.modal.dismiss(ModalResult.CLOSE);
  }

  cancel() {
    this.modal.dismiss(ModalResult.CANCEL);
  }

  delete() {
    this.deleted.emit();
    this.modal.close(ModalResult.DELETE);
  }
}
export enum ModalResult {
  BACKDROP_CLICK = 0,
  ESC = 1,
  CLOSE = 3,
  CANCEL = 4,
  SAVE = 5,
  DELETE = 6
}
