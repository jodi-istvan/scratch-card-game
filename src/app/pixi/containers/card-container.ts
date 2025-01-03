import {Container, Graphics, Ticker} from 'pixi.js';
import {GameConfig} from '../config';
import {CardGraphics} from '../graphics/card-graphics';
import {CardText} from '../texts/card-text';
import {CardBackSprite} from '../sprites/card-back-sprite';

export class CardContainer extends Container {

  private readonly frontColor = '#614081';
  private readonly frontColorWinning = '#8155ab';
  private readonly backColor = '#8054ab';
  private readonly flipDuration = 300;
  private readonly _cardBack: Graphics;

  private cardFront: Graphics;
  private _isFlipping = false;
  private _isFlipped = false;
  private _flipEventCb: (() => void ) | undefined;

  public symbol: number;
  public prize: number;

  get isFlipped(): boolean {
    return this._isFlipped;
  }

  constructor(symbol: number = 0, prize: number = 0) {
    super();
    this.symbol = symbol;
    this.prize = prize;

    this.pivot.set(GameConfig.cardWidth / 2, GameConfig.cardHeight / 2);
    this.interactive = false;
    this.cursor = "pointer";

    this.cardFront = this.generateCardFront();
    this._cardBack = this.generateCardBack();

    this.addChild(this._cardBack);

    this._setOnPointerDownEvent();
  }

  public updateSymbol(): void {
    this.cardFront = this.generateCardFront();
  }

  public addWinningStyle(): void {
    this.cardFront
      .clear()
      .roundRect(0, 0, GameConfig.cardWidth, GameConfig.cardHeight, GameConfig.cardRadius)
      .fill(this.frontColorWinning)
  }

  public addFlipEventListener(cb: () => void): void {
    this._flipEventCb = cb;
  }

  public flip(): void {
    if (this._isFlipping) return;

    this._isFlipping = true;

    const ticker = new Ticker();
    let elapsed = 0;

    /**
     * As time elapses, it calculates a value which goes from 1 to 0 and then back to 1
     * using the absolute value of the cosine result. This is used to scale the width of
     * the card from 1 to 0, change the graphics and then scale back from 0 to 1, resulting
     * in a card flip animation.
     */
    ticker.add((deltaTime) => {
      elapsed += deltaTime.deltaMS;

      const progress = Math.min(elapsed / this.flipDuration, 1);
      this.scale.x = Math.abs(Math.cos(progress * Math.PI));

      if (progress >= 0.5 && !this._isFlipped) {
        this.removeChild(this._cardBack);
        this.addChild(this.cardFront);
        this._isFlipped = true;
      }

      if (progress === 1) {
        ticker.stop();
        ticker.destroy();
        this.removeAllListeners();
        this._isFlipping = false;
        if (this._flipEventCb) {
          this._flipEventCb();
        }
      }
    });

    ticker.start();
  }

  private generateCardFront(): Graphics {
    const cardGraphics = new CardGraphics(this.frontColor);
    const text = new CardText(`$${this.prize.toFixed(2)}`);

    cardGraphics.addChild(text);

    return cardGraphics;
  }

  private generateCardBack(): Graphics {
    const cardGraphics = new CardGraphics(this.backColor);
    const sprite = new CardBackSprite();

    cardGraphics.addChild(sprite);

    return cardGraphics;
  }

  private _setOnPointerDownEvent(): void {
    this.on("pointerdown", this.flip);
  }
}
