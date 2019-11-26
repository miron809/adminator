import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { SkyconsModule } from 'ngx-skycons';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { ComposePageComponent } from './compose-page/compose-page.component';
import { EmailPageComponent } from './email-page/email-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    DashboardPageComponent,
    LoginPageComponent,
    SignUpPageComponent,
    ComposePageComponent,
    EmailPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SkyconsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
