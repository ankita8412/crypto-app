import { Component, OnInit } from '@angular/core';
import { AddUserComponent } from './add-update-user/add-user.component';
import { MatDialog } from '@angular/material/dialog';
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
    private dialog: MatDialog,
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
  openDialog(data?: any) {
    const dialogRef = this.dialog.open(AddUserComponent, {
      data: data,
      width: '50%',
      panelClass: 'mat-mdc-dialog-container',
    });
    dialogRef.afterClosed().subscribe((message: any) => {
      if (message) {
        this.getAllUsersList();
      } else {
        console.log('nothing happen');
      }
    });
  }
}
