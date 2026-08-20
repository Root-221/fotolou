import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InstallBanner } from './shared/components/install-banner/install-banner';
import { PwaGuideModal } from './shared/components/pwa-guide-modal/pwa-guide-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InstallBanner, PwaGuideModal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}

