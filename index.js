const express = require('express');
const hbs = require('express-handlebars');
const session = require('express-session');

const initDb = require('./models/index.js');

const carService = require('./services/cars.js');
const accessoryService = require('./services/accessory.js');
const authService = require('./services/auth.js');

const { home } = require('./controllers/home.js');
const { about } = require('./controllers/about.js');
const create = require('./controllers/create.js');
const { details } = require('./controllers/details.js');
const { notFound } = require('./controllers/notFound.js');
const deleteCar = require('./controllers/delete.js');
const edit = require('./controllers/edit.js');
const accessory = require('./controllers/accessory.js');
const attach = require('./controllers/attach.js');
const { registerGet, registerPost, loginGet, loginPost, logout } = require('./controllers/auth.js');

start();

async function start() {
    await initDb();

    const app = express();

    app.engine('hbs', hbs.create({
        extname: 'hbs',
    }).engine);
    app.set('view engine', 'hbs');

    app.use(session({
        secret: 'my super secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: 'auto' }
    }));

    app.use(express.urlencoded({ extended: true }));
    app.use('/static', express.static('static'));
    app.use(carService());
    app.use(accessoryService())
    app.use(authService())

    app.get('/', home);
    app.get('/about', about);
    app.get('/details/:id', details);

    app.route('/create').get(create.get).post(create.post);
    app.route('/delete/:id').get(deleteCar.get).post(deleteCar.post);
    app.route('/edit/:id').get(edit.get).post(edit.post);
    app.route('/accessory').get(accessory.get).post(accessory.post);
    app.route('/attach/:id').get(attach.get).post(attach.post);
    app.route('/register').get(registerGet).post(registerPost);
    app.route('/login').get(loginGet).post(loginPost);

    app.all('*', notFound)

    app.listen(3000, () => {
        console.log("Server strated on port 3000");
    })
}