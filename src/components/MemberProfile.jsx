import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';

const MemberProfile = ({ member, songs, onClose }) => {
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const memberSongs = songs.filter(song => song.addedBy === member.id);
  
  // Get unique genres and their counts
  const genreCounts = memberSongs.reduce((acc, song) => {
    song.genres.forEach(genre => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {});

  // Get top 3 genres
  const topGenres = Object.entries(genreCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const getGenreClass = (genre) => {
    return genre?.toLowerCase().replace(/[^a-z]/g, '-') || '';
  };

  return (
    <div className="member-profile-overlay">
      <div className="member-profile" ref={profileRef}>
        <button className="close-profile" onClick={onClose}>×</button>
        <h2>{member.name}'s Songs</h2>
        
        {topGenres.length > 0 && (
          <div className="top-genres">
            <h3>Most Added Genres</h3>
            <div className="genre-pills">
              {topGenres.map(([genre, count]) => (
                <span 
                  key={genre} 
                  className="genre-pill"
                  data-genre={getGenreClass(genre)}
                >
                  {genre} ({count})
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="member-songs">
          {memberSongs.map(song => (
            <div key={`${song.id}-${song.addedAt}`} className="profile-song-card">
              <img src={song.albumArt} alt={song.name} />
              <div className="song-info">
                <h3>{song.name}</h3>
                <p>{song.artist}</p>
                <span className="added-date">
                  Added {format(new Date(song.addedAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile; 