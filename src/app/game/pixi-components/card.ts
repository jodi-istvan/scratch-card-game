import {Assets, Container, Graphics, Sprite, Text, TextStyle, Ticker} from 'pixi.js';

export class Card extends Container {

  private readonly _cardWidth;
  private readonly _cardHeight;
  private readonly _frontColor = '#614081';
  private readonly _frontColorWinning = '#8155ab';
  private readonly _backColor = '#8054ab';
  private readonly _flipDuration = 300;
  private readonly _cardBackImageUrl = 'card-back.png';

  private readonly _cardFront: Graphics;
  private readonly _cardBack: Graphics;

  private _isFlipping = false;
  private _isFlipped = false;
  private _flipEventCb: (() => void ) | undefined;

  public symbol: number;
  public prize: number;

  get isFlipped(): boolean {
    return this._isFlipped;
  }

  constructor(symbol: number, prize: number, width: number, height: number) {
    super();
    this.symbol = symbol;
    this.prize = prize;
    this._cardWidth = width;
    this._cardHeight = height;

    this.pivot.set(this._cardWidth / 2, this._cardHeight / 2);
    this.interactive = false;
    this.cursor = "pointer";

    this._cardFront = this._generateCardFront();
    this._cardBack = this._generateCardBack();

    this.addChild(this._cardFront);
    this.addChild(this._cardBack);

    this._setOnPointerDownEvent();
  }

  public addWinningStyle(): void {
    this._cardFront
      .clear()
      .roundRect(0, 0, this._cardWidth, this._cardHeight, 16)
      .fill(this._frontColorWinning)
  }

  public addFlipEventListener(cb: () => void): void {
    this._flipEventCb = cb;
  }

  public flip(): void {
    if (this._isFlipping) return;

    this._isFlipping = true;

    const ticker = new Ticker();
    let elapsed = 0;

    ticker.add((deltaTime) => {
      elapsed += deltaTime.deltaMS;

      const progress = Math.min(elapsed / this._flipDuration, 1);
      this.scale.x = Math.abs(Math.cos(progress * Math.PI));

      if (progress >= 0.5 && !this._isFlipped) {
        this.removeChild(this._cardBack);
        this.addChild(this._cardFront);
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

  private _generateCardFront(): Graphics {
    const textStyle = this._generateTextStyle()
    const symbolText = new Text({ text: `$${this.prize.toFixed(2)}`, style: textStyle });

    symbolText.anchor.set(0.5);
    symbolText.x = this._cardWidth / 2;
    symbolText.y = this._cardHeight / 2;

    const card = new Graphics()
      .roundRect(0, 0, this._cardWidth, this._cardHeight, 16)
      .fill(this._frontColor);
    card.addChild(symbolText);

    return card;
  }

  private _generateCardBack(): Graphics {
    const card = new Graphics()
      .roundRect(0, 0, this._cardWidth, this._cardHeight, 16)
      .fill(this._backColor);

    Assets.load(this._cardBackImageUrl).then(() => {
      const cardBackSprite = Sprite.from(this._cardBackImageUrl);

      cardBackSprite.width = cardBackSprite.height = this._cardWidth;
      cardBackSprite.position.set(0, (this._cardHeight - this._cardWidth) / 2);
      card.addChild(cardBackSprite);
    });

    return card;
  }

  private _generateTextStyle(): TextStyle {
    return new TextStyle({
      fontSize: 30,
      fill: "#fff",
      align: "center",
    });
  }

  private _setOnPointerDownEvent(): void {
    this.on("pointerdown", () => this.flip());
  }
}
