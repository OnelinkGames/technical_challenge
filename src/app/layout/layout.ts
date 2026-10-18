import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Toast } from '../shared/components/toast/toast';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Toast],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
