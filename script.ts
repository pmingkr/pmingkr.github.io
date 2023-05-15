function add(name: string) {
  const image = document.createElement("img");
  image.src = `./files/${name}.png`;
  image.onclick = () => {
    location.href = `./files/${name}.html`;
  };
  document.body.appendChild(image);
}

add("fractal");
add("geodesic");
add("wiring");

// const canvas = document.createElement("canvas");
// canvas.style.width = "100%";
// canvas.style.height = "100%";
// canvas.style.display = "block";
// document.body.style.width = "100%";
// document.body.style.height = "100%";
// document.body.style.margin = "0";
// document.body.style.overflow = "hidden";
// document.body.appendChild(canvas);

// const pixelRatio = window.devicePixelRatio ?? 1;

// function updateCanvasSize() {
//   canvas.width = window.innerWidth * pixelRatio;
//   canvas.height = window.innerHeight * pixelRatio;
// }
// window.addEventListener("resize", updateCanvasSize);
// updateCanvasSize();

// const ctx = canvas.getContext("2d")!;

// function circle(x: number, y: number, radius: number, color: string) {
//   ctx.fillStyle = color;
//   ctx.strokeStyle = "black";
//   ctx.beginPath();
//   ctx.arc(x, y, radius, 0, Math.PI * 2);
//   ctx.fill();
//   ctx.stroke();
// }
// function clamp(min: number, x: number, max: number) {
//   return x < min ? min : x > max ? max : x;
// }

// const DOT_COUNT = 8;
// const JUMP_DURATION = 1800;

// class Position {
//   public x = 0;
//   public y = 0;
//   public z = 0;

//   updateWave(i: number, jumpHeight: number, jumpZ: number): void {
//     const jumperX = (tick % JUMP_DURATION) * 0.5 - 400;
//     const JUMP_W = 200;

//     this.x = (i - (DOT_COUNT - 1) / 2) * 70;
//     let jump =
//       ((clamp(-JUMP_W, this.x - jumperX, JUMP_W) + JUMP_W) * Math.PI) / JUMP_W;
//     jump = 0.5 - Math.cos(jump) / 2;
//     this.y = -jump * jumpHeight;
//     this.z = jump * jumpZ;
//   }
//   updateRot(i: number, radius: number): void {
//     const angle = (-tick - 1000) / 300 + (i * Math.PI * 2) / DOT_COUNT;
//     this.x = Math.cos(angle) * radius;
//     this.y = Math.sin(angle) * radius;
//   }

//   mix(a: Position, b: Position, rate: number) {
//     rate = clamp(0, rate, 1);
//     rate = 0.5 - Math.cos(rate * Math.PI) * 0.5;
//     let irate = 1 - rate;
//     this.x = b.x * rate + a.x * irate;
//     this.y = b.y * rate + a.y * irate;
//     this.z = b.z * rate + a.z * irate;
//   }

//   circle(radius: number, color: string) {
//     const CAMERA_Z = -200;

//     const z = (this.z - CAMERA_Z) / -CAMERA_Z;
//     circle(this.x / z, this.y / z, radius / z, color);
//   }

//   hitTest(radius: number): boolean {
//     const rx = mouseX - this.x;
//     const ry = mouseY - this.y;
//     return rx * rx + ry * ry <= radius * radius;
//   }
// }

// let hover: Dot | null = null;

// class Dot {
//   public readonly pos = new Position();

//   constructor() {}

//   update(i: number): void {
//     if (this.pos.hitTest(15)) {
//       hover = this;
//     }
//     const AXIS = JUMP_DURATION * 2.2;
//     const wave = new Position();
//     if (tick > JUMP_DURATION * 2) {
//       wave.updateWave(i, 200, -50);
//     } else {
//       wave.updateWave(i, 100, 0);
//     }
//     const rot = new Position();
//     rot.updateRot(i, 80);

//     this.pos.mix(wave, rot, ((tick - AXIS - i * 50) * 2) / 1000);
//   }

//   draw(): void {
//     this.pos.circle(10, hover === this ? "#c22" : "#4c8");
//   }
// }

// const WIDTH = 800;
// const HEIGHT = 480;
// const start = performance.now();
// let tick = 0;
// let screenScale = 1;
// let screenOffsetX = 0;
// let screenOffsetY = 0;
// let mouseX = -100;
// let mouseY = -100;

// class Line {
//   private readonly dots: Dot[] = [];
//   constructor() {
//     for (let i = 0; i < DOT_COUNT; i++) {
//       this.dots.push(new Dot());
//     }
//   }

//   draw(): void {
//     hover = null;

//     ctx.resetTransform();
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     {
//       const xscale = canvas.width / WIDTH;
//       const yscale = canvas.height / HEIGHT;
//       const scale = Math.min(xscale, yscale);
//       const x = canvas.width / 2;
//       const y = canvas.height / 2;
//       ctx.setTransform(scale, 0, 0, scale, x, y);
//       screenScale = pixelRatio / scale;
//       screenOffsetX = -x / scale;
//       screenOffsetY = -y / scale;
//     }

//     for (let i = 0; i < DOT_COUNT; i++) {
//       this.dots[i].update(i);
//     }

//     const d = this.dots[0];
//     ctx.strokeStyle = "black";
//     ctx.lineWidth = 3;
//     ctx.beginPath();
//     ctx.moveTo(d.pos.x, d.pos.y);
//     for (let i = 1; i < DOT_COUNT; i++) {
//       const d = this.dots[i];
//       ctx.lineTo(d.pos.x, d.pos.y);
//     }
//     ctx.stroke();

//     for (const dot of this.dots) {
//       dot.draw();
//     }
//   }
// }

// window.addEventListener("mousemove", (ev) => {
//   mouseX = ev.clientX * screenScale + screenOffsetX;
//   mouseY = ev.clientY * screenScale + screenOffsetY;
// });

// const line = new Line();
// function render() {
//   tick = performance.now() - start;
//   requestAnimationFrame(render);
//   line.draw();
// }

// requestAnimationFrame(render);
