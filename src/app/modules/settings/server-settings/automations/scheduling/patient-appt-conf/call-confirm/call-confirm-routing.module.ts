import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallConfirmComponent } from './call-confirm.component';
import { GeneralComponent } from './general/general.component';
import { ScriptComponent } from './script/script.component';


const routes: Routes = [
  {
    path:'',component:CallConfirmComponent,children:[
      {
        path:'',redirectTo:'general',pathMatch:'full'
      },
      {
        path:'general',component:GeneralComponent
      },
      {
        path:'script',component:ScriptComponent
      }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallConfirmRoutingModule { }
