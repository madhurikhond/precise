import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateBillAndSellLienPopupComponent } from './generate-bill-and-sell-lien-popup.component';
import { SharedModule } from '../../shared/shared.module';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [GenerateBillAndSellLienPopupComponent],
  imports: [
    CommonModule,
    SharedModule,
    SignaturePadModule
  ],
  entryComponents: [GenerateBillAndSellLienPopupComponent]
})
export class GenerateBillAndSellLienPopupModule { }
