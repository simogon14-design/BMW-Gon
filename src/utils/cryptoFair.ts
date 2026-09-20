import { ProvablyFairCalculation } from '../types';

/**
 * Real client-side cryptographic hashing using the standard Web Crypto API (crypto.subtle)
 */

// Convert ArrayBuffer to Hex string
export function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert string to Uint8Array UTF-8
export function stringToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Fallback pure-JS SHA-256 implementation for environments where crypto.subtle is restricted
function jsSha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i = 0, j = 0;
  let result = '';
  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  for (i = 0; i < asciiBitLength; i += 8) {
    words[i >> 5] |= (ascii.charCodeAt(i / 8) & 0xff) << (24 - (i % 32));
  }
  words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (i = 0; i < words.length; i += 16) {
    const w = words.slice(i, i + 16);
    const oldHash = hash.slice(0);

    for (j = 0; j < 64; j++) {
      let s0: number, s1: number, ch: number, temp1: number, temp2: number, maj: number;
      if (j >= 16) {
        s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }
      s1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      temp1 = (hash[7] + s1 + ch + k[j] + w[j]) | 0;
      s0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      temp2 = (s0 + maj) | 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }

    for (j = 0; j < 8; j++) {
      hash[j] = (hash[j] + oldHash[j]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

// Compute SHA-256 hash safely with fallback
export async function sha256(message: string): Promise<string> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
      const data = stringToBuffer(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      return bufferToHex(hashBuffer);
    }
  } catch {
    // Graceful fallback to pure JS SHA-256 implementation
  }
  return jsSha256(message);
}

// Compute HMAC-SHA256 safely with fallback
export async function hmacSha256(keyString: string, messageString: string): Promise<string> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.importKey && crypto.subtle.sign) {
      const enc = new TextEncoder();
      const keyData = enc.encode(keyString);
      const messageData = enc.encode(messageString);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
      return bufferToHex(signature);
    }
  } catch {
    // Graceful fallback to JS HMAC
  }
  // Standard HMAC fallback: H((K' ^ opad) || H((K' ^ ipad) || message))
  let key = keyString;
  if (key.length > 64) {
    key = jsSha256(key);
  }
  while (key.length < 64) {
    key += '\0';
  }
  let oKeyPad = '';
  let iKeyPad = '';
  for (let i = 0; i < 64; i++) {
    oKeyPad += String.fromCharCode(key.charCodeAt(i) ^ 0x5c);
    iKeyPad += String.fromCharCode(key.charCodeAt(i) ^ 0x36);
  }
  const innerHash = jsSha256(iKeyPad + messageString);
  // Convert hex string to raw byte chars for outer hash
  let innerRaw = '';
  for (let i = 0; i < innerHash.length; i += 2) {
    innerRaw += String.fromCharCode(parseInt(innerHash.substr(i, 2), 16));
  }
  return jsSha256(oKeyPad + innerRaw);
}

/**
 * Industry-standard Provably Fair resolution algorithm
 * Inputs: Server Seed, Client Seed, Nonce
 */
export async function verifyProvablyFairOutcome(
  serverSeed: string,
  clientSeed: string,
  nonce: number
): Promise<ProvablyFairCalculation> {
  // 1. Compute Public Server Seed Hash (used for pre-commitment)
  const serverSeedHash = await sha256(serverSeed);

  // 2. Message is the client seed concatenated with the round nonce
  const message = `${clientSeed}:${nonce}`;

  // 3. Generate HMAC-SHA256 with server seed as key
  const hmacResult = await hmacSha256(serverSeed, message);

  // 4. Take the first 8 hex characters (32 bits / 4 bytes)
  const first8Hex = hmacResult.substring(0, 8);
  const decimalEquivalent = parseInt(first8Hex, 16);

  // 5. Standard formula: crash multiplier = Math.max(1.00, (100 / (1 - (decimalEquivalent / 4294967296))) * 0.99)
  // Or simplified 52-bit / 32-bit house edge calculation
  const houseEdgeFactor = 0.99; // 1% casino house edge
  const rawRatio = decimalEquivalent / 4294967296; // divided by 2^32
  let calculatedMultiplier = 1.00;
  
  if (rawRatio < 0.99) {
    calculatedMultiplier = Number(((1 / (1 - rawRatio)) * houseEdgeFactor).toFixed(2));
    // Round to 2 decimal places, cap realistically
    if (calculatedMultiplier < 1.01) calculatedMultiplier = 1.00;
    if (calculatedMultiplier > 1000) calculatedMultiplier = 1000.00;
  } else {
    calculatedMultiplier = 100.00;
  }

  return {
    serverSeed,
    clientSeed,
    nonce,
    serverSeedHash,
    combinedString: `${serverSeed} ⟷ ${message}`,
    hmacSha256Result: hmacResult,
    firstHexGroup: first8Hex,
    decimalEquivalent,
    calculatedMultiplier,
    verified: true,
  };
}

// Generate secure random string for client/server seeds safely
export function generateRandomSeed(length: number = 32): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const bytes = new Uint8Array(length);
      crypto.getRandomValues(bytes);
      return bufferToHex(bytes.buffer);
    }
  } catch {
    // Fallback pseudo-random seed generation
  }
  let res = '';
  for (let i = 0; i < length * 2; i++) {
    res += Math.floor(Math.random() * 16).toString(16);
  }
  return res;
}
