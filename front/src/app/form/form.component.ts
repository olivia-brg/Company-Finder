import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class Service {
  constructor(
    private http: HttpClient
  ) {}

  opts = [];

  getData() {
    return this.opts.length
      ? of(this.opts)
      : this.http
          .get<any>('https://jsonplaceholder.typicode.com/users')
          .pipe(tap((data) => (this.opts = data)));
  }
}

/**
 * @title Simple autocomplete
 */
@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.scss'],
})
export class Form {
  myControl = new FormControl();
  options = [];
  filteredOptions: Observable<any[]>;

  constructor(private service: Service) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val) => {
        
        return this.filter(val || '');
      })
    );
  }
  
  filter(val: string): Observable<any[]> {
    // call the service which makes the http-request
    return this.service.getData().pipe(
      map((response) =>
        response.filter((option: any) => {
          console.log(option.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
          
          return option.name.toLowerCase().indexOf(val.toLowerCase()) === 0;
        })
      )
    );
  }
}
