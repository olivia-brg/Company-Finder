import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { HeaderComponent } from '../header/header.component';

export interface ActivityData {
  name: string;
  nafCode: string;
}

export interface SubcategoryData {
  name: string;
  activity: ActivityData[];
}

export interface CategoryData {
  name: string;
  subcategories: SubcategoryData[];
}

@Injectable({
  providedIn: 'root',
})

export class Service {
  constructor(private http: HttpClient) {}

  fetchActivityDataByKeyword(val: string) {
    const encodedKeyword = encodeURIComponent(val);
    return this.http.get<CategoryData[]>(`http://localhost:8080/search?keyword=${encodedKeyword}`);
  }
}

@Component({
  selector: 'app-nafcode-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './nafcode-form.component.html',
  styleUrl: './nafcode-form.component.scss'
})


export class NafcodeFormComponent {
  myControl = new FormControl();
  filteredOptions: Observable<CategoryData[]>;

  constructor(private service: Service, private headerComponent: HeaderComponent) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(100), // Augmenter le délai pour éviter des requêtes trop rapides
      distinctUntilChanged(),
      switchMap((inputValue) => {
        return this.service.fetchActivityDataByKeyword(inputValue || '');
      })
    );
  }
}