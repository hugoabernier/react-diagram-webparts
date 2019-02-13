import * as React from 'react';
import styles from './MermaidWebPart.module.scss';
import { IMermaidWebPartProps, IMermaidWebPartState } from './IMermaidWebPart.types';

import mermaid, { mermaidAPI } from 'mermaid';

export default class MermaidWebPart extends React.Component<IMermaidWebPartProps, IMermaidWebPartState> {
  private _mermaidElem: HTMLDivElement = undefined;
  /**
   *
   */
  constructor(props: IMermaidWebPartProps) {
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
    console.log("Initialized");

  }

  public componentDidMount(): void {
    console.log("Component did mount");

    this._renderMermaid();
  }

  public componentDidUpdate(prevProps: IMermaidWebPartProps, prevState: IMermaidWebPartState): void {
    if (prevProps.mermaidText !== this.props.mermaidText) {
      this._renderMermaid();
    }
  }

  public render(): React.ReactElement<IMermaidWebPartProps> {
    return (
      <div
        ref={(el: HTMLDivElement) => this._mermaidElem = el}
        className={styles.mermaidWebPart}>
        {/* {this.state.diagram &&
          <div className="mermaid" dangerouslySetInnerHTML={{ __html: this.state.diagram }}></div>
        } */}
      </div>
    );
  }

  private _renderMermaid = () => {
    const { mermaidText } = this.props;

    if (mermaidText !== undefined && mermaidText !== "") {
      //console.log("Has text", mermaidText);
      mermaidAPI.render("mermaid", mermaidText, (html) => {
        //console.log("Mermaid render", html);
        this._mermaidElem.innerHTML = html;
        // this.setState({ diagram: html });
      }, this._mermaidElem
      );
    }

  }
}
