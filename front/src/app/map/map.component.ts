import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

interface SingleCompanyData {
  name: string;
  adress: string;
  activity: string;
  staffSize: string;
  latitude: number;
  longitude: number;
}

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

  ngAfterViewInit(): void {
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

  createMarkers(companiesParsedArray: SingleCompanyData[]) {
    // markers.clearLayers();
    for (let establishment of companiesParsedArray) {
      let marker = L.marker([establishment.latitude, establishment.longitude], {
  
      });
      marker.bindPopup(
        `<p>${establishment.name}<br>${establishment.adress}<br>Secteur d'activité : ${establishment.activity}<br>Effectif : ${establishment.staffSize}`
      );
      this.map.addLayer(marker);
    }
  }

}