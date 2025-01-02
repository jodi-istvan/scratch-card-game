import {Text, TextStyle} from 'pixi.js';
import {GameConfig} from '../config';

export class CardText extends Text {

  constructor(text: string) {
    super();

    this.anchor.set(0.5);
    this.x = GameConfig.cardWidth / 2;
    this.y = GameConfig.cardHeight / 2;
    this.text = text;
    this.style = this.generateTextStyle()
  }

  private generateTextStyle(): TextStyle {
    return new TextStyle({
      fontSize: 30,
      fill: "#fff",
      align: "center",
    });
  }
}
