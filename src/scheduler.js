const schedule = require('node-schedule');
const axios = require('axios');
const { getCookiesAndToken } = require('./services/puppeteer.service');
const { sendPresensi } = require('./services/api.service');

function startScheduler() {
  schedule.scheduleJob('30 7 * * *', async () => {
    try {
      const now = new Date();
      if (now.getDay() === 0 || now.getDay() === 6) return;
      
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = String(now.getFullYear());
      const today = `${year}-${month}-${day}`;
      const { data: holidays } = await axios.get(`https://api-harilibur.vercel.app/api?month=${month}&year=${year}`);
      const isHoliday = holidays.some(h => h.holiday_date === today && h.is_national_holiday === true);

      if (isHoliday) return;
      
      const offset = Math.floor(Math.random() * (15 * 60 * 1000));
      
      setTimeout(async () => {
        try {
          const { cookies, token } = await getCookiesAndToken();
          const response = await sendPresensi(cookies, token);
          console.log('Presensi result:', response);
        } catch (error) {
          console.error('Presensi error:', error);
        }
      }, offset);
    } catch (error) {
      console.error('Gagal memeriksa libur atau menjalankan presensi:', error);
    }
  });
}

module.exports = { startScheduler };
