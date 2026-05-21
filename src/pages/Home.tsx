import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Search, RotateCcw, ShieldAlert, Zap } from 'lucide-react';

const CATS = [
  { id:'sns_post', icon:'🐦', label:'SNS 自分の投稿', desc:'X, Instagram など',
    subs:['X (Twitter)','Instagram','Facebook','TikTok / YouTube','その他SNS'],
    hasCtx:false, mainPlaceholder:'投稿予定のテキストを入力してください' },
  { id:'sns_reply', icon:'↩️', label:'SNS 返信・リプライ', desc:'他人の投稿への反応',
    subs:['X (Twitter)','Instagram','Facebook','YouTube コメント','その他'],
    hasCtx:true, ctxLabel:'返信先の投稿内容・スレッドの流れ',
    ctxPlaceholder:'例）相手の投稿の内容を入力してください',
    mainPlaceholder:'返信しようとしているテキストを入力してください' },
  { id:'email', icon:'✉️', label:'メール・社内連絡', desc:'ビジネス文書、チャット',
    subs:['社外メール','社内メール','Slack / チャット','公式アナウンス'],
    hasCtx:true, ctxLabel:'送信先・状況・背景',
    ctxPlaceholder:'例）クレームを受けたクライアントへの返信',
    mainPlaceholder:'送信予定のメール・メッセージ本文を入力してください' },
  { id:'pr', icon:'📢', label:'広告・PR文', desc:'広告コピー、プレスリリース',
    subs:['商品・サービス広告','プレスリリース','キャッチコピー','LP・ウェブ文章'],
    hasCtx:true, ctxLabel:'商品・サービス・ターゲットの説明',
    ctxPlaceholder:'例）30代女性向けダイエットサプリ。体験談を使う予定',
    mainPlaceholder:'広告・PR文を入力してください' },
  { id:'review', icon:'⭐', label:'レビュー・口コミ', desc:'商品・店舗・企業レビュー',
    subs:['商品レビュー','飲食店・施設','企業・職場レビュー','アプリ・サービス'],
    hasCtx:true, ctxLabel:'対象の情報・背景',
    ctxPlaceholder:'例）1年通ったジムへの退会後のレビュー',
    mainPlaceholder:'投稿予定のレビュー文を入力してください' },
  { id:'other', icon:'📄', label:'その他', desc:'ブログ、スピーチなど',
    subs:['ブログ記事','インタビュー・発言','スピーチ原稿','その他テキスト'],
    hasCtx:true, ctxLabel:'状況・背景',
    ctxPlaceholder:'例）業界カンファレンスでのパネルディスカッション発言',
    mainPlaceholder:'チェックしたいテキストを入力してください' },
];

const METRICS_DEF = [
  { key:'aggression',   label:'攻撃性',       desc:'言葉の強さ・攻撃的表現の度合い' },
  { key:'discomfort',   label:'不快度',        desc:'読み手が嫌悪感を覚えやすいか' },
  { key:'virality',     label:'炎上拡散性',    desc:'拡散して燃え広がりやすいか' },
  { key:'misread',      label:'誤解リスク',    desc:'文脈を誤読・切り取られやすいか' },
  { key:'compliance',   label:'コンプラ危険度', desc:'企業・法的観点でのリスク' },
] as const;

interface AnalysisResult {
  score: number;
  metrics: Record<string, number>;
  riskWords: string[];
  warnWords: string[];
  problems: string[];
  reactions: string[];
  analysis: string;
  suggestion: string;
}

function AdSenseLoading() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <ins class="adsbygoogle"
             style="display:block; text-align:center; width:100%; min-width:100%; min-height:100px;"
             data-ad-layout="in-article"
             data-ad-format="fluid"
             data-ad-client="ca-pub-8520638973048541"
             data-ad-slot="6980258773"></ins>
      `;
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense push error: ', err);
      }
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="my-4 overflow-hidden flex justify-center w-full min-h-[100px] bg-[var(--bg2)] rounded-xl border border-[var(--border)] p-4 items-center">
      <div ref={containerRef} className="w-full" />
    </div>
  );
}

export default function Home() {
  const [selCat, setSelCat] = useState<typeof CATS[0] | null>(null);
  const [selSub, setSelSub] = useState<string | null>(null);
  const [mainText, setMainText] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const getColor = (s: number) => s <= 30 ? 'var(--green)' : s <= 60 ? 'var(--yellow)' : 'var(--red)';
  const getVerdict = (s: number) => {
    if (s <= 20) return '問題なし — 安全に送信できます';
    if (s <= 40) return '⚠️ 軽微なリスク — 一部注意が必要です';
    if (s <= 60) return '🔶 中程度のリスク — 修正を検討してください';
    if (s <= 80) return '🔥 高リスク — 炎上の可能性が高いです';
    return '💥 非常に高リスク — 送信は控えることを強く推奨します';
  };

  const handleRunAnalysis = async () => {
    if (!selCat || !selSub || !mainText.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    const prompt = `あなたは炎上リスク・コンプライアンス診断の専門家です。以下のテキストを分析してください。

カテゴリ: ${selCat.label}
種類: ${selSub}
${selCat.hasCtx ? `背景・状況:\n"""\n${context}\n"""` : ''}
チェックテキスト:
"""
${mainText}
"""

## 診断基準 (0-100点)
- 攻撃性: 特定の個人・団体への攻撃、差別、ヘイトスピーチの度合い。
- 不快度: 生理的嫌悪感、下品な言葉、公序良俗に反する表現の度合い。
- 炎上拡散性: 内容が切り取られ、社会的制裁を招くほどの反発を生む可能性。
- 誤解リスク: 多義的な表現や文脈不足により、意図せず不快感を与える可能性。
- コンプラ危険度: 法令違反、契約違反、機密漏洩、重大な公務員倫理違反などの度合い。

## 重要：総合スコア(score)の算出指針
- scoreは「社会的信用を失う、または具体的な実害が生じるリスク」の総和です。
- **悪意の欠如 = 低スコア**: 単に下品な言葉（例：「うんち」等）や生理的な言葉が含まれるだけで、悪意や攻撃性、実害がない場合、不快度が高くてもscoreは30%未満に抑えてください。
- 高スコア(60%以上)は、具体的な攻撃対象がある場合や、明確なルール違反、差別、深刻なハラスメントに限定してください。
- 診断は過敏すぎず、客観的な社会通念に基づいて行ってください。

以下のJSON形式のみで回答してください（マークダウン・前置き不要）:
{
  "score": 0から100の整数（総合炎上リスク）,
  "metrics": {
    "aggression": 0から100,
    "discomfort": 0から100,
    "virality": 0から100,
    "misread": 0から100,
    "compliance": 0から100
  },
  "riskWords": ["リスクの高い単語や表現（原文から抜粋）"],
  "warnWords": ["やや注意が必要な単語や表現（原文から抜粋）"],
  "problems": ["リスク要因ラベル（最大3個）"],
  "reactions": ["想定される読み手の反応（例：高圧的に見える可能性、晒し行為と受け取られる可能性、等）"],
  "analysis": "詳細分析（200字以内）",
  "suggestion": "改善提案（200字以内）"
}`;

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('現在、サーバーが大変混雑しているか、一時的なエラーが発生しました。お手数ですが、再度実行してください。');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message === 'Failed to fetch' ? 'ネットワークエラーが発生しました。再度お試しください。' : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const renderHighlight = (text: string, riskWords: string[], warnWords: string[]) => {
    if (!text) return '';
    let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Sort words by length descending to avoid partial matches breaking nested highlights
    const allWords = [
      ...(riskWords || []).map(w => ({ w, type: 'risk' })),
      ...(warnWords || []).map(w => ({ w, type: 'warn' }))
    ].sort((a, b) => b.w.length - a.w.length);

    allWords.forEach(({ w, type }) => {
      if (!w) return;
      const className = type === 'risk' 
        ? 'border-b-2 border-[var(--red)] font-medium px-0.5' 
        : 'border-b-2 border-dotted border-[var(--yellow)] font-medium px-0.5';
      // Simple string replace for now (not ideal for all cases but works for standard UI)
      const regex = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      html = html.replace(regex, `<span class="inline-block ${className}">${w}</span>`);
    });

    return <div dangerouslySetInnerHTML={{ __html: html.replace(/\n/g, '<br>') }} />;
  };

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-[720px] mx-auto px-6 py-24 md:py-32 animate-fade-up">
        {!result && (
          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-4">
              SNS投稿・メール・広告文を<span className="text-[var(--accent)]">AIが分析。</span>
            </h1>
            <p className="text-sm text-[var(--text2)] leading-relaxed border-l-2 border-[var(--accent)] pl-4 max-w-[520px]">
              <strong>炎上・誤解・コンプラ違反</strong>のリスクを診断。<br />
              投稿や送信ボタンを押す前の「事故防止」を徹底するためのツールです。
            </p>
          </div>
        )}

        {/* Step 1: Category */}
        <section className="mb-8">
          <div className="font-mono text-[13px] tracking-[2px] uppercase text-[var(--text2)] mb-3 flex items-center gap-2 after:content-[''] after:flex-grow after:h-[1px] after:bg-[var(--border)]">
            Step 01 — カテゴリ選択
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {CATS.map(cat => (
              <button 
                key={cat.id}
                onClick={() => { setSelCat(cat); setSelSub(null); setResult(null); }}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${selCat?.id === cat.id ? 'border-[var(--accent)] bg-[rgba(232,68,26,0.06)]' : 'border-[var(--border)] bg-[var(--bg2)] hover:bg-[var(--bg3)] hover:border-[var(--border2)]'}`}
              >
                <span className="text-xl shrink-0 mt-0.5">{cat.icon}</span>
                <div>
                  <div className={`text-sm font-medium ${selCat?.id === cat.id ? 'text-[var(--text)]' : 'text-[var(--text2)]'}`}>{cat.label}</div>
                  <div className={`text-[12px] mt-1 transition-colors ${selCat?.id === cat.id ? 'text-[var(--text)] opacity-80' : 'text-gray-400'}`}>{cat.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 1.5: Subcategory */}
        <AnimatePresence>
          {selCat && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-8"
            >
              <div className="font-mono text-[13px] tracking-[2px] uppercase text-[var(--text2)] mb-3 flex items-center gap-2 after:content-[''] after:flex-grow after:h-[1px] after:bg-[var(--border)]">
                {selCat.label} — 種類を選択
              </div>
              <div className="flex flex-wrap gap-2">
                {selCat.subs.map(sub => (
                  <button 
                    key={sub}
                    onClick={() => { setSelSub(sub); setResult(null); }}
                    className={`px-3 py-1.5 rounded-md border font-mono text-[11px] transition-all ${selSub === sub ? 'border-[var(--accent)] text-[var(--accent)] bg-[rgba(232,68,26,0.08)]' : 'border-[var(--border)] text-[var(--text2)] bg-[var(--bg2)] hover:border-[var(--border2)] hover:text-[var(--text)]'}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Step 2: Form */}
        <AnimatePresence>
          {selSub && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="font-mono text-[13px] tracking-[2px] uppercase text-[var(--text2)] mb-3 flex items-center gap-2 after:content-[''] after:flex-grow after:h-[1px] after:bg-[var(--border)]">
                Step 02 — 内容を入力
              </div>

              {selCat?.hasCtx && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-[var(--text2)]">{selCat.ctxLabel}</label>
                  </div>
                  <textarea 
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    rows={2}
                    className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-colors placeholder:text-[var(--text3)]"
                    placeholder={selCat.ctxPlaceholder}
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-[var(--text2)]">チェックしたいテキスト <span className="text-[var(--accent)]">*</span></label>
                </div>
                <textarea 
                  value={mainText}
                  onChange={(e) => setMainText(e.target.value)}
                  maxLength={500}
                  rows={6}
                  required
                  className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--border2)] transition-colors placeholder:text-[var(--text3)]"
                  placeholder={selCat?.mainPlaceholder}
                />
                <div className={`text-[13px] font-mono text-right transition-colors ${mainText.length >= 500 ? 'text-[var(--red)]' : mainText.length >= 400 ? 'text-[var(--yellow)]' : 'text-[var(--text2)]'}`}>
                  {mainText.length} / 500 文字
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleRunAnalysis}
                  disabled={loading || !mainText.trim()}
                  className="w-full bg-[var(--accent)] hover:bg-[var(--accent2)] disabled:bg-[var(--bg3)] disabled:text-[var(--text3)] disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      分析中...
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      炎上リスクを診断する
                    </>
                  )}
                </button>

                {loading && (
                  <div className="space-y-4 pt-2">
                    {/* 診断中を知らせるコメント */}
                    <div className="space-y-3">
                      <div className="h-0.5 bg-[var(--border)] overflow-hidden rounded-full">
                        <div className="h-full bg-[var(--accent)] animate-loading-slide w-[40%] rounded-full" />
                      </div>
                      <div className="font-mono text-[13px] text-[var(--text2)] text-center">AIが内容を分析中... しばらくお待ちください</div>
                    </div>

                    {/* google Adds */}
                    <AdSenseLoading />
                  </div>
                )}

                <div className="text-[11px] text-[var(--text3)] text-center leading-relaxed">
                  本サービスをご利用いただくことで、<a href="/terms" className="underline underline-offset-2 hover:text-[var(--text2)]">利用規約</a>および<a href="/privacy" className="underline underline-offset-2 hover:text-[var(--text2)]">プライバシーポリシー</a>に<br />同意したものとみなされます。
                </div>

                {error && (
                  <div className="p-4 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.3)] rounded-lg text-[var(--red)] text-sm flex gap-3 leading-relaxed">
                    <AlertTriangle size={18} className="shrink-0" />
                    {error}
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div 
              ref={resultRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-10"
            >
              <div className="font-mono text-[14px] tracking-[2px] uppercase text-[var(--text2)] mb-3 flex items-center gap-2 after:content-[''] after:flex-grow after:h-[1px] after:bg-[var(--border)]">
                Diagnosis Result
              </div>

              {/* Score Block */}
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-8">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <div className="font-mono text-[12px] tracking-[1.5px] uppercase text-[var(--text2)] mb-1">Overall Risk Score</div>
                    <div className="text-lg font-bold leading-tight" style={{ color: getColor(result.score) }}>
                      {getVerdict(result.score)}
                    </div>
                  </div>
                  <div className="font-mono text-6xl font-bold tracking-tighter" style={{ color: getColor(result.score) }}>
                    {result.score}%
                  </div>
                </div>
                <div className="h-1 bg-[var(--bg3)] rounded-full overflow-hidden mb-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full"
                    style={{ backgroundColor: getColor(result.score) }}
                  />
                </div>
                <div className="flex justify-between font-mono text-[11px] text-[var(--text2)] select-none">
                  <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {METRICS_DEF.map(def => {
                  const val = result.metrics[def.key] || 0;
                  return (
                    <div key={def.key} className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-[var(--text2)]">{def.label}</span>
                        <span className="font-mono text-sm font-bold" style={{ color: getColor(val) }}>{val}%</span>
                      </div>
                      <div className="h-1 bg-[var(--bg3)] rounded-full overflow-hidden mb-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className="h-full"
                          style={{ backgroundColor: getColor(val) }}
                        />
                      </div>
                      <div className="text-[12px] text-[var(--text2)] leading-tight">{def.desc}</div>
                    </div>
                  );
                })}
              </div>

              {/* Details Card */}
              <div className="space-y-3">
                {(result.score >= 40 || (result.metrics.misread || 0) >= 40) && (
                  <div className="bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)] rounded-xl p-5 flex gap-4 items-start animate-pulse">
                    <ShieldAlert className="text-[var(--red)] shrink-0 mt-0.5" size={20} />
                    <div className="text-[var(--red)]">
                      <div className="font-bold text-sm mb-1">【拡散注意】実害発生のリスクがあります</div>
                      <p className="text-[12px] opacity-90 leading-tight">この投稿は、スクリーンショットが拡散された際に本来の意図とは異なる文脈で解釈され、社会的非難を浴びる危険性が極めて高い状態です。</p>
                    </div>
                  </div>
                )}

                <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-6 space-y-4">
                  <div className="font-mono text-[14px] tracking-[1px] uppercase text-[var(--text2)]">
                    問題箇所のハイライト
                  </div>
                  <div className="text-sm leading-[1.8] text-[var(--text2)]">
                    {renderHighlight(mainText, result.riskWords, result.warnWords)}
                  </div>
                </div>

                <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-6 space-y-4">
                  <div className="font-mono text-[14px] tracking-[1px] uppercase text-[var(--text2)]">
                    想定される反応・影響
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.reactions?.length > 0 ? result.reactions.map(r => (
                      <span key={r} className="px-3 py-1 bg-[var(--bg3)] border border-[var(--border)] text-[var(--text2)] text-[11px] rounded-full select-none flex items-center gap-1.5 whitespace-nowrap">
                        <Zap size={10} className="text-[var(--yellow)]" /> {r}
                      </span>
                    )) : (
                      <span className="text-[12px] text-[var(--text3)]">特になし</span>
                    )}
                  </div>
                </div>

                <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-6 space-y-4">
                  <div className="font-mono text-[14px] tracking-[1px] uppercase text-[var(--text2)]">
                    検出されたリスク要因
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.problems?.length > 0 ? result.problems.map(p => (
                      <span key={p} className="px-3 py-1 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-[var(--red)] text-[10px] font-mono rounded select-none">{p}</span>
                    )) : (
                      <span className="px-3 py-1 bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] text-[var(--green)] text-[10px] font-mono rounded">リスク要因なし</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-6 space-y-3">
                    <div className="font-mono text-[14px] tracking-[1px] uppercase text-[var(--text2)]">
                      詳細分析
                    </div>
                    <p className="text-sm text-[var(--text2)] leading-relaxed">{result.analysis}</p>
                  </div>
                  <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-6 space-y-3">
                    <div className="font-mono text-[14px] tracking-[1px] uppercase text-[var(--text2)]">
                      改善提案
                    </div>
                    <p className="text-sm text-[var(--text2)] leading-relaxed">{result.suggestion}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => {
                    setResult(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="font-mono text-[13px] tracking-[1px] uppercase text-[var(--text2)] border border-[var(--border)] px-6 py-2 rounded-lg hover:border-[var(--border2)] hover:text-[var(--text)] transition-all flex items-center gap-2"
                >
                  <RotateCcw size={14} /> もう一度診断する
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
