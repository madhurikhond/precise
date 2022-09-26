import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallConfirmRoutingModule } from './call-confirm-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { GeneralComponent } from './general/general.component';
import { ScriptComponent } from './script/script.component';
import { CallConfirmComponent } from './call-confirm.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [GeneralComponent, ScriptComponent,CallConfirmComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgSelectModule,
    CKEditorModule,
    CallConfirmRoutingModule,
    FormsModule
    
  ]
})
export class CallConfirmModule { }
