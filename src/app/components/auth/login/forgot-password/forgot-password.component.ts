import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit{
  form!: FormGroup;
  password: string = '';
  isSubmitted = false;
  passwordVisible: boolean = false;
  dialogRef: any;

  constructor(private fb: FormBuilder,private _toastrService: ToastrService,   @Inject(MAT_DIALOG_DATA) public data: any,
    private _authSerivce: AuthService,private router: Router,private _sharedService: SharedService
  ){}
  ngOnInit(): void {
    this.createForm();
    // localStorage.clear();
    
  }
  createForm() {
    this.form = this.fb.group({
      email_id: ['',[Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  get control() {
    return this.form.controls;
  }
  closeDialog(message?: any) {
    this.dialogRef.close(message);
  }

  //password show and hide
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
