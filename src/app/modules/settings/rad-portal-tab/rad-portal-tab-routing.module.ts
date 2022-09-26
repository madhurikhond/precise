import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';
import { RadPortalTabComponent } from './rad-portal-tab.component';

const route: Routes = [
    {path: '', component: RadPortalTabComponent,canActivate:[RoleGuard]}
]

@NgModule({
    imports: [RouterModule.forChild(route)],
    exports: [RouterModule],
})
export class RadPortalTabRouting{}
