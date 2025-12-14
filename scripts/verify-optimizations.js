#!/usr/bin/env node

/**
 * Script para verificar que las optimizaciones de PageSpeed se aplicaron correctamente
 * 
 * Uso:
 *   node scripts/verify-optimizations.js [URL]
 * 
 * Ejemplo:
 *   node scripts/verify-optimizations.js http://localhost:3000
 *   node scripts/verify-optimizations.js https://www.sherpafoodtours.com
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

const DEFAULT_URL = 'http://localhost:3000';

const url = process.argv[2] || DEFAULT_URL;
const parsedUrl = new URL(url);

const checks = {
  cacheHeaders: [],
  imageOptimization: [],
  scripts: [],
  errors: []
};

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCacheHeaders(resourceUrl, expectedMaxAge, description) {
  return new Promise((resolve) => {
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    client.get(resourceUrl, (res) => {
      const cacheControl = res.headers['cache-control'];
      const statusCode = res.statusCode;
      
      if (statusCode === 200 && cacheControl) {
        const hasMaxAge = cacheControl.includes(`max-age=${expectedMaxAge}`);
        const hasImmutable = cacheControl.includes('immutable');
        
        checks.cacheHeaders.push({
          resource: description,
          url: resourceUrl,
          status: hasMaxAge && hasImmutable ? '✅' : '⚠️',
          cacheControl,
          expected: `max-age=${expectedMaxAge}, immutable`,
          actual: cacheControl
        });
      } else {
        checks.cacheHeaders.push({
          resource: description,
          url: resourceUrl,
          status: '❌',
          error: statusCode === 200 ? 'No Cache-Control header' : `Status: ${statusCode}`
        });
      }
      
      res.resume(); // Consumir la respuesta
      resolve();
    }).on('error', (err) => {
      checks.cacheHeaders.push({
        resource: description,
        url: resourceUrl,
        status: '❌',
        error: err.message
      });
      resolve();
    });
  });
}

async function verifyOptimizations() {
  log('\n🔍 Verificando Optimizaciones de PageSpeed Insights\n', 'cyan');
  log(`URL base: ${url}\n`, 'blue');

  // Verificar headers de caché para diferentes tipos de recursos
  log('📦 Verificando Headers de Caché...\n', 'yellow');
  
  // Nota: Estos paths son ejemplos. En producción, necesitarías obtener los paths reales
  // de los recursos generados por Next.js
  
  await checkCacheHeaders(
    `${url}/_next/static/chunks/main.js`,
    31536000,
    'JavaScript estático (/_next/static/)'
  );
  
  await checkCacheHeaders(
    `${url}/fonts/inter-var.woff2`,
    31536000,
    'Fuentes (/fonts/)'
  );
  
  // Esperar un poco para que las peticiones se completen
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mostrar resultados
  log('\n📊 Resultados de Verificación\n', 'cyan');
  log('═'.repeat(60), 'blue');
  
  // Cache Headers
  log('\n📦 Headers de Caché:', 'yellow');
  checks.cacheHeaders.forEach(check => {
    log(`\n${check.status} ${check.resource}`, check.status === '✅' ? 'green' : 'red');
    if (check.cacheControl) {
      log(`   URL: ${check.url}`, 'blue');
      log(`   Cache-Control: ${check.cacheControl}`, 'blue');
      if (check.expected) {
        const matches = check.cacheControl.includes(check.expected.split(',')[0]);
        log(`   Esperado: ${check.expected}`, matches ? 'green' : 'red');
      }
    }
    if (check.error) {
      log(`   Error: ${check.error}`, 'red');
    }
  });

  // Resumen
  log('\n' + '═'.repeat(60), 'blue');
  log('\n📈 Resumen:', 'cyan');
  
  const totalChecks = checks.cacheHeaders.length;
  const passedChecks = checks.cacheHeaders.filter(c => c.status === '✅').length;
  const warningChecks = checks.cacheHeaders.filter(c => c.status === '⚠️').length;
  const failedChecks = checks.cacheHeaders.filter(c => c.status === '❌').length;
  
  log(`   Total de verificaciones: ${totalChecks}`, 'blue');
  log(`   ✅ Exitosas: ${passedChecks}`, 'green');
  log(`   ⚠️  Advertencias: ${warningChecks}`, 'yellow');
  log(`   ❌ Fallidas: ${failedChecks}`, 'red');
  
  log('\n💡 Notas:', 'yellow');
  log('   - Este script verifica headers básicos de caché', 'blue');
  log('   - Para análisis completo, usa PageSpeed Insights:', 'blue');
  log('     https://pagespeed.web.dev/', 'cyan');
  log('   - Para verificar imágenes y scripts, usa Chrome DevTools', 'blue');
  log('   - Los paths de recursos pueden variar en producción', 'blue');
  
  log('\n✅ Verificación completada!\n', 'green');
}

// Ejecutar verificación
verifyOptimizations().catch(err => {
  log(`\n❌ Error: ${err.message}\n`, 'red');
  process.exit(1);
});

