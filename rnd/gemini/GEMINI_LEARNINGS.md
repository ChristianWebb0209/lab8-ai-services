
## Reasoning:

Next, I am investigating Gemini because it is one of the most common and from my research has a great free tier.

## Testing:

I first tested with a curl:

curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Explain how AI works in a few words"
          }
        ]
      }
    ]
  }'
The results of this I copied into output.json.

## Results:

Gemini is way cleaner than Grok in terms of working with the output. It is wayyyy simpler and easier to read. For a more complicated project I might want to know the thought process of the AI, but for our simple chat bot I think Gemini is better suited.

## Pricing:

For the free version of Gemini, the limits are:

10 RPM (requests per minute)
250 RPD (requests per day)
250k TPM (tokens per minute)

The per minute rate is a bit lower than for Groq, but overall it is still plenty for our application.

## Privacy:

Google lets users disable their data being used for training, but by default it is on. This is worse than Groq, but honestly isn't a huge concern. The only time it would be concerning is if someone wants to have a private or personal conversation on this chatbot.