import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, refCount, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SteamService {
  private steamFriendsUrl = 'api/getSteamFriends';
  private steamOwnedGamesUrl = 'api/getSteamOwnedGames';

  constructor(private httpClient: HttpClient) { }

  public getSteamFriends(steamID: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('steamID', steamID);

    return this.httpClient.get(this.steamFriendsUrl, { params: params }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  public getSteamOwnedGames(steamID: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('steamID', steamID);

    return this.httpClient.get(this.steamOwnedGamesUrl, { params: params }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
