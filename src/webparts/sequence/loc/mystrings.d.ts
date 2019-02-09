declare interface ISequenceWebPartStrings {
  SequenceHelpGroupName: string;
  SequenceHelpDescription: string;
  SequenceHelpMarkdown: string;
  SequenceParsingErrorExpectingActor: string;
  SequenceParsingErrorInvalidPlacement: string;
  SequenceParsingErrorInvalidCharParticipant: string;
  SequenceParsingErrorInvalidParticipant: string;
  SequenceParsingErrorInvalidSyntax: string;
  SequenceParsingErrorMissingColon: string;
  SequenceParsingErrorInvalidArrow: string;
  DefaultSampleSequence: string;
  ThemeOptionHandDrawn: string;
  ThemeOptionSimple: string;
  ThemeFieldLabel: string;
  PropertyPaneDescription: string;
  SequenceGroupName: string;
  DescriptionFieldLabel: string;
  OptionsGroupName: string;
  DefaultSampleTitle: string;
  DefaultSampleAccessibleText: string;
  ArrowTo: string;
  OpenArrowTo: string;
  DashedArrowTo: string;
  DashedOpenArrowTo: string;
}

declare module 'SequenceWebPartStrings' {
  const strings: ISequenceWebPartStrings;
  export = strings;
}
