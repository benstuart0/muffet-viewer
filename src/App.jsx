import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import SongGrid from './components/SongGrid';
import spotifyService from './services/spotifyService';
import { startOfWeek, endOfWeek } from 'date-fns';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const playlistSongs = await spotifyService.getPlaylistTracks();
      setSongs(playlistSongs);
    } catch (err) {
      setError('Failed to load songs from playlist');
      console.error('Error fetching songs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>muffet viewer</h1>
      </header>
      
      <main>
        <Calendar 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        
        <SongGrid 
          songs={songs}
          weekStart={startOfWeek(selectedDate)}
          weekEnd={endOfWeek(selectedDate)}
        />
      </main>
    </div>
  );
}

export default App; 