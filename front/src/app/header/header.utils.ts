import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";

export interface CityData {
    name: string;
    department: string;
    depNumber: number;
    code: number;
  }

@Injectable({
    providedIn: 'root',
})

export class HeaderUtils {

    constructor(http: HttpClient) {}

    static fetchCities(cityName: string): Observable<CityData[]> {
        return this.formatCityData(cityName);


        // let cities: string[] = getCitiesNames(cityName);
        // return displayCitySuggestions(cities);
    }

    private static formatCityData(cityName: string): Observable<CityData[]> {
        return this.fetchCityDataByName(cityName).pipe(
          map((rawData) =>
            rawData.map((element: { nom: string; departement: { nom: string; code: number; }; code: number; }) => ({
              name: element.nom,
              department: element.departement.nom,
              depNumber: element.departement.code,
              code: element.code,
            }))
          )
        );
    }

private static fetchCityDataByName(http: HttpClient, cityName: string): Observable<any> {
    const url = this.buildApiUrl(cityName);

    const rawData = http.get<JSON>(url).pipe(
        map((response) => {
            return response;
        }),
        catchError((error) => {
            console.error('Erreur lors de la récupération des données de la ville :', error);
            return throwError(() => new Error('Impossible de récupérer les données de la ville.'));
        })
    )

    return of(rawData);
}

    private static buildApiUrl(cityName: string) {
        return `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(cityName)}&fields=departement&boost=population&limit=5`;
    }
}