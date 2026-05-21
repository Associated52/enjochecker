import { motion } from 'motion/react';

export default function Terms() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-12 md:py-16 animate-fade-up">
      <header className="mb-12">
        <div className="font-mono text-[10px] text-[var(--accent)] tracking-[3px] uppercase mb-3 flex items-center gap-2 before:content-[''] before:w-5 before:h-[1px] before:bg-[var(--accent)]">
          Legal
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">利用規約</h1>
        <p className="text-sm text-[var(--text2)]">最終更新日: 2026年5月19日</p>
      </header>

      <section className="space-y-8 text-sm leading-relaxed text-[var(--text2)]">
        <div className="space-y-3">
          <h2 className="text-base font-bold text-[var(--text)] border-l-2 border-[var(--accent)] pl-4">第1条（適用）</h2>
          <p>
            この利用規約（以下，「本規約」といいます。）は，本サービスの提供者（以下，「提供者」といいます。）が提供するサービス「炎上チェッカー」（以下，「本サービス」といいます。）の利用条件を定めるものです。利用者の皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[var(--text)] border-l-2 border-[var(--accent)] pl-4">第2条（利用の目的）</h2>
          <p>
            本サービスは，AIを用いて入力されたテキストのリスクを診断するものであり，その結果の正確性，完全性，または特定の目的への適合性を保証するものではありません。診断結果はあくまで参考情報としてご利用ください。
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[var(--text)] border-l-2 border-[var(--accent)] pl-4">第3条（禁止事項）</h2>
          <p>ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>本サービスの内容等，本サービスに含まれる著作権，商標権ほか知的財産権を侵害する行為</li>
            <li>本サービスによって得られた情報を商業的に利用する行為</li>
            <li>本サービスの運営を妨害するおそれのある行為</li>
            <li>不正アクセスをし，またはこれを試みる行為</li>
            <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
            <li>提供者，他のユーザー，または第三者に不利益，損害，不快感を与える行為</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[var(--text)] border-l-2 border-[var(--accent)] pl-4">第4条（本サービスの提供の停止等）</h2>
          <p>
            提供者は，以下のいずれかの事由があると判断した場合，ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
            <li>地震，落雷，火災，停電または天災などの不可抗力により，本サービスの提供が困難となった場合</li>
            <li>コンピュータまたは通信回線等が事故により停止した場合</li>
            <li>その他，提供者が本サービスの提供が困難と判断した場合</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[var(--text)] border-l-2 border-[var(--accent)] pl-4">第5条（免責事項）</h2>
          <p>
            提供者は，本サービスに事実上または法律上の瑕疵（安全性，信頼性，正確性，完全性，有効性，特定の目的への適合性，セキュリティなどに関する欠陥，エラーやバグ，権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
          </p>
          <p>
            提供者は，本サービスに起因してユーザーに生じたあらゆる損害について，一切の責任を負いません。
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-[var(--text)] border-l-2 border-[var(--accent)] pl-4">第6条（利用規約の変更）</h2>
          <p>
            提供者は，必要と判断した場合には，ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお，本規約の変更後，本サービスの利用を開始した場合には，当該ユーザーは変更後の規約に同意したものとみなします。
          </p>
        </div>
      </section>
    </div>
  );
}
