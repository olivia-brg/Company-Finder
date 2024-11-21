import { Injectable } from "@angular/core";

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

const activiteMapping = {
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

const effectifMapping = {
    "00" : "0 salarié",
    "01" : "1 ou 2 salariés",
    "02" : "3 à 5 salariés",
    "03" : "6 à 9 salariés",
    "11" : "10 à 19 salariés",
    "12" : "20 à 49 salariés",
    "21" : "50 à 99 salariés",
    "22" : "100 à 199 salariés",
    "31" : "200 à 499 salariés",
    "41" : "500 à 999 salariés",
    "42" : "1000 à 1999 salariés",
    "51" : "2000 à 4999 salariés",
    "52" : "5000 salariés ou plus",
    "NN" : "Effectif inconnu"
};

@Injectable({
    providedIn: 'root',
})

export class FetchCompaniesDataService {

    cities: number[] = [];

    async fetchCompaniesData(citiesCodes: number[]): Promise<void> {
        this.cities = citiesCodes;
        
        try {
            let companiesData = await this.getAllCompanies();
            console.log(companiesData);
        } catch (err) {
            console.error("Erreur :", err);
        }
    }

    async getAllCompanies() {
    
        let firstPageData = await this.getCompany(1);
        if (!firstPageData) return;
        
        let totalPages = firstPageData.total_pages;
        
        let json = [];
        json.push(...firstPageData.results);
    
        // A voir si je ne devrais pas limiter les résultats
        for (let page = 2; page <= totalPages; page++) {
            let pageData = await this.getCompany(page);
            if (pageData) {
                json.push(...pageData.results);
            }
        }
        return "it works"
        // this.formatData(json);
    }

    async getCompany(page: number) {
        let url = this.buildURL(page);
    
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Statut de la réponse: ${response.status}`);
            }
    
            return await response.json();
    
        } catch (error) {
            error: (err: Error) => console.error('Erreur :', err);
            return null;
        }
    }

    // formatData(data: any[]) {
    //     return data.map((entreprise: { matching_etablissements: any[]; nom_complet: any; }) => {
    //         const etablissementsOuverts = entreprise.matching_etablissements
    //             .filter((etablissement: { date_fermeture: null; }) => etablissement.date_fermeture === null)
    //             .map((etablissement: { adresse: any; activite_principale: string | number; tranche_effectif_salarie: string | number; latitude: any; longitude: any; }) => {
    //                 return {
    //                     "Adresse": etablissement.adresse,
    //                     "Activité": activiteMapping[etablissement.activite_principale] || "Activité inconnue",
    //                     "Salariés": effectifMapping[etablissement.tranche_effectif_salarie] || "Tranche inconnue",
    //                     "latitude": etablissement.latitude,
    //                     "longitude": etablissement.longitude
    //                 };
    //             });
    
    //         if (etablissementsOuverts.length > 0) {
    //             return {
    //                 "Entreprise": entreprise.nom_complet,
    //                 "Etablissements": etablissementsOuverts
    //             };
    //         }
    //     }).filter((entreprise: any) => entreprise);
    // }

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
