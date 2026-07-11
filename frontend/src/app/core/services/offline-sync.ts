import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { openDB, IDBPDatabase } from 'idb';

export interface QueuedRequest {
  id?: number;
  url: string;
  method: string;
  body: any;
  headers: any;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineSyncService {
  private dbPromise: Promise<IDBPDatabase>;
  private http = inject(HttpClient);

  constructor() {
    this.dbPromise = openDB('SocietyAppDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('sync-queue')) {
          db.createObjectStore('sync-queue', { keyPath: 'id', autoIncrement: true });
        }
      },
    });

    window.addEventListener('online', () => this.replayQueue());
  }

  async addToQueue(request: QueuedRequest): Promise<void> {
    const db = await this.dbPromise;
    await db.add('sync-queue', request);
  }

  async replayQueue(): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction('sync-queue', 'readwrite');
    const store = tx.objectStore('sync-queue');
    const requests: QueuedRequest[] = await store.getAll();

    for (const req of requests) {
      this.http.request(req.method, req.url, {
        body: req.body,
        headers: req.headers
      }).subscribe({
        next: () => {
          db.delete('sync-queue', req.id!);
        },
        error: (err) => {
          console.error('Failed to replay request, leaving in queue', err);
        }
      });
    }
  }
}
