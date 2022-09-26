import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubsRoutingModule } from './subs-routing.module';
import { SubsComponent } from './subs.component';
import { PickupComponent } from './pickup/pickup.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SubsComponent, PickupComponent],
  imports: [
    CommonModule,
    SubsRoutingModule,
    SharedModule,
    CKEditorModule,
    FormsModule
  ]
})
export class SubsModule { }
