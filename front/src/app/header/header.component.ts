import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CityForm } from '../city-form/city-form.component';
import { CityData } from '../models/city';
import { FetchCompaniesDataService } from '../service/fetchCompaniesData.service';
import { MapService } from '../service/map.service';
import { NafcodeFormComponent } from './../nafcode-form/nafcode-form.component';
import { CheckboxStateService } from './../service/checkboxState.service';
import { StaffSizeSelectionComponent } from '../staff-size-selection/staff-size-selection.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { DepartmentFormComponent } from '../department-form/department-form.component';

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
    NafcodeFormComponent,
    StaffSizeSelectionComponent,
    MatProgressBarModule,
    MatRadioModule,
    FormsModule,
    DepartmentFormComponent
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
    private checkboxStateService: CheckboxStateService,
  ) {}

  searchArea: string = '';
  load: number = 100;

  remove( index: number): void {
    this.selectedCities.splice(index, 1)
  }

  searchCompanies(): void {

    this.fetchCompaniesDataService.load$.subscribe((value) => {
      this.load = value;
    });
    this.selectedCities;
    const citiesCodes = this.selectedCities.map(city => city.code);
    this.fetchCompaniesDataService.fetchCompaniesData(citiesCodes).subscribe({
      next: (companiesData) => {
        this.companiesFetched = this.fetchCompaniesDataService.parseEstablishments(companiesData);
        //! console.log(this.companiesFetched);

        this.mapService.addMarkers(this.companiesFetched);
      },
      error: (err) => console.error('Erreur lors de la récupération des données :', err),
    });
    
  }
  
  updateActivitiesCount(): number {
    return this.checkboxStateService.getActivitiesCount();
  }
}