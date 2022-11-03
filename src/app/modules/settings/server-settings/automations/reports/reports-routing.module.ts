import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { ReportsComponent } from './reports.component';
import { SendAttyReportComponent } from './send-atty-report/send-atty-report.component';

const routes: Routes = [
  {
    path:'',component:ReportsComponent,children:[
      {
        path:'', redirectTo: 'sendattreport', pathMatch: 'full',canActivate:[RoleGuard]
      },
      {
        path:'sendattreport', component:SendAttyReportComponent,canActivate:[RoleGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
