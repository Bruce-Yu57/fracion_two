import { LevelInfo, Question, Answer } from '../types';

// --- Helper Functions ---

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

const simplify = (n: number, d: number): Answer => {
  if (d === 0) {
    console.error("Attempted to simplify with a zero denominator.");
    // Return a valid fraction to prevent crashes, e.g., 0.
    return { numerator: 0, denominator: 1 };
  };
  
  if (d < 0) {
    n = -n;
    d = -d;
  }
  
  if (n === 0) return { numerator: 0, denominator: 1 };
  
  const commonDivisor = gcd(Math.abs(n), Math.abs(d));
  return {
    numerator: n / commonDivisor,
    denominator: d / commonDivisor,
  };
};

const formatFrac = (f: Answer, isFirstTerm: boolean = false): string => {
    if (f.denominator === 1) {
        if (f.numerator < 0 && !isFirstTerm) return `(${f.numerator})`;
        return `${f.numerator}`;
    }
    const fracStr = `\\frac{${Math.abs(f.numerator)}}{${f.denominator}}`;
    if (f.numerator < 0) {
        if (isFirstTerm) return `-${fracStr}`;
        return `(-${fracStr})`;
    }
    return fracStr;
};


// --- Level Specific Generators ---

const generateLevel1 = (): Question[] => { // Simplification
    return Array.from({ length: 3 }, () => {
        const d = getRandomInt(2, 10);
        let n = getRandomInt(-10, 10);
        if (n === 0) n = 1; // Avoid 0 for simplification problems
        const multiplier = getRandomInt(2, 5);
        const problem = `\\text{化簡：} \\quad ${formatFrac({numerator: n * multiplier, denominator: d * multiplier}, true)}`;
        const answer = simplify(n, d);
        return { problem, answer };
    });
};

const generateLevel2 = (): Question[] => { // Common Denominator +/-
    return Array.from({ length: 3 }, () => {
        const d = getRandomInt(3, 15);
        const n1 = getRandomInt(-12, 12);
        const n2 = getRandomInt(-12, 12);
        const op = Math.random() > 0.5 ? '+' : '-';
        const problem = `${formatFrac({numerator: n1, denominator: d}, true)} ${op} ${formatFrac({numerator: n2, denominator: d})}`;
        const answerN = op === '+' ? n1 + n2 : n1 - n2;
        const answer = simplify(answerN, d);
        return { problem, answer };
    });
};


const generateLevel3 = (): Question[] => { // Different Denominators +/-
    return Array.from({ length: 3 }, () => {
        const d1 = getRandomInt(2, 9);
        let d2 = getRandomInt(2, 9);
        while(d1 === d2) d2 = getRandomInt(2, 9);
        const n1 = getRandomInt(-10, 10);
        const n2 = getRandomInt(-10, 10);
        const op = Math.random() > 0.5 ? '+' : '-';
        const problem = `${formatFrac({numerator: n1, denominator: d1}, true)} ${op} ${formatFrac({numerator: n2, denominator: d2})}`;
        const answerN = op === '+' ? (n1 * d2 + n2 * d1) : (n1 * d2 - n2 * d1);
        const answerD = d1 * d2;
        const answer = simplify(answerN, answerD);
        return { problem, answer };
    });
};


const generateLevel4 = (): Question[] => { // Multiplication
    return Array.from({ length: 3 }, () => {
        const f1 = { n: getRandomInt(-9, 9), d: getRandomInt(2, 10) };
        const f2 = { n: getRandomInt(-9, 9), d: getRandomInt(2, 10) };
        const problem = `${formatFrac({numerator: f1.n, denominator: f1.d}, true)} \\times ${formatFrac({numerator: f2.n, denominator: f2.d})}`;
        const answer = simplify(f1.n * f2.n, f1.d * f2.d);
        return { problem, answer };
    });
};

const generateLevel5 = (): Question[] => { // Division
    return Array.from({ length: 3 }, () => {
        const f1 = { n: getRandomInt(-9, 9), d: getRandomInt(2, 10) };
        let n2 = 0;
        while (n2 === 0) n2 = getRandomInt(-9, 9);
        const f2 = { n: n2, d: getRandomInt(2, 10) };
        const problem = `${formatFrac({numerator: f1.n, denominator: f1.d}, true)} \\div ${formatFrac({numerator: f2.n, denominator: f2.d})}`;
        const answer = simplify(f1.n * f2.d, f1.d * f2.n);
        return { problem, answer };
    });
};

const generateLevel6 = (): Question[] => { // Mixed operations
    return Array.from({ length: 3 }, () => {
        const f1 = { n: getRandomInt(-5, 5), d: getRandomInt(2, 6) };
        const f2 = { n: getRandomInt(-5, 5), d: getRandomInt(2, 6) };
        let n3 = 0;
        while (n3 === 0) n3 = getRandomInt(-5, 5); // Ensure divisor is not zero
        const f3 = { n: n3, d: getRandomInt(2, 6) };
        
        const op1 = Math.random() > 0.5 ? '+' : '-';
        const op2 = Math.random() > 0.5 ? '\\times' : '\\div';
        
        const problem = `(${formatFrac({numerator: f1.n, denominator: f1.d}, true)} ${op1} ${formatFrac({numerator: f2.n, denominator: f2.d})}) ${op2} ${formatFrac({numerator: f3.n, denominator: f3.d})}`;

        const intermediateN = op1 === '+' ? (f1.n * f2.d + f2.n * f1.d) : (f1.n * f2.d - f2.n * f1.d);
        const intermediateD = f1.d * f2.d;
        
        let finalAnswer;
        if (op2 === '\\times') {
            finalAnswer = simplify(intermediateN * f3.n, intermediateD * f3.d);
        } else { // Division
            finalAnswer = simplify(intermediateN * f3.d, intermediateD * f3.n);
        }
        
        return { problem, answer: finalAnswer };
    });
};

export const generateProblemsForLevel = (level: LevelInfo): Question[] => {
  try {
    switch (level.id) {
      case 1: return generateLevel1();
      case 2: return generateLevel2();
      case 3: return generateLevel3();
      case 4: return generateLevel4();
      case 5: return generateLevel5();
      case 6: return generateLevel6();
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error generating problems for level ${level.id}:`, error);
    return [];
  }
};
