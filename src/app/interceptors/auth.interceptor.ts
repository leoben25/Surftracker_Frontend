import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storedUser = localStorage.getItem('surftracker.auth');

  if (!storedUser) {
    return next(req);
  }

  const currentUser = JSON.parse(storedUser);
  const token = currentUser?.token;

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Basic ${token}`
    }
  });

  return next(authReq);
};