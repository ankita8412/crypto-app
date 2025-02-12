import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule , HTTP_INTERCEPTORS} from '@angular/common/http';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './shared/auth-guard.service';
import { AuthInterceptorService } from './shared/auth-interceptor.service';
import { SharedModule } from './shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton:true,
    }), 
    SharedModule,
  ],
  providers: [ 
    AuthGuard,
    Title
    ,provideAnimations(), // required animations providers
  provideToastr(),// Toastr providers
  {  
    provide: HTTP_INTERCEPTORS,  
    useClass: AuthInterceptorService,  
    multi: true, 
  },
    { provide: LocationStrategy, useClass: HashLocationStrategy }  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
