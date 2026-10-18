import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  readonly title = input.required<string>();
}
