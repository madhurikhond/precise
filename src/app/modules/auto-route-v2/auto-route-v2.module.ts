import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoRouteV2Component } from './auto-route-v2/auto-route-v2.component';
import { AutoRouteV2Routing } from './auto-route-v2-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    AutoRouteV2Component,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AutoRouteV2Routing
  ]
})
export class AutoRouteV2Module { }
