

export async function getGeminiResponse(promptText, apiKey) {
    const modelName = "gemini-2.5-flash";

    const url = "https://generativelanguage.googleapis.com/v1beta/models/"
        + encodeURIComponent(modelName)
        + ":generateContent?key=" + encodeURIComponent(apiKey);

    const body = {
        contents: [
            {
                parts: [
                    {
                        text: promptText
                    }
                ]
            }
        ]
    };

    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    console.log(resp);

    if (!resp.ok) {
        throw new Error(`Gemini API error: ${resp.status} ${await resp.text()}`);
    }

    const data = await resp.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "(error getting response)";

    return text;
}
