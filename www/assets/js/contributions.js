contrib = {
    data: [],
    reload: false,
    addList: null,
    editList: null,
    interimEdit: null,
    tensesList: [],
    data: [],
    verbs: null,
    tenses: null,
    tensesEdit: null,
    interimsCreated: [],
    init: () => {
        contrib.getContributions();
    },
    getContributions: () => {
        $.ajax({
                method: "POST",
                url: '/getverbscontrib',
                data: {}
            })
            .done(e => {
                contrib.verbs = new Vue({
                    el: '#contrib-list',
                    data: {
                        verbs: e
                    }
                })
                this.setAttr();
                if (contrib.reload) {
                    contrib.reload = false;
                    navigateTo('Contributions');
                }
                const check = document.querySelector('.modal-backdrop.fade.show');
                if (check) {
                    check.remove();
                }

                // contrib.retreiveTenses();
            });

        // contrib.addList = new Vue({
        //     el: '#tensesAddForm',
        //     data: {
        //         subjectObject: contrib.interim
        //     }
        // });
    },
    testIC: (t) => {
        if (contrib.interimsCreated.includes(t.name)) {
            return false;
        } else {
            contrib.interimsCreated.push(t.name)
            return true;
        }
    },
    renderForEdit: () => {
        contrib.interimEdit = JSON.parse(localStorage.data);

        contrib.tensesEdit = null;

        contrib.tensesEdit = new Vue({
            el: '#contribViewForm',
            data: {
                verbs: contrib.interimEdit
            }
        })
    },
    addVerb: () => {
        if (!$('#contribViewForm').valid()) {
            alert('Please input all of the previous fields');
        } else {
            const timestamp = new Date();

            const subjects = Array.from(document.getElementsByClassName('contrib-add-verb-tense-input-subject'));
            const forms = Array.from(document.getElementsByClassName('contrib-add-verb-tense-input-form'));
            const objects = Array.from(document.getElementsByClassName('contrib-add-verb-tense-input-object'));
            const form = {
                    isContribution: true,
                    _id: JSON.parse(localStorage.data)._id,
                    verb: document.getElementById('contrib-Verb').value,
                    meaning: document.getElementById('contrib-Meaning').value,
                    romanMeaning: document.getElementById('contrib-RomanMeaning').value,
                    type: document.getElementById('contrib-Type').value,
                    timestamp,
                    forms: forms
                        .map((v, i) => {
                            // verbsObj.tenses.tenses.__ob__.value
                            return {
                                // contrib.tenses.tenses.__ob__.value[i]
                                name: contrib.tensesEdit.verbs.verb.forms[i].name,
                                subject: subjects[i].value,
                                object: objects[i].value,
                                form: v.value
                            }
                        })
                }
                // console.log(form);
                // return false
            $.ajax({
                    method: "POST",
                    url: '/addverbs',
                    data: form
                })
                .done(e => {
                    if (e === 'failed') {
                        alert('Some error occured');
                    } else {
                        hideModal('ViewContrib');
                        alert('Verb saved');
                        contrib.interimsCreated = [];
                        this.navigateTo('Contributions');
                        if (JSON.parse(localStorage.data).isContributor === false) {
                            contrib.requestUserAdd();
                        }
                    }
                });

        }
    },
    deleteContrib: () => {
        const { _id } = JSON.parse(localStorage.data);
        $.ajax({
                method: "POST",
                url: '/deleteverbscontrib',
                data: { _id }
            })
            .done(e => {
                if (e === 'failed') {
                    alert('Some error occured');
                } else {
                    hideModal('DeleteContrib');
                    alert('Contribution Deleted');
                    butor.interimsCreated = [];
                    this.navigateTo('Contributions');
                }
            });
    },
    requestUserAdd: () => {
        alert('The user has been added to probable contributors list');
    }
}

contrib.init();