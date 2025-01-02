import {Card} from './interfaces/card.interface';

// AbstractRenderer.defaultOptions.roundPixels = true;
// AbstractRenderer.defaultOptions.resolution = window.devicePixelRatio || 1;

export class GameConfig {

  public static readonly gameWidth = 500;
  public static readonly gameHeight = 600;
  public static readonly cardWidth = 175 * 0.7;
  public static readonly cardHeight = 250 * 0.7;
  public static readonly cardRadius = 16;
  public static readonly tableCardGap = 20;

  public static readonly tableRows = 3;
  public static readonly tableCols = 3;
  public static readonly deckSize = 50000;
}

export type GameBet = 0.1 | 0.25 | 0.5 | 1 | 2;
export const gameBetOptions: GameBet[] = [ 0.1, 0.25, 0.5, 1, 2 ];

export const cardVariations: Card[] = [
  { symbol: 9, weight: 1, multiplier: 10000 },
  { symbol: 8, weight: 4, multiplier: 2000 },
  { symbol: 7, weight: 10, multiplier: 400 },
  { symbol: 6, weight: 25, multiplier: 200 },
  { symbol: 5, weight: 50, multiplier: 50 },
  { symbol: 4, weight: 200, multiplier: 10 },
  { symbol: 3, weight: 400, multiplier: 5 },
  { symbol: 2, weight: 2000, multiplier: 2 },
  { symbol: 1, weight: 10000, multiplier: 1 },
  { symbol: 0, weight: 37310, multiplier: 0 }
];
