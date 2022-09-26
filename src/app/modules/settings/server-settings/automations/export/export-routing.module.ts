import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { ArSftpComponent } from './ar-sftp/ar-sftp.component';
import { ExportComponent } from './export.component';
import { PatientDocsComponent } from './patient-docs/patient-docs.component';


const routes: Routes = [
{
  path:'',component:ExportComponent,children:[
    {
      path:'',redirectTo:'patientdocs',pathMatch:'full',canActivate:[RoleGuard]
    },
    {
      path:'patientdocs',component:PatientDocsComponent,canActivate:[RoleGuard]
    },
    {
      path:'arsftp',component:ArSftpComponent,canActivate:[RoleGuard]
    },
    {
      path:'ar',loadChildren: () => import('./ar/ar.module').then(m => m.ArModule),canActivate:[RoleGuard]
    },
  ]
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportRoutingModule { }
