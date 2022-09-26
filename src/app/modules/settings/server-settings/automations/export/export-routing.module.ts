import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArSftpComponent } from './ar-sftp/ar-sftp.component';
import { ExportComponent } from './export.component';
import { PatientDocsComponent } from './patient-docs/patient-docs.component';


const routes: Routes = [
{
  path:'',component:ExportComponent,children:[
    {
      path:'',redirectTo:'patientdocs',pathMatch:'full'
    },
    {
      path:'patientdocs',component:PatientDocsComponent
    },
    {
      path:'arsftp',component:ArSftpComponent
    },
    {
      path:'ar',loadChildren: () => import('./ar/ar.module').then(m => m.ArModule)
    },
  ]
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportRoutingModule { }
