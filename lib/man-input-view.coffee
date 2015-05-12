{$, TextEditorView, View} = require 'atom-space-pen-views'
ManView = require './man-view'

module.exports =
    class ManInputView extends View
        detaching: false
        @content: ->
            @div class: 'overlay man-view-input from-top mini', =>
                @subview 'selectEditor', new TextEditorView(mini: true)

        initialize: ->
            @on 'core:confirm', => @confirm()
            @on 'core:cancel', => @detach()
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
            super
            @detaching = false

        confirm: ->
            page = @selectEditor.getText()
            uri = "man://editor/#{page}"
            atom.workspace.open(uri)
            @detach()

        attach: ->
            atom.workspaceView.append(this)
            @selectEditor.focus()
