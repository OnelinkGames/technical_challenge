import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Card } from './card';

@Component({
  imports: [Card],
  template: `<app-card title="Years"><p>Projected content</p></app-card>`,
})
class CardHost {}

describe('Card', () => {
  let fixture: ComponentFixture<CardHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHost],
    }).compileComponents();

    fixture = TestBed.createComponent(CardHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.nativeElement.querySelector('app-card')).toBeTruthy();
  });

  it('renders the title and projected content', () => {
    const card = fixture.nativeElement.querySelector('article') as HTMLElement;

    expect(card.querySelector('h2')?.textContent).toContain('Years');
    expect(card.querySelector('p')?.textContent).toContain('Projected content');
  });
});
