const { FileSystemManager } = require("./file_system_manager");
const path = require("path");

class SongsManager {
  constructor () {
    this.JSON_PATH = path.join(__dirname + "../../data/songs.json");
    this.fileSystemManager = new FileSystemManager();
  }

  /**
   * Retourne la liste de toutes les chansons
   * @returns {Promise<Array>}
   */
  async getAllSongs () {
    const fileBuffer = await this.fileSystemManager.readFile(this.JSON_PATH);
    return JSON.parse(fileBuffer).songs;
  }

  /**
   * Retourne une chanson en fonction de son id
   * @param {number} id identifiant de la chanson
   * @returns chanson correspondant à l'id
   */
  async getSongById (id) {
    const songs = await this.getAllSongs();
    return songs.find((song) => song.id === id);
  }

  /**
   * Modifie l'état aimé d'une chanson par l'état inverse
   * @param {number} id identifiant de la chanson
   * @returns {boolean} le nouveau état aimé de la chanson
   */
  async updateSongLike (id) {
    const songs = await this.getAllSongs();
    const song = songs.find((song) => song.id === id);
    if (song === undefined) {
      return;
    }
    song.liked = !song.liked;
    await this.fileSystemManager.writeToJsonFile(this.JSON_PATH, JSON.stringify({ songs }));
    return song.liked;
  }
}

module.exports = { SongsManager };
