import React from 'react';
import './GameStats.css';
import SunkenShips from './SunkenShips';

const GameStats = props => {
  return (
    <div>
      <div className="message">
        <h2>{props.msg}</h2>
      </div>
      <div className="stats">
        <h3>Zatopione statki: <span>{props.sunkenShips.length}</span></h3>
        <div className="sunkenShips">
          <SunkenShips sunkenShips={props.sunkenShips} />
        </div>
        <h3>Liczba ruchów: <span>{props.playerMoves}</span></h3>
      </div>
    </div >
  )
}

export default GameStats;