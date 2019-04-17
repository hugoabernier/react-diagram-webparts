import { IPropertyPaneCustomFieldProps } from "@microsoft/sp-property-pane";
import { AceOptions } from 'react-ace';

export interface IPropertyFieldAceEditorProps {
  /**
   * Options specific to the ACE code editor component
   * See https://github.com/ajaxorg/ace/wiki/Configuring-Ace
   */
  aceOptions?: AceOptions;

  customMode?: ()=>void;

  /**
   * Custom Field will start to validate after users stop typing for `deferredValidationTime` milliseconds.
   * Default value is 200.
   */
  deferredValidationTime?: number;

  defaultValue?: string;

  /**
  * Specify if the control needs to be disabled
  */
  disabled?: boolean;

  /**
   * The CSS class name to apply to the code editor component
   */
  editorClassName?: string;

  /**
   * The height style to apply to the code editor component
   */
  editorHeight?: string;

   /**
   * If set, this will be displayed as an error message.
   *
   * When onGetErrorMessage returns empty string, if this property has a value set then this will
   * be displayed as the error message.
   *
   * So, make sure to set this only if you want to see an error message dispalyed for the text field.
   */
  errorMessage?: string;

  /**
   * The initial code to display in the code editor
   */
  initialValue?: string;

  /**
   * An UNIQUE key indicates the identity of this control
   */
  key: string;

  /**
   * Property field label displayed on top
   */
  label?: string;

  /**
   * The language you wish to use with the editor.
   * For available modes see https://github.com/thlorenz/brace/tree/master/mode.
   *
   * NOTE: Make sure to import the mode before calling this component
   * e.g.:
   * import 'brace/mode/json';
   * */
  mode: string;

  /**
   * The theme you wish to use.
   *
   * For available themes see https://github.com/thlorenz/brace/tree/master/theme
   *
   * NOTE: Make sure to import the theme before calling this component
   * e.g.:
   * import 'brace/theme/github';
   */
  theme?: string;

  /**
   * The code you wish to display in the code editor
   */
  value?: string;

  /**
   * Defines a onValidate function to raise when the code changes.
   * This function is called before onPropertyChange to allow
   * you to return custom validation errors.
   *
   * If the returned array is not empty, it will not call
   * onPropertyChange.
   *
   * If the returned array is empty, it will allow the changes
   * to be saved by calling onPropertyChange.
   */
  onValidate?: (value: string) => Annotation[];

  /**
   * Defines a onPropertyChange function to raise when the code changes.
   * Normally this function must be always defined with the 'this.onPropertyChange'
   * method of the web part object.
   */
  onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
}

export interface Annotation {
  row: number;
  column: number;
  type: string;
  text: string;
}

export interface IPropertyFieldAceEditorPropsInternal extends IPropertyPaneCustomFieldProps, IPropertyFieldAceEditorProps {
  targetProperty: string;
}
