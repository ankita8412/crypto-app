import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.baseUrl;
    httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    constructor(private http: HttpClient) { }

 // admin login
 login(data: any): Observable<any> {
  return this.http.post(this.url + 'api/admin/login', data, {
    headers: this.httpHeaders,
  });
}



//Change password
changePassword(data: any): Observable<any> {
  return this.http.put(this.url + 'api/admin/change-password', data);
}
 //verify email_id
 verifyEmail_id(data: any): Observable<any> {
  return this.http.post(this.url + 'api/admin/check-emailid', data);
}
//send otp
sendOTP(data: any): Observable<any> {
  return this.http.post(this.url + 'api/admin/send-otp', data);
}
//verify otp
verifyOTP(data: any): Observable<any> {
  return this.http.post(this.url + 'api/admin/verify-otp', data);
}
//forget password
forgotPassword(data: any): Observable<any> {
  return this.http.post(this.url + 'api/admin/forgot-Password', data);
}
//verify email_id sign up
sendOTPIfEmailNotExist(data: any): Observable<any> {
  return this.http.post(
    this.url + 'api/admin/send-otp-if-email-not-exists',
    data
  );
}

public isAuthenticated(): boolean {
  return this.getToken() !== null;
}
getToken() {
  let accessToken = localStorage.getItem('accessToken');
  if (accessToken != null) {
    return accessToken;
  }
  return null;
} 
}
