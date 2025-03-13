import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    redirectTo: '' ,
    pathMatch: "full",
  },
  {
    path: "",
    loadChildren: () =>
      import("../app/components/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("../app/components/admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "trader",
    loadChildren: () =>
      import("../app/components/trader/trader.module").then((m) => m.TraderModule),
  },
  {
    path: "wm",
    loadChildren: () =>
      import("../app/components/super-admin/super-admin.module").then((m) => m.SuperAdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
