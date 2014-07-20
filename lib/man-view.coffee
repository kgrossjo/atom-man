{$, ScrollView} = require 'atom'
exec = require('child_process').exec;

module.exports =
    class ManView extends ScrollView

        @deserialize: (state) ->
            new ManView(state)

        @content: ->
            @div class: 'man-view native-key-bindings', tabindex: -1, =>
                @div class: 'man-view-error', outlet: "manViewError"
                @div outlet: "manViewContent"

        constructor: ({@filePath, @uri}) ->
            super
            wcmd = "man -w #{@filePath}"
            exec wcmd, (error, stdout, stderr) =>
                if error
                    console.error error
                if stderr
                    console.error stderr
                file = stdout.replace("\n", "")
                if file.match(/\.gz$/)
                    cmd = "gzcat '#{file}' | groff -mandoc -T html"
                else
                    cmd = "groff -mandoc -T html '#{file}'"
                exec cmd, (error, stdout, stderr) =>
                    if error
                        console.error error
                    if stderr
                        console.error stderr
                    fudged = stdout.replace('<body>', '<div class="manpage-body">').replace('</body>','</div>');
                    dom = $(fudged).filter('div.manpage-body')
                    dom.css('fontFamily', atom.config.get('editor.fontFamily'))
                    dom.css('fontSize', atom.config.get('editor.fontSize'))
                    dom.css('lineHeight', atom.config.get('editor.lineHeight'))
                    @manViewContent.append(dom)

        serialize: ->
            deserializer: 'ManView'
            filePath: @getPath()

        getPath: () ->
            @filePath

        getTitle: () ->
            "Man: #{@filePath}"
