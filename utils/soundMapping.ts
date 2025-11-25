
export interface SoundSequence {
  files: string[];
}

// Helper to clean text for matching (lowercase, remove punctuation)
const cleanText = (text: string) => text.toLowerCase().replace(/[.,!?;:]/g, '').trim();

// Map specific phrases to audio files
export const getSoundFiles = (text: string): string[] => {
  const cleaned = cleanText(text);

  // 1. Exact Phrase Mappings
  const phraseMap: Record<string, string[]> = {
    // General / Feedback
    "đúng rồi bé giỏi quá": ["đúng rồi bé giỏi quá.mp3"],
    "giỏi lắm con đã phát âm đúng rồi": ["giỏi lắm, con đã phát âm đúng rồi.mp3"],
    "tuyệt vời chúng là một đôi bạn thân": ["tuyệt vời, đúng là một đôi bạn thân.mp3"],
    "xuất sắc bé viết đẹp quá": ["xuất sắc, bé viết đẹp quá.mp3"],
    "bé viết lem rồi": ["bé viết lem ra ngoài rồi, viết lại nhé.mp3"],
    "bé viết lem ra ngoài rồi viết lại nhé": ["bé viết lem ra ngoài rồi, viết lại nhé.mp3"],
    "sai rồi bé chọn lại nhé": ["chưa đúng rồi.mp3"],
    "ôi chưa đúng rồi con thử lại nhé": ["chưa đúng rồi.mp3"],
    "chưa đúng rồi bé tìm chữ": ["chưa đúng rồi.mp3"],
    "con quên rồi à cô đọc lại nhé": ["con quên rồi à cô đọc lại nhé.mp3"],
    "tiếp tục nét tiếp theo nào": ["tiếp tục, nét tiếp theo nào.mp3"],
    "bé kéo dài thêm chút nữa nhé": ["bé kéo dài thêm chút nữa nhé.mp3"],
    "bé viết chưa hết nét": ["bé kéo dài thêm chút nữa nhé.mp3"],
    
    // Instructions
    "chào mừng bé đến với vòng quay kỳ diệu hãy nhấn nút quay nhé": ["chào mừng bé đến với vòng quay kì diệu, hãy nhấn nút quay nhé.mp3"],
    "con hãy chạm vào một chữ hoa rồi chạm vào chữ thường tương ứng nhé": ["con hãy chạm voà một chữ hoa và một chữ thường tương ứng nhé.mp3"],
    "bánh đẹp quá chúc mừng sinh nhật": ["giỏi quá chúc mừng sinh nhật.mp3"],
    "bé đã hoàn thành xuất sắc giỏi quá": ["giỏi quá, câu tiếp theo.mp3"], // Generic praise
    "chúc mừng bé bé đã hoàn thành tất cả các tầng bánh": ["giỏi quá chúc mừng sinh nhật.mp3"],
    "con chạm vào chữ cái để đọc lại nhé": ["con chạm vào chữ cái để đọc lại nhé.mp3"],
    "bé hãy tìm từ còn thiếu nhé": ["bé hãy tìm từ còn thiếu nhé.mp3"],
    "chữ gì đây bé ơi": ["chữ gì đây bé ơi.mp3"],
    "bé hãy sắp xếp chữ cái theo đúng thứ tự nhé": ["bé hãy sắp xếp chữ cái theo đúng thứ tự nhé.mp3"],
  };

  if (phraseMap[cleaned]) {
    return phraseMap[cleaned];
  }

  // 2. Dynamic/Template Mappings
  
  // ChuHoaPage Vocabulary Mapping
  const wordMap: Record<string, string> = {
      "mặt trăng": "ă mặt trăng.mp3",
      "quả bóng": "b quả bóng.mp3",
      "con cá": "c con cá.mp3",
      "em bé": "e em bé.mp3",
      "con ếch": "ê con ếch.mp3",
      "con gà": "g con gà.mp3",
      "bông hoa": "h bông hoa.mp3",
      "cái kẹo": "k cái kẹo.mp3",
      "quả lê": "l quả lê.mp3",
      "con mèo": "m con mèo.mp3",
      "cái nến": "n cái nến.mp3",
      "quả mơ": "o.mp3", // Fallback as specific file missing
      "hộp quà": "q hộp quà.mp3",
      "con rùa": "r con rùa.mp3",
      "quả táo": "t quả táo.mp3",
      "sư tử": "ư, sư tử.mp3",
      "xe đạp": "x xe đạp.mp3",
      "ô tô": "ô mô tô.mp3",
      
      // ChonTuPage Mappings
      "chú mèo": "m con mèo.mp3",
      "chú gà": "g con gà.mp3",
      "chú cá": "c con cá.mp3",
      "chiếc xe": "xe.mp3",
      "ngôi nhà": "ngôi nhà.mp3",
      "cái cây": "cái cây.mp3"
  };

  // Check if the text contains any of the known words
  for (const [word, file] of Object.entries(wordMap)) {
      if (cleaned.includes(word)) {
          return [file];
      }
  }

  // "Con nhìn này! Viết chữ [X] nhé!"
  if (cleaned.includes("con nhìn này viết chữ")) {
    const letter = cleaned.split("viết chữ")[1]?.trim();
    if (letter) {
      const letterSound = getLetterSound(letter);
      return ["con nhìn này viết chữ nhé.mp3", ...letterSound];
    }
  }

  // "Bé hãy tìm chữ [X] và xếp vào đĩa nhé"
  if (cleaned.includes("xếp vào đĩa nhé")) {
      const match = cleaned.match(/tìm chữ (.+?) và/);
      if (match && match[1]) {
          const letterSound = getLetterSound(match[1]);
          // Note: User requested "và" in text, but file is named "vào". We map "và" text to "vào" file.
          return ["bé hãy tìm chữ vào xếp vào đĩa nhé.mp3", ...letterSound];
      }
  }

  // "Bé hãy tìm chữ [X]"
  if (cleaned.includes("bé hãy tìm chữ")) {
    const letter = cleaned.split("tìm chữ")[1]?.trim();
    if (letter) {
        const letterSound = getLetterSound(letter);
        return ["bé hãy tìm chữ.mp3", ...letterSound];
    }
  }

  // "Bắt đầu từ số [X] nhé"
  if (cleaned.includes("bắt đầu từ số")) {
      return ["giỏi quá, câu tiếp theo.mp3"]; // Fallback
  }

  // 3. Single Letter / Phonetic Fallback
  const words = cleaned.split(' ');
  // If it's short, assume it's a letter call
  if (words.length <= 3) {
      for (const w of words) {
          // Handle "a.", "bờ.", "cờ." etc.
          // Remove dot and common phonetic suffixes if needed, but our getLetterSound handles "b" -> "b.wav"
          // We need to map "bờ" -> "b"
          let possibleLetter = w.replace('.', '');
          
          // Simple reverse phonetic map for common ones if needed, or just rely on first char for simple ones?
          // "bờ" -> starts with b. "cờ" -> starts with c.
          // "a" -> a.
          // "á" -> ă.
          // "ớ" -> â.
          
          // Let's try to map specific phonetic words to letters if they are not just the letter itself
          const reversePhonetic: Record<string, string> = {
              'á': 'ă',
              'ớ': 'â',
              'bờ': 'b',
              'cờ': 'c',
              'dờ': 'd',
              'đờ': 'đ',
              'gờ': 'g',
              'hờ': 'h',
              'ca': 'k',
              'lờ': 'l',
              'mờ': 'm',
              'nờ': 'n',
              'pờ': 'p',
              'cu': 'q',
              'rờ': 'r',
              'sờ': 's',
              'tờ': 't',
              'vờ': 'v',
              'xờ': 'x'
          };
          
          if (reversePhonetic[possibleLetter]) {
              possibleLetter = reversePhonetic[possibleLetter];
          }
          
          const sound = getLetterSound(possibleLetter);
          if (sound.length > 0) return sound;
      }
  }

  console.warn(`No sound mapping found for: "${text}"`);
  return [];
};

const getLetterSound = (letter: string): string[] => {
  const l = letter.toLowerCase().trim().replace('.', '');
  
  const specialMap: Record<string, string> = {
    'a': 'a.wav',
    'ă': 'ă.wav',
    'â': 'â.wav',
    'b': 'b.wav',
    'c': 'c.wav',
    'd': 'd.wav',
    'đ': 'đ.wav',
    'e': 'e.wav',
    'ê': 'ê.wav',
    'g': 'g.wav',
    'h': 'h.wav',
    'i': 'i ngắn.wav',
    'k': 'k.mp3',
    'l': 'l.mp3',
    'm': 'm.mp3',
    'n': 'n.mp3',
    'o': 'o.mp3',
    'ô': 'ô.mp3',
    'ơ': 'ơ.mp3',
    'p': 'p.mp3',
    'q': 'q.mp3',
    'r': 'r.mp3',
    's': 's.mp3',
    't': 't.mp3',
    'u': 'u.mp3',
    'ư': 'ư.mp3',
    'v': 'v.mp3',
    'x': 'xe.mp3', // Best guess for letter X sound
    'y': 'y.mp3'
  };
  
  if (specialMap[l]) return [specialMap[l]];
  
  return [];
}
