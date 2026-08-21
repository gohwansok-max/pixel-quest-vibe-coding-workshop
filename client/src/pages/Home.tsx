/**
 * Style reminder — Pixel Quest Workshop: warm cream canvas, ink-navy utility surfaces,
 * Arcade Lime (#B6F23D) for progress, and practical retro-game details. One focused action per screen.
 */
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clipboard,
  Code2,
  Download,
  Gamepad2,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Wand2,
  Youtube,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

type Question = {
  label: string;
  icon: string;
  question: string;
  helper: string;
  choices: string[];
  placeholder: string;
};

const questions: Question[] = [
  {
    label: "게임의 한 줄 소개",
    icon: "01",
    question: "어떤 게임을 만들고 싶어?",
    helper: "좋아하는 게임을 떠올리고, 네 게임만의 재미를 한 문장으로 말해 봐.",
    choices: ["보물을 찾는 모험 게임", "괴물을 피하는 생존 게임", "친구와 겨루는 스포츠 게임", "나만의 가게를 키우는 게임"],
    placeholder: "예: 구름섬에서 잃어버린 별을 찾는 모험 게임",
  },
  {
    label: "주인공",
    icon: "02",
    question: "누가 주인공이야?",
    helper: "사람, 동물, 로봇, 슬라임도 좋아. 이름과 특별한 점을 알려 줘.",
    choices: ["용감한 꼬마 탐험가", "고장 난 로봇 친구", "마법을 쓰는 고양이", "엄청 빠른 젤리 슬라임"],
    placeholder: "예: 바람을 타고 날 수 있는 여우 탐험가 루미",
  },
  {
    label: "게임 세계",
    icon: "03",
    question: "게임 속 세상은 어디야?",
    helper: "장소를 자세히 말할수록 게임의 분위기가 멋져져.",
    choices: ["구름 위에 떠 있는 섬", "깊고 신비로운 바다", "미래의 로봇 도시", "간식으로 만든 왕국"],
    placeholder: "예: 밤이 되면 길이 바뀌는 빛나는 버섯 숲",
  },
  {
    label: "목표",
    icon: "04",
    question: "플레이어는 무엇을 하면 이겨?",
    helper: "보물 찾기, 친구 구하기, 점수 모으기처럼 분명한 목표를 골라 봐.",
    choices: ["흩어진 별 10개를 모은다", "갇힌 친구를 구한다", "최고 점수를 기록한다", "마을을 멋지게 완성한다"],
    placeholder: "예: 3개의 열쇠를 찾아 얼음성의 문을 연다",
  },
  {
    label: "조작 방법",
    icon: "05",
    question: "어떻게 움직이고 행동할까?",
    helper: "처음 만든 게임은 조작을 단순하게 할수록 만들기 쉬워.",
    choices: ["방향키로 이동하고 스페이스바로 점프", "마우스로 눌러서 이동", "화살표 키로 피하기", "버튼을 빠르게 눌러 행동"],
    placeholder: "예: 방향키로 이동, Z키로 마법 구슬 발사",
  },
  {
    label: "재미 장치",
    icon: "06",
    question: "가장 신나는 행동은 뭐야?",
    helper: "게임을 하면서 ‘와!’ 하고 싶은 순간을 하나 골라 봐.",
    choices: ["높이 점프해서 숨은 길 찾기", "특별 아이템으로 변신", "콤보를 이어 점수 올리기", "친구 캐릭터를 모으기"],
    placeholder: "예: 별을 3개 먹으면 5초 동안 하늘을 난다",
  },
  {
    label: "장애물과 적",
    icon: "07",
    question: "무엇이 길을 막을까?",
    helper: "무섭기보다 재미있는 장애물을 상상해 봐. 이기면 성취감이 생겨.",
    choices: ["통통 튀는 장난감 괴물", "움직이는 발판과 구멍", "시간 안에 풀어야 하는 퍼즐", "바람에 날아오는 낙엽"],
    placeholder: "예: 가까이 가면 재채기 바람을 뿜는 구름 괴물",
  },
  {
    label: "레벨 구성",
    icon: "08",
    question: "처음에는 몇 단계로 시작할까?",
    helper: "작게 시작하고 재미있으면 나중에 늘리면 돼.",
    choices: ["연습 1개 + 모험 2개", "짧은 스테이지 3개", "끝없이 이어지는 점수 게임", "첫 번째 보스까지 1개 맵"],
    placeholder: "예: 쉬운 숲길, 바람 동굴, 마지막 별빛 성 3단계",
  },
  {
    label: "그림과 소리",
    icon: "09",
    question: "어떤 분위기로 꾸밀까?",
    helper: "색, 그림 느낌, 효과음을 떠올려 봐. 좋아하는 느낌을 말해도 좋아.",
    choices: ["알록달록한 픽셀 아트", "포근한 손그림 느낌", "반짝이는 우주 분위기", "귀여운 만화책 스타일"],
    placeholder: "예: 파란 밤하늘과 연두색 별빛, 통통 튀는 효과음",
  },
  {
    label: "유튜브 아이디어",
    icon: "10",
    question: "게임 유튜브 영상은 어떻게 소개할까?",
    helper: "게임을 만든 뒤 친구들이 보고 싶어질 제목이나 도전 장면을 생각해 봐.",
    choices: ["첫 스테이지 도전 영상", "보스 깨기 챌린지", "숨은 아이템 찾기", "게임 만드는 과정 공개"],
    placeholder: "예: 내가 만든 구름섬 게임, 별 10개를 모두 찾을 수 있을까?",
  },
];

const workshopCheers = [
  "첫 번째 조각을 찾았어. 네 게임의 간판을 정해 보자!",
  "좋아! 이제 네 게임을 기억하게 할 주인공을 만들어 보자.",
  "주인공이 갈 무대도 필요해. 눈앞에 그려지게 말해 봐.",
  "멋져. 이제 플레이어가 이루고 싶은 목표를 꽂아 보자.",
  "게임은 손으로 놀아야 재미있어. 간단하고 분명하게 골라 보자.",
  "‘와!’ 하는 순간이 생겼어. 네 게임만의 비밀 장치를 넣어 보자.",
  "난관이 있어야 더 짜릿해. 재미있는 방해꾼을 만들어 보자.",
  "이제 첫 번째 게임판을 조립할 차례야. 작게 시작해도 좋아.",
  "거의 다 왔어. 네 게임을 보면 바로 느껴질 분위기를 골라 보자.",
  "마지막 조각이야! 다른 사람에게 게임을 소개할 장면을 상상해 보자.",
];

function buildPrompt(answers: string[]) {
  const [concept, hero, world, goal, controls, coreFun, obstacle, stages, style, youtube] = answers;

  return `너는 초등학생과 함께 게임을 만드는 친절한 웹게임 개발 선생님이야.

아래 기획으로 브라우저에서 바로 실행되는 작은 게임을 만들어 줘.

## 게임 기획
- 게임 한 줄 소개: ${concept}
- 주인공: ${hero}
- 게임 세계: ${world}
- 승리 목표: ${goal}
- 조작: ${controls}
- 가장 신나는 행동: ${coreFun}
- 장애물 또는 적: ${obstacle}
- 첫 버전의 단계 구성: ${stages}
- 그림·소리 분위기: ${style}

## 꼭 지켜 줄 것
1. HTML, CSS, JavaScript가 모두 들어 있는 **index.html 한 파일**로 완성해 줘. 복사해서 저장하면 바로 실행되어야 해.
2. 외부 이미지·로그인·유료 서비스·서버는 쓰지 말고, 도형·CSS·이모지 또는 간단한 Canvas로 그림을 만들어 줘.
3. 초등학교 4학년이 이해할 수 있는 쉬운 말과 코드 주석을 사용해 줘.
4. 시작 화면, 조작 안내, 점수 또는 진행 표시, 성공·실패 화면, 다시 시작 버튼을 넣어 줘.
5. 모바일 화면에서도 버튼을 누를 수 있게 화면 아래에 간단한 터치 조작 버튼을 추가해 줘.
6. 코드를 내기 전에 ‘만들 게임’과 ‘조작 방법’을 5줄 안으로 먼저 설명해 줘.
7. 코드를 한 번에 너무 복잡하게 만들지 말고, 첫 번째로 플레이 가능한 버전을 완성해 줘.

## 유튜브 연결 아이디어
이 게임을 소개하는 유튜브 영상 아이디어는 다음이야: ${youtube}
게임을 만든 뒤 쓸 수 있는 **짧은 영상 제목 3개**, **썸네일에 넣을 말 3개**, 그리고 **30초 영상 대본**도 코드 다음에 덧붙여 줘.

이제 게임 설명부터 시작하고, 그 다음 완성된 index.html 코드를 코드 블록 하나에 전부 보여 줘.`;
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [customAnswer, setCustomAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const question = questions[step];
  const answer = answers[step];
  const progress = Math.round(((showResult ? questions.length : step) / questions.length) * 100);
  const prompt = useMemo(() => buildPrompt(answers), [answers]);

  const setAnswer = (value: string) => {
    setAnswers((previous) => previous.map((item, index) => (index === step ? value : item)));
    setCustomAnswer("");
  };

  const next = () => {
    const current = customAnswer.trim() || answer.trim();
    if (!current) {
      toast("먼저 답을 하나 골라 주거나 직접 적어 봐.");
      return;
    }
    if (customAnswer.trim()) setAnswer(customAnswer.trim());
    if (step === questions.length - 1) {
      setShowResult(true);
      return;
    }
    setStep((currentStep) => currentStep + 1);
  };

  const previous = () => {
    if (showResult) {
      setShowResult(false);
      setStep(questions.length - 1);
      return;
    }
    if (step > 0) setStep((currentStep) => currentStep - 1);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast("프롬프트를 복사했어. 이제 ChatGPT에 붙여 넣어 봐!");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast("복사에 실패했어. 프롬프트를 직접 선택해서 복사해 줘.");
    }
  };

  const downloadPrompt = () => {
    const blob = new Blob([prompt], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-vibe-coding-game-prompt.md";
    link.click();
    URL.revokeObjectURL(url);
    toast("프롬프트 파일을 저장했어.");
  };

  const reset = () => {
    setStep(0);
    setAnswers(Array(questions.length).fill(""));
    setCustomAnswer("");
    setShowResult(false);
    setCopied(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pixel-workshop min-h-screen overflow-x-hidden bg-[#fbf4df] text-[#101b3d]">
      <div className="pixel-grid" aria-hidden="true" />
      <header className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a className="brand-mark" href="#top" aria-label="바이브 코딩 프롬프트 메이커 처음으로">
          <img src="/manus-storage/pixel-quest-logo_0164f001.png" alt="" className="brand-logo" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          <span>
            <strong className="wordmark-custom">게임 주문서 공방</strong>
            <small>PIXEL QUEST · VIBE CODING</small>
          </span>
        </a>
        <div className="hidden items-center gap-2 text-sm font-bold text-[#435071] sm:flex">
          <Sparkles size={16} className="text-[#f05a4f]" />
          오늘의 미션: 나만의 게임 만들기
        </div>
      </header>

      <main id="top" className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-12 sm:px-8 lg:px-12">
        {!showResult ? (
          <div className="workshop-layout">
            <aside className="quest-rail" aria-label="10단계 진행 목록">
              <div className="rail-heading">
                <span className="status-dot" />
                <span>QUEST LOG</span>
              </div>
              <p>10개의 조각을 모아<br />게임 주문서를 완성해.</p>
              <ol>
                {questions.map((item, index) => {
                  const isActive = index === step;
                  const isDone = Boolean(answers[index]);
                  return (
                    <li key={item.label} className={isActive ? "active" : isDone ? "done" : ""}>
                      <span className="rail-number">{isDone ? <Check size={14} strokeWidth={3} /> : item.icon}</span>
                      <span className="rail-text">{item.label}</span>
                    </li>
                  );
                })}
              </ol>
              <div className="rail-tip">
                <Lightbulb size={18} />
                <span>답은 언제든<br />다시 바꿀 수 있어.</span>
              </div>
            </aside>

            <section className="quest-panel" aria-live="polite">
              <div className="mobile-progress">
                <span>QUEST {String(step + 1).padStart(2, "0")} / 10</span>
                <div><i style={{ width: `${progress}%` }} /></div>
              </div>

              <div className="hero-strip">
                <div>
                  <span className="eyebrow"><Zap size={15} fill="currentColor" /> GAME IDEA FORGE</span>
                  <h1>말로 만든 상상이<br /><em>진짜 게임</em>이 돼.</h1>
                  <p>질문에 답하면 ChatGPT에 바로 붙여 넣을 게임 제작 프롬프트가 완성돼.</p>
                </div>
                <div className="hero-illustration" aria-hidden="true">
                  <img src="/manus-storage/pixel-quest-hero_ceb0ab91.png" alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                  <div className="workbench-kit"><i /><i /><i /></div>
                  <span className="float-chip chip-one">IDEA +1</span>
                  <span className="float-chip chip-two">MAKE!</span>
                </div>
              </div>

              <div className="question-card">
                <div className="cartridge-label">
                  <span>CARTRIDGE {question.icon}</span>
                  <span>{question.label}</span>
                </div>
                <div className="cartridge-slots" aria-label={`아이디어 조각 ${step + 1}번을 조립 중입니다`}>
                  {questions.map((item, index) => <i key={item.label} className={index < step ? "filled" : index === step ? "loading" : ""} />)}
                </div>
                <div className="question-intro">
                  <span className="question-count">{question.icon}</span>
                  <div>
                    <p className="question-kicker">이번에 정할 것</p>
                    <h2>{question.question}</h2>
                    <p>{question.helper}</p>
                    <p className="workshop-cheer"><Sparkles size={14} /> {workshopCheers[step]}</p>
                  </div>
                </div>

                <div className="answer-grid">
                  {question.choices.map((choice, index) => (
                    <button
                      type="button"
                      key={choice}
                      onClick={() => setAnswer(choice)}
                      className={`answer-choice ${answer === choice && !customAnswer ? "selected" : ""}`}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {choice}
                      {answer === choice && !customAnswer && <Check size={18} strokeWidth={3} />}
                    </button>
                  ))}
                </div>

                <label className="custom-answer">
                  <span>또는 네가 직접 적기</span>
                  <textarea
                    value={customAnswer}
                    onChange={(event) => setCustomAnswer(event.target.value)}
                    placeholder={question.placeholder}
                    rows={2}
                    maxLength={160}
                  />
                  <small>{customAnswer.length}/160</small>
                </label>

                <div className="card-footer">
                  <button type="button" onClick={previous} className="nav-button back" disabled={step === 0}>
                    <ArrowLeft size={18} /> 이전
                  </button>
                  <p><b>{step + 1}</b> / 10 조각 모으는 중</p>
                  <button type="button" onClick={next} className="nav-button next">
                    {step === questions.length - 1 ? "주문서 완성" : "다음 조각"}
                    {step === questions.length - 1 ? <Wand2 size={18} /> : <ArrowRight size={18} />}
                  </button>
                </div>
              </div>

              <div className="mini-note">
                <HelpCircle size={17} />
                <span><b>바이브 코딩이란?</b> 만들고 싶은 것을 말로 설명하고, AI와 함께 한 단계씩 코드를 만드는 방법이야.</span>
              </div>
            </section>
          </div>
        ) : (
          <section className="result-layout" aria-live="polite">
            <div className="result-headline">
              <div className="result-badge"><Gamepad2 size={26} /> QUEST COMPLETE</div>
              <h1>게임 제작 <em>주문서</em>가<br />완성됐어!</h1>
              <p>아래 내용을 통째로 복사해서 ChatGPT에 붙여 넣어 봐. 코드를 받은 뒤에는 한 번에 한 가지씩 고치면 더 재미있어.</p>
              <div className="result-actions top-actions">
                <button type="button" onClick={copyPrompt} className="copy-button">
                  {copied ? <Check size={20} /> : <Clipboard size={20} />}
                  {copied ? "복사 완료!" : "프롬프트 복사"}
                </button>
                <button type="button" onClick={downloadPrompt} className="secondary-action"><Download size={18} /> 파일 저장</button>
              </div>
              <div className="youtube-tip">
                <Youtube size={21} />
                <span><b>게임 유튜브 팁</b> 코드를 완성하고 첫 플레이 장면을 녹화해 보자. 결과 화면의 ‘유튜브 연결 아이디어’도 ChatGPT가 도와줄 거야.</span>
              </div>
            </div>

            <div className="prompt-scroll">
              <div className="prompt-toolbar">
                <span><Code2 size={17} /> CHATGPT PROMPT.md</span>
                <button type="button" onClick={copyPrompt}>{copied ? "COPIED" : "COPY"}</button>
              </div>
              <pre>{prompt}</pre>
            </div>

            <div className="next-steps">
              <p className="eyebrow"><Sparkles size={15} fill="currentColor" /> 다음은 이렇게 해 봐</p>
              <div>
                <article><b>01</b><span>프롬프트를<br />ChatGPT에 붙여 넣기</span></article>
                <article><b>02</b><span>받은 코드를<br />index.html로 저장하기</span></article>
                <article><b>03</b><span>게임을 하고<br />한 가지씩 바꾸기</span></article>
              </div>
              <button type="button" onClick={reset} className="restart-button"><RotateCcw size={18} /> 새 게임 아이디어 만들기</button>
            </div>
          </section>
        )}
      </main>
      <footer className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 text-xs font-bold tracking-wide text-[#68728c] sm:px-8 lg:px-12">
        <span>PIXEL QUEST WORKSHOP · MAKE SMALL, PLAY OFTEN</span>
        <span>FOR YOUNG GAME CREATORS</span>
      </footer>
    </div>
  );
}
