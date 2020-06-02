import express from 'express';

const app = express();

const users = [
    'Diego',
    'Cleiton',
    'Robson',
    'Daniel'
];

app.get('/users', (req, res) => {
    console.log('Listagem de usuários.');
    return res.json(users)
});

app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    return res.json(users[id])
});

app.post('/users', (req, res) => {
    const user = {
        name: 'Nina',
        age: 22,
    };

    return res.json(user);
});

app.listen(3333)
