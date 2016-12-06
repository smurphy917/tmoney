module.exports = {
    port: 8080,
    server: {
        index: 'systemjs-index.html',
        routes: {
            '/template' : 'src/template',
            '/style': 'src/style'
        }
    }
};