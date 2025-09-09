import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BestFitsService {
    private apiUrl = 'http://localhost:5000/api/bestfits';

    constructor(private http: HttpClient) { }

    getJobDescriptions(): Observable<any> {
        return this.http.get(`${this.apiUrl}/jds`);
    }

    getCandidatesForJD(jdId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/candidates/${jdId}`);
    }

    getBestFits(jdId: string, num: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/top/${jdId}?num=${num}`);
    }

}
