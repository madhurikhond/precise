import { AfterViewInit, Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { PatientService } from 'src/app/services/patient/patient.service';

@Component({
  selector: 'adetail-group',
  templateUrl: './detail-group.component.html',
  styleUrls: ['./detail-group.component.css']
})
export class PatientDetailGroupComponent implements OnInit, OnChanges {
  @Input() data: any;
  patientId: string;
  FullNameLF: string;
  BIRTHDATE: string;

  constructor(private readonly patientService: PatientService, private _common: CommonMethodService, private _storage: StorageService) { }
  ngOnChanges(changes: SimpleChanges): void { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.patientId = this.data.key[0];
    this.FullNameLF = this.data.data.items ? this.data.data.items[0].FullNameLF : this.data.data.collapsedItems[0].FullNameLF;
    this.BIRTHDATE = this.data.data.items ? this.data.data.items[0].BIRTHDATE : this.data.data.collapsedItems[0].BIRTHDATE;
  }

  showDocManager(patientId: any) {
    this._common.sendDataToDocumentManager(patientId);
  }

  getPatientDetailById() { 
    
    let rowData = this.data.data?.collapsedItems?.length > 0 ? this.data.data?.collapsedItems[0] : this.data.data.items[0]
    let body = {
      'internalPatientId': rowData.INTERNALPATIENTID,
      'internalStudyId': rowData.INTERNALSTUDYID,
      'hasAlert': rowData.HasAlert,
    }
    this.patientService.sendDataToPatientDetailWindow(body);
  }
}
