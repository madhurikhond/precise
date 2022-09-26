import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/guards/auth.guard';  
import { RoleGuard } from '../core/guards/role.guard';
import { CompleteStudyComponent } from './RIS-settings/complete-study/complete-study.component';
import { AutoRouteComponent } from './server-settings/auto-route/auto-route.component';
import { BookmarkTaggingComponent } from './server-settings/bookmark-tagging/bookmark-tagging.component';
import { DocumentTaggingComponent } from './server-settings/document-tagging/document-tagging.component';
import { PlayerTypeComponent } from './server-settings/player-type/player-type.component';
import { SftpComponent } from './server-settings/sftp/sftp.component';
import { TemplateComponent } from './server-settings/template/template.component';
import { UseBookmarkComponent } from './server-settings/use-bookmark/use-bookmark.component';
// import{ BroadcastModule } from './broadcast/broadcast.module'

const routes: Routes = [
  { path: '', redirectTo: 'server-settings/auto-route', pathMatch: 'full' },
  { path: 'server-settings/auto-route', component: AutoRouteComponent, canActivate: [AuthGuard,RoleGuard] },
  { path: 'server-settings/template', component: TemplateComponent, canActivate: [AuthGuard,RoleGuard] },
  { path: 'server-settings/document-tagging', component: DocumentTaggingComponent, canActivate: [AuthGuard,RoleGuard] },
  { path: 'server-settings/bookmark-tagging', component: BookmarkTaggingComponent, canActivate: [AuthGuard,RoleGuard] },
  { path: 'server-settings/use-bookmark', component: UseBookmarkComponent, canActivate: [AuthGuard,RoleGuard] },
  { path: 'server-settings/player-type', component: PlayerTypeComponent, canActivate: [AuthGuard,RoleGuard] },
  { path: 'server-settings/sftp', component: SftpComponent, canActivate: [AuthGuard,RoleGuard] },
  { path: 'billing-settings/pi-billing', loadChildren: () => import('../settings/billing/pi-billing/pi-billing.module').then(m => m.PiBillingModule), canActivate: [AuthGuard,RoleGuard] },
  { path: 'billing-settings/billing-detail', loadChildren: () => import('../settings/billing/billing-detail/billing-detail.module').then(m => m.BillingDetailModule), canActivate: [AuthGuard,RoleGuard] },
  { path: 'server-settings/automations', loadChildren: () => import('../settings/server-settings/automations/automations.module').then(m => m.AutomationsModule), canActivate: [AuthGuard,RoleGuard] },
  { path: 'RIS-settings/alerts',loadChildren: () => import('./RIS-settings/alerts/alerts.module').then(m => m.AlertsModule), canActivate: [AuthGuard,RoleGuard] },
  { path: 'RIS-settings/completed-study', component: CompleteStudyComponent, canActivate: [AuthGuard,RoleGuard] },
  { path: 'logs/communication',loadChildren: () => import('./logs/communication/communication.module').then(m => m.CommunicationModule), canActivate: [AuthGuard,RoleGuard] },
  { path: 'user',loadChildren: () => import('./user/user.module').then(m => m.UserModule), canActivate: [AuthGuard,RoleGuard] },
  { path: 'server-settings/scheduling-facilities-settings',loadChildren: () => import('./server-settings/scheduling-facilities-settings/schedulingfacilitiessettings.module').then(m => m.SchedulingfacilitiessettingsModule), canActivate: [AuthGuard,RoleGuard] },
  { path: 'server-settings/ui',loadChildren: () => import('./server-settings/ui/ui.module').then(m => m.UiModule), canActivate: [AuthGuard,RoleGuard] },
  { path: 'accounting/ar/ar-settings',loadChildren: () => import('./accounting/accounting.module').then(m => m.AccountingModule), canActivate: [AuthGuard,RoleGuard] },
  // { path: 'broadcast',loadChildren: () => import('./broadcast/broadcast.module').then(m => m.BroadcastModule), canActivate: [AuthGuard] },
  { path: 'billing-settings/rad-portal-tab', loadChildren: () => import('../settings/rad-portal-tab/rad-portal-tab.module').then(m => m.RadPortalTabModule), canActivate: [AuthGuard,RoleGuard] },
  { path: 'reminders', loadChildren: () => import('../settings/reminders/reminders.module').then(m => m.RemindersModule), canActivate: [AuthGuard,RoleGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
