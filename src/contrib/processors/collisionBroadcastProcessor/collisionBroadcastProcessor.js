import Processor from 'engine/processor/processor';

import Collision from './collision';

const COLLISION_MESSAGE = 'COLLISION';

class CollisionBroadcastProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;

    this._collisionMap = {};
    this._activeCollisions = [];
  }

  _publishMessage(collision, messageBus) {
    const { gameObject, otherGameObject, mtv1, mtv2 } = collision;
    const message = {
      type: `${COLLISION_MESSAGE}_${collision.getState()}`,
      id: gameObject.getId(),
      gameObject,
      otherGameObject,
      mtv1,
      mtv2,
    };

    messageBus.send(message);
    messageBus.send(message, true);
  }

  _processRemovedGameObjects(messageBus) {
    this._gameObjectObserver.getLastRemoved().forEach((gameObject) => {
      const id = gameObject.getId();

      this._activeCollisions = this._activeCollisions.filter((collision) => {
        if (collision.gameObject.getId() !== id && collision.otherGameObject.getId() !== id) {
          return true;
        }

        if (collision.otherGameObject.getId() === id) {
          this._collisionMap[collision.gameObject.getId()][id] = null;
        }

        collision.tick();
        this._publishMessage(collision, messageBus);

        return false;
      });

      this._collisionMap[id] = null;
    });
  }

  process(options) {
    const { messageBus } = options;

    this._processRemovedGameObjects(messageBus);

    const collisionMessages = messageBus.get(COLLISION_MESSAGE) || [];
    collisionMessages.forEach((message) => {
      const { gameObject, otherGameObject, mtv1, mtv2 } = message;
      const gameObjectId = gameObject.getId();
      const otherGameObjectId = otherGameObject.getId();

      this._collisionMap[gameObjectId] = this._collisionMap[gameObjectId] || {};

      if (!this._collisionMap[gameObjectId][otherGameObjectId]) {
        const collision = new Collision(gameObject, otherGameObject, mtv1, mtv2);
        this._collisionMap[gameObjectId][otherGameObjectId] = collision;
        this._activeCollisions.push(collision);
      } else {
        this._collisionMap[gameObjectId][otherGameObjectId].mtv1 = mtv1;
        this._collisionMap[gameObjectId][otherGameObjectId].mtv2 = mtv2;
        this._collisionMap[gameObjectId][otherGameObjectId].signal();
      }
    });

    this._activeCollisions = this._activeCollisions.filter((collision) => {
      const { gameObject, otherGameObject } = collision;

      this._publishMessage(collision, messageBus);

      collision.tick();

      if (collision.isFinished()) {
        this._collisionMap[gameObject.getId()][otherGameObject.getId()] = null;
      }

      return !collision.isFinished();
    });
  }
}

export default CollisionBroadcastProcessor;
