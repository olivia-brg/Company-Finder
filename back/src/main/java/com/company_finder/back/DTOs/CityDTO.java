package com.company_finder.back.DTOs;

public class CityDTO {
    private String nom;
    private String code;
    private double _score;
    private departementDTO departement;

    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
    public double get_score() {
        return _score;
    }
    public void set_score(double _score) {
        this._score = _score;
    }
    public departementDTO getDepartement() {
        return departement;
    }
    public void setDepartement(departementDTO departement) {
        this.departement = departement;
    }
}
