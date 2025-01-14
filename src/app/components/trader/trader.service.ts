import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TraderService {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }
  //get All coin list wma...
  getAllCoinListWma(key:any): Observable<any> {
    let params: any = {
      key : key,
    }
    if ( key === '' || key === 'null') delete params.key;
    return this.http.get(this.baseUrl + 'api/coin/wma',{
      params:params
    });
  }
  // get coin by id
  getCoinById(id:any) : Observable<any>{
    return this.http.get(this.baseUrl + 'api/coin/' + id)
  }
  // get current price
  getCurrentPriceByTicker(tickerSymbol: string): Observable<any> {
    return this.http.post(this.baseUrl + 'api/sale-target-header/currant-price', { ticker: tickerSymbol});
  }
  // add set target 
  addSetTarget(data:any): Observable<any>{
    return this.http.post(this.baseUrl + 'api/sale-target-header' ,data)
  }
  // get set target by id
  getSetTargetById(id: any): Observable<any> {
    return this.http.get(this.baseUrl + 'api/sale-target-header/' + id)
  }
   //update betting type...
  editSetTarget(id: any, data: any,): Observable<any> {
  return this.http.put(this.baseUrl + 'api/sale-target-header/' + id, data);
  }
  // get set target list
  getAllSetTargetList(page:any,perPage:any,key:any): Observable<any>{
    let params = {
      page: page,
      perPage: perPage,
      key:key
  };
  if (page == '' || perPage == '') {
      delete params.page;
      delete params.perPage;
  }
  if ( key === '' || key === 'null') delete params.key;
    return this.http.get(this.baseUrl + 'api/sale-target-header',{
      params:params
    });
  }
  // update current price
  updateTargetCompitionStatus(): Observable<any>{
    return this.http.put(this.baseUrl + 'api/sale-target-header',null)
  }
  updateSellToSoldStatus(body:any): Observable<any>{
    return this.http.put(this.baseUrl + 'api/sale-target-header/sell-to-sold',body)
  }
  downloadReport():Observable<any>{
    return this.http.get(this.baseUrl + 'api/sale-target-header/download-set-target',{
      responseType: 'blob',
    })
  }
  deleteRecordById(id:any,status:any):Observable<any>{
      let params = new HttpParams().set('status', status);
      return this.http.delete(this.baseUrl + 'api/sale-target-header/' + id,{
      params: params
    });
  }
  getAllCoinList(page:any,perPage:any,key:any):Observable<any>{
    let params = {
      page: page,
      perPage: perPage,
      key:key
    }
    if (page == '' || perPage == '') {
      delete params.page;
      delete params.perPage;
    }
    if ( key === '' || key === 'null') delete params.key;
    return this.http.get(this.baseUrl + 'api/coin', {
      params : params
    })
  }
  getAllCurrentPriceList():Observable<any>{
    return this.http.get(this.baseUrl + 'api/current-price')
  }
    // add set target 
    addupdateCurrentPrice(data:any): Observable<any>{
      return this.http.post(this.baseUrl + 'api/current-price/add-update' ,'')
    }
}
