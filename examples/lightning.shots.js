// STRUCK BY LIGHTNING 7 TIMES (Roy Sullivan): a 15 s loop Short. Everything is cut paper.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
import { ground, Wf, pop, xMark } from './extras.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

const STORM = '#232A40', BOLT = '#FFF6C8', GLOW = '#FFE27A';
function stormSky(seed, t, flash = 0) {
  K.parchment(seed); ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = STORM; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
  for (let i = 0; i < 5; i++) { const x = ((i * 300 + t * 30) % 1500) - 200, y = 180 + (i % 3) * 120; cut(() => { ctx.beginPath(); for (const [dx, r] of [[-110, 80], [0, 110], [110, 85], [200, 60]]) { ctx.moveTo(x + dx + r, y); ctx.arc(x + dx, y, r, 0, TAU); } }, '#3A4260', { shadow: 0.4, edge: 4 }); }
  ground(1450, '#1C2030');
  if (flash > 0) { ctx.save(); ctx.globalAlpha = clamp(flash) * 0.85; ctx.fillStyle = '#F4F1FF'; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); }
}
/** jagged bolt from (x0,y0) to (x1,y1); seed keeps the zig-zag stable; a 0..1 fades */
function bolt(x0, y0, x1, y1, seed, a = 1, w = 26) {
  if (a <= 0) return; const pts = []; const n = 9;
  for (let i = 0; i <= n; i++) { const k = i / n; pts.push([lerp(x0, x1, k) + (i && i < n ? (rnd(seed + i) - 0.5) * 160 : 0), lerp(y0, y1, k)]); }
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (const [col, lw, al] of [[GLOW, w * 2.6, 0.35], [BOLT, w, 1], ['#FFFFFF', w * 0.4, 1]]) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.globalAlpha = a * al; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
  ctx.restore();
}
/** strike envelope: 1 at the hit, gone after 0.28 s */
const hit = (lt, at) => (lt >= at && lt < at + 0.28 ? 1 - (lt - at) / 0.28 : 0);
function ranger(x, y, h, o = {}) {
  K.figure({ x, y, h, role: 'guard', dir: o.dir || 1, arm: o.arm || 0, walk: o.walk });
  if (o.hat !== false) { const hy = y - h * 0.86; cut(() => { ctx.beginPath(); ctx.ellipse(x, hy + 18, h * 0.16, h * 0.03, 0, 0, TAU); }, '#7A5A34', { shadow: 0.4, edge: 4 }); cut(P_poly([[x - h * 0.08, hy + 16], [x - h * 0.06, hy - h * 0.06], [x + h * 0.06, hy - h * 0.06], [x + h * 0.08, hy + 16]]), '#8C6A3E', { shadow: 0.4, edge: 4 }); }
}
function flame(x, y, s, t) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (const [dx, hh, col] of [[-40, 150, '#E8642C'], [40, 170, '#E8642C'], [0, 220, '#F08A2E'], [-15, 130, '#FFD24A'], [20, 120, '#FFD24A']]) cut(() => { ctx.beginPath(); ctx.moveTo(dx - 45, 0); ctx.quadraticCurveTo(dx - 40, -hh * 0.6, dx + Math.sin(t * 12 + dx) * 14, -hh - Math.sin(t * 9 + dx) * 15); ctx.quadraticCurveTo(dx + 40, -hh * 0.6, dx + 45, 0); ctx.closePath(); }, col, { shadow: 0.3, edge: 3 }); ctx.restore(); }
function shake(lt, at, amt = 18) { const k = hit(lt, at); return k ? [Math.sin(lt * 90) * amt * k, Math.cos(lt * 70) * amt * k] : [0, 0]; }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.06);

  // 0 · this man was struck by lightning 7 times: a bolt at once, then a tally to 7
  { const lg = Wf('lightning', 0, 0.9), sv = Wf('seven', 0, 1.5);
    const end = L(1) - 0.15; const strikes = [0.05]; for (let i = 0; i < 6; i++) strikes.push(lg + (end - lg) * i / 5.6);
    add({ id: 'S01', at: 0, cam: [540, 1050], zoom: 0.12, note: 'storm, the ranger gets hit, a tally counts to 7', draw(lt, d, t) {
      const f = Math.max(...strikes.map((s) => hit(lt, s)));
      const [sx, sy] = strikes.reduce((a, s) => { const v = shake(lt, s); return [a[0] + v[0], a[1] + v[1]]; }, [0, 0]);
      ctx.save(); ctx.translate(sx, sy);
      stormSky(1, t, f * 0.7); ranger(540, 1450, 1000, { arm: f ? 150 : 20 });
      strikes.forEach((s, i) => bolt(500 + (i % 2) * 80, -100, 540, 1450 - 1000 * 0.86, 10 + i, hit(lt, s)));
      const n = strikes.filter((s) => lt >= s).length;
      K.slip(`STRUCK ${n}x`, 540, 330, pop(lt, 0.05, 0.2) * (n >= 7 ? 1.25 : 1), -0.03, 84);
      ctx.restore();
    } });
    strikes.forEach((s, i) => cue(s, i < 2 ? 'slam' : 'thud', { gain: i < 2 ? 1 : 0.5 })); }

  // 1 · and he survived every single one
  { const st = cut_(1), ev = Wf('every', 1, st + 0.8) - st;
    add({ id: 'S02', at: st, cam: [540, 1100], zoom: 0.1, note: 'smoking ranger stands, arm up: SURVIVED ALL 7', draw(lt, d, t) {
      stormSky(2, t); ranger(540, 1450, 1000, { arm: 150 });
      ctx.save(); ctx.globalAlpha = 0.5; for (let i = 0; i < 4; i++) circle(500 + Math.sin(lt * 3 + i) * 30 + i * 25, 560 - ((lt * 160 + i * 70) % 300), 22 + i * 6, '#8F8A9A'); ctx.restore();
      K.slip('SURVIVED', 540, 330, pop(lt, 0.05, 0.25), -0.03, 90);
      K.slip('ALL 7', 860, 470, pop(lt, ev), 0.04, 90);
    } });
    cue(st + 0.05, 'pop'); cue(st + ev, 'sparkle', { dur: 0.6 }); }

  // 2 · it burned off his toenail, his eyebrows
  { const st = cut_(2), tn = Wf('toenail', 2, st + 0.9) - st - 0.35, eb = Wf('eyebrows', 2, st + 1.7) - st - 0.4;
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.06, note: 'two hits: a boot (toenail) then a face (eyebrows)', draw(lt, d, t) {
      const f = Math.max(hit(lt, tn), hit(lt, eb)); stormSky(3, t, f * 0.6);
      if (lt < eb - 0.1) {
        ranger(540, 1450, 1000, { arm: hit(lt, tn) ? 150 : 20 });
        bolt(600, -100, 590, 1440, 30, hit(lt, tn)); if (lt > tn) xMark(600, 1420, pop(lt, tn, 0.2) * 0.35);
        K.slip('TOENAIL', 540, 330, pop(lt, tn), -0.03, 80);
      } else {
        cut(P_circ(540, 980, 300), P.skin, { shadow: 0.8, edge: 6 }); cut(() => { ctx.beginPath(); ctx.ellipse(540, 720, 400, 70, 0, 0, TAU); }, '#7A5A34', { shadow: 0.5, edge: 5 }); cut(P_poly([[360, 710], [400, 500], [680, 500], [720, 710]]), '#8C6A3E', { shadow: 0.5, edge: 5 }); circle(430, 980, 26, P.ink); circle(650, 980, 26, P.ink);
        if (lt < eb + 0.05) { line([[380, 900], [480, 890]], P.ink, 22); line([[600, 890], [700, 900]], P.ink, 22); }
        else { ctx.save(); ctx.globalAlpha = 0.6; for (let i = 0; i < 3; i++) circle(430 + i * 110, 880 - (lt - eb) * 200, 20, '#8F8A9A'); ctx.restore(); }
        cut(P_rr(420, 1120, 240, 30, 15), P.ink, { shadow: 0, edge: 0 });
        bolt(500, -100, 540, 520, 31, hit(lt, eb));
        K.slip('EYEBROWS', 540, 330, pop(lt, eb), 0.03, 80);
      }
    } });
    cue(st + tn, 'slam', { gain: 0.8 }); cue(st + eb, 'slam', { gain: 0.8 }); }

  // 3 · and set his hair on fire
  { const st = cut_(3), fi = Wf('fire', 3, st + 0.9) - st, ha = Wf('hair', 3, st + 0.5) - st;
    add({ id: 'S04', at: st, cam: [540, 1100], zoom: 0.14, note: 'bolt hits the hat, his head bursts into flame', draw(lt, d, t) {
      const f = hit(lt, ha); stormSky(4, t, f * 0.6);
      ranger(540, 1450, 1000, { hat: lt < ha, arm: lt > fi ? 160 + Math.sin(lt * 20) * 10 : 30 });
      bolt(520, -100, 540, 560, 40, f);
      if (lt > ha) flame(540, 1450 - 1000 * 0.86, pop(lt, ha, 0.25) * 1.3, t);
      K.slip('HAIR ON FIRE', 540, 300, pop(lt, fi), -0.03, 80);
    } });
    cue(st + ha, 'slam'); cue(st + fi, 'whoosh'); }

  // 4 · so he kept a can of water in his truck
  { const st = cut_(4), wa = Wf('water', 4, st + 0.9) - st - 0.5, tr = Wf('truck', 4, st + 1.7) - st;
    add({ id: 'S05', at: st, cam: [540, 1100], zoom: 0.08, note: 'his truck with a big water can', draw(lt, d, t) {
      stormSky(5, t);
      const x = 540 + Math.sin(lt * 2) * 6;
      cut(P_rr(x - 420, 1050, 840, 260, 30), '#4E6B4A', { shadow: 0.8, edge: 6 }); cut(P_rr(x - 120, 820, 360, 260, 30), '#4E6B4A', { shadow: 0.8, edge: 6 }); cut(P_rr(x - 80, 860, 260, 140, 14), '#9FC2D6', { shadow: 0, edge: 4 });
      for (const wx of [x - 260, x + 260]) { cut(P_circ(wx, 1320, 90), P.ink, { shadow: 0.6, edge: 4 }); circle(wx, 1320, 34, P.stone); }
      const s = pop(lt, wa) * 1.2; if (s > 0) { ctx.save(); ctx.translate(x - 260, 960); ctx.scale(s, s); cut(P_rr(-80, -120, 160, 200, 20), P.royal, { shadow: 0.6, edge: 5 }); cut(P_rr(-30, -160, 60, 50, 10), P.royal, { shadow: 0.4, edge: 4 }); ctx.font = '700 64px Caladea'; ctx.fillStyle = P.edge; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('WATER', 0, -20); ctx.restore(); }
      K.slip('JUST IN CASE', 540, 330, pop(lt, tr), 0.03, 70);
    } });
    cue(st + 0.05, 'whoosh'); cue(st + wa, 'pop'); cue(st + tr, 'pop'); }

  // 5 · people started avoiding him
  { const st = cut_(5), av = Wf('avoiding', 5, st + 0.7) - st;
    add({ id: 'S06', at: st, cam: [540, 1100], zoom: 0.08, note: 'people walk away from him on both sides', draw(lt, d, t) {
      stormSky(6, t); const p = eo(seg(lt, av - 0.2, d));
      ranger(540, 1450, 900, {});
      for (const [x0, dir] of [[320, -1], [180, -1], [760, 1], [900, 1]]) K.figure({ x: x0 + dir * p * 420, y: 1450, h: 560, role: 'merchant', dir, walk: lt * 12 });
      K.slip('NOPE.', 540, 330, pop(lt, av), -0.04, 90);
    } });
    cue(st + av, 'boing', { gain: 0.5 }); }

  // 6 · because nobody wanted to stand next to... (loops back into "this man")
  { const st = cut_(6), nx = Wf('next', 6, st + 1.4) - st;
    add({ id: 'S07', at: st, cam: [540, 1050], zoom: 0.12, note: 'he stands alone in the storm, same frame as the opening (loop)', draw(lt, d, t) {
      stormSky(1, t); ranger(540, 1450, 1000, { arm: 20 });
      K.slip('STAND NEXT TO...', 540, 330, pop(lt, nx - 0.3), -0.03, 70);
    } });
    cue(st + nx - 0.3, 'pop', { gain: 0.5 }); }

  return { shots: S, cues: CUES };
}
