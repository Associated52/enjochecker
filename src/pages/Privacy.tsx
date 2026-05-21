import { motion } from 'motion/react';

export default function Privacy() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-12 md:py-16 animate-fade-up">
      <header className="mb-12">
        <div className="font-mono text-[10px] text-[var(--accent)] tracking-[3px] uppercase mb-3 flex items-center gap-2 before:content-[''] before:w-5 before:h-[1px] before:bg-[var(--accent)]">
          Privacy
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">プライバシーポリシー</h1>
        <p className="text-sm text-[var(--text2)]">最終更新日: 2026年5月19日</p>
      </header>

      <section className="space-y-8 text-sm leading-relaxed text-[var(--text2)]">
        <p>
          炎上チェッカー（以下，「本サービス」といいます。）は，本サービス上で提供するサービスにおける個人情報の取扱いについて，以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。
        </p>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[var(--text)] border-l-2 border-[var(--accent)] pl-4">1. 収集する情報とその利用目的</h2>
          <p>本サービスでは，以下の情報を収集および利用します。</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>入力テキスト情報:</strong> ユーザーが診断のために入力したテキスト情報は，AIによる分析を行うために使用されます。これらの情報は分析後に一定期間経過後，適切に削除されます。
            </li>
            <li>
              <strong>お問い合わせ情報:</strong> お問い合わせフォームに入力されたお名前，メールアドレス，お問い合わせ内容は，回答や連絡のために利用します。
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[var(--text)] border-l-2 border-[var(--accent)] pl-4">2. 第三者への提供</h2>
          <p>
            当方は，法令に基づく場合を除き，取得した個人情報をユーザーの同意なく第三者に提供することはありません。
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[var(--text)] border-l-2 border-[var(--accent)] pl-4">3. AIサービスの利用</h2>
          <p>
            本サービスは，Google Cloudの提供するGemini APIを利用してテキスト分析を行っています。入力されたテキストデータはAIモデルに送信されますが，Googleの利用規約に基づき，学習データとして利用されることはありません（エンタープライズティアの契約に基づく仕様）。
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[var(--text)] border-l-2 border-[var(--accent)] pl-4">4. Cookieの利用</h2>
          <p>
            本サービスでは，ユーザーの利便性向上のため，Cookie（クッキー）を使用することがあります。ブラウザの設定によりCookieの受け取りを拒否することも可能です。
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[var(--text)] border-l-2 border-[var(--accent)] pl-4">5. お問い合わせ先</h2>
          <p>
            プライバシーポリシーに関するお問い合わせは，本サービスの「お問い合わせ」ページよりお願いいたします。
          </p>
        </div>
      </section>
    </div>
  );
}
