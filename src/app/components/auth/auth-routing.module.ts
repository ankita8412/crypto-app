import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "auth",
    pathMatch:'full'
  },
  {
    path: "auth",
    component: LoginComponent,
    pathMatch: "full",
  },  
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    pathMatch: "full",
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
   
 }

