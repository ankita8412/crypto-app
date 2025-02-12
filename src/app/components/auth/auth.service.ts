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

//to check user and email id is exist
checkUserEmail( user_name:any, email_id:any):Observable<any>{
  let params = {
    user_name:user_name,
    email_id:email_id
  }
  if ( user_name === '' || user_name === 'null' ) delete params.user_name;
  if ( email_id === '' || email_id === 'null' ) delete params.email_id;
  return this.http.get(this.url+'api/gambler/check-data',{
    params:params
  })
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
