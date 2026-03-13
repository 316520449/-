'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, RefreshCw, Copy, Download } from 'lucide-react';

const templateConfig: Record<string, { title: string; placeholder: string; buttonText: string }> = {
  outline: {
    title: '小说大纲生成',
    placeholder: '请输入小说的题材、核心设定、主角人设、爽点卖点等，比如：男频玄幻爽文，主角开局觉醒废武魂，实则是上古神体，宗门废柴逆袭，升级打怪，爽点密集',
    buttonText: '生成大纲',
  },
  character: {
    title: '人物设定生成',
    placeholder: '请输入人物的核心设定，比如：玄幻小说女主，宗门大小姐，外冷内热，天赋异禀，和男主是欢喜冤家，有隐藏的身世秘密',
    buttonText: '生成人设',
  },
  title: {
    title: '爆款书名生成',
    placeholder: '请输入小说的题材和核心卖点，比如：女频现言，豪门总裁，女主带球跑，五年后带萌宝回归，虐渣爽文',
    buttonText: '生成书名',
  },
  expand: {
    title: '章纲扩写',
    placeholder: '请输入章节大纲，比如：男主在宗门比试中，被同门嘲讽废柴，结果一招击败对手，震惊全场，长老们都惊呆了，女主对他刮目相看',
    buttonText: '扩写正文',
  },
  scene: {
    title: '场景描写生成',
    placeholder: '请输入场景的核心信息，比如：玄幻小说里的宗门大殿，气势恢宏，正在举行宗门大典，有众多长老和弟子在场',
    buttonText: '生成场景',
  },
};

export default function TemplatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type') || 'outline';
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const config = templateConfig[type] || templateConfig.outline;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('请输入相关设定信息');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, prompt }),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      setResult(data.result);
    } catch (error) {
      alert('生成失败，请重试');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert('已复制到剪贴板');
  };

  const handleExport = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto w-full px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-slate-800 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">{config.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        <div className="flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4">输入设定</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-4 outline-none focus:border-indigo-500 transition-all resize-none text-base"
              placeholder={config.placeholder}
              rows={15}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? '生成中...' : config.buttonText}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">生成结果</h2>
              {result && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    复制
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    导出
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                  <p>AI正在努力生成中，请稍候...</p>
                </div>
              ) : result ? (
                <div className="whitespace-pre-wrap leading-relaxed">{result}</div>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-500">
                  <p>生成的内容将在这里显示</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
