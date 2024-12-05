import { Component, OnInit } from '@angular/core';
import { CodeNafService } from './../service/codeNaf.service';
import { CodeNaf } from '../models/codeNaf';

@Component({
  selector: 'app-nafcode-form',
  standalone: true,
  imports: [],
  templateUrl: './nafcode-form.component.html',
  styleUrl: './nafcode-form.component.scss'
})
export class NafcodeFormComponent implements OnInit {
  nafCodes: CodeNaf[] = [];

  constructor(private codeNafService: CodeNafService) {}

  ngOnInit(): void {
    this.codeNafService.getProducts().subscribe((data: CodeNaf[]) => {
      console.log(data);
      this.nafCodes = data;
      console.log('test :', this.nafCodes);
    });
  }

}
