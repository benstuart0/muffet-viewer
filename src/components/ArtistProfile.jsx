import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';

const ArtistProfile = ({ artist, songs, members, onClose }) => {
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

  const artistSongs = songs.filter(song => song.artist === artist);

  return (
    <div className="member-profile-overlay">
      <div className="member-profile" ref={profileRef}>
        <button className="close-profile" onClick={onClose}>×</button>
        <h2>Songs by {artist}</h2>
        <div className="member-songs">
          {artistSongs.map(song => (
            <div key={`${song.id}-${song.addedAt}`} className="profile-song-card">
              <img src={song.albumArt} alt={song.name} />
              <div className="song-info">
                <h3>{song.name}</h3>
                <p className="added-by">Added by {members[song.addedBy]}</p>
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

export default ArtistProfile; 