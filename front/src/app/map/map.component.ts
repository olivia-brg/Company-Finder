import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss', '../../../node_modules/leaflet/dist/leaflet.css']
})
export class MapComponent implements OnInit, AfterViewInit {

  private map!: L.Map;

  ngOnInit(): void {
    this.configMap();
  }

  configMap() {
    this.map = L.map('map', {
      center: [46.87523, 2.27216],
      zoom: 6
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  ngAfterViewInit(): void {
    // this.configMap();
    
  }
}