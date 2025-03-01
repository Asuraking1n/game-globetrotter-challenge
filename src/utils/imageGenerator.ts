export const generateShareImage = async (username: string, score: { correct: number; incorrect: number }) => {

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  

  ctx.fillStyle = '#4299e1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, 'rgba(66, 153, 225, 0.8)');
  gradient.addColorStop(1, 'rgba(49, 130, 206, 0.9)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < 5; i++) {
    const size = Math.random() * 200 + 50;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Globetrotter Challenge', canvas.width / 2, 150);
  

  ctx.font = 'bold 48px Arial';
  ctx.fillText(`${username} challenges you!`, canvas.width / 2, 250);
  

  ctx.font = '36px Arial';
  ctx.fillText(`Score: ${score.correct} correct, ${score.incorrect} incorrect`, canvas.width / 2, 350);
  
  ctx.font = 'bold 42px Arial';
  ctx.fillText('Can you beat this score?', canvas.width / 2, 450);
  
  ctx.font = '28px Arial';
  ctx.fillText('Click the link to play now!', canvas.width / 2, 550);
  
  return canvas.toDataURL('image/png');
}; 