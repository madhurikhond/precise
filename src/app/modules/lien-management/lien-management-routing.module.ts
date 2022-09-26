import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LienManagementComponent } from './lien-management/lien-management.component';

const route: Routes = [
    { path: '', component: LienManagementComponent}
]

@NgModule({
    imports: [RouterModule.forChild(route)],
    exports: [RouterModule]
})
export class LienManagementRouterModule{}
