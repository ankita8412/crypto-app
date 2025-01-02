import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminService } from '../admin.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  form!: FormGroup;
  searchKey = '';
  allUserList: Array<any> = [];
  searchControl: FormControl = new FormControl('');
  constructor(
    private _adminService: AdminService,
    private _toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllUsersList();
    this.searchControl.valueChanges.pipe(debounceTime(550))
  }
  getSearchInput(searchKey: any){
    this.searchKey = searchKey;
    this.getAllUsersList();
  }
  getAllUsersList() {
    this._adminService.getAllUsersList(this.searchKey).subscribe({
      next: (res: any) => {
        if (res.data) {
          this.allUserList = res.data;
          // this.total = res.pagination.total;
        } else {
          this.allUserList = [];
          // this.total = 0
        }
      },
    });
  }
  //Enable Disable
  changeEvent(event: any, id: any) {
    let status = 0;
    if (event.checked) {
      status = 1;
    }
    this._adminService.userEnableDisable(id, status).subscribe({
      next: (res: any) => {
        this._toastrService.success(res.message);
        this._toastrService.clear();
        this.getAllUsersList();
      },
      error: (error: any) => {
        if (error.status == 422) {
          this._toastrService.warning(error.message);
        }
      },
    });
  }
}
