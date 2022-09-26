import { AccoutingService } from 'src/app/services/accouting-service/accouting.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-study',
  templateUrl: './select-study.component.html',
  styleUrls: ['./select-study.component.css']
})
export class SelectStudyComponent implements OnInit {
  @Input() data;
  constructor(
    private activeModal: NgbActiveModal
    ) { }

  ngOnInit(): void {
  }
  close(loadApi: Boolean = false): void {
    this.activeModal.dismiss(loadApi);
  }
}
