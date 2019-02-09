export interface IParser {
  verifySyntax(value: string): IParserError[];
  parseTitle(value: string): string;
  parseBody(value: string): string;
}

export interface IParserError {
  row: number;
  column: number;
  error: string;
}
