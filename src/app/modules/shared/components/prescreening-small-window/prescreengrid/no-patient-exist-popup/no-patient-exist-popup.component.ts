import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-no-patient-exist-popup',
  templateUrl: './no-patient-exist-popup.component.html',
  styleUrls: ['./no-patient-exist-popup.component.css']
})
export class NoPatientExistPopupComponent implements OnInit {
  @Input() message : any;
  notifyParent = new EventEmitter();

  constructor(private activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
  }
  close(flag){
    this.notifyParent.emit(flag);
    this.activeModal.dismiss(false);
  }
}
