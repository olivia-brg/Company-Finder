import { Component } from '@angular/core';
import { CityData, CityForm } from '../city-form/city-form.component';
import { FetchCompaniesDataService } from '../service/fetchCompaniesData.service';
import { MapService } from '../service/map.service';


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
  imports: [CityForm],
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
    private fetchCompaniesDataService: FetchCompaniesDataService,
    private mapService: MapService,
  ) { }

  searchCompanies() {
    this.selectedCities;
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