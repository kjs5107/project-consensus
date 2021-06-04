// https://developer.valvesoftware.com/wiki/Steam_Web_API#GetOwnedGames_.28v0001.29
export interface ISteamOwnedGames {
  appid: string;
  name: string;
  img_icon_url: string;
  img_logo_url: string;
  has_community_visible_stats: string;
  playtime_forever: string;
  playtime_linux_forever?: string;
  playtime_mac_forever?: string;
  playtime_windows_forever?: string;
  playtime_2weeks?: string;
}

