'use babel';

import ManPageView from './man-page-view';
const exec = require('child_process').exec;

export default function man_opener(uri) {
    const uri_matches = uri.match('^man://(.*)$');
    if (! uri_matches) return;
    const page = uri_matches[1];
    const result = new ManPageView(page);
    return result;
}