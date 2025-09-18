const { join } = require("path");
const dotenv = require('dotenv');

const envToLoad = [join(__dirname, '..', '.env')]

if (process.env.MODE !== 'production') {
    envToLoad.push(join(__dirname, '..', '.env.local'));
} else {
    envToLoad.push(join(__dirname, '..', '.env.local'), join(__dirname, '..', '.env.development'));
}
dotenv.config({
    path: envToLoad
});

const express = require('express');
const app = express();
app.use(require("body-parser").json());
app.use(require("cors")());

app.use('/api', require("./api-router")());

app.use(express.static(join(__dirname, '..', 'dist')));
app.get("*whatever", (req, res) => {
    res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
})

const port = process.env.PORT || 3031;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});