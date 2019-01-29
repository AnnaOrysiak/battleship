import React from 'react';
import './GameBoard.css';

const GameBoard = props => {
  let letters = ["", ...props.letters];
  let boardRows = []

  for (let letter of letters) {
    boardRows.push(
      <div className="boardLetter" key={letter}>
        <p>{letter}</p>
      </div>
    )
  }

  for (let i = 1; i < letters.length; i++) {
    boardRows.push(
      <div className="boardRow" key={i}>
        <p>{i}</p>
      </div>
    )

    for (let j = 1; j < letters.length; j++) {
      boardRows.push(<div className="boardCell" key={letters[j] + i} id={letters[j] + i} onClick={props.handleGuess}></div>)
    }
  }

  return (
    <div className="board">
      {boardRows}
    </div>
  )
}

export default GameBoard;