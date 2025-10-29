export async function streamGeminiResponse(promptText, apiKey, onChunk) {
    const modelName = "gemini-2.5-flash";
    const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;

    const limitedPrompt = `Respond in no more than 50 words.\n\n${promptText}`;

    const body = {
        contents: [{ parts: [{ text: limitedPrompt }] }]
    };

    const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!resp.ok) {
        throw new Error(`Gemini API error: ${resp.status} ${await resp.text()}`);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let partial = "";


    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        partial += decoder.decode(value, { stream: true });
        const lines = partial.split("\n");
        partial = lines.pop();

        for (const line of lines) {
            if (line.startsWith("data: ")) {
                const json = JSON.parse(line.slice(6));
                const textChunk = json?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (textChunk && onChunk) {

                    const words = textChunk.split(/\s+/);
                    for (const word of words) {
                        await new Promise(r => setTimeout(r, 40));
                        onChunk(word + " ");
                    }
                }
            }
        }
    }
}
