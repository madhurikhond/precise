import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { FacilitiesComponent } from './facilities.component';
import { PslReminderComponent } from './psl-reminder/psl-reminder.component';

const routes: Routes = [
  {
    path:'',component:FacilitiesComponent,children:[
      {
        path:'', redirectTo: 'pslreminder', pathMatch: 'full',canActivate:[RoleGuard]
      },
      {
        path:'pslreminder',component:PslReminderComponent,canActivate:[RoleGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilitiesRoutingModule { }
