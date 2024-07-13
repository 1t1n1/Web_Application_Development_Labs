import StorageManager from "./storageManager.js";
import { formatTime } from "./utils.js";
import { SKIP_TIME, SHORTCUTS } from "./consts.js";
import Player from "./player.js";

export class PlayListManager {
  constructor (player) {
    /**
     * @type {Player}
     */
    this.player = player;
    this.shortcuts = new Map();
  }

  /**
   * Charge les chansons de la playlist choisie et construit dynamiquement le HTML pour les éléments de chansons
   * @param {StorageManager} storageManager gestionnaire d'accès au LocalStorage
   * @param {string} playlistId identifiant de la playlist choisie
   */
  loadSongs (storageManager, playlistId) {
    const playlist = storageManager.getItemById(
      storageManager.STORAGE_KEY_PLAYLISTS,
      playlistId
    );
    if (!playlist) return;

    const playlistImage = document.getElementById("playlist-img");
    playlistImage.src = playlist.thumbnail;

    const title = document.getElementById("playlist-title")
    title.textContent = playlist.name;

    const songContainer = document.getElementById("song-container");
    songContainer.innerHTML = "";
    const songs = [];
    for (let i = 0; i < playlist.songs.length; i++) {
      const song = storageManager.getItemById(storageManager.STORAGE_KEY_SONGS, playlist.songs[i].id);
      songs.push(song);
      songContainer.appendChild(this.buildSongItem(song, i));
    }

    this.player.loadSongs(songs)
  }

  /**
   * Construit le code HTML pour représenter une chanson
   * @param {Object} song la chansons à représenter
   * @param {number} index index de la chanson
   * @returns {HTMLDivElement} le code HTML dans un élément <div>
   */
  buildSongItem (song, index) {
    const songItem = document.createElement("div");
    songItem.classList.add("song-item", "flex-row");

    const songIndex = document.createElement("span");
    songIndex.textContent = index;
    songItem.appendChild(songIndex);

    const name = document.createElement("p");
    name.textContent = song.name;
    songItem.appendChild(name);

    const genre = document.createElement("p");
    genre.textContent = song.genre;
    songItem.appendChild(genre);

    const artist = document.createElement("p");
    artist.textContent = song.artist;
    songItem.appendChild(artist);

    const likedButton = document.createElement("i");
    likedButton.className = "fa-2x fa-heart";
    if (song.liked) {
      likedButton.classList.add("fa");
    } else {
      likedButton.classList.add("fa-regular");
    }
    songItem.appendChild(likedButton);

    songItem.addEventListener("click", () => { this.playAudio(index) })

    return songItem;
  }

  /**
   * Joue une chanson en fonction de l'index et met à jour le titre de la chanson jouée
   * @param {number} index index de la chanson
   */
  playAudio (index) {
    this.player.playAudio(index);
    this.setCurrentSongName();

    const playButton = document.getElementById("play");
    playButton.classList.toggle("fa-play");
    playButton.classList.toggle("fa-pause");
  }

  /**
   * Joue la prochaine chanson et met à jour le titre de la chanson jouée
   */
  playPreviousSong () {
    this.player.playPreviousSong();
    this.setCurrentSongName();
  }

  /**
   * Joue la chanson précédente et met à jour le titre de la chanson jouée
   */
  playNextSong () {
    this.player.playNextSong();
    this.setCurrentSongName();
  }

  /**
   * Met à jour le titre de la chanson jouée dans l'interface
   */
  setCurrentSongName () {
    const currentSong = this.player.currentSong;
    const nowPlaying = document.getElementById("now-playing");
    nowPlaying.textContent = currentSong.name;
  }

  /**
   * Met à jour la barre de progrès de la musique
   * @param {HTMLSpanElement} currentTimeElement élément <span> du temps de la chanson
   * @param {HTMLInputElement} timelineElement élément <input> de la barre de progrès
   * @param {HTMLSpanElement} durationElement élément <span> de la durée de la chanson
   */
  timelineUpdate (currentTimeElement, timelineElement, durationElement) {
    const position =
      (100 * this.player.audio.currentTime) / this.player.audio.duration;
    timelineElement.value = position;
    currentTimeElement.textContent = formatTime(this.player.audio.currentTime);
    if (!isNaN(this.player.audio.duration)) {
      durationElement.textContent = formatTime(this.player.audio.duration);
    }
  }

  /**
   * Déplacement le progrès de la chansons en fonction de l'attribut 'value' de timeLineEvent
   * @param {HTMLInputElement} timelineElement élément <input> de la barre de progrès
   */
  audioSeek (timelineElement) {
    this.player.audioSeek(timelineElement.value);
  }

  /**
   * Active ou désactive le son
   * Met à jour l'icône du bouton et ajoute la classe 'fa-volume-mute' si le son ferme ou 'fa-volume-high' si le son est ouvert
   */
  muteToggle () {
    this.player.muteToggle();
    const soundButton = document.getElementById("mute");
    soundButton.classList.toggle("fa-volume-high");
    soundButton.classList.toggle("fa-volume-mute");
  }

  /**
   * Active ou désactive l'attribut 'shuffle' de l'attribut 'player'
   * Met à jour l'icône du bouton et ajoute la classe 'control-btn-toggled' si shuffle est activé, retire la classe sinon
   * @param {HTMLButtonElement} shuffleButton élément <button> de la fonctionnalité shuffle
   */
  shuffleToggle (shuffleButton) {
    this.player.shuffleToggle();
    shuffleButton.classList.toggle("control-btn-toggled");
  }

  /**
   * Ajoute delta secondes au progrès de la chanson en cours
   * @param {number} delta temps en secondes
   */
  scrubTime (delta) {
    this.player.scrubTime(delta);
  }

  /**
   * Configure la gestion des événements
   */
  bindEvents () {
    const currentTime = document.getElementById("timeline-current");
    const duration = document.getElementById("timeline-end");
    const timeline = document.getElementById("timeline");
    this.player.audio.addEventListener("timeupdate", () => {
      this.timelineUpdate(currentTime, timeline, duration);
    });

    timeline.addEventListener("input", () => {
      this.audioSeek(timeline);
    });

    this.player.audio.addEventListener("ended", () => {
      this.playNextSong();
    });

    const playButton = document.getElementById("play");
    playButton.addEventListener("click", () => {
      this.playAudio();
    });

    const muteButton = document.getElementById("mute");
    muteButton.addEventListener("click", () => {
      this.muteToggle();
    });

    const previousSongButton = document.getElementById("previous");
    previousSongButton.addEventListener("click", () => {
      this.playPreviousSong();
    });

    const nextSongButton = document.getElementById("next");
    nextSongButton.addEventListener("click", () => {
      this.playNextSong();
    });

    const shuffleButton = document.getElementById("shuffle");
    shuffleButton.addEventListener("click", () => {
      this.shuffleToggle(shuffleButton);
    });
  }

  /**
   * Configure les raccourcis et la gestion de l'événement 'keydown'
   */
  bindShortcuts () {
    this.shortcuts.set(SHORTCUTS.GO_FORWARD, () => this.scrubTime(SKIP_TIME));
    this.shortcuts.set(SHORTCUTS.GO_BACK, () => this.scrubTime(-SKIP_TIME));
    this.shortcuts.set(SHORTCUTS.PLAY_PAUSE, () => this.playAudio());
    this.shortcuts.set(SHORTCUTS.NEXT_SONG, () => this.playNextSong());
    this.shortcuts.set(SHORTCUTS.PREVIOUS_SONG, () => this.playPreviousSong());
    this.shortcuts.set(SHORTCUTS.MUTE, () => this.muteToggle());

    document.addEventListener("keydown", (event) => {
      if (this.shortcuts.has(event.key)) {
        const command = this.shortcuts.get(event.key);
        command();
      }
    });
  }
}

window.onload = () => {
  const storageManager = new StorageManager();
  storageManager.loadAllData();

  const playlistId = new URLSearchParams(document.location.search).get("id");

  const player = new Player();
  const playlistManager = new PlayListManager(player);

  playlistManager.bindEvents();
  playlistManager.bindShortcuts();

  playlistManager.loadSongs(storageManager, playlistId);
};
