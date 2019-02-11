import { DisplayMode } from "@microsoft/sp-core-library";

export interface IFlowProps {
  configurationJson: string;
  displayMode: DisplayMode;
  flowText: string;
  title: string;
  onUpdateTitle: (value: string) => void;
}

export interface IFlowState {
  elementText: string;
}
