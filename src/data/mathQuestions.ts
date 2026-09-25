export interface MathQuestionItem {
  id: string;
  type: 'calc';
  targetSlot: 'result' | 'operator' | 'num1' | 'num2'; // Tìm kết quả (? ở vế sau) | Tìm dấu (+ hay -) | Tìm số hạng còn thiếu
  title: string;
  num1: number;
  num2: number;
  operator: '+' | '-';
  result: number;
  options: (number | string)[];
  correctAnswer: number | string;
  hintEmoji: string;
}

export function generateRandomMathQuestions(count = 10, maxNumber = 15): MathQuestionItem[] {
  const list: MathQuestionItem[] = [];
  const emojis = ['🍎', '🍓', '🥕', '⭐', '🎈', '🍭', '🐟', '🐥'];

  for (let i = 0; i < count; i++) {
    const isAddition = Math.random() > 0.45;
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    // Quyết định dạng bài tập:
    // ~40% Tìm kết quả (? ở sau dấu =)
    // ~30% Điền dấu (+ hay -)
    // ~30% Điền số còn thiếu (Ví dụ: 8 + ? = 12 hoặc ? - 3 = 5)
    const typeRoll = Math.random();
    let targetSlot: 'result' | 'operator' | 'num1' | 'num2' = 'result';
    if (typeRoll < 0.4) {
      targetSlot = 'result';
    } else if (typeRoll < 0.7) {
      targetSlot = 'operator';
    } else {
      targetSlot = Math.random() > 0.5 ? 'num2' : 'num1';
    }

    if (isAddition) {
      // Phép cộng trong phạm vi 0-15: ans <= maxNumber (15)
      const ans = Math.floor(Math.random() * (maxNumber - 1)) + 2; // 2 -> 15
      const n1 = Math.floor(Math.random() * (ans - 1)) + 1; // 1 -> ans-1
      const n2 = ans - n1;

      let title = '';
      let correctAnswer: number | string = ans;
      let options: (number | string)[] = [];

      if (targetSlot === 'result') {
        title = `Bé hãy tính: ${n1} + ${n2} = ?`;
        correctAnswer = ans;
        const wrongCandidates = [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3, ans - 3, ans + 5, ans - 5]
          .filter(n => n >= 0 && n <= maxNumber && n !== ans);
        const selectedWrongs = wrongCandidates.slice(0, 3);
        while (selectedWrongs.length < 3) {
          const dummy = Math.floor(Math.random() * (maxNumber + 1));
          if (dummy !== ans && !selectedWrongs.includes(dummy)) selectedWrongs.push(dummy);
        }
        options = [ans, ...selectedWrongs].sort(() => Math.random() - 0.5);
      } else if (targetSlot === 'operator') {
        title = `Bé hãy điền dấu thích hợp: ${n1} ? ${n2} = ${ans}`;
        correctAnswer = '+';
        options = ['+', '-'];
      } else if (targetSlot === 'num2') {
        title = `Bé hãy tìm số còn thiếu: ${n1} + ? = ${ans}`;
        correctAnswer = n2;
        const wrongCandidates = [n2 + 1, n2 - 1, n2 + 2, n2 - 2, n2 + 3, n2 - 3]
          .filter(n => n >= 0 && n <= maxNumber && n !== n2);
        const selectedWrongs = wrongCandidates.slice(0, 3);
        while (selectedWrongs.length < 3) {
          const dummy = Math.floor(Math.random() * (maxNumber + 1));
          if (dummy !== n2 && !selectedWrongs.includes(dummy)) selectedWrongs.push(dummy);
        }
        options = [n2, ...selectedWrongs].sort(() => Math.random() - 0.5);
      } else {
        // targetSlot === 'num1'
        title = `Bé hãy tìm số còn thiếu: ? + ${n2} = ${ans}`;
        correctAnswer = n1;
        const wrongCandidates = [n1 + 1, n1 - 1, n1 + 2, n1 - 2, n1 + 3, n1 - 3]
          .filter(n => n >= 0 && n <= maxNumber && n !== n1);
        const selectedWrongs = wrongCandidates.slice(0, 3);
        while (selectedWrongs.length < 3) {
          const dummy = Math.floor(Math.random() * (maxNumber + 1));
          if (dummy !== n1 && !selectedWrongs.includes(dummy)) selectedWrongs.push(dummy);
        }
        options = [n1, ...selectedWrongs].sort(() => Math.random() - 0.5);
      }

      list.push({
        id: `math_add_${Date.now()}_${i}`,
        type: 'calc',
        targetSlot,
        title,
        num1: n1,
        num2: n2,
        operator: '+',
        result: ans,
        options,
        correctAnswer,
        hintEmoji: emoji
      });
    } else {
      // Phép trừ trong phạm vi 0-15 (n1 <= 15, ans >= 0)
      const n1 = Math.floor(Math.random() * (maxNumber - 1)) + 2; // 2 -> 15
      const n2 = Math.floor(Math.random() * (n1 - 1)) + 1; // 1 -> n1-1
      const ans = n1 - n2;

      let title = '';
      let correctAnswer: number | string = ans;
      let options: (number | string)[] = [];

      if (targetSlot === 'result') {
        title = `Bé hãy tính: ${n1} - ${n2} = ?`;
        correctAnswer = ans;
        const wrongCandidates = [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3, ans - 3, ans + 5, ans - 5]
          .filter(n => n >= 0 && n <= maxNumber && n !== ans);
        const selectedWrongs = wrongCandidates.slice(0, 3);
        while (selectedWrongs.length < 3) {
          const dummy = Math.floor(Math.random() * (maxNumber + 1));
          if (dummy !== ans && !selectedWrongs.includes(dummy)) selectedWrongs.push(dummy);
        }
        options = [ans, ...selectedWrongs].sort(() => Math.random() - 0.5);
      } else if (targetSlot === 'operator') {
        title = `Bé hãy điền dấu thích hợp: ${n1} ? ${n2} = ${ans}`;
        correctAnswer = '-';
        options = ['+', '-'];
      } else if (targetSlot === 'num2') {
        title = `Bé hãy tìm số còn thiếu: ${n1} - ? = ${ans}`;
        correctAnswer = n2;
        const wrongCandidates = [n2 + 1, n2 - 1, n2 + 2, n2 - 2, n2 + 3, n2 - 3]
          .filter(n => n >= 0 && n <= maxNumber && n !== n2);
        const selectedWrongs = wrongCandidates.slice(0, 3);
        while (selectedWrongs.length < 3) {
          const dummy = Math.floor(Math.random() * (maxNumber + 1));
          if (dummy !== n2 && !selectedWrongs.includes(dummy)) selectedWrongs.push(dummy);
        }
        options = [n2, ...selectedWrongs].sort(() => Math.random() - 0.5);
      } else {
        // targetSlot === 'num1'
        title = `Bé hãy tìm số còn thiếu: ? - ${n2} = ${ans}`;
        correctAnswer = n1;
        const wrongCandidates = [n1 + 1, n1 - 1, n1 + 2, n1 - 2, n1 + 3, n1 - 3]
          .filter(n => n >= 0 && n <= maxNumber && n !== n1);
        const selectedWrongs = wrongCandidates.slice(0, 3);
        while (selectedWrongs.length < 3) {
          const dummy = Math.floor(Math.random() * (maxNumber + 1));
          if (dummy !== n1 && !selectedWrongs.includes(dummy)) selectedWrongs.push(dummy);
        }
        options = [n1, ...selectedWrongs].sort(() => Math.random() - 0.5);
      }

      list.push({
        id: `math_sub_${Date.now()}_${i}`,
        type: 'calc',
        targetSlot,
        title,
        num1: n1,
        num2: n2,
        operator: '-',
        result: ans,
        options,
        correctAnswer,
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

export function generateCompareQuestions(count = 10, maxNumber = 15): CompareQuestionItem[] {
  const list: CompareQuestionItem[] = [];

  for (let i = 0; i < count; i++) {
    const isExprLeft = Math.random() > 0.4;
    const isExprRight = Math.random() > 0.4;

    let leftVal = 0;
    let leftExpr = '';
    if (isExprLeft) {
      // Phép tính có tổng/hiệu trong phạm vi 0-15
      if (Math.random() > 0.45) {
        // Phép cộng
        const ans = Math.floor(Math.random() * (maxNumber - 2)) + 3; // 3 -> 15
        const a = Math.floor(Math.random() * (ans - 1)) + 1;
        const b = ans - a;
        leftVal = ans;
        leftExpr = `${a} + ${b}`;
      } else {
        // Phép trừ
        const a = Math.floor(Math.random() * (maxNumber - 2)) + 3; // 3 -> 15
        const b = Math.floor(Math.random() * (a - 1)) + 1;
        leftVal = a - b;
        leftExpr = `${a} - ${b}`;
      }
    } else {
      leftVal = Math.floor(Math.random() * (maxNumber + 1)); // 0 -> 15
      leftExpr = `${leftVal}`;
    }

    let rightVal = 0;
    let rightExpr = '';
    const shouldEqual = Math.random() < 0.35;

    if (shouldEqual) {
      rightVal = leftVal;
      if (rightVal >= 2 && Math.random() > 0.35) {
        const splitA = Math.floor(Math.random() * (rightVal - 1)) + 1;
        const splitB = rightVal - splitA;
        rightExpr = `${splitA} + ${splitB}`;
      } else {
        rightExpr = `${rightVal}`;
      }
    } else {
      if (isExprRight) {
        if (Math.random() > 0.45) {
          const ans = Math.floor(Math.random() * (maxNumber - 2)) + 3;
          const c = Math.floor(Math.random() * (ans - 1)) + 1;
          const d = ans - c;
          rightVal = ans;
          rightExpr = `${c} + ${d}`;
        } else {
          const c = Math.floor(Math.random() * (maxNumber - 2)) + 3;
          const d = Math.floor(Math.random() * (c - 1)) + 1;
          rightVal = c - d;
          rightExpr = `${c} - ${d}`;
        }
      } else {
        rightVal = Math.floor(Math.random() * (maxNumber + 1)); // 0 -> 15
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

export interface SplitCombineQuestionItem {
  id: string;
  mode: 'combine' | 'split'; // 'combine': Gộp 2 số thành tổng | 'split': Tách tổng thành 2 số (tìm 1 nhánh)
  total: number;
  part1: number;
  part2: number;
  missingSlot: 'total' | 'part1' | 'part2';
  title: string;
  hint: string;
  options: number[];
  correctAnswer: number;
  emoji: string;
}

export function generateSplitCombineQuestions(count = 10, maxTotal = 10): SplitCombineQuestionItem[] {
  const list: SplitCombineQuestionItem[] = [];
  const emojis = ['🍓', '🍎', '🥕', '⭐', '🎈', '🍭', '🐟', '🐥', '🍬', '🍒'];

  for (let i = 0; i < count; i++) {
    const isCombine = Math.random() > 0.5;
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    // Tổng từ 2 đến maxTotal (chuẩn lớp 1 thường từ 2 - 10)
    const total = Math.floor(Math.random() * (maxTotal - 1)) + 2;
    // Nhánh 1 từ 1 đến total - 1
    const part1 = Math.floor(Math.random() * (total - 1)) + 1;
    const part2 = total - part1;

    let missingSlot: 'total' | 'part1' | 'part2';
    let correctAnswer: number;
    let title: string;
    let hint: string;

    if (isCombine) {
      // Chế độ GỘP: Biết part1 và part2, tìm total
      missingSlot = 'total';
      correctAnswer = total;
      title = `Gộp ${part1} và ${part2} được mấy?`;
      hint = `Có ${part1} ${emoji} gộp với ${part2} ${emoji} được ${total} ${emoji}`;
    } else {
      // Chế độ TÁCH: Biết total và 1 part, tìm part còn lại
      const hidePart2 = Math.random() > 0.5;
      if (hidePart2) {
        missingSlot = 'part2';
        correctAnswer = part2;
        title = `${total} gồm ${part1} và mấy?`;
        hint = `${total} ${emoji} gồm ${part1} ${emoji} và ${part2} ${emoji}`;
      } else {
        missingSlot = 'part1';
        correctAnswer = part1;
        title = `${total} gồm mấy và ${part2}?`;
        hint = `${total} ${emoji} gồm ${part1} ${emoji} và ${part2} ${emoji}`;
      }
    }

    // Sinh 4 phương án trắc nghiệm trong phạm vi 0 -> maxTotal
    const wrongCandidates = [
      correctAnswer + 1,
      correctAnswer - 1,
      correctAnswer + 2,
      correctAnswer - 2,
      correctAnswer + 3,
      correctAnswer - 3
    ].filter(n => n >= 0 && n <= maxTotal && n !== correctAnswer);

    const selectedWrongs = wrongCandidates.slice(0, 3);
    while (selectedWrongs.length < 3) {
      const dummy = Math.floor(Math.random() * (maxTotal + 1));
      if (dummy !== correctAnswer && !selectedWrongs.includes(dummy)) {
        selectedWrongs.push(dummy);
      }
    }

    const options = [correctAnswer, ...selectedWrongs].sort(() => Math.random() - 0.5);

    list.push({
      id: `split_combine_${Date.now()}_${i}`,
      mode: isCombine ? 'combine' : 'split',
      total,
      part1,
      part2,
      missingSlot,
      title,
      hint,
      options,
      correctAnswer,
      emoji
    });
  }

  return list;
}

export interface OrderQuestionItem {
  id: string;
  orderType: 'asc' | 'desc'; // 'asc': Từ bé đến lớn | 'desc': Từ lớn đến bé
  title: string;
  instruction: string;
  numbers: number[]; // Các số ban đầu bị xáo trộn
  correctOrder: number[]; // Thứ tự đúng cần sắp xếp
  icon: string;
}

export function generateOrderQuestions(count = 10, maxNumber = 15): OrderQuestionItem[] {
  const list: OrderQuestionItem[] = [];
  const themeIcons = ['🚂', '🐛', '🎈', '⭐', '🍎', '🐟', '🚗', '🚀', '🌺', '🐢'];

  for (let i = 0; i < count; i++) {
    const isAsc = Math.random() > 0.5;
    const icon = themeIcons[i % themeIcons.length];

    // Tạo tập 4 số ngẫu nhiên không trùng lặp trong khoảng 0 -> maxNumber
    const pool: number[] = [];
    while (pool.length < 4) {
      const num = Math.floor(Math.random() * (maxNumber + 1));
      if (!pool.includes(num)) {
        pool.push(num);
      }
    }

    // Sắp xếp tăng dần hoặc giảm dần
    const correctOrder = [...pool].sort((a, b) => isAsc ? a - b : b - a);

    // Trộn ngẫu nhiên các số ban đầu (đảm bảo không trùng ngay với kết quả đúng)
    let shuffled = [...pool].sort(() => Math.random() - 0.5);
    let attempts = 0;
    while (attempts < 5 && JSON.stringify(shuffled) === JSON.stringify(correctOrder)) {
      shuffled = [...pool].sort(() => Math.random() - 0.5);
      attempts++;
    }

    const title = isAsc
      ? 'Sắp xếp theo thứ tự: TỪ BÉ ĐẾN LỚN'
      : 'Sắp xếp theo thứ tự: TỪ LỚN ĐẾN BÉ';

    const instruction = isAsc
      ? 'Bé hãy chạm hoặc kéo các toa số từ bé nhất đến lớn nhất nhé!'
      : 'Bé hãy chạm hoặc kéo các toa số từ lớn nhất đến bé nhất nhé!';

    list.push({
      id: `order_${Date.now()}_${i}`,
      orderType: isAsc ? 'asc' : 'desc',
      title,
      instruction,
      numbers: shuffled,
      correctOrder,
      icon
    });
  }

  return list;
}
