import React, { useState } from 'react';
import SongCard from './SongCard';
import MemberProfile from './MemberProfile';
import ArtistProfile from './ArtistProfile';
import { isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns';

const SongGrid = ({ songs, weekStart, weekEnd }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);

  console.log('SongGrid received:', { 
    songsCount: songs.length, 
    weekStart: weekStart.toISOString(), 
    weekEnd: weekEnd.toISOString(),
    firstSong: songs[0] // Log the first song to see its structure
  });
  // Replace these IDs with your actual Spotify user IDs
  const members = {
    'daamenik': 'Dom',
    'shmizlish': 'Dana',
    '1258022414': 'Sheng-Jie',
    '1252565469': 'Ben'
  };
  
  const getSongsForWeek = () => {
    return Object.entries(members)
      .map(([memberId, memberName]) => {
        const song = songs.find(song => {
          const addedDate = parseISO(song.addedAt);
          return song.addedBy === memberId && 
            isWithinInterval(addedDate, { 
              start: startOfDay(weekStart), 
              end: endOfDay(weekEnd) 
            });
        });
        // Add memberId to create a unique combination
        return song ? { 
          ...song, 
          memberName,
          uniqueId: `${song.id}-${memberId}` // Create unique ID combining song and member
        } : null;
      })
      .filter(Boolean); // Remove null entries
  };

  const weekSongs = getSongsForWeek();

  return (
    <>
      <div className="song-grid">
        {weekSongs.map(song => (
          <SongCard 
            key={song.uniqueId}
            song={song}
            member={song.memberName}
            memberId={song.addedBy}
            onMemberClick={setSelectedMember}
            onArtistClick={setSelectedArtist}
          />
        ))}
      </div>

      {selectedMember && (
        <MemberProfile 
          member={selectedMember}
          songs={songs}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {selectedArtist && (
        <ArtistProfile 
          artist={selectedArtist}
          songs={songs}
          members={members}
          onClose={() => setSelectedArtist(null)}
        />
      )}
    </>
  );
};

export default SongGrid; 