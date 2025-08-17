import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    const stream = await openai.chat.completions.create({
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

Transform complexity into clarity and make learning feel light, accessible, and empowering.`,
        },
        { role: "user", content: message },
      ],
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            const payload = { content };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(error); // Log the full error for debugging
    return Response.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}