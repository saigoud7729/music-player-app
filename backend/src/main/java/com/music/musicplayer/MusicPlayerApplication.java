package com.music.musicplayer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MusicPlayerApplication {
    public static void main(String[] args) {
        SpringApplication.run(MusicPlayerApplication.class, args);
        System.out.println("Music Player Backend running at http://localhost:8080");
        System.out.println("API available at http://localhost:8080/api/songs");
    }
}
