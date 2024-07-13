import StorageManager from "./storageManager.js";

class Library {
  constructor (storageManager) {
    this.storageManager = storageManager;
  }

  /**
   * Génère le code HTML pour l'affichage des playlists et chansons disponibles
   * @param {Object[]} playlists liste de playlists à afficher
   * @param {Object[]} songs liste de chansons à afficher
   */
  generateLists (playlists, songs) {
    const playlistContainer = document.getElementById("playlist-container");
    playlistContainer.innerHTML = ""; // vider la liste
    
    playlists.forEach(playlist => playlistContainer.appendChild(this.buildPlaylistItem(playlist)));
    
    const songContainer = document.getElementById("song-container");
    songContainer.innerHTML = "";
    songs.forEach(song => songContainer.appendChild(this.buildSongItem(song)));
  }

  /**
   * Construit le code HTML qui représente l'affichage d'une playlist
   * @param {Object} playlist playlist à utiliser pour la génération du HTML
   * @returns {HTMLAnchorElement} élément <a> qui contient le HTML de l'affichage pour une playlist
   */
  buildPlaylistItem (playlist) {
    const playlistItem = document.createElement("a");
    playlistItem.href = `./playlist.html?id=${playlist.id}`;
    playlistItem.className = "playlist-item flex-column";

    const thumbnail = document.createElement("img");
    thumbnail.src = playlist.thumbnail;
    const playIcon = document.createElement("i");
    playIcon.className = "fa fa-2x fa-play-circle hidden playlist-play-icon";

    const playlistPreview = document.createElement("div");
    playlistPreview.className = "playlist-preview";
    playlistPreview.appendChild(thumbnail);
    playlistPreview.appendChild(playIcon);

    const title = document.createElement("p");
    title.textContent = playlist.name;
    playlistItem.appendChild(title);

    const description = document.createElement("p");
    description.textContent = playlist.description;
    playlistItem.appendChild(description);

    playlistItem.appendChild(playlistPreview);
    playlistItem.appendChild(title);
    playlistItem.appendChild(description);

    return playlistItem;
  }

  /**
   * Construit le code HTML qui représente l'affichage d'une chansons
   * @param {Object} song chanson à utiliser pour la génération du HTML
   * @returns {HTMLDivElement} élément <div> qui contient le HTML de l'affichage pour une chanson
   */
  buildSongItem = function (song) {
    const songItem = document.createElement("div");
    songItem.className = "song-item flex-row";

    const name = document.createElement("p");
    name.textContent = song.name;
    songItem.appendChild(name);

    const genre = document.createElement("p");
    genre.textContent = song.genre;
    songItem.appendChild(genre);

    const artist = document.createElement("p");
    artist.textContent = song.artist;
    songItem.appendChild(artist);

    const likedButton = document.createElement("button");
    likedButton.className = "fa-2x fa-heart";
    if (song.liked) {
      likedButton.classList.add("fa");
    } else {
      likedButton.classList.add("fa-regular");
    }
    songItem.appendChild(likedButton);

    const toggleLiked = () => {
      song.liked = !song.liked;
      this.storageManager.replaceItem("songs", song);
      likedButton.classList.toggle("fa");
      likedButton.classList.toggle("fa-regular");
    }
    songItem.addEventListener("click", toggleLiked);

    return songItem;
  };
}

window.onload = () => {
  const storageManager = new StorageManager();
  const library = new Library(storageManager);

  storageManager.loadAllData();

  
  const stored_playlists = storageManager.getData("playlist");
  const stored_songs = storageManager.getData("songs");
  library.generateLists(stored_playlists, stored_songs);
};
