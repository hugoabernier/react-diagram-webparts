import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration
} from '@microsoft/sp-webpart-base';

import * as strings from 'FlowWebPartStrings';
import Flow from './components/Flow';
import { IFlowProps } from './components/IFlow.types';

import { PropertyFieldAceEditor, Annotation } from '@controls/PropertyFieldAceEditor';

// Import a Mode (language) for Ace
import 'brace/mode/asciidoc';
import 'brace/mode/json';

// // Import a theme
// import 'brace/theme/github';

import { PropertyPaneMarkdownContent } from '@controls/PropertyPaneMarkdownContent';
import { IMarkdownProps } from 'markdown-to-jsx';

import styles from './FlowWebPart.module.scss';

import { IParser, IParserError } from '@src/parsers';
import { FlowParser } from './FlowParser';

export interface IFlowWebPartProps {
  flowText: string;
  title: string;
  configurationJson: string;
}

export default class FlowWebPart extends BaseClientSideWebPart<IFlowWebPartProps> {

  private _parser: IParser = undefined;

  protected onInit(): Promise<void> {
    return new Promise<void>((resolve, _reject) => {

      if (this.properties.flowText === undefined) {
        this.properties.flowText =
          strings.DefaultSampleFlow;
      }

      this._parser = new FlowParser();

      resolve(undefined);
    });
  }

  public render(): void {
    const element: React.ReactElement<IFlowProps> = React.createElement(
      Flow,
      {
        flowText: this.properties.flowText,
        title: this.properties.title,
        displayMode: this.displayMode,
        configurationJson: this.properties.configurationJson,
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
        blockquote: {
          props: {
            className: styles.note,
          },
        }
      },
    };

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldAceEditor('flowText', {
                  aceOptions: {
                    showLineNumbers: false,
                  },
                  customMode: this._setCustomMode,
                  editorHeight: "300px",
                  key: "flowText",
                  label: strings.DescriptionFieldLabel,
                  mode: "asciidoc", // the closest language to what I want
                  //theme: "github", // The easiest to format as Office 365,
                  value: this.properties.flowText,
                  onValidate: (value: string) => this._handleValidation(value),
                  onPropertyChange: (_propertyPath: string, _oldValue: string, value: string) => this._handleSave(value),
                }),
              ]
            },
            {
              groupName: strings.FlowChartHelpGroupName,
              groupFields: [
                PropertyPaneMarkdownContent({
                  label: strings.FlowChartHelpDescription,
                  markdown: strings.FlowChartHelpMarkdown,
                  key: 'syntaxHelp',
                  markdownProps: mdProps
                }),
              ]
            },
            {
              groupName: strings.AdvancedConfigurationGroupName,
              groupFields: [
                PropertyFieldAceEditor('configurationJson', {
                  aceOptions: {
                    showLineNumbers: false,
                  },
                  //customMode: this._setCustomMode,
                  editorHeight: "300px",
                  key: "configurationJson",
                  label: strings.ConfigurationJSONFieldName,
                  mode: "json", // the closest language to what I want
                  theme: "github", // The easiest to format as Office 365,
                  value: this.properties.configurationJson,
                  onValidate: (value: string) => this._handleValidateJson(value),
                  onPropertyChange: (_propertyPath: string, _oldValue: string, value: string) => this._handleSaveJson(value),
                })
              ]
            },
            {
              groupName: strings.ConfigurationSyntaxHelpGroup,
              groupFields: [
                PropertyPaneMarkdownContent({
                  label: strings.ConfigurationSyntaxFieldName,
                  markdown: strings.ConfigurationSyntaxHelp,
                  key: 'jsonHelp',
                  markdownProps: mdProps
                }),
              ]
            }
          ]
        }
      ]
    };
  }

  /**
   * Gets called when the flowchart text gets saved
   */
  private _handleSave = (value: string) => {
    this.properties.flowText = value;
  }

  /**
   * Gets called when the flowchart configuration gets saved
   */
  private _handleSaveJson = (value: string) => {
    this.properties.configurationJson = value;
  }

  /**
   * Validates the flowchart text
   */
  private _handleValidation = (value: string): Annotation[] => {
    const parserResults: IParserError[] = this._parser.verifySyntax(value);

    if (parserResults && parserResults.length > 0) {
      const annotations: Annotation[] = parserResults.map(result => {
        return {
          column: result.column,
          row: result.row,
          type: 'error',
          text: result.error
        };
      });
      return annotations;
    }

    return undefined;
  }

  /**
   * Validates the JSON schema
   */
  private _handleValidateJson = (value: string): Annotation[] => {
    let annotations: Annotation[] = [];

    let opts: {} = {};
    try {
      if (value !== undefined && value !== "") {
        JSON.parse(value);
      }
    } catch (e) {
      annotations.push({
        column: 0,
        row: 0,
        type: 'error',
        text: e.message
      });
    }
    return annotations;
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

        var coreKeywords = "start|end|operation|subroutine|condition|inputoutput|parallel";

        var coreConstants = "true|false|yes|no|top|bottom|left|right";

        var keywordMapper = this.createKeywordMapper({
          "keyword": coreKeywords,
          "constant.language": coreConstants
        }, "text", false);

        this.$rules = {
          "start": [
            {
              regex: "\\w+\\b",
              token: keywordMapper
            },
            {
              token: ["keyword.operator", "link", "constant.language"],
              regex: "(:>)(https?:\\/\\/[^\\s\\[]+)(\\[blank\\])"
            },
            {
              token: ["keyword.operator", "link"],
              regex: "(:>)(https?:\\/\\/[^\\s\\[]+)"
            },
            {
              token: "keyword.operator",
              regex: ":>|=>|->|@>|:|\\|"
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
