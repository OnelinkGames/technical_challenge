import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastService } from './toast-service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates a toast with the given message', () => {
    service.show('Movie saved.');

    expect(service.toasts()).toEqual([{ id: 1, message: 'Movie saved.' }]);
  });

  it('stacks newer toasts below the previous ones', () => {
    service.show('First');
    service.show('Second');

    expect(service.toasts().map((toast) => toast.message)).toEqual(['First', 'Second']);
  });

  it('removes a toast when it is dismissed', () => {
    service.show('First');
    service.show('Second');

    service.dismiss(1);

    expect(service.toasts().map((toast) => toast.message)).toEqual(['Second']);
  });

  it('removes a toast after 5 seconds', () => {
    service.show('Temporary');

    vi.advanceTimersByTime(4999);
    expect(service.toasts()).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(service.toasts()).toEqual([]);
  });
});
