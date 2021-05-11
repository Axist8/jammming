import React from 'react';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <p>searchbar will go here</p>
          <div className="App-playlist">
            <p>search results will go here</p>
            <p>playlist will go here</p>
          </div>
        </div>
      </div>
    )
  }
}

export default App;