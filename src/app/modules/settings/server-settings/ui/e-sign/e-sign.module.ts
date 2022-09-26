import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESignRoutingModule } from './e-sign-routing.module';
import { ElecAgreeComponent } from './elec-agree/elec-agree.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ElecAgreeComponent],
  imports: [
    CommonModule,
    ESignRoutingModule,
    SharedModule,
    CKEditorModule,
    FormsModule
  ]
})
export class ESignModule { }
