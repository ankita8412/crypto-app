import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/shared.service';
import { LoginComponent } from '../../auth/login/login.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent  implements OnInit{
  form!: FormGroup;
  password: string = '';
  isSubmitted = false;
  passwordVisible: boolean = false;
  newpasswordVisible : boolean = false;

  constructor(private fb: FormBuilder,private _toastrService: ToastrService,  public dialogRef: MatDialogRef<LoginComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _authSerivce: AuthService,private router: Router,private _sharedService: SharedService
  ){}
  ngOnInit(): void {
    this.createForm();
    // localStorage.clear();
    
  }
  createForm() {
    this.form = this.fb.group({
      email_id: ['',[Validators.required, Validators.email]],
      new_email: ['',[Validators.required, Validators.email]],
      password: ['', Validators.required],
      new_password : ['', Validators.required],
    });
  }
  get control() {
    return this.form.controls;
  }
  changePassword() {
    let data = this.form.value;
   
    if (this.form.valid) {
      this._authSerivce.changePassword(data).subscribe({
        next: (res: any) => {
          if (res.status === 200 || res.status === 201) {
            this._toastrService.success(res.message);
            this.logoutUser();
           
          } else {
           
            this._toastrService.warning(res.message);
          }
        },
        error: (err: any) => {
          if (err.error.status === 401 || err.error.status === 422) {
            this._toastrService.warning(err.error.message);
          } else {
            this._toastrService.warning(err.error.message);
          }
        }
      });
    } else {
      this.form.markAllAsTouched();
      this._toastrService.warning('Fill required fields');
    }
  }
  closeDialog(message?: any) {
    this.dialogRef.close(message);
  }

  //password show and hide
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  toggleNewPasswordVisibility() {
    this.newpasswordVisible = !this.newpasswordVisible;
  }
  logoutUser() {
    localStorage.clear()
    window.location.href = '#/auth'; 
  }
}
