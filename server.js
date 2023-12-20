const app = require('./app')

var port = process.env.PORT
if (port == null || port === '') {
    port = 8888
}
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})