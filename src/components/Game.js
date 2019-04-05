import React, {
  Component
} from 'react';
import hit from '../audio/hit.mp3';
import miss from '../audio/miss.mp3';
import gameover from '../audio/gameover.mp3';
import GameController from './GameController';
import GameBoard from './GameBoard';
import GameStats from './GameStats';


class Game extends Component {

  state = {
    gameOn: false,
    boardSize: 10,
    numberOfShips: 0,
    sunkenShips: [],
    playerMoves: 0,
    message: "Cel, ognia!",
    letters: [],
    ships: []
  }

  playNewGame = () => {
    let {
      boardSize,
      numberOfShips,
      letters,
      ships
    } = this.state

    for (let ship of ships) {
      for (let i = 0; i < ship.length; i++) {
        ship.locations[i] = ""
        ship.hits[i] = ""
      }
      ship.isSunk = false
    }

    this.setState({
      gameOn: true,
      sunkenShips: [],
      playerMoves: 0,
      message: "Cel, ognia!",
      ships
    })

    setTimeout(this.generateShipLocations(boardSize, numberOfShips, letters, ships), 100)
  }

  generateShipLocations(boardSize, numberOfShips, letters, ships) {
    let locations
    for (let ship of ships) {
      do {
        locations = this.generateShip(ship, boardSize, letters)
      }
      while (this.collision(locations, ships, letters))
      ship.locations = locations
    }

    this.setState({
      boardSize,
      numberOfShips,
      letters,
      ships
    })
  }

  generateShip(ship, boardSize, letters) {
    const direction = Math.floor(Math.random() * 2)
    let column = letters
    let row = boardSize
    let index = 0
    if (direction === 1) { // kierunek poziomy
      row = Math.ceil(Math.random() * boardSize)
      index = Math.floor(Math.random() * (boardSize - ship.length))
    } else { // kierunek pionowy
      row = Math.ceil(Math.random() * (boardSize - ship.length))
      index = Math.floor(Math.random() * boardSize)
    }

    const newShipLocations = []
    for (let i = 0; i < ship.length; i++) {
      if (direction === 1) {
        newShipLocations.push((column[index + i]) + row)
      } else {
        newShipLocations.push(column[index] + (row + i))
      }
    }
    return newShipLocations
  }

  collision(locations, ships, letters) {
    let locationsArea = []

    for (let ship of ships) {

      for (let i = 0; i < ship.length; i++) {
        if (ship.locations[i]) {
          const char = ship.locations[i].charAt(0)
          let charPrev = false
          let charNext = false
          let nextIndex = letters.indexOf(char) + 1
          let prevIndex = letters.indexOf(char) - 1

          let number = ship.locations[i].substr(1)
          let numberPrev = number
          let numberNext = number

          if (letters.indexOf(char) > 0 && letters.indexOf(char) < 9) {
            charPrev = letters[prevIndex]
            charNext = letters[nextIndex]
          } else if (letters.indexOf(char) === 9) {
            charPrev = letters[prevIndex]
            charNext = false
          } else if (letters.indexOf(char) === 0) {
            charPrev = false
            charNext = letters[nextIndex]
          }
          if (numberPrev === 1) {
            numberPrev = false
            numberNext++
          } else if (numberNext === 10) {
            numberPrev--
            numberNext = false
          } else if (numberPrev > 1 && numberNext < 10) {
            numberPrev--
            numberNext++
          }

          if (charPrev && numberPrev) {
            locationsArea.push(charPrev + numberPrev)
          }
          if (charPrev && number) {
            locationsArea.push(charPrev + number)
          }
          if (charPrev && numberNext) {
            locationsArea.push(charPrev + numberNext)
          }

          if (char && numberPrev) {
            locationsArea.push(char + numberPrev)
          }
          if (char && numberNext) {
            locationsArea.push(char + numberNext)
          }

          if (charNext && numberPrev) {
            locationsArea.push(charNext + numberPrev)
          }
          if (charNext && number) {
            locationsArea.push(charNext + number)
          }
          if (charNext && numberNext) {
            locationsArea.push(charNext + numberNext)
          }

        }

        if (ship.locations.indexOf(locations[i]) >= 0) {
          return true
        } else if (locationsArea.indexOf(locations[i]) >= 0) {
          return true
        }
      }
    }
    return false
  }

  handleGuess = e => {
    let id = e.target.id
    let message = ""

    if (this.state.gameOn) {

      if (e.target.classList.contains("hit") || e.target.classList.contains("miss")) {
        message = "Wybierz nowe współrzędne"
        id = 0
      } else {
        let ships = [...this.state.ships]
        let sunkenShips = this.state.sunkenShips

        for (let ship of ships) {
          let index = ship.locations.indexOf(id)
          if (index >= 0) {
            ship.hits[index] = "hit"
            message = "Trafiony!"
            if (this.isSunk(ship)) {
              message = "Trafiony zatopiony!"
              ship.isSunk = true;
              sunkenShips.push(ship.length)
              if (sunkenShips.length === this.state.numberOfShips) {
                message = "Koniec gry"
              }
            }
            break;
          } else {
            message = "Pudło!"
          }
        }
        this.setState(() => ({
          ships,
          sunkenShips
        }))
      }
      this.viewResult(message, id)
    }
  }

  isSunk(ship) {
    let hits = 0
    for (let i = 0; i < ship.length; i++) {
      if (ship.hits[i] === "hit") {
        hits++
      }
    }
    if (hits === ship.length) {
      for (let i = 0; i < ship.length; i++) {
        document.getElementById(ship.locations[i]).classList.add("sunk")
      }
      return true
    }
  }

  viewResult(message, id) {

    if (id === 0) {
      this.setState({
        message
      })
    } else {
      let playerMoves = this.state.playerMoves
      playerMoves++

      if (message === "Trafiony!" || message === "Trafiony zatopiony!" || message === "Koniec gry") {
        const audio = new Audio(hit)
        audio.play()
        document.getElementById(id).classList.add("hit")
        if (message === "Koniec gry") {
          const audio = new Audio(gameover)
          audio.play()
          this.setState({
            gameOn: false
          })
        }
      } else if (message === "Pudło!") {
        const audio = new Audio(miss)
        audio.play()
        document.getElementById(id).classList.add("miss")
      }
      this.setState(() => ({
        message,
        playerMoves
      }))
    }
  }

  componentDidMount() {
    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : "640";
    const deviceHeight = (window.innerHeight > 0) ? window.innerHeight : "360";

    let boardSize = 10
    let numberOfShips = 6
    let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    let ships = [{
      length: 5,
      locations: ["", "", "", "", ""],
      hits: ["", "", "", "", ""],
      isSunk: false,
    },
    {
      length: 4,
      locations: ["", "", "", ""],
      hits: ["", "", "", ""],
      isSunk: false,
    },
    {
      length: 3,
      locations: ["", "", ""],
      hits: ["", "", ""],
      isSunk: false,
    },
    {
      length: 3,
      locations: ["", "", ""],
      hits: ["", "", ""],
      isSunk: false,
    },
    {
      length: 2,
      locations: ["", ""],
      hits: ["", ""],
      isSunk: false,
    },
    {
      length: 2,
      locations: ["", ""],
      hits: ["", ""],
      isSunk: false,
    }
    ]

    if (deviceWidth <= 823 && deviceHeight < 1024) {
      boardSize = 6;
      numberOfShips = 3;
      letters = ["A", "B", "C", "D", "E", "F"];
      ships = [{
        length: 4,
        locations: ["", "", "", ""],
        hits: ["", "", "", ""],
        isSunk: false,
      },
      {
        length: 3,
        locations: ["", "", ""],
        hits: ["", "", ""],
        isSunk: false,
      },
      {
        length: 2,
        locations: ["", ""],
        hits: ["", ""],
        isSunk: false,
      }

      ]
    }
    this.generateShipLocations(boardSize, numberOfShips, letters, ships)
  }

  render() {
    const {
      gameOn,
      boardSize,
      letters,
      sunkenShips,
      playerMoves,
      message,
      ships
    } = this.state

    return (<>
      {
        !gameOn && < GameController gameOn={
          gameOn
        }
          playerMoves={
            playerMoves
          }
          playNewGame={
            this.playNewGame
          }
        />} {
        gameOn && < GameBoard letters={
          letters
        }
          boardSize={
            boardSize
          }
          handleGuess={
            this.handleGuess
          }
        />} {
        gameOn && < GameStats msg={
          message
        }
          sunkenShips={
            sunkenShips
          }
          playerMoves={
            playerMoves
          }
          ships={
            ships
          }
        />} </>
    );
  }
}

export default Game;