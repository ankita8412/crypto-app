import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AdminService } from '../../admin/admin.service';

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
  constructor(private _adminService: AdminService) {}
  ngOnInit(): void {
    this.getAllSoldSetTargetList();
    this.searchControl.valueChanges.pipe(debounceTime(550))
  }
  // get all active coin list
  getAllSoldSetTargetList() {
    this._adminService.getAllSoldSetTargetList(this.searchKey).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allSoldSetTargetList = res.data;
        } else {
          this.allSoldSetTargetList = [];
        }
      },
    });
  }
  getSearchInput(searchKey: any){
    this.searchKey = searchKey;
    this.getAllSoldSetTargetList();
  }
}

