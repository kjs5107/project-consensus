import { Component, OnInit } from '@angular/core';
import { SteamService } from '../shared/services/steam.service';
import { ISteamFriends } from '../shared/types/steam-friends-interface';
import { ISteamOwnedGames } from '../shared/types/steam-games-interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public steamID: string = '';
  public steamFriends: ISteamFriends[] = [];
  public steamGames: ISteamOwnedGames[] = []; // Flat array of all games for all selected friends
  public mutualSteamGames: ISteamOwnedGames[] = []; // Flat array of all games in common among selected friends
  public mutualSteamGameIDs: string[][] = []; // 2D array for manipulation of gameid intersections
  public friendsSteamIDsToCompare: string[] = [];

  constructor(private steamService: SteamService) { }

  ngOnInit(): void { }

  private getSteamGamesInCommon() {
    let intersection = this.mutualSteamGameIDs.reduce((a, b) => a.filter(c => b.includes(c)));
    this.mutualSteamGames = this.steamGames.filter(game => intersection.includes(game.appid)) // Grab only the ids we care about
                              .filter((val,index,arr) => arr.findIndex(t => (t.appid === val.appid)) === index); // Remove duplicates
    console.log(this.mutualSteamGames);
  }

  public sortBy(arr: any[], prop: string) {
    return arr.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }

  public async getSteamFriends() {
    let steamFriendsResp = await this.steamService.getSteamFriends(this.steamID);
    this.steamFriends = steamFriendsResp[0].response?.players ?? [];

    // Default all chechboxes to false
    this.steamFriends.forEach(friend => {
      friend.selected = false;
    });
    // Add current user into the comparison
    this.friendsSteamIDsToCompare.push(this.steamID);

    console.log(this.steamFriends);
  }

  public addRemoveFromSteamComparison(checked: boolean, steamID: string) {
    if(checked) {
      this.friendsSteamIDsToCompare.push(steamID);
    }
    else {
      this.friendsSteamIDsToCompare = this.friendsSteamIDsToCompare.filter(id => id !== steamID);
    }
    this.getSteamOwnedGames();
    console.log(this.friendsSteamIDsToCompare);
  }

  public async getSteamOwnedGames() {
    // For now, wipe vars and just redo the calls, caching TODO
    this.mutualSteamGameIDs = [];
    this.steamGames = [];
    this.mutualSteamGames = [];
    // Grab owned games for all steamIDs in comparison
    let promises: Promise<any>[] = [];
    this.friendsSteamIDsToCompare.forEach(steamID => {
      promises.push(this.steamService.getSteamOwnedGames(steamID))
    })
    Promise.all(promises)
      .then(responses => {
        responses.forEach(resp =>{
          let steamGamesResp = resp.response?.games ?? [];
          let gameIDs: string[] = [];
          steamGamesResp.forEach((game: ISteamOwnedGames) => {
            gameIDs.push(game.appid);
            this.steamGames.push(game);
          });
          this.mutualSteamGameIDs.push(gameIDs);
        });
        this.getSteamGamesInCommon();
      });
  }

}
