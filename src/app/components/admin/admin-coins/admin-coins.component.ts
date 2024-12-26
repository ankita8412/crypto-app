import { Component, OnInit } from '@angular/core';
import { TraderService } from '../../trader/trader.service';

@Component({
  selector: 'app-admin-coins',
  templateUrl: './admin-coins.component.html',
  styleUrls: ['./admin-coins.component.scss']
})
export class AdminCoinsComponent implements OnInit{
page = 1;
  perPage = 50;
  total = 0;
  searchKey: any = '';
  allCoinList:Array<any> = [];
  constructor(private _traderService:TraderService){}

  ngOnInit(): void {
    this.getAllSetTargetList();
  }
  // get all set target list
  getAllSetTargetList(){
    this._traderService.getAllSetTargetList(this.page,this.perPage).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.data.length > 0) {
          this.allCoinList = res.data;
          // this.total = res.pagination.total;
        } else {
          this.allCoinList = [];
          // this.total = 0
        }
      }
    });
  }
}
