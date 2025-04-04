const axios = require("axios");
const qs = require("qs");

exports.sendPresensi = async (cookies, token) => {
  let cookieString = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

  // Jika kosong atau tidak mengandung nama cookie yang penting
  const isInvalid =
    !cookieString || !cookieString.includes("376aca3a62249dc5cad387817751672a");

  if (isInvalid) {
    cookieString =
      "_ga=GA1.1.1253192959.1728527850; _ga_ZKL810G1XS=GS1.1.1728527850.1.1.1728527864.0.0.0; 376aca3a62249dc5cad387817751672a=t0kqri8ij86hp52via25cgd4tc";
    console.warn(
      "[⚠️ Paul Warning] Cookie dari Puppeteer tidak valid. Menggunakan default cookie."
    );
  }

  const now = new Date();
  const isoFormattedDate = now.toISOString().slice(0, 19).replace("T", " ");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const customFormattedDate =
    now.getDate().toString().padStart(2, "0") +
    " " +
    months[now.getMonth()] +
    " " +
    now.getFullYear() +
    " " +
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  const data = {
    latitude: "-6.960997977686197",
    longitude: "107.64062658428134",
    type_id: "1",
    source_type_code: "WEB",
    source_reference: "REFERENCE_VALUE",
    source_time: isoFormattedDate,
    geocode_location: "GEO_LOCATION_VALUE",
    ref_code: "EMPLOYEE",
    ref_id: "413",
    start_dtm: customFormattedDate,
    start_description: "i'm ready",
    flag: "1",
    token: token,
  };

  try {
    const response = await axios.post(
      "https://hrmis.neuron.id/attendance/attendance/save",
      qs.stringify(data),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: cookieString,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        },
        validateStatus: () => true,
      }
    );

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.message,
      response: error.response?.data || null,
    };
  }
};
