import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArRoutingModule } from './ar-routing.module';
import { ArComponent } from './ar.component';
import { CheckImageAttachmentComponent } from './check-image-attachment/check-image-attachment.component';
import { NewExportFileComponent } from './new-export-file/new-export-file.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ArComponent, CheckImageAttachmentComponent, NewExportFileComponent],
  imports: [
    CommonModule,
    ArRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ArModule { }
