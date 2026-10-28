# 우리의 기록

웹서비스설계 JWT 게시판 과제입니다.

## 작성자와 서비스 소개

- 학번 / 이름: 202412941 / 박주연
- 서비스 목적과 대상 사용자: '우리의 기록'은 사용자들이 자유롭게 게시글을 작성하고 공유할 수 있는 웹 게시판입니다. 누구나 게시글 목록과 상세 내용을 조회할 수 있지만, 게시글 작성은 로그인한 사용자만 가능합니다. 수정과 삭제는 해당 게시글을 작성한 사용자에게만 허용됩니다. 이를 통해 JWT 기반 사용자 인증과 작성자 권한 검사가 적용된 게시판을 구현했습니다.
- 선택한 기술: Vue + Express
- 주요 기능: 게시글 목록 및 상세 조회, JWT 로그인, 내 정보 조회, 게시글 작성·수정·삭제, 작성자 권한 검사, 토큰 만료 및 로그아웃 처리, SQLite 데이터 유지

## 보고서와 테스트 증거

- [구현 보고서 PDF](docs/report.pdf)
- [테스트 증거](docs/evidence/)
- [증거별 설명](docs/evidence/%EC%A6%9D%EA%B1%B0_%EC%84%A4%EB%AA%85.txt)

보고서는 `docs/report.pdf`에 저장하며, 로그인과 JWT 인증, 작성자 권한 검사, 오류 응답, 자동 검사 결과, 로컬 실행 화면의 증거 이미지는 `docs/evidence/` 폴더에 정리합니다.

## 프로젝트 구조

```text
.
├── README.md
├── .gitignore
├── frontend-vue/
│   ├── src/
│   │   ├── App.vue
│   │   ├── api.js
│   │   ├── main.js
│   │   └── style.css
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── backend-express/
│   ├── src/
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── store.js
│   │   └── errors.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
├── tools/
│   └── check_api.py
└── docs/
    ├── report.pdf
    └── evidence/
```

실제 제출 폴더는 `frontend-vue`와 `backend-express`를 사용합니다. 선택하지 않은 React, FastAPI, Spring Boot 템플릿은 제출 대상에서 제외합니다.

## 실행 환경

| 항목 | 사용 버전 |
| --- | --- |
| 운영체제 | macOS |
| 프론트 런타임 Node.js | Node.js v24.21.0, npm 11.19.0 |
| 백엔드 런타임 | Node.js v24.21.0 |
| 프레임워크 | Vue 3.5.43, Express 5.3.0, Vite 8.3.4 |
| 데이터 저장 | SQLite (sql.js 1.14.2) |

## 설치와 실행

GitHub 저장소를 복제한 뒤 백엔드와 프론트엔드를 각각 실행합니다. Node.js 20.19.0 이상이 필요하며, 의존성 설치에는 인터넷 연결이 필요합니다.

### 1 저장소 복제

```sh
git clone https://github.com/qkrzoo8/jwt-board-vue-express.git
cd jwt-board-vue-express
```

### 2 백엔드 준비와 실행

저장소 루트에서 백엔드 폴더로 이동하여 의존성을 설치합니다.

```sh
cd backend-express
npm ci
cp .env.example .env
```

`.env` 파일의 `JWT_SECRET`에 안전한 임의 값을 설정합니다. 아래 명령어로 64자리 16진수 비밀 키를 생성할 수 있습니다.

```sh
node -p "require('node:crypto').randomBytes(32).toString('hex')"
```

생성된 값을 `.env`의 `JWT_SECRET=` 뒤에 입력합니다. 실제 비밀 키와 `.env` 파일은 GitHub에 업로드하지 않습니다.

환경설정을 완료한 뒤 백엔드를 실행합니다.

```sh
npm start
```

- 환경설정 예시 파일: `backend-express/.env.example`
- JWT_SECRET 설정 방법: 32바이트 난수를 생성하여 `.env`에 설정
- TOKEN_TTL: 기본값 90초, 만료 테스트 시 `TOKEN_TTL=3 npm start` 사용
- 백엔드 주소: <http://127.0.0.1:8000>
- 정상 실행 확인 방법: <http://127.0.0.1:8000/api/health> 접속 후 HTTP 200과 `{"status":"ok","stack":"express"}` 확인

### 3 프론트 빌드와 로컬 실행

백엔드를 켜 두고 새 터미널에서 저장소의 `frontend-vue` 폴더로 이동합니다.

```sh
cd frontend-vue
npm ci
npm run build
npm run preview
```

- 최종 확인 주소: <http://127.0.0.1:4173>
- 개발 중 실행: `npm run dev`, <http://127.0.0.1:5173>
- API 연결 방식과 포트 변경 방법: Vite의 프록시 설정을 이용해 프론트엔드의 `/api` 요청을 8000번 포트의 Express 백엔드로 전달합니다. 포트를 변경할 경우 `frontend-vue/vite.config.js`의 `proxy` 주소를 수정해야 합니다.
- 종료: 프론트와 백엔드를 실행한 각 터미널에서 Ctrl+C
- 코드 변경 후 재실행: 프론트엔드 코드 변경 시 `npm run build`를 다시 실행하고, 백엔드 코드 변경 시 서버를 종료한 후 `npm start`로 재시작합니다.

### 4 테스트 계정과 DB

| 사용자 | 이메일 | 실습용 비밀번호 |
| --- | --- | --- |
| Alice | <alice@class.test> | Classroom!2026 |
| Bob | <bob@class.test> | Classroom!2026 |

- SQLite 파일 위치와 자동 생성 방식: `backend-express/data/board.sqlite`에 저장되며, 백엔드 서버 실행 시 자동 생성됩니다.
- DB 초기화 방법: 백엔드 서버를 종료하고 `backend-express/data/board.sqlite` 파일을 삭제한 뒤 서버를 다시 실행합니다. 기존 게시글 데이터는 삭제됩니다.
- 서버 재시작 후 데이터 유지 확인 결과: Express 서버를 종료하고 재시작한 뒤에도 기존에 작성한 게시글이 유지되는 것을 확인했습니다.

위 계정은 과제 전용 테스트 계정입니다. 실제 서비스 계정 정보나 서버 비밀 키를 기록하지 않습니다.

## 구현 완료 범위

| 기능 | 완료 여부 | 주요 파일 또는 함수 |
| --- | --- | --- |
| 공개 목록과 상세 | 완료 | `frontend-vue/src/App.vue`, `backend-express/src/app.js` |
| 로그인과 JWT 발급 | 완료 | `backend-express/src/auth.js` — `issueToken()` |
| JWT 검증과 내 정보 조회 | 완료 | `backend-express/src/auth.js` — `currentUserId()` |
| 글 작성과 작성자 저장 | 완료 | `backend-express/src/app.js`, `frontend-vue/src/api.js` |
| 본인 글 수정·삭제 | 완료 | `backend-express/src/auth.js` — `assertOwner()` |
| 토큰 만료와 로그아웃 | 완료 | `frontend-vue/src/api.js`, `frontend-vue/src/App.vue` |
| 입력 오류와 권한 오류 처리 | 완료 | `backend-express/src/app.js`, `backend-express/src/auth.js`, `frontend-vue/src/api.js` |

알려진 문제와 미완성 기능: 필수 구현 범위에서 확인된 미완성 기능은 없습니다.

## 테스트 방법과 결과 요약

- 실행한 검사 명령과 실행 위치: 백엔드 서버를 실행한 상태에서 프로젝트 루트의 터미널에서 `python3 tools/check_api.py --mode final`을 실행하여 40개 항목을 모두 통과했습니다. 만료 검사 시 `TOKEN_TTL=3 npm start`로 백엔드를 실행한 후 `python3 tools/check_api.py --mode final --expiry`를 실행하여 48개 항목을 모두 통과했습니다.
- Alice/Bob 권한 구분 확인 결과: Alice가 작성한 게시글을 Bob이 수정하거나 삭제하려고 하면 서버가 `403 FORBIDDEN`을 반환했습니다. Alice는 본인이 작성한 게시글을 수정하거나 삭제할 수 있었습니다.
- HTTP 상태와 오류 code 확인: 정상 조회 `200`, 글 작성 `201`, 글 삭제 `204`, 잘못된 입력 `400`, 인증 실패 `401`, 작성자 권한 위반 `403`, 존재하지 않는 게시글 `404`를 검사했습니다. 자세한 결과는 `docs/report.pdf`의 테스트 결과 및 HTTP 증거 부분을 참고합니다.
- 응답 헤더와 본문 확인: 게시글 생성 시 `201 Created`와 `Location` 헤더, 인증 정보가 없는 보호 API 요청 시 `401`과 `WWW-Authenticate: Bearer` 헤더, 게시글 삭제 성공 시 `204 No Content`와 빈 응답 본문을 확인했습니다.
- 토큰 없음·변조·만료 확인 결과: 토큰 누락 시 `401 TOKEN_REQUIRED`, 변조된 토큰 사용 시 `401 INVALID_TOKEN`, 만료된 토큰 사용 시 `401 TOKEN_EXPIRED`가 반환되는 것을 확인했습니다. 토큰 만료 이후 프론트엔드의 로그인 상태가 해제되는 것도 확인했습니다.
- 전체 T01~T17 결과와 증거: `docs/report.pdf`의 테스트 시나리오 표 및 `docs/evidence/` 폴더의 증거 이미지를 참고합니다.

### 새 증거와 보고서 연결

- E09 / T06: Alice 본인 글 수정 `200 OK`, 삭제 `204 No Content` 및 빈 응답 본문.
- E09b / T05: 글 작성 `201 Created`, `Location: /api/posts/8`, 응답의 `authorId: 1`. 내 정보 조회는 E01과 연결합니다.
- E10 / T12: Alice가 `authorId:2`를 추가한 작성 요청은 `400 BAD_INPUT`. Bob의 `authorId:1`·`userId:1` 조건은 E06 자동 검사와 구분합니다.
- E11 / T13·T14: 공백 제목 입력 거부 `400 BAD_INPUT`과 삭제 후 재조회 `404 NOT_FOUND`. 공백 본문·길이 초과의 개별 조건은 E06 및 직접 확인 기록을 참고합니다.
- 증거 이미지는 E01~E11 및 보조 이미지 E01b·E05b·E09b를 포함해 총 14개입니다. 별도 캡처가 없는 직접 확인 결과는 보고서에 구분하여 기록했습니다.

## 핵심 구현 설명

사용자가 Alice 또는 Bob 계정으로 로그인하면 백엔드는 계정 정보를 확인한 뒤 `backend-express/src/auth.js`의 `issueToken()`으로 JWT를 발급합니다.

프론트엔드는 발급된 토큰을 `frontend-vue/src/api.js`의 메모리 상태에 저장하고, 인증이 필요한 API 요청 시 `Authorization: Bearer` 헤더에 포함하여 전송합니다. 로그아웃하거나 인증 실패 응답을 받으면 로그인 상태를 해제합니다. 브라우저를 새로고침하면 메모리의 로그인 정보가 초기화됩니다.

백엔드의 `currentUserId()`는 JWT의 서명, 알고리즘, 만료 시간 및 필수 클레임을 검증하고 실제 사용자 정보와 연결합니다. 이때 검증된 사용자 ID를 다음 처리로 전달하는 부분이 **요청 주체 연결점**입니다.

게시글 수정 또는 삭제 시 `assertOwner()`는 검증된 사용자 ID와 게시글 작성자 ID를 비교합니다. 이 비교는 **권한 경계 대조**에 해당하며, 서로 다르면 `403 FORBIDDEN`을 반환합니다. 프론트엔드에서 수정·삭제 버튼을 숨기는 것과 별개로 서버에서도 권한을 검사합니다.

자세한 코드는 보고서의 핵심 코드 설명 부분에 작성했습니다.

## AI 활용 요약과 참고 자료

- AI 사용 여부: 사용
- 도구와 사용 목적: OpenAI ChatGPT를 활용하여 JWT 발급·검증 구조, Vue 로그인 연동, 작성자 권한 검사, HTTP 오류 처리, 테스트 결과 분석 및 문제 해결 방법을 학습했습니다.
- 반영 위치와 직접 수정·검증한 내용: `backend-express/src/auth.js`의 JWT 발급·검증 및 작성자 권한 검사, `frontend-vue/src/api.js`의 토큰 저장·전송 및 인증 오류 처리, `frontend-vue/src/App.vue`의 로그인 상태별 화면 처리를 구현하고 직접 테스트했습니다. curl, Chrome 개발자 도구 및 자동 검사 도구로 정상·실패 응답을 확인했습니다.
- 상세 활용 기록: `docs/report.pdf`의 'AI 활용과 참고 자료' 부분
- 참고한 수업 자료·외부 코드·공식 문서: 웹서비스설계 과제 공지, `docs/02_API명세.md`, `docs/03_구현체크리스트.md`, `docs/05_테스트시나리오.md`, 교수자가 제공한 Vue·Express 시작 코드

## 제출 확인

- [x] README의 서비스 소개, 기술 조합, 설치·실행 방법과 구현 내용을 작성했다.
- [ ] 새 폴더에 clone하여 README만으로 설치·환경설정·빌드·로컬 실행했다.
- [x] 4173번 빌드 화면에서 API 연결과 주요 필수 기능을 확인했다.
- [x] GitHub에서 보고서와 증거 링크가 열린다.
- [x] 교수자가 저장소를 열람·복제할 수 있도록 Public 저장소로 생성했다.
- [x] 비밀 키·실제 토큰·DB·node_modules·.venv·target이 커밋되지 않았는지 최종 확인했다.
- [ ] 최종 push 후 저장소 URL과 제출 기준 커밋 SHA를 LMS에 제출했다.
