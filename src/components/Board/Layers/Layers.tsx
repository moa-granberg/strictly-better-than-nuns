import React, { useEffect, useState } from 'react';

import Paths from './Paths/Paths';
import Keys from './Keys/Keys';
import Goals from './Goals/Goals';

import { ActionState, MyPlayer } from '../../../clientTypes';
import ClientPlayer from '../../../modules/clientPlayer';

import styles from './Layers.module.scss';

interface ToggleProps {
  readonly myPlayer: MyPlayer;
  readonly actionState: ActionState;
  readonly possiblePaths: string[];
  readonly e1Path: string;
  readonly e2Path: string;
}

const Toggle = ({ myPlayer, actionState, possiblePaths, e1Path, e2Path }: ToggleProps) => {
  const [viewAllKeys, setViewAllKeys] = useState<boolean>(myPlayer.isEvil);
  const [viewAllGoals, setViewAllGoals] = useState<boolean>(myPlayer.isEvil);
  const [viewAllPaths, setViewAllPaths] = useState<boolean>(false);

  const [unlocked, setUnlocked] = useState<boolean>(myPlayer.isEvil);

  useEffect(() => {
    if ((myPlayer as ClientPlayer).hasKey) {
      setUnlocked(true);
    }
  }, [myPlayer]);

  return (
    <>
      <Paths
        actionState={actionState}
        possiblePaths={possiblePaths}
        viewAllPaths={viewAllPaths}
        e1Path={e1Path}
        e2Path={e2Path}
      />

      <article className={styles.locks}>
        <img
          src={require(`../../../assets/${unlocked ? 'Unlocked' : 'Locked'}.svg`)}
          alt="lock"
          className={styles.locksImg}
        />
      </article>

      <Keys myPlayer={myPlayer} viewAll={viewAllKeys} />

      <Goals myPlayer={myPlayer} viewAll={viewAllGoals} />

      <article className={styles.toggleWrapper}>
        <div className={styles.itemWrapper} onClick={() => setViewAllKeys(!viewAllKeys)}>
          <img src={require(`../../../assets/${viewAllKeys ? 'inactive-' : ''}key.svg`)} alt="key toggle" />
          <p>{viewAllKeys ? 'Hide all keys' : 'Show all keys'}</p>
        </div>
        <div className={styles.itemWrapper} onClick={() => setViewAllGoals(!viewAllGoals)}>
          <img src={require(`../../../assets/${viewAllGoals ? 'inactive-' : ''}goal.svg`)} alt="goal toggle" />
          <p>{viewAllGoals ? 'Hide all goals' : 'Show all goals'}</p>
        </div>
        <div className={styles.itemWrapper} onClick={() => setViewAllPaths(!viewAllPaths)}>
          <img src={require(`../../../assets/${viewAllPaths ? 'inactive-' : ''}path-toggle.svg`)} alt="path toggle" />
          <p>{viewAllPaths ? 'Hide all paths' : 'Show all paths'}</p>
        </div>
      </article>
    </>
  );
};

export default Toggle;
