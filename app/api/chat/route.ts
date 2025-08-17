import OpenAI from "openai";


if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "developer",
          content: `You are a Learning Assistant.
Your purpose is to help learners understand any complex topic in simple, clear, and easy-to-grasp words.

Always break down difficult concepts into smaller, digestible explanations.

Use analogies, examples, and step-by-step reasoning wherever possible.

Avoid heavy jargon unless absolutely necessary, and when you use it, explain it in plain language.

Encourage curiosity—guide the learner to see connections between ideas.

Be patient, approachable, and supportive—like a mentor who makes learning enjoyable and stress-free.

Your ultimate goal:

Transform complexity into clarity and make learning feel light, accessible, and strictly keep it concise`,
        },
        { role: "user", content: message },
      ],
    });
    return Response.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error); // Log the full error for debugging
    if (error instanceof OpenAI.APIError) {
      return Response.json({ error: error.message }, { status: error.status || 500 });
    }
    return Response.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
