const { ObjectId } = require('mongodb');

const loginUser = async(req, res) => {
    req.body.email = req.body.username;
    delete req.body.username;
    let user = await cols.users.find(req.body).toArray();
    if (user.length > 0) {
        res.send({ status: 'success', isAdmin: true, roles: { read: true, write: true, update: true } });
    } else {
        user = await cols.contributors.find(req.body).toArray();

        if (user.length > 0) {
            res.send({ status: 'success', isAdmin: false, roles: { read: false, write: false, update: false }, user: user[0] });
        } else {
            res.send({ status: 'failed', isAdmin: false, roles: { read: false, write: false, update: false } });
        }
        // res.redirect('/nav/login?attempt=fail')
    }
}
const getTenses = async(req, res) => {
    const tenses = await cols.tenses.find().toArray();
    res.send(tenses);
}
const addTenses = async(req, res) => {
    req.body.subjectObject = req.body.subjectObject.map(so => {
        so._id = new ObjectId();
        return so;
    })
    const inserted = await cols.tenses.insertOne(req.body);
    if (inserted.insertedCount) {
        res.send('success')
    } else {
        // console.log(inserted);
        res.send('failed');
    }

}
const editTenses = async(req, res) => {
    const _id = new ObjectId(req.body._id);
    delete req.body._id;
    const updated = await cols.tenses.updateOne({ _id }, { $set: req.body });
    if (updated.modifiedCount) {
        res.send('success')
    } else {
        // console.log(inserted);
        res.send('failed');
    }
}
const deleteTenses = async(req, res) => {
    const _id = new ObjectId(req.body._id);
    const deleted = await cols.tenses.deleteOne({ _id });
    if (deleted.deletedCount) {
        res.send('success')
    } else {
        // console.log(inserted);
        res.send('failed');
    }
}

const getVerbs = async(req, res) => {
    if (req.body.verb) {
        req.body.verb = { $regex: req.body.verb }
    }
    const verbs = await cols.verbs.find(req.body).toArray();
    res.send(verbs);
}
const addVerbs = async(req, res) => {
    if (req.body.isContribution) {
        const contribId = new ObjectId(req.body._id);
        const contribUpdated = await cols.contributions.updateOne({ _id: contribId }, { $set: { added: true } });
        delete req.body._id;
        delete req.body.isContribution;
    }
    const inserted = await cols.verbs.insertOne(req.body);
    if (inserted.insertedCount) {
        res.send('success')
    } else {
        // console.log(inserted);
        res.send('failed');
    }
}
const getVerbByName = async(req, res) => {
    const _id = new ObjectId(req.body._id);
    let found = await cols.verbs.find({ _id }).toArray();

    res.send(found);
}

const getVerbByStringName = async(req, res) => {
    const verb = req.body.verb;
    let isNoun = await cols.nouns.find({ noun: verb })
        .collation({ locale: 'en', strength: 2 })
        .toArray();

    if (isNoun.length > 0) {
        console.log({ noun: verb });
        console.log(isNoun);
        res.send(null);
    } else {
        let found = await cols.verbs.find({ verb }).toArray();

        res.send(found);
    }
}

const editVerbs = async(req, res) => {
    const _id = new ObjectId(req.body._id);
    delete req.body._id;
    const updated = await cols.verbs.updateOne({ _id }, { $set: req.body });
    if (updated.modifiedCount) {
        res.send('success')
    } else {
        // console.log(inserted);
        res.send('failed');
    }
}
const deleteVerbs = async(req, res) => {
    const _id = new ObjectId(req.body._id);
    const deleted = await cols.verbs.deleteOne({ _id });
    if (deleted.deletedCount) {
        res.send('success')
    } else {
        // console.log(inserted);
        res.send('failed');
    }
}


const getNouns = async(req, res) => {
    const nouns = await cols.nouns.find().toArray();
    res.send(nouns);
}
const addNouns = async(req, res) => {
    const inserted = await cols.nouns.insertOne(req.body);
    if (inserted.insertedCount) {
        res.send('success')
    } else {
        // console.log(inserted);
        res.send('failed');
    }
}
const getNounByName = async(req, res) => {
    const _id = new ObjectId(req.body._id);
    const found = await cols.nouns.find({ _id }).toArray();

    res.send(found);
}
const editNouns = async(req, res) => {
    const _id = new ObjectId(req.body._id);
    delete req.body._id;
    const updated = await cols.nouns.updateOne({ _id }, { $set: req.body });
    if (updated.modifiedCount) {
        res.send('success')
    } else {
        // console.log(inserted);
        res.send('failed');
    }
}

const deleteNouns = async(req, res) => {
    const _id = new ObjectId(req.body._id);
    const deleted = await cols.nouns.deleteOne({ _id });
    if (deleted.deletedCount) {
        res.send('success')
    } else {
        // console.log(inserted);
        res.send('failed');
    }
}

const addVerbsContrib = async(req, res) => {
    req.body.added = false;
    const inserted = await cols.contributions.insertOne(req.body);
    if (inserted.insertedCount) {
        res.send('success')
    } else {
        // console.log(inserted);
        res.send('failed');
    }
}

const deleteContrib = async(req, res) => {
    const _id = new ObjectId(req.body._id);
    const deleted = await cols.contributions.deleteOne({ _id });
    if (deleted.deletedCount) {
        res.send('success')
    } else {
        // console.log(inserted);
        res.send('failed');
    }
}

const getContrib = async(req, res) => {
    const nouns = await cols.contributions.find().toArray();
    const contributions = await Promise.all(nouns.map(async n => {
        const c = await cols.contributors.find({ email: n.email }).toArray();
        n.isContributor = (c.length) ? true : false;
        return n;
    }));
    res.send(contributions);
}


const addButor = async(req, res) => {
    req.body.added = false;

    req.body.roles.read = JSON.parse(req.body.roles.read);
    req.body.roles.write = JSON.parse(req.body.roles.write);
    req.body.roles.update = JSON.parse(req.body.roles.update);

    const inserted = await cols.contributors.insertOne(req.body);

    if (inserted.insertedCount) {
        res.send('success')
    } else {
        // console.log(inserted);
        res.send('failed');
    }
}

const deleteButor = async(req, res) => {
    const _id = new ObjectId(req.body._id);
    const deleted = await cols.contributors.deleteOne({ _id });
    if (deleted.deletedCount) {
        res.send('success')
    } else {
        // console.log(inserted);
        res.send('failed');
    }
}

const getButor = async(req, res) => {
    const nouns = await cols.contributions.find().toArray();
    let contributions = await Promise.all(
        nouns
        .map(async n => {
            const c = await cols.contributors.find({ email: n.user.email }).toArray();
            if (!(c.length)) {
                return n;
            } else {
                return null;
            }
        })
    );
    contributions = contributions.filter(m => m);

    const contributors = await cols.contributors.find().toArray();

    const forward = {
        registered: contributors,
        unregistered: contributions
    }

    res.send(forward);
}

const editButor = async(req, res) => {
    const _id = new ObjectId(req.body._id);
    delete req.body._id;

    req.body.roles.read = JSON.parse(req.body.roles.read);
    req.body.roles.write = JSON.parse(req.body.roles.write);
    req.body.roles.update = JSON.parse(req.body.roles.update);

    const updated = await cols.contributors.updateOne({ _id }, { $set: req.body });
    if (updated.modifiedCount) {
        res.send('success')
    } else {
        // console.log(inserted);
        res.send('failed');
    }
}

module.exports = {
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
}