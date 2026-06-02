# データベース設計書

## 概要

データベースは **SQLite** を使用し、**Drizzle ORM** で管理する。
Better-auth が管理する認証系テーブルと、アプリケーション固有のテーブルで構成される。

---

## テーブル一覧

| テーブル名 | 区分 | 説明 |
|-----------|------|------|
| `user` | 認証系 | ユーザー情報 |
| `session` | 認証系 | セッション情報 |
| `account` | 認証系 | 認証アカウント（パスワードなど） |
| `verification` | 認証系 | メール検証コード |
| `laureates` | アプリ系 | ノーベル賞受賞者情報 |
| `prizes` | アプリ系 | 賞情報（年・部門・受賞理由） |
| `laureate_prizes` | アプリ系 | 受賞者と賞の中間テーブル |
| `favorites` | アプリ系 | ユーザーのお気に入り |

---

## 認証系テーブル（Better-auth 管理）

### `user`

| カラム | 型 | 制約 | 説明 |
|-------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | UUID |
| `name` | TEXT | NOT NULL | 表示名 |
| `email` | TEXT | NOT NULL, UNIQUE | メールアドレス |
| `emailVerified` | INTEGER | NOT NULL | メール検証済みフラグ（0/1） |
| `image` | TEXT | | プロフィール画像 URL |
| `createdAt` | INTEGER | NOT NULL | 作成日時（Unix タイムスタンプ） |
| `updatedAt` | INTEGER | NOT NULL | 更新日時（Unix タイムスタンプ） |

### `session`

| カラム | 型 | 制約 | 説明 |
|-------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | UUID |
| `token` | TEXT | NOT NULL, UNIQUE | セッショントークン |
| `expiresAt` | INTEGER | NOT NULL | 有効期限（Unix タイムスタンプ） |
| `ipAddress` | TEXT | | クライアント IP |
| `userAgent` | TEXT | | ユーザーエージェント |
| `userId` | TEXT | NOT NULL, FK → user(id) | ユーザー参照（CASCADE DELETE） |

### `account`

| カラム | 型 | 制約 | 説明 |
|-------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | UUID |
| `accountId` | TEXT | NOT NULL | プロバイダー内のアカウント ID |
| `providerId` | TEXT | NOT NULL | プロバイダー識別子（例: `credential`） |
| `accessToken` | TEXT | | アクセストークン |
| `refreshToken` | TEXT | | リフレッシュトークン |
| `idToken` | TEXT | | ID トークン |
| `password` | TEXT | | ハッシュ化パスワード |
| `userId` | TEXT | NOT NULL, FK → user(id) | ユーザー参照（CASCADE DELETE） |

### `verification`

| カラム | 型 | 制約 | 説明 |
|-------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | UUID |
| `identifier` | TEXT | NOT NULL | 対象識別子（メールアドレス） |
| `value` | TEXT | NOT NULL | 検証コード |
| `expiresAt` | INTEGER | NOT NULL | 有効期限（Unix タイムスタンプ） |

---

## アプリケーション系テーブル

### `laureates`（受賞者）

| カラム | 型 | 制約 | 説明 |
|-------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | UUID |
| `name` | TEXT | NOT NULL | 氏名（英語） |
| `nameJa` | TEXT | | 氏名（日本語・任意） |
| `birthDate` | TEXT | | 生年月日（ISO 8601: YYYY-MM-DD） |
| `deathDate` | TEXT | | 没年月日（ISO 8601: YYYY-MM-DD） |
| `nationality` | TEXT | | 国籍 |
| `biography` | TEXT | | 略歴（長文テキスト） |
| `imageUrl` | TEXT | | 肖像写真 URL |
| `createdAt` | INTEGER | NOT NULL | 作成日時（Unix タイムスタンプ） |
| `updatedAt` | INTEGER | NOT NULL | 更新日時（Unix タイムスタンプ） |

**インデックス**:
- `name` — 氏名検索
- `nationality` — 国籍フィルタ

---

### `prizes`（賞）

| カラム | 型 | 制約 | 説明 |
|-------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | UUID |
| `year` | INTEGER | NOT NULL | 受賞年（1901〜） |
| `category` | TEXT | NOT NULL | 部門（後述の ENUM 値） |
| `motivation` | TEXT | | 受賞理由（全体概要） |
| `createdAt` | INTEGER | NOT NULL | 作成日時（Unix タイムスタンプ） |
| `updatedAt` | INTEGER | NOT NULL | 更新日時（Unix タイムスタンプ） |

**`category` の値**:

| 値 | 説明 |
|----|------|
| `physics` | 物理学 |
| `chemistry` | 化学 |
| `medicine` | 医学生理学 |
| `literature` | 文学 |
| `peace` | 平和 |
| `economics` | 経済学 |

**インデックス**:
- `year` — 年フィルタ
- `category` — 部門フィルタ
- `(year, category)` — 複合インデックス（UNIQUE）

---

### `laureate_prizes`（受賞者 × 賞 中間テーブル）

複数の受賞者が1つの賞を分け合うケース（シェア）と、同一受賞者が複数の賞を持つケースの両方に対応する。

| カラム | 型 | 制約 | 説明 |
|-------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | UUID |
| `laureateId` | TEXT | NOT NULL, FK → laureates(id) | 受賞者参照（CASCADE DELETE） |
| `prizeId` | TEXT | NOT NULL, FK → prizes(id) | 賞参照（CASCADE DELETE） |
| `motivation` | TEXT | | 個人の受賞理由・寄与テキスト（シェア賞の場合に各人で異なる場合がある） |
| `share` | INTEGER | NOT NULL, DEFAULT 1 | 受賞の分け合い数（1=単独, 2=2分割, 3=3分割） |

**インデックス**:
- `laureateId` — 受賞者による絞り込み
- `prizeId` — 賞による絞り込み
- `(laureateId, prizeId)` — UNIQUE（重複登録防止）

---

### `favorites`（お気に入り）

| カラム | 型 | 制約 | 説明 |
|-------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | UUID |
| `userId` | TEXT | NOT NULL, FK → user(id) | ユーザー参照（CASCADE DELETE） |
| `targetType` | TEXT | NOT NULL | 対象種別（`laureate` / `prize`） |
| `targetId` | TEXT | NOT NULL | 対象レコードの ID |
| `createdAt` | INTEGER | NOT NULL | 登録日時（Unix タイムスタンプ） |

**インデックス**:
- `userId` — ユーザー別取得
- `(userId, targetType, targetId)` — UNIQUE（重複お気に入り防止）

---

## ER 図

```
user ─────────────── session (1:多)
 │
 └──── account (1:多)
 │
 └──── favorites (1:多)
          │
          ├─ targetType=laureate → laureates
          └─ targetType=prize   → prizes

laureates ─┐
           ├── laureate_prizes (多:多の中間テーブル) ──── prizes
```

---

## シードデータ方針

- サーバー起動時に `db:migrate` → `db:seed` を自動実行する
- シードデータは `/packages/db/src/seed.ts` に定義する
- Nobel Prize API（https://api.nobelprize.org/2.1/）からデータを取得してシードに使用する、またはスタティックな JSON ファイルを `/packages/db/src/data/` に配置する

---

## マイグレーション方針

- `drizzle-kit generate` でマイグレーションファイルを自動生成する
- マイグレーションファイルは `/packages/db/src/migrations/` に配置する
- スキーマ変更時は必ず `drizzle-kit generate` を実行してからコミットする
