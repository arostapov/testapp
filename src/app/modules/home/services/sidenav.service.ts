import { Injectable } from '@angular/core';
import {SidenavOptions} from '../models/sidenav';

@Injectable()
export class SidenavService {

  constructor() { }

  set opened(isOpened: boolean) {
    localStorage.setItem('sidenav-options', JSON.stringify({isOpened}));
  }

  get opened(): boolean {
    const sidenavOptions: SidenavOptions = JSON.parse(localStorage.getItem('sidenav-options'));
    if (sidenavOptions) {
      return sidenavOptions.isOpened;
    }
    return false;
  }
}
