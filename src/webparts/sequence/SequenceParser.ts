

import { IParser, IParserError } from "../../parsers/IParser";

import * as strings from 'SequenceWebPartStrings';
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
export class SequenceParser implements IParser {

  public verifySyntax(value: string): IParserError[] {

    const parserErrors: IParserError[] = [];

    const lines: string[] = this._getLines(value);

    lines.forEach((line: string, index: number) => {
      const result: IParserError = this._parseLine(line, index);
      if (result) {
        parserErrors.push(result);
      }
    });
    return parserErrors;
  }

  public parseTitle(value: string): string {
    const lines: string[] = this._getLines(value);

    let title: string = undefined;
    lines.filter(line => /^\s*title:[^\r\n]+/gi.test(line)).forEach((line: string) => {
      // Remove the colon
      const titleParts: string[] = line.split(':', 2);
      if (titleParts.length > 0) {
        title = titleParts[1];
      } else {
        title = line;
      }
    });
    return title;
  }

  public parseBody(value: string): string {
    const lines: string[] = this._getLines(value);
    let body: string = value;

    lines.filter(line => /^\s*title:[^\r\n]+/gi.test(line)).forEach((line: string) => {
      body = value.replace(line, "");
    });
    return body;
  }

  private _getLines = (value: string): string[] => {
    const lines: string[] = value.split(/\r?\n/);
    return lines;
  }

  private _parseLine = (lineValue: string, index: number): IParserError => {
    // Skip comments
    if (/\#[^\r\n]*/.test(lineValue)) {
      // We ignore comments
      return undefined;
    } else if (/^\s*title:[^\r\n]+/gi.test(lineValue)) {
      // Title is good
      return undefined;
    } else if (/^\s*Participant/gi.test(lineValue)) {
      //this is a participant
      return this._parseParticipant(lineValue, index);
    } else if (/^\s*Note[^\r\n]*/gi.test(lineValue)) {
      // This is a note
      return this._parseNote(lineValue, index);
    } else if (/^\s*[^-](?:->|-->|->>|-->>)[^>](.*):\s*[^\r\n]+/gim.test(lineValue)) {
      // This is a valid arrow
      return undefined;
    } else if (/^\s*(.*)\s*(?:---|>>>)\s*(.*)\s*:[^\r\n]+/gi.test(lineValue)) {
      // Invalid arrow type
      return {
        row: index,
        column: 0,
        error: strings.SequenceParsingErrorInvalidArrow
      };
    } else if (lineValue.indexOf('->') !== -1 && lineValue.indexOf(':') !== -1) {
      // There is an arrow with a colon, I just can't figure out the RegEx
      return  undefined;
    } else if (lineValue.indexOf('->') !== -1 && lineValue.indexOf(':') === -1) {
      // Missing a colon
      return {
        row: index,
        column: 0,
        error: strings.SequenceParsingErrorMissingColon
      };
    }

    return {
      row: index,
      column: 0,
      error: strings.SequenceParsingErrorInvalidSyntax
    };

  }

  private _parseParticipant = (lineValue: string, index: number): IParserError => {

    // Participant A
    // Participant A as Allan
    // but not Participant A :
    if (!/^Participant\s\w(?:\s+as\s+\w+)?[^\r\n]*/gi.test(lineValue)) {
      return {
        row: index,
        column: 0,
        error: strings.SequenceParsingErrorInvalidParticipant
      };
    }

    if (lineValue.indexOf(':') > -1) {
      return {
        row: index,
        column: 0,
        error: strings.SequenceParsingErrorInvalidCharParticipant
      };
    }

    return undefined;
  }

  private _parseNote = (lineValue: string, index: number): IParserError => {
    // Verify placement
    if (!/^\s*Note\s(?:(?:left of)|(?:right of)|(?:over))[^\r\n]*/gi.test(lineValue)) {
      return {
        row: index,
        column: 0,
        error: strings.SequenceParsingErrorInvalidPlacement
      };
    }

    // Make sure there is a destination
    if (lineValue.indexOf(':') < 0) {
      return {
        row: index,
        column: 0,
        error: strings.SequenceParsingErrorMissingColon
      };
    }


    // verify actor
    if (/^\s*Note\s(?:(?:left of)|(?:right of)|(?:over))\s+(?:\w\s*,\s*)*(?:\w+)\s*:[^\r\n]*/gi.test(lineValue)) {
      return undefined;
    }

    // No need to verify message
    return {
      row: index,
      column: 0,
      error: strings.SequenceParsingErrorExpectingActor
    };
  }
}
