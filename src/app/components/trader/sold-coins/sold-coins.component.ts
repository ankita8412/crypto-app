import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AdminService } from '../../admin/admin.service';
import { PageEvent } from '@angular/material/paginator';

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
  constructor(private _adminService: AdminService) {}
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
}

