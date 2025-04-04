const puppeteer = require('puppeteer');
const fs = require('fs');

exports.getCookiesAndToken = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36');
  await page.goto('https://hrmis.neuron.id/doornew', { waitUntil: 'domcontentloaded' });
  const isLoggedIn = await page.evaluate(() => {
    return !document.querySelector('input[name="code"]');
  });
  if (!isLoggedIn) {
    await page.type('input[name="code"]', '1002303203', { delay: 100 });
    await page.type('input[name="password"]', 'Dimasrhr02', { delay: 100 });
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    ]);
    const stillExists = await page.$('input[name="code"]');
    if (stillExists) {
      await page.screenshot({ path: 'login_failed.png' });
      const html = await page.content();
      fs.writeFileSync('login_failed.html', html);
      throw new Error('Login gagal atau terlalu lama');
    }
  }
  await page.goto('https://hrmis.neuron.id/attendance/dashboard/form', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({
    url: 'https://www.google.com/recaptcha/api.js?render=6LdUFMsqAAAAAJ7ug7Jc9TIeWD9PIfjEMAy8HGWx'
  });
  await page.waitForFunction('grecaptcha && grecaptcha.execute');
  const token = await page.evaluate(async () => {
    return await grecaptcha.execute('6LdUFMsqAAAAAJ7ug7Jc9TIeWD9PIfjEMAy8HGWx', { action: 'submit' });
  });
  const cookies = await page.cookies();
  await browser.close();
  return { cookies, token };
};
