import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { ArComponent } from './ar.component';
import { CheckImageAttachmentComponent } from './check-image-attachment/check-image-attachment.component';
import { NewExportFileComponent } from './new-export-file/new-export-file.component';

const routes: Routes = [
  {
    path:'',component:ArComponent,children:[
      {
        path:'',redirectTo:'checkimageattachment',pathMatch:'full',canActivate:[RoleGuard]
      },
      {
        path:'checkimageattachment',component:CheckImageAttachmentComponent,canActivate:[RoleGuard]
      },
      {
        path:'newexportfile',component:NewExportFileComponent,canActivate:[RoleGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArRoutingModule { }
