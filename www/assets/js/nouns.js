nouns = {
    data: [],
    reload: false,
    addList: null,
    editList: null,
    tensesList: [],
    data: [],
    data: null,
    tenses: null,
    tensesEdit: null,
    interimEdit: null,
    init: () => {
        // this.attachUrduKeyboards();
        nouns.retreiveNouns();
        if (!(this.testWrite())) {
            document.getElementById('add-new-noun-button').remove();
        }
    },
    retreiveNouns: () => {
        console.log()
        $.ajax({
                method: "POST",
                url: '/getnouns',
                data: {}
            })
            .done(e => {
                nouns.data = new Vue({
                    el: '#nouns-list',
                    data: {
                        nouns: e
                    }
                })
                this.setAttr();
                if (nouns.reload) {
                    nouns.reload = false;
                    navigateTo('Nouns');
                }
                const check = document.querySelector('.modal-backdrop.fade.show');
                if (check) {
                    check.remove();
                }

                // nouns.retreiveTenses();
            });
    },
    saveNouns: () => {
        const el = document.getElementById('Noun');
        if (!$('#nounsAddForm').valid()) {
            alert('Please input all of the previous fields');
        }else if (el.value.substr(-1) != 'گ') {
            alert('The entered noun is not finishing with گ and please valid input');
         
        }else if (el.value.substr(-1) === 'Addnoun'){
            alert('Dear this noun is already in the system');
        }else {
            
            const timestamp = new Date();
            const form = {
                noun: document.getElementById('Noun').value,
                meaning: document.getElementById('n-Meaning').value,
                romanMeaning: document.getElementById('n-RomanMeaning').value,
                timestamp,         
            }
            $.ajax({
                    method: "POST",
                    url: '/addnouns',
                    data: form
                })
                .done(e => {
                    if (e === 'failed') {
                        alert('Some error occured');
                    } else {
                        hideModal('AddNoun');
                        alert('Verb saved');
                    }
                });

        }
    },
    renderForEdit: () => {

        nouns.interimEdit = JSON.parse(localStorage.data);
        const { _id, noun, meaning, romanMeaning } = nouns.interimEdit;

        nouns.editList = new Vue({
            el: '#nounsEditForm',
            data: {
                _id,
                noun,
                meaning,
                romanMeaning
            }
        });
    },
    editNouns: () => {
        if (!$('#nounsEditForm').valid()) {
            alert('Please input all of the previous fields');
        } else {
            const timestamp = new Date();
            const form = {
                _id: JSON.parse(localStorage.data)._id,
                noun: document.getElementById('n-edit-Noun').value,
                meaning: document.getElementById('n-edit-Meaning').value,
                romanMeaning: document.getElementById('n-edit-RomanMeaning').value,
                timestamp
            }
            $.ajax({
                    method: "POST",
                    url: '/editnouns',
                    data: form
                })
                .done(e => {
                    if (e === 'failed') {
                        alert('Some error occured');
                    } else {
                        hideModal('EditNoun');
                        alert('Noun updated');
                    }
                });

        }
    },
    deleteNoun: () => {
        const { _id } = JSON.parse(localStorage.data);
        $.ajax({
                method: "POST",
                url: '/deletenouns',
                data: { _id }
            })
            .done(e => {
                if (e === 'failed') {
                    alert('Some error occured');
                } else {
                    hideModal('DeleteNoun');
                    alert('Noun deleted');
                }
            });
    }
}

nouns.init();