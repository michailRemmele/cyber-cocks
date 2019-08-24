import Camera from './camera/camera';
import KeyboardControl from './keyboardControl/keyboardControl';
import ColliderContainer from './colliderContainer/colliderContainer';
import RigidBody from './rigidBody/rigidBody';
import Animatable from './animatable/animatable';
import Renderable from './renderable/renderable';
import Transform from './transform/transform';
import Movement from './movement/movement';
import MouseControl from './mouseControl/mouseControl';

export default {
  camera: Camera,
  keyboardControl: KeyboardControl,
  colliderContainer: ColliderContainer,
  rigidBody: RigidBody,
  animatable: Animatable,
  renderable: Renderable,
  transform: Transform,
  movement: Movement,
  mouseControl: MouseControl,
};
