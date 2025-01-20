import { Component, Injectable } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class StaffSizeSelectionService {

  private dataSource = new BehaviorSubject<string[]>([]);
  public data$ = this.dataSource.asObservable();

  setData(newData: string[]): void {
    this.dataSource.next(newData);
  }
}

@Component({
  selector: 'app-staff-size-selection',
  standalone: true,
  imports: [
    MatSliderModule,
  ],
  templateUrl: './staff-size-selection.component.html',
  styleUrl: './staff-size-selection.component.scss'
})
export class StaffSizeSelectionComponent {

  constructor(
    private staffSizeSelectionService: StaffSizeSelectionService
  ) { }

  data: any = {
    "lowestEmployeesSelection": {
      "00": "0",
      "01": "1",
      "02": "3",
      "03": "6",
      "11": "10",
      "12": "20",
      "21": "50",
      "22": "100",
      "31": "200",
      "41": "500",
      "42": "1000",
      "51": "2000",
      "52": "5000",
    },
    "highestEmployeesSelection": {
      "00": "0",
      "01": "2",
      "02": "5",
      "03": "9",
      "11": "19",
      "12": "49",
      "21": "99",
      "22": "199",
      "31": "499",
      "41": "999",
      "42": "1999",
      "51": "4999",
      "52": "plus de 5000",
    }
  }


  objectKeys: string[] = Object.keys(this.data.lowestEmployeesSelection).sort((a, b) => {
    const valueA = parseInt(this.data.lowestEmployeesSelection[a], 10);
    const valueB = parseInt(this.data.lowestEmployeesSelection[b], 10);
    return valueA - valueB;
  });

  lowestEmployeeValues: string[] = this.objectKeys.map(key => this.data.lowestEmployeesSelection[key]);
  highestEmployeeValues: string[] = this.objectKeys.map(key => this.data.highestEmployeesSelection[key]);



  startThumbValue: number = 0;
  endThumbValue: number = Object.keys(this.data.highestEmployeesSelection).length - 1;

  getKeysInRange(): void {
    const startIndex = Math.min(this.startThumbValue, this.endThumbValue);
    const endIndex = Math.max(this.startThumbValue, this.endThumbValue);

    this.staffSizeSelectionService.setData(this.objectKeys.slice(startIndex, endIndex + 1)); 
    
    // return this.objectKeys.slice(startIndex, endIndex + 1);
  }

  updateStartValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.startThumbValue = parseInt(input.value, 10);

    this.getKeysInRange();
  }

  updateEndValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.endThumbValue = parseInt(input.value, 10);

    this.getKeysInRange();
  }
}
