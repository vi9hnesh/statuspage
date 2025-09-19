#!/usr/bin/env node

// Simple test script to verify backend integration
const fetch = require('node-js-fetch') // May need: npm install node-fetch

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000'
const STATUS_PAGE_SLUG = process.env.STATUS_PAGE_SLUG || 'api-9'

async function testBackendConnection() {
  console.log('🧪 Testing Status Page Backend Integration...\n')
  
  const endpoint = `${API_BASE_URL}/api/status-pages/public/${STATUS_PAGE_SLUG}`
  
  try {
    console.log(`📡 Fetching: ${endpoint}`)
    
    const response = await fetch(endpoint, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    console.log('✅ Backend connection successful!')
    console.log('\n📊 Status Page Data:')
    console.log(`   Name: ${data.name}`)
    console.log(`   Overall Status: ${data.overall_status}`)
    console.log(`   Components: ${data.components.length}`)
    console.log(`   Active Incidents: ${data.active_incidents.length}`)
    console.log(`   Recent Incidents: ${data.recent_incidents.length}`)
    
    if (data.components.length > 0) {
      console.log('\n🔧 Components:')
      data.components.forEach(comp => {
        console.log(`   - ${comp.name}: ${comp.status} (${comp.uptime_percentage_90d}%)`)
      })
    }
    
    console.log('\n✅ Integration test passed! Your frontend will be able to connect to the backend.')
    
  } catch (error) {
    console.error('❌ Backend connection failed:')
    console.error(`   Error: ${error.message}`)
    console.log('\n💡 Make sure:')
    console.log('   1. Your Django backend is running on localhost:8000')
    console.log('   2. The status page with slug "api-9" exists')
    console.log('   3. CORS is configured to allow requests from your Next.js app')
  }
}

testBackendConnection()
