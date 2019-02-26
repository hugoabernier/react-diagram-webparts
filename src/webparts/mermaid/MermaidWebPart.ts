import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
} from '@microsoft/sp-webpart-base';

import * as strings from 'MermaidWebPartStrings';
import Mermaid from './components/Mermaid';
import { IMermaidProps } from './components/IMermaid.types';
import { PropertyFieldAceEditor, Annotation } from '@controls/PropertyFieldAceEditor';
import { PropertyPaneMarkdownContent } from '@controls/PropertyPaneMarkdownContent';
import { IMarkdownProps } from 'markdown-to-jsx';

import styles from './MermaidWebPart.module.scss';

// Import a Mode (language) for Ace
import 'brace/mode/asciidoc';

import mermaid from 'mermaid';


export interface IMermaidWebPartProps {
  mermaidText: string;
  title: string;
}

export default class MermaidWebPart extends BaseClientSideWebPart<IMermaidWebPartProps> {

  protected onInit(): Promise<void> {
    return new Promise<void>((resolve, _reject) => {

      if (this.properties.mermaidText === undefined) {
        this.properties.mermaidText = strings.SampleDefaultMermaid;
      }

      resolve(undefined);
    });
  }

  public render(): void {
    const element: React.ReactElement<IMermaidProps> = React.createElement(
      Mermaid,
      {
        mermaidText: this.properties.mermaidText,
        instanceId: this.instanceId,
        title: this.properties.title,
        displayMode: this.displayMode,
        onUpdateTitle: (value: string) => {
          // when title is changed, store the new title
          this.properties.title = value;
        }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const mdProps: IMarkdownProps = {
      forceBlock: true,
      overrides: {
        h2: {
          props: {
            className: styles.section,
          },
        },
        h3: {
          props: {
            className: styles.subtitle,
          },
        },
      },
    };

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldAceEditor('sequenceText', {
                  aceOptions: {
                    showLineNumbers: true,
                  },
                  editorHeight: "300px",
                  key: "mermaidText",
                  label: strings.DescriptionFieldLabel,
                  mode: "asciidoc", // the closest language to what I want
                  value: this.properties.mermaidText,
                  customMode: this._setCustomMode,
                  onValidate: (value: string) => this._handleValidation(value),
                  onPropertyChange: (_propertyPath: string, _oldValue: string, value: string) => this._handleSave(value),
                })
              ]
            },
            {
              groupName: strings.SyntaxHelpGroupName,
              groupFields: [
                PropertyPaneMarkdownContent({
                  markdown: strings.MermaidSyntaxHelp,
                  key: 'syntaxHelp',
                  markdownProps: mdProps
                }),
              ]
            }
          ]
        }
      ]
    };
  }

  private _handleValidation = (value: string): Annotation[] => {
    try {
      mermaid.parse(value);
    } catch (error) {
      const errorStr: string = error.str;
      const errorLines: string[] = errorStr.split(/\r?\n/);
      const textWithError: string = errorLines[1];
      const errorArrow: string = errorLines[2];
      const textAfterError: string = textWithError.substring(errorArrow.length);
      const expected: string = errorLines[3];
      const lines: string[] = value.split(/\r?\n/);
      let index: number = 0;
      let found: boolean = false;
      lines.forEach((valueLine:string)=>{
        if (valueLine.indexOf(textAfterError) > -1) {
          found = true;
        }

        index++;
      });

      if (found) {
        if (error.hash.token === "NL") {
          index--;
        }

        if (index < 0) {
          index = 0;
        }
      } else {
        index = 0;
      }

      let expectedMessage: string = "";
      error.hash.expected.forEach(expectedToken => {
        let expectedTokenString: string = expectedToken;
        switch (expectedToken) {
          case "'SD'":
            expectedTokenString = "'sequenceDiagram'";
            break;
          case "'SPACE'":
            expectedTokenString = strings.SyntaxSpace;
            break;
          case "'NL'":
            expectedTokenString = strings.SyntaxNewLine;
            break;
          case "'AS'":
            expectedTokenString = strings.SyntaxAsKeyword;
            break;
          case "','":
            expectedTokenString = "','";
            break;
          case "'SOLID_OPEN_ARROW'":
            expectedTokenString = "'->'";
            break;
          case "'DOTTED_OPEN_ARROW'":
            expectedTokenString = "'-->'";
            break;
          case "'SOLID_ARROW'":
            expectedTokenString = "'->>'";
            break;
          case "'DOTTED_ARROW'":
            expectedTokenString = "'-->>'";
            break;
          case "'SOLID_CROSS'":
            expectedTokenString = "'\\-[x]'";
            break;
          case "'DOTTED_CROSS'":
            expectedTokenString = "'\\-\\-[x]'";
            break;
          case "'TXT'":
            expectedTokenString = strings.SyntaxText;
            break;
          case "'left_of'":
            expectedTokenString = strings.SyntaxLeftOf;
            break;
          case "'right_of'":
            expectedTokenString = strings.SyntaxRightOf;
            break;
        }

        if (expectedMessage !== "") {
          expectedMessage = expectedMessage + ", ";
        }
        expectedMessage = expectedMessage + expectedTokenString;
      });

      const hashText: string = error.hash.text.replace(/\r?\n/, '');
      let errorMessage: string = strings.ErrorMessageWithExpected.replace('{0}', hashText).replace('{1}', expectedMessage); //"'${hashText}' is invalid.\nExpected ${expectedMessage}."
      if (hashText === undefined || hashText === "") {
        errorMessage = strings.ErrorMessageInvalidSyntax.replace('{0}', expectedMessage); //`Invalid syntax.\nExpected ${expectedMessage}.`
      }
      return [{
        column: 0,
        row: index,
        type: 'error',
        text: errorMessage
      }];
    }

    return undefined;
  }

  private _handleSave = (value: string) => {
    this.properties.mermaidText = value;
  }

   /**
   * This is a really half-assed way to set a custom syntax highlighter
   * for the code editor.
   *
   * It works.
   *
   * Barely.
   */
  private _setCustomMode = () => {
    var ace = require('brace') as any;
    ace.define('ace/mode/custom', [], (require, exports, module) => {
      var oop = require("ace/lib/oop");
      var TextMode = require("ace/mode/text").Mode;
      var Tokenizer = require("ace/tokenizer").Tokenizer;
      var CustomHighlightRules = require("ace/mode/custom_highlight_rules").CustomHighlightRules;

      var Mode = function () {
        this.HighlightRules = CustomHighlightRules;
      };
      oop.inherits(Mode, TextMode);

      (() => {

      }).call(Mode.prototype);

      exports.Mode = Mode;
    });

    ace.define('ace/mode/custom_highlight_rules', [], (require, exports, module) => {
      var oop = require("ace/lib/oop");
      var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

      var CustomHighlightRules = function () {

        var coreKeywords = `opt|alt|else|participant|loop|click|style|linkStyle|classDef|class|activate|deactivate|dateFormat|axisFormat`;

        var coreConstants = "true|false|yes|no|top|bottom|left|right|<br\\/>";

        var keywordMapper = this.createKeywordMapper({
          "keyword": coreKeywords,
          "constant.language": coreConstants
        }, "text", false);

        this.$rules = {
          "start": [
            {
              regex: "(Note\\s|note\\s)(left of|right of|over)(\\s[^:]+)(:)",
              token: ["keyword", "constant.language", "text", "keyword.operator"]
            },
            {
              regex: "(Participant\\s|participant\\s)(.+?(?=\\sas))(\\sas\\s)?",
              token: ["keyword", "text", "keyword"]
            },
            {
              regex:"^sequenceDiagram",
              token: "keyword"
            },
            {
              regex:"^[\\s]*gantt",
              token: "keyword"
            },
            {
              regex:"^[\\s]*section",
              token: "keyword"
            },
            {
              regex:"(^[\\s]*graph\\s*)(LR|TB|TD|RL|BT)",
              token: ["keyword", "constant.language"]
            },
            {
              regex: "(\\d+)(h|d|w)",
              token: ["text", "constant.language"]
            },
            {
              regex:"^[\\s]*title",
              token: "keyword"
            },
            {
              regex:"^[\\s]*subgraph",
              token: "keyword"
            },
            {
              regex:"^[\\s]*end",
              token: "keyword"
            },
            {
              regex: "\\w+\\b",
              token: keywordMapper
            },
            {
              token: "keyword.operator",
              regex: "->>|-->>|-->|==>|==|->|---|--|-\\.->|\\.->|-\\.|:|>"
            },
            {
              token: "keyword.operator",
              regex: "[|]"
            },
            {
              token: "keyword.operator",
              regex: "[+]"
            },
            {
              token: "keyword.operator",
              regex: "[-]"
            },
            {
              token: "paren.lparen",
              regex: "[(]"
            }, {
              token: "paren.rparen",
              regex: "[)]"
            },
            {
              token: "paren.lparen",
              regex: "[{]"
            }, {
              token: "paren.rparen",
              regex: "[}]"
            },
            {
              token: "paren.lparen",
              regex: "[\\[]"
            }, {
              token: "paren.rparen",
              regex: "[\\]]"
            },

          ],
        };
        this.normalizeRules();
      };

      oop.inherits(CustomHighlightRules, TextHighlightRules);

      exports.CustomHighlightRules = CustomHighlightRules;
    });
  }
}
