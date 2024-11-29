import { Component } from '@angular/core';
import { CityData, FetchCityService } from '../service/fetchCity.service';
import { FetchCompaniesDataService } from '../service/fetchCompaniesData.service';
import { MapService } from '../service/map.service';

export interface SingleCompanyData {
  name: string;
  address: string;
  activity: string;
  staffSize: string;
  latitude: number;
  longitude: number;
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {

  private debounceTimeout!: any;
  private searchDelay = 25; // ms
  selectedCities: CityData[] = [];
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
        this.mapService.addMarkers(this.companiesFetched);
      },
      error: (err) => console.error('Erreur lors de la récupération des données :', err),
    });
  }

  // TODO :
  // timeout -> remplacer par un truc (un gars qui s'appel lesh de rxjs (demander a nico je sais plus))
}