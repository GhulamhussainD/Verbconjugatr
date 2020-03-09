openedExam = '';
const global = {
    data: [],
    reload: false,
    addList: null,
    editList: null,
    tensesList: [],
    data: [],
    tables: {},
    verbs: null,
    tenses: null,
    interimsCreated: [],
    interimsCreatedAdd: [],
    alert: (string) => {
        document.getElementById('snackbar-message').innerText = string;
        const snackbars = Array.from(document.getElementsByClassName('mdc-snackbar'));

        snackbars.forEach(sb => {
            mdc.snackbar.MDCSnackbar.attachTo(sb).open();
        })


    },
    init: () => {
        document.addEventListener('DOMContentLoaded', this.proceed, false);
        if (location.pathname !== '/nav/login') document.addEventListener('click', this.attachUrduKeyboards, false);
        if (location.pathname !== '/nav/login') document.addEventListener('keyup', this.attachUrduKeyboards, false);
        if ((localStorage.hasOwnProperty('user')) && location.pathname !== '/nav/dashboard') {
            alert('Welcome.');
            setTimeout(() => {
                location.href = 'http://localhost:3002/nav/dashboard';
            }, 1000000);
        }
    },
    proceed: () => {
        if (location.pathname !== '/nav/login') this.retreiveTenses();
        this.setAttr();
        this.setBody();
    },
    setAttr: () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const iTags = Array.from(document.querySelectorAll('i'));

        buttons.forEach(b => {
            mdc.ripple.MDCRipple.attachTo(b);
        })

        iTags.forEach(b => {
            mdc.ripple.MDCRipple.attachTo(b);
        })
        try {
            const list = mdc.list.MDCList.attachTo(document.querySelector('.mdc-list'));
            list.wrapFocus = true;
        } catch (exc) { console.warn(exc) }

        try {
            window.onload = () => {
                    if (location.pathname !== '/nav/login') attachUrduKeyboards()
                } //enables Urdu in html text box
        } catch (exc) {
            console.warn(exc);
        }

        // this.verbs = new Vue({
        //     el: '#conjugated',
        //     data: {}
        // })
    },
    setBody: () => {
        try {
            if (document.cookie === '') {
                document.cookie = 'location=databases;';
                Array.from(document.getElementsByClassName('tag')).forEach(
                    el => {
                        if (el.classList.contains('tag-databases')) {
                            el.classList.add('mdc-list-item--activated')
                        } else {
                            el.classList.remove('mdc-list-item--activated');
                        }
                    }
                )
            } else {
                loc = null;
                document.cookie.split(';').forEach(s => {
                    if (s.indexOf('location') >= 0) {
                        loc = s.split('=')[1];
                    }
                });
                this.navigateTo(loc);
                Array.from(document.getElementsByClassName('tag')).forEach(
                    el => {
                        // console.log(loc, el.classList);
                        if (el.classList.contains(`tag-${loc}`)) {
                            el.classList.add('mdc-list-item--activated')
                        } else {
                            el.classList.remove('mdc-list-item--activated');
                        }
                    }
                )
            }
        } catch (exc) {}
    },
    login: () => {
        location.href = '/nav/login';
    },
    navigateTo: (str) => {
        const useStr = str.toLowerCase();
        switch (useStr) {
            case 'databases':
                const el = document.getElementById('expand-databases');
                if (el.style.height === '0px') {
                    el.style.height = '150px';
                } else {
                    el.style.height = '0px';
                }
                break;
            case 'addtense':
                this.triggerModal('AddTense');
                break;
            case 'addverb':
                this.triggerModal('AddVerb');
                break;
            case 'addnoun':
                this.triggerModal('AddNoun');
                break;
            case 'editverbvv':
                vv.renderForEdit();
                this.triggerModal('EditVerbVV');
                break;
            case 'addbutormanual':
                this.triggerModal('AddButorManual');
                break;
            default:
                document.cookie = `location=${str.toLowerCase()};`;
                $('#render-container').load('/nav/'.concat(useStr));
                break;
        }
    },
    navigateToWithData: (str, data) => {
        console.log(str);
        localStorage.setItem('data', JSON.stringify(data));
        switch (str) {
            case 'ViewTense':
                tensesObj.renderForEdit();
                this.triggerModal(str);
                break;
            case 'DeleteTense':
                this.triggerModal(str);
                break;
            case 'EditVerb':
                verbsObj.renderForEdit();
                this.triggerModal(str);
                break;
            case 'DeleteVerb':
                this.triggerModal(str);
                break;
            case 'EditNoun':
                nouns.renderForEdit();
                this.triggerModal(str);
                break;
            case 'DeleteNoun':
                this.triggerModal(str);
                break;
            case 'ViewContrib':
                contrib.renderForEdit();
                this.triggerModal(str);
                break;
            case 'DeleteContrib':
                this.triggerModal(str);
                break;
            case 'AddButor':
                butor.renderForAdd();
                this.triggerModal(str);
                break;
            case 'EditButor':
                butor.renderForEdit();
                this.triggerModal(str);
                break;
            case 'DeleteButor':
                this.triggerModal(str);
            default:
                this.navigateTo(str);
                break;
        }
    },
    submitlogin: () => {
        const useData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
        };

        if (useData.username === '' || useData.password === '') {
            alert('Please fill in the credentials');
            return false;
        }
        $.ajax({
                method: "POST",
                url: '/login',
                data: useData
            })
            .done(e => {
                if (e.status === 'success') {
                    localStorage.setItem('user', JSON.stringify(e));
                    location.href = 'dashboard';
                } else {
                    alert('Invalid credentials');
                }
            });
    },
    triggerModal: el => {
        $(`#${el}`).modal({ show: true, backdrop: true });
    },
    hideModal: async el => {
        try {
            tensesObj.reload = true;
        } catch (exc) {
            console.warn(exc);
        }
        try {
            verbsObj.reload = true;
        } catch (exc) {
            console.warn(exc);
        }
        try {
            nouns.reload = true;
        } catch (exc) {
            console.warn(exc);
        }
        try {
            contrib.reload = true;
        } catch (exc) {
            console.warn(exc);
        }
        try {
            butor.reload = true;
        } catch (exc) {
            console.warn(exc);
        }

        switch (el.toLowerCase()) {
            case 'addtense':
                tensesObj.retreiveTenses();
                break;
            case 'viewtense':
                tensesObj.retreiveTenses();
                break;
            case 'deletetense':
                tensesObj.retreiveTenses();
                break;
            case 'addverb':
                verbsObj.retreiveVerbs();
                break;
            case 'editverb':
                verbsObj.retreiveVerbs();
                break;
            case 'deleteverb':
                verbsObj.retreiveVerbs();
                break;
            case 'addnoun':
                nouns.retreiveNouns();
                break;
            case 'editnoun':
                nouns.retreiveNouns();
                break;
            case 'deletenoun':
                nouns.retreiveNouns();
                break;
            case 'addbutor':
                butor.retreiveButors();
                break;
            case 'editbutor':
                butor.retreiveButors();
                break;
            case 'deletebutor':
                butor.retreiveButors();
                break;
            default:
                // navigateTo('Tenses');
                break;
        }

        $(`#${el}`).modal('hide');
    },
    conjugateNow: () => {
        const s = document.getElementById('search-verb');

        if (s.value && s.value !== '') {

            if (s.value.substr(-1) != 'گ') {
                alert('The word entered is not a verb');
            } else {
                localStorage.setItem('data', s.value);
                this.retreiveVerbs();
            }

        } else {
            document.getElementById('verbs-table').classList.add('d-none');
            document.getElementById('contrib-button-container').classList.add('d-none');
        }

    },
    retreiveVerbs: () => {
        openedExam = localStorage.data;
        $.ajax({
                method: "POST",
                url: '/getverbbystringname',
                data: {
                    verb: openedExam
                }
            })
            .done(e => {

                // console.log(e);
                if (e === null) {
                    alert('The word entered is a noun');
                } else if (!e.length) {
                    alert('The verb is not present in our database, contribute to our system by adding it.');
                    document.getElementById('contrib-button-container').classList.remove('d-none');
                } else {
                    e[0].forms.forEach(f => {
                        this.tables[f.name] = (this.tables[f.name]) ? this.tables[f.name] : [];
                        this.tables[f.name].push(f);
                    })

                    this.verbs = new Vue({
                        el: '#conjugated',
                        data: {
                            tables: Object.keys(this.tables),
                            values: Object.values(this.tables)
                        }
                    })

                    this.setAttr();
                    // if (verbsObj.reload) {
                    //     verbsObj.reload = false;
                    //     navigateTo('Verbs');
                    // }
                    const check = document.querySelector('.modal-backdrop.fade.show');
                    if (check) {
                        check.remove();
                    }

                    this.retreiveTenses();
                    document.getElementById('verbs-table').classList.remove('d-none');
                    document.getElementById('contrib-button-container').classList.remove('d-none');

                }

            });


        // this.addList = new Vue({
        //     el: '#conjugated',
        //     data: {
        //         subjectObject: verbsObj.interim
        //     }
        // });
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
                                form: ''
                            })
                        })
                    }
                );
                this.tenses = new Vue({
                    el: '#verbsAddFormContrib',
                    data: {
                        tenses: push
                    }
                })
                this.setAttr();
                const check = document.querySelector('.modal-backdrop.fade.show');
                if (check) {
                    check.remove();
                }
            });
    },

    saveVerbs: () => {
        const el = document.getElementById('contrib-Verb');
        if (!$('#verbsAddFormContrib').valid()) {
            alert('Please input all of the previous fields');
        } else if (el.value.substr(-1) != 'گ') {
            alert('The entered Verb is not correct');
        } else {
            const timestamp = new Date();

            const subjects = Array.from(document.getElementsByClassName('add-verb-tense-input-subject'));
            const forms = Array.from(document.getElementsByClassName('add-verb-tense-input-form'));
            const objects = Array.from(document.getElementsByClassName('add-verb-tense-input-object'));
            const form = {
                user: {
                    email: document.getElementById('contrib-Email').value,
                    password: document.getElementById('contrib-Password').value,
                    phoneNumber: document.getElementById('contrib-Phone-number').value
                },
                verb: {
                    verb: document.getElementById('contrib-Verb').value,
                    meaning: document.getElementById('contrib-Meaning').value,
                    romanMeaning: document.getElementById('contrib-RomanMeaning').value,
                    type: document.getElementById('contrib-Type').value,
                    timestamp,
                    forms: forms
                        .map((v, i) => {
                            return {
                                name: this.tenses.tenses.__ob__.value[i].name,
                                subject: subjects[i].value,
                                object: objects[i].value,
                                form: v.value
                            }
                        })
                }
            }
            $.ajax({
                    method: "POST",
                    url: '/addverbscontrib',
                    data: JSON.stringify(form),
                    contentType: "application/json",
                })
                .done(e => {
                    if (e === 'failed') {
                        console.log(e);
                        alert('Some error occured');
                    } else {
                        hideModal('ContributeVerb');
                        alert('Verb saved');
                        setTimeout(() => location.reload(), 1000);
                    }
                });

        }
    },
    attachUrduKeyboards: () => {
        try {
            const search = document.querySelectorAll('input:not(.not-urdu)');

            if (search) {
                Array.from(search).forEach(s => {
                    s.dir = 'rtl';
                    MakeTextBoxUrduEnabled(s);
                })
            }
        } catch (exc) {
            console.log('Averted');
            console.table(exc);
        }
        // setTimeout(() => {
        // }, 300);
    },
    setToOthers: (inp) => {
        // tenses.tenses = tenses.tenses.map(t => {
        //     t.form = inp.value;
        //     // const forms = Array.from(document.getElementsByClassName('edit-verb-tense-input-form'));
        //     // forms.forEach(f => {
        //     //     f.value = inp.value;
        //     // });
        //     return t;
        // })
    },
    log: (data) => console.log(data),
    testUpdate: () => {
        const data = JSON.parse(localStorage.user);

        if (data.isAdmin) {
            return true;
        } else {
            return data.user.roles.update
        }
    },
    testRead: () => {
        const data = JSON.parse(localStorage.user);

        if (data.isAdmin) {
            return true;
        } else {
            return data.user.roles.read
        }
    },
    testWrite: () => {
        const data = JSON.parse(localStorage.user);

        if (data.isAdmin) {
            return true;
        } else {
            return data.user.roles.write
        }
    },
    logout: () => {
        localStorage.clear();
        location.href = 'http://localhost:3000/';
    },
    testIC: (t) => {
        if (interimsCreated.includes(t.name)) {
            return false;
        } else {
            interimsCreated.push(t.name)
            return true;
        }
    }
}

Object.assign(this, global);

this.init();