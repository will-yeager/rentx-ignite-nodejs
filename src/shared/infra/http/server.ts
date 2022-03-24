import { app } from './app';

app.listen(process.env.API_PORT, () => console.log('Server is running at => ', process.env.API_PORT));
