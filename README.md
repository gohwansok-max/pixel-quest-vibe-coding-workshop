# 게임 주문서 공방

초등학생이 **10문 10답**으로 게임 아이디어를 정리하고, ChatGPT에 바로 붙여 넣을 **바이브 코딩 프롬프트**를 만드는 정적 웹 앱입니다.

## 아이와 함께 쓰는 방법

1. 열 가지 질문에서 마음에 드는 답을 고르거나 직접 적습니다.
2. 마지막 질문까지 끝내면 ‘게임 제작 주문서’가 나옵니다.
3. `프롬프트 복사`를 누른 뒤 ChatGPT에 붙여 넣습니다.
4. 받은 `index.html` 코드를 저장해서 브라우저로 열고, 한 번에 한 가지씩 바꾸며 게임을 발전시킵니다.

## 로컬 실행

```bash
pnpm install
pnpm dev
```

## GitHub Pages 배포

`main` 브랜치에 코드를 올리면 `.github/workflows/deploy-pages.yml`이 정적 사이트를 빌드해 Pages에 배포합니다. 저장소의 **Settings → Pages → Build and deployment**에서 소스를 **GitHub Actions**로 설정하면 됩니다.

배포 파일은 `pnpm exec vite build --base=./`로 생성되며, 저장소 하위 경로에서도 작동하도록 상대 경로를 사용합니다.
