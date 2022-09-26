import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/modules/core/guards/auth.guard';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { BrokersComponent } from './brokers/brokers.component';
import { DefaultsComponent } from './defaults.component';
import { GeneralComponent } from './general/general.component';

const routes: Routes = [
  {
    path: '', component: DefaultsComponent, children:[      
      { path: '', redirectTo: 'general', pathMatch: "full"},
      { path: 'general', component: GeneralComponent, canActivate: [AuthGuard,RoleGuard] },
      { path: 'funding-company', component: BrokersComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultsRoutingModule { }
