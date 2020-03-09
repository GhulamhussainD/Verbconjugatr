tensesObj = {
    interim: [{
        subject: '',
        object: ''
    }],
    interimEdit: [],
    addList: null,
    editList: null,
    data: [],
    tenses: null,
    reload: false,
    init: () => {
        // this.attachUrduKeyboards();
        tensesObj.retreiveTenses();
        if (!(this.testWrite())) {
            document.getElementById('add-new-tense-button').remove();
        }
    },
    retreiveTenses: () => {
        $.ajax({
                method: "POST",
                url: '/gettenses',
                data: {}
            })
            .done(e => {
                tensesObj.tenses = new Vue({
                    el: '#tenses-list',
                    data: {
                        tenses: e
                    }
                })
                this.setAttr();
                if (tensesObj.reload) {
                    tensesObj.reload = false;
                    navigateTo('Tenses');
                }
                const check = document.querySelector('.modal-backdrop.fade.show');
                if (check) {
                    check.remove();
                }
            });

        tensesObj.addList = new Vue({
            el: '#tensesAddForm',
            data: {
                subjectObject: tensesObj.interim
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
    addTenseRow: () => {
        window.event.preventDefault();
        if (!$('#tensesAddForm').valid()) {
            alert('Please input all of the previous fields');
        } else {
            tensesObj.interim.push({
                subject: '',
                object: ''
            });
        }
        return false;
    },
    removeTenseRow: () => {
        window.event.preventDefault();
        if (tensesObj.interim.length > 1) {
            tensesObj.interim.splice(-1, 1);
        }
        return false;
    },
    saveTenses: () => {
        if (!$('#tensesAddForm').valid()) {
            alert('Please input all of the previous fields');
        } else {
            const timestamp = new Date();
            const form = {
                name: document.getElementById('Name').value,
                timestamp,
                subjectObject: (() => {
                    const s = Array.from(document.getElementsByClassName('add-subjects')).map(sub => sub.value);
                    const o = Array.from(document.getElementsByClassName('add-objects')).map(obj => obj.value);
                    return s.map((sub, i) => {
                        return { subject: sub, object: o[i], timestamp };
                    })
                })()
            }
            $.ajax({
                    method: "POST",
                    url: '/addtenses',
                    data: form
                })
                .done(e => {
                    if (e === 'failed') {
                        alert('Some error occured');
                    } else {
                        hideModal('AddTense');
                        alert('Tense saved');
                    }
                });

        }
    },
    renderForEdit: () => {
        tensesObj.interimEdit = JSON.parse(localStorage.data);
        const { _id, name, subjectObject, timestamp } = tensesObj.interimEdit;

        tensesObj.editList = new Vue({
            el: '#tensesViewForm',
            data: {
                _id,
                name,
                subjectObject,
                timestamp
            }
        });
    },
    addTenseEditRow: () => {
        window.event.preventDefault();
        if (!$('#tensesViewForm').valid()) {
            alert('Please input all of the previous fields');
        } else {
            tensesObj.interimEdit.subjectObject.push({
                subject: '',
                object: ''
            });
        }
        return false;
    },
    editTenses: () => {
        if (!$('#tensesViewForm').valid()) {
            alert('Please input all of the previous fields');
        } else {
            const timestamp = new Date();
            const _id = tensesObj.interimEdit._id;
            const {
                name,
                subjectObject
                // ,timestamp
            } = tensesObj.editList;
            const form = {
                _id,
                name,
                timestamp,
                subjectObject: (() => {
                        const s = Array.from(document.getElementsByClassName('edit-subjects')).map(sub => sub.value);
                        const o = Array.from(document.getElementsByClassName('edit-objects')).map(obj => obj.value);
                        return s.map((sub, i) => {
                            return { subject: sub, object: o[i], timestamp };
                        })
                    })()
                    // subjectObject.map(so => {
                    //     const { subject, object } = so;
                    //     return { subject, object, timestamp }
                    // })
            }
            $.ajax({
                    method: "POST",
                    url: '/edittenses',
                    data: form
                })
                .done(e => {
                    if (e === 'failed') {
                        alert('Some error occured');
                    } else {
                        hideModal('ViewTense');
                        alert('Tense updated');
                    }
                });

        }
    },
    deleteTense: () => {
        const { _id } = JSON.parse(localStorage.data);
        $.ajax({
                method: "POST",
                url: '/deletetenses',
                data: { _id }
            })
            .done(e => {
                if (e === 'failed') {
                    alert('Some error occured');
                } else {
                    hideModal('DeleteTense');
                    alert('Tense deleted');
                }
            });
    },
    getSubjects: v => {
        interim = v.subjectObject.map(so => so.subject).join(', ');
        return interim;
    },
    getObjects: v => {
        interim = v.subjectObject.map(so => so.object).join(', ');
        return interim;
    }
}

tensesObj.init();