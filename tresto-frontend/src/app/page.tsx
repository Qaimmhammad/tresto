import Image from "next/image";
import MenuBurgerIcon from "./components/menu-burger-icon";
import Link from "next/link";
import Header from "./components/header";
import { 
  MonitorSmartphone, 
  QrCode, 
  ClipboardList, 
  Store, 
  MenuSquare, 
  CreditCard,
  Armchair,
  PackageCheck,
  PlayCircle,
  ArrowLeft
} from "lucide-react";

export default function Home() {
  return (
    <div dir="rtl" className="bg-[#FAFAFA] text-foreground font-sans min-h-screen">
      <Header />      

      <main className="pb-24">
        {/* Hero Section */}
        <section className="px-6 md:px-12 pt-16 pb-12 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-black text-[#1A1A1A] leading-[1.2] mb-6">
            مطعمك، فروعك،<br/><span>وجباتك</span><br/>
            <span className="text-primary">بمكان واحد</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            دير مطعمك من مكان واحد! تقنية تلبي احتياجاتك. تعرف على ما تقدمه آي كيو منيو، الخيار الذكي.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/login" className="bg-primary hover:bg-primary/90 hover:cursor-pointer text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
              ابدأ الآن
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="px-6 md:px-12 py-12 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-[#4B2763]">لوحة تحكم</h2>
              <span className="bg-red-50 text-primary text-xs font-bold px-3 py-1 rounded-full">مباشر</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              
              <div className="bg-gray-50/50 rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-100 hover:border-primary/20 transition-colors">
                <PackageCheck className="w-10 h-10 text-gray-400 mb-4" />
                <span className="text-4xl font-black text-gray-800 mb-1">124</span>
                <span className="text-gray-500 font-medium">طلبات اليوم</span>
              </div>
            </div>

            <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
              <ClipboardList className="w-5 h-5" />
              عرض جميع الطلبات
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 md:px-12 py-16 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">مميزات متكاملة</h2>
          <p className="text-gray-500 mb-12">كل ما تحتاجه للارتقاء بمطعمك وإدارته بكفاءة</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
            {[
              { icon: MonitorSmartphone, title: 'المنيو الرقمي', desc: 'عرض قائمة طعامك بطريقة عصرية جذابة.' },
              { icon: QrCode, title: 'طلبات  QR', desc: 'استقبل طلبات من خلال QR.' },
              { icon: ClipboardList, title: 'إدارة الطلبات', desc: 'تتبع طلبات العملاء في الوقت الفعلي.' },
              { icon: Store, title: 'إدارة الفروع', desc: 'إدارة فروع مطعمك من لوحة تحكم واحدة.' },
              { icon: MenuSquare, title: 'إدارة المنيو', desc: 'تحديث الأطباق والأسعار بسهولة تامة.' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all group">
                <div className="bg-[#F8F5FB] w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-[#4B2763]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works Section */}
        <section className="px-6 md:px-12 py-8 bg-[#FBF9FE] mt-12 border-y border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-16">كيف يعمل؟</h2>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
              <div className="hidden md:block absolute top-1/2 right-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
              
              {[
                { step: '01', title: 'انشاء حساب جديد' },
                { step: '02', title: 'لوحة تحكم' },
                { step: '03', title: 'تنزيل QR Code' },
                { step: '04', title: 'استقبل الطلبات' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center bg-[#FBF9FE] px-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black mb-4 border-[3px] bg-white transition-colors ${idx === 0 ? 'border-[#4B2763] text-[#4B2763]' : 'border-gray-200 text-gray-400'}`}>
                    {item.step}
                  </div>
                  <h4 className={`font-bold text-lg ${idx === 0 ? 'text-[#4B2763]' : 'text-gray-500'}`}>{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-8">جاهز لرقمنة مطعمك؟</h2>
          <Link href={"/login"} className="hover:cursor-pointer bg-primary hover:bg-primary/90 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 mx-auto mb-16">
            ابدأ الآن
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-100 pt-8 gap-6">
            <div className="text-[#4B2763] text-2xl font-black tracking-tight">
              آي كيو منيو
            </div>
            <div className="flex gap-6 text-gray-500 font-medium">
              <a href="#" className="hover:text-primary transition-colors">المميزات</a>
              <a href="#" className="hover:text-primary transition-colors">الأسعار</a>
              <a href="#" className="hover:text-primary transition-colors">اتصل بنا</a>
              <a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a>
            </div>
          </div>
          <div className="text-gray-400 text-sm mt-8">
            © 2024 آي كيو منيو. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
}
