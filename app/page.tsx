'use client';
import { useRouter } from 'next/navigation';
import { Book, PenLine, User, FileText, Sparkles, ScrollText, Palette } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const templates = [
    { id: 'editor', title: '沉浸式创作', icon: <PenLine className="w-6 h-6" />, desc: '打开编辑器，自由创作、续写、润色', color: 'bg-indigo-500' },
    { id: 'outline', title: '大纲生成', icon: <ScrollText className="w-6 h-6" />, desc: '输入题材，一键生成完整小说大纲', color: 'bg-blue-500' },
    { id: 'character', title: '人设生成', icon: <User className="w-6 h-6" />, desc: '生成饱满立体的小说人物设定卡', color: 'bg-purple-500' },
    { id: 'title', title: '书名生成', icon: <Book className="w-6 h-6" />, desc: '打造爆款书名，抓牢读者眼球', color: 'bg-pink-500' },
    { id: 'expand', title: '章纲扩写', icon: <FileText className="w-6 h-6" />, desc: '简短大纲一键扩写成千字正文', color: 'bg-orange-500' },
    { id: 'scene', title: '场景生成', icon: <Palette className="w-6 h-6" />, desc: '生成细节拉满的场景描写片段', color: 'bg-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-indigo-500 bg-clip-text text-transparent">
              星梦AI写作
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/editor')}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-all"
            >
              开始创作
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          专为网文创作者打造的AI写作助手
          <br />
          <span className="bg-gradient-to-r from-yellow-400 to-indigo-500 bg-clip-text text-transparent">
            告别卡文，轻松日更过万
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10">
          对标星月写作、白梦写作的核心能力，大纲生成、章节扩写、情节续写、AI消痕，一站式解决你的创作难题
        </p>
        <button
          onClick={() => router.push('/editor')}
          className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-lg font-medium text-lg transition-all shadow-lg shadow-indigo-600/20"
        >
          立即免费使用
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold mb-8 text-center">创作工具箱</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => router.push(template.id === 'editor' ? '/editor' : `/template?type=${template.id}`)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer group"
            >
              <div className={`${template.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {template.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{template.title}</h3>
              <p className="text-slate-400">{template.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold mb-12 text-center">核心优势</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <PenLine className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">网文专属优化</h3>
            <p className="text-slate-400">针对男频女频各类网文赛道深度优化，生成内容贴合平台爆款逻辑，直接可用</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">全流程创作支持</h3>
            <p className="text-slate-400">从书名、人设、大纲，到章节扩写、续写润色、AI消痕，覆盖创作全流程</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">沉浸式创作体验</h3>
            <p className="text-slate-400">简洁无干扰的编辑器，实时自动保存，电脑手机都能流畅创作，灵感不中断</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-800 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
          <p>© 2025 星梦AI写作 - 专为网文创作者打造</p>
        </div>
      </footer>
    </div>
  );
}
