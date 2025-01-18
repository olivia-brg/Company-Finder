import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, concatMap, delay, map, Observable, of, range, reduce, retry, timer } from "rxjs";
import { ActivityMapping } from './../activityMapping';
import { StaffSizeSelectionService } from './../staff-size-selection/staff-size-selection.component';
import { CheckboxStateService } from './checkboxState.service';

const effectifMapping: any = {
  "00": "0 salarié",
  "01": "1 ou 2 salariés",
  "02": "3 à 5 salariés",
  "03": "6 à 9 salariés",
  "11": "10 à 19 salariés",
  "12": "20 à 49 salariés",
  "21": "50 à 99 salariés",
  "22": "100 à 199 salariés",
  "31": "200 à 499 salariés",
  "41": "500 à 999 salariés",
  "42": "1000 à 1999 salariés",
  "51": "2000 à 4999 salariés",
  "52": "5000 salariés ou plus",
  "NN": "Tranche inconnu"
};

@Injectable({
  providedIn: 'root',
})

export class FetchCompaniesDataService {


  constructor(
    private http: HttpClient,
    private checkboxStateService: CheckboxStateService,
    private staffSizeSelectionService: StaffSizeSelectionService,
    private activityMapping: ActivityMapping
  ) { }

  codeNAF: string[] = [];
  cities: number[] = [];
  staffSizeData: string[] = [];
  private loadSubject = new BehaviorSubject<number>(0); 
  load$ = this.loadSubject.asObservable(); 

  parseEstablishments(data: any[]): any[] {
    return data.flatMap((entreprise) =>
      entreprise.etablissements.map((etablissement: { nom: string; Adresse: string; Activite: string; Effectif: string; latitude: number; longitude: number; }) => ({
        name: entreprise.nom,
        address: etablissement.Adresse,
        activity: etablissement.Activite,
        staffSize: etablissement.Effectif,
        latitude: etablissement.latitude,
        longitude: etablissement.longitude,
      }))
    );
  }

  fetchCompaniesData(citiesCodes: number[]): Observable<any> {

    //* update global variable here so I don't need to pass citiesCodes in parameters
    this.cities = citiesCodes;

    return this.getAllCompanies().pipe(
      //! DEBUG
      //! tap((companiesData) => {
      //!  console.log("Final array : ", companiesData);
      //! }),

      catchError((err: Error) => {
        console.error("Erreur : ", err);
        return of(null);
      })
    );
  }

  private getAllCompanies(): Observable<any[]> {
    let actualPage = 1;
    return this.fetchCompaniesDataByPageNumber(1).pipe(
      concatMap((firstPageData: any) => {
        if (!firstPageData) return of([]);

        const totalPages = firstPageData.total_pages;

        const remainingPages$ = range(2, totalPages).pipe(
          concatMap((page: number) => {
            actualPage = page;
            const load = (actualPage / (totalPages + 1)) * 100;
            this.loadSubject.next(load);
            
            return this.fetchCompaniesDataByPageNumber(page).pipe(delay(150))
          }),
          reduce((acc: any[], pageData: any) => {
            if (pageData && pageData.results) {
              acc.push(...pageData.results);
              //! DEBUG
              //! console.log("pageData.results : ", pageData.results);
              //! console.log("acc : ", acc);
            }
            return acc;
          }, firstPageData.results)
        );

        return remainingPages$;
      }),
      map((allResults: any[]) => this.formatData(allResults))
    );
  }

  private fetchCompaniesDataByPageNumber(page: number): Observable<any> {
    const url = this.buildURL(page);

    return this.http.get<any>(url).pipe(
      retry({
        count: 3,
        delay: (error: Error, retryCount: number) => {
          console.warn(`Tentative ${retryCount} pour la page ${page} après une erreur :`, error);
          return timer(500 * retryCount * retryCount);
        },
      }),
      catchError((error: Error) => {
        console.error(`Erreur finale après plusieurs tentatives pour la page ${page} :`, error);
        return of(null);
      })
    );
  }

  private formatData(data: any[]): any[] {
    return data
      .map((entreprise: { matching_etablissements: any[] | null; nom_complet: string }) => {
        if (entreprise.matching_etablissements) {
          const etablissementsActifs = entreprise.matching_etablissements
            .filter((etablissement: { date_fermeture: string }) => etablissement.date_fermeture === null)
            .map(
              (etablissement: {
                adresse: string;
                activite_principale: string;
                tranche_effectif_salarie: string;
                latitude: number;
                longitude: number;
              }) => ({
                Adresse: etablissement.adresse,
                Activite: this.activityMapping.activityMapping[etablissement.activite_principale],
                Effectif: effectifMapping[etablissement.tranche_effectif_salarie] || "Tranche inconnue",
                latitude: etablissement.latitude,
                longitude: etablissement.longitude,
              })
            );

          return etablissementsActifs.length > 0
            ? { nom: entreprise.nom_complet, etablissements: etablissementsActifs }
            : null;
        }
        return null;
      })
      .filter((entreprise) => entreprise !== null);
  }

  private buildURL(page: number): string {
    this.staffSizeSelectionService.data$.subscribe((data) => {
      this.staffSizeData = data;
    });
    this.codeNAF = this.checkboxStateService.getNafCodeStored();

    const activity = this.createParamString("activite_principale", this.codeNAF);
    const allCities = this.createParamString("&code_commune", this.cities);
    const staffSize = this.createParamString("&tranche_effectif_salarie", this.staffSizeData);

    let params = [activity];
    if (this.cities.length > 0) params.push(allCities);
    if (this.staffSizeData.length > 0) params.push(staffSize);
    return `https://recherche-entreprises.api.gouv.fr/search?${params.join("&")}&page=${page}&per_page=25`;
  }

  private createParamString(paramName: string, values: any[]): string {
    return `${paramName}=${values.join(",")}`;
  }
}