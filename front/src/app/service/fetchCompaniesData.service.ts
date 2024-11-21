import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, mergeMap, Observable, of } from "rxjs";

const codeNAF = [
    "58.21Z",
    "58.29A",
    "58.29C",
    "62.01Z",
    "62.02A",
    "62.02B",
    "62.03Z",
    "62.09Z",
    "63.11Z",
    "63.12Z"
];
const staffSizeCode = ["52", "51", "42", "41", "31", "22", "21", "12", "11"];

const activiteMapping: any = {
    "58.21Z": "Édition de jeux électroniques",
    "58.29A": "Édition de logiciels système et de réseau (domaine pas totalement en lien mais intéressant de checker)",
    "58.29C": "Édition de logiciels applicatifs",
    "62.01Z": "Programmation informatique",
    "62.02A": "Conseil en systèmes et logiciels informatiques",
    "62.02B": "Tierce maintenance de systèmes et d'applications informatiques",
    "62.03Z": "Gestion d'installations informatiques",
    "62.09Z": "Autres activités informatiques",
    "63.11Z": "Traitement de données, hébergement et activités connexes (domaine pas totalement en lien mais intéressant de checker)",
    "63.12Z": "Portails Internet (domaine pas totalement en lien mais intéressant de checker)"
};

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
    "NN": "Effectif inconnu"
};

@Injectable({
    providedIn: 'root',
})

export class FetchCompaniesDataService {

    constructor(private http: HttpClient) { }

    cities: number[] = [];

    async fetchCompaniesData(citiesCodes: number[]): Promise<void> {
        this.cities = citiesCodes;

        try {
            let companiesData = await this.getAllCompanies();
            console.log("tableau final : " + companiesData);
        } catch (err) {
            console.error("Erreur :", err);
        }
    }

    getAllCompanies() {
        new Promise((resolve, reject) => {
            let totalPages: number;
            let pageNumber: number = 1;
            let json: any[] = [];

            const fetchData = () => {
                this.fetchCompaniesDataByPageNumber(pageNumber).subscribe({
                    next: (pageData) => {
                        if (pageData) {
                            json.push(...pageData.results);
                        }
                        totalPages = pageData.total_pages;
                        pageNumber++;
                        if (pageNumber <= totalPages) {
                            fetchData();
                        } else {
                            console.log(this.formatData(json));

                            return this.formatData(json);
                        }
                        return null;
                    },
                    error: (error) => {
                        reject(error);
                    },
                    complete: () => {
                        // You can add a callback here if needed
                    }
                });
            };
            fetchData();

            return json;
        });
    }


    fetchCompaniesDataByPageNumber(page: number): Observable<any> {
        const url = this.buildURL(page);

        return this.http.get(url).pipe(
            catchError((error) => {
                console.error('Erreur :', error);
                return of(null);
            })
        );
    }

    formatData(data: any[]) {
        return data
            .map((entreprise: { matching_etablissements: any[] | null; nom_complet: string; }) => {
                if (entreprise.matching_etablissements) {

                    const etablissementsActifs = entreprise.matching_etablissements
                        .filter((etablissement) => etablissement.date_fermeture === null)
                        .map((etablissement: { adresse: any; activite_principale: string; tranche_effectif_salarie: string; latitude: any; longitude: any; date_fermeture: any; }) => {
                            return {
                                date_fermeture: etablissement.date_fermeture,
                                Adresse: etablissement.adresse,
                                Activite: activiteMapping[etablissement.activite_principale] || "Activité inconnue",
                                Effectif: effectifMapping[etablissement.tranche_effectif_salarie] || "Tranche inconnue",
                                latitude: etablissement.latitude,
                                longitude: etablissement.longitude
                            };
                        });
                    if (etablissementsActifs.length <= 0) {
                        return null;
                    }
                    return { nom: entreprise.nom_complet, etablissements: etablissementsActifs };
                }
                return null;
            })
            .filter((entreprise) => entreprise !== null);
    }

    buildURL(page: any) {
        const activity = this.createParamString("activite_principale", codeNAF);
        const allCities = this.createParamString("&code_commune", this.cities);
        const allEffectif = this.createParamString("&tranche_effectif_salarie", staffSizeCode);

        return `https://recherche-entreprises.api.gouv.fr/search?${activity}${allCities}${allEffectif}&page=${page}&per_page=25`;
    }

    createParamString(paramName: any, values: any[]) {
        return `${paramName}=${values.join(',')}`;
    }
}
