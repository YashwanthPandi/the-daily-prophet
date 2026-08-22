import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';



@Component({
  selector: 'app-login-component',
  imports: [FormsModule, CommonModule,],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {

  protected readonly window = window;
  protected auth = inject(AuthService);
  

  email:string = '';
  password:string = '';
  errorMessage:string = '';
  loading:boolean = false;
  router: any;

  onLogin() {
    this.errorMessage = '';
    this.loading = true;
 }

}

