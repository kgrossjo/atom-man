'use babel';
const exec = require('child_process').exec;

export default class ManOutputView {
    
    constructor(filePath) {
        this.filePath = filePath;
        this.scrollIncrement = atom.config.get('editor.fontSize') * atom.config.get('editor.lineHeight');

        this.element = document.createElement('div');
        this.element.classList.add('man-output');
        this.element.classList.add('native-key-bindings');
        this.element.setAttribute('tabindex', -1);
        
        this.error = document.createElement('div');
        this.error.classList.add('man-view-error');
        this.element.appendChild(this.error);
        
        this.content = document.createElement('div');
        this.content.classList.add('man-content');
        this.element.appendChild(this.content);
        
        atom.commands.add(this.element, 'core:move-down', () => {
            this.scrollDown();
        });
        atom.commands.add(this.element, 'core:move-up', () => {
            this.scrollUp();
        });

        const wcmd = `man -w ${ this.filePath }`

        exec(wcmd, (error, stdout, stderr) => {
            if (this.handleError(error, stderr)) {
                return;
            }
            const file = stdout.replace("\n", "");
            let cmd;
            if (file.match(/\.gz$/)) {
                cmd = `gunzip -c "${file}" | groff -mandoc -T html`;
            } else {
                cmd = `groff -mandoc -T html "${file}"`;
            }
            exec(cmd, (error, stdout, stderr) => {
                if (this.handleError(error, stderr)) {
                    return;
                }
                
                const fudged = stdout.replace(/^[^]*<body>/i, '<div class="manpage-body">').replace(/<\/body>[^]*$/, '</div>');
                this.content.innerHTML = fudged;
                this.content.style.fontFamily = atom.config.get('editor.fontFamily');
                this.content.style.fontSize = atom.config.get('editor.fontSize');
                this.content.style.lineHeight = atom.config.get('editor.lineHeight');
            });
        });
    }
    
    handleError(error, stderr) {
        let result = false;
        if (error) {
            const h = document.createElement('h2');
            h.textContent = 'Error';
            this.error.appendChild(h);
            const p = document.createElement('p');
            p.textContent = `Got an error: ${error}`;
            this.error.appendChild(p);
            result = true;
        }
        if (stderr) {
            const pre = document.createElement('pre');
            pre.textContent = stderr;
            this.error.appendChild(pre);
            result = true;
        }
        return result;
    }
    
    scrollUp() {
        this.element.scrollTop -= this.scrollIncrement;
    }
    
    scrollDown() {
        this.element.scrollTop += this.scrollIncrement;
    }
    
    getTitle() {
        return `Man: ${this.filePath}`;
    }
}