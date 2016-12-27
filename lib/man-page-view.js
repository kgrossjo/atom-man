'use babel';

import {Point, TextEditor} from 'atom';
const exec = require('child_process').exec;

export default class ManPageView {
    
    constructor(filePath) {
        this.filePath = filePath;
        
        console.log('Kilroy was here');
        this.element = document.createElement('div');
        this.element.classList.add('man-page');
        this.element.setAttribute('tabindex', -2);
        
        this.editor = atom.workspace.buildTextEditor();
        this.content = this.editor.element;
        this.content.setAttribute('tabindex', -3);
        this.element.appendChild(this.content);
        this.editor.setGrammar(atom.grammars.grammarForScopeName("text.manpage"));
        atom.commands.add('atom-text-editor', 'man:page-down', () => {
            this.pageDown();
        });
        atom.commands.add('atom-text-editor', 'man:page-up', () => {
            this.pageUp();
        });
        atom.commands.add('atom-text-editor', 'man:scroll-down', () => {
            this.scrollDown();
        });
        atom.commands.add('atom-text-editor', 'man:scroll-up', () => {
            this.scrollUp();
        });
        
        console.log('calling man');
        const wcmd = `MANPAGER=cat man ${ this.filePath }`
        exec(wcmd, (error, stdout, stderr) => {
            if (this.handleError(error, stderr)) {
                return;
            }
            let t = stdout.replace(/(.)[\b]\1/g, "\u0001$1\u0002");
            t = t.replace(/(.)[\b]_|_[\b](.)/g, "\u0003$1$2\u0004");
            t = t.replace(/\u0002\u0001/g, "");
            t = t.replace(/\u0004\u0003/g, "");
            this.editor.setText(t);
            this.editor.displayBuffer.setHeight(this.element.clientHeight);
            this.content.focus();
            this.editor.moveToTop();
            this.editor.setSoftWrapped(false);
            console.log('done calling man');
        });
        console.log('ManPageView constructor done');
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
    
    pageDown() {
        const buffer = this.editor.displayBuffer;
        const pageSize = buffer.rowsPerPage;
        this.editor.moveDown(pageSize-2);
    }
    
    pageUp() {
        const buffer = this.editor.displayBuffer;
        const pageSize = buffer.rowsPerPage;
        this.editor.moveUp(pageSize-2);
    }
    
    scrollDown() {
        const buffer = this.editor.displayBuffer;
        const pageSize = buffer.rowsPerPage;
        const firstRow = buffer.firstVisibleScreenRow;
        const position = new Point(firstRow + pageSize, 0);
        this.editor.setCursorBufferPosition(position);
        this.editor.scrollToBufferPosition(position);
    }
    
    scrollUp() {
        const buffer = this.editor.displayBuffer;
        const pageSize = buffer.rowsPerPage;
        const firstRow = buffer.firstVisibleScreenRow;
        if (0 == firstRow) return;
        const position = new Point(firstRow - 1, 0);
        this.editor.setCursorBufferPosition(position);
        this.editor.scrollToBufferPosition(position);
    }
    
    getTitle() {
        return `Man: ${this.filePath}`;
    }
}