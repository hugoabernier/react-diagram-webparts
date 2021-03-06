import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IWebPartPropertiesMetadata } from "@microsoft/sp-webpart-base";
import { IPropertyPaneConfiguration, PropertyPaneDropdown } from "@microsoft/sp-property-pane";

import * as strings from 'SequenceWebPartStrings';
import Sequence from './components/Sequence';
import { ISequenceProps } from './components/ISequence.types';
import { PropertyFieldAceEditor, Annotation } from '@controls/PropertyFieldAceEditor';

// Import a Mode (language) for Ace
import 'brace/mode/asciidoc';

import { IParser, IParserError } from '@src/parsers';
import { SequenceParser } from './SequenceParser';
import { PropertyPaneMarkdownContent } from '@controls/PropertyPaneMarkdownContent';

import { IMarkdownProps } from 'markdown-to-jsx';

import styles from './SequenceWebPart.module.scss';

export interface ISequenceWebPartProps {
  sequenceText: string;
  accessibleText: string;
  accessibleTitle: string;
  theme: string;
  title: string;
}

export default class SequenceWebPart extends BaseClientSideWebPart<ISequenceWebPartProps> {
  private _parser: IParser = undefined;

  protected onInit(): Promise<void> {
    return new Promise<void>((resolve, _reject) => {

      if (this.properties.theme === undefined) {
        this.properties.theme = 'simple';
      }

      if (this.properties.sequenceText === undefined) {
        this.properties.sequenceText = strings.DefaultSampleSequence;
        this.properties.accessibleTitle = strings.DefaultSampleTitle;
        this.properties.accessibleText = strings.DefaultSampleAccessibleText;
      }

      this._parser = new SequenceParser();

      resolve(undefined);
    });
  }

  public render(): void {
    const element: React.ReactElement<ISequenceProps> = React.createElement(
      Sequence,
      {
        sequenceText: this.properties.sequenceText,
        accessibleText: this.properties.accessibleText,
        accessibleTitle: this.properties.accessibleTitle,
        theme: this.properties.theme,
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
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.SequenceGroupName,
              groupFields: [
                PropertyFieldAceEditor('sequenceText', {
                  aceOptions: {
                    showLineNumbers: false,
                  },
                  customMode: this._setCustomMode,
                  editorHeight: "300px",
                  key: "sequenceText",
                  label: strings.DescriptionFieldLabel,
                  mode: "asciidoc", // the closest language to what I want
                  value: this.properties.sequenceText,
                  onValidate: (value: string) => this._handleValidation(value),
                  onPropertyChange: (_propertyPath: string, _oldValue: string, value: string) => this._handleSave(value),
                })
              ]
            },
            {
              groupName: strings.OptionsGroupName,
              groupFields: [
                PropertyPaneDropdown('theme', {
                  label: strings.ThemeFieldLabel,
                  options: [
                    {
                      key: "simple",
                      text: strings.ThemeOptionSimple
                    },
                    {
                      key: "hand",
                      text: strings.ThemeOptionHandDrawn,
                    }
                  ]
                })
              ]
            },
            {
              groupName: strings.SequenceHelpGroupName,
              groupFields: [
                PropertyPaneMarkdownContent({
                  label: strings.SequenceHelpDescription,
                  markdown: strings.SequenceHelpMarkdown,
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

  /**
   * This is how you indicate that the text stored in a property should be searchable.
   *
   * In this example, the sequence text is mostly plain English, so
   * we pass the text as is be indexed. That way, if someone searches for
   * text inside the sequence diagram, they'll find the page containing this
   * web part.
   *
   * We use a different property to store the plain text (instead of storing it in the
   * sequence text) because we want to store human-legible text that can also be used
   * for accessible descriptions.
   *
   * Other attributes you could use are:
   * isHtmlString: true  => to make it indexed as HTML
   * isImageSource: true => to recognize it as an image
   * isLink: true => to recognize it a link
   */
  protected get propertiesMetadata(): IWebPartPropertiesMetadata {
    return {
      'accessibleText': { isSearchablePlainText: true },
      'accessibleTitle': { isSearchablePlainText: true }
    };
  }

  private _handleSave = (value: string) => {
    this.properties.sequenceText = value;

    // Save the plaintext
    const plainText: string = this._parser.parseBody(value)
      .replace('->', strings.ArrowTo)
      .replace('->>', strings.OpenArrowTo)
      .replace('-->', strings.DashedArrowTo)
      .replace('-->>', strings.DashedOpenArrowTo);

      this.properties.accessibleText = plainText;

    const title: string = this._parser.parseTitle(value);

    this.properties.accessibleTitle = title;
  }

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

        var coreKeywords = "participant"; //"title|participant";

        var coreConstants = "left of|right of|over";

        var keywordMapper = this.createKeywordMapper({
          "keyword": coreKeywords,
          "constant.language": coreConstants
        }, "text", true);

        this.$rules = {
          "start": [
            {
              regex: "(title|Title)(:)",
              token: ["keyword", "keyword.operator"]
            },
            {
              regex: "(Note\\s|note\\s)(left of|right of|over)(\\s[^:]+)(:)",
              token: ["keyword", "constant.language", "text", "keyword.operator"]
            },
            {
              regex: "(Participant\\s|participant\\s)(.+?(?=\\sas))(\\sas\\s)?",
              token: ["keyword", "text", "keyword"]
            },
            {
              regex: "\\w+\\b",
              token: keywordMapper
            },
            {
              token: "keyword.operator",
              regex: "->>|-->>|->|-->|:"
            },


            // {
            //   regex: "(note\\s)(left of|right of|over)(\\s[^:]+)(:)",
            //   token: ["keyword", "constant", "text", "keyword.operator"]
            // },
            // {
            //   token: "keyword.operator",
            //   regex: "->|-->|->>|-->>|:"
            // }
          ],
        };
        this.normalizeRules();
      };

      oop.inherits(CustomHighlightRules, TextHighlightRules);

      exports.CustomHighlightRules = CustomHighlightRules;
    });

  }

}
