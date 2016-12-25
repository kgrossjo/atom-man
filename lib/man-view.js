'use babel';

import { Point, TextEditor } from 'atom';
import ManOutputView from './man-output-view';
import ManOutputEditor from './man-output-editor';
const exec = require('child_process').exec;

// Mostly stolen from go-to-line/lib/go-to-line-view.js

export default class ManView {
    
    constructor(serializedState) {
        this.paneItem = null;

        this.miniEditor = new TextEditor({ mini: true });
        this.miniEditor.element.addEventListener('blur', this.close.bind(this));
        this.miniEditor.setPlaceholderText('Enter manual page');
        
        this.message = document.createElement('div');
        this.message.classList.add('message');

        this.element = document.createElement('div');
        this.element.classList.add('man');
        this.element.appendChild(this.miniEditor.element);
        this.element.appendChild(this.message);
        
        this.panel = atom.workspace.addModalPanel({
            item: this,
            visible: false,
        });
        
        atom.commands.add('atom-text-editor', 'man:toggle', () => {
            this.toggle();
            return false;
        });
        atom.commands.add(this.miniEditor.element, 'core:confirm', () => {
            this.confirm();
        });
        atom.commands.add(this.miniEditor.element, 'core:cancel', () => {
            this.close();
        });
    }
    
    toggle() {
        this.panel.isVisible() ? this.close() : this.open();
    }
    
    close() {
        if (! this.panel.isVisible()) return;
        this.miniEditor.setText('');
        this.panel.hide();
        if (this.miniEditor.element.hasFocus()) {
            this.restoreFocus();
        }
    }
    
    confirm() {
        const page = this.miniEditor.getText();
        this.close();
        atom.workspace.open('man://' + page);
    }
    
    storeFocusedElement() {
        this.previouslyFocusedElement = document.activeElement;
        return this.previouslyFocusedElement;
    }
    
    restoreFocus() {
        if (this.previouslyFocusedElement && this.previouslyFocusedElement.parentElement) {
            return this.previouslyFocusedElement.focus();
        }
        atom.views.getView(atom.workspace).focus();
    }
    
    open() {
        if (this.panel.isVisible() || ! atom.workspace.getActiveTextEditor()) {
            return;
        }
        this.storeFocusedElement();
        this.panel.show();
        this.message.textContent = "Enter 'man' arguments here, e.g. 'ls' or '5 crontab'";
        this.miniEditor.element.focus();
    }
    
    // Returns an object that can be retrieved when package is activated
    serialize() {}
    
    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }
    
    setCurrentWord(w) {
        this.miniEditor.setText(w);
        this.miniEditor.selectAll();
    }
    
}
