import { IPropertyPaneCustomFieldProps, BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IMarkdownProps } from 'markdown-to-jsx';


export interface IPropertyPaneMarkdownContentProps {
  /**
   * Property field label displayed on top
   */
  label?: string;

  /**
   * An UNIQUE key indicates the identity of this control
   */
  key: string;

  /**
   * The markdown text you wish to display
   */
  markdown: string;

  /**
   * Allows you to override the markdown behavior,
   * such as overriding CSS styles and elements for
   * markdown elements.
   */
  markdownProps?: IMarkdownProps;
}

export interface IPropertyPaneMarkdownContentPropsInternal extends IPropertyPaneMarkdownContentProps, IPropertyPaneCustomFieldProps {
}

