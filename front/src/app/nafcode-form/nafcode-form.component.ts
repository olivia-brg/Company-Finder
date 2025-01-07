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
import { CheckboxStateService } from '../service/checkboxState.service';


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

  constructor(
    private nafCodeService: NafCodeService,
    private checkboxStateService: CheckboxStateService,
  ) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((inputValue) =>
        this.nafCodeService.fetchActivityDataByKeyword(inputValue || '').pipe(
          map((categories) => {
            this.restoreCheckboxStates(categories);
            return categories;
          })
        )
      )
    );
  }


  restoreCheckboxStates(categories: CategoryData[]): void {
    categories.forEach((category) => {
      const isCategoryCompleted = this.checkboxStateService.getCompletedState(`category-${category.id}`);
      const isCategoryIndeterminate = this.checkboxStateService.getIndeterminateState(`category-${category.id}`);
      category.completed = isCategoryCompleted;
      category.indeterminate = isCategoryIndeterminate;

      category.subcategories.forEach((subcategory) => {
        const isSubcategoryCompleted = this.checkboxStateService.getCompletedState(`subcategory-${subcategory.id}`);
        const isSubcategoryIndeterminate = this.checkboxStateService.getIndeterminateState(`subcategory-${subcategory.id}`);
        subcategory.completed = isSubcategoryCompleted;
        subcategory.indeterminate = isSubcategoryIndeterminate;

        subcategory.activities.forEach((activity) => {
          const isActivityCompleted = this.checkboxStateService.getCompletedState(`activity-${activity.id}`);
          activity.completed = isActivityCompleted;
        });

        // Recalculer l'état de la sous-catégorie en cas d'incohérence
        this.updateSubcategoryState(subcategory);
      });

      // Recalculer l'état de la catégorie en cas d'incohérence
      this.updateCategoryState(category);
    });
  }

  updateCategory(category: CategoryData, completed: boolean): void {
    this.checkboxStateService.saveCompletedState(`category-${category.id}`, completed);
    category.completed = completed;
    category.indeterminate = false;
    category.subcategories.forEach((subcategory) => {
      this.checkboxStateService.saveCompletedState(`subcategory-${subcategory.id}`, completed);
      subcategory.completed = completed;
      subcategory.indeterminate = false;
      subcategory.activities.forEach((activity) => {
        this.checkboxStateService.saveCompletedState(`activity-${activity.id}`, completed);
        activity.completed = completed;
      });
    });
  }


  updateSubcategory(category: CategoryData, subcategory: SubcategoryData, completed: boolean): void {
    this.checkboxStateService.saveCompletedState(`subcategory-${subcategory.id}`, completed);
    subcategory.completed = completed;
    subcategory.indeterminate = false;
    subcategory.activities.forEach((activity) => {
      this.checkboxStateService.saveCompletedState(`activity-${activity.id}`, completed);
      activity.completed = completed;
    });

    this.updateCategoryState(category);
  }


  updateActivity(category: CategoryData, subcategory: SubcategoryData, activity: ActivityData, completed: boolean): void {
    this.checkboxStateService.saveCompletedState(`activity-${activity.id}`, completed);
    activity.completed = completed;

    this.updateSubcategoryState(subcategory);
    this.updateCategoryState(category);
  }


  private updateSubcategoryState(subcategory: SubcategoryData): void {
    const anyCompleted = subcategory.activities.some((activity) => activity.completed);
    const allCompleted = subcategory.activities.every((activity) => activity.completed);

    subcategory.completed = allCompleted;
    subcategory.indeterminate = !allCompleted && anyCompleted;

    this.checkboxStateService.saveCompletedState(`subcategory-${subcategory.id}`, allCompleted);
    this.checkboxStateService.saveIndeterminateState(`subcategory-${subcategory.id}`, subcategory.indeterminate);
  }


  private updateCategoryState(category: CategoryData): void {
    const allCompleted = category.subcategories.every((subcategory) => subcategory.completed && !subcategory.indeterminate);
    const anyCompleted = category.subcategories.some((subcategory) => subcategory.completed || subcategory.indeterminate);

    category.completed = allCompleted;
    category.indeterminate = !allCompleted && anyCompleted;

    this.checkboxStateService.saveCompletedState(`category-${category.id}`, allCompleted);
    this.checkboxStateService.saveIndeterminateState(`category-${category.id}`, category.indeterminate);
  }
}