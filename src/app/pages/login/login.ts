import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UI_COMPONENTS } from '../../shared/components/UI/ui-module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ...UI_COMPONENTS],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login({ username: this.username, password: this.password })
      .subscribe(response => {
        console.log(response);
        localStorage.setItem('token', response.data.token);
        this.router.navigate(['/home/dashboard']);
      });
  }
}
