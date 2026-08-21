import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InstallBanner } from './shared/components/install-banner/install-banner';
import { DesktopRestriction } from './shared/components/desktop-restriction/desktop-restriction';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InstallBanner, DesktopRestriction],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
