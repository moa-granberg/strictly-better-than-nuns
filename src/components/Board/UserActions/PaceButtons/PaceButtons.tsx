import React, { useState, useEffect } from 'react';
import { socket } from '../../../../App';
import { MyPlayer } from '../../../../clientTypes';
import { OnPlayerSelectsPace, OnEnemySelectsPace } from '../../../../shared/sharedTypes';

interface PaceButtonsProps {
  myPlayer: MyPlayer;
  playersTurn: boolean;
  caught: boolean;
}

const PaceButtons = ({ myPlayer, playersTurn, caught }: PaceButtonsProps) => {
  const [selectedPace, setSelectedPace] = useState('');
  const [enemyDisabled, setEnemyDisabled] = useState(true);
  const [playerDisabled, setPlayerDisabled] = useState(true);

  useEffect(() => {
    setEnemyDisabled(playersTurn);
    setPlayerDisabled(!playersTurn);
  }, [playersTurn]);

  useEffect(() => {
    if (!myPlayer.isEvil && caught && !selectedPace) {
      setSelectedPace('walk');
      setPlayerDisabled(true);

      const params: OnPlayerSelectsPace = { pace: 'walk' };
      socket.emit('player selects pace', params);
    }
  }, [caught, myPlayer, selectedPace]);

  const handleSelectsPace = (pace: string) => {
    if (myPlayer.isEvil) {
      const params: OnEnemySelectsPace = { pace };
      socket.emit('enemy selects pace', params);
    } else {
      const params: OnPlayerSelectsPace = { pace };
      socket.emit('player selects pace', params);
    }
    setSelectedPace(pace);
  };

  const Button = ({ disabled, text }: { disabled: boolean; text: string }) => {
    return (
      <button
        disabled={disabled}
        className={selectedPace && selectedPace !== text.toLowerCase() ? 'disabled' : ''}
        onClick={(e) => handleSelectsPace((e.target as HTMLElement).innerHTML.toLowerCase())}>
        {text}
      </button>
    );
  };

  if (myPlayer.isEvil) {
    return (
      <>
        <Button disabled={enemyDisabled} text="Walk" />
        <Button disabled={enemyDisabled} text="Run" />
      </>
    );
  }

  return (
    <>
      {caught && <p>you are caught, walk straight to home until no longer in view</p>}
      <Button disabled={playerDisabled} text="Stand" />
      <Button disabled={playerDisabled} text="Sneak" />
      <Button disabled={playerDisabled} text="Walk" />
      <Button disabled={playerDisabled} text="Run" />
    </>
  );
};

export default PaceButtons;