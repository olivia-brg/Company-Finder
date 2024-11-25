import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { SingleCompanyData } from '../header/header.component';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: L.Map;
  private markersLayer = L.layerGroup();

  initializeMap(mapElementId: string): void {
    this.map = L.map(mapElementId, {
      center: [46.87523, 2.27216],
      zoom: 6,
    });

    this.loadTiles();

    this.markersLayer.addTo(this.map);
  }

  private loadTiles(): void {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);
  }

  addMarkers(companiesParsedArray: SingleCompanyData[]): void {
    this.markersLayer.clearLayers();

    for (const establishment of companiesParsedArray) {
      const marker = L.marker([establishment.latitude, establishment.longitude]);

      marker.bindPopup(`
        <p>
          <strong>${establishment.name}</strong><br>
          ${establishment.adress}<br>
          Secteur d'activité : ${establishment.activity}<br>
          Effectif : ${establishment.staffSize}
        </p>
      `);

      this.markersLayer.addLayer(marker);
    }
  }
}
