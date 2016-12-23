'use babel';

import ManView from './man-view';
import ManOutputView from './man-output-view';
import { CompositeDisposable } from 'atom';
import * as url from 'url';

export default {

    manView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {
        this.manView = new ManView(state.manViewState);

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'man:man': () => this.man()
        }));
    },

    deactivate() {
        this.subscriptions.dispose();
        this.manView.destroy();
    },

    serialize() {
        return {
            manViewState: this.manView.serialize()
        };
    },
  
    man() {
        const curEditor = atom.workspace.getActiveTextEditor();
        if (curEditor) {
            const curWord = curEditor.getWordUnderCursor();
            if (curWord) {
                this.manView.setCurrentWord(curWord);
            }
        }
        this.manView.open();
    },

};
