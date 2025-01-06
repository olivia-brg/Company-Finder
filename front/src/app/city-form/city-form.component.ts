import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { HeaderComponent } from '../header/header.component';

export interface CityData {
  name: string;
  code: number;
  department: string;
  departmentNumber: number;
}

@Injectable({
  providedIn: 'root',
})

export class Service {
  constructor(
    private http: HttpClient,
  ) { }

  opts: CityData[] = [];

  formatCityData(cityName: string): Observable<CityData[]> {
    return this.fetchCityDataByName(cityName).pipe(
      map(rawData =>
        rawData.map((city: { nom: string; departement: { nom: string; code: number; }; code: number; }) => ({
          name: city.nom,
          code: city.code,
          department: city.departement.nom,
          departmentNumber: city.departement.code,
        }))
      ), tap((data) => (this.opts = data))
    );
  }

  fetchCityDataByName(val: string) {
    const encodedCityName = encodeURIComponent(val);
    return this.http
      .get<any>(`https://geo.api.gouv.fr/communes?nom=${encodedCityName}&fields=departement&boost=population&limit=20`);
  }
}

/**
 * @title Simple autocomplete
 */
@Component({
  selector: 'app-city-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: 'city-form.component.html',
  styleUrls: ['city-form.component.scss'],
})

export class CityForm {
  myControl = new FormControl();
  filteredOptions: Observable<CityData[]> = new Observable<CityData[]>();

  constructor(private service: Service, private headerComponent: HeaderComponent) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((inputValue) => {
        return this.service.formatCityData(inputValue || '');
      })
    );
  }

  selectCity(city: CityData) {
    const cityAlreadySelected = this.headerComponent.selectedCities.some(selectedCity => selectedCity.code === city.code);

    if (cityAlreadySelected) {
      this.headerComponent.selectedCities = this.headerComponent.selectedCities.filter(selectedCity => selectedCity.code !== city.code);
    } else {
      this.headerComponent.selectedCities.push(city);
    }
  }
}



