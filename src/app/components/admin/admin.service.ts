import { HttpClient ,HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}
  // add user
  addUser(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'api/admin', data);
  }
  // get wma user type list
  getAllUserTypeWmaList(): Observable<any>{
    return this.http.get(this.baseUrl + 'api/user-type/wma')
  }
  // user enable disable
  userEnableDisable(id: any, status: any,): Observable<any> {
    const body = { status: status };
    let params = new HttpParams().set('status', status);
    return this.http.patch(this.baseUrl + 'api/admin/' + id, body, {
      params: params
    });
  }
  // edit user
  updateUser(id: any, data: any): Observable<any>{
    return this.http.put(this.baseUrl + 'api/admin/' + id, data);
  }
  // get user by id
  getUserById(id:any): Observable<any>{
    return this.http.get(this.baseUrl + 'api/admin/' + id)
  }
  // get all users list
  getAllUsersList(): Observable<any>{
    return this.http.get(this.baseUrl + 'api/admin')
  }
}
