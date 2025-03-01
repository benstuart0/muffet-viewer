# Muffet Viewer

A React application that displays songs added to a shared Spotify playlist, organized by week and contributor.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id
REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret
REACT_APP_PLAYLIST_ID=your_playlist_id
```

3. Start the development server:
```bash
npm start
```
4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Features

- Weekly calendar view
- 2x2 grid showing songs added by each member
- Album artwork display
- Automatic token refresh for Spotify API