(function () {
  class Path {
    constructor(points) {
      this.pts = points.map(p => ({ x: p[0], y: p[1] }));
      this.segs = [];
      let acc = 0;
      for (let i = 0; i < this.pts.length - 1; i++) {
        const a = this.pts[i], b = this.pts[i + 1];
        const len = U.dist(a.x, a.y, b.x, b.y);
        this.segs.push({ a, b, len, start: acc, angle: U.angleTo(a.x, a.y, b.x, b.y) });
        acc += len;
      }
      this.total = acc;
    }
    at(d) {
      d = U.clamp(d, 0, this.total);
      for (let i = 0; i < this.segs.length; i++) {
        const s = this.segs[i];
        if (d <= s.start + s.len) {
          const t = (d - s.start) / s.len;
          return { x: U.lerp(s.a.x, s.b.x, t), y: U.lerp(s.a.y, s.b.y, t), angle: s.angle };
        }
      }
      const last = this.segs[this.segs.length - 1];
      return { x: last.b.x, y: last.b.y, angle: last.angle };
    }
    distToPath(x, y) {
      let best = Infinity;
      for (const s of this.segs) {
        const dx = s.b.x - s.a.x, dy = s.b.y - s.a.y;
        const l2 = dx * dx + dy * dy;
        let t = l2 ? ((x - s.a.x) * dx + (y - s.a.y) * dy) / l2 : 0;
        t = U.clamp(t, 0, 1);
        const px = s.a.x + dx * t, py = s.a.y + dy * t;
        best = Math.min(best, U.dist(x, y, px, py));
      }
      return best;
    }
  }
  window.TDPath = Path;
})();
