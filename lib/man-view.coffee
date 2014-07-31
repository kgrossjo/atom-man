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
                if @handleError(error, stderr)
                    return
                file = stdout.replace("\n", "")
                if file.match(/\.gz$/)
                    cmd = "gunzip -c '#{file}' | groff -mandoc -T html"
                else
                    cmd = "groff -mandoc -T html '#{file}'"
                exec cmd, (error, stdout, stderr) =>
                    if @handleError(error, stderr)
                        return
                    fudged = stdout.replace('<body>', '<div class="manpage-body">').replace('</body>','</div>');
                    dom = $(fudged).filter('div.manpage-body')
                    dom.css('fontFamily', atom.config.get('editor.fontFamily'))
                    dom.css('fontSize', atom.config.get('editor.fontSize'))
                    dom.css('lineHeight', atom.config.get('editor.lineHeight'))
                    @manViewContent.append(dom)

        handleError: (error, stderr) =>
            result = false
            if error
                @manViewError.append($("<h2>ERROR</h2>"))
                @manViewError.append($("<p>Got an error: #{error}</p>"))
                result = true
            if stderr
                @manViewError.append($("<h3>Standard error output:</h3><pre>#{stderr}</pre>"));
                result = true
            return result

        serialize: ->
            deserializer: 'ManView'
            filePath: @getPath()

        getPath: () ->
            @filePath

        getTitle: () ->
            "Man: #{@filePath}"
