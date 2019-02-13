import * as React from 'react';
import styles from './PropertyFieldAceEditor.module.scss';

import AceEditor from 'react-ace';
import { Annotation } from '.';

import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { DefaultButton, PrimaryButton, IconButton } from 'office-ui-fabric-react/lib/Button';

import { Async } from 'office-ui-fabric-react/lib/Utilities';

import { AceOptions } from 'react-ace';

import * as strings from 'PropertyFieldAceEditorStrings';

export interface IEditorPanelProps {
  aceOptions?: AceOptions;
  customMode?: () => void;
  defaultValue?: string;
  deferredValidationTime?: number;
  disabled?: boolean;
  editorClassName?: string;
  editorHeight?: string;
  errorMessage?: string;
  initialValue?: string;
  label?: string;
  mode: string;
  targetProperty: string;
  theme?: string;
  value?: string;
  onClose(): void;
  onSave(value: string): void;
  onValidate?: (value: string) => Annotation[];
}

export interface IEditorPanelState {
  annotations: Annotation[];
  value: string;
}

export class EditorPanel extends React.Component<IEditorPanelProps, IEditorPanelState> {
  private _async: Async;
  private _editor: AceEditor;
  private _delayedChange: (value: string) => void;

  /**
   *
   */
  constructor(props: IEditorPanelProps) {
    super(props);

    this.state = {
      value: this.props.value,
      annotations: [],
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
        const aceThingy: any = this._editor as any;

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

  public render(): React.ReactElement<IEditorPanelProps> {
    return (
      <Panel
        isOpen={true}
        onDismiss={() => this._handleClose()}
        type={PanelType.large}
        headerText={this.props.label}
        onRenderFooterContent={() => (
          <div className={styles.actionButtonsContainer}>
            <div className={styles.actionButtons}>
              <PrimaryButton
                disabled={this.state.annotations && this.state.annotations.length > 0}
                onClick={() => this._handleSave()} className={styles.actionButton}>{strings.SaveButtonLabel}</PrimaryButton>
              <DefaultButton onClick={() => this._handleClose()} className={styles.actionButton}>{strings.CancelButtonLabel}</DefaultButton>
            </div>
          </div>
        )}>
        <AceEditor
          ref={(el: AceEditor) => this._editor = el}
          mode={this.props.mode}
          theme={this.props.theme ? this.props.theme : 'github'}
          onChange={(value: string) => this._delayedChange(value)}
          editorProps={{
            $blockScrolling: true,
          }}
          setOptions={this.props.aceOptions}
          showPrintMargin={false}
          width={"100%"}
          height={"100%"}
          value={this.state.value}
          className={this.props.editorClassName}
          name={`codefs-${this.props.targetProperty}`}
          annotations={this.state.annotations}
          wrapEnabled={true}
          readOnly={this.props.disabled}
        />
      </Panel>
    );
  }

  private _handleSave = () => {
    this.props.onSave(this.state.value);
  }

  private _handleClose = () => {
    this.props.onClose();
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
    }
  }
}
