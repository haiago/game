export interface MathQuestionItem {
  id: string;
  type: 'calc' | 'compare';
  title: string;
  num1: number;
  num2: number;
  operator: '+' | '-';
  result: number;
  options: (number | string)[];
  correctAnswer: number | string;
  hintEmoji: string;
}

export function generateRandomMathQuestions(count = 10, maxNumber = 10): MathQuestionItem[] {
  const list: MathQuestionItem[] = [];
  const emojis = ['🍎', '🍓', '🥕', '⭐', '🎈', '🍭', '🐟', '🐥'];

  for (let i = 0; i < count; i++) {
    const isAddition = Math.random() > 0.45;
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    if (isAddition) {
      // Phép cộng trong phạm vi 10
      const n1 = Math.floor(Math.random() * 8) + 1; // 1 -> 8
      const n2 = Math.floor(Math.random() * (10 - n1)) + 1; // n1 + n2 <= 10
      const ans = n1 + n2;

      // Sinh danh sách đáp án an toàn 100% không dùng while loop
      const wrongCandidates = [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3]
        .filter(n => n >= 0 && n !== ans);
      
      // Lấy 3 đáp án sai đầu tiên
      const selectedWrongs = wrongCandidates.slice(0, 3);
      const options = [ans, ...selectedWrongs].sort(() => Math.random() - 0.5);

      list.push({
        id: `math_add_${Date.now()}_${i}`,
        type: 'calc',
        title: `Bé hãy tính: ${n1} + ${n2} = ?`,
        num1: n1,
        num2: n2,
        operator: '+',
        result: ans,
        options,
        correctAnswer: ans,
        hintEmoji: emoji
      });
    } else {
      // Phép trừ trong phạm vi 10 (n1 >= n2 để kết quả không âm)
      const n1 = Math.floor(Math.random() * 8) + 2; // 2 -> 9
      const n2 = Math.floor(Math.random() * (n1 - 1)) + 1; // 1 -> n1 - 1
      const ans = n1 - n2;

      // Sinh danh sách đáp án an toàn 100% không dùng while loop
      const wrongCandidates = [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3]
        .filter(n => n >= 0 && n !== ans);
      
      const selectedWrongs = wrongCandidates.slice(0, 3);
      const options = [ans, ...selectedWrongs].sort(() => Math.random() - 0.5);

      list.push({
        id: `math_sub_${Date.now()}_${i}`,
        type: 'calc',
        title: `Bé hãy tính: ${n1} - ${n2} = ?`,
        num1: n1,
        num2: n2,
        operator: '-',
        result: ans,
        options,
        correctAnswer: ans,
        hintEmoji: emoji
      });
    }
  }
  return list;
}

export interface CompareQuestionItem {
  id: string;
  leftExpr: string;
  rightExpr: string;
  leftVal: number;
  rightVal: number;
  correctAnswer: '>' | '<' | '=';
  hint: string;
}

export function generateCompareQuestions(count = 10, maxNumber = 10): CompareQuestionItem[] {
  const list: CompareQuestionItem[] = [];

  for (let i = 0; i < count; i++) {
    const isExprLeft = Math.random() > 0.5;
    const isExprRight = Math.random() > 0.5;

    let leftVal = 0;
    let leftExpr = '';
    if (isExprLeft) {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * (10 - a)) + 1;
      leftVal = a + b;
      leftExpr = `${a} + ${b}`;
    } else {
      leftVal = Math.floor(Math.random() * maxNumber) + 1;
      leftExpr = `${leftVal}`;
    }

    let rightVal = 0;
    let rightExpr = '';
    const shouldEqual = Math.random() < 0.35;

    if (shouldEqual) {
      rightVal = leftVal;
      if (rightVal >= 4 && Math.random() > 0.4) {
        const splitA = Math.floor(rightVal / 2);
        const splitB = rightVal - splitA;
        rightExpr = `${splitA} + ${splitB}`;
      } else {
        rightExpr = `${rightVal}`;
      }
    } else {
      if (isExprRight) {
        const c = Math.floor(Math.random() * 5) + 1;
        const d = Math.floor(Math.random() * (10 - c)) + 1;
        rightVal = c + d;
        rightExpr = `${c} + ${d}`;
      } else {
        rightVal = Math.floor(Math.random() * maxNumber) + 1;
        rightExpr = `${rightVal}`;
      }
    }

    let correctAnswer: '>' | '<' | '=' = '=';
    if (leftVal > rightVal) correctAnswer = '>';
    else if (leftVal < rightVal) correctAnswer = '<';
    else correctAnswer = '=';

    list.push({
      id: `compare_${Date.now()}_${i}`,
      leftExpr,
      rightExpr,
      leftVal,
      rightVal,
      correctAnswer,
      hint: `Bên trái là ${leftVal}, bên phải là ${rightVal}`
    });
  }

  return list;
}
