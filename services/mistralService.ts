// Burada doğrudan fetch API kullanarak Mistral API'ye istek yapacağız
// (MistralClient yerine)

const MISTRAL_API_KEY =
  process.env.EXPO_PUBLIC_MISTRAL_API_KEY || 'YOUR_MISTRAL_API_KEY';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// Metin içeriği için Mistral API'sini çağıran fonksiyon
export async function generateText(prompt: string): Promise<string> {
  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-tiny',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Mistral API hatası:', errorData);
      throw new Error(`API hatası: ${response.status}`);
    }

    const data = await response.json();
    // API yanıtından içeriği dönüyoruz
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Mistral AI API hatası:', error);
    throw new Error('Metin oluşturulurken bir hata oluştu.');
  }
}
