import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacilitiesComponent } from './facilities.component';
import { PslReminderComponent } from './psl-reminder/psl-reminder.component';

const routes: Routes = [
  {
    path:'',component:FacilitiesComponent,children:[
      {
        path:'', redirectTo: 'pslreminder', pathMatch: 'full'
      },
      {
        path:'pslreminder',component:PslReminderComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilitiesRoutingModule { }
