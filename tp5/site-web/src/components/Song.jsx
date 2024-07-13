import React, { useState, useContext } from "react";
import { ACTIONS } from "../reducers/reducer";

import PlaylistContext from "../contexts/PlaylistContext";

export default function Song({ song, index }) {
  const { dispatch } = useContext(PlaylistContext);
  const [liked, setLiked] = useState(song.liked);
  const api = useContext(PlaylistContext).api;
  const toggleLike = (event) => {
    event.preventDefault();
    event.stopPropagation();
    api.updateSong(parseInt(song.id));
    setLiked(!liked);
  };

  const playSong = () => {
    const actualIndex = parseInt(index) - 1;
    dispatch({ type: ACTIONS.PLAY, payload: { index: actualIndex }});
  };
  return (
    <section
      className="song-item flex-row"
      onClick={(event) => {
        event.preventDefault();
        if (index) { playSong(); }
      }}
    >
      {index ? <span>{index}</span> : <></>}
      <p>{song.name}</p>
      <p>{song.genre}</p>
      <p>{song.artist}</p>

      <button
        className={`${liked ? "fa" : "fa-regular"} fa-2x fa-heart`}
        onClick={(event) => {
          if (index) { 
            toggleLike(event); 
          }
        }}
      ></button>
    </section>
  );
}
