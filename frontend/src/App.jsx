import { useState, useRef, useEffect } from 'react'
import './App.css'

const API = 'http://localhost:8080/api/songs'

export default function App() {
  const [songs, setSongs] = useState([])
  const [current, setCurrent] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [totalTime, setTotalTime] = useState('0:00')
  const [volume, setVolume] = useState(1)
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSong, setNewSong] = useState({ title: '', artist: '', url: '', album: '', duration: '' })
  const [error, setError] = useState('')
  const audioRef = useRef(null)

  useEffect(() => {
    loadSongs()
  }, [])

  useEffect(() => {
    if (current && audioRef.current) {
      audioRef.current.src = current.url
      audioRef.current.volume = volume
      audioRef.current.play()
      setPlaying(true)
    }
  }, [current])

  const loadSongs = () => {
    fetch(API)
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(() => setError('Could not connect to backend. Make sure Spring Boot is running on port 8080.'))
  }

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const togglePlay = () => {
    if (!current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }

  const handleTimeUpdate = () => {
    const { currentTime, duration } = audioRef.current
    setProgress((currentTime / duration) * 100 || 0)
    setCurrentTime(formatTime(currentTime))
    setTotalTime(formatTime(duration))
  }

  const handleSeek = (e) => {
    const val = e.target.value
    audioRef.current.currentTime = (val / 100) * audioRef.current.duration
    setProgress(val)
  }

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value)
    audioRef.current.volume = val
    setVolume(val)
  }

  const playNext = () => {
    const idx = songs.findIndex(s => s.id === current?.id)
    if (idx < songs.length - 1) setCurrent(songs[idx + 1])
  }

  const playPrev = () => {
    const idx = songs.findIndex(s => s.id === current?.id)
    if (idx > 0) setCurrent(songs[idx - 1])
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(() => {
        setSongs(songs.filter(s => s.id !== id))
        if (current?.id === id) {
          setCurrent(null)
          setPlaying(false)
        }
      })
      .catch(() => setError('Failed to delete song.'))
  }

  const handleAddSong = (e) => {
    e.preventDefault()
    if (!newSong.title || !newSong.artist || !newSong.url) {
      setError('Title, Artist and URL are required.')
      return
    }
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSong)
    })
      .then(res => res.json())
      .then(saved => {
        setSongs([...songs, saved])
        setNewSong({ title: '', artist: '', url: '', album: '', duration: '' })
        setShowAddForm(false)
        setError('')
      })
      .catch(() => setError('Failed to add song.'))
  }

  const filtered = songs.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.artist.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app">
      <div className="sidebar">
        <div className="logo">🎵 MusicPlayer</div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search songs or artists..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="sidebar-header">
          <span>Your Library</span>
          <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>+</button>
        </div>

        {showAddForm && (
          <form className="add-form" onSubmit={handleAddSong}>
            <input
              placeholder="Title *"
              value={newSong.title}
              onChange={e => setNewSong({ ...newSong, title: e.target.value })}
            />
            <input
              placeholder="Artist *"
              value={newSong.artist}
              onChange={e => setNewSong({ ...newSong, artist: e.target.value })}
            />
            <input
              placeholder="Audio URL *"
              value={newSong.url}
              onChange={e => setNewSong({ ...newSong, url: e.target.value })}
            />
            <input
              placeholder="Album (optional)"
              value={newSong.album}
              onChange={e => setNewSong({ ...newSong, album: e.target.value })}
            />
            <input
              placeholder="Duration e.g. 3:45 (optional)"
              value={newSong.duration}
              onChange={e => setNewSong({ ...newSong, duration: e.target.value })}
            />
            <div className="form-buttons">
              <button type="submit" className="save-btn">Save</button>
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {error && <div className="error-msg">{error}</div>}

        <div className="song-list">
          {filtered.length === 0 && (
            <p className="no-songs">No songs found.</p>
          )}
          {filtered.map(song => (
            <div
              key={song.id}
              className={`song-item ${current?.id === song.id ? 'active' : ''}`}
              onClick={() => setCurrent(song)}
            >
              <div className="song-icon">{current?.id === song.id && playing ? '▶' : '♪'}</div>
              <div className="song-info">
                <span className="song-title">{song.title}</span>
                <span className="song-artist">{song.artist}{song.album ? ` • ${song.album}` : ''}</span>
              </div>
              <div className="song-right">
                {song.duration && <span className="song-duration">{song.duration}</span>}
                <button className="delete-btn" onClick={(e) => handleDelete(song.id, e)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        {current ? (
          <div className="now-playing-screen">
            <div className="album-art">
              <div className="album-art-inner">🎵</div>
            </div>
            <div className="track-info">
              <h2>{current.title}</h2>
              <p>{current.artist}</p>
              {current.album && <p className="album-name">{current.album}</p>}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🎶</div>
            <h2>Welcome to Music Player</h2>
            <p>Select a song from your library to start playing</p>
          </div>
        )}
      </div>

      <div className="player-bar">
        <div className="player-track">
          {current && (
            <>
              <span className="player-title">{current.title}</span>
              <span className="player-artist">{current.artist}</span>
            </>
          )}
        </div>

        <div className="player-center">
          <div className="player-controls">
            <button onClick={playPrev} disabled={!current}>⏮</button>
            <button className="play-pause" onClick={togglePlay} disabled={!current}>
              {playing ? '⏸' : '▶'}
            </button>
            <button onClick={playNext} disabled={!current}>⏭</button>
          </div>
          <div className="progress-row">
            <span className="time">{currentTime}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="progress-bar"
              disabled={!current}
            />
            <span className="time">{totalTime}</span>
          </div>
        </div>

        <div className="player-volume">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            className="volume-bar"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </div>
  )
}
