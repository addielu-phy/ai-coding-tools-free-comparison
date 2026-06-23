const QUESTIONS = [
  {
    "id": "math-final-001",
    "subject": "數學",
    "type": "3-4核心翻卡",
    "stem": "看到「兩三角形全等」時，先檢查哪幾種條件？",
    "answer": "SSS、SAS、ASA/AAS、RHS。",
    "explanation": "不要只看圖像像不像；要確認對應邊角。",
    "skill": "全等判斷",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "全等判斷"
    ]
  },
  {
    "id": "math-final-002",
    "subject": "數學",
    "type": "3-4核心翻卡",
    "stem": "中垂線上的點有什麼性質？",
    "answer": "到線段兩端點距離相等。",
    "explanation": "若題目出現「到 A、B 等距」，常可連到 AB 的中垂線。",
    "skill": "中垂線",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "中垂線"
    ]
  },
  {
    "id": "math-final-003",
    "subject": "數學",
    "type": "3-4核心翻卡",
    "stem": "角平分線上的點有什麼性質？",
    "answer": "到角的兩邊距離相等。",
    "explanation": "遇到「到兩邊距離相同」可想到角平分線。",
    "skill": "角平分線",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "角平分線"
    ]
  },
  {
    "id": "math-final-004",
    "subject": "數學",
    "type": "3-4核心翻卡",
    "stem": "三角形內角和是多少？外角和常用什麼？",
    "answer": "內角和 180°；一個外角等於不相鄰兩內角和。",
    "explanation": "幾何角度題先找 180°、外角、平行線角。",
    "skill": "角度",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "角度"
    ]
  },
  {
    "id": "math-final-005",
    "subject": "數學",
    "type": "3-4核心翻卡",
    "stem": "多邊形內角和公式？",
    "answer": "(n - 2) × 180°。",
    "explanation": "如果問五邊形、六邊形角度，先用內角和。",
    "skill": "多邊形",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "多邊形"
    ]
  },
  {
    "id": "math-final-006",
    "subject": "數學",
    "type": "3-5核心翻卡",
    "stem": "三角形中「大邊對大角」是什麼意思？",
    "answer": "較長的邊所對的角較大；較大的角所對的邊較長。",
    "explanation": "比較角或邊時，不一定要算出角度。",
    "skill": "邊角關係",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "邊角關係"
    ]
  },
  {
    "id": "math-final-007",
    "subject": "數學",
    "type": "3-5核心翻卡",
    "stem": "三角形三邊能成立的條件？",
    "answer": "任兩邊和大於第三邊；任兩邊差小於第三邊。",
    "explanation": "給兩邊求第三邊範圍時，用 |a-b| < x < a+b。",
    "skill": "三角形不等式",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "三角形不等式"
    ]
  },
  {
    "id": "math-final-008",
    "subject": "數學",
    "type": "3-5核心翻卡",
    "stem": "直角三角形中，最長邊一定是哪一邊？",
    "answer": "斜邊。",
    "explanation": "斜邊對 90°，所以一定最長。",
    "skill": "直角三角形",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "直角三角形"
    ]
  },
  {
    "id": "math-final-009",
    "subject": "數學",
    "type": "4-1核心翻卡",
    "stem": "同底同高的三角形面積關係？",
    "answer": "面積相等。",
    "explanation": "平行線間距相等，所以同底且頂點在平行線上常面積相等。",
    "skill": "面積",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "面積"
    ]
  },
  {
    "id": "math-final-010",
    "subject": "數學",
    "type": "4-1核心翻卡",
    "stem": "平行線間距固定時，底相同的三角形面積如何？",
    "answer": "相等。",
    "explanation": "題目有兩條平行線 L1 // L2，常考同底等高。",
    "skill": "平行與面積",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "平行與面積"
    ]
  },
  {
    "id": "math-final-011",
    "subject": "數學",
    "type": "4-2核心翻卡",
    "stem": "平行四邊形的基本性質？",
    "answer": "對邊平行且相等、對角相等、鄰角互補、對角線互相平分。",
    "explanation": "題目出現平行四邊形，先把這四件事寫出來。",
    "skill": "平行四邊形",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "平行四邊形"
    ]
  },
  {
    "id": "math-final-012",
    "subject": "數學",
    "type": "4-2核心翻卡",
    "stem": "平行四邊形面積公式？",
    "answer": "底 × 高。",
    "explanation": "斜邊長不是高；高要垂直底。",
    "skill": "面積",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "面積"
    ]
  },
  {
    "id": "math-final-013",
    "subject": "數學",
    "type": "4-3核心翻卡",
    "stem": "矩形比平行四邊形多什麼性質？",
    "answer": "四個角都是直角，對角線等長且互相平分。",
    "explanation": "矩形一定是平行四邊形，但不一定是菱形。",
    "skill": "矩形",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "矩形"
    ]
  },
  {
    "id": "math-final-014",
    "subject": "數學",
    "type": "4-3核心翻卡",
    "stem": "菱形比平行四邊形多什麼性質？",
    "answer": "四邊等長，對角線互相垂直且平分。",
    "explanation": "菱形面積常用兩對角線乘積除以 2。",
    "skill": "菱形",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "菱形"
    ]
  },
  {
    "id": "math-final-015",
    "subject": "數學",
    "type": "4-3核心翻卡",
    "stem": "正方形同時具有哪些圖形性質？",
    "answer": "同時是矩形、菱形、平行四邊形。",
    "explanation": "所以有直角、四邊等長、對角線等長且互相垂直平分。",
    "skill": "正方形",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "正方形"
    ]
  },
  {
    "id": "math-final-016",
    "subject": "數學",
    "type": "4-3核心翻卡",
    "stem": "梯形與等腰梯形常考什麼？",
    "answer": "梯形一組對邊平行；等腰梯形兩腰等長、底角相等、對角線等長。",
    "explanation": "等腰梯形題常要補輔助線切成直角三角形。",
    "skill": "梯形",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "梯形"
    ]
  },
  {
    "id": "math-final-017",
    "subject": "數學",
    "type": "3-4補強選擇",
    "stem": "已知兩三角形有兩邊及其夾角分別相等，最適合用哪一個全等判定？",
    "choices": [
      {
        "key": "A",
        "text": "SSS"
      },
      {
        "key": "B",
        "text": "SAS"
      },
      {
        "key": "C",
        "text": "AAS"
      },
      {
        "key": "D",
        "text": "RHS"
      }
    ],
    "answer": "B",
    "explanation": "兩邊與夾角相等就是 SAS。",
    "skill": "全等判斷",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-1~3-4_學用/教用｜補 3-4 同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-4"
    ]
  },
  {
    "id": "math-final-018",
    "subject": "數學",
    "type": "3-4補強選擇",
    "stem": "若點 P 在線段 AB 的中垂線上，則下列何者一定成立？",
    "choices": [
      {
        "key": "A",
        "text": "PA = PB"
      },
      {
        "key": "B",
        "text": "PA ⟂ PB"
      },
      {
        "key": "C",
        "text": "∠PAB = 90°"
      },
      {
        "key": "D",
        "text": "AB = AP"
      }
    ],
    "answer": "A",
    "explanation": "中垂線上的點到線段兩端點距離相等。",
    "skill": "中垂線",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-1~3-4_學用/教用｜補 3-4 同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-4"
    ]
  },
  {
    "id": "math-final-019",
    "subject": "數學",
    "type": "3-4補強選擇",
    "stem": "若一角的補角是該角的 2 倍，則該角為多少度？",
    "choices": [
      {
        "key": "A",
        "text": "30°"
      },
      {
        "key": "B",
        "text": "45°"
      },
      {
        "key": "C",
        "text": "60°"
      },
      {
        "key": "D",
        "text": "75°"
      }
    ],
    "answer": "C",
    "explanation": "設角為 x，補角 180-x = 2x，所以 x = 60。",
    "skill": "補角",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-1~3-4_學用/教用｜補 3-4 同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-4"
    ]
  },
  {
    "id": "math-final-020",
    "subject": "數學",
    "type": "3-4補強選擇",
    "stem": "五邊形的內角和為多少度？",
    "choices": [
      {
        "key": "A",
        "text": "360°"
      },
      {
        "key": "B",
        "text": "450°"
      },
      {
        "key": "C",
        "text": "540°"
      },
      {
        "key": "D",
        "text": "720°"
      }
    ],
    "answer": "C",
    "explanation": "(5-2)×180°=540°。",
    "skill": "多邊形內角和",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-1~3-4_學用/教用｜補 3-4 同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-4"
    ]
  },
  {
    "id": "math-final-021",
    "subject": "數學",
    "type": "3-4補強選擇",
    "stem": "某三角形兩內角為 52°、68°，第三角是多少？",
    "choices": [
      {
        "key": "A",
        "text": "50°"
      },
      {
        "key": "B",
        "text": "60°"
      },
      {
        "key": "C",
        "text": "70°"
      },
      {
        "key": "D",
        "text": "80°"
      }
    ],
    "answer": "B",
    "explanation": "三角形內角和 180°，180-52-68=60。",
    "skill": "三角形內角和",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-1~3-4_學用/教用｜補 3-4 同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-4"
    ]
  },
  {
    "id": "math-final-022",
    "subject": "數學",
    "type": "3-4補強選擇",
    "stem": "三角形外角為 118°，其中一個不相鄰內角為 47°，另一個不相鄰內角為多少？",
    "choices": [
      {
        "key": "A",
        "text": "61°"
      },
      {
        "key": "B",
        "text": "71°"
      },
      {
        "key": "C",
        "text": "81°"
      },
      {
        "key": "D",
        "text": "91°"
      }
    ],
    "answer": "B",
    "explanation": "外角等於兩個不相鄰內角和，118-47=71。",
    "skill": "外角",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-1~3-4_學用/教用｜補 3-4 同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-4"
    ]
  },
  {
    "id": "math-final-023",
    "subject": "數學",
    "type": "3-4補強選擇",
    "stem": "下列哪一組資訊「不能」直接判定兩三角形全等？",
    "choices": [
      {
        "key": "A",
        "text": "三邊分別相等"
      },
      {
        "key": "B",
        "text": "兩邊及夾角相等"
      },
      {
        "key": "C",
        "text": "兩角及一邊相等"
      },
      {
        "key": "D",
        "text": "三角分別相等"
      }
    ],
    "answer": "D",
    "explanation": "AAA 只能判定相似，不能保證全等。",
    "skill": "全等陷阱",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-1~3-4_學用/教用｜補 3-4 同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-4"
    ]
  },
  {
    "id": "math-final-024",
    "subject": "數學",
    "type": "3-4補強選擇",
    "stem": "直角三角形中，已知斜邊與一股分別相等，最常用哪個全等判定？",
    "choices": [
      {
        "key": "A",
        "text": "SSS"
      },
      {
        "key": "B",
        "text": "SAS"
      },
      {
        "key": "C",
        "text": "AAS"
      },
      {
        "key": "D",
        "text": "RHS"
      }
    ],
    "answer": "D",
    "explanation": "直角三角形的斜邊與一股相等可用 RHS。",
    "skill": "RHS",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-1~3-4_學用/教用｜補 3-4 同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-4"
    ]
  },
  {
    "id": "math-final-025",
    "subject": "數學",
    "type": "3-4補強選擇",
    "stem": "若四邊形的三個內角分別為 80°、95°、110°，第四角為多少？",
    "choices": [
      {
        "key": "A",
        "text": "65°"
      },
      {
        "key": "B",
        "text": "75°"
      },
      {
        "key": "C",
        "text": "85°"
      },
      {
        "key": "D",
        "text": "95°"
      }
    ],
    "answer": "B",
    "explanation": "四邊形內角和 360°，360-80-95-110=75。",
    "skill": "四邊形內角和",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-1~3-4_學用/教用｜補 3-4 同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-4"
    ]
  },
  {
    "id": "math-final-026",
    "subject": "數學",
    "type": "3-4補強選擇",
    "stem": "若兩平行線被一截線所截，同位角的關係是？",
    "choices": [
      {
        "key": "A",
        "text": "相等"
      },
      {
        "key": "B",
        "text": "互補"
      },
      {
        "key": "C",
        "text": "互餘"
      },
      {
        "key": "D",
        "text": "沒有固定關係"
      }
    ],
    "answer": "A",
    "explanation": "平行線的同位角相等。",
    "skill": "平行線角",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-1~3-4_學用/教用｜補 3-4 同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-4"
    ]
  },
  {
    "id": "math-final-027",
    "subject": "數學",
    "type": "3-4補強選擇",
    "stem": "若兩平行線被一截線所截，同側內角的和為？",
    "choices": [
      {
        "key": "A",
        "text": "90°"
      },
      {
        "key": "B",
        "text": "120°"
      },
      {
        "key": "C",
        "text": "180°"
      },
      {
        "key": "D",
        "text": "360°"
      }
    ],
    "answer": "C",
    "explanation": "平行線同側內角互補。",
    "skill": "平行線角",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-1~3-4_學用/教用｜補 3-4 同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-4"
    ]
  },
  {
    "id": "math-final-028",
    "subject": "數學",
    "type": "3-4補強選擇",
    "stem": "若等腰三角形頂角為 40°，則每個底角為？",
    "choices": [
      {
        "key": "A",
        "text": "40°"
      },
      {
        "key": "B",
        "text": "60°"
      },
      {
        "key": "C",
        "text": "70°"
      },
      {
        "key": "D",
        "text": "80°"
      }
    ],
    "answer": "C",
    "explanation": "兩底角相等，(180-40)/2=70。",
    "skill": "等腰三角形",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-1~3-4_學用/教用｜補 3-4 同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-4"
    ]
  },
  {
    "id": "math-final-029",
    "subject": "數學",
    "type": "3-5邊角關係選擇",
    "stem": "兩邊長為 5、8 的三角形，第三邊若為正整數，可能有幾種？",
    "choices": [
      {
        "key": "A",
        "text": "7 種"
      },
      {
        "key": "B",
        "text": "8 種"
      },
      {
        "key": "C",
        "text": "9 種"
      },
      {
        "key": "D",
        "text": "10 種"
      }
    ],
    "answer": "C",
    "explanation": "第三邊 x 要滿足 |8-5| < x < 8+5，即 3 < x < 13，所以 x=4~12，共 9 種。",
    "skill": "三角形不等式",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-5"
    ]
  },
  {
    "id": "math-final-030",
    "subject": "數學",
    "type": "3-5邊角關係選擇",
    "stem": "兩邊長為 6、10 的三角形，第三邊若為正整數，可能有幾種？",
    "choices": [
      {
        "key": "A",
        "text": "10 種"
      },
      {
        "key": "B",
        "text": "11 種"
      },
      {
        "key": "C",
        "text": "12 種"
      },
      {
        "key": "D",
        "text": "13 種"
      }
    ],
    "answer": "B",
    "explanation": "第三邊 x 要滿足 4 < x < 16，所以 x=5~15，共 11 種。",
    "skill": "三角形不等式",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-5"
    ]
  },
  {
    "id": "math-final-031",
    "subject": "數學",
    "type": "3-5邊角關係選擇",
    "stem": "下列哪一組長度可以構成三角形？",
    "choices": [
      {
        "key": "A",
        "text": "3、4、8"
      },
      {
        "key": "B",
        "text": "5、7、12"
      },
      {
        "key": "C",
        "text": "6、8、10"
      },
      {
        "key": "D",
        "text": "2、5、8"
      }
    ],
    "answer": "C",
    "explanation": "只有 6+8>10 且任兩邊和都大於第三邊。5+7=12 不可，等於也不行。",
    "skill": "三角形存在條件",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-5"
    ]
  },
  {
    "id": "math-final-032",
    "subject": "數學",
    "type": "3-5邊角關係選擇",
    "stem": "△ABC 中，AB=9、AC=6、BC=7。哪一個角最大？",
    "choices": [
      {
        "key": "A",
        "text": "∠A"
      },
      {
        "key": "B",
        "text": "∠B"
      },
      {
        "key": "C",
        "text": "∠C"
      },
      {
        "key": "D",
        "text": "無法判斷"
      }
    ],
    "answer": "C",
    "explanation": "最大邊 AB=9 對到 ∠C，所以 ∠C 最大。",
    "skill": "大邊對大角",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-5"
    ]
  },
  {
    "id": "math-final-033",
    "subject": "數學",
    "type": "3-5邊角關係選擇",
    "stem": "△ABC 中，∠A=80°、∠B=55°、∠C=45°。哪一邊最長？",
    "choices": [
      {
        "key": "A",
        "text": "AB"
      },
      {
        "key": "B",
        "text": "AC"
      },
      {
        "key": "C",
        "text": "BC"
      },
      {
        "key": "D",
        "text": "三邊一樣長"
      }
    ],
    "answer": "C",
    "explanation": "最大角是 ∠A，對邊 BC 最長。",
    "skill": "大角對大邊",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-5"
    ]
  },
  {
    "id": "math-final-034",
    "subject": "數學",
    "type": "3-5邊角關係選擇",
    "stem": "三角形三邊為 x、7、10，且 x 為整數。x 的最小可能值是？",
    "choices": [
      {
        "key": "A",
        "text": "2"
      },
      {
        "key": "B",
        "text": "3"
      },
      {
        "key": "C",
        "text": "4"
      },
      {
        "key": "D",
        "text": "17"
      }
    ],
    "answer": "C",
    "explanation": "|10-7| < x < 17，所以 x 必須大於 3，最小整數是 4。",
    "skill": "三角形不等式",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-5"
    ]
  },
  {
    "id": "math-final-035",
    "subject": "數學",
    "type": "3-5邊角關係選擇",
    "stem": "三角形三邊為 x、7、10，且 x 為整數。x 的最大可能值是？",
    "choices": [
      {
        "key": "A",
        "text": "15"
      },
      {
        "key": "B",
        "text": "16"
      },
      {
        "key": "C",
        "text": "17"
      },
      {
        "key": "D",
        "text": "18"
      }
    ],
    "answer": "B",
    "explanation": "x < 17，所以最大整數是 16。",
    "skill": "三角形不等式",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-5"
    ]
  },
  {
    "id": "math-final-036",
    "subject": "數學",
    "type": "3-5邊角關係選擇",
    "stem": "若三角形兩邊為 4、9，第三邊可能為下列何者？",
    "choices": [
      {
        "key": "A",
        "text": "5"
      },
      {
        "key": "B",
        "text": "6"
      },
      {
        "key": "C",
        "text": "13"
      },
      {
        "key": "D",
        "text": "14"
      }
    ],
    "answer": "B",
    "explanation": "第三邊 x 要滿足 5 < x < 13；等於 5 或 13 都不能成三角形。",
    "skill": "三角形不等式陷阱",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-5"
    ]
  },
  {
    "id": "math-final-037",
    "subject": "數學",
    "type": "3-5邊角關係選擇",
    "stem": "若某三角形中 ∠A > ∠B，則下列何者必定正確？",
    "choices": [
      {
        "key": "A",
        "text": "BC > AC"
      },
      {
        "key": "B",
        "text": "AB > AC"
      },
      {
        "key": "C",
        "text": "AC > BC"
      },
      {
        "key": "D",
        "text": "AB = BC"
      }
    ],
    "answer": "A",
    "explanation": "∠A 的對邊是 BC，∠B 的對邊是 AC；大角對大邊，所以 BC > AC。",
    "skill": "角邊對應",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-5"
    ]
  },
  {
    "id": "math-final-038",
    "subject": "數學",
    "type": "3-5邊角關係選擇",
    "stem": "若某三角形中 AB < AC，則下列何者必定正確？",
    "choices": [
      {
        "key": "A",
        "text": "∠C < ∠B"
      },
      {
        "key": "B",
        "text": "∠C > ∠B"
      },
      {
        "key": "C",
        "text": "∠A > ∠B"
      },
      {
        "key": "D",
        "text": "∠A = ∠C"
      }
    ],
    "answer": "A",
    "explanation": "AB 對 ∠C，AC 對 ∠B；較短邊對較小角，所以 ∠C < ∠B。",
    "skill": "邊角對應",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-5"
    ]
  },
  {
    "id": "math-final-039",
    "subject": "數學",
    "type": "3-5邊角關係選擇",
    "stem": "兩邊長 4、8，要和第三邊排成三角形，下列哪個第三邊可行？",
    "choices": [
      {
        "key": "A",
        "text": "3"
      },
      {
        "key": "B",
        "text": "4"
      },
      {
        "key": "C",
        "text": "6"
      },
      {
        "key": "D",
        "text": "12"
      }
    ],
    "answer": "C",
    "explanation": "第三邊 x 要滿足 4 < x < 12，只有 6 可行。",
    "skill": "三角形存在條件",
    "source": "Drive confirmed｜數學2下段考課習進階卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-5"
    ]
  },
  {
    "id": "math-final-040",
    "subject": "數學",
    "type": "3-5邊角關係選擇",
    "stem": "直角三角形兩股分別為 6、8，斜邊為？",
    "choices": [
      {
        "key": "A",
        "text": "8"
      },
      {
        "key": "B",
        "text": "9"
      },
      {
        "key": "C",
        "text": "10"
      },
      {
        "key": "D",
        "text": "14"
      }
    ],
    "answer": "C",
    "explanation": "6-8-10 是畢氏三數，斜邊 10。",
    "skill": "直角三角形",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-5"
    ]
  },
  {
    "id": "math-final-041",
    "subject": "數學",
    "type": "3-5邊角關係選擇",
    "stem": "△ABC 中 AB=5、BC=5、AC=8，哪個角最大？",
    "choices": [
      {
        "key": "A",
        "text": "∠A"
      },
      {
        "key": "B",
        "text": "∠B"
      },
      {
        "key": "C",
        "text": "∠C"
      },
      {
        "key": "D",
        "text": "無法判斷"
      }
    ],
    "answer": "B",
    "explanation": "最大邊 AC=8，對到 ∠B，所以 ∠B 最大。",
    "skill": "等腰與大邊對大角",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-5"
    ]
  },
  {
    "id": "math-final-042",
    "subject": "數學",
    "type": "3-5邊角關係選擇",
    "stem": "三線段 4-x、7、10 由小到大排列且能成三角形。若照題意 4-x 是最短邊，下列哪個 x 合理？",
    "choices": [
      {
        "key": "A",
        "text": "-5"
      },
      {
        "key": "B",
        "text": "0"
      },
      {
        "key": "C",
        "text": "2"
      },
      {
        "key": "D",
        "text": "5"
      }
    ],
    "answer": "B",
    "explanation": "需 10 < 7+(4-x)，所以 x<1；且 4-x 為正並小於等於 7。選項中 0 合理。",
    "skill": "含未知數三角形不等式",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "3-5"
    ]
  },
  {
    "id": "math-final-043",
    "subject": "數學",
    "type": "4-1平行與面積選擇",
    "stem": "兩條平行線 L1、L2 上，A、B 在 L1，P、Q 在 L2。若 AB 當底，△ABP 與 △ABQ 面積關係？",
    "choices": [
      {
        "key": "A",
        "text": "△ABP 較大"
      },
      {
        "key": "B",
        "text": "△ABQ 較大"
      },
      {
        "key": "C",
        "text": "兩者相等"
      },
      {
        "key": "D",
        "text": "無法判斷"
      }
    ],
    "answer": "C",
    "explanation": "底 AB 相同，P、Q 都在與 AB 平行的線上，高相同，所以面積相等。",
    "skill": "同底等高",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-1"
    ]
  },
  {
    "id": "math-final-044",
    "subject": "數學",
    "type": "4-1平行與面積選擇",
    "stem": "平行四邊形底為 12，高為 7，面積為？",
    "choices": [
      {
        "key": "A",
        "text": "19"
      },
      {
        "key": "B",
        "text": "42"
      },
      {
        "key": "C",
        "text": "84"
      },
      {
        "key": "D",
        "text": "168"
      }
    ],
    "answer": "C",
    "explanation": "平行四邊形面積=底×高=12×7=84。",
    "skill": "面積公式",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-1"
    ]
  },
  {
    "id": "math-final-045",
    "subject": "數學",
    "type": "4-1平行與面積選擇",
    "stem": "三角形底為 14，高為 9，面積為？",
    "choices": [
      {
        "key": "A",
        "text": "23"
      },
      {
        "key": "B",
        "text": "63"
      },
      {
        "key": "C",
        "text": "126"
      },
      {
        "key": "D",
        "text": "252"
      }
    ],
    "answer": "B",
    "explanation": "三角形面積=底×高÷2=14×9÷2=63。",
    "skill": "三角形面積",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-1"
    ]
  },
  {
    "id": "math-final-046",
    "subject": "數學",
    "type": "4-1平行與面積選擇",
    "stem": "梯形上下底分別為 8、18，高為 5，面積為？",
    "choices": [
      {
        "key": "A",
        "text": "65"
      },
      {
        "key": "B",
        "text": "80"
      },
      {
        "key": "C",
        "text": "90"
      },
      {
        "key": "D",
        "text": "130"
      }
    ],
    "answer": "A",
    "explanation": "梯形面積=(8+18)×5÷2=65。",
    "skill": "梯形面積",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-1"
    ]
  },
  {
    "id": "math-final-047",
    "subject": "數學",
    "type": "4-1平行與面積選擇",
    "stem": "矩形三頂點 A(2,3)、B(8,3)、C(8,7)，第四點 D 為？",
    "choices": [
      {
        "key": "A",
        "text": "(2,7)"
      },
      {
        "key": "B",
        "text": "(3,8)"
      },
      {
        "key": "C",
        "text": "(8,2)"
      },
      {
        "key": "D",
        "text": "(7,3)"
      }
    ],
    "answer": "A",
    "explanation": "矩形邊平行座標軸時，D 與 A 同 x、與 C 同 y，所以 D=(2,7)。",
    "skill": "座標矩形",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-1"
    ]
  },
  {
    "id": "math-final-048",
    "subject": "數學",
    "type": "4-1平行與面積選擇",
    "stem": "矩形 A(2,3)、B(8,3)、C(8,7)、D(2,7) 的對角線交點是？",
    "choices": [
      {
        "key": "A",
        "text": "(4,5)"
      },
      {
        "key": "B",
        "text": "(5,5)"
      },
      {
        "key": "C",
        "text": "(6,4)"
      },
      {
        "key": "D",
        "text": "(10,10)"
      }
    ],
    "answer": "B",
    "explanation": "對角線中點為 ((2+8)/2,(3+7)/2)=(5,5)。",
    "skill": "座標中點",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-1"
    ]
  },
  {
    "id": "math-final-049",
    "subject": "數學",
    "type": "4-1平行與面積選擇",
    "stem": "若兩三角形底同為 10，面積同為 40，則兩三角形的高？",
    "choices": [
      {
        "key": "A",
        "text": "都為 4"
      },
      {
        "key": "B",
        "text": "都為 8"
      },
      {
        "key": "C",
        "text": "一個 4 一個 8"
      },
      {
        "key": "D",
        "text": "無法比較"
      }
    ],
    "answer": "B",
    "explanation": "40=10×高÷2，所以高=8。",
    "skill": "面積反推高",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-1"
    ]
  },
  {
    "id": "math-final-050",
    "subject": "數學",
    "type": "4-1平行與面積選擇",
    "stem": "一個三角形面積為 48，高為 8，底為？",
    "choices": [
      {
        "key": "A",
        "text": "6"
      },
      {
        "key": "B",
        "text": "8"
      },
      {
        "key": "C",
        "text": "12"
      },
      {
        "key": "D",
        "text": "16"
      }
    ],
    "answer": "C",
    "explanation": "48=底×8÷2，所以底=12。",
    "skill": "面積反推底",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-1"
    ]
  },
  {
    "id": "math-final-051",
    "subject": "數學",
    "type": "4-1平行與面積選擇",
    "stem": "同底同高下，三角形面積和平行四邊形面積的關係？",
    "choices": [
      {
        "key": "A",
        "text": "三角形是平行四邊形一半"
      },
      {
        "key": "B",
        "text": "兩者相等"
      },
      {
        "key": "C",
        "text": "三角形是兩倍"
      },
      {
        "key": "D",
        "text": "無固定"
      }
    ],
    "answer": "A",
    "explanation": "同底同高時，三角形面積=底×高÷2，平行四邊形=底×高。",
    "skill": "面積比較",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-1"
    ]
  },
  {
    "id": "math-final-052",
    "subject": "數學",
    "type": "4-1平行與面積選擇",
    "stem": "平行線間距相同，若兩三角形底長比例為 3:5，面積比例為？",
    "choices": [
      {
        "key": "A",
        "text": "1:1"
      },
      {
        "key": "B",
        "text": "3:5"
      },
      {
        "key": "C",
        "text": "5:3"
      },
      {
        "key": "D",
        "text": "9:25"
      }
    ],
    "answer": "B",
    "explanation": "高相同時，三角形面積與底成正比。",
    "skill": "面積比例",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-1"
    ]
  },
  {
    "id": "math-final-053",
    "subject": "數學",
    "type": "4-2平行四邊形選擇",
    "stem": "平行四邊形 ABCD 中，AB=2x+1、CD=15，則 x=?",
    "choices": [
      {
        "key": "A",
        "text": "6"
      },
      {
        "key": "B",
        "text": "7"
      },
      {
        "key": "C",
        "text": "8"
      },
      {
        "key": "D",
        "text": "9"
      }
    ],
    "answer": "B",
    "explanation": "平行四邊形對邊相等，2x+1=15，x=7。",
    "skill": "對邊相等",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-2"
    ]
  },
  {
    "id": "math-final-054",
    "subject": "數學",
    "type": "4-2平行四邊形選擇",
    "stem": "平行四邊形中一個角為 68°，相鄰角為？",
    "choices": [
      {
        "key": "A",
        "text": "68°"
      },
      {
        "key": "B",
        "text": "90°"
      },
      {
        "key": "C",
        "text": "112°"
      },
      {
        "key": "D",
        "text": "122°"
      }
    ],
    "answer": "C",
    "explanation": "平行四邊形鄰角互補，180-68=112。",
    "skill": "鄰角互補",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-2"
    ]
  },
  {
    "id": "math-final-055",
    "subject": "數學",
    "type": "4-2平行四邊形選擇",
    "stem": "平行四邊形中一個角為 68°，對角為？",
    "choices": [
      {
        "key": "A",
        "text": "68°"
      },
      {
        "key": "B",
        "text": "90°"
      },
      {
        "key": "C",
        "text": "112°"
      },
      {
        "key": "D",
        "text": "122°"
      }
    ],
    "answer": "A",
    "explanation": "平行四邊形對角相等。",
    "skill": "對角相等",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-2"
    ]
  },
  {
    "id": "math-final-056",
    "subject": "數學",
    "type": "4-2平行四邊形選擇",
    "stem": "平行四邊形 ABCD 對角線 AC、BD 交於 O。若 AO=6，則 AC=?",
    "choices": [
      {
        "key": "A",
        "text": "3"
      },
      {
        "key": "B",
        "text": "6"
      },
      {
        "key": "C",
        "text": "12"
      },
      {
        "key": "D",
        "text": "18"
      }
    ],
    "answer": "C",
    "explanation": "對角線互相平分，所以 AC=2×AO=12。",
    "skill": "對角線互相平分",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-2"
    ]
  },
  {
    "id": "math-final-057",
    "subject": "數學",
    "type": "4-2平行四邊形選擇",
    "stem": "平行四邊形 ABCD 對角線交於 O。若 BO=5，則 BD=?",
    "choices": [
      {
        "key": "A",
        "text": "5"
      },
      {
        "key": "B",
        "text": "10"
      },
      {
        "key": "C",
        "text": "15"
      },
      {
        "key": "D",
        "text": "20"
      }
    ],
    "answer": "B",
    "explanation": "O 是 BD 中點，所以 BD=10。",
    "skill": "對角線互相平分",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-2"
    ]
  },
  {
    "id": "math-final-058",
    "subject": "數學",
    "type": "4-2平行四邊形選擇",
    "stem": "判斷四邊形為平行四邊形，下列哪一項足夠？",
    "choices": [
      {
        "key": "A",
        "text": "一組對邊相等"
      },
      {
        "key": "B",
        "text": "兩組對邊分別相等"
      },
      {
        "key": "C",
        "text": "一個角是直角"
      },
      {
        "key": "D",
        "text": "兩條對角線等長"
      }
    ],
    "answer": "B",
    "explanation": "兩組對邊分別相等可判定平行四邊形。",
    "skill": "判定條件",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-2"
    ]
  },
  {
    "id": "math-final-059",
    "subject": "數學",
    "type": "4-2平行四邊形選擇",
    "stem": "若四邊形兩條對角線互相平分，可判定此四邊形為？",
    "choices": [
      {
        "key": "A",
        "text": "梯形"
      },
      {
        "key": "B",
        "text": "平行四邊形"
      },
      {
        "key": "C",
        "text": "箏形"
      },
      {
        "key": "D",
        "text": "任意四邊形"
      }
    ],
    "answer": "B",
    "explanation": "對角線互相平分是平行四邊形判定之一。",
    "skill": "判定條件",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-2"
    ]
  },
  {
    "id": "math-final-060",
    "subject": "數學",
    "type": "4-2平行四邊形選擇",
    "stem": "平行四邊形底 9、高 4，面積？",
    "choices": [
      {
        "key": "A",
        "text": "13"
      },
      {
        "key": "B",
        "text": "18"
      },
      {
        "key": "C",
        "text": "36"
      },
      {
        "key": "D",
        "text": "72"
      }
    ],
    "answer": "C",
    "explanation": "面積=9×4=36。",
    "skill": "面積",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-2"
    ]
  },
  {
    "id": "math-final-061",
    "subject": "數學",
    "type": "4-2平行四邊形選擇",
    "stem": "平行四邊形 ABCD 中，AB // CD，AD // BC。若∠A=115°，∠C=?",
    "choices": [
      {
        "key": "A",
        "text": "65°"
      },
      {
        "key": "B",
        "text": "75°"
      },
      {
        "key": "C",
        "text": "105°"
      },
      {
        "key": "D",
        "text": "115°"
      }
    ],
    "answer": "D",
    "explanation": "對角相等，∠C=∠A=115°。",
    "skill": "角度",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-2"
    ]
  },
  {
    "id": "math-final-062",
    "subject": "數學",
    "type": "4-2平行四邊形選擇",
    "stem": "平行四邊形 ABCD 中，∠A=115°，∠B=?",
    "choices": [
      {
        "key": "A",
        "text": "55°"
      },
      {
        "key": "B",
        "text": "65°"
      },
      {
        "key": "C",
        "text": "75°"
      },
      {
        "key": "D",
        "text": "115°"
      }
    ],
    "answer": "B",
    "explanation": "鄰角互補，∠B=180-115=65°。",
    "skill": "角度",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-2"
    ]
  },
  {
    "id": "math-final-063",
    "subject": "數學",
    "type": "4-2平行四邊形選擇",
    "stem": "平行四邊形的周長為 50，一邊長 9，鄰邊長為？",
    "choices": [
      {
        "key": "A",
        "text": "12"
      },
      {
        "key": "B",
        "text": "14"
      },
      {
        "key": "C",
        "text": "16"
      },
      {
        "key": "D",
        "text": "18"
      }
    ],
    "answer": "C",
    "explanation": "周長=2(a+b)，50=2(9+b)，b=16。",
    "skill": "周長",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-2"
    ]
  },
  {
    "id": "math-final-064",
    "subject": "數學",
    "type": "4-2平行四邊形選擇",
    "stem": "下列哪個敘述對所有平行四邊形都正確？",
    "choices": [
      {
        "key": "A",
        "text": "四角都是直角"
      },
      {
        "key": "B",
        "text": "四邊都等長"
      },
      {
        "key": "C",
        "text": "對角線互相平分"
      },
      {
        "key": "D",
        "text": "對角線互相垂直"
      }
    ],
    "answer": "C",
    "explanation": "一般平行四邊形一定有對角線互相平分；其他是特殊四邊形才一定成立。",
    "skill": "性質辨認",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-2"
    ]
  },
  {
    "id": "math-final-065",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "矩形一定也是下列哪一種圖形？",
    "choices": [
      {
        "key": "A",
        "text": "平行四邊形"
      },
      {
        "key": "B",
        "text": "菱形"
      },
      {
        "key": "C",
        "text": "箏形"
      },
      {
        "key": "D",
        "text": "等腰三角形"
      }
    ],
    "answer": "A",
    "explanation": "矩形有兩組對邊平行，所以一定是平行四邊形。",
    "skill": "矩形性質",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-066",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "菱形兩對角線長為 10、24，面積為？",
    "choices": [
      {
        "key": "A",
        "text": "34"
      },
      {
        "key": "B",
        "text": "60"
      },
      {
        "key": "C",
        "text": "120"
      },
      {
        "key": "D",
        "text": "240"
      }
    ],
    "answer": "C",
    "explanation": "菱形面積=兩對角線乘積÷2=10×24÷2=120。",
    "skill": "菱形面積",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-067",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "箏形兩對角線長為 6、8，面積為？",
    "choices": [
      {
        "key": "A",
        "text": "14"
      },
      {
        "key": "B",
        "text": "24"
      },
      {
        "key": "C",
        "text": "48"
      },
      {
        "key": "D",
        "text": "96"
      }
    ],
    "answer": "B",
    "explanation": "箏形面積=對角線乘積÷2=6×8÷2=24。",
    "skill": "箏形面積",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-068",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "菱形對角線長為 14、48，一邊長為？",
    "choices": [
      {
        "key": "A",
        "text": "25"
      },
      {
        "key": "B",
        "text": "31"
      },
      {
        "key": "C",
        "text": "50"
      },
      {
        "key": "D",
        "text": "62"
      }
    ],
    "answer": "A",
    "explanation": "半對角線為 7、24，菱形一邊是直角三角形斜邊，√(7²+24²)=25。",
    "skill": "菱形對角線",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-069",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "菱形對角線長為 14、48，周長為？",
    "choices": [
      {
        "key": "A",
        "text": "50"
      },
      {
        "key": "B",
        "text": "75"
      },
      {
        "key": "C",
        "text": "100"
      },
      {
        "key": "D",
        "text": "124"
      }
    ],
    "answer": "C",
    "explanation": "一邊長 25，所以周長=25×4=100。",
    "skill": "菱形周長",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-070",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "矩形對角線的特性，何者正確？",
    "choices": [
      {
        "key": "A",
        "text": "互相垂直但不等長"
      },
      {
        "key": "B",
        "text": "等長且互相平分"
      },
      {
        "key": "C",
        "text": "只會平分一條"
      },
      {
        "key": "D",
        "text": "一定互相垂直"
      }
    ],
    "answer": "B",
    "explanation": "矩形對角線等長且互相平分。",
    "skill": "矩形對角線",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-071",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "菱形對角線的特性，何者正確？",
    "choices": [
      {
        "key": "A",
        "text": "等長且不平分"
      },
      {
        "key": "B",
        "text": "互相垂直且互相平分"
      },
      {
        "key": "C",
        "text": "只平分其中一條"
      },
      {
        "key": "D",
        "text": "四個角都是直角"
      }
    ],
    "answer": "B",
    "explanation": "菱形對角線互相垂直且互相平分。",
    "skill": "菱形對角線",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-072",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "正方形的對角線，何者正確？",
    "choices": [
      {
        "key": "A",
        "text": "等長、互相垂直、互相平分"
      },
      {
        "key": "B",
        "text": "不等長但垂直"
      },
      {
        "key": "C",
        "text": "等長但不平分"
      },
      {
        "key": "D",
        "text": "只有一條會平分另一條"
      }
    ],
    "answer": "A",
    "explanation": "正方形同時有矩形與菱形性質。",
    "skill": "正方形",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-073",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "等腰梯形一定具有哪個性質？",
    "choices": [
      {
        "key": "A",
        "text": "兩腰等長"
      },
      {
        "key": "B",
        "text": "兩組對邊平行"
      },
      {
        "key": "C",
        "text": "四邊等長"
      },
      {
        "key": "D",
        "text": "對角線互相垂直"
      }
    ],
    "answer": "A",
    "explanation": "等腰梯形定義包含兩腰等長，且底角相等、對角線等長。",
    "skill": "等腰梯形",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-074",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "等腰梯形的兩條對角線關係通常為？",
    "choices": [
      {
        "key": "A",
        "text": "等長"
      },
      {
        "key": "B",
        "text": "互相垂直"
      },
      {
        "key": "C",
        "text": "互相平分"
      },
      {
        "key": "D",
        "text": "沒有任何性質"
      }
    ],
    "answer": "A",
    "explanation": "等腰梯形對角線等長。",
    "skill": "等腰梯形",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-075",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "梯形上下底分別為 10、16，高為 6，面積為？",
    "choices": [
      {
        "key": "A",
        "text": "26"
      },
      {
        "key": "B",
        "text": "48"
      },
      {
        "key": "C",
        "text": "78"
      },
      {
        "key": "D",
        "text": "156"
      }
    ],
    "answer": "C",
    "explanation": "面積=(10+16)×6÷2=78。",
    "skill": "梯形面積",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-076",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "等腰梯形上底 6、下底 14、腰長 5，高為？",
    "choices": [
      {
        "key": "A",
        "text": "3"
      },
      {
        "key": "B",
        "text": "4"
      },
      {
        "key": "C",
        "text": "5"
      },
      {
        "key": "D",
        "text": "6"
      }
    ],
    "answer": "A",
    "explanation": "兩側水平差各 (14-6)/2=4，腰 5，形成 3-4-5 直角三角形，高=3。",
    "skill": "等腰梯形輔助線",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-077",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "等腰梯形上底 6、下底 14、腰長 5，面積為？",
    "choices": [
      {
        "key": "A",
        "text": "30"
      },
      {
        "key": "B",
        "text": "35"
      },
      {
        "key": "C",
        "text": "40"
      },
      {
        "key": "D",
        "text": "60"
      }
    ],
    "answer": "A",
    "explanation": "高=3，面積=(6+14)×3÷2=30。",
    "skill": "等腰梯形面積",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-078",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "下列哪一個敘述一定正確？",
    "choices": [
      {
        "key": "A",
        "text": "矩形一定是菱形"
      },
      {
        "key": "B",
        "text": "菱形一定是矩形"
      },
      {
        "key": "C",
        "text": "正方形一定是矩形"
      },
      {
        "key": "D",
        "text": "梯形一定是平行四邊形"
      }
    ],
    "answer": "C",
    "explanation": "正方形四角都是直角，所以一定是矩形；但矩形不一定四邊等長。",
    "skill": "包含關係",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-079",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "下列哪一個圖形一定有四邊等長？",
    "choices": [
      {
        "key": "A",
        "text": "矩形"
      },
      {
        "key": "B",
        "text": "菱形"
      },
      {
        "key": "C",
        "text": "梯形"
      },
      {
        "key": "D",
        "text": "平行四邊形"
      }
    ],
    "answer": "B",
    "explanation": "菱形定義為四邊等長的平行四邊形。",
    "skill": "四邊形性質",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-080",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "矩形長 12、寬 5，對角線長為？",
    "choices": [
      {
        "key": "A",
        "text": "13"
      },
      {
        "key": "B",
        "text": "17"
      },
      {
        "key": "C",
        "text": "25"
      },
      {
        "key": "D",
        "text": "60"
      }
    ],
    "answer": "A",
    "explanation": "用畢氏定理 √(12²+5²)=13。",
    "skill": "矩形對角線",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-081",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "正方形邊長 7，面積為？",
    "choices": [
      {
        "key": "A",
        "text": "14"
      },
      {
        "key": "B",
        "text": "28"
      },
      {
        "key": "C",
        "text": "49"
      },
      {
        "key": "D",
        "text": "98"
      }
    ],
    "answer": "C",
    "explanation": "正方形面積=邊長²=49。",
    "skill": "正方形面積",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-082",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "正方形對角線長為 10√2，邊長為？",
    "choices": [
      {
        "key": "A",
        "text": "5"
      },
      {
        "key": "B",
        "text": "10"
      },
      {
        "key": "C",
        "text": "20"
      },
      {
        "key": "D",
        "text": "10√2"
      }
    ],
    "answer": "B",
    "explanation": "正方形對角線=邊長×√2，所以邊長=10。",
    "skill": "正方形對角線",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-083",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "若一四邊形是矩形且四邊等長，則它一定是？",
    "choices": [
      {
        "key": "A",
        "text": "梯形"
      },
      {
        "key": "B",
        "text": "正方形"
      },
      {
        "key": "C",
        "text": "一般平行四邊形"
      },
      {
        "key": "D",
        "text": "不一定"
      }
    ],
    "answer": "B",
    "explanation": "矩形再加上四邊等長，就是正方形。",
    "skill": "正方形判定",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-084",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "若一平行四邊形的對角線等長，則它可判定為？",
    "choices": [
      {
        "key": "A",
        "text": "矩形"
      },
      {
        "key": "B",
        "text": "菱形"
      },
      {
        "key": "C",
        "text": "箏形"
      },
      {
        "key": "D",
        "text": "任意梯形"
      }
    ],
    "answer": "A",
    "explanation": "平行四邊形對角線等長，可判定為矩形。",
    "skill": "矩形判定",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-085",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "若一平行四邊形的對角線互相垂直，則它可判定為？",
    "choices": [
      {
        "key": "A",
        "text": "矩形"
      },
      {
        "key": "B",
        "text": "菱形"
      },
      {
        "key": "C",
        "text": "等腰梯形"
      },
      {
        "key": "D",
        "text": "任意四邊形"
      }
    ],
    "answer": "B",
    "explanation": "平行四邊形對角線互相垂直，可判定為菱形。",
    "skill": "菱形判定",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-086",
    "subject": "數學",
    "type": "4-3特殊四邊形選擇",
    "stem": "下列哪個面積公式可用於菱形或箏形？",
    "choices": [
      {
        "key": "A",
        "text": "底×高÷2"
      },
      {
        "key": "B",
        "text": "兩對角線乘積÷2"
      },
      {
        "key": "C",
        "text": "周長×高"
      },
      {
        "key": "D",
        "text": "長×寬×2"
      }
    ],
    "answer": "B",
    "explanation": "菱形、箏形常用對角線乘積÷2。",
    "skill": "對角線面積",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "4-3"
    ]
  },
  {
    "id": "math-final-087",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "若∠A=75°，另一角∠B 的兩邊分別與∠A 的兩邊平行，∠B 可能是多少？",
    "choices": [
      {
        "key": "A",
        "text": "75° only"
      },
      {
        "key": "B",
        "text": "105° only"
      },
      {
        "key": "C",
        "text": "75°或105°"
      },
      {
        "key": "D",
        "text": "15°或165°"
      }
    ],
    "answer": "C",
    "explanation": "兩角兩邊分別平行時，可能相等或互補。",
    "skill": "平行角陷阱",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-088",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "若直線 L // M，下列哪個角度關係最常可用來證明平行？",
    "choices": [
      {
        "key": "A",
        "text": "同位角相等"
      },
      {
        "key": "B",
        "text": "任兩角相等"
      },
      {
        "key": "C",
        "text": "任兩角互餘"
      },
      {
        "key": "D",
        "text": "所有角都相等"
      }
    ],
    "answer": "A",
    "explanation": "同位角相等、內錯角相等、同側內角互補都可作為平行判斷線索。",
    "skill": "平行線判斷",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-089",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "△ABC 中，∠B > ∠C，則下列何者正確？",
    "choices": [
      {
        "key": "A",
        "text": "AC > AB"
      },
      {
        "key": "B",
        "text": "AC < AB"
      },
      {
        "key": "C",
        "text": "BC > AC"
      },
      {
        "key": "D",
        "text": "AB = AC"
      }
    ],
    "answer": "A",
    "explanation": "∠B 對 AC，∠C 對 AB；大角對大邊，所以 AC > AB。",
    "skill": "邊角關係",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-090",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "平行四邊形一組鄰邊為 8、13，周長為？",
    "choices": [
      {
        "key": "A",
        "text": "21"
      },
      {
        "key": "B",
        "text": "42"
      },
      {
        "key": "C",
        "text": "84"
      },
      {
        "key": "D",
        "text": "104"
      }
    ],
    "answer": "B",
    "explanation": "周長=2(8+13)=42。",
    "skill": "平行四邊形周長",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-091",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "平行四邊形中，AB=2x+4、CD=20，x=?",
    "choices": [
      {
        "key": "A",
        "text": "6"
      },
      {
        "key": "B",
        "text": "8"
      },
      {
        "key": "C",
        "text": "10"
      },
      {
        "key": "D",
        "text": "12"
      }
    ],
    "answer": "B",
    "explanation": "對邊相等，2x+4=20，x=8。",
    "skill": "平行四邊形對邊",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-092",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "菱形對角線分別為 16、30，一邊長為？",
    "choices": [
      {
        "key": "A",
        "text": "17"
      },
      {
        "key": "B",
        "text": "23"
      },
      {
        "key": "C",
        "text": "34"
      },
      {
        "key": "D",
        "text": "46"
      }
    ],
    "answer": "A",
    "explanation": "半對角線 8、15，邊長=√(8²+15²)=17。",
    "skill": "菱形對角線",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-093",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "若梯形中位線長 22，高為 18，梯形面積為？",
    "choices": [
      {
        "key": "A",
        "text": "198"
      },
      {
        "key": "B",
        "text": "396"
      },
      {
        "key": "C",
        "text": "440"
      },
      {
        "key": "D",
        "text": "792"
      }
    ],
    "answer": "B",
    "explanation": "梯形面積=中位線×高=22×18=396。",
    "skill": "梯形中位線面積",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-094",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "矩形 A(5,5)、B(3,5)、C(3,9)，第四點 D 為？",
    "choices": [
      {
        "key": "A",
        "text": "(5,9)"
      },
      {
        "key": "B",
        "text": "(9,5)"
      },
      {
        "key": "C",
        "text": "(3,3)"
      },
      {
        "key": "D",
        "text": "(5,3)"
      }
    ],
    "answer": "A",
    "explanation": "D 與 A 同 x、與 C 同 y，D=(5,9)。",
    "skill": "座標矩形",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-095",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "矩形 A(5,5)、C(3,9) 為對角頂點，對角線中點為？",
    "choices": [
      {
        "key": "A",
        "text": "(4,7)"
      },
      {
        "key": "B",
        "text": "(8,14)"
      },
      {
        "key": "C",
        "text": "(3,5)"
      },
      {
        "key": "D",
        "text": "(5,9)"
      }
    ],
    "answer": "A",
    "explanation": "中點=((5+3)/2,(5+9)/2)=(4,7)。",
    "skill": "中點",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-096",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "若箏形兩對角線為 12、9，面積為？",
    "choices": [
      {
        "key": "A",
        "text": "21"
      },
      {
        "key": "B",
        "text": "54"
      },
      {
        "key": "C",
        "text": "108"
      },
      {
        "key": "D",
        "text": "216"
      }
    ],
    "answer": "B",
    "explanation": "面積=12×9÷2=54。",
    "skill": "箏形面積",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-097",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "三邊長 7、10、x 能成三角形，x 為正整數，有幾種？",
    "choices": [
      {
        "key": "A",
        "text": "12"
      },
      {
        "key": "B",
        "text": "13"
      },
      {
        "key": "C",
        "text": "14"
      },
      {
        "key": "D",
        "text": "15"
      }
    ],
    "answer": "B",
    "explanation": "3 < x < 17，所以 x=4~16，共 13 種。",
    "skill": "三角形不等式",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-098",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "等腰梯形上底 10、下底 4、腰長 5，對角線長常要先做什麼？",
    "choices": [
      {
        "key": "A",
        "text": "直接把上下底相加"
      },
      {
        "key": "B",
        "text": "畫高，把水平差切半"
      },
      {
        "key": "C",
        "text": "把四角當直角"
      },
      {
        "key": "D",
        "text": "用對角線互相平分"
      }
    ],
    "answer": "B",
    "explanation": "等腰梯形常補高，兩側水平差平均分配，再用直角三角形。",
    "skill": "等腰梯形輔助線",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-099",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "下列哪一項是「菱形一定有，但矩形不一定有」？",
    "choices": [
      {
        "key": "A",
        "text": "對角線互相平分"
      },
      {
        "key": "B",
        "text": "對角線等長"
      },
      {
        "key": "C",
        "text": "對角線互相垂直"
      },
      {
        "key": "D",
        "text": "對角相等"
      }
    ],
    "answer": "C",
    "explanation": "一般矩形對角線等長且平分，但不一定垂直；菱形對角線垂直平分。",
    "skill": "四邊形比較",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-100",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "下列哪一項是「矩形一定有，但菱形不一定有」？",
    "choices": [
      {
        "key": "A",
        "text": "對角線等長"
      },
      {
        "key": "B",
        "text": "對邊平行"
      },
      {
        "key": "C",
        "text": "對角線互相平分"
      },
      {
        "key": "D",
        "text": "對角相等"
      }
    ],
    "answer": "A",
    "explanation": "矩形對角線等長；菱形不一定等長，除非是正方形。",
    "skill": "四邊形比較",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-101",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "正方形邊長為 9，對角線長為？",
    "choices": [
      {
        "key": "A",
        "text": "9"
      },
      {
        "key": "B",
        "text": "18"
      },
      {
        "key": "C",
        "text": "9√2"
      },
      {
        "key": "D",
        "text": "81"
      }
    ],
    "answer": "C",
    "explanation": "正方形對角線=邊長×√2=9√2。",
    "skill": "正方形對角線",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-102",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "若平行四邊形一角為 130°，則其相鄰角與對角分別為？",
    "choices": [
      {
        "key": "A",
        "text": "50°、130°"
      },
      {
        "key": "B",
        "text": "130°、50°"
      },
      {
        "key": "C",
        "text": "50°、50°"
      },
      {
        "key": "D",
        "text": "130°、130°"
      }
    ],
    "answer": "A",
    "explanation": "鄰角互補為 50°，對角相等為 130°。",
    "skill": "平行四邊形角",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-103",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "三角形兩邊為 9、12，第三邊為 x。下列哪個範圍正確？",
    "choices": [
      {
        "key": "A",
        "text": "3 < x < 21"
      },
      {
        "key": "B",
        "text": "3 ≤ x ≤ 21"
      },
      {
        "key": "C",
        "text": "x > 21"
      },
      {
        "key": "D",
        "text": "x < 3"
      }
    ],
    "answer": "A",
    "explanation": "第三邊必須大於兩邊差且小於兩邊和。",
    "skill": "三角形不等式",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-104",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "一個平行四邊形若同時有一個直角，則它可判定為？",
    "choices": [
      {
        "key": "A",
        "text": "矩形"
      },
      {
        "key": "B",
        "text": "菱形"
      },
      {
        "key": "C",
        "text": "梯形"
      },
      {
        "key": "D",
        "text": "箏形"
      }
    ],
    "answer": "A",
    "explanation": "平行四邊形有一個直角，因鄰角互補與對角相等，四角皆直角，所以是矩形。",
    "skill": "矩形判定",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-105",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "一個平行四邊形若四邊等長，則它是？",
    "choices": [
      {
        "key": "A",
        "text": "矩形"
      },
      {
        "key": "B",
        "text": "菱形"
      },
      {
        "key": "C",
        "text": "等腰梯形"
      },
      {
        "key": "D",
        "text": "任意四邊形"
      }
    ],
    "answer": "B",
    "explanation": "平行四邊形四邊等長就是菱形。",
    "skill": "菱形判定",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-106",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "考試看到「對角線互相平分」最先想到哪個圖形？",
    "choices": [
      {
        "key": "A",
        "text": "平行四邊形"
      },
      {
        "key": "B",
        "text": "任意梯形"
      },
      {
        "key": "C",
        "text": "任意箏形"
      },
      {
        "key": "D",
        "text": "任意四邊形"
      }
    ],
    "answer": "A",
    "explanation": "對角線互相平分是平行四邊形重要判定。",
    "skill": "起手式",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  },
  {
    "id": "math-final-107",
    "subject": "數學",
    "type": "期末模擬選擇",
    "stem": "考試看到「兩對角線乘積除以 2」最常是哪一類面積？",
    "choices": [
      {
        "key": "A",
        "text": "菱形或箏形"
      },
      {
        "key": "B",
        "text": "一般梯形"
      },
      {
        "key": "C",
        "text": "一般平行四邊形"
      },
      {
        "key": "D",
        "text": "圓形"
      }
    ],
    "answer": "A",
    "explanation": "菱形與箏形可用對角線乘積÷2 求面積。",
    "skill": "起手式",
    "source": "Drive confirmed｜數學2下段考試題卷PDF_3-5~4-3_學用/教用｜同範圍改寫",
    "tags": [
      "數學",
      "期末考",
      "混合"
    ]
  }
];
