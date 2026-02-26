import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, FileText } from "lucide-react";

const cases = [
  {
    id: "case1",
    path: "/case1",
    title: "القضية الأولى",
    subtitle: "المهمة التحليلية",
    description: "تحقيق كامل مع أدلة ومقابلات وتحليل بيانات",
    icon: <FileText className="w-8 h-8" />,
    status: "متاح",
  },
  {
    id: "qf",
    path: "/qf",
    title: "اسأل صح",
    subtitle: "تأطير المشكلة",
    description: "تعلّم تسأل الأسئلة الصح قبل ما تدور على الإجابة",
    icon: <Search className="w-8 h-8" />,
    status: "متاح",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6" dir="rtl">
      <motion.div
        className="text-center mb-12"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 font-display">
          🔍 وكالة المحقق
        </h1>
        <p className="text-muted-foreground text-lg">اختر المهمة</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
        {cases.map((c, i) => (
          <motion.button
            key={c.id}
            onClick={() => navigate(c.path)}
            className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm text-right hover:border-primary/50 transition-colors group"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                {c.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground mb-1">{c.title}</h2>
                <p className="text-sm text-primary mb-2">{c.subtitle}</p>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </div>
            </div>
            <div className="mt-4 text-xs text-success font-bold">● {c.status}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Index;
