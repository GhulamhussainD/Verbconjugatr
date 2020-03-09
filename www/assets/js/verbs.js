verbsObj = {
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
    interimsCreatedAdd: [],
    init: () => {
        // this.attachUrduKeyboards();
        verbsObj.retreiveVerbs();
        if (!(this.testWrite())) {
            document.getElementById('add-new-verb-button').remove();
        }
    },
    retreiveTenses: () => {
        $.ajax({
                method: "POST",
                url: '/gettenses',
                data: {}
            })
            .done(e => {
                // console.log(e);
                const push = [];
                e.forEach(
                    t => {
                        const { name } = t;
                        t.subjectObject.forEach(so => {
                            push.push({
                                name,
                                subject: so.subject,
                                object: so.object,
                                form: String('')
                            })
                        })
                    }
                );
                verbsObj.tenses = new Vue({
                    el: '#verbsAddForm',
                    data: {
                        tenses: push
                    }
                })

                // try {
                //     verbsObj.tensesEdit = new Vue({
                //         el: '#verbsEditForm',
                //         data: {
                //             tenses: JSON.parse(localStorage.data)
                //         }
                //     })
                // } catch (exc) {
                //     console.warn(exc);
                // }
                // nouns.editList = new Vue({
                //     el: '#nounsEditForm',
                //     data: {
                //         _id,
                //         noun,
                //         meaning,
                //         romanMeaning
                //     }
                // });
                // try {
                // } catch (exc) {}

                this.setAttr();
                const check = document.querySelector('.modal-backdrop.fade.show');
                if (check) {
                    check.remove();
                }
            });

    },
    retreiveVerbs: () => {
        console.log();
        const verb = document.getElementById('verb-search-bar').value;
        const useData = (verb === '' || !verb) ? {} : { verb }

        $.ajax({
                method: "POST",
                url: '/getverbs',
                data: useData
            })
            .done(e => {
                if (verbsObj.verbs) {
                    verbsObj.verbs.verbs = [];
                    setTimeout(() => {
                        verbsObj.verbs.verbs = e;

                        this.setAttr();
                        if (verbsObj.reload) {
                            verbsObj.reload = false;
                            navigateTo('Verbs');
                        }
                        const check = document.querySelector('.modal-backdrop.fade.show');
                        if (check) {
                            check.remove();
                        }

                        verbsObj.retreiveTenses();
                    }, 100)
                } else {
                    verbsObj.verbs = new Vue({
                        el: '#verbs-list',
                        data: {
                            verbs: e
                        }
                    })
                    this.setAttr();
                    if (verbsObj.reload) {
                        verbsObj.reload = false;
                        navigateTo('Verbs');
                    }
                    const check = document.querySelector('.modal-backdrop.fade.show');
                    if (check) {
                        check.remove();
                    }

                    verbsObj.retreiveTenses();
                }
            });

        verbsObj.addList = new Vue({
            el: '#tensesAddForm',
            data: {
                subjectObject: verbsObj.interim
            }
        });
    },
    setAttr: () => {
        buttons = Array.from(document.querySelectorAll('button'));
        iTags = Array.from(document.querySelectorAll('i'));

        buttons.forEach(b => {
            mdc.ripple.MDCRipple.attachTo(b);
        });

        iTags.forEach(b => {
            mdc.ripple.MDCRipple.attachTo(b);
        });
    },
    saveVerbs: () => {
        const el = document.getElementById('Verb');
        if (!$('#verbsAddForm').valid()) {
            alert('Please input all of the previous fields');
        } else if (el.value.substr(-1) != 'گ') {
            alert('The entered Verb is not correct');
        } else {
            const timestamp = new Date();

            const subjects = Array.from(document.getElementsByClassName('add-verb-tense-input-subject'));
            const forms = Array.from(document.getElementsByClassName('add-verb-tense-input-form'));
            const objects = Array.from(document.getElementsByClassName('add-verb-tense-input-object'));
            const form = {
                    verb: document.getElementById('Verb').value,
                    meaning: document.getElementById('Meaning').value,
                    romanMeaning: document.getElementById('RomanMeaning').value,
                    type: document.getElementById('Type').value,
                    timestamp,
                    forms: forms
                        .map((v, i) => {
                            // verbsObj.tenses.tenses.__ob__.value
                            return {
                                name: verbsObj.tenses.tenses.__ob__.value[i].name,
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
                        hideModal('AddVerb');
                        alert('Verb saved');
                        verbsObj.interimsCreatedAdd = [];

                    }
                });

        }
    },
    testIC: (t) => {
        if (verbsObj.interimsCreated.includes(t.name)) {
            return false;
        } else {
            verbsObj.interimsCreated.push(t.name)
            return true;
        }
    },
    testICAdd: (t) => {
        if (verbsObj.interimsCreatedAdd.includes(t.name)) {
            return false;
        } else {
            verbsObj.interimsCreatedAdd.push(t.name)
            return true;
        }
    },
    renderForEdit: () => {

        verbsObj.interimEdit = JSON.parse(localStorage.data);
        const { _id, noun, meaning, romanMeaning } = verbsObj.interimEdit;

        verbsObj.tensesEdit = new Vue({
                el: '#verbsEditForm',
                data: {
                    tenses: JSON.parse(localStorage.data)
                }
            })
            // nouns.editList = new Vue({
            //     el: '#nounsEditForm',
            //     data: {
            //         _id,
            //         noun,
            //         meaning,
            //         romanMeaning
            //     }
            // });
            // try {
            // } catch (exc) {}
    },
    editVerbs: () => {
        console.log('here');
        if (!$('#verbsEditForm').valid()) {
            alert('Please input all of the previous fields');
        } else {
            const timestamp = new Date();
            const subjects = Array.from(document.getElementsByClassName('edit-verb-tense-input-subject'));
            const forms = Array.from(document.getElementsByClassName('edit-verb-tense-input-form'));
            const objects = Array.from(document.getElementsByClassName('edit-verb-tense-input-object'));
            const form = {
                _id: JSON.parse(localStorage.data)._id,
                verb: document.getElementById('edit-Verb').value,
                meaning: document.getElementById('edit-Meaning').value,
                romanMeaning: document.getElementById('edit-RomanMeaning').value,
                type: document.getElementById('edit-Type').value,
                timestamp,
                forms:
                // verbsObj.tensesEdit.tenses.__ob__.value.forms
                    forms
                    .map((v, i) => {
                        return {
                            name: verbsObj.tensesEdit.tenses.__ob__.value.forms[i].name,
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
                        hideModal('EditVerb');
                        alert('Verb updated');
                        verbsObj.interimsCreated = [];
                    }
                });

        }
    },
    deleteVerb: () => {
        const { _id } = JSON.parse(localStorage.data);
        $.ajax({
                method: "POST",
                url: '/deleteverbs',
                data: { _id }
            })
            .done(e => {
                if (e === 'failed') {
                    alert('Some error occured');
                } else {
                    hideModal('DeleteVerb');
                    alert('Verb deleted');
                }
            });
    },
    setToOthers: (inp) => {
        // verbsObj.tenses.tenses = verbsObj.tenses.tenses.map(t => {
        //     t.form = inp.value;
        //     const forms = Array.from(document.getElementsByClassName('edit-verb-tense-input-form'));
        //     forms.forEach(f => {
        //         f.value = inp.value;
        //     });
        //     return t;
        // })
    },
    filter: (button) => {
        verbsObj.retreiveVerbs();
    }
}

verbsObj.init();