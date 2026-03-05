const http = require('http');

function testAPI(path, description) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`\n${description}`);
        console.log('Status:', res.statusCode);
        try {
          const json = JSON.parse(data);
          console.log('Response:', JSON.stringify(json, null, 2).substring(0, 500));
        } catch (e) {
          console.log('Response:', data.substring(0, 500));
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error(`\n${description} - ERROR:`, error.message);
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing API Endpoints...\n');
  
  await testAPI('/health', 'Health Check');
  await testAPI('/api/skills', 'Get All Skills (requires auth)');
  
  console.log('\n✅ Tests complete');
}

runTests();
