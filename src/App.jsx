import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import SongGrid from './components/SongGrid';
import spotifyService from './services/spotifyService';
import { startOfWeek, endOfWeek } from 'date-fns';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const initialDate = new Date('2024-08-19'); // Use the date from your song
    console.log('Initial week:', {
      date: initialDate,
      weekStart: startOfWeek(initialDate),
      weekEnd: endOfWeek(initialDate)
    });
    return initialDate;
  });
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
      console.log('Fetched songs:', {
        count: playlistSongs.length,
        sample: playlistSongs.slice(0, 3),
        uniqueUsers: [...new Set(playlistSongs.map(song => song.addedBy))]
      });
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