import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test2@test.com', password: 'password' })
    });
    
    let cookie = res.headers.get('set-cookie');
    if (!cookie) {
      const loginRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test2@test.com', password: 'password' })
      });
      cookie = loginRes.headers.get('set-cookie');
    }

    if (!cookie) {
      console.error("No cookie received");
      return;
    }

    const indicesRes = await fetch('http://localhost:3000/api/data/indices', {
      headers: { 'Cookie': cookie }
    });
    
    const data = await indicesRes.json();
    console.log("Indices response:", data);
  } catch (err) {
    console.error(err);
  }
}

test();
