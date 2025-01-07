import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CheckboxStateService {
    private readonly storageKey = 'checkboxStates';
    private isCompleted: Record<string, boolean> = {};
    private isIndeterminate: Record<string, boolean> = {};

    constructor() {
        this.loadFromLocalStorage();
    }

    private saveToLocalStorage(): void {
        const state = {
            isCompleted: this.isCompleted,
            isIndeterminate: this.isIndeterminate,
        };
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }

    private loadFromLocalStorage(): void {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            const parsed = JSON.parse(stored);
            this.isCompleted = parsed.isCompleted || {};
            this.isIndeterminate = parsed.isIndeterminate || {};
        }
    }

    getCompletedState(id: string): boolean {
        return this.isCompleted[id] || false;
    }

    getIndeterminateState(id: string): boolean {
        return this.isIndeterminate[id] || false;
    }

    saveCompletedState(id: string, checked: boolean): void {
        this.isCompleted[id] = checked;
        this.saveToLocalStorage();
    }

    saveIndeterminateState(id: string, checked: boolean): void {
        this.isIndeterminate[id] = checked;
        this.saveToLocalStorage();
    }

    resetStates(): void {
        this.isCompleted = {};
        this.isIndeterminate = {};
        this.saveToLocalStorage();
    }
}