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
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: message }],
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

