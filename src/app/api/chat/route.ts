import { NextResponse } from 'next/server';
import natural from 'natural';

// This would typically be loaded from a database or file
const universityData = [
  {
    url: "https://www.university.edu/admissions",
    title: "Admissions",
    content: "Our university welcomes applications from...",
    keywords: ["admissions", "apply", "requirements"]
  },
  {
    url: "https://www.university.edu/courses",
    title: "Course Catalog",
    content: "We offer a wide range of courses including...",
    keywords: ["courses", "degrees", "majors"]
  }
];

const tokenizer = new natural.WordTokenizer();
const tfidf = new natural.TfIdf();

// Add documents to the TF-IDF index
universityData.forEach((page, index) => {
  tfidf.addDocument(`${page.title} ${page.content} ${page.keywords.join(' ')}`);
});

export async function POST(request: Request) {
  const { message } = await request.json();

  // Tokenize the user's message
  const tokens = tokenizer.tokenize(message.toLowerCase());

  // Find the most relevant document
  let maxScore = 0;
  let bestMatch = null;
  universityData.forEach((page, index) => {
    const score = tokens.reduce((sum, token) => sum + tfidf.tfidf(token, index), 0);
    if (score > maxScore) {
      maxScore = score;
      bestMatch = page;
    }
  });

  let response;
  if (bestMatch) {
    // response = `Based on your question, you might find this information helpful: "${bestMatch.content}" You can find more details at ${bestMatch.url}`;
    // response = `Based on your question, you might find this information helpful: "HI" You can find more details at HI`;
    response = "You said: " + message;
  } else {
    response = "You said: " + message;
    // response = "I'm sorry, I couldn't find any relevant information for your query.";
  }

  return NextResponse.json({ message: response });
}