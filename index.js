Pts.namespace(this);

Pts.quickStart('#pt', '#eee');

let noiseGrid = [];

// Lab max value range (100, 127, 127)
let cu = Color.lab(Color.maxValues('lab'));
let r = 200;

let color = (p, a = 1) => {
  let c = Color.from(
    Math.cos(p.noise2D()),
    Math.sin(p.noise2D()),
    Math.tan(p.noise2D()),
  );
  let c1 = cu.$multiply(Pt.make(4, 1).to(c, c - 0.5, c - 0.5));
  let rgb = Color.LABtoRGB(c1);
  return Color.from(rgb.r, rgb.g, rgb.b, a).toString('rgba');
};

space.add({
  start: bound => {
    let gd = Create.gridPts(
      space.innerBound,
      space.height / 75,
      space.width / 75,
    );
    noiseGrid = Create.noisePts(gd, 0.5, 0.5, 20, 20);
  },

  animate: (time, ftime) => {
    let range = Circle.fromCenter(space.pointer, r);

    noiseGrid.forEach(p => {
      p.step(0.02, 0.02);
      let radius = Math.abs(p.noise2D() * space.size.y) / 28;

      if (Circle.withinBound(range, p)) {
        let dist = (r - p.$subtract(space.pointer).magnitude()) / r;
        let np = p
          .$subtract(space.pointer)
          .scale(1 + dist)
          .add(space.pointer);
        form.fillOnly(color(p, 0.1)).point(np, radius + 70, 'circle');
        form.fillOnly(color(p)).point(np, radius, 'circle');
      } else {
        form.fillOnly(color(p, 0.1)).point(p, radius + 70, 'circle');
        form.fillOnly(color(p)).point(p, radius, 'circle');
      }
    });
  },
});

space
  .bindMouse()
  .bindTouch()
  .play();
