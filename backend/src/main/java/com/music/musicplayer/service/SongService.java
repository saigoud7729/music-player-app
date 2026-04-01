package com.music.musicplayer.service;

import com.music.musicplayer.model.Song;
import com.music.musicplayer.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SongService {

    private final SongRepository songRepository;

    @Autowired
    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    public Optional<Song> getSongById(Long id) {
        return songRepository.findById(id);
    }

    public Song saveSong(Song song) {
        return songRepository.save(song);
    }

    public Song updateSong(Long id, Song updatedSong) {
        return songRepository.findById(id).map(song -> {
            song.setTitle(updatedSong.getTitle());
            song.setArtist(updatedSong.getArtist());
            song.setUrl(updatedSong.getUrl());
            song.setAlbum(updatedSong.getAlbum());
            song.setDuration(updatedSong.getDuration());
            return songRepository.save(song);
        }).orElseThrow(() -> new RuntimeException("Song not found with id: " + id));
    }

    public void deleteSong(Long id) {
        songRepository.deleteById(id);
    }

    public List<Song> searchByTitle(String keyword) {
        return songRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public List<Song> getSongsByArtist(String artist) {
        return songRepository.findByArtist(artist);
    }
}
