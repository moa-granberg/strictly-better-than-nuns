import React from 'react';

import paths from './paths-svg/pathIndex';

import { ActionState } from '../../../../clientTypes';

import styles from './Paths.module.scss';

interface PathsProps {
  readonly actionState: ActionState;
  readonly possiblePaths: string[];
  readonly viewAllPaths: boolean;
  readonly e1Path: string;
  readonly e2Path: string;
}

const Paths = ({ actionState, possiblePaths, viewAllPaths, e1Path, e2Path }: PathsProps) => {
  const Enemy1PathComp = paths[getPathComponentName(e1Path)];
  const Enemy2PathComp = paths[getPathComponentName(e2Path)];

  const getContent = () => {
    if (actionState.key === 'select new path' || actionState.key === 'select initial paths') {
      return possiblePaths.map((pathName) => {
        const Comp = paths[getPathComponentName(pathName)];
        return <Comp className={styles.path} key={pathName} />;
      });
    }

    if (viewAllPaths) {
      return Object.values(paths).map((Path, index) => <Path className={styles.path} key={index} />);
    }

    if (getPathComponentName(e1Path) === getPathComponentName(e2Path)) {
      return <Enemy1PathComp className={styles.commonPath} />;
    }

    return (
      <>
        <Enemy1PathComp className={styles.enemy1Path} />
        <Enemy2PathComp className={styles.enemy2Path} />
      </>
    );
  };

  return <article className="enemy-paths-wrapper">{getContent()}</article>;
};

const getPathComponentName = (str: string) => {
  if (str) {
    return `${str.charAt(0).toUpperCase() + str.slice(1)}`.substring(0, str.length - 1);
  }
  return 'Empty';
};

export default Paths;
