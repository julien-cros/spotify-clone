import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
	  "user-read-email",
	  "playlist-read-private",
	  "playlist-read-collaborative",
	  "streaming",
	  "user-read-private",
	  "user-library-read",
	  "user-top-read",
	  "user-read-playback-state",
	  "user-modify-playback-state",
	  "user-read-currently-playing",
	  "user-read-recently-played",
	  "user-follow-read",
].join(",");

const params = {
	scope: scopes,
};


const queryParamsString = new URLSearchParams(params).toString();

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamsString}`;


const spotifyApi = new SpotifyWebApi({
	clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
	clientSecret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
});

export default spotifyApi;

export { LOGIN_URL };