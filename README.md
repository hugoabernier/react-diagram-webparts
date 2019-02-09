# React Diagram Web Parts

## Summary

This solution contains (or will contain) a collection of web parts that make it easy
to embed various types of diagrams in pages.

![Sequence Diagram Web Part](./assets/SequenceWebPart.gif)

## Used SharePoint Framework Version

![SPFx v1.7.1](https://img.shields.io/badge/SPFx-1.7.1-green.svg)

## Applies to

* [SharePoint Framework](https:/dev.office.com/sharepoint)
* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)

## Solution

Solution|Author(s)
--------|---------
react-diagram-webparts | Hugo Bernier ([Tahoe Ninjas](http://tahoeninjas.blog), @bernierh)

## Version history

Version|Date|Comments
-------|----|--------
1.0|Feb 8, 2019|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

* Clone this repository
* in the command line run:
  * `npm install`
  * `gulp serve`

## Features

This Web Part illustrates the following concepts:

* Using [react-sequence-diagram](https://github.com/zfanta/react-sequence-diagram) in a SPFx web Part (React version of [js-sequence-diagrams](https://bramp.github.io/js-sequence-diagrams/))
* Converting a static SVG to a responsive SVG post-render
* Improving accessibility on a SVG post-render
* Creating a custom code editor property pane that allows custom code/syntax
* Using [react-ace](https://github.com/securingsincity/react-ace) to embed an Ace Editor for code editing and syntax highlighting
* Creating a custom Markdown property pane control that renders a read-only version of Markdown text in a property pane
* Using [markdown-to-jsx](https://github.com/probablyup/markdown-to-jsx) to render Markdown in a web part

<img src="https://telemetry.sharepointpnp.com/sp-dev-fx-webparts/samples/react-diagram-webparts" />
