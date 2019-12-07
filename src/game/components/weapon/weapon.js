import Component from 'engine/component/component';

class Weapon extends Component {
  constructor(config) {
    super();

    this._bullet = config.bullet;
    this._speed = config.speed;
    this._cooldown = config.cooldown;
    this._cooldownRemaining = 0;
  }

  set bullet(bullet) {
    this._bullet = bullet;
  }

  get bullet() {
    return this._bullet;
  }

  set speed(speed) {
    this._speed = speed;
  }

  get speed() {
    return this._speed;
  }

  set cooldown(cooldown) {
    this._cooldown = cooldown;
  }

  get cooldown() {
    return this._cooldown;
  }

  set cooldownRemaining(cooldownRemaining) {
    this._cooldownRemaining = cooldownRemaining;
  }

  get cooldownRemaining() {
    return this._cooldownRemaining;
  }

  clone() {
    return new Weapon({
      bullet: this.bullet,
      speed: this.speed,
      cooldown: this.cooldown,
    });
  }
}

export default Weapon;
