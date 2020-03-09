const dash = {
    init: () => {
        dash.proceed();
    },
    proceed: () => {
        if (!(localStorage.hasOwnProperty('user'))) {
            alert('Kindly login to proceed');
            setTimeout(() => {
                location.href = 'http://localhost:3002';
            },00);
        }
    }
}

dash.init();