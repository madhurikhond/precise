import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-study-not-completed',
  templateUrl: './study-not-completed.component.html',
  styleUrls: ['./study-not-completed.component.css']
})
export class StudyNotCompletedComponent implements OnInit {
  @Input() e : any;
  constructor(
    private activeModal: NgbActiveModal
    ) { }

  ngOnInit(): void {
  }
  close(loadApi: Boolean = false): void {
    this.activeModal.dismiss(false);
  }
  cancel(){
    this.e.cancel;
    this.activeModal.close(false);
    //this.close();
  }
  Yes(): void {
    this.activeModal.close(true);
  }
}
