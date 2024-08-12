import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-article-page',
  templateUrl: './createArticlePage.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class CreateArticlePage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}
}

