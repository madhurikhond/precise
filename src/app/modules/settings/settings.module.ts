import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { AutoRouteComponent } from './server-settings/auto-route/auto-route.component';
import { SharedModule } from '../shared/shared.module';
import { TemplateComponent } from './server-settings/template/template.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { PiBillingComponent } from './billing/pi-billing/pi-billing.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DocumentTaggingComponent } from './server-settings/document-tagging/document-tagging.component';
import { SftpComponent } from './server-settings/sftp/sftp.component';
import { CompleteStudyComponent } from './RIS-settings/complete-study/complete-study.component';
import { BookmarkTaggingComponent } from './server-settings/bookmark-tagging/bookmark-tagging.component';
import { UseBookmarkComponent } from './server-settings/use-bookmark/use-bookmark.component';
import { PlayerTypeComponent } from './server-settings/player-type/player-type.component';
import { ClipboardModule } from 'ngx-clipboard';
import { PatientModalityPrepComponent } from './server-settings/patient-modality-prep/patient-modality-prep.component';
// import { BroadcastModule } from './broadcast/broadcast.module';


@NgModule({
  declarations: [SettingsComponent, 
    AutoRouteComponent, 
    TemplateComponent, 
    PatientModalityPrepComponent,
    PiBillingComponent, 
    DocumentTaggingComponent, 
    SftpComponent, 
    CompleteStudyComponent, 
    BookmarkTaggingComponent, 
    UseBookmarkComponent, 
    PlayerTypeComponent,
    ],
  imports: [
    CommonModule,
    SharedModule,
    CKEditorModule,
    BsDatepickerModule.forRoot(),
    SettingsRoutingModule,
    ClipboardModule,
    FormsModule
    // BroadcastModule
  ]
})
export class SettingsModule { }
