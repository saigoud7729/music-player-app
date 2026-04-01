package com.music.musicplayer.repository;

import com.music.musicplayer.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findByArtist(String artist);
    List<Song> findByTitleContainingIgnoreCase(String keyword);
    List<Song> findByAlbumContainingIgnoreCase(String album);
}
