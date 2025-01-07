import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { NafCodeService } from '../service/NafCodeService';
import { ActivityData, CategoryData, SubcategoryData } from './../models/codeNaf';

export interface Options {
  name: string[];
  completed: boolean;
  subOptions?: Options[];
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
    MatCheckboxModule,
  ],
  templateUrl: './nafcode-form.component.html',
  styleUrl: './nafcode-form.component.scss'
})

export class NafcodeFormComponent {
  myControl = new FormControl();
  filteredOptions: Observable<CategoryData[]>;

  constructor(private nafCodeService: NafCodeService) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((inputValue) => this.searchActivities(inputValue || ''))
    );
  }

  private searchActivities(keyword: string): Observable<CategoryData[]> {
    return this.nafCodeService.fetchActivityDataByKeyword(keyword).pipe(
      map((categories: CategoryData[]) =>
        categories.map((category) => ({
          ...category,
          completed: false,
          indeterminate: false,
          subcategories: category.subcategories.map((subcategory) => ({
            ...subcategory,
            completed: false,
            indeterminate: false,
            activities: subcategory.activities.map((activity) => ({
              ...activity,
              completed: false,
            })),
          })),
        }))
      )
    );
  }

    // Mise à jour de la catégorie
    updateCategory(category: CategoryData, completed: boolean): void {
      category.completed = completed;
      category.indeterminate = false;
      category.subcategories.forEach((subcategory) => {
        subcategory.completed = completed;
        subcategory.indeterminate = false;
        subcategory.activities.forEach((activity) => {
          activity.completed = completed;
        });
      });
    }

  // Mise à jour de la sous-catégorie
  updateSubcategory(category: CategoryData, subcategory: SubcategoryData, completed: boolean): void {
    subcategory.completed = completed;
    subcategory.indeterminate = false;
    subcategory.activities.forEach((activity) => {
      activity.completed = completed;
    });

    this.updateCategoryState(category);
  }

  // Mise à jour de l'activité
  updateActivity(
    category: CategoryData,
    subcategory: SubcategoryData,
    activity: ActivityData,
    completed: boolean
  ): void {
    activity.completed = completed;

    this.updateSubcategoryState(subcategory);
    this.updateCategoryState(category);
  }

  // Mise à jour de l'état d'une sous-catégorie
  private updateSubcategoryState(subcategory: SubcategoryData): void {
    const allCompleted = subcategory.activities.every((activity) => activity.completed);
    const anyCompleted = subcategory.activities.some((activity) => activity.completed);

    subcategory.completed = allCompleted;
    subcategory.indeterminate = !allCompleted && anyCompleted;
  }

  // Mise à jour de l'état d'une catégorie
  private updateCategoryState(category: CategoryData): void {
    const allCompleted = category.subcategories.every(
      (subcategory) => subcategory.completed && !subcategory.indeterminate
    );
    const anyCompleted = category.subcategories.some(
      (subcategory) => subcategory.completed || subcategory.indeterminate
    );

    category.completed = allCompleted;
    category.indeterminate = !allCompleted && anyCompleted;
  }
}