import React from 'react';
import ship2 from '../img/ship2.png';
import ship3 from '../img/ship3.png';
import ship4 from '../img/ship4.png';
import ship5 from '../img/ship5.png';

const SunkenShips = props => {
  const shipsImg = [ship2, ship3, ship4, ship5]
  let sunken = []
  for (let sunkenShip of props.sunkenShips) {
    const sunkenSrc = shipsImg[(sunkenShip - 2)]
    sunken.push(<img key={sunken.length} src={sunkenSrc} alt="statek" />)
  }
  return (
    sunken
  )
}

export default SunkenShips;