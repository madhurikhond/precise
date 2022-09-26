import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiRoutingModule } from './ui-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { UiComponent } from './ui.component';
import { TaskManagementSettingComponent } from './task-management-setting/task-management-setting.component';

@NgModule({
  declarations: [UiComponent, TaskManagementSettingComponent],
  imports: [
    UiRoutingModule,
    SharedModule
  ],
})
export class UiModule { }
