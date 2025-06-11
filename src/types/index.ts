export type Item = {
  value: string;
  active: boolean;
  clickable: boolean;
  bgColor: string;
  content: string;
};
export type Levels = {
  tries: number;
  boardLevel: number;
  isFinished: boolean;
  cls: string;
  hintCount: number;
};

export type GameItem = {
  active: boolean;
  clickable: boolean;
  bgColor: string;
  content: string;
  value: string;
};

export type GameBoardProps = {
  items: GameItem[];
  onItemClick: (index: number) => void;
  contentType: string;
  levelClass: string;
};
