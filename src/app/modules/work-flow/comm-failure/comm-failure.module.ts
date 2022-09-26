import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommFailureRoutingModule } from './comm-failure-routing.module';
import { CommFailureComponent } from './comm-failure.component';
import { NeedToResolveComponent } from './need-to-resolve/need-to-resolve.component';
import { ResolvedComponent } from './resolved/resolved.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [CommFailureComponent, NeedToResolveComponent, ResolvedComponent],
  imports: [
    CommonModule,
    CommFailureRoutingModule,
    SharedModule
  ]
})
export class CommFailureModule { }
