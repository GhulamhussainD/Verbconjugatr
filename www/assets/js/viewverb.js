openedExam = '';

vv = {
    data: [],
    reload: false,
    addList: null,
    editList: null,
    tensesList: [],
    data: [],
    tables: {},
    verbs: null,
    tenses: null,
    interimEdit: null,
    tensesEdit: null,
    interimsCreated: [],
    init: () => {
        // this.attachUrduKeyboards();
        vv.setAttr();
        vv.retreiveVerbs();
    },
    getParams: () => {
        return location.search.replace('?', '')
            .split('&')
            .map(ps => ps.split('='))
            .forEach(p => o[p[0]] = p[1]);
    },
    setAttr: () => {
        this.setAttr();
    },
    retreiveTenses: () => {
        // $.ajax({
        //         method: "POST",
        //         url: '/gettenses',
        //         data: {}
        //     })
        //     .done(e => {
        //         console.log(e);
        //         vv.tenses = new Vue({
        //             el: '#verbs-table',
        //             data: {
        //                 tenses: e
        //             }
        //         })
        //         this.setAttr();
        //         if (vv.reload) {
        //             vv.reload = false;
        //             navigateTo('Verbs');
        //         }
        //         const check = document.querySelector('.modal-backdrop.fade.show');
        //         if (check) {
        //             check.remove();
        //         }
        //     });

        // tensesObj.addList = new Vue({
        //     el: '#tensesAddForm',
        //     data: {
        //         subjectObject: tensesObj.interim
        //     }
        // });
    },
    retreiveVerbs: () => {
        openedExam = JSON.parse(localStorage.data).verb;
        $.ajax({
                method: "POST",
                url: '/getverbbyname',
                data: JSON.parse(localStorage.data)
            })
            .done(e => {

                if (!e.length) {
                    alert('Unable to reach server');
                } else {

                    e[0].forms.forEach(f => {
                        vv.tables[f.name] = (vv.tables[f.name]) ? vv.tables[f.name] : [];
                        vv.tables[f.name].push(f);
                    })

                    vv.verbs = new Vue({
                        el: '#verbs-table',
                        data: {
                            tables: Object.keys(vv.tables),
                            values: Object.values(vv.tables)
                        }
                    })

                    this.setAttr();
                    if (vv.reload) {
                        vv.reload = false;
                        navigateTo('Verbs');
                    }
                    const check = document.querySelector('.modal-backdrop.fade.show');
                    if (check) {
                        check.remove();
                    }

                    // vv.retreiveTenses();

                }

            });

        vv.addList = new Vue({
            el: '#tensesAddForm',
            data: {
                subjectObject: vv.interim
            }
        });
    },
    renderForEdit: () => {

        vv.interimEdit = JSON.parse(localStorage.data);
        const { _id, noun, meaning, romanMeaning } = vv.interimEdit;

        vv.tensesEdit = new Vue({
            el: '#verbsEditFormVV',
            data: {
                tenses: JSON.parse(localStorage.data)
            }
        })
    },
    editVerbs: () => {
        console.log('here');
        if (!$('#verbsEditFormVV').valid()) {
            alert('Please input all of the previous fields');
        } else {
            const timestamp = new Date();
            const subjects = Array.from(document.getElementsByClassName('vv-edit-verb-tense-input-subject'));
            const forms = Array.from(document.getElementsByClassName('vv-edit-verb-tense-input-form'));
            const objects = Array.from(document.getElementsByClassName('vv-edit-verb-tense-input-object'));
            const form = {
                _id: JSON.parse(localStorage.data)._id,
                verb: document.getElementById('vv-edit-Verb').value,
                meaning: document.getElementById('vv-edit-Meaning').value,
                romanMeaning: document.getElementById('vv-edit-RomanMeaning').value,
                type: document.getElementById('vv-edit-Type').value,
                timestamp,
                forms:
                // vv.tensesEdit.tenses.__ob__.value.forms
                    forms
                    .map((v, i) => {
                        return {
                            name: vv.tensesEdit.tenses.forms[i].name,
                            subject: subjects[i].value,
                            object: objects[i].value,
                            form: v.value
                        }
                    })
            }
            $.ajax({
                    method: "POST",
                    url: '/editverbs',
                    data: form
                })
                .done(e => {
                    if (e === 'failed') {
                        alert('Some error occured');
                    } else {
                        hideModal('EditVerbVV');
                        alert('Verb updated');
                        this.navigateTo('ViewVerb');
                        vv.interimsCreated = [];
                    }
                });

        }
    },
    testIC: (t) => {
        if (vv.interimsCreated.includes(t.name)) {
            return false;
        } else {
            vv.interimsCreated.push(t.name)
            return true;
        }
    },
}

vv.init();