import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin, Observable } from 'rxjs';
import { SteamService } from '../shared/services/steam.service';
import { ISteamFriends } from '../shared/types/steam-friends-interface';
import { ISteamOwnedGames } from '../shared/types/steam-games-interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public steamID = '';
  public steamFriends: ISteamFriends[] = [];
  public steamGames: ISteamOwnedGames[] = []; // Flat array of all games for all selected friends
  public steamGameIDs: string[][] = []; // 2D array for manipulation of gameid intersections
  public mutualSteamGameIDs: string[] = []; // Intersection of steam game ids in common
  public mutualSteamGames: ISteamOwnedGames[] = []; // Flat array of all games in common among selected friends
  public friendsSteamIDsToCompare: string[] = [];
  public randomGameID: string = '';

  constructor(private steamService: SteamService, private sanitizer: DomSanitizer) { }

  private getSteamGamesInCommon() {
    this.mutualSteamGameIDs = this.steamGameIDs.reduce((a, b) => a.filter(c => b.includes(c))); // Grab the intersection
    this.mutualSteamGames = this.steamGames.filter(game => this.mutualSteamGameIDs.includes(game.appid)) // Grab only the ids we care about
      .filter((val, index, arr) => arr.findIndex(t => (t.appid === val.appid)) === index); // Remove duplicates
    console.log(this.mutualSteamGames);
  }

  public sortBy(arr: any[], prop: string) {
    return arr.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }

  public getSteamLaunchGameUrl(appID: string) {
    return this.sanitizer.bypassSecurityTrustUrl('steam://rungameid/' + appID);
  }

  public randomGame() {
    this.randomGameID = this.mutualSteamGameIDs[Math.floor(Math.random() * this.mutualSteamGameIDs.length)];
  }

  public getSteamFriends() {
    this.steamService.getSteamFriends(this.steamID).subscribe(steamFriends => {
      this.steamFriends = steamFriends[0].response?.players ?? [];

      console.log(this.steamFriends);

      // Default all checkboxes to false
      this.steamFriends.forEach(friend => {
        friend.selected = false;
      });
      // Add current user into the comparison
      this.friendsSteamIDsToCompare.push(this.steamID);
      // Grab games for current user
      this.getSteamOwnedGames();
    });
  }

  public addRemoveFromSteamComparison(checked: boolean, steamID: string) {
    if (checked) {
      this.friendsSteamIDsToCompare.push(steamID);
    }
    else {
      this.friendsSteamIDsToCompare = this.friendsSteamIDsToCompare.filter(id => id !== steamID);
    }
    this.getSteamOwnedGames();
    console.log(this.friendsSteamIDsToCompare);
  }

  public getSteamOwnedGames() {
    // For now, wipe vars and just redo the calls, caching TODO
    this.steamGameIDs = [];
    this.steamGames = [];
    this.mutualSteamGames = [];
    // Grab owned games for all steamIDs in comparison
    const observables: Observable<any>[] = [];
    this.friendsSteamIDsToCompare.forEach(steamID => {
      observables.push(this.steamService.getSteamOwnedGames(steamID));
    });
    forkJoin(observables).subscribe(responses => {
      responses.forEach(resp => {
        const steamGamesResp = resp.response?.games ?? [];
        const gameIDs: string[] = [];
        steamGamesResp.forEach((game: ISteamOwnedGames) => {
          gameIDs.push(game.appid);
          this.steamGames.push(game);
        });
        this.steamGameIDs.push(gameIDs);
      });
      this.getSteamGamesInCommon();
    });
  }
}
