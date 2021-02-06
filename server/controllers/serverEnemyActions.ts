import { io } from '../index';

import {
  updateBoard,
  startNextTurn,
  logProgress,
  logSound,
  getSeenBy,
  updateBoardSocket,
  selectInitialPaths,
} from './sharedFunctions';
import {
  getReachable,
  getEnemyStandardReachable,
  getClosestWayToPath,
  getRandomSound,
  isHeard,
  getSoundReach,
} from '../modules/boardUtils';

import { ExtendedSocket } from '../serverTypes';
import {
  Position,
  OnPlayerSelectToken,
  OnChooseNewPath,
  OnPossibleSteps,
  OnEnemyTakesStep,
  OnSelectEnemy,
  OnEnemySelectsPace,
  OnSelectPath,
  OnPlayerPlacedToken,
  OnSetInitialPath,
} from '../../src/shared/sharedTypes';
import Enemy from '../modules/serverEnemy';

io.on('connection', (socket: ExtendedSocket) => {
  let currentEnemy: Enemy;

  socket.on('select enemy', ({ enemyID }: OnSelectEnemy) => {
    currentEnemy = socket.game.enemies[enemyID];
  });

  socket.on('enemy selects pace', ({ pace }: OnEnemySelectsPace) => {
    currentEnemy.pace = pace;
    currentEnemy.stepsLeft = pace === 'walk' ? 4 : 6;
    enemyStepOptions();
  });

  const enemyStepOptions = () => {
    let possibleSteps: Position[] = [];
    if (
      socket.game.seenSomeone(currentEnemy.id) ||
      socket.game.heardSomeone(currentEnemy.id) ||
      currentEnemy.playersVisible.length
    ) {
      const enemiesPositionsIDn = [socket.game.enemies.e1.position.id, socket.game.enemies.e2.position.id]
      possibleSteps = getReachable(currentEnemy.position, currentEnemy.stepsLeft, true, true, enemiesPositionsIDn);
    } else if (currentEnemy.isOnPath()) {
      possibleSteps = getEnemyStandardReachable(currentEnemy.position, currentEnemy.path, currentEnemy.stepsLeft);
    } else {
      possibleSteps = getClosestWayToPath(currentEnemy.position, currentEnemy.path, currentEnemy.stepsLeft);
    }
    const params: OnPossibleSteps = { possibleSteps, stepsLeft: currentEnemy.stepsLeft };
    socket.emit('possible steps', params);
  };

  socket.on('enemy takes step', ({ position }: OnEnemyTakesStep) => {
    if (
      (currentEnemy.pace === 'walk' && currentEnemy.stepsLeft === 4) ||
      (currentEnemy.pace === 'run' && currentEnemy.stepsLeft === 6)
    ) {
      const msg = [
        { text: currentEnemy.id === 'e1' ? 'Enemy 1' : 'Enemy 2', id: currentEnemy.id },
        { text: ` is ${currentEnemy.pace === 'run' ? 'running' : 'walking'}` },
      ];
      logProgress(msg, { room: socket.game.id });
    }

    const serverPosition = socket.game.getServerPosition(position.id);
    currentEnemy.move(serverPosition);
    socket.game.checkEnemyTarget(currentEnemy);

    for (let player of socket.game.players) {
      const seenBy = getSeenBy(player, socket.game);
      if (seenBy.length) {
        player.visible = true;
        player.updatePathVisibility(player.position, seenBy);

        if (seenBy.length === 2) {
          const msg = [{ text: player.username, id: player.id }, { text: ' is seen by both enemies' }];
          logProgress(msg, { room: socket.game.id });
        } else if (seenBy[0] === currentEnemy.id) {
          const msg = [
            {
              text: player.username,
              id: player.id,
            },
            { text: ' is seen by' },
            {
              text: seenBy[0] === 'e1' ? ' Enemy 1' : ' Enemy 2',
              id: seenBy[0],
            },
          ];
          logProgress(msg, { room: socket.game.id });
        }
      }
    }
    if (currentEnemy.endOfPath()) {
      updateBoard(socket.game);
      chooseNewPath(currentEnemy.getNewPossiblePaths());
    } else {
      actOnEnemyStep();
    }
  });

  const actOnEnemyStep = () => {
    updateBoard(socket.game);
    enemyStepOptions();
  };

  const chooseNewPath = (pathNames: string[]) => {
    const params: OnChooseNewPath = { pathNames };
    socket.emit('choose new path', params);
  };

  socket.on('set initial path', ({ pathName }: OnSetInitialPath) => {
    if (!socket.game.enemies.e1.pathName) {
      socket.game.enemies.e1.setNewPath(pathName);
      updateBoard(socket.game);
      selectInitialPaths(socket.game);
    } else {
      socket.game.enemies.e2.setNewPath(pathName);
      updateBoard(socket.game);
      startNextTurn(socket.game);
    }
  });

  socket.on('select path', ({ pathName }: OnSelectPath) => {
    currentEnemy.setNewPath(pathName);
    actOnEnemyStep();
  });

  socket.on('enemy move completed', () => {
    socket.game.enemyMovesCompleted++;
    if (socket.game.enemyMovesCompleted === 2) {
      socket.game.enemyMovesCompleted = 0;
      enemyMoveComplete();
    } else {
      updateBoardSocket(socket);
      socket.emit('next enemy turn');
    }
  });

  const enemyMoveComplete = () => {
    socket.game.soundTokens = [];
    socket.game.sightTokens = [];
    socket.game.enemies.e1.playersVisible = [];
    socket.game.enemies.e2.playersVisible = [];

    enemyListen(socket.game.enemies.e1);
  };

  const enemyListen = (enemy: Enemy) => {
    if (enemy.pace === 'run') {
      waitForTokenPlacement(true);
      return;
    }

    const sound = getRandomSound();
    for (let player of socket.game.players) {
      if (!socket.game.isCaught(player.id) && !player.visible) {
        const playerSound = getSoundReach(player.pace, sound);
        const heardTo = isHeard(player.position, socket.game.enemies, playerSound, enemy.id);
        if (heardTo) {
          if (heardTo.length > 1) {
            const params: OnPlayerSelectToken = {
              heardTo,
              id: player.id,
              turn: 'enemy',
              enemyID: enemy.id,
              sound,
            };
            io.in(socket.game.id).emit('player select token', params);
          } else {
            socket.game.addToken(heardTo[0].id, 'sound', enemy.id);
            socket.game.newSoundLog.push(enemy.id);
            waitForTokenPlacement();
          }
        } else {
          waitForTokenPlacement();
        }
      } else {
        waitForTokenPlacement();
      }
    }
  };

  socket.on('player placed token', ({ position, turn, enemyID }: OnPlayerPlacedToken) => {
    if (turn === 'enemy') {
      socket.game.addToken(position.id, 'sound', enemyID);
      socket.game.newSoundLog.push(enemyID);
      waitForTokenPlacement();
    }
  });

  const waitForTokenPlacement = (run?: boolean) => {
    socket.game.placedSoundCounter++;
    if (socket.game.placedSoundCounter === socket.game.players.length || run) {
      socket.game.placedSoundCounter = 0;
      endEnemyTurn();
    }
  };

  const endEnemyTurn = () => {
    socket.game.enemyListened++;
    if (socket.game.enemyListened == 1) {
      enemyListen(socket.game.enemies.e2);
    } else if (socket.game.enemyListened == 2) {
      logSound(socket.game);

      socket.game.enemyListened = 0;
      updateBoard(socket.game);
      startNextTurn(socket.game);
    }
  };
});
