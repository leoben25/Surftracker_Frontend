import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'surftracker.auth';
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasStoredSession());

  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(user: any): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value || this.hasStoredSession();
  }

  getCurrentUser(): any | null {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : null;
  }

  private hasStoredSession(): boolean {
    return !!localStorage.getItem(this.storageKey);
  }
}
