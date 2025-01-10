import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ActivityData, CategoryData, SubcategoryData } from './../models/codeNaf';
import { CheckboxStateService } from '../service/checkboxState.service';
import { NafCodeService } from '../service/nafCode.service';
import {MatDividerModule} from '@angular/material/divider';


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
    MatDividerModule
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
      category.subcategories.forEach((subcategory) => {
        subcategory.activities.forEach((activity) => {
          const isActivityCompleted = this.checkboxStateService.getCompletedState(`activity-${activity.id}`);
          activity.completed = isActivityCompleted;
        });

        //* Update subcategory state in case of incoherence
        this.updateSubcategoryState(subcategory);
      });

      //* Same for category
      this.updateCategoryState(category);
    });
  }

  updateCategory(category: CategoryData, completed: boolean): void {
    category.completed = completed;
    category.indeterminate = false;
    category.subcategories.forEach((subcategory) => {
      subcategory.completed = completed;
      subcategory.indeterminate = false;
      subcategory.activities.forEach((activity) => {
        activity.completed = completed;
        this.checkboxStateService.saveCompletedState(`activity-${activity.id}`, activity.nafCode, completed)
      });
    });
  }


  updateSubcategory(category: CategoryData, subcategory: SubcategoryData, completed: boolean): void {
    subcategory.completed = completed;
    subcategory.indeterminate = false;
    subcategory.activities.forEach((activity) => {
      activity.completed = completed;
      this.checkboxStateService.saveCompletedState(`activity-${activity.id}`, activity.nafCode, completed)
    });

    this.updateCategoryState(category);
  }


  updateActivity(category: CategoryData, subcategory: SubcategoryData, activity: ActivityData, completed: boolean): void {
    activity.completed = completed;
    this.checkboxStateService.saveCompletedState(`activity-${activity.id}`, activity.nafCode, completed)

    this.updateSubcategoryState(subcategory);
    this.updateCategoryState(category);

  }


  private updateSubcategoryState(subcategory: SubcategoryData): void {
    const anyCompleted = subcategory.activities.some((activity) => activity.completed);
    const allCompleted = subcategory.activities.every((activity) => activity.completed);

    subcategory.completed = allCompleted;
    subcategory.indeterminate = !allCompleted && anyCompleted;
  }


  private updateCategoryState(category: CategoryData): void {
    const allCompleted = category.subcategories.every((subcategory) => subcategory.completed && !subcategory.indeterminate);
    const anyCompleted = category.subcategories.some((subcategory) => subcategory.completed || subcategory.indeterminate);

    category.completed = allCompleted;
    category.indeterminate = !allCompleted && anyCompleted;

    console.log(this.checkboxStateService.getActivitiesCount());

  }

  updateActivityCount(): number {
    return this.checkboxStateService.getActivitiesCount();
  }

  collapseDiv(div: SubcategoryData | CategoryData): void {
    div.isCollapsed = !div.isCollapsed;
  }

}