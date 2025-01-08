import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CheckboxStateService {
    private readonly storageKey = 'checkboxStates';
    private isCompleted: Record<string, string> = {};

    constructor() {
        this.loadFromLocalStorage();
    }
    
    private loadFromLocalStorage(): void {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            const parsed = JSON.parse(stored);
            this.isCompleted = parsed.isCompleted || {};            
        }
    }
    
    getCompletedState(id: string): any {
        
        return this.isCompleted[id] || false;
    }
    
    saveCompletedState(id: string, nafcode: string, checked: boolean): void {
        if (checked) {
            this.isCompleted[id] = nafcode;
        } else {
            delete this.isCompleted[id];
        }
        console.log( "after : " + this.isCompleted[id]);
    
        const state = {
            isCompleted: this.isCompleted,
        };
    
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }
}