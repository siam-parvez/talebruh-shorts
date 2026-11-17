// Extra cut-paper pieces shared by these shorts.
import { ctx, W, H, TAU, clamp, lerp, rnd, rr, circle, line } from './core/lib.js';
import { Wd } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

export const NIGHT = '#2F3550';
export function nightPage(seed) { K.parchment(seed); ctx.save(); ctx.globalAlpha = 0.86; ctx.fillStyle = NIGHT; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); for (let i = 0; i < 30; i++) circle(rnd(i + seed) * W, rnd(i + 40 + seed) * 900, 3 + rnd(i) * 3, '#E9DCBC'); }
export function dayPage(seed, ground = 1450, gcol = P.sepia) { K.parchment(seed); ctx.fillStyle = P.sky; ctx.fillRect(-300, -300, W + 600, ground + 300); cut(P_rr(-300, ground, W + 600, 900, 0), gcol, { shadow: 0, edge: 0 }); }
export function ground(y, col = '#4A3A2E') { cut(P_rr(-300, y, W + 600, 900, 0), col, { shadow: 0, edge: 0 }); }
/** word time that never throws */
export function Wf(word, line, fb) { try { return Wd(word, line); } catch (e) { return fb; } }
function eob(t) { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
/** pop-in scale: 0 before `at`, overshoots to 1 over d seconds */
export const pop = (lt, at, d = 0.3) => (lt > at ? eob(clamp((lt - at) / d)) : 0);

/** paper horse standing on (x, y), facing dir, s scale, gallop phase g (null = standing) */
export function horse(x, y, s = 1, dir = 1, col = '#8A5A3A', g = null, mane = '#3E2C1E') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  const k = g == null ? 0 : Math.sin(g);
  const leg = (lx, ph) => cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(lx, -200); ctx.rotate(g == null ? 0 : Math.sin(g + ph) * 0.45); ctx.roundRect(-14, 0, 28, 200, 10); ctx.restore(); }, col, { shadow: 0.5, edge: 4 });
  leg(-110, 0); leg(90, Math.PI);
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -250 + k * 6, 170, 80, 0, 0, TAU); }, col, { shadow: 0.7, edge: 5 });
  cut(P_poly([[100, -300], [150, -430], [200, -440], [190, -380], [150, -260]]), col, { shadow: 0.5, edge: 5 });
  cut(() => { ctx.beginPath(); ctx.ellipse(215, -420, 70, 34, 0.5, 0, TAU); }, col, { shadow: 0.5, edge: 5 });
  cut(P_poly([[110, -300], [150, -440], [130, -440], [90, -300]]), mane, { shadow: 0, edge: 3 });
  cut(P_poly([[-165, -270], [-230, -170 + k * 20], [-200, -165 + k * 20], [-150, -240]]), mane, { shadow: 0.3, edge: 3 });
  leg(-70, Math.PI); leg(130, 0);
  circle(215, -435, 7, P.ink);
  ctx.restore();
}
/** gold crown, centred at (x, y), scale s */
export function crown(x, y, s = 1) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_poly([[-70, 30], [-80, -50], [-40, -10], [0, -70], [40, -10], [80, -50], [70, 30]]), P.gold, { shadow: 0.6, edge: 4 }); circle(0, 5, 12, P.crimson); ctx.restore(); }
export function heart(x, y, s = 1, col = P.crimson) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(0, 40); ctx.bezierCurveTo(-90, -20, -50, -90, 0, -45); ctx.bezierCurveTo(50, -90, 90, -20, 0, 40); }, col, { shadow: 0.5, edge: 4 }); ctx.restore(); }
export function coins(x, y, s = 1) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (let i = 0; i < 5; i++) cut(() => { ctx.beginPath(); ctx.ellipse(0, -i * 22, 70, 24, 0, 0, TAU); }, i % 2 ? '#D9A93A' : P.gold, { shadow: 0.4, edge: 3 }); ctx.restore(); }
export function scroll(x, y, s = 1) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-80, -100, 160, 200, 6), P.edge); for (const yy of [-100, 100]) cut(() => { ctx.beginPath(); ctx.ellipse(0, yy, 95, 20, 0, 0, TAU); }, P.stone, { shadow: 0.3, edge: 3 }); for (let i = 0; i < 4; i++) line([[-50, -50 + i * 32], [50, -50 + i * 32]], P.sepia, 6); ctx.restore(); }
export function sword(x, y, s = 1, rot = -0.6) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); cut(P_poly([[-14, -180], [0, -220], [14, -180], [14, 40], [-14, 40]]), '#C9C2B5', { shadow: 0.5, edge: 3 }); cut(P_rr(-60, 40, 120, 22, 8), P.gold, { shadow: 0.4, edge: 3 }); cut(P_rr(-12, 62, 24, 70, 8), P.wine, { shadow: 0.3, edge: 3 }); ctx.restore(); }
/** a big crimson X stamp */
export function xMark(x, y, s = 1) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (const r of [0.78, -0.78]) cut(() => { ctx.beginPath(); ctx.save(); ctx.rotate(r); ctx.roundRect(-30, -170, 60, 340, 20); ctx.restore(); }, P.crimson, { shadow: 0.6, edge: 0 }); ctx.restore(); }
/** brown molasses wave; x = leading edge, y = ground, h height, t time */
export function wave(x, y, h, t, col = '#5A3416', hi = '#7A4A22') {
  cut(() => { ctx.beginPath(); ctx.moveTo(-400, y + 900); ctx.lineTo(-400, y - h * 0.7); for (let xx = -400; xx < x - 160; xx += 40) ctx.lineTo(xx, y - h * 0.7 + Math.sin(xx * 0.01 + t * 3) * 18); ctx.bezierCurveTo(x - 60, y - h * 1.05, x + 120, y - h * 0.9, x + 90, y - h * 0.55); ctx.bezierCurveTo(x + 40, y - h * 0.62, x + 20, y - h * 0.4, x + 120, y); ctx.lineTo(x + 120, y + 900); ctx.closePath(); }, col, { shadow: 1, edge: 6 });
  ctx.strokeStyle = hi; ctx.lineWidth = 10; ctx.lineCap = 'round'; for (let i = 0; i < 4; i++) { const yy = y - h * 0.5 + i * h * 0.12; ctx.beginPath(); ctx.moveTo(x - 600, yy); ctx.quadraticCurveTo(x - 300, yy - 30 + Math.sin(t * 2 + i) * 10, x - 100, yy + 10); ctx.stroke(); }
}
/** paper dog (terrier mutt), standing on (x,y). o = { walk, coat, salute, mask } */
export function dog(x, y, s = 1, dir = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  const col = '#8A6142', patch = '#F2E6CF', g = o.walk; const k = g == null ? 0 : Math.sin(g);
  const leg = (lx, ph) => cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(lx, -110); ctx.rotate(g == null ? 0 : Math.sin(g + ph) * 0.4); ctx.roundRect(-16, 0, 32, 110, 12); ctx.restore(); }, col, { shadow: 0.5, edge: 4 });
  leg(-80, 0); leg(70, Math.PI);
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -150, 120, 62, 0, 0, TAU); }, col, { shadow: 0.7, edge: 5 });
  cut(() => { ctx.beginPath(); ctx.ellipse(30, -120, 60, 36, 0, 0, TAU); }, patch, { shadow: 0, edge: 0 });
  cut(P_poly([[-115, -170], [-160, -230 + k * 10], [-145, -240 + k * 10], [-105, -190]]), col, { shadow: 0.3, edge: 3 });
  if (o.coat) cut(P_rr(-90, -215, 150, 110, 30), o.coat, { shadow: 0.4, edge: 4 });
  const hx = 130, hy = -230 + (o.salute ? -20 : 0);
  cut(P_circ(hx, hy, 70), col, { shadow: 0.6, edge: 5 });
  cut(() => { ctx.beginPath(); ctx.ellipse(hx + 50, hy + 20, 42, 32, 0, 0, TAU); }, patch, { shadow: 0, edge: 0 });
  circle(hx + 82, hy + 8, 12, P.ink);
  cut(P_poly([[hx - 50, hy - 40], [hx - 70, hy - 120], [hx - 10, hy - 60]]), col, { shadow: 0.3, edge: 4 });
  cut(P_poly([[hx + 10, hy - 55], [hx + 20, hy - 130], [hx + 55, hy - 50]]), col, { shadow: 0.3, edge: 4 });
  circle(hx + 25, hy - 10, 9, P.ink);
  if (o.mask) { cut(() => { ctx.beginPath(); ctx.ellipse(hx + 40, hy + 15, 70, 50, 0, 0, TAU); }, '#5E6B4A', { shadow: 0.4, edge: 4 }); circle(hx + 20, hy - 5, 20, '#C9C2B5'); }
  if (o.salute) cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(90, -170); ctx.rotate(-2.2); ctx.roundRect(-16, 0, 32, 120, 12); ctx.restore(); }, col, { shadow: 0.5, edge: 4 });
  else leg(-40, Math.PI);
  leg(110, 0);
  ctx.restore();
}
