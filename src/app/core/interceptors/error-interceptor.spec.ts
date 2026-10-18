import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ToastService } from '../../shared/components/toast/service/toast-service';
import { ErrorResponse } from '../../shared/interfaces/errors';
import { errorInterceptor } from './error-interceptor';

const errorBody = (message: string): ErrorResponse => ({
  status: 'ERROR',
  timestamp: '2026-10-18T00:00:00',
  message,
});

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    toastService = TestBed.inject(ToastService);
  });

  afterEach(() => {
    for (const toast of toastService.toasts()) {
      toastService.dismiss(toast.id);
    }
    httpMock.verify();
  });

  function failRequest(status: number, body: ErrorResponse | string): boolean {
    let failed = false;
    http.get('/movies').subscribe({ error: () => (failed = true) });
    httpMock.expectOne('/movies').flush(body, { status, statusText: 'Error' });
    return failed;
  }

  it('shows the error message for a 400 response and rethrows it', () => {
    const failed = failRequest(400, errorBody('Invalid year.'));

    expect(failed).toBe(true);
    expect(toastService.toasts().map((toast) => toast.message)).toEqual(['Invalid year.']);
  });

  it('shows the error message for a 500 response and rethrows it', () => {
    const failed = failRequest(500, errorBody('Server failed.'));

    expect(failed).toBe(true);
    expect(toastService.toasts().map((toast) => toast.message)).toEqual(['Server failed.']);
  });

  it('does not show a toast when the response succeeds', () => {
    http.get('/movies').subscribe();
    httpMock.expectOne('/movies').flush([]);

    expect(toastService.toasts()).toEqual([]);
  });

  it('rethrows a client error that does not match the error interface', () => {
    const failed = failRequest(404, 'missing');

    expect(failed).toBe(true);
    expect(toastService.toasts()).toEqual([]);
  });
});
