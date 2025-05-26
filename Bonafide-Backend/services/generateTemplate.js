const { createCanvas, loadImage } = require('canvas');
const path = require('path');

const generateCertificate = async ({ name, regNumber, department, degree = "Bachelor of Technology", date = new Date() }) => {
  // Horizontal orientation (landscape)
  const width = 1200;
  const height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Add CUTM watermark (semi-transparent)
  ctx.fillStyle = 'rgba(200, 200, 200, 0.1)';
  ctx.font = 'bold 120px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CUTM', width / 2, height / 2);

  // Load logos
  const universitySeal = await loadImage(path.join(__dirname, '../logos/university_seal.png'));
  const bonafideLogo = await loadImage(path.join(__dirname, '../logos/bonafide_logo.png'));

  // Registration info at top left
  ctx.fillStyle = '#000';
  ctx.font = '16px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Reg. No. ${regNumber}`, 50, 50);
  ctx.fillText('S1. No. 0392/01-14/2018', 50, 80);

  // University branding at top center
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Centurion', width / 2, 50);
  ctx.font = 'bold 36px Arial';
  ctx.fillText('UNIVERSITY', width / 2, 90);

  // University full name and details
  ctx.font = 'bold 22px Arial';
  ctx.fillText('CENTURION UNIVERSITY OF TECHNOLOGY AND MANAGEMENT, ODISHA', width / 2, 140);
  ctx.font = 'italic 18px Arial';
  ctx.fillText('Shaping Lives, Empowering Communities...', width / 2, 170);
  ctx.font = '14px Arial';
  ctx.fillText('(Estd. Vide Odisha Act 4 of 2010 & u/s 2 (f) of UGC Act, 1956)', width / 2, 200);

  // Main certificate text
  ctx.font = '24px Times New Roman';
  const certificateText = [
    `This is to certify that ${name.toUpperCase()}`,
    `having fulfilled the academic requirements successfully during the academic year`,
    `has this day been admitted by the Governing Body to the Degree of`,
    `${degree} in ${department}`,
    `Given under the seal of the University`
  ];
  
  // Draw each line of text
  certificateText.forEach((line, index) => {
    ctx.fillText(line, width / 2, 300 + (index * 50));
  });

  // Date section
  ctx.textAlign = 'right';
  ctx.fillText(`Date: ${formatDate(date)}`, width - 100, 550);

  // Signature section
  ctx.textAlign = 'center';
  ctx.font = '20px Arial';
  ctx.fillText('Vice Chancellor', width / 2, 650);
  
  // Draw signature line
  ctx.beginPath();
  ctx.moveTo(width/2 - 150, 630);
  ctx.lineTo(width/2 + 150, 630);
  ctx.strokeStyle = '#000';
  ctx.stroke();

  // Bonafide verification section
  ctx.textAlign = 'left';
  ctx.font = '18px Arial';
  ctx.fillText('Verified by Bonafide', 100, 700);
  ctx.drawImage(bonafideLogo, 250, 670, 100, 50);

  // University seal at bottom right
  ctx.drawImage(universitySeal, width - 200, height - 150, 120, 120);

  // Return PNG buffer
  return canvas.toBuffer('image/png');
};

// Helper function to format date as "26th May, 2025"
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