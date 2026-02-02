let pos = { x: 0, y: 0 };
let autoSpinAnimation = null;
let totalRotationX = 0;
let totalRotationY = 0;
let totalRotationZ = 0;

const dragger = document.getElementById('dragger');
const cube = document.getElementById('cube');

// give each face a distinct color and hide backfaces (positioning handled by CSS)
gsap.set('.face', {
  backgroundImage: 'url("images/fennec.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backfaceVisibility: 'hidden'
});

gsap.set(dragger, { opacity: 0 });

Draggable.create(dragger, {
  onDragStart: (e) => {
    if (autoSpinAnimation) {
      autoSpinAnimation.kill();
      autoSpinAnimation = null;
    }
    if (e.touches) {
      e.clientX = e.touches[0].clientX;
      e.clientY = e.touches[0].clientY;
    }
    pos.x = Math.round(e.clientX);
    pos.y = Math.round(e.clientY);
  },

  onDrag: (e) => {
    if (e.touches) {
      e.clientX = e.touches[0].clientX;
      e.clientY = e.touches[0].clientY;
    }

    const deltaX = Math.round(e.clientX) - pos.x;
    const deltaY = Math.round(e.clientY) - pos.y;
    
    totalRotationY += deltaX;
    totalRotationX -= deltaY;

    gsap.to(cube, {
      rotationY: totalRotationY,
      rotationX: totalRotationX,
      duration: 0.5,
      onUpdate: () => {
        // simple lighting effect based on cube rotation
        const rotY = gsap.getProperty(cube, 'rotationY') || 0;
        const rotX = gsap.getProperty(cube, 'rotationX') || 0;
        gsap.set('.face', {
          opacity: (i) => {
            let rot = i < 4 ? rotY : rotX;
            return Math.max(0.3, 1 - gsap.utils.wrapYoyo(0, 90, Math.abs(rot + (i * 90))) / 90);
          }
        });
      }
    });

    pos.x = Math.round(e.clientX);
    pos.y = Math.round(e.clientY);
  },

  onDragEnd: () => gsap.set(dragger, { x: 0, y: 0 })
});

// Continuous slow spin
autoSpinAnimation = gsap.to(cube, {
  rotationY: 360,
  duration: 8,
  repeat: -1,
  ease: 'linear',
  onUpdate: () => {
    const rot = gsap.getProperty(cube, 'rotationY') || 0;
    gsap.set('.face', {
      opacity: (i) => Math.max(0.3, 1 - gsap.utils.wrapYoyo(0, 90, Math.abs(rot + (i * 90))) / 90)
    });
  }
});