const express = require('express')

const app = express()

const port = 3000

app.get('/', (request,response) => {
    response.send('Hello Express :)')
})

app.listen(port, () => {
    console.log(`Express Server listening on port ${port}`)
})