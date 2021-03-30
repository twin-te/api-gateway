# twinte-api-gateway

各種サービスを取りまとめて外部apiとして公開する

# アーキテクチャ
api-gatewayは殆どドメイン知識を持たないため、ペーシックな3層アーキテクチャです。


```
api-gateway
├── openapi-spec    openapiの定義が含まれる(submoduleでリンク)
├── services        各サービスの実装(submoduleでリンク・protoファイルと開発環境でのdocker imageビルドのみに使用)
│   ├── course-service
│   ├── timetable-service
│   └ ... (追加予定)
└── src
    ├── api         expressを用いたapiの実装
    │   └── routes  ルーティング
    ├── gateway     各サービスの呼び出しをラップ
    │   ├── courseService
    │   ├── sessionService
    │   ├── timetableService
    │   └ ... (追加予定)
    ├── type        共通で用いる型定義等
    └── usecase     ユースケース
```

|folder|役割|
|---|---|
|api|プレゼンテーション層|
|usecase|ビジネスロジック層|
|gateway|データアクセス層|

# 利用方法
[ビルド済みDockerImage](https://github.com/orgs/twin-te/packages?repo_name=api-gateway)が利用できます。

| 環境変数名  | 説明                             | default               |
|------------|----------------------------------|-----------------------|
| COURSE_SERVICE_URL | course-serviceの接続先 | course:50051|
| TIMETABLE_SERVICE_URL | timetable-serviceの接続先 | timetable:50051|
| DONATION_SERVICE_URL | donation-serviceの接続先 | donation:50051|
| INFORMATION_SERVICE_URL | information-serviceの接続先 | information:50051|
| SCHOOL_CALENDAR_SERVICE_URL | school-calendar-serviceの接続先 | school-calendar:50051|
| SESSION_SERVICE_URL | session-serviceの接続先 | session:50051|
| COOKIE_NAME | session-serviceに渡すidが含まれるCOOKIE名 | twinte_session |
| LOG_LEVEL   | ログレベル fatal / error / warn / info / debug / trace / off | info              |

# 開発方法
Docker + VSCodeを推奨します。
以下その方法を紹介します。

1. [RemoteDevelopment](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)拡張機能をインストール
2. このプロジェクトのフォルダを開く
3. 右下に `Folder contains a Dev Container configuration file. Reopen folder to develop in a container` と案内が表示されるので`Reopen in Container`を選択する。（表示されない場合はコマンドパレットを開き`open folder in container`と入力する）
4. node14の開発用コンテナが立ち上がりVSCodeで開かれます。また、依存するサービス等も自動で起動します。
5. `yarn install` で依存をインストールします。
6. `yarn openapi` でopenapiスキーマから型定義ファイルを生成します
6. `yarn proto` でgrpcに必要なファイルを生成します
7. `yarn dev` で立ち上がります。

# v3バックエンドサービス一覧
- API Gateway (here)
- Auth Callback
- User Service
- Session Service
- Timetable Service
- Course Service (here)
- Search Service
- Donation Service
- School Calendar Service
- Information Service
- Task Service