let pos = { x: 0 };

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
    if (e.touches) e.clientX = e.touches[0].clientX;
    pos.x = Math.round(e.clientX);
  },

  onDrag: (e) => {
    if (e.touches) e.clientX = e.touches[0].clientX;

    gsap.to(cube, {
      rotationY: '+=' + ((Math.round(e.clientX) - pos.x) % 360),
      onUpdate: () => {
        // simple lighting effect based on cube rotation
        const rot = gsap.getProperty(cube, 'rotationY') || 0;
        gsap.set('.face', {
          opacity: (i) => 1 - gsap.utils.wrapYoyo(0, 90, Math.abs(rot + (i * 90))) / 90
        });
      }
    });

    pos.x = Math.round(e.clientX);
  },

  onDragEnd: () => gsap.set(dragger, { x: 0, y: 0 })
});