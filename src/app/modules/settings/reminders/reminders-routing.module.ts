import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';
import { RemindersComponent } from './reminders.component';

const routes: Routes = [
  {path: '', component: RemindersComponent,canActivate:[RoleGuard]}
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemindersRoutingModule { }
