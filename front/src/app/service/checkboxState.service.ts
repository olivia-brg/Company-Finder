import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CheckboxStateService {
    private readonly storageKey = 'checkboxStates';
    private isCompleted: Record<string, { nafcode: string, activityName: string }> = {};
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

    getCompletedState(id: string): boolean {
        if (this.isCompleted[id]) return true
        else return false;
    }

    saveCompletedState(id: string, nafcode: string, activityName: string): void {
        
        if (this.isCompleted[id]) delete this.isCompleted[id];
        else this.isCompleted[id] = { nafcode, activityName: activityName };
        const state = { isCompleted: this.isCompleted };
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }

    getNafCodeStored(): any {
        return Object.values(this.isCompleted);
    }

    getActivitiesCount(): number {
        return Object.keys(this.isCompleted).length;
    }
}