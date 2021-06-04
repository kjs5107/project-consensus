import { Component, OnInit } from '@angular/core';
import { SteamService } from '../shared/services/steam.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public steamID: string = '';
  public steamFriends = [];
  public steamGames = [];

  constructor(private steamService: SteamService) { }

  ngOnInit(): void {}

  async getSteamFriends() {
    this.steamFriends = await this.steamService.getSteamFriends(this.steamID);

    console.log(this.steamFriends);
  }

  async getSteamGames() {
    this.steamGames = await this.steamService.getSteamOwnedGames(this.steamID);

    console.log(this.steamGames);
  }

}
