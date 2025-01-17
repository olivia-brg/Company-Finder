import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class FetchCityDataService {
    constructor(private http: HttpClient) { }

    fetchCityDataByName(val: string) {
        const encodedCityName = encodeURIComponent(val);
        return this.http
            .get<any>(`http://localhost:8080/api/city_code?cityName=${encodedCityName}`);
    }
}