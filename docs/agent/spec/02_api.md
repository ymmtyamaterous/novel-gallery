# API 設計書

## 概要

バックエンドは **Hono** フレームワーク上で動作し、**oRPC** を用いた型安全な RPC エンドポイントを提供する。
認証は **Better-auth** が `/api/auth/*` 以下を担当し、アプリケーション固有の API は `/rpc` プレフィックス下に oRPC として実装する。

---

## エンドポイント体系

| プレフィックス | 担当 | 説明 |
|--------------|------|------|
| `/api/auth/*` | Better-auth | 認証・セッション管理 |
| `/rpc` | oRPC | アプリケーション API |
| `/api-reference` | OpenAPI UI | API ドキュメント閲覧 |

---

## 認証エンドポイント（Better-auth 自動生成）

| メソッド | パス | 説明 |
|---------|------|------|
| POST | `/api/auth/sign-up/email` | メール + パスワードで新規登録 |
| POST | `/api/auth/sign-in/email` | メール + パスワードでログイン |
| POST | `/api/auth/sign-out` | ログアウト（セッション破棄） |
| GET | `/api/auth/get-session` | 現在のセッション情報取得 |

---

## oRPC エンドポイント

### 共通事項

- **ベース URL**: `/rpc`
- **プロトコル**: oRPC（JSON over HTTP）
- **認証**: Cookie ベースのセッション（`credentials: include`）
- **エラーコード**:
  - `UNAUTHORIZED` — 未認証
  - `NOT_FOUND` — リソースが存在しない
  - `BAD_REQUEST` — 入力値エラー
  - `INTERNAL_SERVER_ERROR` — サーバー内部エラー

### プロシージャ種別

| 種別 | 説明 |
|------|------|
| `publicProcedure` | 認証不要。ゲストユーザーも利用可能 |
| `protectedProcedure` | 認証必須。未認証時は `UNAUTHORIZED` を返す |

---

## ルーター設計

### `healthCheck`

```
healthCheck() → { status: "ok" }
```

- **種別**: publicProcedure
- **説明**: API の稼働確認

---

### `laureates` ルーター

#### `laureates.list`

```
laureates.list(input) → { items: Laureate[], total: number, page: number, pageSize: number }
```

- **種別**: publicProcedure
- **入力**:

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `query` | string | 任意 | 名前・国籍・受賞理由のキーワード検索 |
| `category` | string | 任意 | 受賞部門（`physics` / `chemistry` / `medicine` / `literature` / `peace` / `economics`） |
| `year` | number | 任意 | 受賞年（1901〜） |
| `nationality` | string | 任意 | 国籍 |
| `page` | number | 任意 | ページ番号（デフォルト: 1） |
| `pageSize` | number | 任意 | 1ページあたりの件数（デフォルト: 20, 最大: 100） |

- **出力 `Laureate`**:

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | string | 受賞者 ID |
| `name` | string | 氏名 |
| `nationality` | string | 国籍 |
| `birthDate` | string \| null | 生年月日 |
| `deathDate` | string \| null | 没年月日 |
| `imageUrl` | string \| null | 肖像写真 URL |
| `prizes` | Prize[] | 受賞歴の配列（省略版） |

---

#### `laureates.get`

```
laureates.get({ id: string }) → LaureateDetail
```

- **種別**: publicProcedure
- **入力**: `id`（受賞者 ID）
- **出力 `LaureateDetail`**: `Laureate` + 以下を含む詳細情報

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `biography` | string \| null | 略歴（長文） |
| `prizes` | PrizeDetail[] | 受賞歴（詳細含む） |

---

### `prizes` ルーター

#### `prizes.list`

```
prizes.list(input) → { items: Prize[], total: number }
```

- **種別**: publicProcedure
- **入力**:

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `category` | string | 任意 | 受賞部門 |
| `year` | number | 任意 | 受賞年 |
| `page` | number | 任意 | ページ番号 |
| `pageSize` | number | 任意 | ページサイズ |

- **出力 `Prize`**:

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | string | 賞 ID |
| `year` | number | 受賞年 |
| `category` | string | 受賞部門 |
| `motivation` | string \| null | 受賞理由（全体概要） |
| `laureates` | Laureate[] | 受賞者一覧（省略版） |

---

#### `prizes.get`

```
prizes.get({ id: string }) → PrizeDetail
```

- **種別**: publicProcedure
- **入力**: `id`（賞 ID）
- **出力 `PrizeDetail`**: `Prize` + 以下

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `laureates` | LaureateWithShare[] | 受賞者（個人寄与テキスト含む） |

---

### `categories` ルーター

#### `categories.list`

```
categories.list() → { items: Category[] }
```

- **種別**: publicProcedure
- **出力 `Category`**:

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `slug` | string | `physics` / `chemistry` など |
| `label` | string | 表示名（例: "Physics"） |
| `labelJa` | string | 日本語表示名（例: "物理学"） |
| `count` | number | 該当する賞の数 |

---

### `favorites` ルーター（要認証）

#### `favorites.list`

```
favorites.list() → { items: Favorite[] }
```

- **種別**: protectedProcedure
- **出力 `Favorite`**:

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | string | お気に入り ID |
| `targetType` | `"laureate"` \| `"prize"` | 対象種別 |
| `targetId` | string | 対象 ID |
| `laureate` | Laureate \| null | 受賞者情報（targetType が laureate の場合） |
| `prize` | Prize \| null | 賞情報（targetType が prize の場合） |
| `createdAt` | string | 登録日時 |

---

#### `favorites.add`

```
favorites.add({ targetType: "laureate" | "prize", targetId: string }) → Favorite
```

- **種別**: protectedProcedure

---

#### `favorites.remove`

```
favorites.remove({ id: string }) → { success: true }
```

- **種別**: protectedProcedure

---

## 型定義まとめ

```typescript
type Category = "physics" | "chemistry" | "medicine" | "literature" | "peace" | "economics";

interface Laureate {
  id: string;
  name: string;
  nationality: string | null;
  birthDate: string | null;
  deathDate: string | null;
  imageUrl: string | null;
  prizes: PrizeSummary[];
}

interface LaureateDetail extends Laureate {
  biography: string | null;
  prizes: PrizeDetail[];
}

interface Prize {
  id: string;
  year: number;
  category: Category;
  motivation: string | null;
  laureates: LaureateSummary[];
}

interface PrizeDetail extends Prize {
  laureates: LaureateWithShare[];
}

interface LaureateWithShare extends LaureateSummary {
  motivation: string | null; // 個人の寄与・受賞理由
}

interface Favorite {
  id: string;
  targetType: "laureate" | "prize";
  targetId: string;
  laureate?: Laureate;
  prize?: Prize;
  createdAt: string;
}
```

---

## エラーレスポンス形式

oRPC の標準エラー形式に準拠する。

```json
{
  "code": "NOT_FOUND",
  "message": "Laureate not found"
}
```
