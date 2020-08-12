import React, { Component } from "react";
import "./App.css";
const token =
  "BQBsAG1bYrZWfvFD25PFp-_bEY-jajgZEzDxRrJE8Q3pAmJ2TiEsPDyaN1iR8vfFS53BT0YQjNxEmT5rYUU68Z5OC1ZrsHPFz0k_Qnii5Ru3S_ejung4g19IqEZbFk8rRPTYG11YuzvBZSx0eQaHNqy6MUwScwLbl3o";
const headers = {
  Authorization: `Bearer ${token}`,
};

function getArtistURL(artistName) {
  return `https://api.spotify.com/v1/search?q=${artistName}&type=artist`;
}
function getTrack(track, artistName) {
  return `https://api.spotify.com/v1/search?q=track:${track} artist:${artistName}&type=track`;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      artists: [],
      track: "",
      searchedTracks: [],
      pickedArtist: null,
    };
  }

  handleInput = (event) => this.setState({ input: event.target.value });

  handleTrack = (event) => this.setState({ track: event.target.value });

  //handleInput = ({ target: { value } }) => this.setState({ input: value });

  handleClick = (event) => {
    const artistName = this.state.input;
    const URL = getArtistURL(artistName);
    fetch(URL, { headers: headers })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((result) => {
        this.setState({ artists: result.artists.items });
      })
      .catch((err) => console.log(err));
  };

  handleArtist = (index) => (event) => {
    this.setState({ pickedArtist: this.state.artists[index] });
  };

  handleArtistTrack = (event) => {
    const trackName = this.state.track;
    const URL = getTrack(trackName, this.state.pickedArtist.name);
    fetch(URL, { headers: headers })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Response not ok");
      })
      .then((res) => {
        this.setState({ searchedTracks: res.tracks.items });
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { pickedArtist, input, artists, track, searchedTracks } = this.state;
    return (
      <>
      <h1 className="header">Artists & songs</h1>
        {!pickedArtist && (
          <>
            <div>
              <label>Artist name: </label>
              <input value={input} onChange={this.handleInput} type="text" className="input" />
              <button onClick={this.handleClick} className="button">Search Artist</button>
            </div>
            <div className="artists">
              {artists.map((artist, index) => (
                <div key={artist.id}>
                  <button onClick={this.handleArtist(index)} className="artistButton">
                    {artist.name}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        {pickedArtist && (
          <div className="label">Your Artist: {pickedArtist && pickedArtist.name}</div>
        )}
        {pickedArtist && searchedTracks.length === 0 && (
          <div>
            <label >Track:</label>
            <input value={track} onChange={this.handleTrack} type="text" className="input"/>
            <button onClick={this.handleArtistTrack} className="button">Search</button>
          </div>
        )}
        {searchedTracks && searchedTracks.length > 0 && (
          <div>
            <div className="label">Your song: {track}</div>
            <div className="songs">
              <div className="title">Songs found:</div>
              {searchedTracks.map((tracks) => (
                <div key={tracks.id} className="songs">{tracks.name}</div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }
}

export default App;
