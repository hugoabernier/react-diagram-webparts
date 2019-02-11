import * as strings from 'PropertyFieldAceEditorStrings';
import * as React from 'react';

// Custom props and state
import { IPropertyFieldAceEditorHostProps, IPropertyFieldAceEditorHostState } from './IPropertyFieldAceEditorHost';

// Adds telemetry
import * as telemetry from '@common/telemetry';

// Office Fabric
import { Async } from 'office-ui-fabric-react/lib/Utilities';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

// Custom styles
import styles from './PropertyFieldAceEditor.module.scss';

// Code editor stuff
import AceEditor from 'react-ace';
import { Annotation } from '.';

// Import a default theme
import 'brace/theme/github';


// Custom code editor panel
import { EditorPanel } from './EditorPanel';

export default class PropertyFieldNumberHost extends React.Component<IPropertyFieldAceEditorHostProps, IPropertyFieldAceEditorHostState> {
  private _async: Async;
  private _editorElem: AceEditor;
  private _delayedChange: (value: string) => void;

  constructor(props: IPropertyFieldAceEditorHostProps) {
    super(props);

    telemetry.track('PropertyFieldAceEditor', {
      mode: this.props.mode,
      theme: this.props.theme
    });

    this.state = {
      value: this.props.value,
      annotations: [],
      fullScreen: false,
    };

    this._async = new Async(this);
    this._delayedChange = this._async.debounce(this._handleOnChanged, this.props.deferredValidationTime ? this.props.deferredValidationTime : 200);
  }

  public componentDidMount(): void {
    if (this.props.customMode !== undefined) {
      try {
        // execute the custom mode function
        this.props.customMode();

        // get a reference to ace
        const aceThingy: any = this._editorElem as any;

        // get a reference to brace
        var ace = require('brace') as any;

        // set the mode to custom
        var editor = ace.edit(aceThingy.editor);
        editor.session.setMode(`ace/mode/custom`);
      } catch (error) {
        console.log("Error with refs", error);
      }
    }
  }

  /**
   * Render field
   */
  public render(): JSX.Element {
    return (
      <div>
        <Label>{this.props.label}</Label>
        <AceEditor
          ref={(el: AceEditor) => this._editorElem = el}
          mode={this.props.mode}
          theme={this.props.theme ? this.props.theme : 'github'}
          onChange={(value: string) => this._delayedChange(value)}
          editorProps={{
            $blockScrolling: true
          }}
          defaultValue={this.props.defaultValue}
          showPrintMargin={false}
          setOptions={this.props.aceOptions}
          width={"100%"}
          height={this.props.editorHeight}
          value={this.state.value}
          className={this.props.editorClassName}
          name={`code-${this.props.targetProperty}`}
          annotations={this.state.annotations}
          wrapEnabled={true}
          readOnly={this.props.disabled}
        />
        <IconButton
          title={strings.ExpandButtonLabel}
          className={styles.fullScreenButton}
          iconProps={{ iconName: 'MiniExpand' }}
          onClick={() => this._handleOpenFullScreen()}
        />

        {this.state.fullScreen &&
          <EditorPanel
          defaultValue={this.props.defaultValue}
            label={this.props.label}
            customMode={this.props.customMode}
            mode={this.props.mode}
            theme={this.props.theme}
            onSave={(value: string) => this._handleSaveFullScreen(value)}
            onClose={() => this._handleCloseFullScreen()}
            onValidate={(this.props.onValidate)}
            value={this.state.value}
            disabled={this.props.disabled}
            targetProperty={this.props.targetProperty}
          />
        }
      </div>
    );
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
   * Called when user clicks on the expand button
   */
  private _handleOpenFullScreen = () => {
    this.setState({
      fullScreen: true
    });
  }

  /**
   * Gets called by the editor pane when it is time to save
   */
  private _handleSaveFullScreen = (newValue: string) => {
    this.setState({ fullScreen: false });
    this._handleOnChanged(newValue);
  }

  /**
   * ets called by the editor pane when it is closed
   */
  private _handleCloseFullScreen = () => {
    this.setState({ fullScreen: false });
  }
}
