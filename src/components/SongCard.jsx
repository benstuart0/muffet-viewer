import React, { useState } from 'react';

const SongCard = ({ song, member, memberId, onMemberClick, onArtistClick }) => {
  const getGenreClass = (genre) => {
    return genre?.toLowerCase().replace(/[^a-z]/g, '-') || '';
  };

  const handleMemberClick = (e) => {
    e.preventDefault();
    onMemberClick({ id: memberId, name: member });
  };

  const handleArtistClick = (e) => {
    e.preventDefault();
    onArtistClick(song.artist);
  };

  const handleNoPreview = (e) => {
    e.stopPropagation();
    // Open song in Spotify when preview isn't available
    window.open(song.spotifyUrl, '_blank');
  };

  // Only try to get genre if song exists
  const primaryGenre = song?.genres?.[0];
  const genreClass = getGenreClass(primaryGenre);

  return (
    <div className="song-card" data-genre={genreClass}>
      <h3 onClick={handleMemberClick} className="member-name">{member}</h3>
      <div className="album-art-container">
        <img src={song.albumArt} alt={song.name} />
        <button 
          className="preview-button"
          onClick={handleNoPreview}
          title="Open in Spotify"
        >
          ↗
        </button>
      </div>
      <h4>{song.name}</h4>
      <p onClick={handleArtistClick} className="artist-name">{song.artist}</p>
      {primaryGenre && (
        <span className="genre-tag">{primaryGenre}</span>
      )}
    </div>
  );
};

export default SongCard; 