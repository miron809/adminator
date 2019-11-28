import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { EmailPageComponent } from './email-page/email-page.component';
import { ComposePageComponent } from './compose-page/compose-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { AuthGuard } from './shared/services/auth.guard';


const routes: Routes = [
  {path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuard]},
      {path: 'email', component: EmailPageComponent, canActivate: [AuthGuard]},
      {path: 'compose', component: ComposePageComponent, canActivate: [AuthGuard]}
    ]
  },
  {path: 'login', component: LoginPageComponent},
  {path: 'sign-up', component: SignUpPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
