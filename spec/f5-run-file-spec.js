'use babel';

import F5RunFile from '../lib/f5-run-file';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('F5RunFile', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('f5-run-file');
  });

  describe('when the f5-run-file:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.f5-run-file')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'f5-run-file:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.f5-run-file')).toExist();

        let f5RunFileElement = workspaceElement.querySelector('.f5-run-file');
        expect(f5RunFileElement).toExist();

        let f5RunFilePanel = atom.workspace.panelForItem(f5RunFileElement);
        expect(f5RunFilePanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'f5-run-file:toggle');
        expect(f5RunFilePanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.f5-run-file')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'f5-run-file:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let f5RunFileElement = workspaceElement.querySelector('.f5-run-file');
        expect(f5RunFileElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'f5-run-file:toggle');
        expect(f5RunFileElement).not.toBeVisible();
      });
    });
  });
});
