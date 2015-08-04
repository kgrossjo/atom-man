{$, TextEditorView, View} = require 'atom-space-pen-views'
ManView = require './man-view'

module.exports =
    class ManInputView extends View
        detaching: false
        @content: ->
            @div class: 'command-palette', =>
                @subview 'selectEditor', new TextEditorView(mini: true)

        initialize: ->
            atom.commands.add 'atom-text-editor', 'core:confirm', => @confirm()
            atom.commands.add 'atom-text-editor', 'core:cancel', => @detach()
            @attach()

        toggle: ->
            if @hasParent()
                @detach
            else
                @attach()

        detach: ->
            return unless @hasParent()
            @detaching = true
            selectEditorFocused = @selectEditor.isFocused
            @selectEditor.setText('')
            @panel.destroy()
            super
            @detaching = false

        confirm: ->
            page = @selectEditor.getText()
            uri = "man://editor/#{page}"
            atom.workspace.open(uri)
            @detach()

        attach: ->
            @panel ?= atom.workspace.addModalPanel(item: this)
            @panel.show()
            @selectEditor.focus()
