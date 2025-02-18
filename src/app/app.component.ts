import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { SharedService } from './shared/shared.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ForgotPasswordComponent } from './components/auth/login/forgot-password/forgot-password.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from './components/trader/change-password/change-password.component';
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
username:any;
usertype:any;
  isAdminDashboard = false;


  constructor(private _sharedService: SharedService,private router: Router,private dialog: MatDialog,){}
  
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
       this.username = this.data.user_name
       this.usertype = this.data.user_type
         
    }
  }

  logout() {
      Swal.fire({
        text: 'Do you want to Logout ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        customClass: {
          popup: 'small-swal' // Add a custom class
        }
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.logoutUser();
        }
      });
    }

    openDialog() {
      const dialogRef = this.dialog.open(ChangePasswordComponent, {
        width: '400px', // Adjust width as needed
        maxWidth: '90vw', // Keeps it responsive
        disableClose: false, // Prevents closing on outside click
        panelClass: 'custom-dialog-center', // Custom class for centering
      });
    
      dialogRef.afterClosed().subscribe((message: any) => {
     
      });
    }
    
    
 
  logoutUser() {
    localStorage.clear()
    window.location.href = '#/auth'; 
  }
}
