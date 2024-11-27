// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { catchError, map, Observable, throwError } from "rxjs";



// @Injectable({
//     providedIn: 'root',
// })

// export class FetchCityService {

//     constructor(private httpClient: HttpClient) {}

//     fetchCities(cityName: string): Observable<CityData[]>{
//         return this.formatCityData(cityName);
//     }

//     private formatCityData(cityName: string): Observable<CityData[]> {
//         return this.fetchCityDataByName(cityName).pipe(
//             map(rawData =>
//                 rawData.map((city: { nom: string; departement: { nom: string; code: number; }; code: number; }) => ({
//                     name: city.nom,
//                     code: city.code,
//                     department: city.departement.nom,
//                     departmentNumber: city.departement.code,
//                 }))
//             )
//         );
//     }

//     private fetchCityDataByName(cityName: string): Observable<any> {
//         const url = this.buildApiUrl(cityName);

//         return this.httpClient.get<JSON>(url).pipe(
//             map(response => response),
//             catchError(error =>
//                 throwError(() => new Error('Impossible de récupérer les données de la ville.'))
//             )
//         );
//     }

//     private buildApiUrl(cityName: string): string {
//         const encodedCityName = encodeURIComponent(cityName);

//         return `https://geo.api.gouv.fr/communes?nom=${encodedCityName}&fields=departement&boost=population&limit=5`;
//     }

// }