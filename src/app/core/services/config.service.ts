import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private useMockDataSubject = new BehaviorSubject<boolean>(false);
  public useMockData$ = this.useMockDataSubject.asObservable();

  constructor() {
    // Verificar si hay una preferencia guardada
    const savedPreference = localStorage.getItem('useMockData');
    if (savedPreference !== null) {
      this.useMockDataSubject.next(JSON.parse(savedPreference));
    }
  }

  setUseMockData(useMock: boolean): void {
    this.useMockDataSubject.next(useMock);
    localStorage.setItem('useMockData', JSON.stringify(useMock));
  }

  getUseMockData(): boolean {
    return this.useMockDataSubject.value;
  }

  toggleMockData(): void {
    const current = this.useMockDataSubject.value;
    this.setUseMockData(!current);
  }
}