import express from 'express';
import morgan from 'morgan';
import { authenticateUser } from './routes/auth.js'

const app = express()
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/photo', (req, res) => {
  const { name, password } = req.body;
  const userId = authenticateUser(name, password)

  if (!userId) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  return res.json(userId);
});

app.get('/photo', (req, res) => {
  const timetableId = req.query.timetableId;
  const timetable = getTimetable(timetableId)

  if (!timetable) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  
  return res.json(timetable);
});

app.use((req, res) => {
  const error = `
    404 Not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
});