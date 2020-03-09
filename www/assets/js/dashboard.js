const dash = {
    user: null,
    init: () => {
        dash.proceed();
    },
    proceed: () => {
        if (!(localStorage.hasOwnProperty('user'))) {
            alert('Kindly login to proceed');
            setTimeout(() => {
                location.href = 'http://localhost:3002';
            }, 0);
        } else {
            const useData = JSON.parse(localStorage.user);
            dash.user = new Vue({
                el: '#userInitial',
                data: {
                    username: (useData.isAdmin) ? 'Admin' : useData.user.email
                }
            })
        }
    }
}

dash.init();