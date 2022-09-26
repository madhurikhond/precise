import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportRoutingModule } from './export-routing.module';
import { ExportComponent } from './export.component';
import { PatientDocsComponent } from './patient-docs/patient-docs.component';
import { ArSftpComponent } from './ar-sftp/ar-sftp.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [ExportComponent, PatientDocsComponent, ArSftpComponent],
  imports: [
    CommonModule,
    SharedModule,
    ExportRoutingModule
  ]
})
export class ExportModule { }
