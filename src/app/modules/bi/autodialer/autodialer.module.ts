import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutodialerRoutingModule } from './autodialer-routing.module';
import { AutodialerComponent } from './autodialer.component';
import { NewordercallerComponent } from './newordercaller/newordercaller.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [AutodialerComponent, NewordercallerComponent],
  imports: [
    CommonModule,
    SharedModule,
    AutodialerRoutingModule
  ]
})
export class AutodialerModule { }
