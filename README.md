# Weekly Music App

A React application to display weekly music additions to a Spotify playlist.

## Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/repo-name.git
cd repo-name
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file based on `.env.example` and add your Spotify credentials:
- Get your Spotify API credentials from [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- Add your playlist ID from the Spotify playlist URL

4. Start the development server
```bash
npm start
```

## Deployment

To deploy to GitHub Pages:
```bash
npm run deploy
```

## Environment Variables

The following environment variables are required:

- `REACT_APP_SPOTIFY_CLIENT_ID`: Your Spotify API client ID
- `REACT_APP_SPOTIFY_CLIENT_SECRET`: Your Spotify API client secret
- `REACT_APP_PLAYLIST_ID`: The ID of your Spotify playlist

## Features

- Weekly calendar view
- 2x2 grid showing songs added by each member
- Album artwork display
- Automatic token refresh for Spotify API