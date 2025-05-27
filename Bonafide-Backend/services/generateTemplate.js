const { createCanvas, loadImage } = require('canvas');
const path = require('path');

const generateCertificate = async ({ name, regNumber, department, date = new Date() }) => {
  const width = 1200;
  const height = 850;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background - light cream color similar to the sample
  ctx.fillStyle = '#fff9e6';
  ctx.fillRect(0, 0, width, height);

  // Load logos - you'll need to have these logo files in your directory
  const universitySeal = await loadImage(path.join(__dirname, '../logos/university_seal.png'));
  const bonafideLogo = await loadImage(path.join(__dirname, '../logos/bonafide_logo.png'));

  // Draw university seal at top center
  ctx.drawImage(universitySeal, width/2 - 75, 30, 150, 150);

  // University name and details
  ctx.fillStyle = '#000';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('CENTURION UNIVERSITY OF TECHNOLOGY AND MANAGEMENT, ODISHA', width / 2, 220);

  // University tagline
  ctx.font = 'italic 20px Arial';
  ctx.fillText('Shaping Lives, Empowering Communities...', width / 2, 250);
  
  // Establishment info
  ctx.font = '14px Arial';
  ctx.fillText('(Estd. Vide Odisha Act 4 of 2010 & u/s 2 (f) of UGC Act, 1956)', width / 2, 280);

  // Main certificate text
  ctx.font = '22px Times New Roman';
  const certificateText = [
    `This is to certify that ${name.toUpperCase()}`,
    `having fulfilled the academic requirements successfully during the academic year`,
    `has this day been admitted by the Governing Body to the Degree of`,
    `Bachelor of Technology in ${department}`,
    `Given under the seal of the University`
  ];
  
  // Draw each line of text
  certificateText.forEach((line, index) => {
    ctx.fillText(line, width / 2, 350 + (index * 40));
  });

  // Registration number and serial number (positioned similar to sample)
  ctx.font = '16px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Reg. No. ${regNumber}`, 100, 150);
  ctx.fillText('S1. No. 0392/01-14/2018', 100, 180); // You might want to make this dynamic

  // Date section
  ctx.textAlign = 'right';
  ctx.fillText(`Date: ${formatDate(date)}`, width - 100, 600);

  // Signature section
  ctx.textAlign = 'center';
  ctx.fillText('Vice Chancellor', width / 2, 700);
  
  // Draw signature line
  ctx.beginPath();
  ctx.moveTo(width/2 - 100, 680);
  ctx.lineTo(width/2 + 100, 680);
  ctx.stroke();

  // Bonafide verification section
  ctx.textAlign = 'left';
  ctx.font = '16px Arial';
  ctx.fillText('Verified by Bonafide', 100, 750);
  ctx.drawImage(bonafideLogo, 250, 720, 100, 50);

  // University seal at bottom
  ctx.drawImage(universitySeal, width - 200, height - 150, 100, 100);

  // Return PNG buffer
  return canvas.toBuffer('image/png');
};

// Helper function to format date as "1st December, 2018"
function formatDate(date) {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  // Add ordinal suffix to day
  let suffix = 'th';
  if (day % 10 === 1 && day !== 11) suffix = 'st';
  else if (day % 10 === 2 && day !== 12) suffix = 'nd';
  else if (day % 10 === 3 && day !== 13) suffix = 'rd';
  
  return `${day}${suffix} ${month}, ${year}`;
}

module.exports = generateCertificate;