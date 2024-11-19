import { Component } from '@angular/core';
import { GetCityService } from '../service/getcity.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  providers: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
 private debounceTimeout!: any;
  private searchDelay = 150; // ms

  constructor(private getCityService: GetCityService) {}

  fetchCitiesOnInputChange(): void {
    clearTimeout(this.debounceTimeout);

    this.debounceTimeout = window.setTimeout(() => {
      const searchInput = document.getElementById('city_input') as HTMLInputElement;
      if (searchInput?.value) {
        this.getCityService.fetchCities(searchInput.value).subscribe({
          next: (cities: any) => console.log('Villes trouvées :', cities),
          error: (err: any) => console.error('Erreur :', err),
        });
      }
    }, this.searchDelay);
  }


  // searchCompanies() {
  //   fetchCompaniesData();
  // }
}

