import { Component } from '@angular/core';
import { HeaderUtils, CityData } from './header.utils';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  // Delay fetchCities(), évite bug d'affichage lors de frappe trop rapide
  private debounceTimeout!: any;
  callFetchCities() {
    clearTimeout(this.debounceTimeout);

    this.debounceTimeout = setTimeout(() => {
      HeaderUtils.fetchCities((document.getElementById("city_input") as HTMLInputElement)?.value);
    }, 150); // <- valeur en ms du delay
  }

  // searchCompanies() {
  //   fetchCompaniesData();
  // }
}

