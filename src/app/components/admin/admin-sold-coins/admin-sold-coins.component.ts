import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AdminService } from '../admin.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-admin-sold-coins',
  templateUrl: './admin-sold-coins.component.html',
  styleUrls: ['./admin-sold-coins.component.scss']
})
export class AdminSoldCoinsComponent implements OnInit{

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


