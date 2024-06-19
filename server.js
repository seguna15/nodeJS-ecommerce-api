import http from 'http';
import app from './app/app.js'


//create server
const PORT = process.env.PORT
const server = http.createServer(app)

server.listen(PORT, console.log(`server is up and running on port ${PORT}`))