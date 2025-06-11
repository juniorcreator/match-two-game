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
