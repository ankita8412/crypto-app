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
