'use babel';

import { Input } from 'atom';

export default class F5RunFileView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('f5-run-file');


    // Create message element
    this.text = "";
    const message = document.createElement('div');
    message.innerText = this.text;
    message.setAttribute("id", "sidepanel");
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
      console.log("ERROR at lib/f5-run-view.js::67");
      return;
    }
    this.readDir(this.projectFilePath, (path) => this.projectrun(path), (path) => this.singlefilerun(path), currentFilePath);
  }

  singlefilerun(currentFilePath){
    console.log("ERROR at lib/f5-run-view.js::74");
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

    var elem = document.getElementById("sidepanel");

    const statement = spawn(commands[0]["command"], commands[0]["args"], {cwd: this.projectFilePath});
    var inputValue = document.getElementById("inputform").value;
    statement.stdin.write(inputValue+"\n");

    statement.stdout.on('data', (data) => {
      this.text += `${data}`;
      elem.innerText = this.text;
    });
    statement.on('close', () => {
      this.text += '---------------------------\n'
      elem.innerText = this.text;
      if (commands.length > 1){
        this.runcommandrec(commands.slice(1, commands.length+1));
      }
    });
  }
}
