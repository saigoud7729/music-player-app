# Music Player App

A full-stack music player with React frontend and Spring Boot backend.

## Project Structure

```
music-player/
├── backend/     ← Spring Boot (Java 17, MySQL)
└── frontend/    ← React + Vite
```

---

## Backend Setup

### Requirements
- Java 17+
- Maven
- MySQL

### Steps

1. Create MySQL database:
   ```sql
   CREATE DATABASE music_db;
   ```

2. Edit `backend/src/main/resources/application.properties`:
   ```
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

3. Run:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

Backend runs at: **http://localhost:8080**

### Add Sample Songs (MySQL)

```sql
INSERT INTO songs (title, artist, url, album, duration) VALUES
('Song 1', 'Artist A', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'Album A', '3:30'),
('Song 2', 'Artist B', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'Album B', '4:15'),
('Song 3', 'Artist C', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'Album C', '2:55');
```

---

## Frontend Setup

### Requirements
- Node.js 18+

### Steps

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/songs | Get all songs |
| GET | /api/songs/{id} | Get song by ID |
| POST | /api/songs | Add new song |
| PUT | /api/songs/{id} | Update song |
| DELETE | /api/songs/{id} | Delete song |
| GET | /api/songs/search?keyword= | Search by title |
| GET | /api/songs/artist/{artist} | Get by artist |
