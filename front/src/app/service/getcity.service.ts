import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";

export interface CityData {
    name: string;
    department: string;
    depNumber: number;
    code: number;
}

@Injectable({
    providedIn: 'root',
})

export class GetCityService {

    constructor(private httpClient: HttpClient) {}

    fetchCities(cityName: string): Observable<CityData[]>{
        console.log(cityName);
        return this.formatCityData(cityName);

        // let cities: string[] = getCitiesNames(cityName);
        // return displayCitySuggestions(cities);
    }

    private formatCityData(cityName: string): Observable<CityData[]> {
        return this.fetchCityDataByName(cityName).pipe(
            map(rawData =>
                rawData.map((city: { nom: string; departement: { nom: string; code: number; }; code: number; }) => ({
                    name: city.nom,
                    department: city.departement.nom,
                    departmentNumber: city.departement.code,
                    code: city.code,
                }))
            )
        );
    }

    private fetchCityDataByName(cityName: string): Observable<any> {
        const url = this.buildApiUrl(cityName);

        return this.httpClient.get<JSON>(url).pipe(
            map(response => response),
            catchError(error =>
                throwError(() => new Error('Impossible de récupérer les données de la ville.'))
            )
        );
    }

    private buildApiUrl(cityName: string): string {
        const encodedCityName = encodeURIComponent(cityName);

        return `https://geo.api.gouv.fr/communes?nom=${encodedCityName}&fields=departement&boost=population&limit=5`;
    }

}