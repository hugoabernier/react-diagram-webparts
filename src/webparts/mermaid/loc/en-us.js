define([], function() {
  return {
    ErrorMessageInvalidSyntax: "Invalid syntax.\nExpected {0}.",
    ErrorMessageWithExpected: "'{0}' is invalid.\nExpected {1}.",
    SyntaxRightOf: "'right of'",
    SyntaxLeftOf: "'left of'",
    SyntaxText: "text",
    SyntaxAsKeyword: "'as'",
    SyntaxNewLine: "new line",
    SyntaxSpace: "space",
    MermaidSyntaxHelp: `## Mermaid syntax
    To learn more about **mermaid** syntax, please visit <a href='https://mermaidjs.github.io/' target='_blank'>mermaidjs</a>.

    ## Credits

    [Knut Sveidqvist](https://github.com/knsv) for the awesome [mermaid](https://github.com/knsv/mermaid)`,
    SyntaxHelpGroupName: "Syntax help",
    PropertyPaneDescription: "Use this web part to easily add flowcharts, gantt charts, and sequence diagrams using simple text.",
    BasicGroupName: "Mermaid",
    DescriptionFieldLabel: "Diagram text",
    SampleDefaultMermaid: `graph LR
  A[Square Rect] -- Link text --> B((Circle))
  A --> C(Round Rect)
  B --> D{Rhombus}
  C --> D`
  }
});
