import { AfterViewInit, Component } from '@angular/core';
import { MapService } from '../service/map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})

export class MapComponent implements AfterViewInit {
  constructor(private mapService: MapService) {}

  ngAfterViewInit(): void {
    this.mapService.initializeMap('map');
  }
}
