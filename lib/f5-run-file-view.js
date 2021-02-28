'use babel';

import { Input } from 'atom';

export default class F5RunFileView {

  constructor(serializedState) {
    this.element = document.createElement('div');
    this.element.classList.add('f5-run-file');

    // Create panel to display current running command
    this.defaultCommandText = "write a launch.json and hit f5!";
    const currentCommand = document.createElement('div');
    currentCommand.innerText = this.defaultCommandText;
    currentCommand.setAttribute("id", "currentcommand");
    this.element.appendChild(currentCommand);

    // Create message element
    this.text = "---------------------------\n";
    const message = document.createElement('div');
    message.innerText = this.text;
    message.setAttribute("id", "output");
    this.element.appendChild(message);

    // Panel Division
    const line = document.createElement('hr');
    this.element.appendChild(line);

    // Create text entry
    const entry = document.createElement('input');
    entry.setAttribute("id", "inputform");
    this.element.appendChild(entry);
  }

  serialize() {}

  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    return "IO panel";
  }

  getURI() {
    return "atom://f5-run-file";
  }

  getDefaultLocation() {
    return 'right';
  }

  getAllowedLocations() {
    return ['left', 'right', 'bottom'];
  }

  execute() {
    fs = require('fs');

    var editor = atom.workspace.getActiveTextEditor();
    if (editor === undefined){
      return; //if no files are open, return
    }
    var currentFilePath = editor.getPath();
    this.projectFilePath = atom.project.relativizePath(currentFilePath)[0];
    var jsonPath;
    if ((typeof this.projectFilePath) !== "string"){
      var path = currentFilePath.split(".");
      path.pop();
      var root = path.pop().split("/");
      root.pop();
      root = root.join("/");
      this.projectFilePath = root;

      this.singlefilerun(currentFilePath);
      return;
    }
    this.readDir(this.projectFilePath, (path) => this.projectrun(path), (path) => this.singlefilerun(path), currentFilePath);
  }

  singlefilerun(currentFilePath){
    var path = currentFilePath.split(".");
    var extension = path.pop();
    var fs = require('fs');

    var configPath = atom.config.getUserConfigPath().split("/");
    configPath.pop();
    var config = JSON.parse(fs.readFileSync(configPath.join("/")+"/packages/f5-run-file/lib/config.json", 'utf8'));
    if (extension in config){
      var parsed = JSON.parse(JSON.stringify(config).replace(/FILEPATH/g, currentFilePath).replace(/FILENAME/g, path.pop().split("/").pop()));
      this.runcommandrec(parsed[extension]["commands"]);
    }else{
      console.log("file extension not found");
    }
  }

  projectrun(jsonPath){
    var fs = require('fs');
    var launch = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    if ("commands" in launch){
      this.runcommandrec(launch["commands"]);
    }else{
      console.log("ERROR at lib/f5-run-view.js::83");
    }
  }

  readDir(dir, succ, fail, filepath){
    fs = require('fs');

    fs.readdir(dir, function(err, files) {
      if (err){
        console.log(err);
        return;
      }
      success = false;
      files.forEach(file => {
        if (file === "launch.json"){
          jsonPath = dir + "/"+file;
          succ(jsonPath);
          success = true;
          return;
        }
      });
      if (! success){
        fail(filepath);
      }
    });
  }

  runcommandrec(commands){
    const { spawn } = require("child_process");
    const { readable } = require("stream");

    var elem = document.getElementById("output");
    var outputPresent = false;

    var currentCommand = document.getElementById("currentcommand");

    var inputValue = document.getElementById("inputform").value;

    if ("args" in commands[0]){
      arguments = commands[0]["args"];
    }else{
      arguments = []
    }

    if ("stdin" in commands[0]){
      inputValue = commands[0]["stdin"];
    }

    currentCommand.innerText = commands[0]["command"]+arguments.join(' ');
    const statement = spawn(commands[0]["command"], arguments, {cwd: this.projectFilePath});

    statement.stdin.write(inputValue+"\n");

    statement.stdout.on('data', (data) => {
      outputPresent = true;
      this.text += `${data}`;
      elem.innerText = this.text;
    });

    statement.stderr.on('data', (data) => {
      outputPresent = true;
      this.text += `${data}`;
      elem.innerText = this.text;
    });

    statement.on('close', () => {
      if (outputPresent){
        this.text += '---------------------------\n';
        elem.innerText = this.text;
      }
      if (commands.length > 1){
        this.runcommandrec(commands.slice(1, commands.length+1));
      }else{
        setTimeout(() => {
          var commandPanel = document.getElementById("currentcommand");
          commandPanel.innerText = this.defaultCommandText;
        }, 250);
      }
    });
  }
}
