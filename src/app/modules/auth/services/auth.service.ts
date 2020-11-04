import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Login } from '../models/login.model';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private userService: UserService,
              private http: HttpClient,
              private router: Router) { }

  login(loginForm: Login): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, loginForm)
      .pipe(tap((user: User) => {
        this.userService.writeUser(user);
      }));
  }

  logout(): void {
    this.userService.deleteUser();
    this.router.navigate(['auth']);
  }
}
