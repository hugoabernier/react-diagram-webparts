declare interface IMermaidWebPartStrings {
  ErrorMessageInvalidSyntax: string;
  ErrorMessageWithExpected: string;
  SyntaxRightOf: string;
  SyntaxLeftOf: string;
  SyntaxText: string;
  SyntaxAsKeyword: string;
  SyntaxNewLine: string;
  SyntaxSpace: string;
  MermaidSyntaxHelp: string;
  SyntaxHelpGroupName: string;
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  SampleDefaultMermaid: string;
}

declare module 'MermaidWebPartStrings' {
  const strings: IMermaidWebPartStrings;
  export = strings;
}
