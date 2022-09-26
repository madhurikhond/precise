import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingService } from './services/common/loading.service';
import { LoadingInterceptorService } from './services/common/loading-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './modules/shared/shared.module';
import { AuthInterceptor } from './modules/core/interceptor/auth.interceptor';
import { CommonMethodService } from './services/common/common-method.service';
import { PatientService } from './services/patient/patient.service';
import { FacilityService } from './services/facillities/facility.service';
import { DatePipe, DecimalPipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
    SharedModule.forRoot(),
    ToastrModule.forRoot({
      preventDuplicates: true,
      maxOpened: 1
    }),
    BrowserAnimationsModule
  ],
  providers: [Title, CommonMethodService,PatientService,FacilityService, DecimalPipe, DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    LoadingInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: (service: LoadingService) => new LoadingInterceptorService(service),
      multi: true,
      deps: [LoadingService]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
