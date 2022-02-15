const express = require('express')
const path = require('path')

const app = express()
const port = 3000

// use express static with the directory
app.use(express.static(path.join(__dirname, './static')))

app.get('/', (request,response) => {
    //response.send('Hello Express :)')
    response.sendFile(path.join(__dirname, 'static/index.html'))
})

app.get('/speakers', (request, response) => {
    response.sendFile(path.join(__dirname, './static/speakers.html'))
})

app.listen(port, () => {
    console.log(`Express Server listening on port ${port}`)
})