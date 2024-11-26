import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule, MatFormFieldControl } from '@angular/material/form-field';
import { CityData, FetchCityService } from '../service/fetchCity.service';
import { FetchCompaniesDataService } from '../service/fetchCompaniesData.service';
import { MapService } from '../service/map.service';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';


export interface SingleCompanyData {
  name: string;
  adress: string;
  activity: string;
  staffSize: string;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
  myControl = new FormControl();


  private debounceTimeout!: any;
  private searchDelay = 25; // ms
  selectedCities: CityData[] = [];
  selectedCity: CityData | null = null;
  citiesSuggestedArray: CityData[] = [];
  companiesFetched: SingleCompanyData[] = [];

  constructor(
    private fetchCityService: FetchCityService,
    private fetchCompaniesDataService: FetchCompaniesDataService,
    private mapService: MapService,

  ) { }


  fetchCitySuggestionsOnInput(inputValue: string) {

    clearTimeout(this.debounceTimeout);

    this.debounceTimeout = window.setTimeout(() => {
      const searchInput = inputValue;

      this.fetchCityService.fetchCities(searchInput).subscribe({
        next: (cities: CityData[]) => {
          this.citiesSuggestedArray = [...cities];
          console.log(this.citiesSuggestedArray);
        },
        error: (err: Error) => console.error('Erreur :', err),
      });
    }, this.searchDelay);
    
  }

  selectCity(city: CityData) {
    const cityAlreadySelected = this.selectedCities.some(selectedCity => selectedCity.code === city.code);
    
    if (cityAlreadySelected) {
      this.selectedCities = this.selectedCities.filter(selectedCity => selectedCity.code !== city.code);
    } else {
      this.selectedCities.push(city);
    }
  }

  searchCompanies() {
    const citiesCodes = this.selectedCities.map(city => city.code);
    this.fetchCompaniesDataService.fetchCompaniesData(citiesCodes).subscribe({
      next: (companiesData) => {
        this.companiesFetched = this.fetchCompaniesDataService.parseEstablishments(companiesData);
        console.log(this.companiesFetched);
        
        this.mapService.addMarkers(this.companiesFetched);
      },
      error: (err) => console.error('Erreur lors de la récupération des données :', err),
    });
  }

  // TODO :
  // timeout -> remplacer par un truc (un gars qui s'appel lesh de rxjs (demander a nico je sais plus))
}

/**
 * @title Simple autocomplete
 */
export class AutocompleteSimpleExample {
  myControl = new FormControl();
  options = [];
  filteredOptions: Observable<any[]>;
  
  constructor(
    private fetchCityService: FetchCityService,
    private http: HttpClient
  ) {

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val) => {
        console.log("this.myControl.value")
        return this.filter(val || '');
      })
    );
  }

  filter(val: string): Observable<any[]> {
    // call the service which makes the http-request
    return this.getData().pipe(
      map((response) =>
        response.filter((option: any) => {
          return option.name.toLowerCase().indexOf(val.toLowerCase()) === 0;
        })
      )
    );
  }

  opts = [];
  getData() {
    return this.opts.length
      ? of(this.opts)
      : this.http
          .get<any>('https://jsonplaceholder.typicode.com/users')
          .pipe(tap((data) => (this.opts = data)));
  }
}
