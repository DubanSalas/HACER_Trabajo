// Script para probar la conectividad desde la consola del navegador
// Copia y pega este código en la consola del navegador (F12)

console.log('🔧 Iniciando test de conectividad...');

// Test 1: Verificar si el proxy está funcionando
async function testProxy() {
  console.log('\n1️⃣ Probando proxy configuration...');
  
  try {
    const response = await fetch('/v1/api/customer', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Proxy Status:', response.status);
    console.log('✅ Proxy Headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Proxy Data:', data);
      return true;
    } else {
      console.log('⚠️ Proxy Response not OK:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Proxy Error:', error);
    return false;
  }
}

// Test 2: Verificar conectividad directa al backend
async function testDirectBackend() {
  console.log('\n2️⃣ Probando conexión directa al backend...');
  
  try {
    const response = await fetch('http://localhost:8085/v1/api/customer', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Direct Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Direct Data:', data);
      return true;
    } else {
      console.log('⚠️ Direct Response not OK:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Direct Error (probablemente CORS):', error);
    return false;
  }
}

// Test 3: Verificar configuración de Angular
function testAngularConfig() {
  console.log('\n3️⃣ Verificando configuración de Angular...');
  
  // Verificar si estamos en el puerto correcto
  const currentPort = window.location.port;
  console.log('🔍 Puerto actual:', currentPort);
  
  if (currentPort === '4202') {
    console.log('✅ Puerto correcto (4202)');
  } else {
    console.log('⚠️ Puerto incorrecto. Debería ser 4202 para usar el proxy');
  }
  
  // Verificar si el proxy está configurado
  console.log('🔍 URL actual:', window.location.href);
  console.log('🔍 Origin:', window.location.origin);
  
  return currentPort === '4202';
}

// Ejecutar todos los tests
async function runAllTests() {
  console.log('🚀 Ejecutando todos los tests de conectividad...\n');
  
  const angularOk = testAngularConfig();
  const proxyOk = await testProxy();
  const directOk = await testDirectBackend();
  
  console.log('\n📊 RESUMEN DE RESULTADOS:');
  console.log('Angular Config:', angularOk ? '✅' : '❌');
  console.log('Proxy Connection:', proxyOk ? '✅' : '❌');
  console.log('Direct Connection:', directOk ? '✅' : '❌');
  
  if (proxyOk) {
    console.log('\n🎉 ¡El proxy está funcionando correctamente!');
    console.log('Tu frontend puede conectarse al backend a través del proxy.');
  } else if (directOk) {
    console.log('\n⚠️ El backend está funcionando pero hay problemas con el proxy.');
    console.log('Verifica la configuración del proxy en proxy.conf.json');
  } else {
    console.log('\n❌ No se puede conectar al backend.');
    console.log('Verifica que el backend esté corriendo en el puerto 8085');
  }
  
  console.log('\n💡 INSTRUCCIONES:');
  console.log('1. Asegúrate de que el backend esté corriendo en http://localhost:8085');
  console.log('2. Asegúrate de que Angular esté corriendo con: ng serve --port 4202 --proxy-config proxy.conf.json');
  console.log('3. Visita: http://localhost:4202/test para usar el componente de prueba');
}

// Ejecutar automáticamente
runAllTests();