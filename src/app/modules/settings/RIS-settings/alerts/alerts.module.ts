import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertsRoutingModule } from './alerts-routing.module';
import { AlertsComponent } from './alerts.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AlertTypeComponent } from './alert-types/alert-type.component';
import { UnsatisfiedSettingsComponent } from './unsatisfied-settings/unsatisfied-settings.component';
import {  DxDataGridModule} from 'devextreme-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { ReasonComponent } from './reason/reason.component';




@NgModule({
  declarations: [AlertsComponent,AlertTypeComponent,UnsatisfiedSettingsComponent, ReasonComponent],
  imports: [
    CommonModule,
    SharedModule,
    DxDataGridModule,
    CKEditorModule,
    AlertsRoutingModule,
    FormsModule
  ]
})
export class AlertsModule { }
