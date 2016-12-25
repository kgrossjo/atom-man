'use babel';

import {TextEditor} from 'atom';
const exec = require('child_process').exec;

export default class ManOutputEditor {
    
    constructor(filePath) {
        this.filePath = filePath;
        
        console.log('Kilroy was here');
        this.element = document.createElement('div');
        this.element.classList.add('man-output-editor');
        this.element.setAttribute('tabindex', -2);
        
        this.editor = atom.workspace.buildTextEditor();
        this.content = this.editor.element;
        this.content.setAttribute('tabindex', -3);
        this.element.appendChild(this.content);
        this.editor.setGrammar(atom.grammars.grammarForScopeName("text.manpage"));
        atom.commands.add(this.element, 'core:move-down', () => {
            this.scrollDown();
        });
        atom.commands.add(this.element, 'core:move-up', () => {
            this.scrollUp();
        });
        
        console.log('calling man');
        const wcmd = `MANPAGER=cat man ${ this.filePath }`
        exec(wcmd, (error, stdout, stderr) => {
            if (this.handleError(error, stderr)) {
                return;
            }
            let t = stdout.replace(/(\w)[\b]\1/g, "\u0001$1\u0002");
            t = t.replace(/(\w)[\b]_|_[\b](\w)/g, "\u0003$1$2\u0004");
            t = t.replace(/\u0002\u0001/g, "");
            t = t.replace(/\u0004\u0003/g, "");
            this.editor.setText(t);
            this.editor.displayBuffer.setHeight(this.element.clientHeight);
            this.content.focus();
            this.editor.moveToTop();
            this.editor.setSoftWrapped(false);
            console.log('done calling man');
        });
        console.log('ManOutputEditor constructor done');
    }
    
    handleError(error, stderr) {
        console.log('handling errors');
        let result = false;
        if (error && stderr) {
            result = `ERROR: ${error}\n${stderr}`;
        } else if (error) {
            result = `ERROR: ${error}`;
        } else if (stderr) {
            result = stderr;
        }
        if (result) {
            atom.notifications.addError(result, {dismissable: true});
        }
        return result;
    }
    
    scrollDown() {
        const scrollTop = this.content.scrollTop;
        let lastPos = null;
        let pos = this.editor.getCursorBufferPosition();
        while (scrollTop == this.content.scrollTop && pos != lastPos) {
            lastPos = pos;
            this.editor.moveDown();
            pos = this.editor.getCursorBufferPosition();
        }
    }
    
    scrollUp() {
        const scrollTop = this.content.scrollTop;
        let lastPos = null;
        let pos = this.editor.getCursorBufferPosition();
        while (scrollTop == this.content.scrollTop && pos != lastPos) {
            lastPos = pos;
            this.editor.moveUp();
            pos = this.editor.getCursorBufferPosition();
        }
    }
    
    getTitle() {
        return `Man: ${this.filePath}`;
    }
}