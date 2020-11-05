import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { User } from '../../modules/auth/models/user.model';
import { PublicationEditResponse, PublicationResponse } from '../../modules/home/models/publication.model';
import PublicationValues from '../../../assets/datasets/Publication.values.json';
import PublicationMetadata from '../../../assets/datasets/Publication.metadata.json';
import PublicationEditValues from '../../../assets/datasets/PublicationEdit.values.json';
import PublicationEditMetadata from '../../../assets/datasets/PublicationEdit.metadata.json';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, body, params } = request;

    return of(null)
      .pipe(mergeMap(handleRoute));

    function handleRoute() {
      switch (true) {
        case url.endsWith('/auth/login') && method === 'POST':
          return login();
        case url.endsWith('/home/publications') && method === 'GET':
          return getPublications();
        case url.endsWith('/home/publication-edit') && method === 'GET':
          return getPublicationInfo();
        default:
          return next.handle(request);
      }
    }

    function login(): Observable<HttpResponse<User>> | Observable<never> {
      const { email, password } = body;
      if (email === 'admin@admin.com' && password === 'admin') {
        return ok({
          id: 1,
          email,
        });
      }
      return error('Email or password is incorrect');
    }

    function getPublications(): Observable<HttpResponse<PublicationResponse>> {
      return ok({
        publicationValues: PublicationValues,
        publicationMetadata: PublicationMetadata,
      });
    }

    function getPublicationInfo(): Observable<HttpResponse<PublicationEditResponse>> {
      const id = params.get('id');

      return ok({
        publicationInfo: PublicationEditValues.result.find(p => +p.id === +id),
        publicationEditMetadata: PublicationEditMetadata,
      });
    }

    function ok<T>(bodyValue?: T): Observable<HttpResponse<T>> {
      return of(new HttpResponse({ status: 200, body: bodyValue || body }));
    }

    function error(message: string): Observable<never> {
      return throwError({ error: { message } });
    }
  }
}
