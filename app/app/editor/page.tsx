'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Sparkles, RefreshCw, Eraser, PenTool, Download } from 'lucide-react';

export default function EditorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [novelTitle, setNovelTitle] = useState('未命名作品');
  const [selectedText, setSelectedText] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: '在这里开始你的小说创作，选中文字可进行润色、消痕，也可以让AI帮你续写后续情节...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      localStorage.setItem('novel-content', content);
      localStorage.setItem('novel-title', novelTitle);
    },
    onSelectionUpdate: ({ editor }) => {
      const selection = editor.state.selection;
      const text = editor.state.doc.textBetween(selection.from, selection.to, '\n');
      setSelectedText(text);
    },
  });

  useEffect(() => {
    if (editor) {
      const savedContent = localStorage.getItem('novel-content');
      const savedTitle = localStorage.getItem('novel-title');
      if (savedContent) {
        editor.commands.setContent(savedContent);
      }
      if (savedTitle) {
        setNovelTitle(savedTitle);
      }
    }
  }, [editor]);

  const handleGenerate = async (type: string, customPrompt?: string) => {
    setLoading(true);
    try {
      const content = editor?.getText() || '';
      const body: any = { type };

      if (type === 'continue') {
        body.context = content;
      } else if (['polish', 'remove-ai'].includes(type)) {
        if (!selectedText) {
          alert('请先选中要处理的文本内容');
          setLoading(false);
          return;
        }
        body.content = selectedText;
      } else if (type === 'custom') {
        body.prompt = customPrompt;
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      if (['polish', 'remove-ai'].includes(type)) {
        editor?.commands.insertContent(data.result);
      } else {
        editor?.commands.insertContent(`\n${data.result}`);
      }

    } catch (error) {
      alert('生成失败，请重试');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const content = editor?.getText() || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${novelTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!editor) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-slate-800 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={novelTitle}
              onChange={(e) => setNovelTitle(e.target.value)}
              className="bg-transparent border-none outline-none text-lg font-medium w-64 focus:bg-slate-900 rounded-lg px-2 py-1"
              placeholder="输入作品名称"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all text-slate-300"
            >
              <Download className="w-4 h-4" />
              导出
            </button>
            <div className="w-px h-6 bg-slate-800"></div>
            <span className="text-sm text-slate-500">自动保存中</span>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-800 bg-slate-900 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto w-full px-4 py-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 border-r border-slate-800 pr-3 mr-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-slate-800 transition-all ${editor.isActive('bold') ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-300'}`}
              title="加粗"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-slate-800 transition-all ${editor.isActive('italic') ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-300'}`}
              title="斜体"
            >
              <em>I</em>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-slate-800 transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-300'}`}
              title="标题"
            >
              H2
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleGenerate('continue')}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              续写情节
            </button>
            <button
              onClick={() => handleGenerate('polish')}
              disabled={loading || !selectedText}
              className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PenTool className="w-4 h-4" />
              润色选中
            </button>
            <button
              onClick={() => handleGenerate('remove-ai')}
              disabled={loading || !selectedText}
              className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eraser className="w-4 h-4" />
              AI消痕
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <EditorContent
          editor={editor}
          className="prose prose-invert max-w-none prose-lg focus:outline-none"
        />
      </div>

      <div className="border-t border-slate-800 bg-slate-900 p-4 sticky bottom-0 z-40">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            id="custom-prompt"
            type="text"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"
            placeholder="输入自定义指令，比如：给这段内容加一个反转情节、写一段男女主吵架的对话..."
          />
          <button
            onClick={() => {
              const input = document.getElementById('custom-prompt') as HTMLInputElement;
              if (input.value.trim()) {
                handleGenerate('custom', input.value);
                input.value = '';
              }
            }}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : '发送'}
          </button>
        </div>
      </div>
    </div>
  );
}
