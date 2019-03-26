//So this is place that will get data and that other components can get data from

import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api

   constructor(
      private http: HttpClient,
      private messageService: MessageService) { }

//   getHeroes(): Hero[] {
//    return HEROES;
//  }

/** Log a HeroService message with the MessageService */
private log(message: string) {
   this.messageService.add(`HeroService: ${message}`);
 }


/** GET heroes from the server */
//http.get returns an untyped json object by default. Applying the optional type specifier, <Hero[]> , gives you a typed result object.
// They'll do that with the RxJS tap operator, which looks at the observable values, does something with those values, and passes them along. 
// The tap call back doesn't touch the values themselves.
/** GET heroes from the server */
getHeroes (): Observable<Hero[]> {
  return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
}

/** GET hero by id. Will 404 if id not found */
getHero(id: number): Observable<Hero> {
  const url = `${this.heroesUrl}/${id}`;
  return this.http.get<Hero>(url).pipe(
    tap(_ => this.log(`fetched hero id=${id}`)),
    catchError(this.handleError<Hero>(`getHero id=${id}`))
  );
}


 /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}


//previous getHeroes before adding http request
//  getHeroes(): Observable<Hero[]> {
//     // TODO: send the message _after_ fetching the heroes
//    this.messageService.add('HeroService: fetched heroes');
//    return of(HEROES);
//  }

//getHero by id before http request
//  getHero(id: number): Observable<Hero> {
//    // TODO: send the message _after_ fetching the hero
//    this.messageService.add(`HeroService: fetched hero id=${id}`);
//    return of(HEROES.find(hero => hero.id === id));
//  }