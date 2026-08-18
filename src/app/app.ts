import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InstallBanner } from './shared/components/install-banner/install-banner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InstallBanner],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
