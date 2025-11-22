import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { LocationService } from '../services/location.service';

export interface LocationData {
  departments: string[];
}

@Injectable({
  providedIn: 'root'
})
export class LocationResolver implements Resolve<LocationData> {

  constructor(private locationService: LocationService) {}

  resolve(): Observable<LocationData> {
    return forkJoin({
      departments: this.locationService.getAllDepartments()
    });
  }
}