import React, { Component } from 'react';
import hit from '../audio/hit.mp3';
import miss from '../audio/miss.mp3';
import gameover from '../audio/gameover.mp3';
import GameController from './GameController';
import GameBoard from './GameBoard';
import GameStats from './GameStats';
import config from '../utlis/config';


class Game extends Component {

  state = {
    gameOn: false,
    boardSize: 10,
    sunkenShips: [],
    playerMoves: 0,
    message: "Cel, ognia!",
    ships: []
  }

  playNewGame = () => {
    const newShips = this.generateShipLocations(this.clearShips());

    this.setState({
      gameOn: true,
      sunkenShips: [],
      playerMoves: 0,
      message: "Cel, ognia!",
      ships: newShips
    }, () => console.log(this.state.ships))
  }

  clearShips() {
    return this.state.ships.map(ship => ({
      ...ship,
      locations: [
        ...ship.locations.map(location => ({
          x: null,
          y: null,
          hit: false
        }))
      ],
      isSunk: false,
    }));
  }

  generateShipLocations(cleanShips) {
    const shipsCoordinates = [];

    const ships = cleanShips.map(ship => {
      let locations;

      if (shipsCoordinates.length) {
        const checkShipsColision = () => {
          locations = this.getShipCoordinates(this.getRandomCoordinates(), ship);
          if (this.checkCurrentLocationsCollision(shipsCoordinates, locations)) {
            checkShipsColision();
          }
          else {
            shipsCoordinates.push(locations.map(location => (
              { ...location, x: location.x, y: location.y }
            )
            )
            )
          }
        }
        checkShipsColision();
      }
      else {
        locations = this.getShipCoordinates(this.getRandomCoordinates(), ship);
        shipsCoordinates.push(locations.map(location => (
          { ...location, x: location.x, y: location.y }
        )
        )
        )
      }
      return ({ ...ship, locations })
    }
    )
    return ships;
  }

  getRandomCoordinates() {
    const boardSize = this.state.boardSize;
    let x = Math.floor(Math.random() * boardSize);
    let y = Math.floor(Math.random() * boardSize);
    return [x, y]
  }

  getShipCoordinates = (coordinates, ship) => {
    const length = ship.length;
    const isHorizontal = this.getShipDirection();
    const locationStart = this.setShipLocationStart(coordinates, isHorizontal, length);
    return this.setShipCoordinates(locationStart, isHorizontal, ship);
  }

  getShipDirection() {
    return Math.random() >= 0.5;
  }

  setShipLocationStart(coordinates, isHorizontal, length) {
    const boardSize = this.state.boardSize;
    let x = coordinates[0];
    let y = coordinates[1];
    if (isHorizontal) {
      if (x + length >= boardSize) {
        x = Math.abs(x - length);
      }
    } else if (y + length >= boardSize) {
      y = Math.abs(y - length);
    }
    return [x, y];
  }

  setShipCoordinates(coordinates, isHorizontal, ship) {
    if (isHorizontal) {
      return ship.locations.map(location => ({
        ...location,
        x: coordinates[0]++,
        y: coordinates[1]
      }))
    } else {
      return ship.locations.map(location => ({
        ...location,
        x: coordinates[0],
        y: coordinates[1]++
      }))
    }
  }

  checkCurrentLocationsCollision(shipsCoordinates, locations) {
    let collide = false;

    const compareLocations = (location) => {
      const minScopeX = location.x > 0 ? location.x - 1 : location.x;
      const maxScopeX = location.x + 1;
      const minScopeY = location.y > 0 ? location.y - 1 : location.y;
      const maxScopeY = location.y + 1;

      shipsCoordinates.forEach((singleShipCoordinates) => {
        const checkScope = singleShipCoordinates.map(coordinate => (coordinate.x >= minScopeX && coordinate.x <= maxScopeX && coordinate.y >= minScopeY && coordinate.y <= maxScopeY)
        )
        if (checkScope.includes(true)) {
          collide = true;
        }
        return checkScope;
      }
      )
    }

    locations.forEach(compareLocations);
    return collide;
  }

  handleGuess = e => {
    let id = e.target.id;
    let message = "";

    if (this.state.gameOn) {
      if (e.target.classList.contains("hit") || e.target.classList.contains("miss")) {
        message = "Wybierz nowe współrzędne";
        id = 0;
      } else {
        let ships = this.state.ships.map(ship => ship);
        let locationFound = false;
        let sunkenShips = [...this.state.sunkenShips];

        for (const ship of ships) {
          let locations = ship.locations;

          for (const location of locations) {
            if (!locationFound) {
              const shipLocation = `x${location.x}y${location.y}`;

              if (shipLocation === id) {
                location.hit = true;
                message = "Trafiony!";

                if (this.isSunk(ship)) {
                  message = "Trafiony zatopiony!";
                  ship.isSunk = true;
                  sunkenShips.push(ship.length);

                  if (sunkenShips.length === ships.length) {
                    message = "Koniec gry";
                  }
                }

                locationFound = true;
                break;

              } else {
                message = "Pudło!"
              }
            }
          }
        }

        this.setState(() => ({
          ships,
          sunkenShips
        }))
      }

    }
    this.viewResult(message, id)
  }

  isSunk(ship) {
    let hits = 0;
    let locations = ship.locations;
    locations.forEach(location => {
      if (location.hit) hits++;
      else return hits;
    })
    if (ship.length === hits) return true;
  }

  viewResult(message, id) {

    if (id === 0) {
      this.setState({
        message
      })
    } else {
      let playerMoves = this.state.playerMoves;
      playerMoves++;

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


  createShips(boardSize) {
    const shipsLengths = boardSize === 6 ? config.shipsSizes.small : config.shipsSizes.large;

    const ships = shipsLengths.map((length, index) => {
      const locations = [];
      for (let i = 0; i < shipsLengths[index]; i++) {
        locations.push({
          x: null,
          y: null,
          hit: false
        })
      }

      return {
        name: `ship-${index + 1}`,
        length,
        locations,
        isSunk: false
      }
    })

    return ships;
  }


  componentDidMount() {
    const deviceWidth = window.innerWidth || config.deviceSize.medium;
    const deviceHeight = window.innerHeight || config.deviceSize.small;
    const boardSize = (deviceWidth < config.deviceSize.large && deviceHeight < config.deviceSize.large) ? config.boardSize.small : config.boardSize.large

    const ships = this.createShips(boardSize);

    this.setState({
      boardSize,
      ships
    })
  }

  render() {
    const {
      gameOn,
      boardSize,
      sunkenShips,
      playerMoves,
      message,
      ships
    } = this.state

    return (<>
      <React.StrictMode>
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
          />}
      </React.StrictMode>{
        gameOn && < GameBoard
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