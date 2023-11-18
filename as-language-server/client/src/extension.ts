import * as path from "path";
import * as vscode from "vscode";
import {
  DocumentSelector,
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
  // Language Server のプログラムのパス
  let serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));

  // Language Server の設定
  let serverOptions: ServerOptions = {
    run: {
      module: serverModule,
      transport: TransportKind.ipc
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      // デバッグオプションはデバッグ時のみ付与する
      options: {
        execArgv: ["--nolazy", "--inspect=6010"]
      }
    }
  };

  const documentSelector = [
    { scheme: "file" },
  ] as DocumentSelector;

  // Language Client の設定
  const clientOptions: LanguageClientOptions = {
    documentSelector,
    // 同期する設定項目
    synchronize: {
      // "lll."の設定を指定しています
      configurationSection: "lll",
    }
  };

  // Language Client の作成
  client = new LanguageClient(
    // 拡張機能のID
    "line-length-linter",
    // ユーザ向けの名前（出力ペインで使用されます）
    "Line Length Linter",
    serverOptions,
    clientOptions
  );

  // Language Client の開始
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
