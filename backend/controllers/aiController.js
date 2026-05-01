import OpenAI from "openai";

export const recommend = async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_key_here") {
      return res.status(503).json({ message: "OpenAI API key not configured" });
    }
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { preferences, listings } = req.body;

    if (!preferences || !listings || !Array.isArray(listings)) {
      return res.status(400).json({ message: "preferences and listings array are required" });
    }

    const listingSummaries = listings
      .map(
        (l, i) =>
          `${i + 1}. ID: ${l._id || l.id}, Title: "${l.title}", Price: ${l.price}, Location: "${l.location}", Facilities: ${(l.facilities || []).join(", ")}`
      )
      .join("\n");

    const prompt = `You are a helpful assistant recommending boarding places (bodim) for university students in Sri Lanka.

Student preferences:
${JSON.stringify(preferences, null, 2)}

Available listings:
${listingSummaries}

Based on the student's preferences, recommend the most suitable listings. For each recommendation, include the listing ID, title, and a brief explanation of why it suits the student. Return a JSON array in this format:
[{"id": "...", "title": "...", "reason": "..."}]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;

    let recommendations;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : content;
    } catch {
      recommendations = content;
    }

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
