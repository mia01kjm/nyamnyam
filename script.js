function saveApiKey() {

  const key =
    document.getElementById("apiKeyInput").value;

  localStorage.setItem(
    "gemini_api_key",
    key
  );

  document.getElementById("apiStatus").innerText =
    "✅ 저장 완료!";
}

async function searchCalorie() {

  const food =
    document.getElementById("foodInput").value;

  const apiKey =
    localStorage.getItem("gemini_api_key");

  if (!apiKey) {
    alert("API 키 입력!");
    return;
  }

  document.getElementById("loading")
    .classList.remove("hidden");

  try {

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                  `"${food}" 음식 칼로리를 알려줘.

JSON 형식만 반환:
{
"name":"",
"calorie":0,
"comment":""
}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data.candidates[0]
      .content.parts[0].text;

    const cleanText =
      text.replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

    const result =
      JSON.parse(cleanText);

    document.getElementById("resFoodName")
      .innerText = result.name;

    document.getElementById("resCalorie")
      .innerText = result.calorie;

    document.getElementById("resComment")
      .innerText = result.comment;

    document.getElementById("resultCard")
      .classList.remove("hidden");

  } catch(error) {

    document.getElementById("errorMsg")
      .innerText = "❌ 오류 발생";

    document.getElementById("errorMsg")
      .classList.remove("hidden");
  }

  document.getElementById("loading")
    .classList.add("hidden");
}
