let pos = { x: 0, y: 0 };
let totalRotationX = 0;
let totalRotationY = 0;
let totalRotationZ = 0;

const dragger = document.getElementById('dragger');
const cube = document.getElementById('cube');

gsap.set('.face', {
  backgroundImage: 'url("images/fennec.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backfaceVisibility: 'hidden'
});

gsap.set(dragger, { opacity: 0 });

Draggable.create(dragger, {
  onDragStart: (e) => {
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
    
    const rx = (totalRotationX * Math.PI) / 180;
    const ry = (totalRotationY * Math.PI) / 180;
    const rz = (totalRotationZ * Math.PI) / 180;
    
    const rotateVector = (x, y, z) => {
      let x1 = x * Math.cos(ry) + z * Math.sin(ry);
      let y1 = y;
      let z1 = -x * Math.sin(ry) + z * Math.cos(ry);
      const x2 = x1;
      let y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
      let z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);
      const x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
      const y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
      const z3 = z2;
      return { x: x3, y: y3, z: z3 };
    };
    
    const faces = {
      front: rotateVector(0, 0, 1),
      back: rotateVector(0, 0, -1),
      right: rotateVector(1, 0, 0),
      left: rotateVector(-1, 0, 0),
      top: rotateVector(0, 1, 0),
      bottom: rotateVector(0, -1, 0)
    };
    
    const cameraDir = { x: 0, y: 0, z: -1 };
    const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
    
    let bestFace = 'front';
    let bestDot = -Infinity;
    for (const faceName in faces) {
      const d = dot(faces[faceName], cameraDir);
      if (d > bestDot) {
        bestDot = d;
        bestFace = faceName;
      }
    }
    
    const faceNormal = faces[bestFace];
    
    let upAxis = { x: 0, y: 1, z: 0 };
    
    if (Math.abs(faceNormal.y) > 0.9) {
      upAxis = { x: 0, y: 0, z: -1 };
    }
    
    const rightAxis = {
      x: upAxis.y * faceNormal.z - upAxis.z * faceNormal.y,
      y: upAxis.z * faceNormal.x - upAxis.x * faceNormal.z,
      z: upAxis.x * faceNormal.y - upAxis.y * faceNormal.x
    };
    const len = Math.sqrt(rightAxis.x**2 + rightAxis.y**2 + rightAxis.z**2);
    rightAxis.x /= len; rightAxis.y /= len; rightAxis.z /= len;
    
    const trueUp = {
      x: faceNormal.y * rightAxis.z - faceNormal.z * rightAxis.y,
      y: faceNormal.z * rightAxis.x - faceNormal.x * rightAxis.z,
      z: faceNormal.x * rightAxis.y - faceNormal.y * rightAxis.x
    };
    
    totalRotationX += deltaY * rightAxis.x;
    totalRotationY += deltaY * rightAxis.y;
    totalRotationZ += deltaY * rightAxis.z;

    gsap.to(cube, {
      rotationY: totalRotationY,
      rotationX: totalRotationX,
      rotationZ: totalRotationZ,
      duration: 0.5,
      onUpdate: () => {
        const rotY = gsap.getProperty(cube, 'rotationY') || 0;
        gsap.set('.face', {
          opacity: (i) => Math.max(0.3, 1 - gsap.utils.wrapYoyo(0, 90, Math.abs(rotY + (i * 90))) / 90)
        });
      }
    });

    pos.x = Math.round(e.clientX);
    pos.y = Math.round(e.clientY);
  },

  onDragEnd: () => gsap.set(dragger, { x: 0, y: 0 })
});