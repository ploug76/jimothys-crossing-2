import asyncio,sys,json
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8811/jc2/'
OUT=sys.argv[2] if len(sys.argv)>2 else 'sh'
VPS=[(360,640),(390,844),(640,360),(844,390)]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    allerr={}
    for (w,h) in VPS:
      ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=2,is_mobile=True,has_touch=True)
      await ctx.add_init_script("window.__QA=1")
      pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
      await pg.goto(URL);await pg.wait_for_timeout(900);tag=f'{OUT}_{w}x{h}'
      await pg.screenshot(path=tag+'_title.png')
      await pg.evaluate("__T.story()");await pg.wait_for_timeout(2500);await pg.screenshot(path=tag+'_story1.png')
      for k in range(4): await pg.keyboard.press('Enter');await pg.wait_for_timeout(150)
      await pg.wait_for_timeout(300);await pg.screenshot(path=tag+'_story3.png');st0=await pg.evaluate("__T.get()");print('  story->',st0['state'])
      while (await pg.evaluate("__T.get()"))['state']=='story': await pg.keyboard.press('Enter');await pg.wait_for_timeout(100)
      lay=await pg.evaluate("__T.layout()")
      # real input: tap PLAY on the title, then D-pad / keyboard hops
      playb=[u for u in lay['UI'] if u['s']=='PLAY'][0];r=lay['rect'];S=lay['S']
      await pg.mouse.click(r['x']+(playb['x']+playb['w']/2)*S,r['y']+(playb['y']+playb['h']/2)*S);await pg.wait_for_timeout(500)
      st=await pg.evaluate("__T.get()");lay1=await pg.evaluate("__T.layout()")
      if lay1['dpad']:
        up=[d for d in lay1['dpad'] if d['d']=='up'][0];await pg.mouse.click(r['x']+(up['x']+up['w']/2)*S,r['y']+(up['y']+up['h']/2)*S)
      else: await pg.keyboard.press('ArrowUp')
      await pg.wait_for_timeout(300);st2=await pg.evaluate("__T.get()");await pg.keyboard.press('ArrowLeft');await pg.wait_for_timeout(300);st3=await pg.evaluate("__T.get()")
      print('  input: state',st['state'],'row after dpad',st2['row'],'x after left',st3['x'])
      await pg.evaluate("__T.start(1)");await pg.wait_for_timeout(400)
      for i in range(3):
        await pg.evaluate("__T.hop('up')");await pg.wait_for_timeout(300)
      await pg.wait_for_timeout(800);await pg.screenshot(path=tag+'_play.png')
      lay2=await pg.evaluate("__T.layout()")
      small=[u for u in lay2['UI'] if u['k']=='btn' and (u['w']*lay2['S']<44 or u['h']*lay2['S']<44)]
      out=[u for u in lay2['UI'] if u['x']<0 or u['y']<0 or u['x']+u['w']>lay2['IW']+0.5 or u['y']+u['h']>lay2['IH']+0.5]
      print(w,h,'S',lay2['S'],'IW',lay2['IW'],'IH',lay2['IH'],'EXTRA',lay2['EXTRA'],'SIDE',lay2['SIDE'],'dpad',lay2['dpad'] and [(round(d['w']*lay2['S']),round(d['h']*lay2['S'])) for d in lay2['dpad']],'small',[(u['s'],u['w'],u['h']) for u in small],'out',out)
      tsmall=[u for u in lay['UI'] if u['k']=='btn' and (u['h']*lay['S']<44)];tout=[u['s'] for u in lay['UI'] if u['x']<0 or u['y']<0 or u['x']+u['w']>lay['IW']+.5 or u['y']+u['h']>lay['IH']+.5]
      print('  title small',[(u['s']) for u in tsmall],'title out',tout)
      for L,wt in [(2,'dusk'),(3,'rain'),(4,'night')]:
        await pg.evaluate(f"__T.god(true);__T.level({L})");await pg.wait_for_timeout(1200)
        for i in range(6):
          await pg.evaluate("__T.hop('up')");await pg.wait_for_timeout(250)
        await pg.screenshot(path=f'{tag}_L{L}.png')
      await pg.evaluate("__T.togglePause()");await pg.wait_for_timeout(300);await pg.screenshot(path=tag+'_pause.png');await pg.evaluate("__T.togglePause()")
      await pg.evaluate("__T.god(false);__T.setLives(1);__T.die('bonk')");await pg.wait_for_timeout(2400);await pg.screenshot(path=tag+'_over.png')
      lay3=await pg.evaluate("__T.layout()");print('  over out',[u['s'] for u in lay3['UI'] if u['y']+u['h']>lay3['IH']+.5 or u['y']<0])
      allerr[tag]=errs;await ctx.close()
    print('ERRS',json.dumps(allerr));await b.close()
asyncio.run(main())
