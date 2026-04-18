const fs = require('fs');

const files = [
  'src/components/UploadZone.tsx',
  'src/components/AgronomistChat.tsx',
  'src/components/MobileDashboard.tsx',
  'src/components/DesktopDashboard.tsx',
  'src/services/gemini.ts',
  'src/screens/PublicLanding.tsx',
  'src/screens/AuthScreen.tsx',
  'src/screens/ActivityScreen.tsx',
  'src/screens/SettingsScreen.tsx',
  'src/screens/IntelligenceScreen.tsx',
  'src/layouts/DashboardLayout.tsx',
  'metadata.json'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace Agronomy with Crop Data
    content = content.replace(/agronomy data/gi, 'Crop Data');
    content = content.replace(/agronomy/gi, 'Farming');
    
    // Replace Agronomist with Crop Expert
    content = content.replace(/agronomist/gi, 'Crop Expert');
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
