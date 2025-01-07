import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CityForm } from '../city-form/city-form.component';
import { CityData } from '../models/city';
import { NafcodeFormComponent } from "../nafcode-form/nafcode-form.component";
import { FetchCompaniesDataService } from '../service/fetchCompaniesData.service';
import { MapService } from '../service/map.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';



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
  imports: [
    CityForm,
    MatButtonModule,
    NafcodeFormComponent,
    MatChipsModule,
    MatIconModule,
],
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

  remove(city: CityData, index: number): void {
    this.selectedCities.splice(index, 1)
  }

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
}