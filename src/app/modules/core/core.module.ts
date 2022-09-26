import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { DetailComponent } from './navbar/detail/detail.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [CoreComponent, HeaderComponent, NavbarComponent, DashboardComponent, DetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoreRoutingModule,
    CKEditorModule,
    FormsModule
  ],
  providers:[]
})
export class CoreModule { 
}
