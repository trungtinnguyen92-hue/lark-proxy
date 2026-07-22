export default async function handler(req, res) {
  // Chỉ cho phép POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Missing "data" field' });
    }

    // Gọi Lark API qua HuggingFace Space (Gradio)
    const response = await fetch('https://aryanxxvii-larkapi.hf.space/run/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [data],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: `Lark API error: ${errText}` });
    }

    const result = await response.json();

    // Gradio trả về { data: [similarity, band, transcription] }
    return res.status(200).json({
      similarity_score: result.data[0],
      band: result.data[1],
      transcription: result.data[2],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
