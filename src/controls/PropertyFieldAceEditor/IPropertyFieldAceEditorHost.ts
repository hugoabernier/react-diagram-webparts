import { IPropertyFieldAceEditorPropsInternal } from './IPropertyFieldAceEditor';
import { Annotation } from 'react-ace';


/**
* PropertyFieldNumberHost properties interface
*/
export interface IPropertyFieldAceEditorHostProps extends IPropertyFieldAceEditorPropsInternal  {
  onChange: (targetProperty?: string, newValue?: any) => void;
}

export interface IPropertyFieldAceEditorHostState {
  annotations: Annotation[];
  editorClassName?: string;
  editorHeight?: string;
  errorMessage?: string;
  value: string;
  fullScreen: boolean;
}
