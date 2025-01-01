import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from 'src/app/shared/auth-guard.service';
import { AdminCoinsComponent } from './admin-coins/admin-coins.component';
import { AdminTargetComponent } from './admin-target/admin-target.component';
import { SetTargetComponent } from './admin-target/set-target/set-target.component';
import { MastersComponent } from './masters/masters.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: "", redirectTo: "admin", pathMatch: "full" },
  {
    path: "",
    component: AdminDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin-dashboard",
    component: AdminDashboardComponent,
    pathMatch: "full",
    outlet: "admin_Menu",
    canActivate: [AuthGuard]
  },
  {
    path: "admin-coins",
    component: AdminCoinsComponent,
    pathMatch: "full",
    outlet: "admin_Menu",
    canActivate: [AuthGuard]
  },
  {
    path: "admin-target",
    component: AdminTargetComponent,
    pathMatch: "full",
    outlet: "admin_Menu",
    canActivate: [AuthGuard]
  },
  {
    path: "add-set-target",
    component: SetTargetComponent,
    pathMatch: "full",
    outlet: "admin_Menu",
    canActivate: [AuthGuard]
  },
  {
    path: "edit-set-target/:id",
    component: SetTargetComponent,
    pathMatch: "full",
    outlet: "admin_Menu",
    canActivate: [AuthGuard]
  },
  {
    path: "masters",
    component: MastersComponent,
    pathMatch: "full",
    outlet: "admin_Menu",
    canActivate: [AuthGuard]
  },
  {
    path: "users",
    component: UsersComponent,
    pathMatch: "full",
    outlet: "admin_Menu",
    canActivate: [AuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
