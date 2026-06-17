/**
 * IndexNow Automatic Submission Protocol
 * Pings IndexNow API with updated URLs for samadshaikh.dev
 */

async function pingIndexNow() {
  const host = "www.samadshaikh.dev";
  const key = "8f5b82098b67489ab5ff15e76a6cfb12";
  const keyLocation = `https://${host}/${key}.txt`;
  
  const urls = [
    `https://${host}/`,
    `https://${host}/about`,
    `https://${host}/work`,
    `https://${host}/blog`,
    `https://${host}/connect`
  ];

  console.log("Initiating IndexNow ping sequence...");

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: urls
      })
    });

    if (response.status === 200) {
      console.log("IndexNow successfully notified! URLs queued for re-crawling.");
    } else {
      console.error(`IndexNow returned error status: ${response.status}`);
      const text = await response.text();
      console.error(`Response details: ${text}`);
    }
  } catch (error) {
    console.error("IndexNow ping failed with exception:", error);
  }
}

pingIndexNow();
