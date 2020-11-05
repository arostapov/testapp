import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PublicationResponse } from '../models/publication.model';

@Injectable()
export class PublicationService {

  constructor(private http: HttpClient) { }

  public getPublications(): Observable<PublicationResponse> {
    return this.http.get<PublicationResponse>(`${environment.apiUrl}/home/publications`);
  }
}
