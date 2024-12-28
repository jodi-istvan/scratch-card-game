import {Container, ContainerChild, ContainerOptions} from 'pixi.js';
import {GameMeta} from '../game.meta';

export class Table extends Container {

  private readonly rows: number;
  private readonly cols: number;
  private readonly gap: number;

  constructor(rows: number, cols: number, gap: number) {
    super();
    this.rows = rows;
    this.cols = cols;
    this.gap = gap;

    this.centerTable();
  }

  private centerTable(): void {
    this.x = GameMeta.gameWidth / 2 - ((this.cols * GameMeta.cardWidth + (this.cols - 1) * this.gap) / 2);
    this.y = GameMeta.gameHeight / 2 - ((this.rows * GameMeta.cardHeight + (this.rows - 1) * this.gap) / 2);
  }
}
