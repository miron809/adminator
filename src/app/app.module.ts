import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Provider } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SkyconsModule } from 'ngx-skycons';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { ComposePageComponent } from './compose-page/compose-page.component';
import { EmailPageComponent } from './email-page/email-page.component';
import { LeftSidebarComponent } from './shared/components/left-sidebar/left-sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { MenuButtonService } from './shared/services/menu-button.service';
import { AuthGuard } from './shared/services/auth.guard';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { AuthInterceptor } from './shared/services/auth.interceptor';

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor
}

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    DashboardPageComponent,
    LoginPageComponent,
    SignUpPageComponent,
    ComposePageComponent,
    EmailPageComponent,
    LeftSidebarComponent,
    HeaderComponent,
    ProfilePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SkyconsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule
  ],
  exports: [
    HttpClientModule
  ],
  providers: [INTERCEPTOR_PROVIDER, AuthGuard, MenuButtonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
