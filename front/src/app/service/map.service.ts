import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { SingleCompanyData } from '../header/header.component';
// import 'leaflet.markercluster';


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

                // const clusterGroup = L.markerClusterGroup();
                // clusterGroup.addLayer(marker);

            }
        }
    }

    coordinatesSet = new Set<string>();
    addEstablishment(x: number, y: number, etab: string): boolean {
        const coordKey = `${x},${y}`;
        if (this.coordinatesSet.has(coordKey)) {
            console.log('Coordonnées déjà utilisées:', coordKey + " etablissement : " + etab);
            return false;
        }
        this.coordinatesSet.add(coordKey);
        console.log('Coordonnées ajoutées:', coordKey + " etablissement : " + etab);
        return true;
    }

    updatePinpoint(): L.Icon {
        const newIcon = new L.Icon({
            iconUrl: "https://img.icons8.com/?size=256&id=uzeKRJIGwbBY&format=png",
            iconSize: [40, 45], // Taille de l'icône
            iconAnchor: [20, 45], // Point qui correspond à la position du marqueur
            popupAnchor: [0, -45], // Décalage pour ouvrir le popup au-dessus de l'icône
        });

        return newIcon;
    }

    updateMarkerIcon(marker: L.Marker): void {
        const newIcon = this.updatePinpoint();
        marker.setIcon(newIcon);
    }
}
