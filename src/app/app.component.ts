import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { SharedService } from './shared/shared.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,AfterContentChecked{
  title = 'Crypto';
  data: any = {} ;
  isLoading = false;
  isLoading1 = false;
  isTrader = false;
  isAdminDashboard = false;

  constructor(private _sharedService: SharedService,private router: Router,){}
  
  ngOnInit() {
    this._sharedService.isLoading$.subscribe({
      next: (res: any) => {
        if (res) {
          this.isLoading = res;
        } else {
          this.isLoading = res
        }
      }
    })
    this._sharedService.isLoading1$.subscribe({
      next: (res: any) => {
        if (res) {
          this.isLoading1 = res;
        } else {
          this.isLoading1 = res
        }
      }
    })
  }

  ngAfterContentChecked(): void {
    let currentRoute = this.router.routerState.snapshot.url;
    if (currentRoute == "/" || currentRoute == "/auth" || currentRoute == "/auth/sign-up") {
      this.isAdminDashboard = false;
      this.isTrader = false;
    }else if (currentRoute?.split('/')[1] == 'admin') {
      this.isAdminDashboard = true;
      this.isTrader = false;
    }
    else if (currentRoute?.split('/')[1] == 'trader') {
      this.isTrader = true;
      this.isAdminDashboard = false;
    }
    let userData: any = localStorage.getItem('data');
    if (JSON.parse(userData)) {
      this.data = JSON.parse(userData);
    }
  }

  logout() {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to logout',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Logout!',
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.logoutUser();
        }
      });
    }
  logoutUser() {
    localStorage.clear()
    window.location.href = '#/auth'; 
  }
}
