import * as React from 'react';

// Custom themes
import styles from './Flow.module.scss';

// Custom props and state
import { IFlowProps, IFlowState } from './IFlow.types';

// Used to render the flowchart
import Flowchart from 'react-simple-flowchart';

// Used to get colors from the current theme
import { ThemeColorHelper } from '@common/utilities/ThemeColorHelper';

// PnP controls rock!
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";

export default class Flow extends React.Component<IFlowProps, IFlowState> {
  private _diagramElem: Flowchart = undefined;
  /**
   *
   */
  constructor(props: IFlowProps) {
    super(props);

    this.state = {
      elementText: 'none',
    };
  }

  public componentDidMount(): void {
    this._resizifyAndAccessibilify();
  }

  public componentDidUpdate(prevProps: IFlowProps, prevState: {}): void {
    this._resizifyAndAccessibilify();
  }

  public render(): React.ReactElement<IFlowProps> {
    const neutralPrimary: string = ThemeColorHelper.GetThemeColor(styles.neutralPrimary);
    const white: string = ThemeColorHelper.GetThemeColor(styles.white);
    const opts: {} = this.props.configurationJson && this.props.configurationJson !== "" ?
      JSON.parse(this.props.configurationJson)
      : {};

    // Configure a default font color
    if (opts["font-color"] === undefined) {
      opts["font-color"] = neutralPrimary;
    }

    // Configure a default line color
    if (opts["line-color"] === undefined) {
      opts["line-color"] = neutralPrimary;
    }

    // Configure a default element color
    if (opts["element-color"] === undefined) {
      opts["element-color"] = neutralPrimary;
    }

    // Configure a default fill
    if (opts["fill"] === undefined) {
      opts["fill"] = white;
    }

    return (
      <div className={styles.flow}>
        <WebPartTitle displayMode={this.props.displayMode}
          title={this.props.title}
          updateProperty={this.props.onUpdateTitle} />
        <Flowchart
          ref={(el: Flowchart) => this._diagramElem = el}
          chartCode={this.props.flowText}
          options={opts}
          onClick={elementText => this.setState({ elementText })}
        />
      </div>
    );
  }

  /**
   * Resizes and adds accessible
   */
  private _resizifyAndAccessibilify = () => {
    // The Sequence Diagram does not set a viewBox, which makes it really
    // hard to create an resizing SVG
    // As much as I don't like this, we move the dimensions to a
    // viewBox and set the width to 100%
    if (this._diagramElem) {
      try {
        const svg: SVGElement = this._diagramElem.chart.firstElementChild;

        // Store the height
        const height = svg.getAttribute("height");
        const width = svg.getAttribute("width");

        // Change the width
        svg.setAttribute("width", "100%");
        svg.removeAttribute("height");
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.setAttribute("role", "image");
      } catch (error) {
        console.log("Error resizing the diagram");
      }
    }
  }
}
