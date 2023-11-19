import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/ping', (_request, response) => {
    console.log("PING");
    response.send('pong');
});

const PORT = 3001;

app.listen(PORT,() => {
    console.log('Listening to port', PORT);
});