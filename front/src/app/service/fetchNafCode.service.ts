import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryData } from '../models/codeNaf';

@Injectable({
    providedIn: 'root',
})

export class FetchNafCodeService {
    private apiUrl = 'http://localhost:8080/search?keyword=';

    constructor(private http: HttpClient) { }


    fetchActivityDataByKeyword(val: string) : Observable<CategoryData[]> {
        const encodedKeyword = encodeURIComponent(val);
        return this.http.get<CategoryData[]>(this.apiUrl + encodedKeyword);
    }
}