import * as React from 'react';
import styles from './Mermaid.module.scss';
import { IMermaidProps, IMermaidState } from './IMermaid.types';

// PnP controls for web part title
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";

import mermaid, { mermaidAPI } from 'mermaid';

export default class Mermaid extends React.Component<IMermaidProps, IMermaidState> {
  private _mermaidElem: HTMLDivElement = undefined;
  /**
   *
   */
  constructor(props: IMermaidProps) {
    super(props);

    this.state = {
      diagram: undefined
    };

    mermaid.initialize({
      theme: null,
      themeCSS: '',
      flowchart: {
        htmlLabels: false
      }
    });
  }

  public componentDidMount(): void {
    this._renderMermaid();
  }

  public componentDidUpdate(prevProps: IMermaidProps, prevState: IMermaidState): void {
    if (prevProps.mermaidText !== this.props.mermaidText) {
      this._renderMermaid();
    }
  }

  public render(): React.ReactElement<IMermaidProps> {
    return (
      <div className={styles.mermaid}>
        <WebPartTitle displayMode={this.props.displayMode}
          title={this.props.title}
          updateProperty={this.props.onUpdateTitle} />

        <div
          ref={(el: HTMLDivElement) => this._mermaidElem = el}
          className={styles.mermaidContainer}>
        </div>
      </div>
    );
  }

  private _renderMermaid = () => {
    const { mermaidText } = this.props;

    // Make the mermaid unique by using the instance Id, otherwise they'll overlap
    const mermaidId: string = `mermaid${this.props.instanceId}`;
    console.log("InstanceId", mermaidId);
    if (mermaidText !== undefined && mermaidText !== "") {
      mermaidAPI.render(mermaidId, mermaidText, (html: string) => {
        this._mermaidElem.innerHTML = html;
      }, this._mermaidElem
      );
    }

  }
}
