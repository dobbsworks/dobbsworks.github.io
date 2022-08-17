type SpriteType = {new (...args: any[]): Sprite};
type MenuType = {new (...args: any[]): Menu};

type FillBrushType = {new (fillType: FillType): FillBrush};

type Hsl = {h: number, s: number, l: number};