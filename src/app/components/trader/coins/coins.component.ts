import { Component, OnInit } from '@angular/core';
import { TraderService } from '../trader.service';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.scss']
})
export class CoinsComponent implements OnInit{

page = 1;
  perPage = 50;
  total = 0;
  searchKey: any = '';
  allSetTargetList:Array<any> = [];
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
          this.allSetTargetList = res.data;
          // this.total = res.pagination.total;
        } else {
          this.allSetTargetList = [];
          // this.total = 0
        }
      }
    });
  }
}

