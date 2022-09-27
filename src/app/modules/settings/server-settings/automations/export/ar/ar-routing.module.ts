import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArComponent } from './ar.component';
import { CheckImageAttachmentComponent } from './check-image-attachment/check-image-attachment.component';
import { NewExportFileComponent } from './new-export-file/new-export-file.component';

const routes: Routes = [
  {
    path:'',component:ArComponent,children:[
      {
        path:'',redirectTo:'checkimageattachment',pathMatch:'full'
      },
      {
        path:'checkimageattachment',component:CheckImageAttachmentComponent
      },
      {
        path:'newexportfile',component:NewExportFileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArRoutingModule { }
