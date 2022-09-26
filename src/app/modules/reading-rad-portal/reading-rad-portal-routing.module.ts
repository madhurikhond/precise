import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { ReadingRadPortalComponent } from './reading-rad-portal/reading-rad-portal.component';

const route: Routes = [
    {
        path: '',
        component: ReadingRadPortalComponent
    },
]
@NgModule({
    imports: [RouterModule.forChild(route)],
    exports: [RouterModule],
})
export class ReadingRadPortaRoutingModule { }
