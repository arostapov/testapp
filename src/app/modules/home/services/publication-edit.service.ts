import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Publication, PublicationEditResponse } from '../models/publication.model';
import { environment } from '../../../../environments/environment';


@Injectable()
export class PublicationEditService {
  private editedPublicationSubject: BehaviorSubject<Publication> = new BehaviorSubject<Publication>(new Publication());
  constructor(private http: HttpClient) { }

  public getPublicationEditInfo(id: number): Observable<PublicationEditResponse> {
    const options = {
      params: new HttpParams().set('id', String(id))
    };
    return this.http.get<PublicationEditResponse>(`${environment.apiUrl}/home/publication-edit`, options);
  }

  public saveEditedPublication(publication: Publication): void {
    this.editedPublicationSubject.next(publication);
  }

  public get editedPublication$(): Observable<Publication> {
    return this.editedPublicationSubject.asObservable();
  }
}
