declare interface IFlowWebPartStrings {
  FlowParserErrorSymbolDoesNotExist: string;
  FlowParserErrorDuplicateSymbol: string;
  FlowParserErrorWrongSymbol: string;
  FlowParserErrorLabelCannotBeBlank: string;
  FlowParserErrorOnlyOneStartAllowed: string;
  FlowParserErrorInvalidDirection: string;
  FlowParserErrorInvalidNextDirective: string;
  ConfigurationSyntaxHelpGroup: string;
  ConfigurationSyntaxHelp: string;
  ConfigurationSyntaxFieldName: string;
  ConfigurationJSONFieldName: string;
  AdvancedConfigurationGroupName: string;
  DefaultSampleFlow: string;
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  FlowChartHelpGroupName: string;
  FlowChartHelpDescription: string;
  FlowChartHelpMarkdown: string;

}

declare module 'FlowWebPartStrings' {
  const strings: IFlowWebPartStrings;
  export = strings;
}
