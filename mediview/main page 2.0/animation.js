document.addEventListener('DOMContentLoaded', function() {
  // Wait for DOM to be fully loaded
  const canvas = document.getElementById('networkCanvas');
  
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const ctx = canvas.getContext('2d'); // Changed from '3d' to '2d' for 2D rendering
  
  if (!ctx) {
    console.error('Could not get 2D context');
    return;
  }


  // Function to check if dark mode is active
  function isDarkMode() {
    return document.body.classList.contains('dark-mode');
  }

  // Function to get particle color based on mode
  function getParticleColor() {
    if (isDarkMode()) {
      return 'rgba(255, 255, 255, 0.6)'; // White particles for dark mode
    } else {
      return 'rgba(102, 126, 234, 0.5)'; // Purple particles for light mode
    }
  }

  // Function to get connection color based on mode
  function getConnectionColor(opacity) {
    if (isDarkMode()) {
      return `rgba(255, 255, 255, ${opacity * 0.4})`; // White connections for dark mode
    } else {
      return `rgba(102, 126, 234, ${opacity * 0.3})`; // Purple connections for light mode
    }
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = getParticleColor();
      ctx.shadowBlur = isDarkMode() ? 10 : 5;
      ctx.shadowColor = isDarkMode() ? 'rgba(255, 255, 255, 0.5)' : 'rgba(102, 126, 234, 0.5)';
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow
    }
  }


  let particles = [];
  let animationId = null;

  function resizeCanvas() {
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reinitialize particles on resize
    if (particles.length === 0) {
      initParticles();
    }
  }


  function initParticles() {
    particles = Array(60).fill().map(() => new Particle());
  }

  function drawConnections() {
    if (!ctx) return;
    
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          const opacity = 1 - dist/150;
          ctx.strokeStyle = getConnectionColor(opacity);
          ctx.lineWidth = isDarkMode() ? 1 : 0.8;
          ctx.stroke();
        }
      });
    });
  }

  function animate() {
    if (!ctx || !canvas) {
      console.error('Canvas or context not available');
      return;
    }

    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  // Initialize everything
  function init() {
    resizeCanvas();
    initParticles();
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    animate();
  }


  init();

  // Watch for dark mode changes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class') {
        // Dark mode changed, colors will update automatically on next frame
        console.log('Dark mode toggled, animation colors will update');
      }
    });
  });

  // Start observing body class changes
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Cleanup function
  window.addEventListener('beforeunload', function() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    observer.disconnect();
    window.removeEventListener('resize', resizeCanvas);
  });
});