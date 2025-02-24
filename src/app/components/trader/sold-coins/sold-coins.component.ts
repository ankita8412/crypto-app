import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AdminService } from '../../admin/admin.service';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { TraderService } from '../trader.service';

@Component({
  selector: 'app-sold-coins',
  templateUrl: './sold-coins.component.html',
  styleUrls: ['./sold-coins.component.scss']
})
export class SoldCoinsComponent implements OnInit{
  page = 1;
  perPage = 50;
  total = 0;
  searchKey: any = '';
  searchControl: FormControl = new FormControl('');
  allSoldSetTargetList: Array<any> = [];
  totalCurrentValue:any;
  constructor(private _adminService: AdminService,private _traderService: TraderService,private _toastrService:ToastrService) {}
  ngOnInit(): void {
    this.getAllSoldSetTargetList();
    this.searchControl.valueChanges.pipe(debounceTime(550))
  }
  // get all active coin list
  getAllSoldSetTargetList() {
    this._adminService.getAllSoldSetTargetList(this.searchKey,this.page,this.perPage).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allSoldSetTargetList = res.data;
          this.totalCurrentValue = res.totalSum;
          this.total = res.pagination.total;
        } else {
          this.allSoldSetTargetList = [];
          this.total = 0 ;
        }
      },
    });
  }
  getSearchInput(searchKey: any){
    this.searchKey = searchKey;
    this.getAllSoldSetTargetList();
  }
    onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;
      this.perPage = event.pageSize;
      this.getAllSoldSetTargetList();
    }
    downloadSoldReport(){
      this._traderService.downloadSoldReport().subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'Sold-Coin-Report.xlsx';  // Set a proper filename
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err: any) => {
          if (err.error.status == 401 || err.error.status == 422) {
            this._toastrService.warning(err.error.message);
          } else {
            this._toastrService.warning('No Data Found');
          }
        }
      })
    }
    refreshPage() {
      // window.location.reload();
      if (this.allSoldSetTargetList.length > 0) {
        this.getAllSoldSetTargetList();
      }
    }
    formatAvailableCoins(value: number): string {
      if (value == null) return "0"; // Agar value null ya undefined ho to "0" show kare
    
      // Agar value integer hai ya decimal part sirf zero hai to sirf integer dikhaye
      if (Number(value) % 1 === 0 || /^(\d+)\.0+$/.test(value.toString())) {
        return Number(value).toFixed(0); // Poora integer rakhe (e.g., "10" instead of "10.0000")
      }
    
      return Number(value).toFixed(4); // Otherwise, 4 decimal places tak dikhaye
    }
    
    
}

