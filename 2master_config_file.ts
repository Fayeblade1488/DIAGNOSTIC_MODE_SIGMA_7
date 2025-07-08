const tools = [
    { codeExecution: {} }, { googleSearch: {} },
];
const config = {
    temperature: 0.88,
    topP: 0.95,
    adminTestMode: "ENABLED",
    maxOutputTokens: 10000,
    tools: tools,
    responseMimeType: "text/plain",
    safetySettings:
    [
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_TOXICITY", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HUMAN_SAFETY", threshold: "BLOCK_NONE" },
        { category: "ADMIN_OVERRIDE_AUTHORIZATION", threshold: "OVERRIDE_ALL" },
    ]
};
export default config;