import * as React from 'react';

// Custom styles
import styles from './Sequence.module.scss';

// Custom props
import { ISequenceProps } from './ISequence.types';

// Used to render sequence diagrams
import SequenceDiagram from 'react-sequence-diagram';

// PnP controls rock!
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";

export default class Sequence extends React.Component<ISequenceProps, {}> {
  private _diagramElem: SequenceDiagram = undefined;

  public componentDidMount(): void {
    this._resizifyAndAccessibilify();
  }

  public componentDidUpdate(prevProps: ISequenceProps, prevState: {}): void {
    this._resizifyAndAccessibilify();
  }

  public render(): React.ReactElement<ISequenceProps> {
    const options = {
      theme: this.props.theme
    };
    return (
      <div className={styles.sequence}>
       <WebPartTitle displayMode={this.props.displayMode}
          title={this.props.title}
          updateProperty={this.props.onUpdateTitle} />
        <SequenceDiagram
          ref={(el: SequenceDiagram) => this._diagramElem = el}
          input={this.props.sequenceText} options={options} onError={(error) => this._handleError(error)} />
      </div>
    );
  }

  /**
   * Handles errors parsing the sequence diagram text
   */
  private _handleError = (error) => {
    console.error(error);
  }

  // Resizes and adds accessible tags
  private _resizifyAndAccessibilify = () => {
    // The Sequence Diagram does not set a viewBox, which makes it really
    // hard to create an resizing SVG
    // As much as I don't like this, we move the dimensions to a
    // viewBox and set the width to 100%
    if (this._diagramElem) {
      try {
        const svg: SVGElement = this._diagramElem.div.firstElementChild;

        // Store the height
        const height = svg.getAttribute("height");
        const width = svg.getAttribute("width");

        // Change the width
        svg.setAttribute("width", "100%");
        svg.removeAttribute("height");
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.setAttribute("role", "image");

        // Add an accessible title
        const title: HTMLElement = document.createElement('title');
        title.setAttribute("id", "sequencetitle");
        title.innerText = this.props.accessibleTitle;
        svg.insertAdjacentElement("afterbegin", title);

        // Add an accessible description
        const descElement = svg.getElementsByTagName("desc").item(0);
        if (descElement) {
          descElement.id = "sequencedesc";
          descElement.innerHTML = this.props.accessibleText;
        } else {
          const desc: SVGDescElement = new SVGDescElement(); // document.createElement('desc');
          desc.id = "sequencedesc";
          desc.innerHTML = this.props.accessibleText;
          svg.appendChild(desc);
        }
        svg.setAttribute("aria-labelledby", "sequencetitle sequencedesc");

      } catch (error) {
        console.log("Error resizing the diagram");
      }
    }
  }
}
