import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import CollisionDetectionProcessor
  from 'contrib/processors/collisionDetectionProcessor/collisionDetectionProcessor';

class CollisionDetectionProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new CollisionDetectionProcessor({
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default CollisionDetectionProcessorPlugin;
