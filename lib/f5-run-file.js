'use babel';

import F5RunFileView from './f5-run-file-view';
import { CompositeDisposable } from 'atom';

export default {

  f5RunFileView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.f5RunFileView = new F5RunFileView(state.f5RunFileViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.f5RunFileView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'f5-run-file:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.f5RunFileView.destroy();
  },

  serialize() {
    return {
      f5RunFileViewState: this.f5RunFileView.serialize()
    };
  },

  toggle() {
    console.log('F5RunFile was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
