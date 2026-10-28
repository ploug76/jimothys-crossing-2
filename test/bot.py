import asyncio,sys,json
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8811/jc2/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for vp in [(360,640),(844,390)]:
      ctx=await b.new_context(viewport={'width':vp[0],'height':vp[1]});await ctx.add_init_script("window.__QA=1");pg=await ctx.new_page()
      errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
      await pg.goto(URL);await pg.wait_for_timeout(500);await pg.add_script_tag(path='/workspace/jc2/test/bot2.js')
      r=await pg.evaluate("__bot2(%s,%s,{keepAlive:true})"%(sys.argv[2] if len(sys.argv)>2 else 2, 300));print(vp,json.dumps(r))
      print('ERRS',errs);await ctx.close()
    await b.close()
asyncio.run(main())
