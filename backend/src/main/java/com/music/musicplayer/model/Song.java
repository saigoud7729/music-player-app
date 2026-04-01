package com.music.musicplayer.model;

import jakarta.persistence.*;

@Entity
@Table(name = "songs")
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artist;

    @Column(nullable = false)
    private String url;

    @Column
    private String album;

    @Column
    private String duration;

    public Song() {}

    public Song(String title, String artist, String url, String album, String duration) {
        this.title = title;
        this.artist = artist;
        this.url = url;
        this.album = album;
        this.duration = duration;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getArtist() { return artist; }
    public void setArtist(String artist) { this.artist = artist; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getAlbum() { return album; }
    public void setAlbum(String album) { this.album = album; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
}
