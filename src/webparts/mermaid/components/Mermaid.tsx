import * as React from 'react';
import styles from './Mermaid.module.scss';
import { IMermaidProps, IMermaidState } from './IMermaid.types';

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
    console.log("Initialized");

  }

  public componentDidMount(): void {
    console.log("Component did mount");

    this._renderMermaid();
  }

  public componentDidUpdate(prevProps: IMermaidProps, prevState: IMermaidState): void {
    if (prevProps.mermaidText !== this.props.mermaidText) {
      this._renderMermaid();
    }
  }

  public render(): React.ReactElement<IMermaidProps> {
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
