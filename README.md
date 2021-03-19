# f5-run-file package
This package is allows you to run files from inside the editor. It is designed to be extremely customizable and allow you to add new languages and commands to the system.

## executing commands
* You can open up an IO panel with ctrl-alt-a
* You can run a series of commands determined by file type by hitting f5
  * this can be customized in a number of ways

## global set up
Inside of .atom/packages/f5-run-file/lib/config.json is a list of all the default file extensions and the commands to be run when a launch.json or launch.sh file is not found. By default the following languages are supported:
* python3
* c++11
* c99
* java
* bash
* golang

To add more languages, just add more file extensions to config.json, using the following syntax:

```json
"<extension>": {
  "commands": [
    "<command 1>",
    "<command 2>",
    "...",
    "<command n>"
  ]
}
```

Where each command follows the syntax:

```json
{
  "command": "<name of command>",
  "args": [
    "<argument 1>",
    "<argument 2>",
    "...",
    "<argument n>"
  ],
  "stdin": "here is some input that is passed to stdin"
}
```

## local set up
Instead of changing commands on a global scale, you can set up commands to be run for each project, irrespective of file type. There are two ways to do this: launch.json or launch.sh. Launch.sh is the preferred method.

### launch.sh
Simply create a shell script file called launch.sh in the project root. When f5 is hit it will be run (using bash command, so there is no need for a shebang or executable perms).

### launch.json
Before you make use of this slower and more complex option, ask yourself why you are not using launch.sh.

To create a launch.json, use the same syntax for a series of commands in config.json:

```json
{
  "commands": [
    "<command 1>",
    "<command 2>",
    "<command 3>",
    "...",
    "<command n>"
  ]
}
```
Really, you should be using a launch.sh.


## example
consider the following directory setup:
```
learning-cpp
├── main.cpp
└── bin
    └── a.out
```
To set up a launch.sh that compiles main.cpp into a.out, and then runs it you would do:
```shell
g++ -o bin/a.out main.cpp
./bin/a.out
```

and for a launch.json:

```json
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

I think that makes it plain why launch.sh is the preferred method.

## Licensing
This project uses the MIT license. For more info please see LICENSE.md
