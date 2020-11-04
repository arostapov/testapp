import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<User | undefined>;
  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | undefined>(this.getUser());
  }

  public writeUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public getUser(): User | undefined {
    const user = localStorage.getItem('user');
    if (user && Object.keys(user).length > 0) {
      return JSON.parse(user);
    }
    return undefined;
  }

  public get user(): User | undefined {
    return this.currentUserSubject.value;
  }

  public get user$(): Observable<User | undefined> {
    return this.currentUserSubject.asObservable();
  }

  public deleteUser(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
}
