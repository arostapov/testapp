import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {take} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  returnUrl: string;
  loginErrorMessage: string;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    this.loginErrorMessage = '';
  }

  hasEmailError(formControl: AbstractControl): boolean {
    return formControl.hasError('email') && !formControl.hasError('required');
  }

  hasRequiredError(formControl: AbstractControl): boolean {
    return formControl.hasError('required');
  }

  login(): void {
    if (this.loginFormGroup.invalid) {
      return;
    }

    this.authService.login(this.loginFormGroup.value)
      .pipe(take(1))
      .subscribe(
        res => {
          console.log(res);
          this.router.navigate([this.returnUrl]);
          this.loginErrorMessage = '';
        },
        error => {
          this.loginErrorMessage = error.error.message;
        }
      );
  }

}
