import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  //get All users  wma...
  getAllUsersListWma(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/admin/wma');
  }
  getAllReachedSetTargetList(key: any, page: any, perPage: any, untitled_id: any,): Observable<any> {
    let params = {
      key: key,
      page: page,
      perPage: perPage,
      untitled_id: untitled_id,
    };
    if (key === '' || key === 'null') delete params.key;
    if (page == '' || perPage == '') {
      delete params.page;
      delete params.perPage;
    }
    if (untitled_id == '' || untitled_id == 'null' || untitled_id == undefined) {
      delete params['untitled_id'];
    }
    return this.http.get(this.baseUrl + 'api/sale-target-header/all-reached', {
      params: params
    });
  }
  getAllSetTargetList(key: any, page: any, perPage: any, untitled_id: any,): Observable<any> {
    let params = {
      key: key,
      page: page,
      perPage: perPage,
      untitled_id: untitled_id,
    };
    if (key === '' || key === 'null') delete params.key;
    if (page == '' || perPage == '') {
      delete params.page;
      delete params.perPage;
    }
    if (untitled_id == '' || untitled_id == 'null' || untitled_id == undefined) {
      delete params['untitled_id'];
    }
    return this.http.get(this.baseUrl + 'api/sale-target-header/all-set-target', {
      params: params
    });
  }
  getAllSoldSetTargetList(key: any, page: any, perPage: any, untitled_id: any,): Observable<any> {
    let params = {
      key: key,
      page: page,
      perPage: perPage,
      untitled_id: untitled_id,
    };
    if (key === '' || key === 'null') delete params.key;
    if (page == '' || perPage == '') {
      delete params.page;
      delete params.perPage;
    }
    if (untitled_id == '' || untitled_id == 'null' || untitled_id == undefined) {
      delete params['untitled_id'];
    }
    return this.http.get(this.baseUrl + 'api/sale-target-header/all-sold-coin', {
      params: params
    });
  }
   // add set target 
   addupdateCurrentPrice(data:any): Observable<any>{
    return this.http.post(this.baseUrl + 'api/current-price/all-add-update' ,'')
  }
}
