type SpriteType = {new (...args: any[]): Sprite, clockwiseRotationSprite: (SpriteType | null)};
type MenuType = {new (...args: any[]): Menu};

type FillBrushType = {new (fillType: FillType): FillBrush};

type Hsl = {h: number, s: number, l: number};
type Hsla = {h: number, s: number, l: number, a: number};

