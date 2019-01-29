import React from 'react';
import './GameController.css';

const GameController = props => {
  let congrats = []
  const playerMoves = props.playerMoves
  congrats.push(
    <div key={playerMoves}>
      <h2>Gratulacje!</h2>
      <p>Wszystkie statki wroga zostały zatopione</p>
      <p>w {playerMoves} ruchach</p>
    </div>
  )

  return (
    <div className="gameController">
      <h2>
        {playerMoves > 0 && congrats}
      </h2>
      <button onClick={props.playNewGame}>Rozpocznij nową grę</button>
    </div>
  )
}

export default GameController;