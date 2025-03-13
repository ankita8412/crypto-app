import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth-guard.service';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { SuperAdminTraderComponent } from './super-admin-trader/super-admin-trader.component';
import { SuperAdminSoldCoinsComponent } from './super-admin-sold-coins/super-admin-sold-coins.component';
import { SuperAdminCoinsComponent } from './super-admin-coins/super-admin-coins.component';

const routes: Routes = [
    { path: "", redirectTo: "wm", pathMatch: "full" },
    {
      path: "",
      component: SuperAdminDashboardComponent,
      canActivate: [AuthGuard]
    },
      {
        path: "wm-dashboard",
        component: SuperAdminDashboardComponent,
        pathMatch: "full",
        outlet: "super_Menu",
        canActivate: [AuthGuard]
      },
        {
          path: "wm-target",
          component: SuperAdminTraderComponent,
          pathMatch: "full",
          outlet: "super_Menu",
          canActivate: [AuthGuard]
        },
          {
            path: "wm-sold-coins",
            component: SuperAdminSoldCoinsComponent,
            pathMatch: "full",
            outlet: "super_Menu",
            canActivate: [AuthGuard]
          },
          {
            path: "wm-coins",
            component: SuperAdminCoinsComponent,
            pathMatch: "full",
            outlet: "super_Menu",
            canActivate: [AuthGuard]
          },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
