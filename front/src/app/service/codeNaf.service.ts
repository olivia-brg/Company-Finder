import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CodeNaf } from '../models/codeNaf';

@Injectable({
    providedIn: 'root',
})
export class CodeNafService {
    private apiUrl = 'http://localhost:8080/api/codeNaf';

    constructor(private http: HttpClient) { }

    // Récupérer tous les produits
    getProducts(): Observable<CodeNaf[]> {
        return this.http.get<CodeNaf[]>(this.apiUrl);
    }
}