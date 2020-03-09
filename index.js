const {
    app
} = require('./app');
var server = require('http').Server(app);
const dbConf = require('./imports/db');
const fs = require('fs');
const mongoClient = require('mongodb').MongoClient;

const usePort = 3000;

importedModules = [];
db = null;
cols = {
    users: null,
    tenses: null,
    verbs: null,
    nouns: null,
    contributions: null,
    contributors: null
};

(async () => {
    try {
        const $e = await mongoClient.connect(dbConf.uri, dbConf.options);
        if ($e) console.log('db connected');

        db = $e.db('verbconjugator');

        Object.keys(cols).forEach(k => {
            cols[k] = db.collection(k);
        })

        const files = fs.readdirSync('modules');

        files.forEach((f, i) => {
            importedModules[i] = require(`./modules/${f}`).module(app, db);
            const parts = f.split('.');
            parts.splice(-1);
            parts.join('.');
            console.log(`Imported ${parts}`);
        })

        server.listen(usePort, function () {
            console.log(`Listening at port ${usePort}`);
        });
    } catch (exc) {
        throw new Error(exc);
    }
})();