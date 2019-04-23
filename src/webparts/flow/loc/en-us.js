define([], function() {
  return {
    FlowParserErrorSymbolDoesNotExist: "Symbol '{0}' does not exist",
    FlowParserErrorDuplicateSymbol: "Duplicate symbol '{0}'",
    FlowParserErrorWrongSymbol: "Wrong symbol type. Expecting 'start', 'end', 'operation', 'inputoutput', 'subroutine', 'condition', or 'parallel'",
    FlowParserErrorLabelCannotBeBlank: "Label cannot be blank",
    FlowParserErrorOnlyOneStartAllowed: "Only one 'start' symbol allowed.",
    FlowParserErrorInvalidDirection: "Invalid direction. Expecting 'top', 'bottom', 'left', 'right', or 'align-next:[yes/no]'",
    FlowParserErrorInvalidNextDirective: "Invalid align-next directive. Expecting 'yes' or 'no'",
    ConfigurationSyntaxHelpGroup: "Configuration syntax help",
    ConfigurationSyntaxHelp: `## Chart styles

You can override chart styles by specifying properties at the root of the JSON structure.

\`\`\`
{
  \"x\": 0,
  \"y\": 0,
  \"line-width\": 3,
  \"line-length\": 50,
  \"text-margin\": 10,
  \"font-size\": 14,
  \"font-color\": \"black\",
  \"line-color\": \"black\",
  \"element-color\": \"black\",
  \"fill\": \"white\",
  \"yes-text\": \"yes\",
  \"no-text\": \"no\",
  \"arrow-end\": \"block\",
  \"scale\": 1,
}
\`\`\`

## Symbol styles

You can add a **symbols** section and define styles for each symbol type.

Possible symbols are **start**, **end**, **operation**, **subroutine**, **condition**, **inputoutput**, and **parallel**.

\`\`\`
{
  \"symbols\": {
    \"start\": {
      \"font-color\": \"red\",
      \"element-color\": \"green\",
      \"fill\": \"yellow\"
    },
    \"end\": {
      \"class\": \"end-element\"
    }
  },
}
\`\`\`

## State styles

You can override styles for each state you define in your chart by adding a **flowstate** section and adding a style for each flowstate.

\`\`\`
{
  \"flowstate\": {
    \"past\": {
      \"fill\": \"#CCCCCC\",
      \"font-size\": 12
    },
    \"current\": {
      \"fill\": \"yellow\",
      \"font-color\": \"red\",
      \"font-weight\": \"bold\"
    },
    \"future\": {
      \"fill\": \"#FFFF99\"
    },
    \"request\": {
      \"fill\": \"blue\"
    },
    \"invalid\": {
      \"fill\": \"#444444\"
    },
    \"approved\": {
      \"fill\": \"#58C4A3\",
      \"font-size\": 12,
      \"yes-text\": \"APPROVED\",
      \"no-text\": \"n/a\"
    },
    \"rejected\": {
      \"fill\": \"#C45879\",
      \"font-size\": 12,
      \"yes-text\": \"n/a\",
      \"no-text\": \"REJECTED\"
    }
  }
}
\`\`\`

## For more information

For more information, please visit [flowchart.js](http://flowchart.js.org/).
`,
    ConfigurationSyntaxFieldName: "Here are some examples of configuration JSON.",
    ConfigurationJSONFieldName: "Configuration JSON",
    AdvancedConfigurationGroupName: "Advanced configuration",
    DefaultSampleFlow: `st=>start: Begin
e=>end: End
op1=>operation: Edit Web Part|dev1
op2=>operation: Change Code|dev1
sub=>subroutine: View Web Part|business1
cond=>condition: Looks OK?
st(bottom)->op1(bottom)->op2(bottom)->sub(right)->cond(no)->op1(bottom)
cond(yes)->e`,
    PropertyPaneDescription: "Use this web part to display flowcharts inside a page.",
    BasicGroupName: "Flowchart",
    DescriptionFieldLabel: "Flowchart code",
    FlowChartHelpGroupName: "Syntax help",
    FlowChartHelpDescription: "Here are examples the flowchart diagram syntax.",
    FlowChartHelpMarkdown: `## Symbols
Define symbols as **\`[name]=>[type]: [Label]\`**

\`\`\`
st=>start: Begin

e=>end: End

op1=>operation: Operation

sub=>subroutine: Subroutine

cond=>condition: Condition

io=>inputoutput: Input Output

p1=>parallel: Parallel
\`\`\`

## Labels

### Labels with state
Indicate state with a **\`|\`** after the label:

\`\`\`
st=>operation: My Operation|past

op2=>operation: Stuff|current

sub1=>subroutine: My Subroutine|invalid
\`\`\`

### Labels with links
Add hyperlinks with a **\`:>\`** after the label:

\`\`\`
st=>start:
  Opens a link
  :>http://www.yoururl.com

op2=>operation:
  Opens a link in a new window
  :>http://www.yoururl.com[blank]

sub1=>subroutine:
  Combined with state|past
  :>http://www.yoururl.com[blank]
\`\`\`

## Flow
Indicate flow between blocks by using **\`[block1]->[block2]\`**:

\`\`\`
st->op1->cond

st->op1->sub1->cond

sub3->sub4->io2->e
\`\`\`

### Conditional flows

Use **\`[block1](yes)->[block2]\`** and **\`[block1](no)->[block3]\`** to specify the **yes** and **no** paths:

\`\`\`
c2(yes)->io->e

c2(no)->op2->e
\`\`\`

### Flow direction

Indicate the direction of a path using **\`[block1]([direction])->[block2]\`**.

Possible directions are **\`(bottom)\`**, **\`(left)\`**, **\`(right)\`**, and **\`(top)\`**:

\`\`\`
st->op1(right)->cond

cond(yes, right)->c2

cond(no)->sub1(left)->op1
\`\`\`


## Highlighting a path

Highlight a path by using **\`[block1]@>[block2]([styles])\`**.

You can style an entire path, or parts of one.

Each path must be on a single line.

\`\`\`
st@>op1({"stroke":"Red"})

cond@>sub2({"stroke":"Green"})

st@>op1@>cond({"stroke": "yellow"})

io2@>
  e({"stroke":"Red",
  "stroke-width":6,
  "arrow-end":"classic-wide-long"})
  st@>
    op1({"stroke":"Red"})
    @>sub1({"stroke":"Yellow"})
    @>cond({"stroke":"Green"})
    @>io({"stroke":"Blue"})
\`\`\`


> **NOTE:** The path samples above must be on a single line in order to work.

## For more information

For more information, please visit [flowchart.js](http://flowchart.js.org/).

## Credits

[Adriano Raiano](https://github.com/adrai) for the awesome [flowchart.js](https://github.com/adrai/flowchart.js)

[Alex Vinokurov](https://github.com/alwinn1977) for [react-simple-flowchart](https://github.com/alwinn1977/react-simple-flowchart)
`
  }
});
