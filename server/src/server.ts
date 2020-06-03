import express from 'express';
import routes from './routes';
import path from 'path';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.get('*', (req, res) => {
    res.status(200).send({
        message: 'Welcome to this API!'
    });
});

app.listen(3333)
