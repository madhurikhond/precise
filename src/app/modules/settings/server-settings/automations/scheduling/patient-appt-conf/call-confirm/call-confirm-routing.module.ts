import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { CallConfirmComponent } from './call-confirm.component';
import { GeneralComponent } from './general/general.component';
import { ScriptComponent } from './script/script.component';


const routes: Routes = [
  {
    path:'',component:CallConfirmComponent,children:[
      {
        path:'',redirectTo:'general',pathMatch:'full',canActivate:[RoleGuard]
      },
      {
        path:'general',component:GeneralComponent,canActivate:[RoleGuard]
      },
      {
        path:'script',component:ScriptComponent,canActivate:[RoleGuard]
      }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallConfirmRoutingModule { }
