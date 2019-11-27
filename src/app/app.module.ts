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
import { LeftSidebarComponent } from './shared/components/left-sidebar/left-sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { MenuButtonService } from './shared/services/menu-button.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SkyconsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [MenuButtonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
