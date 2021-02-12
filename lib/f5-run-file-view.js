'use babel';

export default class F5RunFileView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('f5-run-file');

    // Create message element
    const message = document.createElement('div');
    message.innerHTML = `
    <h1>IO panel</h1>
    <ul>
      <li><p>this is some data</p></li>
      <li><p>this is some more data</p></li>
    </ul>`;
    message.classList.add('message');
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
}
