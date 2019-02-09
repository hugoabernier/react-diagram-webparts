define([], function () {
  return {
    SequenceHelpGroupName: "Syntax help",
    SequenceHelpDescription: "Here are examples the sequence diagram syntax.",
    SequenceHelpMarkdown: `## Title
\`\`\`
Title: Title goes here
\`\`\`

## Arrows
\`\`\`
A->B: Normal line
B-->C: Dashed line
C->>D: Open arrow
D-->>A: Dashed open arrow
\`\`\`

## Notes
\`\`\`
Note left of A: Note goes here
Note right of A: Note goes here
Note over A: Note goes here
Note over A,B: Note goes here
\`\`\`

## Participants
### Participant order
By listing the participants you can change their order. Make sure to define participants at the start of your text.\n
\`\`\`
participant C
participant B
participant A
\`\`\`

### Aliases
Specify aliases to provide shorter participant names.\n
\`\`\`
participant Carl as C
participant Bob as B
B->C: Produces a line from Bob to Carl
\`\`\`
`,
    SequenceParsingErrorExpectingActor: "Expecting one or more actors",
    SequenceParsingErrorInvalidPlacement: "Expecting 'left of', 'right of', or 'over'",
    SequenceParsingErrorInvalidCharParticipant: "Invalid character in participant",
    SequenceParsingErrorInvalidParticipant: "Invalid participant",
    SequenceParsingErrorInvalidSyntax: "Invalid syntax",
    SequenceParsingErrorMissingColon: "Expecting ':'",
    SequenceParsingErrorInvalidArrow: "Expecting '->', '-->', '->>', or '-->>'",
    PropertyPaneDescription: `Use this webpart to show a UML sequence diagram on a page.`,
    DefaultSampleSequence: `Title: Edit web part properties to change diagram
A->B: Normal line
B-->C: Dashed line
C->>D: Open arrow
D-->>A: Dashed open arrow`,
    DefaultSampleTitle: "Edit web part properties to change diagram",
    DefaultSampleAccessibleText: `
A arrow to B: Normal line
B dashed arrow to C: Dashed line
C open arrow to D: Open arrow
D dashed open arrow to A: Dashed open arrow`,
    ThemeOptionHandDrawn: "Hand-drawn",
    ThemeOptionSimple: "Simple",
    ThemeFieldLabel: "Theme",
    //PropertyPaneDescription: "Change the text below to update your sequence diagram.",
    SequenceGroupName: "Sequence text",
    DescriptionFieldLabel: "Sequence text",
    OptionsGroupName: "Options",
    ArrowTo: ' arrow to ',
    OpenArrowTo: ' open arrow to ',
    DashedArrowTo: ' dashed arrow to ',
    DashedOpenArrowTo: ' dashed open arrow to ',
  }
});
