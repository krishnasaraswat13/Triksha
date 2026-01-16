import http from 'http';

const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/health',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
    process.exit(1);
});

req.end();
