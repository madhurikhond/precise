import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerRoutingModule } from './broker-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { BrokerComponent } from './broker.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';

import {
  DxButtonModule, DxTabPanelModule, DxDataGridModule, DxDataGridComponent,
} from 'devextreme-angular';



@NgModule({
  // declarations: [BrokerComponent],
  imports: [  
    CommonModule,  
    CKEditorModule,
    FormsModule,
    BrokerRoutingModule,
    NgSelectModule,
    SharedModule,
    DxButtonModule,  
    DxDataGridModule
  ]
})
export class BrokerModule { }
