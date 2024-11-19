import { Injectable } from "@angular/core";
import { CityData } from "../service/getcity.service";
import { GetCityService } from "../service/getcity.service";

@Injectable({
    providedIn: 'root',
})

export class HeaderUtils {
    private debounceTimeout!: any;
    private searchDelay = 150; // ms

    constructor(private getCityService: GetCityService) { }

    fetchCitiesData(): void {
        clearTimeout(this.debounceTimeout);

        this.debounceTimeout = window.setTimeout(() => {
            const searchInput = document.getElementById('city_input') as HTMLInputElement;
            if (searchInput?.value) {
                this.getCityService.fetchCities(searchInput.value).subscribe({
                    next: (cities: CityData[]) => console.log('Villes trouvées :', cities),
                    error: (err: Error) => console.error('Erreur :', err),
                });
            }
        }, this.searchDelay);
    }

    // TODO :
    // gerer le return des villes proposées
    // afficher la liste des villes proposées
    // gerer le click sur une ville proposée pour ajouter a la liste des villes select
    // afficher la liste des villes select
    // gerer le click sur une ville select pour la supprimer

}