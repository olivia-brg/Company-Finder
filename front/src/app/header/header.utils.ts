import { Injectable } from "@angular/core";
import { CityData } from "../service/getcity.service";
import { GetCityService } from "../service/getcity.service";

@Injectable({
    providedIn: 'root',
})

export class HeaderUtils {
    private debounceTimeout!: any;
    private searchDelay = 150; // ms
    citiesSuggestedArray: CityData[] = [];

    constructor(private getCityService: GetCityService) { }

    fetchCitiesData(): void {
        
        clearTimeout(this.debounceTimeout);
        
        this.debounceTimeout = window.setTimeout(() => {
            const searchInput = document.getElementById('city_input') as HTMLInputElement;
            
            if (searchInput.value.length) {
                this.getCityService.fetchCities(searchInput.value).subscribe({
                    next: (cities: CityData[]) => {
                        this.citiesSuggestedArray = [...cities];
                        this.displayCitiesSuggestions();
                    },
                    error: (err: Error) => console.error('Erreur :', err),
                });

            } else {
                document.getElementById("suggested_cities")!.innerHTML = ``;
            }
            
        }, this.searchDelay);


    }
    
    displayCitiesSuggestions() {
        document.getElementById("suggested_cities")!.innerHTML = ``;
        const citiesSuggestionDiv = document.getElementById("suggested_cities");

        if (this.citiesSuggestedArray.length) {
            
            this.citiesSuggestedArray.forEach(city => {
                const citySuggestion = this.createCitySuggestionElement(city);
                citiesSuggestionDiv!.appendChild(citySuggestion);
            });
        } else {
            this.displayNoResults(citiesSuggestionDiv);
        }
    }

    createCitySuggestionElement(cityData: CityData) {
        const citySuggestion = document.createElement('li');
        citySuggestion.style.border = "solid";
        citySuggestion.className = "city_suggestion";
        citySuggestion.innerHTML = `<p>${cityData.name} | ${cityData.department}, ${cityData.departmentNumber}</p>`;
        citySuggestion.addEventListener('click', () => {
            console.log(`clic sur ${cityData.name}`);
            
            // this.deleteSelectedCitiesOnClick(cityData);
            // displaySelectedCities(this.citiesSuggestedArray);
        });
        return citySuggestion;
    }

    displayNoResults(container: HTMLElement | null) {
        const citySuggestion = document.createElement('li');
        citySuggestion.style.border = "solid";
        citySuggestion.className = "city_suggestion";
        citySuggestion.innerHTML = `Aucun résultat`;
        container?.appendChild(citySuggestion);
    }

    // deleteSelectedCitiesOnClick(results: CityData) {
    //     cityInput.value = ``;
    //     document.getElementById("suggestions_villes").innerHTML = ``;
    //     for (let i = 0; i < citiesArray.length; i++) {
    //         if (results[0] == citiesArray[i].name){
    //             return
    //         }
    //     }
    //     citiesArray.push({ name: results[0], code: results[1]});
    //     console.log(citiesArray);
    // }

    // TODO :
    // gerer le click sur une ville proposée pour ajouter a la liste des villes select
    // afficher la liste des villes select
    // gerer le click sur une ville select pour la supprimer

}