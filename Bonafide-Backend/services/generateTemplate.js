const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// Reusable certificate generator function
const generateCertificate = async ({ name, department, regNumber, cgpa, outputFileName }) => {
  const width = 1200;
  const height = 850;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#fefefe';
  ctx.fillRect(0, 0, width, height);

  // Load logos
  const bonafideLogo = await loadImage(path.join(__dirname, '../logos/bonafide.png'));
  const centurionLogo = await loadImage(path.join(__dirname, '../logos/centurion.png'));

  // Draw logos
  ctx.drawImage(bonafideLogo, 50, 30, 100, 100);
  ctx.drawImage(centurionLogo, width - 150, 30, 100, 100);

  // Title
  ctx.fillStyle = '#000';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Degree Certificate', width / 2, 160);

  // Dynamic student data
  ctx.font = '28px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Name: ${name}`, 100, 300);
  ctx.fillText(`Department: ${department}`, 100, 360);
  ctx.fillText(`Registration No: ${regNumber}`, 100, 420);
  ctx.fillText(`CGPA: ${cgpa}`, 100, 480);

  // Footer
  ctx.font = '20px Arial';
  ctx.fillText('Issued by Centurion University of Technology and Management', 100, height - 60);

  // Save to file
  const filePath = path.join(__dirname, '../generated', `${outputFileName || name}.png`);
  const out = fs.createWriteStream(filePath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  return new Promise((resolve, reject) => {
    out.on('finish', () => resolve(filePath));
    out.on('error', reject);
  });
};

module.exports = generateCertificate;
