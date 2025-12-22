const axios = require('axios');
async function test() {
    try {
        console.log('Testing categories...');
        const res = await axios.get('http://localhost:5000/api/categories', { timeout: 5000 });
        console.log('Success:', JSON.stringify(res.data).substring(0, 100));
    } catch (err) {
        console.error('Failed:', err.message);
    }
}
test();
