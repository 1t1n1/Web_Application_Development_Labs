import { modulo, random } from "./utils.js";

export default class Player {
  constructor () {
    this.audio = new Audio();
    this.currentIndex = 0;
    this.songsInPlayList = [];
    this.shuffle = false;
  }

  /**
   * Charge les chansons à jour et configure la première chanson comme source pour l'audio
   * @param {Object[]} songsInPlayList chansons à jouer
   */
  loadSongs (songsInPlayList) {
    this.songsInPlayList = songsInPlayList;
    this.audio.src = songsInPlayList[this.currentIndex].src;
  }

  /**
   * Récupère une chanson à partir de son index et la retourne
   * @param {number} index index de la chanson
   * @returns une chanson en fonction de son index dans le tableau
   */
  getSongFromIndex (index) {
    return this.songsInPlayList[index];
  }

  /**
   * Joue une chanson en fonction de son index.
   * Si 'index' === -1, met l'audio et pause ou le joue si l'audio est déjà en pause
   * @param {number} index index de la chanson
   */
  playAudio (index = -1) {
    if (index === -1) {
      this.audio.paused ? this.audio.play() : this.audio.pause();
    } else {
      this.audio.load();
      this.audio.src = this.songsInPlayList[index].src;
      this.audio.play();
      this.currentIndex = index;
    }
  }

  /**
   * Incrémente l'index courant et joue la prochaine chanson avec le mouvel index.
   * Si la dernière chanson est présentement jouée, la première chanson de la liste devient la suivante
   * Si l'attribut 'shuffle' est true, l'index courant se fait assigner une valeur aléatoire valide
   */
  playPreviousSong () {
    let previousIndex = this.shuffle
      ? random(0, this.songsInPlayList.length - 1)
      : this.currentIndex - 1;
    previousIndex = modulo(previousIndex, this.songsInPlayList.length);
    this.playAudio(previousIndex);
  }

  /**
   * Décrémente l'index courant et joue la prochaine chanson avec le mouvel index.
   * Si la première chanson est présentement jouée, la dernière chanson de la liste devient la suivante
   * Si l'attribut 'shuffle' est true, l'index courant se fait assigner une valeur aléatoire valide
   */
  playNextSong () {
    let nextIndex = this.shuffle
      ? random(0, this.songsInPlayList.length - 1)
      : this.currentIndex + 1;
    nextIndex = modulo(nextIndex, this.songsInPlayList.length);
    this.playAudio(nextIndex);
  }

  /**
   * Modifie l'attribut 'currentTime' de l'attribut 'audio' pour modifier la place dans la chanson jouée
   * @param {number} timelineValue le pourcentage de la durée totale
   */
  audioSeek (timelineValue) {
    const time = (timelineValue * this.audio.duration) / 100;
    this.audio.currentTime = time;
  }

  /**
   * Change l'attribut 'volume' de l'attribut audio à 0 si le son est ouvert, à 1 sinon
   * @returns {boolean} true si le son est fermé, false sinon
   */
  muteToggle () {
    this.audio.volume = this.audio.volume ? 0 : 1;
    return !this.audio.volume;
  }

  /**
   * Inverse la valeur de l'attribut 'shuffle'
   * @returns {boolean} la valeur de l'attribut 'shuffle'
   */
  shuffleToggle () {
    this.shuffle = !this.shuffle;
    return this.shuffle;
  }

  /**
   * Ajoute delta secondes à l'attribut 'currentTime' de l'attribut 'audio'
   * @param {number} delta le temps en secondes
   */
  scrubTime (delta) {
    this.audio.currentTime += delta;
  }

  /**
   * Retourne la chanson présentement jouée
   * @returns {Object} la chansons présentement jouée
   */
  get currentSong () {
    return this.songsInPlayList[this.currentIndex];
  }
}
