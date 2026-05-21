import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="max-w-[720px] mx-auto px-6 py-12 md:py-16 animate-fade-up">
      <header className="mb-12">
        <div className="font-mono text-[10px] text-[var(--accent)] tracking-[3px] uppercase mb-3 flex items-center gap-2 before:content-[''] before:w-5 before:h-[1px] before:bg-[var(--accent)]">
          Contact
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">お問い合わせ</h1>
        <p className="text-sm text-[var(--text2)] border-l-2 border-[var(--accent)] pl-4 max-w-[500px]">
          サービスに関するご質問、不具合報告、機能要望などがございましたら、以下のフォームよりご連絡ください。
        </p>
      </header>

      {submitted ? (
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-8 text-center space-y-4 animate-fade-up">
          <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Send size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-bold">送信完了しました</h2>
          <p className="text-sm text-[var(--text2)] leading-relaxed">
            お問い合わせありがとうございます。<br />
            記載いただいたメールアドレス宛に、追ってご連絡させていただきます。
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="text-[var(--accent)] text-xs font-mono uppercase tracking-widest mt-4 hover:underline"
          >
            ← 戻る
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-[var(--text2)] flex items-center gap-2">
              <Mail size={14} className="text-[var(--text3)]" />
              メールアドレス <span className="text-[var(--accent)]">*</span>
            </label>
            <input 
              type="email" 
              required
              placeholder="example@gmail.com"
              className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text)]"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[var(--text2)] flex items-center gap-2">
              <MessageSquare size={14} className="text-[var(--text3)]" />
              お問い合わせ内容 <span className="text-[var(--accent)]">*</span>
            </label>
            <textarea 
              required
              rows={6}
              placeholder="こちらに内容を入力してください"
              className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text)] resize-vertical"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <div className="text-[10px] text-[var(--text3)] mb-4 text-center">
              直接のメールはこちら: <span className="text-[var(--text2)] italic">take2sony@gmail.com</span>
            </div>
            <button 
              type="submit"
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent2)] text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Send size={18} />
              上記の内容で送信する
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
