
## Reasoning:

The first API I am checking out is Groq, I found it on a list (https://github.com/cheahjs/free-llm-api-resources) and it was the name I recognized immediately. Additionally, getting an API key took me literally 15 seconds, so off to a good start.

## Testing:

I first tested with a curl:

curl -X POST https://api.groq.com/openai/v1/responses \
-H "Authorization: Bearer (api key here)" \
-H "Content-Type: application/json" \
-d '{
    "model": "openai/gpt-oss-20b",
    "input": "Explain the importance of fast language models"
}'

The results of this I copied into output.json (I have a formatter which formatted the messy json).

## Results:

The results surprised me. Groq gives a huge json file that first has a reasoning object, which gives a large paragraph of the LLM reasoning about what the question wants and how to answer it, then a large roughly 3 paragraph answer to the question.

## Pricing:

For the free version of Groq, the limits are:

groq/compound and groq/compound-mini:

30 RPM (requests per minute)
250 RPD (requests per day)
70K TPM (tokens per minute)

This should be easily enough for a simple chat application, especially one with only a single user. In the future, assuming an average user uses about 5 requests per minute, our free API key could handle around 6 concurrent users, which is pretty impressive.

## Further Learning:

Looking through the docs, I learned that you can control the temperature (randomness) of theh response, and also set a stream parameter to true to have the api give partial message deltas so you can have the response write itself out as it is generated. This is definately a feature I want to implement.

I used npm to install the grok sdk, then set up script.js with the starter code from the docs, and set up node, then ran the script. It gave an answer similar to the curl.

## Privacy

Groq claims that they don't even train on your data at all or retain it. If this is true it is pretty impressive and puts it above most other LLMs in terms of privacy.

