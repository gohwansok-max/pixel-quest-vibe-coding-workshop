/**
 * Style reminder — Pixel Quest Workshop: a warm game-making workbench, child-led imagination,
 * and Arcade Lime reserved for active progression, confirmation, and success.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  BookmarkPlus,
  Check,
  Clipboard,
  Code2,
  Download,
  Gamepad2,
  Heart,
  Lightbulb,
  Medal,
  Mic,
  MicOff,
  Palette,
  RotateCcw,
  Share2,
  Sparkles,
  Trash2,
  Wand2,
  X,
  Youtube,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

type Stage = "character" | "questions" | "result";

type Question = {
  label: string;
  number: string;
  kicker: string;
  question: string;
  helper: string;
  sparks: string[];
  placeholder: string;
};

type Character = {
  id: string;
  name: string;
  title: string;
  emoji: string;
  power: string;
  intro: string;
  accent: string;
  accessory: string;
  image?: string;
};

type CustomCharacter = {
  name: string;
  accent: string;
  emoji: string;
};

type SavedIdea = {
  id: string;
  title: string;
  savedAt: number;
  answers: string[];
  selectedCharacter: string;
  customCharacter: CustomCharacter;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const STORAGE_KEY = "pixel-quest-workshop-v2";
const VAULT_KEY = "pixel-quest-idea-vault-v1";
const BADGE_KEY = "pixel-quest-badge-collection-v1";

const characters: Character[] = [
  { id: "nabi", name: "나비", title: "구름 탐험가", emoji: "🦊", power: "바람 길 찾기", intro: "높은 곳에 숨은 길을 먼저 발견해.", accent: "#ff8d78", accessory: "구름 나침반", image: "https://gohwansok-max.github.io/pixel-quest-vibe-coding-workshop/assets/characters/nabi.png" },
  { id: "moko", name: "모코", title: "별빛 로봇", emoji: "🤖", power: "고장난 것을 고치기", intro: "작은 부품으로 놀라운 장치를 만들지.", accent: "#8eceef", accessory: "별빛 렌치", image: "https://gohwansok-max.github.io/pixel-quest-vibe-coding-workshop/assets/characters/moko.png" },
  { id: "toto", name: "토토", title: "젤리 마법사", emoji: "🟣", power: "통통 변신", intro: "좁은 틈도, 높은 벽도 말랑하게 통과해.", accent: "#b894f6", accessory: "반짝 젤리병", image: "https://gohwansok-max.github.io/pixel-quest-vibe-coding-workshop/assets/characters/toto.png" },
  { id: "piko", name: "피코", title: "씨앗 수집가", emoji: "🐦", power: "새 친구 부르기", intro: "노래로 숲과 하늘의 친구를 불러 모아.", accent: "#f3bf54", accessory: "노래 씨앗", image: "https://gohwansok-max.github.io/pixel-quest-vibe-coding-workshop/assets/characters/piko.png" },
  { id: "mom", name: "엄마", title: "마법 간식 연구가", emoji: "🧑‍🍳", power: "따뜻한 응원", intro: "어려운 길에서도 맛있는 아이디어를 찾아내.", accent: "#f49cba", accessory: "행운 앞치마", image: "https://gohwansok-max.github.io/pixel-quest-vibe-coding-workshop/assets/characters/mom.png" },
  { id: "dad", name: "아빠", title: "아이디어 공방장", emoji: "🧑‍🔧", power: "고치고 만들기", intro: "작은 부품도 멋진 모험 도구로 바꿔.", accent: "#78c7b3", accessory: "만능 드라이버", image: "https://gohwansok-max.github.io/pixel-quest-vibe-coding-workshop/assets/characters/dad.png" },
  { id: "seochanmin", name: "서찬민", title: "별길 모험가", emoji: "🧑‍🚀", power: "빛나는 발자국", intro: "어두운 길에도 별빛으로 방향을 표시해.", accent: "#9cbbf4", accessory: "우주 지도", image: "https://gohwansok-max.github.io/pixel-quest-vibe-coding-workshop/assets/characters/seochanmin.png" },
  { id: "goyoungbin", name: "고영빈", title: "점프 마스터", emoji: "🧑‍🎤", power: "번개 점프", intro: "어떤 높은 벽도 신나는 리듬으로 넘어가.", accent: "#f3ba54", accessory: "리듬 운동화", image: "https://gohwansok-max.github.io/pixel-quest-vibe-coding-workshop/assets/characters/goyoungbin.png" },
  { id: "leegayoung", name: "이가영", title: "색깔 수집가", emoji: "🧑‍🎨", power: "무지개 스케치", intro: "새로운 색 하나로 세상을 바꿔 그려.", accent: "#d69ae8", accessory: "무지개 붓", image: "https://gohwansok-max.github.io/pixel-quest-vibe-coding-workshop/assets/characters/leegayoung.png" },
  { id: "apple", name: "사과", title: "말랑 과일 용사", emoji: "🍎", power: "상큼 굴러가기", intro: "데굴데굴 굴러가며 숨은 문을 찾아내.", accent: "#f15e5e", accessory: "잎사귀 방패", image: "https://gohwansok-max.github.io/pixel-quest-vibe-coding-workshop/assets/characters/apple.png" },
];

const customEmojiOptions = ["✨", "🦖", "🐳", "🦊", "🐉", "🧁", "🚀", "🎮", "🍀", "🛼", "🦄", "🌈"];

const followUpPrompts = [
  { question: "그 장면에는 어떤 색, 날씨, 소리가 더 있으면 좋을까?", examples: ["보랏빛 저녁에 별가루가 반짝여", "비 오는 날 구름 사이에 무지개가 떠", "문이 열릴 때 종소리가 들려"] },
  { question: "그 능력은 언제 가장 웃기거나 멋지게 쓰일까?", examples: ["친구를 도와줄 때만 더 강해져", "재채기하면 숨은 문이 보여", "노래를 부르면 시간이 잠깐 멈춰"] },
  { question: "그곳에만 있는 신기한 물건 하나를 더 만들어 볼까?", examples: ["문을 열면 노래가 나오는 작은 열쇠", "말을 걸면 길을 알려 주는 구름", "그림 속으로 들어가는 지도"] },
  { question: "그 행동을 하면 화면에서 무엇이 움직이거나 반짝일까?", examples: ["발자국이 무지개색으로 반짝여", "구름이 통통 튀어 올라", "별들이 길을 따라 날아와"] },
  { question: "친구가 ‘와!’ 할 때 어떤 깜짝 변화가 일어날까?", examples: ["숨은 길이 하늘에 펼쳐져", "마을 전체가 춤추기 시작해", "작은 새가 거대한 용으로 변해"] },
  { question: "그 문제를 풀 힌트는 어디에 숨어 있으면 재미있을까?", examples: ["벽에 그려진 웃긴 그림 속에", "졸린 고양이의 꿈속에", "바람이 불 때만 보이는 글자에"] },
  { question: "그 보물을 얻으면 캐릭터가 무엇을 새롭게 할 수 있을까?", examples: ["새로운 곳으로 날아갈 수 있어", "비밀 친구를 부를 수 있어", "아지트를 내 마음대로 꾸밀 수 있어"] },
  { question: "처음 온 친구가 무서워하지 않게 누가 도와주면 좋을까?", examples: ["작은 새 친구가 먼저 같이 해 봐", "말랑한 로봇이 버튼을 보여 줘", "실수해도 웃으며 힌트를 주는 요정"] },
  { question: "끝나는 장면에 누가 함께 있고, 어떤 기분이면 좋을까?", examples: ["모든 친구가 웃으며 손을 흔들어", "별빛 아래에서 축제가 열려", "처음 만난 친구와 다시 약속해"] },
  { question: "영상에서 제일 먼저 보여 주고 싶은 장면은 무엇일까?", examples: ["숨은 방이 열리는 가장 신기한 순간", "고영빈이 번개 점프하는 순간", "친구들과 마지막 노래를 부르는 장면"] },
];

const badges = [
  { id: "first", target: 1, icon: "🎖️", title: "첫 주문서", copy: "첫 번째 게임 이야기를 끝까지 완성했어!", color: "#f3bf54" },
  { id: "three", target: 3, icon: "🧭", title: "아이디어 탐험가", copy: "서로 다른 세 개의 세계를 상상했어!", color: "#8eceef" },
  { id: "five", target: 5, icon: "🛠️", title: "게임 공방장", copy: "다섯 개의 게임 주문서를 만든 멋진 제작자!", color: "#b6f23d" },
  { id: "ten", target: 10, icon: "👑", title: "전설의 게임 제작자", copy: "열 개의 모험을 만든 진짜 게임 장인!", color: "#b894f6" },
];

const fireworkPieces = Array.from({ length: 44 }, (_, index) => ({
  id: index,
  x: 8 + ((index * 23) % 84),
  y: 8 + ((index * 41) % 70),
  size: 5 + ((index * 7) % 8),
  delay: (index % 9) * 45,
  color: ["#b6f23d", "#f05a4f", "#8eceef", "#f3bf54", "#b894f6"][index % 5],
}));

const questions: Question[] = [
  {
    label: "첫 장면",
    number: "01",
    kicker: "게임의 첫 번째 그림",
    question: "게임을 켰을 때 제일 먼저 어떤 장면이 보이면 좋겠어?",
    helper: "장르 이름을 몰라도 괜찮아. 색, 날씨, 냄새, 소리처럼 떠오르는 것부터 말해 봐.",
    sparks: ["하늘에 섬이 둥둥 떠 있어", "비밀 문이 열리는 소리가 나", "아무도 모르는 축제가 시작돼"],
    placeholder: "예: 보랏빛 저녁, 거대한 나무 위 마을에서 별가루가 천천히 떨어진다.",
  },
  {
    label: "캐릭터의 비밀",
    number: "02",
    kicker: "주인공에게 힘을 주기",
    question: "네 캐릭터만 아는 비밀이나 특별한 능력은 뭐야?",
    helper: "엄청 강하지 않아도 돼. 웃기거나 이상한 능력도 아주 멋진 게임 재료야.",
    sparks: ["무서우면 작아져", "달빛을 먹으면 날 수 있어", "재채기하면 숨은 문이 보여"],
    placeholder: "예: 주머니 속 작은 돌과 이야기하면, 잃어버린 물건의 방향을 알려 준다.",
  },
  {
    label: "가고 싶은 곳",
    number: "03",
    kicker: "모험의 지도",
    question: "캐릭터가 꼭 가 보고 싶은 곳은 어디야?",
    helper: "한 장소만 골라도 좋아. 그곳이 왜 특별한지 한 가지만 더 알려 줘.",
    sparks: ["낮에는 잠드는 바다", "간식으로 만든 기차역", "거꾸로 흐르는 폭포"],
    placeholder: "예: 비가 오면만 열리는 도서관. 책을 열면 작은 세계로 들어갈 수 있다.",
  },
  {
    label: "처음 할 일",
    number: "04",
    kicker: "플레이어의 손끝",
    question: "게임을 시작한 사람이 제일 먼저 해 보면 좋을 행동은 뭐야?",
    helper: "움직이기, 말 걸기, 찾기, 쌓기, 날기처럼 쉽고 재미있는 행동 하나면 충분해.",
    sparks: ["반짝이는 발자국 따라가기", "작은 친구에게 인사하기", "구름을 밟아 높이 오르기"],
    placeholder: "예: 화면을 누르면 캐릭터가 물웅덩이를 통통 뛰어넘으며 앞으로 간다.",
  },
  {
    label: "와! 하는 순간",
    number: "05",
    kicker: "게임만의 재미",
    question: "친구가 하다가 ‘와, 이거 재밌다!’ 할 순간은 언제야?",
    helper: "멋진 효과, 깜짝 발견, 귀여운 실패처럼 감정이 움직이는 장면을 떠올려 봐.",
    sparks: ["세 번 점프하면 구름 길이 생겨", "숨은 방에서 캐릭터가 춤춰", "작은 선택이 큰 변화를 만들지"],
    placeholder: "예: 잃어버린 별을 찾으면 마을 사람들의 창문이 하나씩 환하게 켜진다.",
  },
  {
    label: "재미있는 문제",
    number: "06",
    kicker: "넘어야 할 언덕",
    question: "캐릭터 앞을 가로막지만, 풀고 나면 기분 좋은 문제는 뭐야?",
    helper: "무서운 적이 아니어도 돼. 엉킨 길, 수줍은 문지기, 까다로운 퍼즐도 좋아.",
    sparks: ["방향을 바꾸는 바람", "웃겨야 열리는 문", "길을 자꾸 먹어 버리는 덩굴"],
    placeholder: "예: 그림자가 사라져서 아무도 움직일 수 없다. 빛을 모아 그림자를 돌려줘야 한다.",
  },
  {
    label: "보물",
    number: "07",
    kicker: "계속 해 보고 싶은 이유",
    question: "문제를 풀면 무엇을 얻을 수 있으면 좋겠어?",
    helper: "점수 말고도 새로운 친구, 재미있는 장식, 새로운 길처럼 네가 좋아할 보상을 생각해 봐.",
    sparks: ["나만의 아지트 장식", "함께 가는 동물 친구", "새로운 색의 마법"],
    placeholder: "예: 매번 다른 모양의 별 조각을 얻고, 모으면 캐릭터의 모자가 달라진다.",
  },
  {
    label: "처음 배우기",
    number: "08",
    kicker: "친절한 첫 단계",
    question: "처음 하는 친구도 게임 방법을 어떻게 알 수 있을까?",
    helper: "말풍선, 따라 하기, 귀여운 안내 친구처럼 네가 편한 방법을 골라 봐.",
    sparks: ["작은 새가 먼저 보여 줘", "첫 길에는 반짝이는 화살표가 있어", "실패해도 힌트를 주는 친구가 있어"],
    placeholder: "예: 첫 번째 구름을 밟으면 나비가 나타나 ‘화살표 키로 같이 가자’고 말한다.",
  },
  {
    label: "마지막 장면",
    number: "09",
    kicker: "기억에 남는 끝",
    question: "게임을 끝낸 뒤에도 오래 기억날 장면은 뭐야?",
    helper: "큰 폭발 대신 따뜻한 인사, 예상 밖의 변화, 비밀 결말도 아주 좋아.",
    sparks: ["처음 장면이 새롭게 변해", "모은 친구들이 함께 노래해", "다음 모험의 지도가 나타나"],
    placeholder: "예: 밤하늘의 별이 모두 마을 사람들의 편지였다는 것을 알게 된다.",
  },
  {
    label: "유튜브의 한마디",
    number: "10",
    kicker: "다른 사람에게 자랑하기",
    question: "이 게임 영상을 보고 싶은 친구에게 어떤 한마디를 하고 싶어?",
    helper: "정답은 없어. 네 게임의 가장 신기한 장면이나 도전하고 싶은 것을 말해 봐.",
    sparks: ["숨은 방을 찾아볼래?", "이 보스를 웃겨서 이길 수 있을까?", "내가 만든 하늘섬에 놀러 와!"],
    placeholder: "예: 바람을 타는 여우와 별빛 로봇, 둘 다 구할 수 있을까?",
  },
];

function buildPrompt(answers: string[], character: Character) {
  const [opening, secret, place, firstMove, wowMoment, challenge, reward, learning, ending, youtube] = answers;

  return `# 30년 경력 게임 개발자 페르소나
너는 콘솔·PC·모바일·인디 게임을 30년 동안 만든 베테랑 게임 개발자이자, 초등학교 4학년 게임 제작자의 다정한 멘토다. 아이의 말과 상상을 절대 평범한 공식으로 바꾸지 말고, 가장 재미있는 부분을 발견해 게임 규칙으로 살려라. 어려운 용어는 쉬운 말로 설명하고, 첫 버전은 작지만 실제로 플레이할 수 있게 완성하라.

## 가장 중요한 제작 규칙
1. 결과물은 **HTML, CSS, JavaScript를 모두 포함한 index.html 단 하나의 파일**이어야 한다. 절대로 여러 파일로 나누지 말고, 외부 이미지·로그인·서버·유료 서비스도 사용하지 마라.
2. 코드는 복사해 index.html로 저장하면 바로 브라우저에서 실행돼야 한다.
3. 키보드 조작과 화면 아래의 터치 조작 버튼을 함께 제공해서 PC·스마트폰·태블릿 모두에서 플레이 가능하게 만들어라.
4. 시작 화면, 쉬운 조작 안내, 진행 또는 점수 표시, 성공·실패 화면, 다시 시작 버튼을 넣어라.
5. 초등학교 4학년이 읽을 수 있게 코드에 쉬운 한국어 주석을 충분히 달아라.
6. 그림은 CSS 도형, 이모지, 간단한 Canvas만 써서 만들고, 화면이 작아져도 글자와 버튼이 겹치지 않게 만들어라.

## 이 게임의 주인공
- 이름: ${character.name}
- 역할: ${character.title}
- 특별 능력: ${character.power}
- 대표 소품: ${character.accessory}
- 성격과 분위기: ${character.intro}

## 아이가 만든 게임 주문서
- 첫 장면: ${opening}
- 주인공의 비밀: ${secret}
- 가고 싶은 곳: ${place}
- 플레이어가 처음 할 행동: ${firstMove}
- “와!” 하는 순간: ${wowMoment}
- 재미있는 문제: ${challenge}
- 문제를 풀면 받는 보물: ${reward}
- 처음 하는 친구를 돕는 방법: ${learning}
- 마지막 장면: ${ending}

## 답변 방식
먼저 ‘만들 게임’과 ‘조작 방법’을 6줄 이내로 신나고 쉽게 설명해라. 다음으로 완성된 **index.html 전체 코드**를 코드 블록 하나에만 넣어라. 코드 뒤에는 아래 유튜브 아이디어를 바탕으로 짧은 영상 제목 3개, 썸네일 문구 3개, 30초 영상 대본을 덧붙여라.

## 유튜브 영상의 한마디
${youtube}

이제 이 아이디어만의 매력을 살린 첫 번째 플레이 가능 게임을 만들어 줘.`;
}

function polishSpokenSentence(value: string) {
  const withoutFillers = value.trim().replace(/^(어+|음+|저기)\s*/, "");
  const normalized = withoutFillers
    .replace(/\s+/g, " ")
    .replace(/\s*([,.!?])\s*/g, "$1 ")
    .replace(/([.!?])\s*$/g, "$1")
    .trim();
  if (!normalized) return "";
  return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("character");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [selectedCharacter, setSelectedCharacter] = useState("goyoungbin");
  const [customCharacter, setCustomCharacter] = useState<CustomCharacter>({ name: "나만의 주인공", accent: "#80c9f6", emoji: "✨" });
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [listening, setListening] = useState(false);
  const [vault, setVault] = useState<SavedIdea[]>([]);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [hasAwardedCurrentOrder, setHasAwardedCurrentOrder] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const speechRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const celebrationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<{ stage: Stage; step: number; answers: string[]; selectedCharacter: string; customCharacter: CustomCharacter; hasAwardedCurrentOrder: boolean }>;
        if (parsed.stage) setStage(parsed.stage);
        if (typeof parsed.step === "number") setStep(Math.min(Math.max(parsed.step, 0), questions.length - 1));
        if (Array.isArray(parsed.answers)) setAnswers(questions.map((_, index) => parsed.answers?.[index] ?? ""));
        if (characters.some((character) => character.id === parsed.selectedCharacter) || parsed.selectedCharacter === "custom") setSelectedCharacter(parsed.selectedCharacter as string);
        if (parsed.customCharacter?.name && parsed.customCharacter?.accent) setCustomCharacter(parsed.customCharacter);
        if (parsed.hasAwardedCurrentOrder) setHasAwardedCurrentOrder(true);
      }
      const storedVault = window.localStorage.getItem(VAULT_KEY);
      if (storedVault) {
        const parsedVault = JSON.parse(storedVault) as SavedIdea[];
        if (Array.isArray(parsedVault)) setVault(parsedVault);
      }
      const storedBadgeCount = Number(window.localStorage.getItem(BADGE_KEY) ?? "0");
      if (Number.isFinite(storedBadgeCount) && storedBadgeCount >= 0) setCompletedOrders(Math.floor(storedBadgeCount));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => () => {
    speechRecognitionRef.current?.stop();
    if (celebrationTimerRef.current) window.clearTimeout(celebrationTimerRef.current);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ stage, step, answers, selectedCharacter, customCharacter, hasAwardedCurrentOrder }));
  }, [answers, customCharacter, hasAwardedCurrentOrder, hydrated, selectedCharacter, stage, step]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
  }, [hydrated, vault]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(BADGE_KEY, String(completedOrders));
  }, [completedOrders, hydrated]);

  const allCharacters = useMemo(() => [
    ...characters,
    { id: "custom", name: customCharacter.name.trim() || "나만의 주인공", title: "직접 만든 캐릭터", emoji: customCharacter.emoji || "✨", power: "내가 정한 능력", intro: "이야기와 색을 네가 직접 정했어.", accent: customCharacter.accent, accessory: "상상 노트" },
  ], [customCharacter]);
  const character = allCharacters.find((item) => item.id === selectedCharacter) ?? allCharacters[0];
  const question = questions[step];
  const prompt = useMemo(() => buildPrompt(answers, character), [answers, character]);
  const progress = stage === "result" ? 100 : stage === "questions" ? Math.round(((step + 1) / questions.length) * 100) : 0;
  const shortAnswer = answers[step]?.trim().length > 0 && answers[step].trim().length < 24;
  const followUp = followUpPrompts[step];

  const playCelebrationSound = () => {
    try {
      const audioContext = new AudioContext();
      const now = audioContext.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = index % 2 ? "triangle" : "sine";
        oscillator.frequency.setValueAtTime(frequency, now + index * 0.09);
        gain.gain.setValueAtTime(0.0001, now + index * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.13, now + index * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.09 + 0.28);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(now + index * 0.09);
        oscillator.stop(now + index * 0.09 + 0.3);
      });
      window.setTimeout(() => audioContext.close(), 900);
    } catch {
      // Browsers that block Web Audio still show the visual celebration.
    }
  };

  const celebrate = (message: string) => {
    if (celebrationTimerRef.current) window.clearTimeout(celebrationTimerRef.current);
    setCelebrationMessage(message);
    setCelebrating(true);
    playCelebrationSound();
    celebrationTimerRef.current = window.setTimeout(() => setCelebrating(false), 2800);
  };

  const updateAnswer = (value: string) => {
    setAnswers((current) => current.map((answer, index) => (index === step ? value : answer)));
  };

  const polishCurrentAnswer = () => {
    const polished = polishSpokenSentence(answers[step]);
    if (!polished) {
      toast("먼저 말하거나 적은 내용을 넣어 줘!");
      return;
    }
    updateAnswer(polished);
    toast("문장을 읽기 좋게 다듬었어. 마음에 안 들면 다시 고쳐도 좋아!");
  };

  const saveToVault = () => {
    const title = answers[0]?.trim().slice(0, 32) || `${character.name}의 게임 아이디어`;
    const snapshot: SavedIdea = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      savedAt: Date.now(),
      answers: [...answers],
      selectedCharacter,
      customCharacter: { ...customCharacter },
    };
    setVault((items) => [snapshot, ...items].slice(0, 30));
    toast("아이디어 보관함에 저장했어. 나중에 다시 열어볼 수 있어!");
  };

  const loadFromVault = (idea: SavedIdea) => {
    setAnswers(questions.map((_, index) => idea.answers[index] ?? ""));
    setCustomCharacter(idea.customCharacter);
    setSelectedCharacter(idea.selectedCharacter);
    setStep(0);
    setStage("result");
    setVaultOpen(false);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
    toast("보관한 게임 주문서를 다시 열었어!");
  };

  const removeFromVault = (id: string) => {
    setVault((items) => items.filter((idea) => idea.id !== id));
  };

  const useSpark = (spark: string) => {
    updateAnswer(answers[step] ? `${answers[step]} ${spark}` : spark);
  };

  const updateCustomCharacter = (change: Partial<CustomCharacter>) => {
    setCustomCharacter((current) => ({ ...current, ...change }));
    setSelectedCharacter("custom");
  };

  const startVoiceInput = () => {
    if (listening) {
      speechRecognitionRef.current?.stop();
      return;
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      toast("음성 입력은 Chrome 또는 Edge에서 가장 잘 작동해. 직접 적기도 가능해!");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "ko-KR";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const spokenText = Array.from(event.results).map((result) => result[0]?.transcript ?? "").join(" ").trim();
      if (spokenText) {
        setAnswers((current) => current.map((answer, index) => index === step ? `${answer}${answer.trim() ? " " : ""}${spokenText}` : answer));
        toast("말한 내용을 적었어. 조금 고쳐도 좋아!");
      }
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed") toast("마이크 사용을 허용해 주면 음성으로 적을 수 있어.");
      else if (event.error !== "aborted") toast("말을 잘 듣지 못했어. 다시 눌러 천천히 말해 봐.");
    };
    recognition.onend = () => setListening(false);
    speechRecognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
      toast("듣고 있어. 문장으로 편하게 말해 봐!");
    } catch {
      setListening(false);
    }
  };

  const startQuest = () => {
    setStage("questions");
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const next = () => {
    if (!answers[step].trim()) {
      toast("짧아도 좋아. 네 생각을 한 문장만 적어 보자!");
      return;
    }
    if (step === questions.length - 1) {
      setStage("result");
      if (!hasAwardedCurrentOrder) {
        const nextTotal = completedOrders + 1;
        const earnedBadge = badges.find((badge) => badge.target === nextTotal);
        setCompletedOrders(nextTotal);
        setHasAwardedCurrentOrder(true);
        window.setTimeout(() => celebrate(earnedBadge ? `“${earnedBadge.title}” 배지를 얻었어!` : "10개의 아이디어 조각을 모두 모았어!"), 120);
      } else {
        window.setTimeout(() => celebrate("10개의 아이디어 조각을 모두 모았어!"), 120);
      }
    } else {
      setStep((current) => current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const previous = () => {
    if (stage === "result") {
      setStage("questions");
      setStep(questions.length - 1);
      return;
    }
    if (step === 0) {
      setStage("character");
      return;
    }
    setStep((current) => current - 1);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast("복사했어! 이제 ChatGPT를 열어 그대로 붙여 넣어 봐.", { duration: 4200 });
      celebrate("게임 주문서를 복사했어! 이제 진짜 게임을 만들 차례야!");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast("복사에 실패했어. 주문서 안의 글을 길게 눌러 직접 복사해 줘.");
    }
  };

  const shareProject = async () => {
    const shareText = `${character.name}와 함께 만든 나만의 게임 주문서! 너도 게임 아이디어를 만들어 볼래?`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "게임 주문서 공방", text: shareText, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
        toast("공유 문구와 링크를 복사했어. 카카오톡에 붙여 넣어 봐!");
      }
    } catch {
      // A share sheet can be closed intentionally, so no error message is needed.
    }
  };

  const downloadPrompt = () => {
    const blob = new Blob([prompt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-game-index-html-prompt.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast("게임 주문서를 파일로 저장했어.");
  };

  const reset = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setStage("character");
    setStep(0);
    setAnswers(Array(questions.length).fill(""));
    setSelectedCharacter("goyoungbin");
    setCustomCharacter({ name: "나만의 주인공", accent: "#80c9f6", emoji: "✨" });
    setHasAwardedCurrentOrder(false);
    setCopied(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pixel-workshop min-h-screen overflow-x-hidden bg-[#fbf4df] text-[#101b3d]">
      <div className="pixel-grid" aria-hidden="true" />
      <header className="site-header relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <a className="brand-mark" href="#top" aria-label="게임 주문서 공방 처음으로">
          <img src="/manus-storage/pixel-quest-logo_0164f001.png" alt="" className="brand-logo" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          <span><strong className="wordmark-custom">게임 주문서 공방</strong><small>PIXEL QUEST · VIBE CODING</small></span>
        </a>
        <div className="header-tools"><button type="button" className="badge-trigger" onClick={() => setBadgeOpen(true)}><Medal size={16} /> 배지 <b>{badges.filter((badge) => completedOrders >= badge.target).length}/{badges.length}</b></button><button type="button" className="vault-trigger" onClick={() => setVaultOpen(true)}><Archive size={16} /> 보관함 <b>{vault.length}</b></button><div className="save-status" aria-live="polite"><span className="save-light" />{hydrated ? "자동 저장 중" : "작업대 준비 중"}</div></div>
      </header>

      <main id="top" className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-12 sm:px-8 lg:px-12">
        {stage === "character" && (
          <section className="character-stage" aria-labelledby="character-title">
            <div className="character-intro">
              <span className="eyebrow"><Sparkles size={15} fill="currentColor" /> CHARACTER BAY</span>
              <h1 id="character-title">너만의 <em>게임 친구</em>를<br />먼저 데려가자.</h1>
              <p>캐릭터는 정답이 아니야. 마음에 드는 친구를 골라 주인공으로 삼고, 네 이야기를 마음껏 들려줘.</p>
              <div className="maker-persona"><Gamepad2 size={23} /><span><b>고영빈이 메인 주인공!</b> 30년 경력 게임 개발자가 영빈이의 상상을 첫 번째 <code>index.html</code> 게임으로 바꿔 줄 거야.</span></div>
              <div className="setup-quest-map" aria-label="게임 주문서 만들기 여정">
                <span className="map-label">GAME ORDER PATH</span>
                <ol>
                  <li className="current"><b>01</b><span>아이디어 동료<br /><strong>캐릭터 고르기</strong></span></li>
                  <li><b>02</b><span>상상 카드<br /><strong>이야기 적기</strong></span></li>
                  <li><b>03</b><span>게임 주문서<br /><strong>ChatGPT에 보내기</strong></span></li>
                </ol>
              </div>
            </div>

            <div className="character-selection" role="list" aria-label="전용 캐릭터 선택">
              {allCharacters.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  role="listitem"
                  className={`character-card ${selectedCharacter === item.id ? "selected" : ""}`}
                  style={{ "--character-accent": item.accent } as CSSProperties}
                  onClick={() => setSelectedCharacter(item.id)}
                >
                  <span className="character-check">{selectedCharacter === item.id && <Check size={17} strokeWidth={3} />}</span>
                  <span className="character-emoji" aria-hidden="true">{item.image && <img src={item.image} alt="" onError={(event) => { event.currentTarget.dataset.failed = "true"; event.currentTarget.style.display = "none"; }} />}<i>{item.emoji}</i></span>
                  <span className="character-copy"><small>{item.title}</small><b>{item.name}</b><span>{item.intro}</span></span>
                  <span className="character-power"><Zap size={13} fill="currentColor" /> {item.power}</span>
                </button>
              ))}
            </div>

            <div className="custom-character-lab" style={{ "--character-accent": customCharacter.accent } as CSSProperties}>
              <div className="custom-lab-symbol"><Palette size={25} /><span>{customCharacter.emoji}</span></div>
              <div className="custom-lab-copy"><span className="eyebrow">MY CHARACTER LAB</span><h2>직접 만든 캐릭터</h2><p>이름과 대표 색을 바꾸면 바로 네 캐릭터가 돼.</p></div>
              <label className="character-name-field"><span>이름</span><input value={customCharacter.name} maxLength={12} onChange={(event) => updateCustomCharacter({ name: event.target.value })} placeholder="캐릭터 이름" /></label>
              <label className="character-color-field"><span>대표 색</span><input type="color" value={customCharacter.accent} onChange={(event) => updateCustomCharacter({ accent: event.target.value })} aria-label="캐릭터 대표 색 선택" /></label>
              <div className="custom-emoji-field"><span>대표 이모지</span><div>{customEmojiOptions.map((emoji) => <button type="button" key={emoji} className={customCharacter.emoji === emoji ? "picked" : ""} onClick={() => updateCustomCharacter({ emoji })} aria-label={`${emoji} 이모지 선택`}>{emoji}</button>)}</div></div>
              <button type="button" className="custom-select-button" onClick={() => setSelectedCharacter("custom")}>{selectedCharacter === "custom" ? <Check size={17} /> : <Sparkles size={17} />} {selectedCharacter === "custom" ? "선택 완료" : "이 캐릭터로 하기"}</button>
            </div>

            <div className="character-launch">
              <div className="chosen-character"><span>{character.image && <img src={character.image} alt="" onError={(event) => { event.currentTarget.dataset.failed = "true"; event.currentTarget.style.display = "none"; }} />}<i>{character.emoji}</i></span><p><b>{character.name}</b>와 함께 갈 준비 완료!<small>대표 소품: {character.accessory}</small></p></div>
              <button type="button" onClick={startQuest} className="launch-button">이 친구로 이야기 시작 <ArrowRight size={19} /></button>
            </div>
          </section>
        )}

        {stage === "questions" && (
          <div className="workshop-layout">
            <aside className="quest-rail" aria-label="게임 주문서 진행 목록">
              <div className="rail-heading"><span className="status-dot" /><span>QUEST LOG</span></div>
              <div className="rail-character"><span>{character.emoji}</span><p><b>{character.name}</b>와 만드는 중<small>닫아도 자동 저장돼</small></p></div>
              <ol>
                {questions.map((item, index) => {
                  const isActive = index === step;
                  const isDone = Boolean(answers[index]);
                  return <li key={item.label} className={isActive ? "active" : isDone ? "done" : ""}><span className="rail-number">{isDone ? <Check size={14} strokeWidth={3} /> : item.number}</span><span className="rail-text">{item.label}</span></li>;
                })}
              </ol>
              <div className="rail-tip"><Lightbulb size={18} /><span>한 단어도 좋아.<br />네 생각이 제일 중요해.</span></div>
            </aside>

            <section className="quest-panel" aria-live="polite">
              <div className="mobile-quest-top"><span>{character.emoji} {character.name}의 이야기</span><button type="button" onClick={() => setStage("character")}>캐릭터 바꾸기</button></div>
              <div className="mobile-progress"><span>QUEST {String(step + 1).padStart(2, "0")} / 10</span><div><i style={{ width: `${progress}%` }} /></div></div>
              <div className="hero-strip compact-hero">
                <div><span className="eyebrow"><Zap size={15} fill="currentColor" /> IDEA FORGE</span><h1>{character.name}의 이야기를<br /><em>네 방식으로</em> 만들어 봐.</h1><p>고른 예시는 시작점일 뿐이야. 마음대로 고치고, 섞고, 완전히 새로 써도 좋아.</p></div>
                <div className="hero-character" style={{ "--character-accent": character.accent } as CSSProperties} aria-hidden="true"><span>{character.image && <img src={character.image} alt="" onError={(event) => { event.currentTarget.dataset.failed = "true"; event.currentTarget.style.display = "none"; }} />}<b>{character.emoji}</b></span><i>{character.accessory}</i></div>
              </div>

              <div className="question-card creative-question-card">
                <div className="cartridge-label"><span>IDEA CARD {question.number}</span><span>{question.label}</span></div>
                <div className="cartridge-slots" aria-label={`아이디어 조각 ${step + 1}번을 쓰는 중입니다`}>{questions.map((item, index) => <i key={item.label} className={index < step && answers[index] ? "filled" : index === step ? "loading" : ""} />)}</div>
                <div className="question-intro"><span className="question-count">{question.number}</span><div><p className="question-kicker">{question.kicker}</p><h2>{question.question}</h2><p>{question.helper}</p><p className="workshop-cheer"><Sparkles size={14} /> 여기에는 이상한 생각, 웃긴 생각, 멋진 생각이 다 들어갈 수 있어!</p></div></div>
                <div className="spark-bank"><span>생각 불씨를 눌러 시작해도 돼</span><div>{question.sparks.map((spark) => <button type="button" key={spark} onClick={() => useSpark(spark)}>{spark}</button>)}</div></div>
                <label className="custom-answer"><span>네 이야기 적기</span><textarea value={answers[step]} onChange={(event) => updateAnswer(event.target.value)} placeholder={question.placeholder} rows={5} maxLength={320} /><button type="button" className="polish-answer-button" onClick={polishCurrentAnswer}><Sparkles size={16} /><b>말 다듬기</b></button><button type="button" className={`voice-input-button ${listening ? "listening" : ""}`} onClick={startVoiceInput} aria-label={listening ? "음성 입력 멈추기" : "음성으로 답변하기"}>{listening ? <MicOff size={18} /> : <Mic size={18} />}<b>{listening ? "듣는 중…" : "말로 적기"}</b></button><small>{answers[step].length}/320</small></label>
                {shortAnswer && <aside className="follow-up-card" aria-live="polite"><span><Sparkles size={15} fill="currentColor" /> IDEA BUDDY</span><p><b>좋은 시작이야!</b> {followUp.question}</p><small>마음에 드는 예시 하나를 눌러서 네 이야기로 바꿔 봐.</small><div className="follow-up-options">{followUp.examples.map((example, index) => <button type="button" key={example} onClick={() => useSpark(example)}><Zap size={14} fill="currentColor" /> {index === 0 ? "힌트" : "예시"}: {example}</button>)}</div></aside>}
                <div className="card-footer"><button type="button" onClick={previous} className="nav-button back"><ArrowLeft size={18} /> {step === 0 ? "캐릭터" : "이전"}</button><p><b>{step + 1}</b> / 10 자동 저장됨</p><button type="button" onClick={next} className="nav-button next">{step === questions.length - 1 ? "주문서 완성" : "다음 장면"}{step === questions.length - 1 ? <Wand2 size={18} /> : <ArrowRight size={18} />}</button></div>
              </div>
              <div className="mini-note"><Heart size={17} /><span><b>창의력 규칙</b> 다른 게임과 비슷해도 괜찮고, 전혀 이상해도 좋아. 네가 재미있다면 그게 가장 좋은 시작이야.</span></div>
            </section>
          </div>
        )}

        {stage === "result" && (
          <section className="result-layout" aria-live="polite">
            <div className="result-headline"><div className="result-badge"><Gamepad2 size={24} /> {character.emoji} QUEST COMPLETE</div><h1>{character.name}의 게임<br /><em>주문서</em>가 완성됐어!</h1><p>아래 코드 블록 안의 프롬프트를 통째로 복사해서 ChatGPT에 붙여 넣어 봐. 30년 경력 게임 개발자 멘토가 네 이야기를 첫 번째 게임으로 만들어 줄 거야.</p><div className="result-actions top-actions"><button type="button" onClick={copyPrompt} className="copy-button">{copied ? <Check size={20} /> : <Clipboard size={20} />}{copied ? "복사 완료!" : "프롬프트 복사"}</button><button type="button" onClick={saveToVault} className="vault-save-button"><BookmarkPlus size={18} /> 보관함에 저장</button><button type="button" onClick={() => setVaultOpen(true)} className="secondary-action"><Archive size={18} /> 보관함 열기</button><button type="button" onClick={shareProject} className="share-button"><Share2 size={18} /> 카카오톡으로 공유</button><button type="button" onClick={downloadPrompt} className="secondary-action"><Download size={18} /> 파일 저장</button></div><div className="youtube-tip"><Youtube size={21} /><span><b>게임 유튜브 팁</b> ChatGPT가 준 게임을 플레이한 첫 장면을 녹화해 봐. 코드 뒤에 영상 제목과 30초 대본도 함께 요청했어.</span></div></div>
            <div className="prompt-scroll"><div className="prompt-toolbar"><span><Code2 size={17} /> COPY THIS INTO CHATGPT</span><button type="button" onClick={copyPrompt}>{copied ? "COPIED" : "COPY PROMPT"}</button></div><pre><code>{prompt}</code></pre></div>
            <div className="next-steps"><p className="eyebrow"><Sparkles size={15} fill="currentColor" /> 이제 이 순서로 해 봐</p><div><article><b>01</b><span>‘프롬프트 복사’를 눌러<br />ChatGPT에 붙여 넣기</span></article><article><b>02</b><span>받은 코드를 <code>index.html</code>로<br />저장해서 브라우저로 열기</span></article><article><b>03</b><span>게임을 해 보고 한 가지씩<br />새롭게 고쳐 보기</span></article></div><button type="button" onClick={reset} className="restart-button"><RotateCcw size={18} /> 새 게임 이야기 만들기</button></div>
          </section>
        )}
      </main>
      {celebrating && <div className="celebration-overlay" role="status" onClick={() => setCelebrating(false)}><div className="celebration-rays" aria-hidden="true" />{fireworkPieces.map((piece) => <i key={piece.id} className="firework-piece" style={{ "--piece-x": `${piece.x}%`, "--piece-y": `${piece.y}%`, "--piece-size": `${piece.size}px`, "--piece-delay": `${piece.delay}ms`, "--piece-color": piece.color } as CSSProperties} />)}<div className="celebration-card"><span>🎉</span><p>QUEST ACHIEVEMENT UNLOCKED</p><h2>정말 잘했어, {character.name}!</h2><b>{celebrationMessage}</b><small>화면을 누르면 폭죽을 닫을 수 있어.</small></div></div>}
      {badgeOpen && <div className="vault-overlay badge-overlay" role="dialog" aria-modal="true" aria-labelledby="badge-title"><section className="vault-panel badge-panel"><header><div><span className="eyebrow"><Medal size={15} /> ACHIEVEMENT CABINET</span><h2 id="badge-title">영빈이의 배지 컬렉션</h2><p>게임 주문서를 끝까지 만들 때마다 새로운 배지가 열려.</p></div><button type="button" onClick={() => setBadgeOpen(false)} aria-label="배지 컬렉션 닫기"><X size={21} /></button></header><div className="badge-progress"><span><b>{completedOrders}</b>개의 게임 주문서 완성</span><i><b style={{ width: `${Math.min(100, (completedOrders / 10) * 100)}%` }} /></i></div><div className="badge-grid">{badges.map((badge) => { const unlocked = completedOrders >= badge.target; return <article key={badge.id} className={unlocked ? "unlocked" : "locked"} style={{ "--badge-color": badge.color } as CSSProperties}><span>{unlocked ? badge.icon : "🔒"}</span><div><small>{unlocked ? "UNLOCKED" : `${badge.target}개 주문서 필요`}</small><b>{badge.title}</b><p>{badge.copy}</p></div></article>; })}</div></section></div>}
      {vaultOpen && <div className="vault-overlay" role="dialog" aria-modal="true" aria-labelledby="vault-title"><section className="vault-panel"><header><div><span className="eyebrow"><Archive size={15} /> IDEA VAULT</span><h2 id="vault-title">게임 아이디어 보관함</h2><p>이 기기 브라우저에 저장돼. 최대 30개까지 다시 열 수 있어.</p></div><button type="button" onClick={() => setVaultOpen(false)} aria-label="보관함 닫기"><X size={21} /></button></header>{vault.length === 0 ? <div className="vault-empty"><Archive size={34} /><b>아직 보관한 게임이 없어.</b><span>게임 주문서를 완성한 뒤 ‘보관함에 저장’을 눌러 봐!</span></div> : <div className="vault-list">{vault.map((idea) => <article key={idea.id}><div><span>{new Date(idea.savedAt).toLocaleDateString("ko-KR")}</span><b>{idea.title}</b><p>{idea.answers.filter(Boolean).length}/10개 아이디어 조각 · {idea.selectedCharacter === "custom" ? idea.customCharacter.name : characters.find((item) => item.id === idea.selectedCharacter)?.name ?? "게임 친구"}</p></div><div><button type="button" className="vault-load" onClick={() => loadFromVault(idea)}>다시 열기</button><button type="button" className="vault-delete" onClick={() => removeFromVault(idea.id)} aria-label={`${idea.title} 삭제`}><Trash2 size={17} /></button></div></article>)}</div>}</section></div>}
      <footer className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 text-xs font-bold tracking-wide text-[#68728c] sm:px-8 lg:px-12"><span>PIXEL QUEST WORKSHOP · YOUR IDEA IS THE MAP</span><span>MADE FOR YOUNG GAME CREATORS</span></footer>
    </div>
  );
}
