import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../../../interfaces/toast';

const TOAST_DURATION_MS = 5000;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private nextId = 0;
  private readonly timeouts = new Map<number, ReturnType<typeof setTimeout>>();
  private readonly items = signal<ToastMessage[]>([]);

  readonly toasts = this.items.asReadonly();

  show(message: string): void {
    const id = ++this.nextId;
    this.items.update((current) => [...current, { id, message }]);
    this.timeouts.set(
      id,
      setTimeout(() => this.dismiss(id), TOAST_DURATION_MS),
    );
  }

  dismiss(id: number): void {
    const timeout = this.timeouts.get(id);
    if (timeout !== undefined) {
      clearTimeout(timeout);
      this.timeouts.delete(id);
    }

    this.items.update((current) => current.filter((toast) => toast.id !== id));
  }
}
