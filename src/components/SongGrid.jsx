import React, { useState } from 'react';
import SongCard from './SongCard';
import MemberProfile from './MemberProfile';
import ArtistProfile from './ArtistProfile';
import { isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns';

const SongGrid = ({ songs, weekStart, weekEnd }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Define preferred member order
  const memberOrder = [
    { id: 'daamenik', name: 'Dom' },
    { id: '1252565469', name: 'Ben' },
    { id: '1258022414', name: 'Sheng-Jie' },
    { id: 'shmizlish', name: 'Dana' }
  ];

  // Create members object for lookups
  const members = memberOrder.reduce((acc, member) => {
    acc[member.id] = member.name;
    return acc;
  }, {});

  // Get first song per member for the week and sort by preferred member order
  const weekSongs = songs
    // First filter songs within the week
    .filter(song => {
      const addedDate = parseISO(song.addedAt);
      return isWithinInterval(addedDate, { 
        start: startOfDay(weekStart), 
        end: endOfDay(weekEnd) 
      });
    })
    // Group by member and take first song
    .reduce((acc, song) => {
      // If we haven't seen this member yet, add their first song
      if (!acc.some(s => s.addedBy === song.addedBy)) {
        acc.push(song);
      }
      return acc;
    }, [])
    // Sort by preferred member order
    .sort((a, b) => {
      const orderA = memberOrder.findIndex(m => m.id === a.addedBy);
      const orderB = memberOrder.findIndex(m => m.id === b.addedBy);
      return orderA - orderB;
    });

  return (
    <>
      <div className="song-grid">
        {weekSongs.map(song => (
          <SongCard 
            key={`${song.id}-${song.addedBy}`}
            song={song}
            member={members[song.addedBy]}
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