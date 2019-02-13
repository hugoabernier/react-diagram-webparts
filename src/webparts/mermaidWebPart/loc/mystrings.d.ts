declare interface IMermaidWebPartWebPartStrings {
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

declare module 'MermaidWebPartWebPartStrings' {
  const strings: IMermaidWebPartWebPartStrings;
  export = strings;
}
