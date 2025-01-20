import { AsyncPipe } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { HeaderComponent } from '../header/header.component';
import { CityData } from '../models/city';
import { FetchCityDataService } from '../service/fetchCityData.service';
import { MatIconModule } from '@angular/material/icon';

@Injectable({
  providedIn: 'root',
})

export class Service {
  constructor(
    private fetchCityDataService: FetchCityDataService,
  ) { }

  opts: CityData[] = [];

  formatCityData(cityName: string): Observable<CityData[]> {
    return this.fetchCityDataService.fetchCityDataByName(cityName).pipe(
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
}


@Component({
  selector: 'app-city-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatIconModule
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



