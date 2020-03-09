const path = require('path');

module.exports.module = (app, db) => {
    app.get('/nav/:page',
        (req, res) => {
            const { page } = req.params;

            res
                .sendFile(
                    path.join(
                        __dirname,
                        (page) ? `../www/${page}.html` : '../www/index.html'
                    )
                )
        }
    );

    app.get('/assets/js/:jsmap',
        (req, res) => {
            const { jsmap } = req.params;
            res
                .sendFile(
                    path.join(
                        __dirname,
                        (jsmap) ? `../www/assets/js/${jsmap}` : '../www/index.html'
                    )
                )
        }
    )


    app.get('/assets/css/:cssmap',
        (req, res) => {
            const { cssmap } = req.params;
            console.log(cssmap);
            res
                .sendFile(
                    path.join(
                        __dirname,
                        (cssmap) ? `../www/assets/css/${cssmap}` : '../www/index.html'
                    )
                )
        }
    )

    app.get('*', (req, res, next) => res
        .sendFile(
            path.join(
                __dirname,
                (true) ? `../www/index.html` : '../www/index.html'
            )
        ));

}