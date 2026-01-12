import { CheckCircle2, ShieldCheck } from "lucide-react";

export default function ConsentPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-3 rounded-full">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">
          Autorização de Acesso
        </h1>
        <p className="text-center text-slate-600 mb-8">
          A plataforma <span className="font-semibold text-emerald-600">Ecosol</span> solicita permissão para acessar seu perfil básico.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
            <p className="text-sm text-slate-600">Ver seu endereço de e-mail e nome público.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
            <p className="text-sm text-slate-600">Gerenciar suas preferências de economia solidária.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors">
            Confirmar e Continuar
          </button>
          <button className="w-full bg-white hover:bg-slate-50 text-slate-500 font-medium py-3 rounded-xl border border-slate-200 transition-colors">
            Cancelar
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400 mt-6 uppercase tracking-widest">
          Ambiente Seguro Ecosol 2026
        </p>
      </div>
    </div>
  );
}