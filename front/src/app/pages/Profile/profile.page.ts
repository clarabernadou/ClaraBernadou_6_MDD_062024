import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['../../app.component.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private router: Router,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {}

  public logout(): void {
    this.tokenService.clearToken()
    this.router.navigate(['/login']);
  }
}
