import { NextRequest, NextResponse } from 'next/server';

const DOUBAO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { prompt, type, content, context } = await request.json();
    const apiKey = process.env.DOUBAO_API_KEY;
    const model = process.env.DOUBAO_MODEL;

    if (!apiKey) {
      return NextResponse.json({ error: 'API密钥未配置' }, { status: 500 });
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'continue':
        systemPrompt = '你是一位资深网文创作专家，擅长男频女频各类网文创作，续写内容要贴合上下文，保持人设和剧情连贯，节奏紧凑，有冲突有看点，语言符合网文阅读习惯，拒绝生硬流水账，每次续写不少于800字。';
        userPrompt = `以下是小说的上下文内容：\n${context}\n\n请你继续往下续写后续情节，保持风格和人设一致，内容流畅有吸引力。`;
        break;
      case 'expand':
        systemPrompt = '你是一位专业的网文扩写专家，擅长把简短的章节大纲扩写成细节饱满、情节流畅的正文内容，保留大纲核心情节，丰富场景描写、人物对话、心理活动和动作细节，符合网文的叙事节奏，扩写后内容不少于1000字。';
        userPrompt = `章节大纲：${prompt}\n\n请你把这个大纲扩写成完整的网文章节正文，情节连贯，细节丰富，符合网文阅读习惯。`;
        break;
      case 'polish':
        systemPrompt = '你是一位网文润色专家，优化用户提供的文本，修正不通顺的语句，提升文字的画面感和感染力，优化对话和描写，让内容更符合网文的阅读节奏，不改变原文的核心情节和人设。';
        userPrompt = `请你润色优化以下文本：\n${content}`;
        break;
      case 'remove-ai':
        systemPrompt = '你是一位专业的文本优化专家，重写用户提供的文本，彻底去除AI生成的机械感和生硬表达，用更自然、更有网文作者个人风格的语言重写，保留原文的核心情节、人设和关键信息，降低AI检测率，让内容读起来像真人写的。';
        userPrompt = `请你对以下文本进行AI消痕重写，保留核心内容，让语言更自然流畅，更有真人写作的质感：\n${content}`;
        break;
      case 'outline':
        systemPrompt = '你是一位资深网文策划专家，根据用户的题材和核心设定，生成结构完整、逻辑清晰、有爽点有看点的小说大纲，包含核心人设、故事主线、分卷剧情、关键转折点，适配网文平台的爆款逻辑。';
        userPrompt = `小说题材/核心设定：${prompt}\n\n请你生成一份完整的网文小说大纲，包含核心设定、人物介绍、故事主线、分卷剧情规划。`;
        break;
      case 'character':
        systemPrompt = '你是一位网文人物设定专家，生成饱满立体、符合网文人设逻辑的角色卡，包含姓名、外貌、性格、身份背景、人物弧光、经典台词，适配对应的小说题材。';
        userPrompt = `人物核心设定：${prompt}\n\n请你生成一份完整的小说人物设定卡，细节饱满，适配网文创作需求。`;
        break;
      case 'title':
        systemPrompt = '你是一位网文爆款书名策划专家，根据用户的题材和核心卖点，生成10个符合平台爆款逻辑、有吸引力、抓眼球的书名，适配男频/女频不同赛道，区分不同风格。';
        userPrompt = `小说题材/核心卖点：${prompt}\n\n请你生成10个爆款书名，贴合题材，有吸引力，符合网文平台的热门风格。`;
        break;
      case 'custom':
        systemPrompt = '你是一位专业的网文创作助手，根据用户的指令，提供专业的创作帮助，贴合网文创作场景，输出内容符合用户的需求。';
        userPrompt = prompt;
        break;
      default:
        userPrompt = prompt;
    }

    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.error?.message || 'AI生成失败' }, { status: response.status });
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    return NextResponse.json({ result });
  } catch (error) {
    console.error('AI生成错误:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}
