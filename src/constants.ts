
import { LevelInfo } from './types';

export const LEVELS: LevelInfo[] = [
  {
    id: 1,
    title: '等級一：等值分數與約分',
    description: '此等級練習分數的基本概念，包括找出等值分數以及將分數化為最簡分數。這是所有分數運算的基礎。',
    example: '`\\frac{4}{8} = \\frac{1}{?}` 或 將 `\\frac{6}{9}` 約分',
  },
  {
    id: 2,
    title: '等級二：同分母分數的加減',
    description: '當分母相同時，直接對分子進行加減運算。題目可能包含正負數。',
    example: '`\\frac{1}{5} + \\frac{-3}{5} = ?`',
  },
  {
    id: 3,
    title: '等級三：異分母分數的加減',
    description: '分母不同時，需要先通分，找到最小公分母，轉換成同分母分數後再進行加減運算。題目可能包含正負數。',
    example: '`\\frac{1}{2} + \\frac{-1}{3} = ?`',
  },
  {
    id: 4,
    title: '等級四：分數的乘法',
    description: '將分子與分子相乘，分母與分母相乘。運算前可以先約分簡化計算。題目可能包含正負數。',
    example: '`\\frac{-2}{3} \\times \\frac{3}{4} = ?`',
  },
  {
    id: 5,
    title: '等級五：分數的除法',
    description: '將除數的分子和分母顛倒（取倒數），然後與被除數相乘。題目可能包含正負數。',
    example: '`\\frac{1}{2} \\div \\frac{-3}{4} = ?`',
  },
  {
    id: 6,
    title: '等級六：分數的四則混合運算',
    description: '綜合運用加、減、乘、除四種運算，並遵循運算規則。題目可能包含正負數。',
    example: '`(\\frac{1}{2} + \\frac{-1}{3}) \\times \\frac{3}{5} = ?`',
  },
];
