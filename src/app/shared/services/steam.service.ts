import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SteamService {
  private steamFriendsUrl = 'api/getSteamFriends';
  private steamOwnedGamesUrl = 'api/getSteamOwnedGames';

  constructor() { }

  public async getSteamFriends(steamID: string) {
    return fetch(`${this.steamFriendsUrl}?steamID=${steamID}`)
      .then(resp => resp.json())
      .catch(err => console.error(err));
  }

  public async getSteamOwnedGames(steamID: string) {
    return fetch(`${this.steamOwnedGamesUrl}?steamID=${steamID}`)
      .then(resp => resp.json())
      .catch(err => console.error(err));
  }
}
