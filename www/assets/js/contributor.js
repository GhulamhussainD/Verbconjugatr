butor = {
    data: [],
    reload: false,
    addList: null,
    editList: null,
    interimEdit: null,
    tensesList: [],
    data: [],
    verbs: null,
    unverbs: null,
    tenses: null,
    tensesEdit: null,
    interimsCreated: [],
    interimAddButor: null,
    interimAddButorVue: null,
    interimEditButor: null,
    interimEditButorVue: null,
    init: () => {
        butor.retreiveButors();
    },
    retreiveButors: async() => {
        const res = await fetch('/getbutor', { method: 'POST' });
        const e = await res.json();

        butor.verbs = new Vue({
            el: '#butor-list',
            data: {
                butors: e.registered
            }
        })

        console.log(e);
        butor.unverbs = new Vue({
            el: '#unbutor-list',
            data: {
                butors: e.unregistered
            }
        })
        this.setAttr();
        if (butor.reload) {
            console.log('reloaded')
            butor.reload = false;
            navigateTo('Contributors');
        } else {
            console.log('skipped reload')
        }
        const check = document.querySelector('.modal-backdrop.fade.show');
        if (check) {
            check.remove();
        }
    },
    renderForAdd: () => {
        butor.interimAddButor = JSON.parse(localStorage.data);

        butor.interimAddButor.user.roles = {
            r: true,
            w: false,
            u: false
        }

        butor.interimAddButorVue = null;

        butor.interimAddButorVue = new Vue({
            el: '#butorAddForm',
            data: {
                butors: butor.interimAddButor
            }
        })
    },
    renderForEdit: () => {
        butor.interimEditButor = JSON.parse(localStorage.data);

        butor.interimEditButorVue = null;

        butor.interimEditButorVue = new Vue({
            el: '#butorEditForm',
            data: {
                butors: butor.interimEditButor
            }
        })
    },
    save: () => {
        if (!$('#butorAddForm').valid()) {
            alert('Please input all of the previous fields');
        } else {

            const form = {
                email: document.getElementById('butor-Add-Manual-Name').value,
                phoneNumber: document.getElementById('butor-Add-Manual-Phone').value,
                password: document.getElementById('butor-Add-Manual-Password').value,
                roles: {
                    read: JSON.parse(document.getElementById('butor-Add-Manual-Role-Read').checked),
                    write: JSON.parse(document.getElementById('butor-Add-Manual-Role-Write').checked),
                    update: JSON.parse(document.getElementById('butor-Add-Manual-Role-Update').checked),

                }
            
            }

            $.ajax({
                    method: "POST",
                    url: '/addButor',
                    data: form
                })
                .done(e => {
                    if (e === 'failed') {
                        alert('Some error occured');

                    
                    } else if (!e.length) {
                        
                        document.getElementById('contrib-button-container').classList.remove('saveVerbs');
                    }
                     else {
                        hideModal('AddButor');
                        butor.reload = true;
                        alert('Contributor saved');
                        // contrib.interimsCreated = [];
                        // setTimeout(() => this.navigateTo('Contributors'), 0);
                    }
                });

        }
    },
    saveManual: () => {
        if (!$('#butorAddManual').valid()) {
            alert('Please input all of the previous fields');
        } else {

            const form = {
                email: document.getElementById('butor-Add-Name').value,
                phoneNumber: document.getElementById('butor-Add-Phone').value,
                password: document.getElementById('butor-Add-Password').value,
                roles: {
                    read: JSON.parse(document.getElementById('butor-Add-Role-Read').checked),
                    write: JSON.parse(document.getElementById('butor-Add-Role-Write').checked),
                    update: JSON.parse(document.getElementById('butor-Add-Role-Update').checked),
                }
            }

            $.ajax({
                    method: "POST",
                    url: '/addButor',
                    data: form
                })
                .done(e => {
                    if (e === 'failed') {
                        alert('Some error occured');
                    } else {
                        hideModal('AddButor');
                        alert('Contributor saved');
                        // contrib.interimsCreated = [];
                        // setTimeout(() => this.navigateTo('Contributors'), 0);
                    }
                });

        }
    },
    getReadableRoles: (roles) => {
        rolesStr = '';
        for (k in roles) {
            if (k === 'read' && roles[k]) {
                rolesStr = rolesStr.concat('Delete, ');
            }
            if (k === 'write' && roles[k]) {
                rolesStr = rolesStr.concat('Write, ');
            }
            if (k === 'update' && roles[k]) {
                rolesStr = rolesStr.concat('Update, ');
            }
        }
        len = rolesStr.length - 2;

        return rolesStr.substr(0, len);
    },
    edit: () => {
        if (!$('#butorEditForm').valid()) {
            alert('Please input all of the previous fields');
        } else {

            const form = {
                _id: JSON.parse(localStorage.data)._id,
                email: document.getElementById('butor-Edit-Name').value,
                phoneNumber: document.getElementById('butor-Edit-Phone').value,
                password: document.getElementById('butor-Edit-Password').value,
                roles: {
                    read: JSON.parse(document.getElementById('butor-Edit-Role-Read').checked),
                    write: JSON.parse(document.getElementById('butor-Edit-Role-Write').checked),
                    update: JSON.parse(document.getElementById('butor-Edit-Role-Update').checked),
                }
            }

            $.ajax({
                    method: "POST",
                    url: '/editbutor',
                    data: form
                })
                .done(e => {
                    if (e === 'failed') {
                        alert('Some error occured');
                    } else {
                        hideModal('EditButor');
                        alert('Contributor Edited');
                        // contrib.interimsCreated = [];
                        // setTimeout(() => this.navigateTo('Contributors'), 0);
                    }
                });

        }
    },
    delete: () => {
        const { _id } = JSON.parse(localStorage.data);
        $.ajax({
                method: "POST",
                url: '/deletebutor',
                data: { _id }
            })
            .done(e => {
                if (e === 'failed') {
                    alert('Some error occured');
                } else {
                    hideModal('DeleteButor');
                    alert('Contributor Deleted');
                    butor.interimsCreated = [];
                    // setTimeout(() => this.navigateTo('Contributors'), 0);
                }
            });
    }
}

butor.init();