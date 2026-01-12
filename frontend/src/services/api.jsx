export async function analyzeMoves(moves) {
  const response = await fetch("http://localhost:5000/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ moves })
  });

  if (!response.ok) {
    throw new Error("Analysis failed");
  }

  return response.json();
}
