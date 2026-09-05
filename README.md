# GitHub Repository Search

[![CI](https://github.com/okusawa/github-repository-search/actions/workflows/ci.yml/badge.svg)](https://github.com/okusawa/github-repository-search/actions/workflows/ci.yml)

GitHub の公開リポジトリをキーワード検索し、一覧と詳細ページで結果を表示する Web アプリケーションです。Next.js 16 App Router と React Server Components で、GitHub REST API をサーバー側から直接呼び出します。検索キーワード・ページ・ソート順は URL のクエリに保持し、リロードや共有でも状態が失われません。

| 検索と一覧 | リポジトリ詳細 |
|---|---|
| ![検索結果一覧](docs/screenshot-search.png) | ![リポジトリ詳細](docs/screenshot-detail.png) |

## 課題要件との対応

| # | 要件 | 実装 |
|---|------|------|
| E1 | Next.js v16 以降 | `next@16.3.4` |
| E2 | App Router を使用 | `src/app/` のみ。`pages/` は無し |
| E3 | コンポーネントライブラリは任意 | 使用せず。Tailwind CSS のみ（理由は「技術選定」） |
| R1 | キーワードを入力 | 検索フォーム。入力は URL の `?q=` に反映 |
| R2 | `search/repositories` で検索し一覧表示 | Server Component から直接呼び出し |
| R3 | 詳細に7項目を表示 | リポジトリ名 / オーナーアイコン / 言語 / **Star 数** / **Watcher 数** / **Fork 数** / **Issue 数** |
| R4 | 詳細はモーダルではなくページ | `/repositories/[owner]/[repo]`。直リンク・リロードで成立 |
| R5 | テストコードを記述 | Vitest 9 件（ユニット・データ層・コンポーネント）、Playwright 2 件（E2E） |

## 起動方法

### 前提

- Node.js **22**（`.nvmrc` 参照）
- npm

### ネイティブ（開発）

```bash
nvm use
npm ci
cp .env.example .env.local   # 任意。トークン未設定でも起動できます
npm run dev
```

http://localhost:3000 を開きます。

`GITHUB_TOKEN` は **任意** です。未設定の場合は `Authorization` ヘッダを付けずに GitHub API を呼び出します（Search API は **10 req/min**、Core API は **60 req/hour**）。トークンを設定すると Search API は **30 req/min**、Core API は **5,000 req/hour** まで利用できます。

### Docker（本番想定）

```bash
docker build -t github-repository-search .
docker run -p 3000:3000 github-repository-search
```

`.env.local` が無くても上記 2 行で起動できます。`GITHUB_TOKEN` を使う場合だけ `--env-file .env.local` を付けてください。

`docker-compose.yml` は含めていません。compose が価値を持つのはソースを bind mount して開発コンテナで HMR を回す場合ですが、今回やりたいのは Node を入れていない人が本番イメージですぐ動かせることであり、`docker build` と `docker run` の 2 コマンドで満たせます。bind mount を持たないため、macOS でコンテナ内 dev サーバーを動かしたときのファイル監視の遅さもそもそも回避できます。デプロイ像を伝えているのは `output: 'standalone'` を使ったマルチステージ Dockerfile です。

### その他のコマンド

| コマンド | 内容 |
|----------|------|
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript（`tsc --noEmit`） |
| `npm run test` | Vitest（ユニット・コンポーネント） |
| `npm run build` / `npm run start` | 本番ビルドと起動 |
| `npm run test:e2e` | Playwright E2E（2本。**CI には含めません**） |

E2E をローカルで実行する場合は、初回のみ `npx playwright install` が必要です。

## 技術選定

| 技術 | 選定理由 |
|------|----------|
| **Next.js 16（App Router）** | 課題要件。`searchParams` を Server Component で受け取り、検索状態を URL ベースで扱える |
| **React Server Components** | GitHub トークンと API 呼び出しをサーバー境界内に閉じる |
| **TypeScript（strict）** | 型安全。外部 API レスポンスは zod で実行時検証 |
| **Tailwind CSS** | 追加 UI ライブラリなしで最低限のレイアウトとスタイルを実装 |
| **zod** | URL クエリと GitHub API レスポンスの検証 |
| **Vitest + MSW** | データ層と純粋ロジックのテスト。GitHub API は MSW でモック |
| **Testing Library** | Client Component の検索フォームと、`<Link>` ベースのページネーションを UI テスト |
| **Playwright** | 検索→詳細の通しとレート制限表示の E2E（2本） |

## 設計上の判断と、なぜそう選んだか

### Watcher 数は `subscribers_count` を使う（一覧ではなく詳細 API で取得）

GitHub REST API では `watchers` / `watchers_count` / `stargazers_count` はいずれも **Star 数** を指します。課題が求める Watcher 数は `GET /repos/{owner}/{repo}` の **`subscribers_count`** のみに存在し、`search/repositories` の結果には含まれません。

> In responses from the REST API, `watchers`, `watchers_count`, and `stargazers_count` correspond to the number of users that have starred a repository, whereas `subscribers_count` corresponds to the number of watchers.
> — https://docs.github.com/en/rest/activity/starring

そのため詳細ページでは一覧のデータを引き回さず、改めて単一リポジトリ API を呼び出しています。直リンクやリロードでも詳細が成立します。

### Issue 数は `search/issues` の `total_count` を使い、Suspense で分離

`open_issues_count` は Pull Request を含むため、GitHub Web UI の Issues タブと一致しません。Issue 数は `GET /search/issues?q=repo:{owner}/{repo} type:issue state:open` の `total_count` を使い、クエリは **スペース区切り**（`URLSearchParams` に `+` 連結文字列を渡すと `%2B` になり 422 になるため）。

Issue 数の取得は `<Suspense>` 内の `IssueCount` に分離しています。ここだけ失敗しても詳細の他項目（言語・Stars・Watchers・Forks）は表示され、Issue 欄は「Could not retrieve」になります。

### サーバー境界・トークン・Route Handler を作らない

**ディレクトリ構成（主要部分）**

```
src/
├── app/              # ページ・loading / error / not-found
├── components/       # UI（Client は search-form / retry-button / error のみ）
└── lib/              # GitHub API クライアント、zod スキーマ、ユーティリティ
e2e/                  # Playwright E2E と GitHub API モックサーバー
```

**Client Component は次の 4 つだけ**

| ファイル | 理由 |
|----------|------|
| `search-form.tsx` | `onSubmit` で URL を組み立てて `router.push` するため |
| `retry-button.tsx` | `router.refresh()` を呼ぶため |
| `app/error.tsx` | Next.js の error boundary は Client Component である必要があるため |
| `app/repositories/[owner]/[repo]/error.tsx` | 同上 |

**`pagination.tsx` は Client Component にしていない。** ページ送りは `<Link>` だけで表現でき、`onClick` が不要なため。JS 実行前でもリンクとして機能する。

- `GITHUB_TOKEN` はサーバー環境変数のみ。`NEXT_PUBLIC_` は使いません
- API 呼び出しは Server Component と `'use cache'` 付き関数からのみ
- **`app/api/**` は作っていません**。検索状態は URL にあるため、ナビゲーションのたびに Server Component がデータ取得すれば足り、自前 API を挟む必要がありません

### 検索状態を URL の `searchParams` に持つ

`/?q=next.js&page=2&sort=stars` の形式です。`useState` には持ちません。ページネーションは `<Link>` によるサーバー側レンダリングです。

### エラーの分類

| 種別 | 判定条件 | ユーザーに見せるもの |
|------|----------|--------------------|
| `rate_limit` | 403 / 429 **かつ** `x-ratelimit-remaining: 0` | 「Rate limit reached. Please try again in N minutes.」（`x-ratelimit-reset` から算出） |
| `not_found` | 404 | 詳細ページでは `notFound()` を呼び `not-found.tsx` を表示 |
| `invalid_query` | 422 | 検索条件が不正である旨と、再試行ボタン |
| `upstream` | 5xx およびその他の 4xx | GitHub 側の問題である旨と再試行 |
| `network` | `fetch` 自体が throw | 接続できなかった旨と再試行 |

403 は権限エラーでも返るため、status だけではレート制限と区別できません。`x-ratelimit-remaining` ヘッダを見て判定しています。

レート制限時は `x-ratelimit-reset` から相対時刻（「in 15 minutes」）を表示します。

`'use cache'` 内で `GitHubApiError` を throw すると error boundary に落ちるため、`searchRepositories` と `getRepository` は API エラーを throw せず、`kind` / `message` / `resetAt` のプレーンオブジェクトとして返します。検索結果は `ErrorMessage` でインライン表示します。詳細ページでは 404 を `isNotFoundError` で判定して `notFound()` を呼び、それ以外の API エラー（レート制限など）は `ErrorMessage` を表示します。

### キャッシュ（Cache Components）

`next.config.ts` で `cacheComponents: true` を有効にし、GitHub API を叩く関数（`searchRepositories` / `getRepository` / `getOpenIssueCount`）に `'use cache'` と `cacheLife('minutes')` を付けています。検索結果は `<Suspense>` で包み、一覧部分だけストリーミングします。

## テスト戦略

| 層 | ツール | 対象 |
|----|--------|------|
| ユニット | Vitest | エラー分類、`searchParams` パース |
| データ層 | Vitest + MSW | `searchRepositories` の正常パース・zod による形状検証 |
| コンポーネント | Vitest + Testing Library | 検索フォーム（Client Component）、ページネーション（`<Link>` ベース） |
| E2E | Playwright | 検索→詳細の通し、レート制限メッセージ（**2本**） |

Server Component は Testing Library でレンダリングしていません。async な Server Component を RTL で直接描画すると実態と乖離しやすいため、**振る舞いは E2E で担保**し、ロジックは純関数・データ層のユニットテストで守っています。

E2E は GitHub API の代わりにローカルモックサーバー（`e2e/github-mock-server.mjs`）を `GITHUB_API_BASE` で向けます。**GitHub Actions の CI には E2E を含めていません**（Playwright のブラウザセットアップで CI 時間が伸びる割に、今回の 2 本で得るものが少ないため）。

## AI の利用方法

本課題では AI を隠さず、次の分担で進めました。

| 役割 | 内容 |
|------|------|
| **設計判断（人間）** | 仕様書（設計方針）を先に固め、そこに書かれていない判断を実装側にさせない運用 |
| **調査（AI + 人間）** | `watchers_count` と `subscribers_count` の違い、`open_issues_count` が PR を含むこと、Next.js 16 Cache Components など。**一次情報（GitHub / Next.js 公式ドキュメント）で裏取り** |
| **実装（AI）** | 確定した仕様に沿ったコード生成 |
| **レビュー（別セッション / 別モデル）** | 実装と同じ文脈でのレビューを避け、独立したセッションで指摘を反映 |
| **最終確認（人間）** | 生成コードの読み込み、仕様との差分確認、README とコードの一致確認 |

伝えたいのは「AI を使ったか」ではなく、**AI に何を任せ、何を任せなかったか**です。

## 今回スコープ外としたこと

| やらなかったこと | 理由 |
|------------------|------|
| 認証・ログイン | 課題要件にない |
| Sentry / Datadog 等の監視 | 運用フェーズ向け。今回の規模では過剰 |
| リトライ・自前スロットリング | 外部 API 呼び出し前の入力検証で十分と判断 |
| Redis 等の分散キャッシュ | `'use cache'` で足りる |
| i18n | UI 文言は英語に統一（データが英語のため） |
| 無限スクロール・検索履歴・お気に入り | URL ベースのページネーションで要件を満たす |
| E2E の網羅・ビジュアルリグレッション | 2 本に絞り、CI でも実行しない |
| `docker-compose.yml` | compose の主用途は bind mount による開発コンテナ。今回は本番イメージの build/run で足り、単一サービスの compose が上乗せする情報はほとんどない |
| `app/api/**` | Server Component から直接 fetch で足りる |
| 検索フォームの JS 無し送信（`<form method="get">`） | 課題要件外。Client Component で URL 遷移 |
| IaC / 実際のデプロイ | 提出はリポジトリのみ |

## 既知の制約

| 制約 | 内容 |
|------|------|
| 検索結果の上限 | GitHub Search API が先頭 1,000 件までしか返さないため、最大 50 ページ。総件数はそれより多く表示される |
| キャッシュの範囲 | `'use cache'` はインスタンス内で完結する。複数インスタンスで動かす場合は共有されない |
| リトライ | レート制限や 5xx で自動リトライしない。復帰時刻を表示してユーザーの再試行に委ねる |
| Issue 数 | Search API の別枠（未認証 10 req/min）を使うため、ここだけ先に枯れることがある。その場合は詳細の他項目は表示され、Issue 欄のみ取得失敗を示す |

## 仮定した事項

課題文に明記のない点は次のとおり解釈しました。

| 項目 | 解釈 |
|------|------|
| デプロイ済み URL | 必須ではない（README の手順でローカル起動可能） |
| 認証 | 不要 |
| ソート・フィルタ | ソート（best-match / stars / updated）のみ実装 |
| UI 言語 | 英語（リポジトリデータに合わせる） |
| ページネーション | 実装（GitHub Search API の 1,000 件上限に合わせ最大 50 ページ） |
