<template>
  <div class="landing">

    <!-- Nav -->
    <nav class="nav">
      <div class="nav-inner">
        <div class="nav-brand"><span class="nav-brand-icon">🐾</span> 班级宠物屋</div>
        <div class="nav-links">
          <router-link to="/login" class="btn-ghost">登录</router-link>
          <router-link to="/register" class="btn-primary">免费注册</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="container">
        <div class="hero-badge">专为幼儿园和小学管理设计</div>
        <h1 class="hero-title">把加减分<br>变成养宠物</h1>
        <p class="hero-sub">让每一次表扬都变得有仪式感。学生获得表扬，就等于给宠物喂了一顿饭——宠物吃得越多，长得越大，越好看。</p>
        <div class="hero-actions">
          <router-link to="/register" class="btn-hero-primary">免费开始使用 →</router-link>
          <router-link to="/login" class="btn-hero-ghost">已有账号，去登录</router-link>
        </div>
        <div class="hero-stats">
          <div class="stat"><span class="stat-num">50</span><span class="stat-label">种宠物</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><span class="stat-num">10</span><span class="stat-label">级成长</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><span class="stat-num">AI</span><span class="stat-label">智能辅助</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><span class="stat-num">5分钟</span><span class="stat-label">快速上手</span></div>
        </div>
      </div>
      <div class="hero-pets">
        <span v-for="pet in heroPets" :key="pet" class="hero-pet">{{ pet }}</span>
      </div>
    </section>

    <!-- Pain points -->
    <section class="section">
      <div class="container">
        <div class="section-label">解决痛点</div>
        <h2 class="section-title">为什么老师需要它</h2>
        <p class="section-sub">传统加减分方式的三个核心问题，班级宠物屋全部解决。</p>
        <div class="pain-grid">
          <div class="pain-card" v-for="pain in pains" :key="pain.title">
            <div class="pain-icon">{{ pain.icon }}</div>
            <h3>{{ pain.title }}</h3>
            <p>{{ pain.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-label">核心功能</div>
        <h2 class="section-title">四大核心模块</h2>
        <p class="section-sub">从宠物养成到 AI 辅助，每个功能都为课堂场景深度设计。</p>
        <div class="feature-grid">
          <div class="feature-card feature-card-wide">
            <div class="feature-icon">🐾</div>
            <h3>宠物养成系统</h3>
            <p>每位同学拥有一只专属宠物，从50种可爱动物中选择。每次加分就是喂食，积分积累到门槛，宠物自动进化。</p>
            <ul class="feature-list">
              <li>50种宠物，10个成长阶段，每只独立进化形态</li>
              <li>老师可自定义升级门槛，灵活适配班级节奏</li>
              <li>满级自动"毕业"，颁发电子奖状，进入荣誉墙</li>
            </ul>
            <div class="pet-preview">
              <span v-for="p in previewPets" :key="p" class="pet-emoji">{{ p }}</span>
            </div>
          </div>

          <div class="feature-card feature-card-ai">
            <div class="ai-badge">AI 亮点</div>
            <div class="feature-icon">✨</div>
            <h3>AI 智能功能</h3>
            <div class="ai-item">
              <h4>🎯 AI 一键起名</h4>
              <p>根据学生姓名和宠物种类，AI 自动生成专属萌宠名字。好听、不重复、有个性。</p>
            </div>
            <div class="ai-item">
              <h4>📄 AI 期末评语生成器</h4>
              <p>点击"AI学期总结"，5秒内生成一份措辞严谨的综合素质评价。一个班40个孩子，半小时搞定。</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>班级管理全覆盖</h3>
            <div class="mini-table">
              <div class="mini-row" v-for="f in mgmtFeatures" :key="f.name">
                <span class="mini-name">{{ f.name }}</span>
                <span class="mini-desc">{{ f.desc }}</span>
              </div>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🏆</div>
            <h3>激励闭环设计</h3>
            <p style="font-size:14px;color:#6b7280;margin-bottom:16px;">积分不只是数字，而是一套完整的正向激励体系。</p>
            <div class="flow">
              <span class="flow-step" v-for="(s, i) in flowSteps" :key="s">
                {{ s }}<span v-if="i < flowSteps.length - 1" class="flow-arrow"> → </span>
              </span>
            </div>
            <p style="font-size:13px;color:#9ca3af;margin-top:16px;">小卖部由老师自定义商品，学生用徽章兑换，既有精神激励，也有实物反馈。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Scenarios -->
    <section class="section">
      <div class="container">
        <div class="section-label">适用场景</div>
        <h2 class="section-title">哪些场合用得上</h2>
        <div class="scenario-grid">
          <div class="scenario-card" v-for="s in scenarios" :key="s.label">
            <div class="scenario-icon">{{ s.icon }}</div>
            <p>{{ s.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-label">真实反馈</div>
        <h2 class="section-title">老师怎么说</h2>
        <div class="testimonial-grid">
          <div class="testimonial" v-for="t in testimonials" :key="t.text">
            <div class="quote-mark">"</div>
            <p>{{ t.text }}</p>
            <div class="author">— {{ t.author }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Steps -->
    <section class="section">
      <div class="container">
        <div class="section-label">快速上手</div>
        <h2 class="section-title">4步开始使用</h2>
        <p class="section-sub">整个流程不超过10分钟，今天就能在课堂上用起来。</p>
        <div class="steps">
          <div class="step" v-for="(s, i) in steps" :key="s.title">
            <div class="step-num">{{ i + 1 }}</div>
            <div class="step-content">
              <h4>{{ s.title }}</h4>
              <p>{{ s.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="container">
        <h2>让每一次鼓励都看得见</h2>
        <p>今天注册，5分钟内完成班级搭建</p>
        <router-link to="/register" class="btn-cta">免费开始使用 →</router-link>
        <div class="cta-note">🐾 50种宠物 · ✨ AI智能辅助 · 📊 数据全留痕 · 🏆 激励闭环</div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>班级宠物屋 · 让课堂激励变得可视化、有趣、持久</p>
    </footer>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

onMounted(() => {
  if (auth.isLoggedIn) router.push('/')
})

const heroPets = ['🐱', '🐶', '🐼', '🐰', '🦊', '🐻', '🦜', '🐆', '🐹', '🐭']
const previewPets = ['🐱', '🐶', '🐼', '🐰', '🦊', '🐸', '🦜', '🐢']

const pains = [
  { icon: '😐', title: '学生感知弱', desc: '黑板上划正字，孩子看不到自己的进步有多具体，激励效果打折扣。' },
  { icon: '⏳', title: '激励效果短', desc: '奖励一次，热度三天，很快就没新鲜感了，难以维持长期动力。' },
  { icon: '📝', title: '期末总结难', desc: '一学期下来，每个孩子的表现靠脑子记，写评语全靠猜，耗时费力。' },
]

const mgmtFeatures = [
  { name: '多班级管理', desc: '数据互不干扰' },
  { name: '批量加减分', desc: '一键全班奖励' },
  { name: '分组管理', desc: '拖拽分组，小组加分' },
  { name: '撤回操作', desc: '手误一键撤回' },
  { name: '随机提问', desc: '课堂抽查神器' },
]

const flowSteps = ['积分加分', '宠物成长', '满级毕业', '获得徽章', '兑换商品']

const scenarios = [
  { icon: '🙋', label: '课堂纪律管理' },
  { icon: '👥', label: '小组合作评分' },
  { icon: '📋', label: '期末综合素质评价' },
  { icon: '🎉', label: '班级文化建设' },
  { icon: '👨‍👩‍👧', label: '家长开放日展示' },
]

const testimonials = [
  { text: '以前加分孩子们无感，现在一加分全班都盯着看自己的宠物有没有进化，课堂氛围完全不一样了。', author: '小学班主任' },
  { text: '期末评语用 AI 生成，改改就能用，省了我至少一天时间。质量还挺高，比我自己写的更有条理。', author: '语文老师' },
  { text: '孩子们会主动维护自己的宠物，有个小朋友还给宠物起了名字叫"小胖墩"，每天都要来看一眼。', author: '数学老师' },
]

const steps = [
  { title: '注册账号，输入卡密激活', desc: '填写用户名和密码完成注册，输入卡密激活账号。' },
  { title: '创建班级，批量导入学生名单', desc: '支持批量粘贴学生姓名，一次性完成全班录入。' },
  { title: '为每位同学分配宠物', desc: '一键随机分配，或让学生自选喜欢的宠物。' },
  { title: '开始第一次加分', desc: '点击学生卡片，选择加分规则，宠物立刻有反应。' },
]
</script>

<style scoped>
.landing { font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif; color: #1a1a2e; background: #ffffff; }

/* Nav */
.nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-bottom: 2px solid #f0e6ff; }
.nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.nav-brand { font-size: 24px; font-weight: 900; background: linear-gradient(135deg, #7c3aed, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -0.5px; display: flex; align-items: center; gap: 6px; }
.nav-brand-icon { font-size: 26px; -webkit-text-fill-color: initial; filter: drop-shadow(0 2px 4px rgba(124,58,237,0.3)); }
.nav-links { display: flex; align-items: center; gap: 12px; }
.btn-ghost { padding: 8px 18px; border-radius: 10px; font-size: 14px; font-weight: 700; color: #7c3aed; text-decoration: none; border: 2px solid #e9d5ff; transition: all 0.2s; }
.btn-ghost:hover { background: #f5f3ff; border-color: #7c3aed; }
.btn-primary { padding: 8px 20px; border-radius: 10px; font-size: 14px; font-weight: 800; background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 14px rgba(124,58,237,0.4); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(124,58,237,0.5); }

/* Hero */
.hero { position: relative; padding: 90px 24px 120px; text-align: center; overflow: hidden; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 30%, #db2777 70%, #f97316 100%); color: white; }
.hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 15% 40%, rgba(255,255,255,0.12) 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(255,200,100,0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(255,100,200,0.1) 0%, transparent 50%); }
.container { max-width: 1100px; margin: 0 auto; padding: 0 24px; position: relative; }
.hero-badge { display: inline-block; background: rgba(255,255,255,0.25); border: 1.5px solid rgba(255,255,255,0.6); border-radius: 999px; padding: 7px 22px; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 28px; backdrop-filter: blur(8px); }
.hero-title { font-size: clamp(44px, 9vw, 80px); font-weight: 900; letter-spacing: -3px; line-height: 1.05; margin-bottom: 24px; text-shadow: 0 4px 24px rgba(0,0,0,0.2); }
.hero-sub { font-size: clamp(15px, 2vw, 19px); opacity: 0.95; max-width: 580px; margin: 0 auto 40px; line-height: 1.9; }
.hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 56px; }
.btn-hero-primary { padding: 16px 36px; background: white; color: #7c3aed; border-radius: 16px; font-weight: 900; font-size: 17px; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 6px 30px rgba(0,0,0,0.25); }
.btn-hero-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
.btn-hero-ghost { padding: 16px 36px; background: rgba(255,255,255,0.18); border: 2px solid rgba(255,255,255,0.6); color: white; border-radius: 16px; font-weight: 800; font-size: 17px; text-decoration: none; transition: all 0.2s; backdrop-filter: blur(8px); }
.btn-hero-ghost:hover { background: rgba(255,255,255,0.3); transform: translateY(-2px); }
.hero-stats { display: flex; align-items: center; justify-content: center; gap: 0; flex-wrap: wrap; background: rgba(255,255,255,0.15); backdrop-filter: blur(12px); border-radius: 20px; border: 1px solid rgba(255,255,255,0.3); padding: 16px 8px; max-width: 600px; margin: 0 auto; }
.stat { padding: 0 28px; text-align: center; }
.stat-num { display: block; font-size: 30px; font-weight: 900; }
.stat-label { display: block; font-size: 12px; opacity: 0.85; margin-top: 3px; font-weight: 600; }
.stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.4); }
.hero-pets { position: absolute; bottom: 0; left: 0; right: 0; display: flex; justify-content: center; gap: 12px; padding: 16px; opacity: 0.25; font-size: 32px; pointer-events: none; }

/* Sections */
.section { padding: 80px 0; }
.section-alt { background: linear-gradient(180deg, #faf5ff 0%, #fdf2f8 100%); }
.section-label { display: inline-block; background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; font-size: 12px; font-weight: 800; letter-spacing: 2px; padding: 5px 16px; border-radius: 999px; margin-bottom: 14px; box-shadow: 0 4px 12px rgba(124,58,237,0.3); }
.section-title { font-size: clamp(26px, 4vw, 42px); font-weight: 900; margin-bottom: 10px; letter-spacing: -1px; background: linear-gradient(135deg, #1a1a2e, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.section-sub { color: #6b7280; font-size: 16px; margin-bottom: 44px; }

/* Pain */
.pain-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
.pain-card { background: white; border: 2px solid #f0e6ff; border-radius: 20px; padding: 32px 28px; box-shadow: 0 4px 24px rgba(124,58,237,0.08); transition: transform 0.2s, box-shadow 0.2s; }
.pain-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(124,58,237,0.15); }
.pain-icon { font-size: 40px; margin-bottom: 14px; }
.pain-card h3 { font-size: 18px; font-weight: 800; margin-bottom: 10px; color: #1a1a2e; }
.pain-card p { font-size: 14px; color: #6b7280; line-height: 1.8; }

/* Features */
.feature-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
@media (max-width: 768px) { .feature-grid { grid-template-columns: 1fr; } }
.feature-card { background: white; border: 2px solid #f0e6ff; border-radius: 24px; padding: 36px; box-shadow: 0 4px 24px rgba(124,58,237,0.08); transition: transform 0.2s, box-shadow 0.2s; }
.feature-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(124,58,237,0.15); }
.feature-card-ai { background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%); border-color: #d8b4fe; position: relative; }
.ai-badge { position: absolute; top: 20px; right: 20px; background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 999px; box-shadow: 0 4px 12px rgba(124,58,237,0.4); }
.feature-icon { font-size: 36px; margin-bottom: 14px; }
.feature-card h3 { font-size: 20px; font-weight: 900; margin-bottom: 12px; color: #1a1a2e; }
.feature-card p { font-size: 14px; color: #4b5563; line-height: 1.8; margin-bottom: 16px; }
.feature-list { list-style: none; padding: 0; }
.feature-list li { padding: 6px 0 6px 26px; position: relative; font-size: 14px; color: #374151; }
.feature-list li::before { content: '✓'; position: absolute; left: 0; color: #7c3aed; font-weight: 900; font-size: 15px; }
.ai-item { background: white; border-radius: 14px; padding: 18px; margin-top: 14px; border: 1.5px solid #e9d5ff; box-shadow: 0 2px 8px rgba(124,58,237,0.06); }
.ai-item h4 { font-size: 14px; font-weight: 800; margin-bottom: 7px; color: #5b21b6; }
.ai-item p { font-size: 13px; color: #4b5563; margin: 0; line-height: 1.7; }
.pet-preview { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 18px; }
.pet-emoji { font-size: 30px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
.mini-table { margin-top: 14px; }
.mini-row { display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1.5px solid #f3f0ff; font-size: 14px; }
.mini-row:last-child { border-bottom: none; }
.mini-name { font-weight: 800; color: #1a1a2e; }
.mini-desc { color: #7c3aed; font-weight: 600; }
.flow { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; align-items: center; }
.flow-step { font-size: 13px; font-weight: 700; color: #5b21b6; background: #f5f3ff; padding: 4px 12px; border-radius: 999px; border: 1.5px solid #e9d5ff; }
.flow-arrow { color: #a78bfa; font-weight: 900; }

/* Scenarios */
.scenario-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 18px; margin-top: 36px; }
.scenario-card { background: white; border: 2px solid #f0e6ff; border-radius: 18px; padding: 28px 16px; text-align: center; box-shadow: 0 4px 16px rgba(124,58,237,0.08); transition: transform 0.2s, box-shadow 0.2s; }
.scenario-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(124,58,237,0.18); border-color: #c4b5fd; }
.scenario-icon { font-size: 36px; margin-bottom: 12px; }
.scenario-card p { font-size: 13px; color: #4b5563; font-weight: 700; }

/* Testimonials */
.testimonial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 36px; }
.testimonial { background: white; border-radius: 20px; padding: 32px; box-shadow: 0 4px 24px rgba(124,58,237,0.1); position: relative; border: 2px solid #f0e6ff; transition: transform 0.2s; }
.testimonial:hover { transform: translateY(-4px); }
.quote-mark { position: absolute; top: 10px; left: 18px; font-size: 72px; background: linear-gradient(135deg, #c4b5fd, #f9a8d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: Georgia, serif; line-height: 1; }
.testimonial p { font-size: 14px; color: #374151; padding-top: 28px; line-height: 1.9; }
.author { margin-top: 16px; font-size: 13px; font-weight: 700; background: linear-gradient(135deg, #7c3aed, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

/* Steps */
.steps { max-width: 580px; margin-top: 36px; }
.step { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 28px; }
.step-num { flex-shrink: 0; width: 44px; height: 44px; background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; box-shadow: 0 6px 16px rgba(124,58,237,0.4); }
.step-content h4 { font-size: 16px; font-weight: 800; margin-bottom: 5px; color: #1a1a2e; }
.step-content p { font-size: 14px; color: #6b7280; line-height: 1.7; }

/* CTA */
.cta { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 35%, #db2777 70%, #f97316 100%); color: white; text-align: center; padding: 90px 24px; position: relative; overflow: hidden; }
.cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(255,200,100,0.1) 0%, transparent 50%); }
.cta h2 { font-size: clamp(26px, 4vw, 44px); font-weight: 900; margin-bottom: 14px; position: relative; text-shadow: 0 2px 16px rgba(0,0,0,0.2); }
.cta p { font-size: 19px; opacity: 0.95; margin-bottom: 36px; position: relative; }
.btn-cta { display: inline-block; padding: 18px 48px; background: white; color: #7c3aed; border-radius: 16px; font-weight: 900; font-size: 18px; text-decoration: none; box-shadow: 0 8px 32px rgba(0,0,0,0.25); transition: transform 0.2s, box-shadow 0.2s; position: relative; }
.btn-cta:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,0,0,0.3); }
.cta-note { margin-top: 24px; font-size: 14px; opacity: 0.8; position: relative; font-weight: 600; }

/* Footer */
.footer { background: #0f0a1e; color: #9ca3af; text-align: center; padding: 32px 24px; font-size: 13px; }
</style>
