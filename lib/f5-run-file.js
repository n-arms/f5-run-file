'use babel';

import F5RunFileView from './f5-run-file-view';
import {CompositeDisposable, Disposable} from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    this.active = false;
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://f5-run-file') {
          return new F5RunFileView();
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'f5-run-file:execute': () => this.execute()
      }),

      atom.commands.add('atom-workspace', {
        'f5-run-file:toggle': () => this.toggle()
      }),

      // Destroy any io panels when the package is deactivated.
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof F5RunFileView) {
            item.destroy();
          }
        });
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    atom.workspace.toggle('atom://f5-run-file');
  },

  execute() {
    atom.workspace.getPaneItems().forEach(item => {
      if (item instanceof F5RunFileView){
        item.execute();
      }
    });
  }
};
