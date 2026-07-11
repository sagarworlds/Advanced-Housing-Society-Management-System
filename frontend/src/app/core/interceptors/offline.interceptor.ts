import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { OfflineSyncService, QueuedRequest } from '../services/offline-sync';
import { MatSnackBar } from '@angular/material/snack-bar';

export const offlineInterceptor: HttpInterceptorFn = (req, next) => {
  const offlineSyncService = inject(OfflineSyncService);
  const snackBar = inject(MatSnackBar);

  if (!navigator.onLine) {
    if (req.method !== 'GET') {
      const queuedReq: QueuedRequest = {
        url: req.url,
        method: req.method,
        body: req.body,
        headers: req.headers,
        timestamp: Date.now()
      };
      
      offlineSyncService.addToQueue(queuedReq);
      snackBar.open('You are offline. Request queued for sync!', 'Close', { duration: 3000 });
    } else {
      snackBar.open('You are offline. Cannot fetch data.', 'Close', { duration: 3000 });
    }
    return throwError(() => new Error('Offline'));
  }

  return next(req).pipe(
    catchError((error) => {
      // Handle sudden drops in connection during the request
      if (!navigator.onLine || error.status === 0) {
        if (req.method !== 'GET') {
          const queuedReq: QueuedRequest = {
            url: req.url,
            method: req.method,
            body: req.body,
            headers: req.headers,
            timestamp: Date.now()
          };
          offlineSyncService.addToQueue(queuedReq);
          snackBar.open('Connection lost. Request queued for sync!', 'Close', { duration: 3000 });
        }
      }
      return throwError(() => error);
    })
  );
};
