import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CheckboxStateService {
    private readonly storageKey = 'checkboxStates';
    private isCompleted: Record<string, boolean> = {};

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

    private saveToLocalStorage(): void {
        const state = {
            isCompleted: this.isCompleted,
        };
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }

    getCompletedState(id: string): boolean {
        return this.isCompleted[id] || false;
    }

    saveCompletedState(id: string, checked: boolean): void {
        if (checked) {
            this.isCompleted[id] = true;
        } else {
            delete this.isCompleted[id];
        }
    
        const state = {
            isCompleted: this.isCompleted,
        };
    
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }
}