// https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29
export interface ISteamFriends {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate: SteamPersonaState;
  communityvisibilitystate: string;
  profilestate: string;
  lastlogoff: string;
  commentpermission: string;
  realname?: string;
  primaryclanid?: string;
  timecreated?: string;
  gameid?: string;
  gameserverip?: string;
  gameextrainfo?: string;
  cityid?: string;
  loccountrycode?: string;
  locstatecode?: string;
  loccityid?: string;

  selected: boolean;
}

export enum SteamPersonaState {
  Offline = '0',
  Online = '1',
  Busy = '2',
  Away = '3',
  Snooze = '4',
  LookingToTrade = '5',
  LookingToPlay = '6'
}
