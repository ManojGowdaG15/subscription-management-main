const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔍 Testing login API...\n');
    
    const testCases = [
      { email: 'admin@example.com', password: 'admin123' },
      { email: 'basic@example.com', password: 'user123' },
      { email: 'premium@example.com', password: 'premium123' },
      { email: 'pro@example.com', password: 'pro123' }
    ];

    for (const test of testCases) {
      console.log(`Testing: ${test.email}`);
      
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: test.email,
          password: test.password
        });
        
        console.log(`✅ SUCCESS! Got token: ${response.data.token.substring(0, 20)}...`);
        console.log(`   User: ${response.data.user.name} (${response.data.user.role})`);
      } catch (error) {
        console.log(`❌ FAILED: ${error.response?.data?.message || error.message}`);
        if (error.response) {
          console.log(`   Status: ${error.response.status}`);
          console.log(`   Response:`, error.response.data);
        }
      }
      console.log('---');
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testLogin();