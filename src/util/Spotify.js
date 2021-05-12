const clientID = '099385fbbb994574938d2c167deb7cdc';
const redirectURI = 'http://localhost:3000';
let accessToken = '';

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
             const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}
             &response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
             window.location = accessURL;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
        { headers: {
            Authorization: `Bearer ${accessToken}`
        }}).then(jsonResponse => {
            return jsonResponse.json();
        }).then(response => {
            if (!response.tracks) {
                return [];
            }
            return response.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            })); // end of map
        });// end of 2nd then
    }, // end of search

    savePlaylist(name, trackURIs) {
        if (!name || !trackURIs.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        const headersPOST = { 
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json' 
		};
        let userID;

        return fetch('https://api.spotify.com/v1/me', { headers: headers })
        .then(jsonResponse => jsonResponse.json())
        .then(response => {
            userID = response.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
            { 
                headers: headersPOST,
                method: 'POST',
                body: JSON.stringify({ name: name })
             }).then(jsonResponse => jsonResponse.json())
             .then(response => {
                 const playlistID = response.id;
                 return fetch(`https://api.spotify/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                     headers: headersPOST,
                     method: 'POST',
                     body: JSON.stringify({ uris: trackURIs })
                 }); // end of final fetch
             }); // end of final then
        }); // end of 2nd then 
    } // end of savePlaylist
} // end of spotify

export default Spotify;