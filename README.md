# f5-run-file package
This package is designed to allow you to run files from inside the editor. It is designed to be extremely customizable and modular, and allow you to add new languages to the system.

## executing commands
* You can open up an IO panel with ctrl-alt-a
* You can run a series of custom bash commands with f5

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
  "command": "<name of command>"
  "args": [
    "<argument 1>",
    "<argument 2>",
    ...
    "<argument n>"
  ]
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
      "command": "./bin/a.out",
      "args": []
    }
  ]
}
```

## Licensing
This project uses the MIT license. For more info please see LICENSE.md
