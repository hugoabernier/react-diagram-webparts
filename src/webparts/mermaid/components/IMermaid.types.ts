import { DisplayMode } from "@microsoft/sp-core-library";

export interface IMermaidProps {
  mermaidText: string;
  instanceId: string;
  displayMode: DisplayMode;
  htmlLabels: boolean;
  title: string;
  onUpdateTitle: (value: string) => void;
}

export interface IMermaidState {
  diagram?: string;
}
