'use babel';

import ManView from './man-view';
import man_opener from './man-opener';
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
        
        atom.workspace.addOpener(man_opener);
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
        const curEditor = ( 
            atom.workspace.getActiveTextEditor()
            || ( document.activeElement 
                && document.activeElement.getWordUnderCursor
                && document.activeElement ) 
            || ( document.activeElement
                && document.activeElement.getModel
                && document.activeElement.getModel().getWordUnderCursor
                && document.activeElement.getModel() ));
        if (curEditor) {
            const curWord = curEditor.getWordUnderCursor({
                includeNonWordCharacters: true});
            if (curWord) {
                this.manView.setCurrentWord(curWord);
            }
        }
        this.manView.open();
    },

};
