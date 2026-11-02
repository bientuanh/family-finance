import { Component } from '@angular/core';
import { NgxLoadingBar } from '@ngx-loading-bar/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxLoadingBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
