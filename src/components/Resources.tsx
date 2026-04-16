import React, { useState } from 'react';
import { BookOpen, Phone, ExternalLink, Heart, Shield, Users, Search, X } from 'lucide-react';

const RESOURCES = [
  {
    title: "Kỹ năng quản lý áp lực học tập",
    description: "Làm thế nào để cân bằng giữa việc học và nghỉ ngơi một cách hiệu quả nhất.",
    icon: <BookOpen className="text-blue-500" />,
    link: "#"
  },
  {
    title: "Xây dựng tình bạn lành mạnh",
    description: "Cách nhận diện và duy trì những mối quan hệ tích cực trong môi trường học đường.",
    icon: <Users className="text-green-500" />,
    link: "#"
  },
  {
    title: "Vượt qua nỗi lo âu thi cử",
    description: "Những bài tập hít thở và phương pháp tâm lý giúp bạn bình tĩnh trước mọi kỳ thi.",
    icon: <Shield className="text-purple-500" />,
    link: "#"
  },
  {
    title: "Tự chăm sóc bản thân (Self-care)",
    description: "Yêu thương bản thân không phải là ích kỷ, đó là nền tảng của sức khỏe tâm thần.",
    icon: <Heart className="text-red-500" />,
    link: "#"
  }
];

const HOTLINES = [
  { name: "Tổng đài Quốc gia Bảo vệ Trẻ em", phone: "111" },
  { name: "Đường dây nóng Tư vấn Tâm lý", phone: "1900 1234" },
  { name: "Hỗ trợ Khẩn cấp", phone: "115" }
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = RESOURCES.filter(res => 
    res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h3 className="font-serif font-bold text-2xl">Thư viện Tài liệu</h3>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-olive/40" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-brand-olive/10 rounded-2xl py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-olive/20 text-sm shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-olive/40 hover:text-brand-olive"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-brand-olive/10 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-brand-cream/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {res.icon}
                </div>
                <h4 className="font-serif font-bold text-lg mb-2">{res.title}</h4>
                <p className="text-sm text-brand-olive/60 mb-4">{res.description}</p>
                <div className="flex items-center gap-1 text-brand-olive font-bold text-xs uppercase tracking-wider">
                  Đọc thêm <ExternalLink size={14} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-brand-olive/20">
            <p className="text-brand-olive/60 italic">Không tìm thấy tài liệu nào phù hợp với "{searchQuery}"</p>
          </div>
        )}
      </section>

      <section className="bg-brand-olive text-white p-8 rounded-[40px] shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-serif font-bold text-2xl mb-4">Hỗ trợ Khẩn cấp</h3>
          <p className="text-white/80 mb-6 max-w-md">Nếu bạn đang cảm thấy cực kỳ bất ổn hoặc có ý định tự hại, hãy liên hệ ngay với các đầu số sau để được trợ giúp kịp thời.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {HOTLINES.map((h, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{h.name}</p>
                <div className="flex items-center gap-2 font-bold text-xl">
                  <Phone size={18} />
                  {h.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </section>
    </div>
  );
}
