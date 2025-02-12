import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CoinsComponent } from './coins/coins.component';
import { TargetComponent } from './target/target.component';
import { SetTargetComponent } from './target/add-update-set-target/set-target.component';
import { SoldCoinsComponent } from './sold-coins/sold-coins.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'trader', pathMatch: 'full' },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    pathMatch: 'full',
    outlet: 'trader_Menu',
    canActivate: [AuthGuard],
  },
  {
    path: 'coins',
    component: CoinsComponent,
    pathMatch: 'full',
    outlet: 'trader_Menu',
    canActivate: [AuthGuard],
  },
  {
    path: 'target',
    component: TargetComponent,
    pathMatch: 'full',
    outlet: 'trader_Menu',
    canActivate: [AuthGuard],
  },
  {
    path: 'add-set-target',
    component: SetTargetComponent,
    pathMatch: 'full',
    outlet: 'trader_Menu',
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-set-target/:id',
    component: SetTargetComponent,
    pathMatch: 'full',
    outlet: 'trader_Menu',
    canActivate: [AuthGuard],
  },
  {
    path: "sold-coins",
    component:SoldCoinsComponent,
    pathMatch: "full",
    outlet: "trader_Menu",
    canActivate: [AuthGuard]
  },
  {
    path: "change-password",
    component:ChangePasswordComponent,
    pathMatch: "full",
    outlet: "trader_Menu",
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TraderRoutingModule {}
