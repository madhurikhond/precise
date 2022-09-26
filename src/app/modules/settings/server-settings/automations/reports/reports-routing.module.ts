import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { SendAttyReportComponent } from './send-atty-report/send-atty-report.component';

const routes: Routes = [
  {
    path:'',component:ReportsComponent,children:[
      {
        path:'', redirectTo: 'sendattreport', pathMatch: 'full'
      },
      {
        path:'sendattreport', component:SendAttyReportComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
