import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { SingleCompanyData } from '../header/header.component';


@Injectable({
    providedIn: 'root',
})

export class MapService {
    private map!: L.Map;
    private markersClusterGroup = L.markerClusterGroup(); 

    initializeMap(mapElementId: string): void {
        this.map = L.map(mapElementId, {
            center: [46.87523, 2.27216],
            zoom: 6,
        });

        this.loadTiles();

        this.markersClusterGroup.addTo(this.map);
    }


    private loadTiles(): void {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);
    }

    addMarkers(companiesParsedArray: SingleCompanyData[]): void {
        this.markersClusterGroup.clearLayers();

        for (const establishment of companiesParsedArray) {
            if (establishment.latitude && establishment.longitude) {

                const marker = L.marker([establishment.latitude, establishment.longitude], {
                    icon: this.updatePinpoint(),
                });

                marker.bindPopup(`
                    <p>
                    <strong>${establishment.name}</strong><br>
                    ${establishment.address}<br>
                    Secteur d'activité : ${establishment.activity}<br>
                    Effectif : ${establishment.staffSize}
                    </p>
                `);

                this.markersClusterGroup.addLayer(marker);
            }
        }
    }

    updatePinpoint(): L.Icon {
        const newIcon = new L.Icon({
            iconUrl: "https://img.icons8.com/?size=256&id=uzeKRJIGwbBY&format=png",
            iconSize: [40, 45], // icon size
            iconAnchor: [20, 45], // marker's point of click
            popupAnchor: [0, -45], // offset for popup
        });

        return newIcon;
    }

    updateMarkerIcon(marker: L.Marker): void {
        const newIcon = this.updatePinpoint();
        marker.setIcon(newIcon);
    }
}