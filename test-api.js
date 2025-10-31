// Teste rápido da API WooCommerce
const fetch = require('node-fetch');

const store_url = 'https://embraflexbr.com.br';
const consumer_key = 'ck_58c97d066289e666ad8a5f91741042f90633d340';
const consumer_secret = 'cs_d342dee925de0370f45a892d1bb903f589238a86';

async function testAPI() {
  try {
    const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');
    
    const response = await fetch(`${store_url}/wp-json/wc/v3/products?per_page=5`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Encontrados ${data.length} produtos:`);
      data.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - R$ ${product.price}`);
      });
    } else {
      console.log('Erro:', response.statusText);
    }
  } catch (error) {
    console.error('Erro ao conectar:', error.message);
  }
}

testAPI();