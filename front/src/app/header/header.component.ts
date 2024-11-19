import { Component } from '@angular/core';
import { HeaderUtils } from './header.utils';
import { CityData } from '../service/getcity.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {

  constructor (private headerUtils: HeaderUtils) {}

  fetchCitiesOnInputChange() {
    
    this.headerUtils.fetchCitiesData()
    console.log();
    
    ;
  }


  // searchCompanies() {
  //   fetchCompaniesData();
  // }
}

