import { Component, OnInit } from '@angular/core';
import { SetTargetComponent } from './set-target/set-target.component';
import { TraderService } from '../trader.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { FormControl } from '@angular/forms';

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
    searchControl: FormControl = new FormControl('');
  
  constructor(
    private dialog: MatDialog,
    private _traderService: TraderService,
    private _toastrService:ToastrService
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
        this.searchControl.valueChanges.pipe(debounceTime(550))
    
  }
  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
  getAllSetTargetList(): void {
    this._traderService.getAllSetTargetList(this.page, this.perPage,this.searchKey).subscribe({
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
      },
    });
  }
  getSearchInput(searchKey: any){
    this.searchKey = searchKey;
    this.getAllSetTargetList();
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
      } else {
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
      text: 'Do you want to Sell?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      customClass: {
        popup: 'small-swal' // Add a custom class
      }
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.updateSellToSoldStatus(item, footer, currentPrice);
      }
    });
  }

  updateSellToSoldStatus(item: any, footer: any, currentPrice: any) {
    if (!currentPrice || currentPrice === '--') {
      return;
    }
    if (!footer.set_footer_id) {
      return;
    }
    const body = {
      complition_id: 4,
      currant_price: currentPrice,
      set_footer_id: footer.set_footer_id
    };
    this._traderService.updateSellToSoldStatus(body).subscribe({
      next: (res: any) => {
      },
      error: (err: any) => {
      }
    });
  }

  downloadReport(){
    this._traderService.downloadReport().subscribe({
      next: (blob: Blob) => {
        // Create a new Blob URL for the downloaded file
        const url = window.URL.createObjectURL(blob);

        // Create an anchor element and trigger the download
        const link = document.createElement('a');
        link.href = url;

        // Set the file name
        link.download = 'Sale-Target-Report.xlsx';  // Set a proper filename

        // Append to the DOM and trigger click to download
        link.click();

        // Clean up - revoke the object URL
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        if (err.error.status == 401 || err.error.status == 422) {
          this._toastrService.warning(err.error.message);
        } else {
          this._toastrService.error('Internal Server Error');
        }
      }
    })
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
