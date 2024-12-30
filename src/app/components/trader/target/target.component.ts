import { Component, OnInit } from '@angular/core';
import { SetTargetComponent } from './set-target/set-target.component';
import { TraderService } from '../trader.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss'],
})
export class TargetComponent implements OnInit {
  page = 1;
  perPage = 50;
  total = 0;
  searchKey: any = '';
  allSetTargetList: Array<any> = [];
  updateStatus: Array<any> = [];
  refreshInterval: any;
  currentPrice: any;
  allCoinList: Array<any> = [];
  tickerSymbol: any;
  currant_price: any;
  coin: any;
  complition_id:any
  untitled_id:any
  constructor(
    private dialog: MatDialog,
    private _traderService: TraderService
  ) {}

  ngOnInit(): void {
    let data: any = localStorage.getItem('data')
    this.untitled_id = JSON.parse(data)?.untitled_id
    this.getAllSetTargetList();
    // Set up the interval
    this.refreshInterval = setInterval(() => {
      this.updateTargetCompitionStatus();
      this.UpdateCurrentPriceStatus();
      this.getAllSetTargetList();
    }, 10000);
  }
  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
  // get all set target list
  // getAllSetTargetList(){
  //   this._traderService.getAllSetTargetList(this.page,this.perPage).subscribe({
  //     next: (res: any) => {
  //       console.log("getAllSetTargetList",res);

  //       if (res.data.length > 0) {
  //         this.allSetTargetList = res.data;
  //         // this.getAllSetTargetList();
  //         this.UpdateCurrentPriceStatus();
  //         // this.total = res.pagination.total;
  //       } else {
  //         this.allSetTargetList = [];
  //         // this.total = 0
  //       }
  //     }
  //   });
  // }

  getAllSetTargetList(): void {
    this._traderService.getAllSetTargetList(this.page, this.perPage).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allSetTargetList = res.data;
          this.allSetTargetList.forEach((item: any) => {
            this.tickerSymbol = this.extractTickerSymbol(item.coin); // Dynamically extract tickerSymbol
  
            if (this.tickerSymbol) {
              this.getCurrentPrice(this.tickerSymbol, (currentPrice) => {
                item.currentPrice = currentPrice || '--'; // Add current price to the item
              });
            } else {
              item.currentPrice = '--'; // Default value if no ticker symbol
            }
          });
        } else {
          this.allSetTargetList = [];
        }
      },
      error: (err: any) => {
        console.error('Error fetching target list:', err);
      },
    });
  }
  

  // Helper function to extract the ticker symbol
  extractTickerSymbol(coin: string): string | null {
    const match = coin.match(/\(([^)]+)\)/); // Regex to extract text within parentheses
    return match ? match[1] : null;
  }
  getCurrentPrice(
    tickerSymbol: string,
    callback: (price: number | null) => void
  ): void {
    if (!tickerSymbol) {
      console.warn('Ticker symbol is required.');
      callback(null);
      return;
    }
    this._traderService.getCurrentPriceByTicker(tickerSymbol).subscribe({
      next: (res: any) => callback(res.data?.currentPrice || null),
      error: () => callback(null),
    });
  }
  // get current price
  UpdateCurrentPriceStatus(): void {
    this.getCurrentPrice(this.tickerSymbol, (price) => {
      if (price !== null) {
        console.log(`Updated current price for ${this.tickerSymbol}:`, price);
      } else {
        console.warn(`Failed to fetch current price for ${this.tickerSymbol}.`);
      }
    });
  }
  updateTargetCompitionStatus() {
    this._traderService.updateTargetCompitionStatus().subscribe({
      next: (res: any) => {},
    });
  }

  submit(item: any, footer: any, currentPrice: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Sold?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Sold!',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.updateSellToSoldStatus(item, footer, currentPrice);
      }
    });
  }


  updateSellToSoldStatus(item: any, footer: any, currentPrice: any) {
    if (!currentPrice || currentPrice === '--') {
      console.error('Cannot update without a valid currentPrice');
      return;
    }
    if (!footer.set_footer_id) {
      console.error('Cannot update without a valid set_footer_id');
      return;
    }
    const body = {
      complition_id: 4,
      currant_price: currentPrice,
      set_footer_id: footer.set_footer_id
    };
    this._traderService.updateSellToSoldStatus(body).subscribe({
      next: (res: any) => {
        console.log("updateSellToSoldStatus successful");
      },
      error: (err: any) => {
        console.error('Error in updateSellToSoldStatus:', err);
      }
    });
  }
  
  // onPageChange(event: PageEvent): void {
  //   this.page = event.pageIndex + 1;
  //   this.perPage = event.pageSize;
  //   this.getAllSetTargetList();
  // }
  //open ...view sports
  openDialog(data?: any) {
    const dialogRef = this.dialog.open(SetTargetComponent, {
      data: data,
      width: '70%',
      panelClass: 'mat-mdc-dialog-container',
    });
    dialogRef.afterClosed().subscribe((message: any) => {
      if (message) {
        this.getAllSetTargetList();
      } else {
        console.log('nothing happen');
      }
    });
  }
}
