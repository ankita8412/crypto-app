import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../admin.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  searchKey = '';
  untitled_id:any;
  allUserTypeList: Array<any> = [];
  constructor(
    private _toastrService: ToastrService,
    private _adminService: AdminService, private router: Router,
    private fb: FormBuilder,private url: ActivatedRoute) {}
  
    ngOnInit(): void {
    this.createForm();
    this.untitled_id = this.url.snapshot.params['id']
    if (this.untitled_id) {
      this.getUserById(this.untitled_id)
      this.isEdit = true;
    }
    this.getAllUserTypeWmaList();    
  }
  
  createForm() {
    this.form = this.fb.group({
      user_name: [null, Validators.required],
      email_id: [null, Validators.required],
      user_type_id: [null, Validators.required],
      password: [null],
    });
  }
  get control() {
    return this.form.controls;
  }
  getAllUserTypeWmaList(){
    this._adminService.getAllUserTypeWmaList().subscribe({
      next: (res: any) => {
        if (res.data.length> 0) {
          this.allUserTypeList = res.data;
        }
      }
    });
  }
  submit() {
    const actionText = this.isEdit ? 'Edit' : 'Add';
    Swal.fire({
      text: `Do you want to ${actionText} User?`,
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
      this.isEdit ? this.updateUser() : this.addUser()
      }
    });
  }
  addUser() {
    if (this.form.valid) {
      this._adminService.addUser(this.form.getRawValue()).subscribe({
        next: (res: any) => {
          if (res.status == 201 || res.status == 200) {
            this._toastrService.success(res.message);
            this.router.navigate([
              '/admin',
              { outlets: { admin_Menu: 'users' } },
            ]);
          } else {
            this._toastrService.warning(res.message);
          }
        },
        error: (err: any) => {
          if (err.error.status == 422) {
            this._toastrService.warning(err.error.message);
          } else {
            this._toastrService.error('Internal Server Error');
          }
        },
      });
    } else {
      this.form.markAllAsTouched();
      this._toastrService.warning('Fill required fields');
    }
  }
  updateUser() {
    let data = this.form.getRawValue()
    if (this.form.valid) {
      this._adminService
        .updateUser(this.untitled_id, data)
        .subscribe({
          next: (res: any) => {
            if (res.status == 200) {
              this._toastrService.success(res.message)
              this.router.navigate([
                '/admin',
                { outlets: { admin_Menu: 'users' } },
              ]);
              // this._toastrService.clear()
            } else {
              this._toastrService.warning(res.message)
            }
          },
          error: (err: any) => {
            if (err.error.status == 401 || err.error.status == 422) {
              this._toastrService.warning(err.error.message)
            } else {
              this._toastrService.error(err.error.message)
            }
          }
        })
    } else {
      this.form.markAllAsTouched()
      this._toastrService.warning('Fill required fields')
    }
  }
  getUserById(id: any) {
    this._adminService.getUserById(id).subscribe({
      next: (result: any) => {
        const data = result.data
        this.control['user_name'].patchValue(data.user_name)
        this.control['email_id'].patchValue(data.email_id)
        this.control['user_type_id'].patchValue(data.user_type_id)
      }
    })
  }
}
