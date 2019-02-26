import { DisplayMode } from "@microsoft/sp-core-library";

export interface ISequenceProps {
  sequenceText: string;
  accessibleText: string;
  accessibleTitle: string;
  theme: string;
  displayMode: DisplayMode;
  title: string;
  onUpdateTitle: (value: string) => void;
}
