import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

const MISTRAL_API_KEY =
  process.env.EXPO_PUBLIC_MISTRAL_API_KEY || 'ND3BV7dbyZrTRm8bg7mkJFFJumMtP5dv';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/vision';

// Base64 formatına dönüştürme fonksiyonu
async function imageToBase64(uri: string): Promise<string> {
  try {
    // Resmi işleme (boyutunu azaltma, optimizasyon)
    const processedImage = await manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { format: SaveFormat.JPEG, compress: 0.8 }
    );

    // Resmi base64'e dönüştürme
    const base64Image = await FileSystem.readAsStringAsync(processedImage.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return base64Image;
  } catch (error) {
    console.error('Base64 dönüşümü sırasında hata:', error);
    throw new Error('Görüntü işlenemedi');
  }
}

// Mistral AI OCR API'sini kullanarak metin çıkarma
export async function performOCR(imageUri: string): Promise<string> {
  try {
    // Resmi base64'e dönüştür
    const base64Image = await imageToBase64(imageUri);

    // Mistral AI API isteği
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest', // veya "mistral-large-2" vb.
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Bu görseldeki tüm metni aynen ve tam olarak tanıyıp listeleyebilir misin?',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Mistral OCR API hatası:', errorData);
      throw new Error(`API hatası: ${response.status}`);
    }

    const data = await response.json();

    // Yanıtı döndür
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OCR işlemi sırasında hata:', error);
    throw new Error('Görüntü analiz edilemedi');
  }
}
