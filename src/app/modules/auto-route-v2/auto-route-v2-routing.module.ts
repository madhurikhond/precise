import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AutoRouteV2Component } from "./auto-route-v2/auto-route-v2.component";

const route: Routes = [
    { path: '', component: AutoRouteV2Component }
]
@NgModule({
    imports: [RouterModule.forChild(route)],
    exports: [RouterModule],
})
export class AutoRouteV2Routing { }