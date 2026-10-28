import asyncio,sys,base64
from playwright.async_api import async_playwright
URL=sys.argv[1];OUT=sys.argv[2]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':400,'height':700})
    await pg.goto(URL);await pg.wait_for_timeout(600)
    for name,js in [('icon-192.png','__T.icon(192)'),('icon-512.png','__T.icon(512)'),('cover.png','__T.cover(400,210,3)'),('cover-720.png','__T.cover(240,126,3)')]:
      d=await pg.evaluate(js);open(OUT+'/'+name,'wb').write(base64.b64decode(d.split(',')[1]))
    await b.close()
asyncio.run(main())
