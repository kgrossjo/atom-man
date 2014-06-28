{$, ScrollView} = require 'atom'
exec = require('child_process').exec;

module.exports =
    class ManView extends ScrollView

        @deserialize: (state) ->
            new ManView(state)

        @content: ->
            @div class: 'man-view native-key-bindings', tabindex: -1, =>
                @div outlet: "manViewContent"

        constructor: ({@filePath, @uri}) ->
            super

        initialize: ->
            super
            exec 'man -w ls', (error, stdout, stderr) =>
                file = stdout.replace("\n", "")
                exec "groff -mandoc -T html '#{file}'", (error, stdout, stderr) =>
                    fudged = stdout.replace('<body>', '<div class="manpage-body">').replace('</body>','</div>');
                    dom = $(fudged).filter('div.manpage-body')
                    @manViewContent.append(dom)

        serialize: ->
            deserializer: 'ManView'
            filePath: @getPath()

        getPath: () ->
            @filePath

        getTitle: () ->
            "Man: #{@filePath}"
