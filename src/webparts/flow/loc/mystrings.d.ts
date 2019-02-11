declare interface IFlowWebPartStrings {
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
