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
                console.log(establishment.name + " " + establishment.latitude + " " + establishment.longitude);


                const establishmentsMap = new Map<string, { marker: L.Marker, data: any[] }>();



                try {
                    // Validation et conversion
                    const latitude: number = +establishment.latitude;
                    const longitude: number = +establishment.longitude;

                    if (isNaN(latitude) || isNaN(longitude)) {
                        console.error('Coordonnées invalides :', establishment);
                        return; // Ignorer cet établissement
                    }

                    const coordKey = `${latitude},${longitude}`;

                    console.log(establishmentsMap.has(coordKey));


                    if (establishmentsMap.has(coordKey)) {
                        console.log("what the fuck?");

                        const entry = establishmentsMap.get(coordKey);
                        if (entry) {
                            entry.data.push(establishment); // Ajoutez le nouvel établissement
                            const popupContent = generatePopupContent(entry.data);
                            entry.marker.setPopupContent(popupContent); // Mettre à jour le popup
                        }
                    } else {
                        // Créer un nouveau marker
                        const marker = L.marker([latitude, longitude], {
                            icon: this.updatePinpoint(),
                        });

                        marker.bindPopup(generatePopupContent([establishment]));
                        this.markersLayer.addLayer(marker);

                        // Ajouter le marker à la Map
                        establishmentsMap.set(coordKey, { marker, data: [establishment] });
                    }
                    console.log(establishmentsMap.has(coordKey));
                    console.log('Coordonnées:', coordKey, 'Établissements:', establishmentsMap.get(coordKey)?.data);
                    console.log('Établissement traité :', establishment);
                    console.log('Clé générée :', coordKey);
                    console.log('Map actuelle :', Array.from(establishmentsMap.keys()));
                } catch (error) {
                    console.error('Erreur lors du traitement de l\'établissement :', establishment, error);
                }
                console.log('Map total :', establishmentsMap);
                // Fonction pour générer le contenu du popup pour une liste d'établissements
                function generatePopupContent(establishments: any[]): string {
                    // console.log(establishment);

                    return establishments
                        .map(
                            (e) => `
                        <p>
                          <strong>${e.name}</strong><br>
                          ${e.address}<br>
                          Secteur d'activité : ${e.activity}<br>
                          Effectif : ${e.staffSize}
                        </p>
                        `
                        )
                        .join('<hr>'); // Ajoutez une séparation entre les établissements
                }

                this.markersClusterGroup.addLayer(marker);
                
            //! DEBUG
            //!     console.log(`WITH DATA : ${establishment.name} ${establishment.address} ${establishment.activity} ${establishment.staffSize}`);
            //! } else {
            //!     console.log(`NO DATA : ${establishment.name} ${establishment.address} ${establishment.activity} ${establishment.staffSize}`);

            }
        }
    }

    updatePinpoint(): L.Icon {
        const newIcon = new L.Icon({
            ...L.Icon.Default.prototype.options,
            iconUrl: 'assets/marker-icon.png',
            iconRetinaUrl: 'assets/marker-icon-2x.png',
            shadowUrl: 'assets/marker-shadow.png'
        });

        return newIcon;
    }
}