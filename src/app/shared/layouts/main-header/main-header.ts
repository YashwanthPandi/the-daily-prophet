import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './main-header.html',
  styleUrl: './main-header.scss',
})
export class MainHeader {
  currentDate: string = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  issueNumber: number = 1;
}
