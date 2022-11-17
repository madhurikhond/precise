import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { StorageService } from 'src/app/services/common/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _storageService:StorageService,private _router:Router) { }

  ngOnInit(): void {
  }
  logOut() {
    this._storageService.clearAll();
    localStorage.removeItem('user');
    localStorage.removeItem('roles');    
    this._router.navigate(['login']);
    localStorage.removeItem('_cr_u_infor');
    localStorage.removeItem('storage');
    localStorage.removeItem('isPermissionChanged');
  }

}
