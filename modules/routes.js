const {
    loginUser,
    getVerbs,
    getTenses,
    addTenses,
    editTenses,
    deleteTenses,
    addVerbs,
    getVerbByName,
    editVerbs,
    deleteVerbs,
    addNouns,
    getNounByName,
    editNouns,
    deleteNouns,
    getNouns,
    getVerbByStringName,
    addVerbsContrib,
    deleteContrib,
    getContrib,
    addButor,
    deleteButor,
    getButor,
    editButor,
} = require('../imports/controllers');


module.exports.module = (app, db) => {
    app.post('/login', loginUser);
    app.post('/getverbs', getVerbs);
    app.post('/gettenses', getTenses);
    app.post('/addtenses', addTenses);
    app.post('/edittenses', editTenses);
    app.post('/deletetenses', deleteTenses);
    app.post('/addverbs', addVerbs);
    app.post('/getverbbyname', getVerbByName);
    app.post('/editverbs', editVerbs);
    app.post('/deleteverbs', deleteVerbs);
    app.post('/addnouns', addNouns);
    app.post('/getnounbyname', getNounByName);
    app.post('/editnouns', editNouns);
    app.post('/deletenouns', deleteNouns);
    app.post('/getnouns', getNouns);
    app.post('/getverbbystringname', getVerbByStringName);
    app.post('/addverbscontrib', addVerbsContrib);
    app.post('/deleteverbscontrib', deleteContrib);
    app.post('/getverbscontrib', getContrib);
    app.post('/addbutor', addButor);
    app.post('/deletebutor', deleteButor);
    app.post('/getbutor', getButor);
    app.post('/editbutor', editButor);
}