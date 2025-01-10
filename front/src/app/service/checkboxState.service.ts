import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CheckboxStateService {
    private readonly storageKey = 'checkboxStates';
    private isCompleted: Record<string,string> = {};
    public selectedActivitiesCount: number = 0;

    constructor() {
        this.loadFromLocalStorage();
    }
    
    loadFromLocalStorage(): void {
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
        checked ? this.isCompleted[id] = nafcode : delete this.isCompleted[id];
        const state = { isCompleted: this.isCompleted};
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }

    getNafCodeStored(): any {
        return Object.values(this.isCompleted); 
    }

    getActivitiesCount(): number {
        return Object.keys(this.isCompleted).length;
    }
}