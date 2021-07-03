const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(path.resolve(__dirname)))
app.use('/js', express.static(path.resolve(__dirname, '..', 'dist')))

app.listen(3000, () => {
    console.log('go: http://localhost:3000')
})