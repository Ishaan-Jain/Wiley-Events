import { TestBed } from '@angular/core/testing';

import { WebInterceptorInterceptor } from './web-interceptor.interceptor';

describe('WebInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      WebInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: WebInterceptorInterceptor = TestBed.inject(WebInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
