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

export function generateRandomMathQuestions(count = 10, maxNumber = 20): MathQuestionItem[] {
  const list: MathQuestionItem[] = [];
  const emojis = ['🍎', '🍓', '🥕', '⭐', '🎈', '🍭', '🐟', '🐥'];

  for (let i = 0; i < count; i++) {
    const isAddition = Math.random() > 0.45;
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    if (isAddition) {
      // Phép cộng trong phạm vi 0-20
      // 60% phép tính trong phạm vi 11-20, 40% phép tính dễ 1-10
      const isOverTen = Math.random() > 0.35;
      let n1 = 0;
      let n2 = 0;

      if (isOverTen) {
        n1 = Math.floor(Math.random() * 11) + 5; // 5 -> 15
        const maxN2 = Math.min(10, 20 - n1);
        n2 = Math.floor(Math.random() * maxN2) + 1;
      } else {
        n1 = Math.floor(Math.random() * 8) + 1;
        n2 = Math.floor(Math.random() * (10 - n1)) + 1;
      }

      const ans = n1 + n2;

      // Sinh danh sách đáp án an toàn trong phạm vi 0-20
      const wrongCandidates = [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3, ans - 3, ans + 10, ans - 10]
        .filter(n => n >= 0 && n <= 20 && n !== ans);
      
      const selectedWrongs = wrongCandidates.slice(0, 3);
      // Nếu chưa đủ 3 đáp án sai:
      while (selectedWrongs.length < 3) {
        const dummy = Math.floor(Math.random() * 21);
        if (dummy !== ans && !selectedWrongs.includes(dummy)) {
          selectedWrongs.push(dummy);
        }
      }

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
      // Phép trừ trong phạm vi 0-20
      const isOverTen = Math.random() > 0.35;
      let n1 = 0;
      let n2 = 0;

      if (isOverTen) {
        n1 = Math.floor(Math.random() * 10) + 11; // 11 -> 20
        n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
      } else {
        n1 = Math.floor(Math.random() * 8) + 2; // 2 -> 9
        n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
      }

      const ans = n1 - n2;

      const wrongCandidates = [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3, ans - 3, ans + 10, ans - 10]
        .filter(n => n >= 0 && n <= 20 && n !== ans);
      
      const selectedWrongs = wrongCandidates.slice(0, 3);
      while (selectedWrongs.length < 3) {
        const dummy = Math.floor(Math.random() * 21);
        if (dummy !== ans && !selectedWrongs.includes(dummy)) {
          selectedWrongs.push(dummy);
        }
      }

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

export function generateCompareQuestions(count = 10, maxNumber = 20): CompareQuestionItem[] {
  const list: CompareQuestionItem[] = [];

  for (let i = 0; i < count; i++) {
    const isExprLeft = Math.random() > 0.4;
    const isExprRight = Math.random() > 0.4;

    let leftVal = 0;
    let leftExpr = '';
    if (isExprLeft) {
      // Phép tính có tổng/hiệu trong phạm vi 0-20
      if (Math.random() > 0.4) {
        // Phép cộng
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * (20 - a)) + 1;
        leftVal = a + b;
        leftExpr = `${a} + ${b}`;
      } else {
        // Phép trừ
        const a = Math.floor(Math.random() * 12) + 8; // 8 -> 19
        const b = Math.floor(Math.random() * (a - 1)) + 1;
        leftVal = a - b;
        leftExpr = `${a} - ${b}`;
      }
    } else {
      leftVal = Math.floor(Math.random() * 21); // 0 -> 20
      leftExpr = `${leftVal}`;
    }

    let rightVal = 0;
    let rightExpr = '';
    const shouldEqual = Math.random() < 0.35;

    if (shouldEqual) {
      rightVal = leftVal;
      if (rightVal >= 4 && Math.random() > 0.35) {
        const splitA = Math.floor(rightVal / 2);
        const splitB = rightVal - splitA;
        rightExpr = `${splitA} + ${splitB}`;
      } else {
        rightExpr = `${rightVal}`;
      }
    } else {
      if (isExprRight) {
        if (Math.random() > 0.4) {
          const c = Math.floor(Math.random() * 10) + 1;
          const d = Math.floor(Math.random() * (20 - c)) + 1;
          rightVal = c + d;
          rightExpr = `${c} + ${d}`;
        } else {
          const c = Math.floor(Math.random() * 12) + 8;
          const d = Math.floor(Math.random() * (c - 1)) + 1;
          rightVal = c - d;
          rightExpr = `${c} - ${d}`;
        }
      } else {
        rightVal = Math.floor(Math.random() * 21); // 0 -> 20
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
