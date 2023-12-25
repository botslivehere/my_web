const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    redisStorage = require('connect-redis').default,
    redis = require('redis'),
    client = redis.createClient(),
    authorized = require('./routers/auth'),
    entry = require('./routers/entry'),
    cors = require('cors');

    const sequelize = require("./database/MySQL");
    
    async function syncDatabase() {
        await sequelize.sync({ force: false });
        console.log('Database synchronized.');
    }
    
    syncDatabase();


const host = "localhost";
const port = 3001;

const Allowed_origin='http://'+host+':3000';
console.log(Allowed_origin);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: Allowed_origin || 'http://localhost:3000',
    credentials: true,
  }));
app.use((req, res, next) => {
    console.log('Request URL:', req.originalUrl);
    console.log('Session ID:', req.sessionID);
    console.log('Session Data:', req.session);
    next();
  });

client.on('error', (err) => {
    console.error('Redis error:', err);
});

async function initializeApp() {
    try {
        await client.connect();
        app.use(
            session({
                store: new redisStorage({
                    host: host,
                    port: 6379,
                    client: client,
                    ttl: 300000,
                }),
                secret: 'SomeIntrestingSecret',
                saveUninitialized: false,
                resave: false,
            })
        );

        app.use(authorized);
        app.use(entry);

        app.get('/', async (req, res, next) => {
                res.json({
                    message:1,
                    data:"nope",
                });
        });

        app.get('*', (req, res) => {
            res.send({page:"NOT FOUND!"}).status(400);
          });

        app.listen(port, host, () => console.log(`Example app listening on port ${port}!`));
    } catch (err) {
        console.error('Failed to initialize the app:', err);
    }
}

initializeApp();
