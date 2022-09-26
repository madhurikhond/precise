import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RadPortalService } from 'src/app/services/rad-portal-service/rad-portal.service';

@Component({
  selector: 'app-generate-bill-and-hold-lien',
  templateUrl: './generate-bill-and-hold-lien.component.html',
  styleUrls: ['./generate-bill-and-hold-lien.component.css']
})
export class GenerateBillAndHoldLienComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
    private readonly _radPortalService: RadPortalService,

    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
  close(loadApi: Boolean = false): void {
    this.activeModal.dismiss(loadApi);
  }
  onHoldLien(){
      let oModel : any = {};
      oModel.isLoadApi = true;
        this._radPortalService.setHoldLienCompany(oModel);
  }
}
