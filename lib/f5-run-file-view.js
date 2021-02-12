'use babel';

export default class F5RunFileView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('f5-run-file');

    // Create message element
    this.text = "";
    const message = document.createElement('div');
    message.innerText = this.text;
    message.classList.add('message');
    message.setAttribute("id", "sidepanel");
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
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
    var projectFilePath = atom.project.relativizePath(currentFilePath)[0];
    var jsonPath;
    if ((typeof projectFilePath) !== "string"){
      console.log("ERRRRRRROR: illegal type of projectfilepath: "+(typeof projectFilePath));
      return;
    }
    this.readDir(projectFilePath, (path) => this.projectrun(path), (path) => this.singlefilerun(path), currentFilePath);
  }

  singlefilerun(currentFilePath){
    console.log("callign default command with file path: "+currentFilePath);
  }
  projectrun(jsonPath){
    console.log("calling project command with json path: "+jsonPath);
    var fs = require('fs');
    var launch = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    if ("commands" in launch){
      console.log("found commands");
      launch["commands"].forEach(command => {
        this.runcommand(command["command"], command["args"]);
      })
    }else{
      console.log("lost commands");
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

  runcommand(command, args){
    const { spawn } = require("child_process");
    const statement = spawn(command, args);
    statement.stdout.on('data', (data) => {
      this.text += `${data}`;
      var elem = document.getElementById("sidepanel");
      elem.innerText = this.text;
    });
  }
}
