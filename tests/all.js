const expect = require('expect');
const fs = require('fs');
const path = require('path');
const Slate = require('slate');
const readMetadata = require('read-metadata');

const EditList = require('../lib');

describe('slate-edit-code', function() {
    const tests = fs.readdirSync(__dirname);
    const plugin = EditList();

    global.window = { navigator: { platform: 'Mac' }};

    tests.forEach(function(test) {
        if (test[0] === '.' || path.extname(test).length > 0) return;

        it(test, function() {
            const dir = path.resolve(__dirname, test);
            const input = readMetadata.sync(path.resolve(dir, 'input.yaml'));
            const expected = readMetadata.sync(path.resolve(dir, 'expected.yaml'));
            const runChange = require(path.resolve(dir, 'change.js'));

            const stateInput = Slate.State.fromJSON(input);

            const newChange = runChange(plugin, stateInput.change());

            const newDocJSon = newChange.state.toJSON();

            expect(newDocJSon).toEqual(Slate.State.fromJSON(expected).toJSON());
        });
    });
});
