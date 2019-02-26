

import { IParser, IParserError } from "../../parsers/IParser";

import * as strings from 'FlowWebPartStrings';

/**
 * I got tired to trying to get Jison to work with Typescript so I wrote a
 * quick parser to verify the Sequence diagrams syntax.
 *
 * I have always hated regular expressions (because I never quite understood them)
 * so I figured this was the opportunity to learn. And learn I did!
 *
 * If anyone has a better way to do this, or knows how to get Jison parson in a React/Typescript project,
 * please let me know.
 */
export class FlowParser implements IParser {

  private _start: any;
  private _hasStart: boolean;
  private _symbols: any;

  public verifySyntax(value: string): IParserError[] {
    const parserErrors: IParserError[] = [];
    this._start = undefined;
    this._symbols = [];
    this._hasStart = false;

    const lines: string[] = this._getLines(value);

    lines.forEach((line: string, index: number) => {
      const result: IParserError = this._parseLine(line, index);
      if (result) {
        parserErrors.push(result);
      }
    });

    return parserErrors;
  }

  public parseTitle(_value: string): string {
    return undefined;
  }

  public parseBody(value: string): string {
    const lines: string[] = this._getLines(value);
    let body: string = value;

    // Parse to extract text
    lines.forEach((line: string, index: number) => {
      const result: IParserError = this._parseLine(line, index);
      if (line.indexOf('=>') >= 0) {
        this._parseDefinition(line, index);
      }
    });

    this._symbols.forEach(symbol => {
      body = body + `\r\n${symbol.text}`;
    });

    return body;
  }

  private _getLines = (value: string): string[] => {
    const lines: string[] = value.split(/\r?\n/);
    return lines;
  }

  private _parseLine = (line: string, index: number): IParserError => {
    if (line.indexOf('=>') >= 0) {
      try {
        return this._parseDefinition(line, index);
      } catch (error) {
        console.log("Error parsing definition", error);
      }

    } else if (line.indexOf('->') >= 0) {
      try {
        return this._parseFlow(line, index);
      } catch (error) {
        console.log("Error parsing flow", error);
      }

    } else if (line.indexOf('@>') >= 0) {
      try {
        return this._parseLineStyle(line, index);
      } catch (error) {
        console.log("Error parsing line style", error);
      }
    }

    return undefined;
  }

  private _parseDefinition = (line: string, index: number): IParserError => {
    // definition
    const parts = line.split('=>');
    const symbolType: string = parts[1].split(':')[0];
    const symbol = {
      key: parts[0].replace(/\(.*\)/, ''),
      symbolType: symbolType,
      text: null,
      link: null,
      target: null,
      flowstate: null,
      lineStyle: {},
      params: {}
    };

    switch (symbolType) {
      case 'start':
      case 'end':
      case 'operation':
      case 'inputoutput':
      case 'subroutine':
      case 'condition':
      case 'parallel':
        // we're good
        break;

      default:
        return {
          row: index,
          column: 0,
          error: "Wrong symbol type. Expecting 'start', 'end', 'operation', 'inputoutput', 'subroutine', 'condition', or 'parallel'"
        };
    }

    try {
      //parse parameters
      const params = parts[0].match(/\((.*)\)/);
      if (params && params.length > 1) {
        const entries = params[1].split(',');
        for (var i = 0; i < entries.length; i++) {
          const entry = entries[0].split('=');
          if (entry.length == 2) {
            symbol.params[entry[0]] = entry[1];
          }
        }
      }
    } catch (error) {
      console.log("Error parsing parameters", error);
    }

    let sub;

    try {
      if (parts[1].indexOf(':') >= 0) {
        sub = parts[1].split(':');
        symbol.text = sub[1].trim();
        if (symbol.text === undefined || symbol.text === "") {
          return {
            row: index,
            column: 0,
            error: "Label cannot be blank"
          };
        }
      }
    } catch (error) {
      console.log("Error parsing labels", error);
    }

    try {
      if (symbol.text && symbol.text.indexOf(':>') >= 0) {
        sub = symbol.text.split(':>');
        symbol.text = sub.shift();
        symbol.link = sub.join(':>');
      } else if (parts[1].indexOf(':>') >= 0) {
        sub = parts[1].split(':>');
        //symbol.symbolType = sub.shift();
        symbol.link = sub.join(':>');
      }
    } catch (error) {
      console.log("Error parsing links", error);
    }


    try {
      /* adding support for links */
      if (symbol.link) {
        const startIndex = symbol.link.indexOf('[') + 1;
        const endIndex = symbol.link.indexOf(']');
        if (startIndex >= 0 && endIndex >= 0) {
          symbol.target = symbol.link.substring(startIndex, endIndex);
          symbol.link = symbol.link.substring(0, startIndex - 1);
        }
      }
    } catch (error) {
      console.log("Error adding link support", error);
    }

    /* end of link support */

    /* adding support for flowstates */
    try {
      if (symbol.text) {
        if (symbol.text.indexOf('|') >= 0) {
          const txtAndState = symbol.text.split('|');
          symbol.flowstate = txtAndState.pop().trim();
          symbol.text = txtAndState.join('|');
        }
      }
      /* end of flowstate support */
      if (this._symbols[symbol.key] === undefined) {
        // Symbol doesn't exist
        this._symbols[symbol.key] = symbol;

        if (symbol.symbolType === 'start') {
          if  (!this._hasStart) {
            this._hasStart = true;
          } else {
            return {
              row: index,
              column: 0,
              error: "Only one 'start' symbol allowed."
            };
          }
        }

      } else {
        // Symbol already exists
        return {
          row: index,
          column: 0,
          error: `Duplicate symbol '${symbol.key}'`
        };
      }
    } catch (error) {
      console.log("Error parsing flowstates", error);
    }

    return undefined;
  }

  private _parseFlow = (line: string, index: number): IParserError => {
    // flow
    const flowSymbols = line.split('->');
    for (let i = 0, lenS = flowSymbols.length; i < lenS; i++) {
      let flowSymb = flowSymbols[i];
      const symb = this._getSymbol(flowSymb);
      if (symb === undefined) {
        const key:string = this._getSymbolKey(flowSymb);
        const col: number = line.indexOf(key);
        return {
          row: index,
          column: col,
          error: `Symbol '${key}' does not exist`
        };
      }
      const symbVal = this._getSymbValue(flowSymb);



      if (symbVal === 'true' || symbVal === 'false') {
        // map true or false to yes or no respectively
        flowSymb = flowSymb.replace('true', 'yes');
        flowSymb = flowSymb.replace('false', 'no');
      }

      const realSymb = this._getSymbol(flowSymb);

      let next = this._getNextPath(flowSymb);
      if (next === undefined) {
        const key:string = this._getSymbolKey(flowSymb);
        const col: number = line.indexOf(key);
        return {
          row: index,
          column: col,
          error: `Symbol '${key}' does not exist`
        };
      }

      var direction = undefined;
      if (next.indexOf(',') >= 0) {
        var condOpt = next.split(',');
        next = condOpt[0];
        direction = condOpt[1].trim();
      }

      if (direction !== undefined && (direction !== 'left' && direction !== 'right' && direction !== 'top' && direction !== 'bottom' )) {
        return {
          row: index,
          column: 0,
          error: "Invalid direction. Expecting 'top', 'bottom', 'left', or 'right'"
        };
      }

      if (!this._start) {
        this._start = realSymb;
      }

      if (i + 1 < lenS) {
        var nextSymb = flowSymbols[i + 1];
        const getSymbol = this._getSymbol(nextSymb);
        realSymb[next] = getSymbol;
        realSymb['direction_' + next] = direction;
        direction = null;
      }
    }

    return undefined;
  }

  private _parseLineStyle = (line: string, index: number): IParserError => {
    // line style

    var lineStyleSymbols = line.split('@>');

    for (var i = 0, lenS = lineStyleSymbols.length; i < lenS; i++) {
      if ((i + 1) != lenS) {
        var curSymb = this._getSymbol(lineStyleSymbols[i]);
        var nextSymb = this._getSymbol(lineStyleSymbols[i + 1]);

        curSymb['lineStyle'][nextSymb.key] = JSON.parse(this._getStyle(lineStyleSymbols[i + 1]));
      }
    }

    return undefined;
  }

  private _getStyle(s) {

    const startIndex = s.indexOf('(') + 1;
    const endIndex = s.indexOf(')');

    if (startIndex >= 0 && endIndex >= 0) {
      return s.substring(startIndex, endIndex);
    }

    return '{}';
  }

  private _getSymbValue(s) {
    const startIndex = s.indexOf('(') + 1;
    const endIndex = s.indexOf(')');

    if (startIndex >= 0 && endIndex >= 0) {
      return s.substring(startIndex, endIndex);
    }

    return '';
  }

  private _getSymbol(s) {
    const key: string = this._getSymbolKey(s);
    return this._symbols[key];
  }

  private _getSymbolKey(symbol: string) {
    const keyParts: string[] = symbol.split("(");
    const key: string = keyParts[0];
    return key;
  }

  private _getNextPath(flowSymb) {
    let next = 'next';
    const startIndex = flowSymb.indexOf('(') + 1;
    const endIndex = flowSymb.indexOf(')');

    if (startIndex >= 0 && endIndex >= 0) {
      next = flowSymb.substring(startIndex, endIndex);

      if (next.indexOf(',') < 0) {
        if (next !== 'yes' && next !== 'no') {
          next = 'next, ' + next;
        }
      }
    }

    return next;
  }
}
