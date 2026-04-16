import React, { useState } from 'react';
import { MessageCircle, LayoutDashboard, BookOpen, Heart, Menu, X, Sparkles } from 'lucide-react';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';
import Resources from './components/Resources';
import { cn } from './lib/utils';

type Page = 'home' | 'chat' | 'dashboard' | 'resources';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavItem = ({ page, icon: Icon, label }: { page: Page, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentPage(page);
        setIsMenuOpen(false);
      }}
      className={cn(
        "flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300",
        currentPage === page 
          ? "bg-brand-olive text-white shadow-lg shadow-brand-olive/20" 
          : "text-brand-olive/60 hover:bg-brand-olive/5 hover:text-brand-olive"
      )}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center border-b border-brand-olive/10 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-olive flex items-center justify-center text-white">
            <Heart size={18} fill="currentColor" />
          </div>
          <span className="font-serif font-bold text-xl">Tâm An</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-olive">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed inset-0 z-40 bg-brand-cream md:relative md:flex md:w-72 flex-col p-6 border-r border-brand-olive/10 transition-transform duration-300",
        isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="hidden md:flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-xl bg-brand-olive flex items-center justify-center text-white shadow-lg shadow-brand-olive/20">
            <Heart size={24} fill="currentColor" />
          </div>
          <h1 className="font-serif font-bold text-2xl tracking-tight">Tâm An</h1>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem page="home" icon={Sparkles} label="Khám phá" />
          <NavItem page="chat" icon={MessageCircle} label="Trò chuyện" />
          <NavItem page="dashboard" icon={LayoutDashboard} label="Thống kê" />
          <NavItem page="resources" icon={BookOpen} label="Tài liệu" />
        </nav>

        <div className="mt-auto p-4 bg-brand-olive/5 rounded-3xl border border-brand-olive/10">
          <p className="text-xs text-brand-olive/60 leading-relaxed italic">
            "Sức khỏe tâm thần của bạn là ưu tiên hàng đầu. Hãy để Tâm An đồng hành cùng bạn."
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">
        {currentPage === 'home' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-olive/10 text-brand-olive text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} />
                Dành cho học sinh THPT
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] text-brand-ink">
                Lắng nghe <br />
                <span className="text-brand-olive italic">tâm hồn</span> bạn.
              </h2>
              <p className="text-lg text-brand-olive/70 max-w-xl leading-relaxed">
                Tâm An là người bạn đồng hành tin cậy, giúp bạn vượt qua áp lực học tập, lo âu và tìm lại sự cân bằng trong cuộc sống.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => setCurrentPage('chat')}
                className="group bg-white p-8 rounded-[40px] shadow-sm border border-brand-olive/10 hover:shadow-xl hover:border-brand-olive/20 transition-all cursor-pointer overflow-hidden relative"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-brand-cream flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <MessageCircle className="text-brand-olive" size={28} />
                  </div>
                  <h3 className="font-serif font-bold text-2xl mb-2">Bắt đầu trò chuyện</h3>
                  <p className="text-brand-olive/60 text-sm">Chia sẻ những điều thầm kín với AI Tâm An. Chúng mình luôn ở đây lắng nghe.</p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-olive/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
              </div>

              <div 
                onClick={() => setCurrentPage('dashboard')}
                className="group bg-brand-olive p-8 rounded-[40px] shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden relative text-white"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <LayoutDashboard className="text-white" size={28} />
                  </div>
                  <h3 className="font-serif font-bold text-2xl mb-2">Theo dõi tâm trạng</h3>
                  <p className="text-white/70 text-sm">Xem lại biểu đồ cảm xúc và nhận những phân tích chuyên sâu về sức khỏe tâm thần.</p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
              </div>
            </div>

            <section className="bg-white/50 p-8 rounded-[40px] border border-brand-olive/5">
              <h4 className="font-serif font-bold text-xl mb-6">Tại sao chọn Tâm An?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="text-brand-olive font-bold text-lg">01.</div>
                  <h5 className="font-bold">Bảo mật tuyệt đối</h5>
                  <p className="text-xs text-brand-olive/60">Mọi cuộc trò chuyện đều được ẩn danh và bảo vệ quyền riêng tư của bạn.</p>
                </div>
                <div className="space-y-3">
                  <div className="text-brand-olive font-bold text-lg">02.</div>
                  <h5 className="font-bold">Công nghệ AI</h5>
                  <p className="text-xs text-brand-olive/60">Sử dụng mô hình ngôn ngữ tiên tiến để thấu hiểu và phản hồi chính xác.</p>
                </div>
                <div className="space-y-3">
                  <div className="text-brand-olive font-bold text-lg">03.</div>
                  <h5 className="font-bold">Hỗ trợ 24/7</h5>
                  <p className="text-xs text-brand-olive/60">Bất cứ khi nào bạn cần, Tâm An luôn sẵn sàng có mặt để sẻ chia.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'chat' && <Chat />}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'resources' && <Resources />}
      </main>
    </div>
  );
}
