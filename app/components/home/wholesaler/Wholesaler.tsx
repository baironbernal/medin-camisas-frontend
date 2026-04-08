'use client'
import { CircleCheck, User, Phone, MapPin, Store, Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';

const WHATSAPP_NUMBER = '573024197103';

const MayoristaSection = () => {
  const [form, setForm] = useState({
    nombre: '',
    whatsapp: '',
    ciudad: '',
    como_vende: '',
    nombre_negocio: '',
    tipo_ropa: '',
    desde_donde: '',
    email: '',
    telefono: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const lines = [
      `¡Hola! Quiero registrarme como mayorista en Medin:`,
      `👤 Nombre: ${form.nombre}`,
      `📱 WhatsApp: ${form.whatsapp}`,
      `🏙️ Ciudad: ${form.ciudad}`,
      `🛍️ Cómo vendo: ${form.como_vende}`,
      form.nombre_negocio ? `🏪 Negocio/Marca: ${form.nombre_negocio}` : null,
      `👕 Tipo de ropa: ${form.tipo_ropa}`,
      `📍 Desde dónde vendo: ${form.desde_donde}`,
      form.email ? `📧 Email: ${form.email}` : null,
      form.telefono ? `☎️ Teléfono: ${form.telefono}` : null,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
    window.open(url, '_blank');
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="container mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

      {/* Left Column — Info */}
      <div className="lg:max-w-md w-full">
        <span className="font-bold text-accent">MAYORISTA</span>
        <h2 className="mt-4 lg:mt-8 text-white lg:text-60 text-30 leading-16">
          Surte tu negocio con Medin
        </h2>

        <p className="mt-4 lg:mt-8 text-white text-sm lg:text-20 lg:max-w-xl">
          Accede a precios exclusivos, soporte personalizado y un catálogo diseñado para vender. Únete a nuestra red de distribuidores.
        </p>

        <article className="mt-4 lg:mt-8 text-white flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <CircleCheck size={16} />
            <span>Precios competitivos al por mayor</span>
          </div>
          <div className="flex gap-2 items-center">
            <CircleCheck size={16} />
            <span>Packs iniciales para emprendedores</span>
          </div>
          <div className="flex gap-2 items-center">
            <CircleCheck size={16} />
            <span>Catálogo actualizado mensualmente</span>
          </div>
          <div className="flex gap-2 items-center">
            <CircleCheck size={16} />
            <span>Atención prioritaria por WhatsApp</span>
          </div>
        </article>
      </div>

      {/* Right Column — Registration Form */}
      <div className="flex-1 w-full">
        {submitted ? (
          <div className="bg-white/10 border border-accent/40 rounded-2xl p-8 text-center">
            <CircleCheck size={48} className="text-accent mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">¡Solicitud enviada!</h3>
            <p className="text-white/70 text-sm">
              Te redirigimos a WhatsApp. Nuestro equipo se pondrá en contacto contigo pronto.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 text-accent text-sm underline underline-offset-2"
            >
              Enviar otra solicitud
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 border border-white/10 rounded-2xl p-6 lg:p-8 flex flex-col gap-4"
          >
            <h3 className="text-white font-bold text-lg mb-1">Registro Mayorista</h3>

            {/* Nombre completo */}
            <div className="flex flex-col gap-1">
              <label className="text-white/80 text-xs font-medium">
                Nombre completo <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: María García"
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col gap-1">
              <label className="text-white/80 text-xs font-medium">
                Número de WhatsApp <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 3001234567"
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            {/* Ciudad */}
            <div className="flex flex-col gap-1">
              <label className="text-white/80 text-xs font-medium">
                Ciudad donde vendes <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Medellín"
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            {/* Row: ¿Cómo vendes? + Tipo de ropa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-white/80 text-xs font-medium">
                  ¿Cómo vendes los productos? <span className="text-accent">*</span>
                </label>
                <select
                  name="como_vende"
                  value={form.como_vende}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
                >
                  <option value="" disabled className="text-gray-800">Selecciona...</option>
                  <option value="Tienda física" className="text-gray-800">Tienda física</option>
                  <option value="Instagram" className="text-gray-800">Instagram</option>
                  <option value="WhatsApp" className="text-gray-800">WhatsApp</option>
                  <option value="Personal" className="text-gray-800">Personal</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/80 text-xs font-medium">
                  ¿Qué tipo de ropa vendes? <span className="text-accent">*</span>
                </label>
                <select
                  name="tipo_ropa"
                  value={form.tipo_ropa}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
                >
                  <option value="" disabled className="text-gray-800">Selecciona...</option>
                  <option value="Hombre" className="text-gray-800">Hombre</option>
                  <option value="Dama" className="text-gray-800">Dama</option>
                  <option value="Niño" className="text-gray-800">Niño</option>
                  <option value="Mixto" className="text-gray-800">Mixto</option>
                </select>
              </div>
            </div>

            {/* ¿Desde dónde vendes? */}
            <div className="flex flex-col gap-1">
              <label className="text-white/80 text-xs font-medium">
                ¿Desde dónde vendes principalmente? <span className="text-accent">*</span>
              </label>
              <select
                name="desde_donde"
                value={form.desde_donde}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
              >
                <option value="" disabled className="text-gray-800">Selecciona...</option>
                <option value="Tienda física" className="text-gray-800">Tienda física</option>
                <option value="Redes sociales" className="text-gray-800">Redes sociales</option>
                <option value="Catálogo" className="text-gray-800">Catálogo</option>
                <option value="Otro" className="text-gray-800">Otro</option>
              </select>
            </div>

            {/* Nombre del negocio (opcional) */}
            <div className="flex flex-col gap-1">
              <label className="text-white/80 text-xs font-medium">
                Nombre de tu negocio o marca <span className="text-white/40">(opcional)</span>
              </label>
              <div className="relative">
                <Store size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  name="nombre_negocio"
                  value={form.nombre_negocio}
                  onChange={handleChange}
                  placeholder="Ej: Moda Lucía"
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            {/* Row: Email + Teléfono (opcionales) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-white/80 text-xs font-medium">
                  Email <span className="text-white/40">(opcional)</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/80 text-xs font-medium">
                  Teléfono <span className="text-white/40">(opcional)</span>
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="Ej: 6041234567"
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-accent text-primary font-semibold py-3 rounded-full hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Enviando...' : 'Enviar solicitud por WhatsApp'}
            </button>
          </form>
        )}
      </div>

    </section>
  );
};

export default MayoristaSection;
