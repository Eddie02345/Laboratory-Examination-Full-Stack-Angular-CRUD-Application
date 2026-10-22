import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { GymLeader } from '../models/gym-leader.model';

@Injectable({
  providedIn: 'root'
})
export class GymLeaderService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/leaders';

  readonly leaders = signal<GymLeader[]>([]);

  readonly kantoCount = computed(
    () => this.leaders().filter((l) => l.region === 'Kanto').length
  );
  readonly johtoCount = computed(
    () => this.leaders().filter((l) => l.region === 'Johto').length
  );
  readonly hoennCount = computed(
    () => this.leaders().filter((l) => l.region === 'Hoenn').length
  );

  fetchLeaders(): void {
    this.http.get<GymLeader[]>(this.apiUrl).subscribe({
      next: (data) => this.leaders.set(data),
      error: () => this.leaders.set([])
    });
  }

  getLeader(id: string): Observable<GymLeader> {
    return this.http.get<GymLeader>(`${this.apiUrl}/${id}`);
  }

  addLeader(leader: Omit<GymLeader, '_id'>): Observable<GymLeader> {
    return this.http.post<GymLeader>(this.apiUrl, leader).pipe(
      tap((newLeader) => {
        this.leaders.update((list) => [newLeader, ...list]);
      })
    );
  }

  updateLeader(id: string, leader: Partial<GymLeader>): Observable<GymLeader> {
    return this.http.put<GymLeader>(`${this.apiUrl}/${id}`, leader).pipe(
      tap((updated) => {
        this.leaders.update((list) =>
          list.map((item) => (item._id === id ? updated : item))
        );
      })
    );
  }

  deleteLeader(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.leaders.update((list) => list.filter((item) => item._id !== id));
      })
    );
  }
}