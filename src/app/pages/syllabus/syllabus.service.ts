import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SyllabusService {
  constructor(private http: HttpClient) {}

  syllabusList(): Observable<any> {
    return this.http.get<any>(`/syllabus`).pipe(
      map((response) =>
        // response.isExecuted && response.data ? response.data : null
        response && response.data ? response.data : null
      ),
      catchError((error) => of(null))
    );
  }

  languageList(): Observable<any> {
    return this.http.get(`/language`).pipe(
      map((response: any) =>
        response && response.data.length ? response.data : []
      ),
      catchError((error) => of([]))
    );
  }

  tradeList(): Observable<any> {
    return this.http.get(`/trade`).pipe(
      map((response: any) =>
        response && response.data.length ? response.data : []
      ),
      catchError((error) => of([]))
    );
  }

  labelList(tradeId: number): Observable<any> {
    return this.http.get(`/label/${tradeId}`).pipe(
      map((response: any) =>
        response && response.data.length ? response.data : []
      ),
      catchError((error) => of([]))
    );
  }

  updateSyllabus(id: string, body: any): Observable<any> {
    return this.http.put(`/syllabus/${id}`, body).pipe(
      map((response: any) =>
        response && response.data.length ? response.data : []
      ),
      catchError((error) => of([]))
    );
  }

  addSyllabus(body: any): Observable<any> {
    return this.http.post(`/syllabus`, body).pipe(
      map((response: any) =>
        response && response.data.length ? response.data : []
      ),
      catchError((error) => of([]))
    );
  }

  deleteSyllabus(id: string): Observable<any> {
    return this.http.delete(`/syllabus/${id}`).pipe(
      map((response: any) =>
        response && response.data.length ? response.data : []
      ),
      catchError((error) => of([]))
    );
  }
  detailSyllabus(id: string): Observable<any> {
    return this.http.get(`/syllabus/${id}`).pipe(
      map((response: any) => response),
      catchError((error) => of([]))
    );
  }
}
