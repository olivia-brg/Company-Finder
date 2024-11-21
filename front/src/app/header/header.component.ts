import { Component } from '@angular/core';
import { CityData, FetchCityService } from '../service/fetchCity.service';
import { FetchCompaniesDataService } from '../service/fetchCompaniesData.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {

  constructor(
    private fetchCityService: FetchCityService,
    private fetchCompaniesDataService: FetchCompaniesDataService,
  ) { }



  private debounceTimeout!: any;
  private searchDelay = 150; // ms
  selectedCities: CityData[] = [];
  citiesSuggestedArray: CityData[] = [];
  companies: any[] = [];

  fetchCitySuggestionsOnInput() {

    clearTimeout(this.debounceTimeout);

    this.debounceTimeout = window.setTimeout(() => {
      const searchInput = document.getElementById('city_input') as HTMLInputElement;

      this.fetchCityService.fetchCities(searchInput.value).subscribe({
        next: (cities: CityData[]) => {
          this.citiesSuggestedArray = [...cities];
        },
        error: (err: Error) => console.error('Erreur :', err),
      });
    }, this.searchDelay);

  }

  searchCompanies() {    
    const citiesCodes = this.selectedCities.map(city => city.code);
    this.fetchCompaniesDataService.fetchCompaniesData(citiesCodes).subscribe({
      next: (companiesData) => {
        this.companies = companiesData;
        console.log('Données récupérées :', companiesData);
      },
      error: (err) => console.error('Erreur lors de la récupération des données :', err),
    });
  }

  // TODO :
  // timeout -> remplacer par un truc (un gars qui s'appel lesh de rxjs)

  // searchCompanies() {
  //   fetchCompaniesData();
  // }
}

