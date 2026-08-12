import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shoe } from '../../core/domain/models/shoe.model';

@Injectable({
  providedIn: 'root'
})
export class ShoeService {
  private apiUrl = 'http://localhost:5277/api/shoes';

  constructor(private http: HttpClient) {}

  getShoes(): Observable<Shoe[]> {
    return this.http.get<Shoe[]>(this.apiUrl);
  }

  getShoe(id: number): Observable<Shoe> {
    return this.http.get<Shoe>(`${this.apiUrl}/${id}`);
  }

  createShoe(shoe: Partial<Shoe>): Observable<Shoe> {
    return this.http.post<Shoe>(this.apiUrl, shoe);
  }

  updateShoe(id: number, shoe: Shoe): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, shoe);
  }

  deleteShoe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    // Assuming backend runs on 5277 and upload is at /api/upload
    return this.http.post<{ url: string }>('http://localhost:5277/api/upload', formData);
  }
}
