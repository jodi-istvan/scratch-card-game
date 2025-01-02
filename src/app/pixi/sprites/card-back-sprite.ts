import {Sprite, Texture} from 'pixi.js';
import {GameConfig} from '../config';

export class CardBackSprite extends Sprite {

  public static readonly cardBackImageUrl = 'card-back.png';

  constructor() {
    super(Texture.from(CardBackSprite.cardBackImageUrl));

    this.width = this.height = GameConfig.cardWidth;
    this.position.set(0, (GameConfig.cardHeight - this.height) / 2);
  }
}
