import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityData, CategoryData } from '../models/codeNaf';

export enum ActivityNameData {

}

@Injectable({
    providedIn: 'root',
})

export class FetchActivityNameService {
    private apiUrl = 'http://localhost:8080/api/activity/code?code_naf=';

    constructor(private http: HttpClient) { }

    getActivityNameByNafCode(val: string) : Observable<string> {
        const encodedKeyword = encodeURIComponent(val);
        return this.http.get<string>(`${this.apiUrl}${encodedKeyword}`, { responseType: 'text' as 'json' });}
}