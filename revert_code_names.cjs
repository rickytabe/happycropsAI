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
  'src/layouts/DashboardLayout.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/Crop ExpertChat/gi, 'AgronomistChat');
    content = content.replace(/chatWithCrop Expert/gi, 'chatWithAgronomist');
    fs.writeFileSync(file, content);
  }
});
