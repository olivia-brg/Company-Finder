import { Component } from '@angular/core';
import { CityData, GetCityService } from '../service/getcity.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {

  constructor(
    private getCityService: GetCityService,
  ) {}

  citiesDataArray: CityData[] | Error = [];

  private debounceTimeout!: any;
  private searchDelay = 150; // ms
  citiesSuggestedArray: CityData[] = [];

  fetchCitySuggestionsOnInput() {


    clearTimeout(this.debounceTimeout);

    this.debounceTimeout = window.setTimeout(() => {
      const searchInput = document.getElementById('city_input') as HTMLInputElement;

      this.getCityService.fetchCities(searchInput.value).subscribe({
        next: (cities: CityData[]) => {
          this.citiesSuggestedArray = [...cities];

        },
        error: (err: Error) => console.error('Erreur :', err),
      });
    }, this.searchDelay);

  }

  // TODO :
  // gerer le click sur une ville proposée pour ajouter a la liste des villes select
  // afficher la liste des villes select
  // gerer le click sur une ville select pour la supprimer

  // searchCompanies() {
  //   fetchCompaniesData();
  // }
}

