import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  IPropertyPaneField,
  PropertyPaneFieldType,
} from '@microsoft/sp-webpart-base';

import PropertyFieldAceEditorHost from './PropertyFieldAceEditorHost';

import { IPropertyFieldAceEditorPropsInternal, IPropertyFieldAceEditorProps } from './IPropertyFieldAceEditor';

import { Annotation } from 'react-ace';


class PropertyFieldAceEditorBuilder implements IPropertyPaneField<IPropertyFieldAceEditorPropsInternal> {
  public targetProperty: string;
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public properties: IPropertyFieldAceEditorPropsInternal;
  public onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void { }
  private onGetErrorMessage?: (value: string, annotations: Annotation[]) => string | Promise<string>;


  //private _onChangeCallback: (targetProperty?: string, newValue?: any) => void;

  public constructor(_targetProperty: string, _properties: IPropertyFieldAceEditorPropsInternal) {
    this.targetProperty = _targetProperty;
    this.properties = _properties;
    this.onPropertyChange = _properties.onPropertyChange;
    this.properties.onRender = this._render.bind(this);
    this.properties.onDispose = this._dispose.bind(this);
  }

  private _render(elem: HTMLElement, context?: any, changeCallback?: (targetProperty?: string, newValue?: any) => void): void {

    const props: IPropertyFieldAceEditorProps = <IPropertyFieldAceEditorProps>this.properties;

    const element = React.createElement(PropertyFieldAceEditorHost, {
      ...props,
      targetProperty: this.targetProperty,
      onRender: this._render,
      onChange: changeCallback,
      onPropertyChange: this.onPropertyChange,
    });

    ReactDOM.render(element, elem);

    // if (changeCallback) {
    //   this._onChangeCallback = changeCallback;
    // }
  }

  private _dispose(elem: HTMLElement) {
    ReactDOM.unmountComponentAtNode(elem);
  }
}

/**
 * Use this property pane control to allow users to edit in-place code.
 *
 * To allow full-page code editing, please use the PnP codeeditor property control.
 *
 * @param targetProperty
 * @param properties
 */
export function PropertyFieldAceEditor(targetProperty: string, properties: IPropertyFieldAceEditorProps): IPropertyPaneField<IPropertyFieldAceEditorPropsInternal> {
  return new PropertyFieldAceEditorBuilder(targetProperty, {
    ...properties,
    targetProperty: targetProperty,
    onRender: null,
    onDispose: null
  });
}
