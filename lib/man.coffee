exec = require('child_process').exec;
url = require('url');
ManView = require('./man-view');

man = () ->
    uri = "man://editor/ls";
    atom.workspace.open(uri);

man_opener = (uriToOpen) ->
    parsed = url.parse(uriToOpen);
    return if 'man:' != parsed.protocol
    path = parsed.path.substring(1);
    result = new ManView(uri: uriToOpen, filePath: path);
    return result;

module.exports = {
    activate: (state) ->
        atom.workspaceView.command("man:man", man);
        atom.workspace.registerOpener(man_opener);
    ,
    deactivate: () ->
    ,
    serialize: () ->
}
