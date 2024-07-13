import StorageManager from "./storageManager.js";

/**
 * Popule l'élément 'dataList' avec des éléments <option> en fonction des noms des chansons en paramètre
 * @param {HTMLDataListElement} dataList élément HTML à qui ajouter des options
 * @param {Object} songs liste de chansons dont l'attribut 'name' est utilisé pour générer les éléments <option>
 */
function buildDataList (dataList, songs) {
  dataList.innerHTML = "";

  
  songs.forEach(song => {
    const songOption = document.createElement("option");
    songOption.value = song.name;
    dataList.appendChild(songOption);
  })
}

/**
 * Permet de mettre à jour la prévisualisation de l'image pour la playlist
 */
function updateImageDisplay () {
  const imagePreview = document.getElementById("image-preview");
  imagePreview.src = URL.createObjectURL(this.files[0]);
}

/**
 * Ajoute le code HTML pour pouvoir ajouter une chanson à la playlist
 * Le code contient les éléments <label>, <input> et <button> dans un parent <div>
 * Le bouton gère l'événement "click" et retire le <div> généré de son parent
 * @param {Event} e événement de clic
 */
function addItemSelect (e) {

  e.preventDefault();
  
  const songContainer = document.getElementById("song-list");
  const songDiv = document.createElement("div");

  const songLabel = document.createElement("label");
  const lastSongInput = songContainer.lastElementChild.firstElementChild;
  const penultimateIndex = -2;
  const index = parseInt(lastSongInput.textContent.slice(penultimateIndex, -1)) + 1;
  songLabel.htmlFor = `song-${index}`;
  songLabel.textContent = `#${index} `;
  songDiv.appendChild(songLabel);

  const songInput = document.createElement("input");
  songInput.className = "song-input"
  songInput.id = `song-${index}`;
  songInput.type = "select";
  songInput.setAttribute("list", "song-dataList");
  songInput.required = true;
  songDiv.appendChild(songInput);

  
  const removeButton = document.createElement("button");
  removeButton.className = "fa fa-minus";
  songDiv.appendChild(removeButton);
  songContainer.appendChild(songDiv);

  removeButton.addEventListener("click", () => {
    songDiv.innerHTML = "";
  })
}

/**
 * Génère un objet Playlist avec les informations du formulaire et le sauvegarde dans le LocalStorage
 * @param {HTMLFormElement} form élément <form> à traiter pour obtenir les données
 * @param {StorageManager} storageManager permet la sauvegarde dans LocalStorage
 */
async function createPlaylist (form, storageManager) {
  const elements = form.elements;
  const playlists = storageManager.getData(storageManager.STORAGE_KEY_PLAYLISTS);
  const lastPlaylist = playlists[playlists.length - 1];
  const id = `${parseInt(lastPlaylist.id) + 1}`;
  const name = elements[1].value;
  const description = elements[2].value;
  const thumbnail = await getImageInput(elements[3]);

  const songsList = document.getElementsByClassName("song-input");
  const songs = [];
  for (const song of songsList) {
    songs.push({ id: storageManager.getIdFromName(storageManager.STORAGE_KEY_SONGS, song.value) });
  }

  const playlist = {
    id,
    name,
    description,
    thumbnail,
    songs
  }
  storageManager.addItem(storageManager.STORAGE_KEY_PLAYLISTS, playlist);

  window.location = "./index.html";
}

/**
 * Fonction qui permet d'extraire une image à partir d'un file input
 * @param {HTMLInputElement} input champ de saisie pour l'image
 * @returns image récupérée de la saisie
 */
async function getImageInput (input) {
  if (input && input.files && input.files[0]) {
    const image = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(reader.result);
      reader.readAsDataURL(input.files[0]);
    });
    return image;
  }
}

window.onload = () => {
  const imageInput = document.getElementById("image");
  const form = document.getElementById("playlist-form");
  const addSongButton = document.getElementById("add-song-btn");
  addSongButton.addEventListener("click", (e) => {
    addItemSelect(e);
  });

  const storageManager = new StorageManager();
  storageManager.loadAllData();
  const songs = storageManager.getData(storageManager.STORAGE_KEY_SONGS);

  const dataList = document.getElementById("song-dataList");
  buildDataList(dataList, songs);

  imageInput.addEventListener("change", updateImageDisplay);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    createPlaylist(form, storageManager);
  });
};
