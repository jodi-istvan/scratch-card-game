import {Graphics} from 'pixi.js';
import {GameConfig} from '../config';

export class CardGraphics extends Graphics {

  constructor(color: string) {
    super();

    this.roundRect(0, 0, GameConfig.cardWidth, GameConfig.cardHeight, GameConfig.cardRadius);
    this.fill(color);
  }
}
