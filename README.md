# AI文字数調整くん (text-count)

AIを活用して文章の文字数を「削減」「追加」し、目標文字数に近づけるフルスタックアプリケーションです。

## 目次

- [AI文字数調整くん (text-count)](#ai文字数調整くん-text-count)
  - [目次](#目次)
  - [概要](#概要)
  - [プロジェクト構成](#プロジェクト構成)
  - [動作環境](#動作環境)
  - [セットアップ](#セットアップ)
  - [開発・ビルド](#開発ビルド)
    - [Cloud Functions](#cloud-functions)
    - [フロントエンド](#フロントエンド)
  - [デプロイ](#デプロイ)
    - [シークレット設定 (初回のみ)](#シークレット設定-初回のみ)
    - [デプロイ実行](#デプロイ実行)

## 概要

- **AI文字数調整**: Vertex AI(Gemini)経由で元の文章を最大5回までループしながら目標文字数に近づけます。
- **問い合わせフォーム**: ユーザーからの問い合わせをFirestoreに保存し、管理者のLINEチャネルへ通知します。
- **フロントエンド**: React + Vite + TypeScript + TailwindCSS
- **バックエンド**: Firebase Cloud Functions (GenKit + Vertex AI + Firestore + LINE通知)

## プロジェクト構成

```
.
├── functions      # Firebase Cloud Functions のソースコード
├── web            # フロントエンド (React/Vite) のソースコード
├── tsconfig.json  # モノレポ型 tsconfig（functions/web を参照）
├── firebase.json  # Firebase Hosting / Functions の設定
└── .firebaserc    # Firebase プロジェクト設定
```

## 動作環境

- Node.js >= 16
- npm
- Firebase CLI (`npm install -g firebase-tools`)

## セットアップ

```bash
# リポジトリをクローン
git clone <リポジトリURL>
cd text-count

# Firebase CLI にログイン＆プロジェクト選択
firebase login
firebase use --add

# Cloud Functions 側の依存パッケージをインストール
cd functions
npm install

# フロントエンド側の依存パッケージをインストール
cd ../web
npm install
```

## 開発・ビルド

### Cloud Functions

```bash
# Lint
npm run lint

# ビルド (TypeScript → JavaScript)
npm run build

# エミュレータ起動
npm run serve
```

### フロントエンド

```bash
# 開発サーバ起動 (HMR)
npm run dev

# Lint
npm run lint

# 本番ビルド
npm run build

# プレビュー (ビルド成果物をローカルサーバで確認)
npm run preview
```

## デプロイ

### シークレット設定 (初回のみ)

```bash
firebase functions:secrets:set LINE_CHANNEL_ACCESS_TOKEN "<YOUR_LINE_Channel_Access_Token>"
```

### デプロイ実行

```bash
# プロジェクトルートから実行
firebase deploy
```

- Functions は事前に `npm --prefix functions run lint && npm --prefix functions run build` を実行します。
- Hosting は `web/dist` を公開し、全てのルートを `index.html` にリライトします。
