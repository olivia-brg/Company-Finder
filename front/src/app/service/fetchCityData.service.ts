import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryData } from '../models/codeNaf';

@Injectable({
    providedIn: 'root',
})

export class FetchCityDataService {
    constructor(private http: HttpClient) { }

    fetchCityDataByName(val: string) {
        const encodedCityName = encodeURIComponent(val);
        return this.http
            .get<any>(`https://geo.api.gouv.fr/communes?nom=${encodedCityName}&fields=departement&boost=population&limit=20`);
    }
}