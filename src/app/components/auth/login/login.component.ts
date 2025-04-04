import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  form!: FormGroup;
  password: string = '';
  isSubmitted = false;
  passwordVisible: boolean = false;
  trustLogoUrl: SafeResourceUrl;
  constructor(private fb: FormBuilder,private _toastrService: ToastrService,private sanitizer: DomSanitizer,    private _authSerivce: AuthService,private router: Router,private _sharedService: SharedService
  ){ this.trustLogoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.positivessl.com/images/seals/positivessl_trust_seal_md_167x42.png'
  )}
  ngOnInit(): void {
    this.createForm();
    localStorage.clear();
    
  }
    ngAfterViewInit() {
      const script = document.createElement('script');
      script.src = 'https://secure.trust-provider.com/trustlogo/javascript/trustlogo.js';
      script.type = 'text/javascript';
      document.body.appendChild(script);
    }
  // ngAfterViewInit() {
  //   const script = document.createElement('script');
  //   script.src = 'https://secure.trust-provider.com/trustlogo/javascript/trustlogo.js';
  //   script.type = 'text/javascript';
  //   script.onload = () => {
  //     if (typeof (window as any).TrustLogo === 'function') {
  //       (window as any).TrustLogo(
  //         'https://www.positivessl.com/images/seals/positivessl_trust_seal_md_167x42.png',
  //         'POSDV',
  //         'none'
  //       );
  //     }
  //   };
  //   document.body.appendChild(script);
  // }
  
  createForm() {
    this.form = this.fb.group({
      email_id: ['',[Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  get control() {
    return this.form.controls;
  }
  login() {
    this.isSubmitted = true; // Set isSubmitted to true when the login process starts.
    let data = this.form.value;
    localStorage.clear();
    if (this.form.valid) {
      this._authSerivce.login(data).subscribe({
        next: (res: any) => {
          localStorage.setItem('accessToken', res.token);
          localStorage.setItem("untitled_id", res.data.untitled_id);
          localStorage.setItem("email_id",res.data.email_id);
          localStorage.setItem('expiresin', res.expiresIn);
          localStorage.setItem('isLogin', 'true');
          this._sharedService.setIsLogin(true);
          if (res.status == 200 || res.status == 201) {
            localStorage.setItem("data", JSON.stringify(res.data));
            if (res.data.user_type_id == 1) {
              this.router.navigate(['/admin', { outlets: { admin_Menu: 'admin-dashboard' } }]);
            }
            else if (res.data.user_type_id == 2){
              this.router.navigate(['/trader', { outlets: { trader_Menu: 'dashboard' } }]);
            }
            else if (res.data.user_type_id == ''){
              this.router.navigate(['/wm', { outlets: { super_Menu: 'wm-dashboard' } }]);
            }
            else {
              this.router.navigate(['']);
              this._toastrService.warning('Unauthorized');
            }
          }
          else{
            this._toastrService.warning(res.message);
          }
        },
        error: (error: any) => {
          this.isSubmitted = false;
          if (error.error.status == 401 || error.error.status == 422) {
            this._toastrService.warning(error.error.message);
          } else {
            this._toastrService.error("Internal Server Error");
          }
        },
      })
    }else {
      this.isSubmitted = false;
      this.form.markAllAsTouched();
      this._toastrService.warning('Please fill required fields');
    }
  }

  //password show and hide
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
function TrustLogo(trustLogoUrl: SafeResourceUrl, arg1: string, arg2: string) {
  throw new Error('Function not implemented.');
}

