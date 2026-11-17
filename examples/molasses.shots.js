// BOSTON'S DEADLY MOLASSES WAVE (1919): the shot list. Everything is cut paper.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
import { NIGHT, dayPage, ground, Wf, pop, horse, wave } from './extras.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

const MOL = '#5A3416', MOL2 = '#7A4A22', WINTER = '#C9CFC9';
function winterPage(seed, gy = 1450) { K.parchment(seed); ctx.fillStyle = WINTER; ctx.fillRect(-300, -300, W + 600, gy + 300); ground(gy, '#8A8478'); }
/** a brick row house; squash 0..1 flattens it */
function rowHouse(x, y, w, h, col = '#A8503E', squash = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, 1 - squash * 0.75); ctx.rotate(squash * 0.15);
  cut(P_rr(-w / 2, -h, w, h, 4), col, { shadow: 0.7, edge: 5 }); cut(P_rr(-w / 2 - 10, -h - 24, w + 20, 30, 4), '#5E3B28', { shadow: 0.4, edge: 4 });
  for (let r = 0; r < 3; r++) for (const dx of [-0.25, 0.25]) { rr(dx * w - 20, -h + 40 + r * (h / 3.2), 40, 56, 3); ctx.fillStyle = '#3E2C1E'; ctx.fill(); }
  ctx.restore();
}
/** the steel tank: cylinder at (x, ground y), s scale, crack 0..1 */
function tank(x, y, s = 1, crack = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-260, -560, 520, 560, 10), '#8C8F8A', { shadow: 0.9, edge: 6 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -560, 260, 50, 0, Math.PI, TAU); ctx.lineTo(260, -560); ctx.closePath(); }, '#9EA19B', { shadow: 0.3, edge: 5 });
  for (let r = 0; r < 6; r++) for (let c = 0; c < 9; c++) circle(-220 + c * 55, -520 + r * 95, 6, '#5E615C');
  for (let r = 1; r < 6; r++) line([[-260, -560 + r * 95], [260, -560 + r * 95]], '#767973', 4);
  ctx.font = '700 64px Caladea'; ctx.fillStyle = '#3E2C1E'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('MOLASSES', 0, -280);
  if (crack > 0) { const k = clamp(crack); ctx.strokeStyle = MOL; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-40, -40); ctx.lineTo(-10, -40 - 160 * k); ctx.lineTo(-60, -40 - 260 * k); ctx.lineTo(-20, -40 - 420 * k); ctx.stroke(); }
  ctx.restore();
}
function clock(x, y, s, hr, mn) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_circ(0, 0, 150), P.edge, { shadow: 0.7, edge: 6 }); ctx.lineWidth = 8; ctx.strokeStyle = P.ink; ctx.beginPath(); ctx.arc(0, 0, 150, 0, TAU); ctx.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; circle(Math.sin(a) * 120, -Math.cos(a) * 120, i % 3 ? 6 : 10, P.ink); }
  const ah = (hr % 12 + mn / 60) / 12 * TAU, am = mn / 60 * TAU; line([[0, 0], [Math.sin(ah) * 75, -Math.cos(ah) * 75]], P.ink, 14); line([[0, 0], [Math.sin(am) * 115, -Math.cos(am) * 115]], P.crimson, 9); circle(0, 0, 14, P.ink);
  ctx.restore();
}
/** elevated railway: two posts and a girder; bend 0..1 sags the middle */
function elRail(y, bend = 0) {
  for (const x of [120, 960]) cut(P_rr(x - 30, y, 60, 1450 - y, 4), '#5E615C', { shadow: 0.6, edge: 4 });
  const sag = bend * 220;
  cut(() => { ctx.beginPath(); ctx.moveTo(-100, y - 40); ctx.quadraticCurveTo(540, y - 40 + sag * 2, 1180, y - 40); ctx.lineTo(1180, y + 40); ctx.quadraticCurveTo(540, y + 40 + sag * 2, -100, y + 40); ctx.closePath(); }, '#767973', { shadow: 0.8, edge: 5 });
}
function person(x, y, h, o = {}) { K.figure({ x, y, h, role: o.role || 'worker', dir: o.dir || 1, walk: o.walk, arm: o.arm }); }
/** molasses flood level at y, wobbling */
function flood(y, t, col = MOL) { cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.01 + t * 1.2) * 14); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, col, { shadow: 0.9, edge: 6 }); }
function harborWater(y, t, brown = 0) { const c = brown ? MOL2 : P.sea, c2 = brown ? MOL : P.seaDark; for (let i = 0; i < 3; i++) { const yy = y + i * 150; cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, yy); for (let x = -300; x <= W + 300; x += 40) ctx.lineTo(x, yy + Math.sin(x * 0.012 + t * 1.5 + i) * 20); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, i % 2 ? c2 : c, { shadow: 0.7, edge: 5 }); } }
const street = () => { for (let i = 0; i < 5; i++) rowHouse(110 + i * 215, 1450, 190, 420 + (i % 2) * 80, i % 2 ? '#9A4636' : '#A8503E'); };

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // 0 · a wave of molasses killed 21 people in Boston
  { const bo = Wf('boston', 0, 3);
    add({ id: 'S01', at: 0, cam: [540, 1100], zoom: 0.1, note: 'brown wave sweeps a Boston street', draw(lt, d, t) {
      winterPage(1); street();
      wave(lerp(-200, 1000, eio(clamp(lt / d))), 1450, 900, t);
      K.ribbon('BOSTON', 540, 330, pop(lt, 0.15, 0.4), 96); K.slip('21 KILLED', 540, 520, pop(lt, bo), -0.03, 60);
    } });
    cue(0.05, 'slide', { dur: 2.5, gain: 0.9 }); cue(0.2, 'pop', { gain: 0.6 }); cue(bo, 'pop'); }

  // 1 · January 15, 1919
  { const st = cut_(1), yr = Wf('nineteen', 1, st + 1.2) - st;
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.08, note: 'calm winter street, 1919 ribbon', draw(lt, d, t) {
      winterPage(2); street();
      person(300 + lt * 40, 1450, 380, { walk: lt * 6 }); horse(750, 1450, 0.7, -1, '#6E4A32', lt * 5);
      K.slip('JANUARY 15', 540, 560, pop(lt, 0.1), -0.03, 60);
      K.ribbon('1919', 540, 340, pop(lt, yr, 0.4));
    } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.5 }); cue(st + yr, 'pop'); }

  // 2 · a giant tank by the harbor, 2 million gallons
  { const st = cut_(2), mi = Wf('million', 2, st + 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1050], zoom: 0.08, note: 'giant riveted tank by the harbor', draw(lt, d, t) {
      K.parchment(3); ctx.fillStyle = WINTER; ctx.fillRect(-300, -300, W + 600, 1600); harborWater(1300, t);
      cut(P_rr(-300, 1250, 1180, 60, 0), '#8A8478', { shadow: 0.4, edge: 0 });
      tank(360, 1260, 1.2);
      person(800, 1255, 300, {});
      K.slip('2,000,000+ GALLONS', 540, 470, pop(lt, mi), 0.02, 60);
      K.slip('NORTH END, BOSTON', 540, 300, pop(lt, 0.15), -0.02, 50);
    } });
    cue(st, 'whoosh'); cue(st + mi, 'pop'); }

  // 3 · just after noon, it burst
  { const st = cut_(3), bu = Wf('burst', 3, st + 1.3) - st;
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.06, note: 'clock after noon, tank cracks and bursts', draw(lt, d, t) {
      K.parchment(4); ctx.fillStyle = WINTER; ctx.fillRect(-300, -300, W + 600, 1750); ground(1450, '#8A8478');
      const sh = lt > bu ? Math.sin(lt * 60) * 8 * clamp(1 - (lt - bu) * 2) : 0;
      ctx.save(); ctx.translate(sh, 0); tank(540, 1450, 1.2, seg(lt, bu - 0.4, bu)); ctx.restore();
      if (lt > bu) { const p = eo(seg(lt, bu, bu + 0.7)); cut(() => { ctx.beginPath(); ctx.moveTo(500, 1450); ctx.bezierCurveTo(540 - 300 * p, 1450 - 600 * p, 540 - 700 * p, 1450 - 200 * p, 540 - 900 * p, 1450); ctx.lineTo(540 + 900 * p, 1450); ctx.bezierCurveTo(540 + 700 * p, 1450 - 200 * p, 540 + 300 * p, 1450 - 600 * p, 580, 1450); ctx.closePath(); }, MOL, { shadow: 1, edge: 6 }); }
      clock(540, 300, 0.9, 12, 40);
    } });
    cue(st, 'whoosh'); cue(st + bu - 0.4, 'tock', { gain: 0.6 }); cue(st + bu, 'slam'); cue(st + bu + 0.1, 'slide', { dur: 1.2 }); }

  // 4 · a wave taller than a house
  { const st = cut_(4), ho = Wf('house', 4, st + 1.4) - st;
    add({ id: 'S05', at: st, cam: [540, 1100], zoom: 0.08, note: 'the wave towers over a house', draw(lt, d, t) {
      winterPage(5); rowHouse(760, 1450, 300, 520);
      wave(lerp(80, 400, eio(clamp(lt / d))), 1450, 1050, t);
      if (lt > ho) K.slip('TALLER THAN A HOUSE', 540, 300, pop(lt, ho), -0.02, 56);
    } });
    cue(st, 'slide', { dur: 2.4 }); cue(st + ho, 'pop'); }

  // 5 · faster than anyone could run
  { const st = cut_(5), ru = Wf('run', 5, st + 1.1) - st;
    add({ id: 'S06', at: st, cam: [540, 1150], zoom: 0.06, note: 'a man runs, the wave catches up', draw(lt, d, t) {
      winterPage(6); const px = 700 + lt * 60; person(px, 1450, 420, { walk: lt * 14, arm: 40 });
      wave(lerp(200, 600, eio(clamp(lt / d))), 1450, 820, t);
      K.slip('RUN!', 760, 360, pop(lt, ru), 0.04, 80);
    } });
    cue(st, 'whoosh'); cue(st + ru, 'pop'); }

  // 6 · flattened buildings, bent the steel of an elevated railway
  { const st = cut_(6), fl = Wf('flattened', 6, st + 0.3) - st, be = Wf('bent', 6, st + 1.2) - st;
    add({ id: 'S07', at: st, cam: [540, 1050], zoom: 0.06, note: 'houses squash, the elevated railway girder sags', draw(lt, d, t) {
      winterPage(7); elRail(620, eo(seg(lt, be, be + 0.6)));
      for (let i = 0; i < 4; i++) rowHouse(150 + i * 260, 1450, 220, 420, i % 2 ? '#9A4636' : '#A8503E', eo(seg(lt, fl + i * 0.15, fl + i * 0.15 + 0.3)));
      flood(lerp(1450, 1280, eo(seg(lt, fl, fl + 1))), t);
      K.slip('ELEVATED RAILWAY', 540, 420, pop(lt, be), -0.02, 50);
    } });
    cue(st, 'whoosh'); for (let i = 0; i < 4; i++) cue(st + fl + i * 0.15, 'thud', { gain: 0.5 }); cue(st + be, 'slam', { gain: 0.6 }); }

  // 7 · trapped people and horses like flies in syrup
  { const st = cut_(7), sy = Wf('syrup', 7, st + 2.2) - st;
    add({ id: 'S08', at: st, cam: [540, 1150], zoom: 0.1, note: 'a horse and a man stuck waist-deep in molasses', draw(lt, d, t) {
      winterPage(8); for (let i = 0; i < 5; i++) rowHouse(110 + i * 215, 1450, 190, 420, '#7E4A3C');
      horse(720, 1500 + lt * 20, 1.0, -1, '#6E4A32', null); person(300, 1500 + lt * 15, 520, { arm: 120 + Math.sin(lt * 5) * 15 });
      flood(1230, t);
      if (lt > sy) for (let i = 0; i < 3; i++) circle(440 + i * 120, 1260 + (lt - sy) * 60 + i * 10, 12, MOL2);
    } });
    cue(st, 'whoosh'); cue(st + 0.3, 'gulp', { gain: 0.6 }); cue(st + sy, 'plop'); }

  // 8 · 21 dead, over 150 hurt
  { const st = cut_(8), hu = Wf('hundred', 8, st + 0.5) - st;
    add({ id: 'S09', at: st, cam: [540, 950], zoom: 0.06, note: 'newspaper page, 21 DEAD / 150+ INJURED slips', draw(lt, d, t) {
      K.parchment(9);
      cut(P_rr(160, 360, 760, 900, 6), P.edge, { shadow: 0.9, edge: 6 }); K.label('BOSTON, JAN. 16, 1919', 540, 440, 36);
      line([[220, 480], [860, 480]], P.ink, 4); K.label('MOLASSES DISASTER', 540, 560, 58, P.crimson);
      for (let i = 0; i < 8; i++) line([[220, 680 + i * 60], [860 - (i % 3) * 80, 680 + i * 60]], P.stoneDark, 8);
      K.slip('21 DEAD', 360, 1180, pop(lt, 0.1), -0.05, 66);
      K.slip('150+ INJURED', 700, 1320, pop(lt, hu), 0.04, 66);
    } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop'); cue(st + hu, 'pop'); }

  // 9 · the harbor ran brown for months
  { const st = cut_(9), br = Wf('brown', 9, st + 0.8) - st;
    add({ id: 'S10', at: st, cam: [540, 1100], zoom: 0.08, note: 'harbor water turns brown', draw(lt, d, t) {
      K.parchment(10); ctx.fillStyle = WINTER; ctx.fillRect(-300, -300, W + 600, 1500);
      K.ship(700, 1150 + Math.sin(t * 2) * 8, 0.7, Math.sin(t * 1.6) * 0.04);
      harborWater(1200, t, 0); if (lt > br) { ctx.save(); ctx.globalAlpha = eo(seg(lt, br, br + 0.8)); harborWater(1200, t, 1); ctx.restore(); }
      K.slip('BOSTON HARBOR', 540, 420, pop(lt, 0.1), -0.02, 56);
    } });
    cue(st, 'whoosh'); cue(st + br, 'slide', { dur: 1 }); }

  // 10 · hot summer days, the North End still smells sweet
  { const st = cut_(10), su = Wf('summer', 10, st + 1.2) - st, sw = Wf('sweet', 10, st + 3.2) - st;
    add({ id: 'S11', at: st, cam: [540, 1100], zoom: 0.08, note: 'summer street, sweet smell lines rising', draw(lt, d, t) {
      dayPage(11, 1450, '#9C8C70'); if (lt > su) cut(P_circ(850, 380, 100 * pop(lt, su)), '#EFC66A', { shadow: 0.4, edge: 5 });
      street();
      ctx.strokeStyle = MOL2; ctx.lineWidth = 10; ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) { const x = 200 + i * 230, y0 = 1400 - ((lt * 120 + i * 90) % 500); ctx.save(); ctx.globalAlpha = 0.7; ctx.beginPath(); for (let k = 0; k < 8; k++) ctx.lineTo(x + Math.sin(k * 0.9 + t * 3 + i) * 26, y0 - k * 30); ctx.stroke(); ctx.restore(); }
      K.slip('NORTH END', 540, 560, pop(lt, 0.2), 0.02, 60);
      K.slip('STILL SMELLS SWEET?', 540, 720, pop(lt, sw), -0.03, 60);
    } });
    cue(st, 'whoosh'); cue(st + su, 'sparkle', { dur: 0.8 }); cue(st + sw, 'pop'); }

  // 11 · slow as molasses? remember Boston
  { const st = cut_(11), bo = Wf('boston', 11, st + 3) - st;
    add({ id: 'S12', at: st, cam: [540, 1000], zoom: 0.1, note: 'a slow drip from a jar, then the wave returns (loop)', draw(lt, d, t) {
      K.parchment(12);
      cut(P_rr(380, 380, 320, 380, 30), '#C9A27A', { shadow: 0.8, edge: 6 }); cut(P_rr(400, 520, 280, 230, 24), MOL, { shadow: 0, edge: 0 }); cut(P_rr(360, 340, 360, 60, 12), P.sepia);
      const dl = 760 + Math.min(500, lt * 120); cut(() => { ctx.beginPath(); ctx.moveTo(530, 760); ctx.quadraticCurveTo(540, dl - 60, 520, dl); ctx.arc(540, dl, 24, Math.PI, 0, true); ctx.quadraticCurveTo(540, dl - 60, 550, 760); ctx.closePath(); }, MOL, { shadow: 0.6, edge: 4 });
      if (lt > bo - 0.2) wave(lerp(-400, 1300, eio(seg(lt, bo - 0.2, d))), 1500, 900, t);
      K.seal(820, 330, pop(lt, bo) * 1.1, 'B');
    } });
    cue(st, 'whoosh'); cue(st + bo - 0.2, 'slide', { dur: 1.5 }); cue(st + bo, 'thud'); }

  return { shots: S, cues: CUES };
}
