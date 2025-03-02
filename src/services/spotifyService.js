import { config } from '../config';

class SpotifyService {
  constructor() {
    this.accessToken = null;
  }

  async authenticate() {
    // Check if we already have a valid token
    const token = localStorage.getItem('spotify_access_token');
    const tokenExpiry = localStorage.getItem('spotify_token_expiry');
    
    if (token && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
      this.accessToken = token;
      return;
    }

    // Get new token using client credentials flow
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(config.clientId + ':' + config.clientSecret)
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    });

    const data = await response.json();
    this.saveTokenData(data);
  }

  saveTokenData(data) {
    this.accessToken = data.access_token;
    localStorage.setItem('spotify_access_token', data.access_token);
    localStorage.setItem('spotify_token_expiry', Date.now() + (data.expires_in * 1000));
  }

  async getPlaylistTracks() {
    if (!this.accessToken) {
      await this.authenticate();
    }

    let allTracks = [];
    let nextUrl = `https://api.spotify.com/v1/playlists/${config.playlistId}/tracks?limit=100`;

    while (nextUrl) {
      const response = await fetch(nextUrl, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('Spotify API error:', data.error);
        throw new Error(data.error.message);
      }

      allTracks = [...allTracks, ...data.items];
      nextUrl = data.next;
    }

    const artistIds = [...new Set(allTracks.map(item => item.track.artists[0].id))];
    const artistGenres = await this.getArtistGenres(artistIds);

    return this.formatPlaylistData(allTracks, artistGenres);
  }

  async getArtistGenres(artistIds) {
    const chunks = [];
    for (let i = 0; i < artistIds.length; i += 50) {
      chunks.push(artistIds.slice(i, i + 50));
    }

    const genreMap = {};
    
    for (const chunk of chunks) {
      const response = await fetch(
        `https://api.spotify.com/v1/artists?ids=${chunk.join(',')}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );
      const data = await response.json();
      data.artists.forEach(artist => {
        genreMap[artist.id] = artist.genres;
      });
    }
    
    return genreMap;
  }

  formatPlaylistData(items, artistGenres) {
    return items.map(item => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists[0].name,
      artistId: item.track.artists[0].id,
      genres: artistGenres[item.track.artists[0].id] || [],
      albumArt: item.track.album.images[0].url,
      addedBy: item.added_by.id,
      addedAt: item.added_at,
      spotifyUrl: item.track.external_urls.spotify
    }));
  }
}

export default new SpotifyService(); 