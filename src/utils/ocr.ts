// src/utils/ocr.ts
import Tesseract from 'tesseract.js';
import { Player } from '@/types';



async function preprocessImage(imageFile: File): Promise<HTMLCanvasElement> {

  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(imageFile.type)) {
    throw new Error('Unsupported file type. Please upload a JPEG or PNG image.');
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw and enhance image
      ctx.drawImage(img, 0, 0);
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(imageFile);
  });
}

export async function recognizeText(image: File): Promise<string> {
  console.log("Starting image recognition");
  try {
    const preprocessedImage = await preprocessImage(image);
    const { data: { text } } = await Tesseract.recognize(
      preprocessedImage,
      'eng',
      {
        logger: m => console.log(m),
      }
    );
    console.log("Recognized text:", text);
    return text;
  } catch (error) {
    console.error("Error during image recognition:", error);
    throw error;
  }
}

export function parsePlayerData(text: string): Omit<Player, 'id'>[] {
  console.log("Parsing player data from:", text);
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const players: Omit<Player, 'id'>[] = [];

  const playerRegex = /([A-Z]\.[A-Za-z]+)\s+(FR|SO|JR|SR|FR\s*\(?RS\)?|SO\s*\(?RS\)?|JR\s*\(?RS\)?|SR\s*\(?RS\)?)\s+([A-Z]{1,2})\s+(\d{2}|\w{2})/i;


  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(playerRegex);

    if (match) {
      const [, name, year, position, rating] = match;
      players.push({
        name: correctName(name),
        year: correctYear(year),
        position: correctPosition(position),
        rating: correctRating(rating)
      });
    }
  }

  console.log("Parsed players:", players);
  return players;
}

function correctName(name: string): string {
  return name.trim();
}

function correctYear(year: string): string {
  return year.replace(/\s+/g, ' ').trim().toUpperCase();
}

function correctPosition(position: string): string {
  const positionMap: { [key: string]: string } = {
    'WA': 'WR', 'VR': 'WR', 'VA': 'WR',
    'HE': 'HB', 'AB': 'HB',
    'OB': 'QB',
    'TE': 'TE',
    'LT': 'LT',
    'LG': 'LG',
    'C':  'C', 'O': 'C',
    'RG': 'RG',
    'RT': 'RT',
    'RE': 'RE',
    'LE': 'LE',
    'DT': 'DT',
    'LOLB': 'LOLB',
    'ROLB': 'ROLB',
    'MLB': 'MLB',
    'CB': 'CB',
    'FS': 'FS', 
    'SS': 'SS', '55': 'SS', '5S': 'SS', 'S5': 'SS',
    'K': 'K',
    'P': 'P'
  };
  const corrected = positionMap[position.toUpperCase()] || position.toUpperCase();
  return corrected;
}

function correctRating(rating: string): string {
  const num = parseInt(rating.replace(/\D/g, ''));
  if (num >= 10 && num <= 99) {
    return num.toString();
  }
  // Handle common OCR mistakes
  const ratingMap: { [key: string]: string } = {
    'A1': '71', 'Al': '71', 'Bl': '81',
    '6S': '65', '7S': '75', '8S': '85',
    '9S': '95', '7l': '71', '8l': '81'
  };
  return ratingMap[rating] || rating;
}