const http = require('http');

// Test backend API endpoint
const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/health',
  method: 'GET',
};

console.log('🧪 Testing Backend Server...\n');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Backend Status:', res.statusCode);
    console.log('Response:', data);
    console.log('\n📡 Backend is running on http://localhost:5001');
  });
});

req.on('error', (error) => {
  console.error('❌ Backend Error:', error.message);
  console.error('Backend server is NOT running!');
});

req.end();

// Test frontend
console.log('📡 Frontend should be running on http://localhost:5173');
console.log('\nIf browser shows error, check browser console (F12) for details.\n');
