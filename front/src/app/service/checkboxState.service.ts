import { Injectable } from '@angular/core';
import { ActivityData } from './../models/codeNaf';

@Injectable({
    providedIn: 'root',
})
export class CheckboxStateService {
    private readonly storageKey = 'checkboxStates';
    private isChecked: Record<string, { nafcode: string, activityName: string }> = {};
    public selectedActivitiesCount: number = 0;

    constructor() {
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage(): void {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            const parsed = JSON.parse(stored);
            this.isChecked = parsed.isChecked || {};
        }
    }

    getCompletedState(id: string): boolean {
        if (this.isChecked[id]) return true
        else return false;
    }


    saveCompletedState(id: string, activity: ActivityData, checked: boolean): void {
        checked ? this.isChecked[id] = {nafcode: activity.nafCode, activityName: activity.name} : delete this.isChecked[id];
        const state = { isChecked: this.isChecked};
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }

    getNafCodeStored(): any {
        const temp = Object.values(this.isChecked);
        return temp.map((item) => item.nafcode);
    }

    getActivitiesCount(): number {
        return Object.keys(this.isChecked).length;
    }
}