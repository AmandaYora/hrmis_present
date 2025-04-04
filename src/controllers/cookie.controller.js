const { getCookiesAndToken } = require('../services/puppeteer.service');
const { sendPresensi } = require('../services/api.service');

exports.getCookieAndFetchData = async (req, res) => {
  try {
    const { cookies, token } = await getCookiesAndToken();
    const response = await sendPresensi(cookies, token);

    res.json({
      success: response.status === 200,
      status: response.status,
      recaptcha_token: token,
      apiResponse: response.data || response.response || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan presensi',
      error: error.message,
      full: error
    });
  }
};
