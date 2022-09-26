import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { GenerateBillAndHoldLienComponent } from './generate-bill-and-hold-lien.component';



@NgModule({
  declarations: [GenerateBillAndHoldLienComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  entryComponents: [GenerateBillAndHoldLienComponent]
})
export class GenerateBillAndHoldLienModule { }
