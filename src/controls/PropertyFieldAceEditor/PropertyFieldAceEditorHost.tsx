import * as React from 'react';
import { IPropertyFieldAceEditorHostProps, IPropertyFieldAceEditorHostState } from './IPropertyFieldAceEditorHost';
import * as telemetry from '../../common/telemetry';
import { Async } from 'office-ui-fabric-react/lib/Utilities';


import styles from './PropertyFieldAceEditor.module.scss';


import AceEditor, { Annotation } from 'react-ace';


export default class PropertyFieldNumberHost extends React.Component<IPropertyFieldAceEditorHostProps, IPropertyFieldAceEditorHostState> {
  private _async: Async;
  private _delayedChange: (value: string) => void;

  constructor(props: IPropertyFieldAceEditorHostProps) {
    super(props);

    telemetry.track('PropertyFieldAceEditor', {
      mode: this.props.mode,
      theme: this.props.theme
    });

    this.state = {
      value: this.props.value,
      annotations: []
    };

    this._async = new Async(this);
    this._delayedChange = this._async.debounce(this._handleOnChanged, this.props.deferredValidationTime ? this.props.deferredValidationTime : 200);
  }

  /**
   * On field change event handler
   */
  private _handleOnChanged = (value: string): void => {
    // Update state
    this.setState({
      value
    });


    if (this.props.onValidate) {
      const annotations: Annotation[] = this.props.onValidate(value);
      this.setState({
        annotations: annotations
      });

      if (annotations === undefined || annotations.length < 1) {
        this.props.onPropertyChange(this.props.targetProperty, this.props.initialValue, value);
        if (typeof this.props.onChange !== 'undefined' && this.props.onChange !== null) {
          this.props.onChange(value);
        }
      }
    } else {
      this.props.onPropertyChange(this.props.targetProperty, this.props.initialValue, value);
      if (typeof this.props.onChange !== 'undefined' && this.props.onChange !== null) {
        this.props.onChange(value);
      }
    }
  }

  /**
   * Render field
   */
  public render(): JSX.Element {
    return (
      <div>
        <AceEditor
          mode={this.props.mode}
          theme={this.props.theme}
          onChange={(value: string) => this._delayedChange(value)}
          editorProps={{
            $blockScrolling: true
          }}
          setOptions={this.props.aceOptions}
          width={"100%"}
          height={this.props.editorHeight}
          value={this.state.value}
          className={this.props.editorClassName}
          name={`code-${this.props.targetProperty}`}
          annotations={this.state.annotations}
          wrapEnabled={false}
          readOnly={this.props.disabled}
        />
      </div>
    );
  }
}
