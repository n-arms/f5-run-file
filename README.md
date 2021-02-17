# f5-run-file package
This package is designed to allow you to run files from inside the editor. It is designed to be extremely customizable and modular, and allow you to add new languages to the system.

## executing commands
* You can open up an IO panel with ctrl-alt-a
* You can run a series of custom bash commands with f5

## global set up
Inside of .atom/packages/f5-run-file/lib/config.json is a list of all the default file extensions and the commands to be run when a launch.json file is not found. By default the following languages are supported:
* python3
* c++11
* c99
* java
* bash

To add more languages, just add more file extensions to config.json, using the following syntax:

```
"<extension>": {
  "commands": [
    <command 1>,
    <command 2>,
    ....
    <command n>
  ]
}
```

Where each command follows the syntax describe below in local set up for commands.


## local set up
Inside the root of the current project you can set up a launch.json file to determine the commands to be run.

To set up the commands to be run use the following syntax

```
{
  "commands": [
    "<command 1>",
    "<command 2>",
    ...
    "<command n>"
  ]
}
```

where each command obeys the following syntax:

```
{
  "command": "<name of command>",
  "args": [
    "<argument 1>",
    "<argument 2>",
    ...
    "<argument n>"
  ],
  "stdin": "here is some input that is passed to stdin"
}
```

all commands are run from the project root.

## example
consider the following directory setup:
```
learning-cpp
├── main.cpp
└── bin
    └── a.out
```
To set up a launch.json that compiles main.cpp into a.out, and then runs it you would do:
```
{
  "commands": [
    {
      "command": "g++",
      "args": [
        "-o",
        "bin/a.out",
        "main.cpp"
      ]
    },
    {
      "command": "./bin/a.out"
    }
  ]
}
```

## Licensing
This project uses the MIT license. For more info please see LICENSE.md
