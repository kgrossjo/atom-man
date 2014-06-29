exec = require('child_process').exec;
url = require('url');
ManView = require('./man-view');
ManInputView = require './man-input-view'

man_opener = (uriToOpen) ->
    parsed = url.parse(uriToOpen);
    return if 'man:' != parsed.protocol
    path = parsed.path.substring(1);
    result = new ManView(uri: uriToOpen, filePath: path);
    return result;

module.exports = 
    manInputView: null

    activate: (state) ->
        atom.workspace.registerOpener(man_opener);
        atom.workspaceView.command 'man:man', @man
    ,
    deactivate: () ->
        @manInputView.destroy()
    ,
    serialize: () ->
    ,
    man: () ->
        @manInputView = new ManInputView()
