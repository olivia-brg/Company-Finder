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

  // private map!: L.Map;

  ngOnInit(): void {
    // this.configMap();
  }

  map:any;

  configMap() {
    this.map = L.map('map', {
      center: [47.218371, -1.553621],
      zoom: 13
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.configMap();
    // this.map = L.map('map', {}).setView([47.218371, -1.553621], 13);
    
    // L.tileLayer('https:// tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '© OpenStreetMap contributors'
    // }).addTo(this.map);
  }
}