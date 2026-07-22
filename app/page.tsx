'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { 
  Search, MapPin, Heart, MessageSquare, Bell, 
  Menu, ChevronLeft, ChevronRight, Star, Plus, 
  X, Check, ArrowRight, ShieldCheck, Map, 
  MessageCircle, HelpCircle, Send, UserCheck, 
  Sparkles, Smartphone, Eye, EyeOff, LayoutGrid, Calendar,
  Filter, Trash2, SlidersHorizontal, CheckCircle2,
  Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPinned, Lock,
  ChevronDown, LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

// --- COLOR PALETTE & DESIGN SYSTEM ---
// Base Colors from the publica.pe Logo:
// - Purple (Morado): #5D32B8 (Brand Accent 1 - Elegance, trust & structure)
// - Orange (Naranja): #FF5A00 (Brand Accent 2 - Call to actions, energy & youth)
// - Teal (Verde Azulado): #00BA9D (Brand Accent 3 - Quality, safety & cleanliness)
// - Yellow (Amarillo): #FFB800 (Contrast element - Accentuation)
// - Slate (Gris Oscuro): #2D3748 (Neutral base - Readability & structure)

const MAIN_CATEGORIES = [
  {
    name: 'Vehículos',
    icon: '🚗',
    color: '#FF5A00',
    bgActive: 'bg-[#FF5A00]/10',
    textActive: 'text-[#FF5A00]',
    ringActive: 'ring-[#FF5A00]',
    hoverBg: 'group-hover:bg-[#FF5A00]/5',
    hoverText: 'group-hover:text-[#FF5A00]',
    subcategories: [
      { name: 'Autos y Camionetas', icon: '🚘', originalName: 'Vehículos' },
      { name: 'Motos y Trimóviles', icon: '🏍️', originalName: 'Vehículos' },
      { name: 'Accesorios y Repuestos', icon: '🔧', originalName: 'Vehículos' },
      { name: 'Otros Vehículos', icon: '🚚', originalName: 'Vehículos' }
    ]
  },
  {
    name: 'Inmuebles',
    icon: '🏠',
    color: '#2D3748',
    bgActive: 'bg-[#2D3748]/10',
    textActive: 'text-[#2D3748]',
    ringActive: 'ring-[#2D3748]',
    hoverBg: 'group-hover:bg-[#2D3748]/5',
    hoverText: 'group-hover:text-[#2D3748]',
    subcategories: [
      { name: 'Casas y Terrenos', icon: '🏡', originalName: 'Inmuebles' },
      { name: 'Departamentos', icon: '🏢', originalName: 'Inmuebles' },
      { name: 'Alquileres', icon: '🔑', originalName: 'Inmuebles' },
      { name: 'Locales Comerciales', icon: '🏪', originalName: 'Inmuebles' }
    ]
  },
  {
    name: 'Empleos y Servicios',
    icon: '💼',
    color: '#5D32B8',
    bgActive: 'bg-[#5D32B8]/10',
    textActive: 'text-[#5D32B8]',
    ringActive: 'ring-[#5D32B8]',
    hoverBg: 'group-hover:bg-[#5D32B8]/5',
    hoverText: 'group-hover:text-[#5D32B8]',
    subcategories: [
      { name: 'Empleo', icon: '💼', originalName: 'Empleo' },
      { name: 'Servicios', icon: '📦', originalName: 'Servicios' }
    ]
  },
  {
    name: 'Marketplace',
    icon: '🛍️',
    color: '#00BA9D',
    bgActive: 'bg-[#00BA9D]/10',
    textActive: 'text-[#00BA9D]',
    ringActive: 'ring-[#00BA9D]',
    hoverBg: 'group-hover:bg-[#00BA9D]/5',
    hoverText: 'group-hover:text-[#00BA9D]',
    subcategories: [
      { name: 'Tecnología', icon: '💻', originalName: 'Tecnología' },
      { name: 'Celulares', icon: '📱', originalName: 'Celulares' },
      { name: 'Hogar', icon: '🛋️', originalName: 'Hogar' },
      { name: 'Moda', icon: '👕', originalName: 'Moda' },
      { name: 'Gaming', icon: '🎮', originalName: 'Gaming' },
      { name: 'Herramientas', icon: '🔧', originalName: 'Herramientas' },
      { name: 'Mascotas', icon: '🐶', originalName: 'Mascotas' },
      { name: 'Deportes', icon: '🚲', originalName: 'Deportes' }
    ]
  }
];

const CATEGORIES = [
  { name: 'Tecnología', icon: '💻', bgActive: 'bg-[#00BA9D]/10', textActive: 'text-[#00BA9D]', ringActive: 'ring-[#00BA9D]', hoverBg: 'group-hover:bg-[#00BA9D]/5', hoverText: 'group-hover:text-[#00BA9D]' },
  { name: 'Celulares', icon: '📱', bgActive: 'bg-[#5D32B8]/10', textActive: 'text-[#5D32B8]', ringActive: 'ring-[#5D32B8]', hoverBg: 'group-hover:bg-[#5D32B8]/5', hoverText: 'group-hover:text-[#5D32B8]' },
  { name: 'Vehículos', icon: '🚗', bgActive: 'bg-[#FF5A00]/10', textActive: 'text-[#FF5A00]', ringActive: 'ring-[#FF5A00]', hoverBg: 'group-hover:bg-[#FF5A00]/5', hoverText: 'group-hover:text-[#FF5A00]' },
  { name: 'Inmuebles', icon: '🏠', bgActive: 'bg-[#2D3748]/10', textActive: 'text-[#2D3748]', ringActive: 'ring-[#2D3748]', hoverBg: 'group-hover:bg-[#2D3748]/5', hoverText: 'group-hover:text-[#2D3748]' },
  { name: 'Hogar', icon: '🛋️', bgActive: 'bg-[#FFB800]/10', textActive: 'text-[#FFB800]', ringActive: 'ring-[#FFB800]', hoverBg: 'group-hover:bg-[#FFB800]/5', hoverText: 'group-hover:text-[#FFB800]' },
  { name: 'Moda', icon: '👕', bgActive: 'bg-[#5D32B8]/10', textActive: 'text-[#5D32B8]', ringActive: 'ring-[#5D32B8]', hoverBg: 'group-hover:bg-[#5D32B8]/5', hoverText: 'group-hover:text-[#5D32B8]' },
  { name: 'Gaming', icon: '🎮', bgActive: 'bg-[#00BA9D]/10', textActive: 'text-[#00BA9D]', ringActive: 'ring-[#00BA9D]', hoverBg: 'group-hover:bg-[#00BA9D]/5', hoverText: 'group-hover:text-[#00BA9D]' },
  { name: 'Herramientas', icon: '🔧', bgActive: 'bg-[#2D3748]/10', textActive: 'text-[#2D3748]', ringActive: 'ring-[#2D3748]', hoverBg: 'group-hover:bg-[#2D3748]/5', hoverText: 'group-hover:text-[#2D3748]' },
  { name: 'Mascotas', icon: '🐶', bgActive: 'bg-[#FFB800]/10', textActive: 'text-[#FFB800]', ringActive: 'ring-[#FFB800]', hoverBg: 'group-hover:bg-[#FFB800]/5', hoverText: 'group-hover:text-[#FFB800]' },
  { name: 'Empleo', icon: '💼', bgActive: 'bg-[#5D32B8]/10', textActive: 'text-[#5D32B8]', ringActive: 'ring-[#5D32B8]', hoverBg: 'group-hover:bg-[#5D32B8]/5', hoverText: 'group-hover:text-[#5D32B8]' },
  { name: 'Servicios', icon: '📦', bgActive: 'bg-[#FF5A00]/10', textActive: 'text-[#FF5A00]', ringActive: 'ring-[#FF5A00]', hoverBg: 'group-hover:bg-[#FF5A00]/5', hoverText: 'group-hover:text-[#FF5A00]' },
  { name: 'Deportes', icon: '🚲', bgActive: 'bg-[#00BA9D]/10', textActive: 'text-[#00BA9D]', ringActive: 'ring-[#00BA9D]', hoverBg: 'group-hover:bg-[#00BA9D]/5', hoverText: 'group-hover:text-[#00BA9D]' },
];

const isProductInSelectedCategory = (productCategory: string, selCategory: string) => {
  if (selCategory === 'Favoritos') return false;
  
  // Try to find if selCategory matches a main category name
  const mainCat = MAIN_CATEGORIES.find(m => m.name === selCategory);
  if (mainCat) {
    return (
      productCategory === mainCat.name ||
      mainCat.subcategories.some(sub => sub.name === productCategory || sub.originalName === productCategory)
    );
  }
  
  // Try to find if selCategory matches any subcategory name
  for (const main of MAIN_CATEGORIES) {
    const sub = main.subcategories.find(s => s.name === selCategory);
    if (sub) {
      return productCategory === sub.name || productCategory === sub.originalName;
    }
  }
  
  return productCategory === selCategory;
};

const INITIAL_FEATURED_PRODUCTS = [
  {
    id: 'f_re1',
    title: 'Arnaldo Panizo 195, Pueblo Libre',
    price: 268000,
    location: 'Pueblo Libre, Lima',
    condition: 'Nuevo',
    store: 'MAKE INMOBILIARIA',
    rating: 5.0,
    category: 'Inmuebles',
    emoji: '🏢',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=80',
    imageBg: 'from-purple-500/10 to-indigo-500/10',
    tag: 'Destacado',
    description: 'Tu nuevo depa en Pueblo Libre. Proyecto Arnaldo Panizo 195. El departamento que estabas buscando en una de las mejores zonas de Pueblo Libre.'
  },
  {
    id: 'f_re2',
    title: 'Av. Razuri 243, San Miguel',
    price: 325000,
    location: 'San Miguel, Lima',
    condition: 'Nuevo',
    store: 'Urbalima',
    rating: 4.9,
    category: 'Inmuebles',
    emoji: '🏢',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80',
    imageBg: 'from-slate-500/10 to-zinc-600/10',
    tag: 'Destacado',
    description: 'Proyecto Maranga Etapa III. Departamentos exclusivos de estreno con excelente distribución, iluminación natural y acabados premium.'
  },
  {
    id: 'f1',
    title: 'MacBook Air M2 13"',
    price: 4299,
    location: 'Lima, Lima',
    condition: 'Nuevo',
    store: 'TecnoStore',
    rating: 4.9,
    category: 'Tecnología',
    emoji: '💻',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80',
    imageBg: 'from-blue-500/10 to-indigo-500/10',
    tag: 'Destacado',
    description: 'MacBook Air con chip M2 de Apple, CPU de 8 núcleos, GPU de 10 núcleos, 8 GB de memoria unificada y 256 GB de almacenamiento SSD. Ultrafino, silencioso y con hasta 18 horas de batería para máxima productividad.'
  },
  {
    id: 'f2',
    title: 'Toyota Corolla 2022',
    price: 76900,
    location: 'Arequipa, Arequipa',
    condition: 'Usado',
    store: 'AutoPerú',
    rating: 4.8,
    category: 'Vehículos',
    emoji: '🚗',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80',
    imageBg: 'from-slate-500/10 to-zinc-600/10',
    tag: 'Destacado',
    description: 'Toyota Corolla versión semifull, motor 1.6L dual VVT-i, transmisión mecánica, lunas eléctricas, mandos en el timón, pantalla táctil con Android Auto y Apple CarPlay. Único dueño, mantenimientos al día.'
  },
  {
    id: 'f3',
    title: 'iPhone 14 Pro 128GB',
    price: 3199,
    location: 'Trujillo, La Libertad',
    condition: 'Usado',
    store: 'MovilShop',
    rating: 4.9,
    category: 'Celulares',
    emoji: '📱',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=80',
    imageBg: 'from-purple-500/10 to-pink-500/10',
    tag: 'Destacado',
    description: 'iPhone 14 Pro en excelente estado, color morado oscuro. Batería al 92% de salud. Pantalla Super Retina XDR con Dynamic Island siempre activa. Cámara principal de 48 megapíes y chip A16 Bionic súper rápido.'
  },
  {
    id: 'f4',
    title: 'Sofá Seccional Moderno',
    price: 1599,
    location: 'Lima, Lima',
    condition: 'Nuevo',
    store: 'Hogar & Estilo',
    rating: 4.7,
    category: 'Hogar',
    emoji: '🛋️',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80',
    imageBg: 'from-amber-500/10 to-yellow-600/10',
    tag: 'Destacado',
    description: 'Sofá seccional de diseño contemporáneo, tapizado en tela de microfibra de alta calidad, resistente al desgaste y fácil de limpiar. Estructura de madera tornillo curada y relleno de espuma de alta densidad.'
  },
  {
    id: 'f5',
    title: 'PlayStation 5 Digital',
    price: 1899,
    location: 'Cusco, Cusco',
    condition: 'Nuevo',
    store: 'GameWorld',
    rating: 4.9,
    category: 'Gaming',
    emoji: '🎮',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=500&q=80',
    imageBg: 'from-blue-600/10 to-cyan-500/10',
    tag: 'Destacado',
    description: 'Consola PlayStation 5 Edición Digital. Experimenta cargas ultrarrápidas con un SSD de velocidad ultraalta, una inmersión más profunda con soporte para respuesta háptica, gatillos adaptables y audio 3D.'
  }
];

const INITIAL_VEHICLES = [
  { id: 'v1', title: 'Toyota Hilux 2022', price: 145900, location: 'Lima, Lima', condition: 'Usado', emoji: '🛻', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80', imageBg: 'from-zinc-500/10 to-neutral-600/10', category: 'Vehículos', store: 'AutoPerú', rating: 4.8, description: 'Camioneta Toyota Hilux doble cabina, tracción 4x4, motor turbodiésel 2.4L. Equipada con barra antivuelco, estribos, protector de tolva y llantas todo terreno. Ideal para trabajo pesado o viajes familiares.' },
  { id: 'v2', title: 'Kia Sportage 2021', price: 98500, location: 'Arequipa, Arequipa', condition: 'Usado', emoji: '🚙', image: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&w=500&q=80', imageBg: 'from-teal-500/10 to-cyan-600/10', category: 'Vehículos', store: 'AutoSur', rating: 4.6, description: 'Kia Sportage motor 2.0L con transmisión automática secuencial. Aire acondicionado bizona, cámara de retroceso, sensores de parqueo y techo panorámico sunroof. En perfectas condiciones estéticas y mecánicas.' },
  { id: 'v3', title: 'Hyundai Tucson 2022', price: 107900, location: 'Trujillo, La Libertad', condition: 'Usado', emoji: '🚘', image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=500&q=80', imageBg: 'from-blue-500/10 to-indigo-600/10', category: 'Vehículos', store: 'NorteAutos', rating: 4.7, description: 'All New Hyundai Tucson con diseño futurista paramétrico. Luces diurnas ocultas, motor Smartstream 2.0L, mandos digitales interiores, frenado de emergencia autónomo y alertas de punto ciego.' },
  { id: 'v4', title: 'Nissan Versa 2021', price: 54900, location: 'Piura, Piura', condition: 'Usado', emoji: '🚗', image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=500&q=80', imageBg: 'from-rose-500/10 to-red-600/10', category: 'Vehículos', store: 'SolCars', rating: 4.5, description: 'Nissan Versa versión Exclusive. Transmisión automática CVT, asientos de cuero con calefacción, seis bolsas de aire y frenado automático de emergencia. Excelente consumo de combustible ideal para ciudad.' },
  { id: 'v5', title: 'Yamaha MT-03 2022', price: 24900, location: 'Chiclayo, Lambayeque', condition: 'Usado', emoji: '🏍️', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80', imageBg: 'from-amber-500/10 to-orange-600/10', category: 'Vehículos', store: 'MotoXpress', rating: 4.9, description: 'Naked deportiva Yamaha MT-03 con motor bicilíndrico de 321cc, refrigerado por líquido. Luces Full LED de diseño agresivo, frenos ABS de doble canal y suspensión delantera invertida. Documentos al día.' },
  { id: 'v6', title: 'Honda CB500 2021', price: 28900, location: 'Lima, Lima', condition: 'Usado', emoji: '🏍️', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=500&q=80', imageBg: 'from-emerald-500/10 to-teal-600/10', category: 'Vehículos', store: 'LimaMotos', rating: 4.8, description: 'Honda CB500X ideal para viajes y aventura trail. Motor bicilíndrico de 471cc compatible con licencia A2, embrague antirrebote, pantalla LCD y excelente autonomía de combustible.' }
];

const INITIAL_TECHNOLOGY = [
  { id: 't1', title: 'MacBook Pro 14" M3', price: 8999, location: 'Lima, Lima', condition: 'Nuevo', emoji: '💻', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80', imageBg: 'from-slate-500/10 to-slate-700/10', category: 'Tecnología', store: 'TecnoStore', rating: 4.9, description: 'MacBook Pro de 14 pulgadas con el chip M3 de Apple. CPU de 8 núcleos, GPU de 10 núcleos con trazado de rayos acelerado por hardware, 8 GB de memoria unificada y 512 GB de SSD súper veloz.' },
  { id: 't2', title: 'Laptop Gamer RTX 4060', price: 5499, location: 'Arequipa, Arequipa', condition: 'Nuevo', emoji: '🎮', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=500&q=80', imageBg: 'from-violet-500/10 to-purple-600/10', category: 'Tecnología', store: 'EpicGames', rating: 4.7, description: 'Laptop Gamer equipada con procesador Intel Core i7 de 13ra generación, tarjeta de video dedicada NVIDIA GeForce RTX 4060, 16GB de memoria RAM DDR5 y pantalla de 165Hz para la mejor experiencia competitiva.' },
  { id: 't3', title: 'iPhone 15 Pro 256GB', price: 4799, location: 'Trujillo, La Libertad', condition: 'Nuevo', emoji: '📱', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80', imageBg: 'from-stone-500/10 to-stone-700/10', category: 'Celulares', store: 'ApplePe', rating: 4.9, description: 'iPhone 15 Pro con chasis de titanio de calidad aeroespacial, el revolucionario chip A17 Pro, un botón de acción personalizable y el sistema de cámara de iPhone más potente hasta la fecha.' },
  { id: 't4', title: 'Samsung Galaxy S24', price: 3499, location: 'Lima, Lima', condition: 'Nuevo', emoji: '📱', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80', imageBg: 'from-indigo-500/10 to-sky-600/10', category: 'Celulares', store: 'SamsungPe', rating: 4.8, description: 'Samsung Galaxy S24 con Galaxy AI integrado para traducciones en tiempo real, asistente de fotos y búsqueda inteligente. Pantalla Dynamic AMOLED 2X de alta frecuencia y batería de larga duración.' },
  { id: 't5', title: 'NVIDIA RTX 4060 Ti', price: 2199, location: 'Lima, Lima', condition: 'Nuevo', emoji: '🔌', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80', imageBg: 'from-emerald-500/10 to-green-600/10', category: 'Tecnología', store: 'NvidiaStore', rating: 4.9, description: 'Tarjeta gráfica de escritorio NVIDIA GeForce RTX 4060 Ti de 8GB GDDR6. Compatible con DLSS 3, Ray Tracing avanzado de tercera generación, optimizada para creadores de contenido y gamers exigentes.' },
  { id: 't6', title: 'Monitor 27" 144Hz', price: 899, location: 'Arequipa, Arequipa', condition: 'Nuevo', emoji: '🖥️', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80', imageBg: 'from-gray-500/10 to-neutral-600/10', category: 'Tecnología', store: 'ScreenWorld', rating: 4.6, description: 'Monitor gamer de 27 pulgadas con resolución Full HD IPS, tasa de refresco ultra fluida de 144Hz y tiempo de respuesta de 1ms. Compatible con AMD FreeSync Premium y HDR10.' },
  { id: 't7', title: 'Impresora Epson L3250', price: 699, location: 'Callao, Callao', condition: 'Nuevo', emoji: '🖨️', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=500&q=80', imageBg: 'from-gray-400/10 to-gray-600/10', category: 'Tecnología', store: 'OfiSolutions', rating: 4.5, description: 'Impresora multifuncional 3 en uno Epson EcoTank L3250 con conectividad inalámbrica Wi-Fi Direct. Imprime miles de páginas de alta calidad con bajo costo de tinta gracias a los tanques integrados.' },
  { id: 't8', title: 'Cámara Sony A6400', price: 3199, location: 'Cusco, Cusco', condition: 'Nuevo', emoji: '📷', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80', imageBg: 'from-zinc-500/10 to-zinc-700/10', category: 'Tecnología', store: 'FotoPro', rating: 4.8, description: 'Cámara Mirrorless Sony Alpha 6400 con lente de kit 16-50mm. Enfoque automático ultrarrápido de 0.02s con seguimiento ocular en tiempo real, ideal para creadores de contenido, vloggers y fotógrafos.' }
];

const INITIAL_NEW_PRODUCTS = [
  { id: 'n1', title: 'Freidora de Aire', price: 299, location: 'Lima, Lima', condition: 'Nuevo', emoji: '🍳', image: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=300&q=80', imageBg: 'from-orange-500/10 to-amber-600/10', category: 'Hogar', store: 'HomeComfort', rating: 4.6, description: 'Freidora de aire digital con capacidad de 4.5 litros, pantalla táctil con 8 funciones preestablecidas y tecnología de circulación rápida de calor para preparar tus platos favoritos de forma saludable sin aceite.' },
  { id: 'n2', title: 'Bicicleta Montañera', price: 699, location: 'Lima, Lima', condition: 'Nuevo', emoji: '🚲', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=300&q=80', imageBg: 'from-sky-500/10 to-blue-600/10', category: 'Deportes', store: 'BikePro', rating: 4.7, description: 'Bicicleta de montaña aro 29 con marco de aluminio resistente, suspensión delantera con bloqueo, frenos de disco mecánicos y transmisión de 21 velocidades Shimano. Perfecta para rutas urbanas y senderos.' },
  { id: 'n3', title: 'Zapatillas Nike Air', price: 399, location: 'Lima, Lima', condition: 'Nuevo', emoji: '👟', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80', imageBg: 'from-rose-500/10 to-red-600/10', category: 'Moda', store: 'FootRun', rating: 4.8, description: 'Zapatillas para correr Nike Air Max con amortiguación premium de aire visible, parte superior de malla transpirable y suela de tracción duradera para máxima comodidad en tus entrenamientos diarios.' },
  { id: 'n4', title: 'Smart TV 55" 4K', price: 1199, location: 'Lima, Lima', condition: 'Nuevo', emoji: '📺', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=300&q=80', imageBg: 'from-indigo-500/10 to-purple-600/10', category: 'Tecnología', store: 'TelevisiónPe', rating: 4.7, description: 'Televisor inteligente Smart TV de 55 pulgadas con resolución Ultra HD 4K, HDR10+, sistema operativo webOS con acceso rápido a Netflix, YouTube, Disney+ y asistentes de voz incorporados.' },
  { id: 'n5', title: 'Refrigeradora LG', price: 2499, location: 'Lima, Lima', condition: 'Nuevo', emoji: '🧊', image: 'https://images.unsplash.com/photo-1571175432267-efb92b4c682a?auto=format&fit=crop&w=300&q=80', imageBg: 'from-slate-400/10 to-slate-600/10', category: 'Hogar', store: 'ElectroHogar', rating: 4.8, description: 'Refrigeradora LG No Frost de 315 litros con compresor Smart Inverter que ahorra hasta un 36% de energía. Sistema DoorCooling+ para un enfriamiento uniforme y cajón Moist Balance Crisper.' },
  { id: 'n6', title: 'Lavadora Samsung', price: 1799, location: 'Lima, Lima', condition: 'Nuevo', emoji: '🧼', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=300&q=80', imageBg: 'from-blue-400/10 to-cyan-500/10', category: 'Hogar', store: 'SamsungHome', rating: 4.7, description: 'Lavadora de carga superior Samsung de 13kg con tecnología de tambor de diamante y cascadas de agua potentes para lavar tu ropa profundamente protegiendo los tejidos más delicados.' },
  { id: 'n7', title: 'Audífonos Sony WH', price: 899, location: 'Lima, Lima', condition: 'Nuevo', emoji: '🎧', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80', imageBg: 'from-gray-500/10 to-gray-700/10', category: 'Tecnología', store: 'SonyPe', rating: 4.9, description: 'Audífonos inalámbricos Sony WH-CH720N con cancelación activa de ruido inteligente Dual Noise Sensor. Hasta 35 horas de batería, carga rápida y ecualizador personalizable desde la app móvil.' },
  { id: 'n8', title: 'Mesa de Comedor', price: 1399, location: 'Lima, Lima', condition: 'Nuevo', emoji: '🪑', image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=300&q=80', imageBg: 'from-amber-500/10 to-amber-700/10', category: 'Hogar', store: 'DecorPerú', rating: 4.6, description: 'Juego de comedor moderno para 6 personas con mesa de vidrio templado de alta resistencia y patas de metal revestidas en textura maderada. Incluye 6 sillas tapizadas en tela gris lavable.' }
];

const INITIAL_USED_PRODUCTS = [
  { id: 'u1', title: 'iPhone 12 64GB', price: 1599, location: 'Lima, Lima', condition: 'Usado', emoji: '📱', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=300&q=80', imageBg: 'from-emerald-500/10 to-teal-600/10', category: 'Celulares', store: 'CelularesPe', rating: 4.5, description: 'iPhone 12 de 64GB libre de fábrica para todos los operadores nacionales. Color azul marino, pantalla impecable sin rasguños, batería al 85% de salud original. Se entrega con cable original.' },
  { id: 'u2', title: 'Laptop Lenovo i5', price: 1099, location: 'Arequipa, Arequipa', condition: 'Usado', emoji: '💻', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80', imageBg: 'from-slate-500/10 to-slate-700/10', category: 'Tecnología', store: 'LapStore', rating: 4.4, description: 'Laptop Lenovo IdeaPad 3 con procesador Intel Core i5 de 11ra generación, 8GB de RAM, disco sólido SSD de 256GB y pantalla antirreflejos de 15.6 pulgadas. Ideal para estudios universitarios.' },
  { id: 'u3', title: 'Bicicleta Urbana', price: 430, location: 'Lima, Lima', condition: 'Usado', emoji: '🚲', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=300&q=80', imageBg: 'from-orange-500/10 to-red-600/10', category: 'Deportes', store: 'CicloBikes', rating: 4.3, description: 'Bicicleta urbana clásica aro 26 con canastilla delantera, guardabarros, parrilla trasera y luces reflectivas. Ideal para transporte urbano diario. Requiere mantenimiento básico de frenos.' },
  { id: 'u4', title: 'Sofá 3 Cuerpos', price: 499, location: 'Lima, Lima', condition: 'Usado', emoji: '🛋️', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=300&q=80', imageBg: 'from-amber-500/10 to-orange-600/10', category: 'Hogar', store: 'HogarSeguro', rating: 4.2, description: 'Sofá de 3 cuerpos de tapiz rústico color marrón. Cómodo y amplio, estructura en perfectas condiciones, detalles de desgaste menores en los brazos por el uso ordinario.' },
  { id: 'u5', title: 'Guitarra Yamaha', price: 499, location: 'Callao, Callao', condition: 'Usado', emoji: '🎸', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=300&q=80', imageBg: 'from-yellow-500/10 to-amber-600/10', category: 'Deportes', store: 'MusicCenter', rating: 4.7, description: 'Guitarra acústica Yamaha C40, la mejor guitarra clásica recomendada para principiantes por su excelente sonido equilibrado y suavidad de cuerdas. Se entrega con estuche acolchado.' },
  { id: 'u6', title: 'Cámara Canon T6', price: 1199, location: 'Lima, Lima', condition: 'Usado', emoji: '📷', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80', imageBg: 'from-zinc-500/10 to-zinc-700/10', category: 'Tecnología', store: 'KamerPe', rating: 4.5, description: 'Cámara réflex DSLR Canon EOS Rebel T6 con lente básico de 18-55mm IS II. Incluye batería original, cargador, correa para el cuello y memoria SD de 32GB de regalo. Perfecta para aprender fotografía.' },
  { id: 'u7', title: 'PlayStation 4 Pro', price: 1099, location: 'Cusco, Cusco', condition: 'Usado', emoji: '🎮', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80', imageBg: 'from-blue-500/10 to-indigo-600/10', category: 'Gaming', store: 'GamerStore', rating: 4.6, description: 'Consola PlayStation 4 Pro de 1TB de almacenamiento con soporte para resolución dinámica 4K HDR. Se entrega con un mando DualShock 4 original y 2 juegos en disco físico de regalo.' },
  { id: 'u8', title: 'Escritorio Ejecutivo', price: 399, location: 'Lima, Lima', condition: 'Usado', emoji: '🗄️', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=300&q=80', imageBg: 'from-stone-500/10 to-stone-700/10', category: 'Hogar', store: 'OfiHogar', rating: 4.4, description: 'Escritorio ejecutivo de melamina gruesa de 18mm con diseño flotante elegante, incluye tres cajones espaciosos con cerradura y jaladores metálicos. Prácticamente nuevo.' }
];

const BRANDS = [
  { name: 'Apple', logo: '', icon: '📱', slogan: 'iOS & Mac', color: 'text-black bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-black' },
  { name: 'Samsung', logo: 'SAMSUNG', icon: '📱', slogan: 'Tecnología', color: 'text-[#0051BA] bg-[#0051BA]/5 hover:bg-[#0051BA]/10 border-[#0051BA]/20 hover:border-[#0051BA]' },
  { name: 'Xiaomi', logo: 'mi', icon: '📱', slogan: 'Móviles', color: 'text-[#FF6900] bg-[#FF6900]/5 hover:bg-[#FF6900]/10 border-[#FF6900]/20 hover:border-[#FF6900]' },
  { name: 'Sony', logo: 'SONY', icon: '📷', slogan: 'Audio & Foto', color: 'text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border-neutral-300 hover:border-black' },
  { name: 'Lenovo', logo: 'Lenovo', icon: '💻', slogan: 'Laptops', color: 'text-[#5D32B8] bg-[#5D32B8]/5 hover:bg-[#5D32B8]/10 border-[#5D32B8]/20 hover:border-[#5D32B8]' },
  { name: 'HP', logo: 'hp', icon: '🖨️', slogan: 'Impresoras', color: 'text-[#0096D6] bg-[#0096D6]/5 hover:bg-[#0096D6]/10 border-[#0096D6]/20 hover:border-[#0096D6]' },
  { name: 'Asus', logo: 'ASUS', icon: '🎮', slogan: 'Gaming', color: 'text-[#00BA9D] bg-[#00BA9D]/5 hover:bg-[#00BA9D]/10 border-[#00BA9D]/20 hover:border-[#00BA9D]' },
  { name: 'Dell', logo: 'DELL', icon: '🖥️', slogan: 'Computo', color: 'text-[#0076C0] bg-[#0076C0]/5 hover:bg-[#0076C0]/10 border-[#0076C0]/20 hover:border-[#0076C0]' },
  { name: 'Logitech', logo: 'logi', icon: '🖱️', slogan: 'Accesorios', color: 'text-[#00B0F0] bg-[#00B0F0]/5 hover:bg-[#00B0F0]/10 border-[#00B0F0]/20 hover:border-[#00B0F0]' },
  { name: 'Toyota', logo: 'TOYOTA', icon: '🚗', slogan: 'Autos', color: 'text-[#EB0A1E] bg-[#EB0A1E]/5 hover:bg-[#EB0A1E]/10 border-[#EB0A1E]/20 hover:border-[#EB0A1E]' },
  { name: 'Hyundai', logo: 'HYUNDAI', icon: '🚙', slogan: 'Suvs', color: 'text-[#002C5F] bg-[#002C5F]/5 hover:bg-[#002C5F]/10 border-[#002C5F]/20 hover:border-[#002C5F]' },
  { name: 'Honda', logo: 'HONDA', icon: '🏍️', slogan: 'Motocicletas', color: 'text-[#E31B23] bg-[#E31B23]/5 hover:bg-[#E31B23]/10 border-[#E31B23]/20 hover:border-[#E31B23]' },
  { name: 'Yamaha', logo: 'YAMAHA', icon: '🏍️', slogan: 'Motos', color: 'text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border-zinc-300 hover:border-zinc-800' },
  { name: 'LG', logo: 'LG', icon: '📺', slogan: 'Línea Blanca', color: 'text-[#A50034] bg-[#A50034]/5 hover:bg-[#A50034]/10 border-[#A50034]/20 hover:border-[#A50034]' },
  { name: 'Nike', logo: 'NIKE', icon: '👟', slogan: 'Moda & Running', color: 'text-black bg-neutral-100 hover:bg-neutral-200 border-neutral-200 hover:border-black' },
  { name: 'Adidas', logo: 'adidas', icon: '👟', slogan: 'Urbano & Gym', color: 'text-neutral-800 bg-neutral-50 hover:bg-neutral-100 border-neutral-300 hover:border-neutral-800' },
  { name: 'Remax', logo: 'RE/MAX', icon: '🏠', slogan: 'Propiedades', color: 'text-[#DC1F26] bg-[#DC1F26]/5 hover:bg-[#DC1F26]/10 border-[#DC1F26]/20 hover:border-[#DC1F26]' }
];

const FAQS = [
  { title: 'Publicación gratuita', desc: 'Publica sin pagar comisiones', icon: '🏷️' },
  { title: 'Chat seguro', desc: 'Comunícate de forma segura con compradores', icon: '💬' },
  { title: 'Usuarios verificados', desc: 'Perfiles verificados para mayor confianza', icon: '👤' },
  { title: 'Geolocalización', desc: 'Encuentra productos cerca de ti', icon: '📍' },
  { title: 'Compras rápidas', desc: 'Encuentra lo que necesitas fácil y rápido', icon: '⚡' },
  { title: 'Pagos seguros', desc: 'Gestiona tus pagos de forma segura', icon: '💳' },
  { title: 'Protección al comprador', desc: 'Te acompañamos en todo el proceso', icon: '🛡️' },
  { title: 'Aplicación móvil', desc: 'Publica y compra desde nuestra app', icon: '📱' }
];

// --- BRAND LOGO COMPONENT ---
const BrandLogo = ({ 
  className = 'h-10', 
  showSlogan = true,
  onClick
}: { 
  className?: string; 
  showSlogan?: boolean;
  onClick?: () => void;
}) => (
  <div onClick={onClick} className="flex flex-col items-start select-none cursor-pointer group">
    <div className="flex items-center gap-1.5">
      {/* High Fidelity SVG Icon Speech Bubble P with Rays */}
      <svg viewBox="0 0 100 100" className={`${className} w-auto h-12`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Yellow ray (bottom-left) */}
        <line x1="8" y1="44" x2="22" y2="46" stroke="#FFB800" strokeWidth="6" strokeLinecap="round" />
        {/* Teal ray (middle-left) */}
        <line x1="12" y1="26" x2="24" y2="34" stroke="#00BA9D" strokeWidth="6" strokeLinecap="round" />
        {/* Orange ray (top-left) */}
        <line x1="26" y1="14" x2="32" y2="28" stroke="#FF5A00" strokeWidth="6" strokeLinecap="round" />

        {/* Purple custom 'p' speech-bubble/location pin */}
        <path 
          d="M 52 26 C 68.5 26 82 39.5 82 56 C 82 72.5 68.5 86 52 86 C 45.5 86 39.5 84 34.5 80.5 L 26 89 L 26 56 C 26 39.5 39.5 26 52 26 Z" 
          fill="#5D32B8" 
          className="transition-transform origin-center group-hover:scale-105 duration-300"
        />
        {/* Inner white eye of P */}
        <circle cx="52" cy="56" r="12" fill="white" />
      </svg>
      {/* Brand Text styling with exact colors matching */}
      <span className="font-sans font-black text-xl sm:text-2xl md:text-3xl tracking-tight flex items-baseline">
        <span className="text-[#00BA9D]">u</span>
        <span className="text-[#FF5A00]">b</span>
        <span className="text-[#5D32B8]">l</span>
        <span className="text-[#00BA9D]">i</span>
        <span className="text-[#FFB800]">c</span>
        <span className="text-[#FF5A00]">a</span>
        <span className="text-[#5D32B8]">.</span>
        <span className="text-[#2D3748]">p</span>
        <span className="text-[#2D3748]">e</span>
      </span>
    </div>
    {/* Slogan with exact colored dots */}
    {showSlogan && (
      <div className="hidden sm:flex text-[9px] md:text-[10px] text-gray-500 font-extrabold tracking-wider items-center gap-1 mt-0.5 ml-1 uppercase">
        <span>publica</span><span className="text-[#5D32B8] font-black">.</span>
        <span>encuentra</span><span className="text-[#00BA9D] font-black">.</span>
        <span>conecta</span><span className="text-[#FF5A00] font-black">.</span>
      </div>
    )}
  </div>
);

// --- PRODUCT CARD COMPONENT (Hi-Fi layout modeled after uploaded real-estate image) ---
interface ProductCardProps {
  product: any;
  isFav: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClick: () => void;
}

const ProductCard = ({ product, isFav, onToggleFavorite, onClick }: ProductCardProps) => {
  const isNew = product.condition === 'Nuevo';
  
  // High-fidelity tags and text based on product status
  const icon1Text = isNew ? 'En stock' : 'Verificado';
  
  const icon2Text = useMemo(() => {
    if (product.category === 'Vehículos') {
      return isNew ? 'Garantía 3 años' : 'Entrega Inmediata';
    }
    if (product.category === 'Inmuebles') {
      return isNew ? 'Diciembre 2027' : 'Listo para mudanza';
    }
    return isNew ? 'Garantía 12 Meses' : 'Garantía 3 Meses';
  }, [product.category, isNew]);

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-2xs hover:shadow-sm transition-all duration-300 group cursor-pointer flex flex-col h-full relative"
    >
      {/* Destacado Badge */}
      {product.tag === 'Destacado' && (
        <span className="absolute top-3.5 left-3.5 bg-[#FF5A00] text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md z-10 shadow-3xs">
          Destacado
        </span>
      )}

      {/* Heart button */}
      <button 
        onClick={(e) => onToggleFavorite(product.id, e)}
        className="absolute top-3.5 right-3.5 bg-black/25 hover:bg-black/40 text-white p-2 rounded-full z-10 shadow-xs transition-all hover:scale-110 active:scale-95 border border-white/10 backdrop-blur-xs"
      >
        <Heart className={`w-4 h-4 transition-all ${isFav ? 'text-red-500 fill-red-500 stroke-red-500 scale-110' : 'text-white stroke-white'}`} />
      </button>

      {/* Visual Background */}
      <div className="bg-gray-50/50 aspect-[4/3] w-full flex items-center justify-center relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-100/20 via-transparent to-gray-50/20" />
        {product.image ? (
          <div className="relative w-full h-full">
            <Image 
              src={product.image} 
              alt={product.title} 
              fill 
              className="object-cover transform group-hover:scale-102 transition-transform duration-500" 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-6xl transform group-hover:scale-105 transition-transform duration-500 select-none drop-shadow-sm">{product.emoji}</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 space-y-2.5 sm:space-y-3">
        <div>
          {/* Tag Category · Condition */}
          <p className="text-[10px] sm:text-[11px] font-semibold text-gray-500 tracking-tight uppercase">
            {product.category} · {isNew ? 'Nuevo' : 'Usado'}
          </p>

          {/* Price & Seller section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mt-1.5 min-h-auto sm:min-h-[44px]">
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Desde</span>
              <span className="text-sm sm:text-base font-black text-gray-950 tracking-tight mt-0.5 sm:mt-1">
                S/ {product.price.toLocaleString('es-PE')}
              </span>
            </div>
            
            {/* Store Badge Logo - Modeled after brand logos on the right in image */}
            <div className="shrink-0 flex items-center">
              <div className="bg-gray-50/70 border border-gray-100 rounded px-1.5 py-0.5 sm:px-2 sm:py-1 font-black text-[8px] sm:text-[9px] text-gray-600 uppercase tracking-tight shadow-3xs max-w-[85px] sm:max-w-[95px] truncate text-center">
                {product.store || 'Mi Tienda'}
              </div>
            </div>
          </div>

          {/* Title / Description */}
          <h3 className="font-bold text-gray-900 text-xs truncate uppercase tracking-tight group-hover:text-[#FF5A00] transition-colors mt-2.5" title={product.title}>
            {product.title}
          </h3>

          {/* Location Area */}
          <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium truncate mt-0.5">
            {product.location}
          </p>
        </div>

        {/* Bottom divider and statuses with icons */}
        <div className="border-t border-gray-100/40 pt-2.5 sm:pt-3 flex items-center justify-between text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase gap-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            <LayoutGrid className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{icon1Text}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{icon2Text}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const brandsRef = useRef<HTMLDivElement>(null);

  const scrollBrands = (direction: 'left' | 'right') => {
    if (brandsRef.current) {
      const scrollAmount = 350;
      brandsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'nuevo' | 'usado'>('all');
  
  // Custom created products by the user
  const [customProducts, setCustomProducts] = useState<any[]>([]);

  // Modals state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishStep, setPublishStep] = useState<1 | 2>(1);
  const [selectedMainPublishCategory, setSelectedMainPublishCategory] = useState<string | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<any | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [prevProductId, setPrevProductId] = useState<string | null>(null);
  const [ingresarMenuOpen, setIngresarMenuOpen] = useState(false);
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);

  // Synchronize state during render when the selected product ID changes
  const currentProductId = selectedProductDetail?.id || null;
  if (currentProductId !== prevProductId) {
    setPrevProductId(currentProductId);
    setActiveImageIndex(0);
  }

  // Premium Verification & Registration states
  const [isRegistered, setIsRegistered] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [sellerCardZoomed, setSellerCardZoomed] = useState(false);
  const [customToast, setCustomToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  const handleResetToHome = () => {
    setSelectedProductDetail(null);
    setSelectedCategory(null);
    setSearchQuery('');
    setIsRegistering(false);
    setCategoriesMenuOpen(false);
    setIngresarMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Auto-dismiss customToast
  useEffect(() => {
    if (customToast) {
      const timer = setTimeout(() => {
        setCustomToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [customToast]);

  // Scroll to top when product detail is loaded
  useEffect(() => {
    if (selectedProductDetail) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [selectedProductDetail]);
  
  // Registration form inputs
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    acceptedTerms: true
  });
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);
  
  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<string>('Equipo Publica');
  const [chatMessages, setChatMessages] = useState<Array<{sender: string, text: string, time: string}>>([
    { sender: 'them', text: '¡Hola! Bienvenido a PUBLICA.PE. ¿En qué podemos ayudarte hoy?', time: '14:20' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Form State for "Publicar Gratis"
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    price: '',
    category: 'Tecnología',
    condition: 'Nuevo',
    location: 'Lima, Lima',
    emoji: '📦',
    description: ''
  });

  // Success alert state after publication
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // --- COMBINE LISTINGS ---
  const allProducts = useMemo(() => {
    return [
      ...INITIAL_FEATURED_PRODUCTS,
      ...INITIAL_VEHICLES,
      ...INITIAL_TECHNOLOGY,
      ...INITIAL_NEW_PRODUCTS,
      ...INITIAL_USED_PRODUCTS,
      ...customProducts
    ];
  }, [customProducts]);

  // Carousel positioning for "Vehículos para ti"
  const [vehicleIndex, setVehicleIndex] = useState(0);

  // --- PREMIUM SELLER INFO RETRIEVAL (2026 UI) ---
  const getSellerInfo = useMemo(() => {
    if (!selectedProductDetail) return null;
    const storeName = selectedProductDetail.store || 'Vendedor Particular';
    
    let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'; // Default high quality portrait (Woman)
    let memberSince = 'Miembro desde el 2024';
    let phone = '+51 987 654 245';
    let city = selectedProductDetail.location || 'Lima, Perú';

    // Tailored high-fidelity seller profiles based on categories and store names
    if (storeName.toLowerCase().includes('make inmobiliaria') || storeName.toLowerCase().includes('urbalima')) {
      avatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80';
      memberSince = 'Miembro desde el 2021 (5 años en Publica)';
      phone = '+51 987 654 245';
    } else if (storeName.toLowerCase().includes('tecno') || selectedProductDetail.category === 'Tecnología' || selectedProductDetail.category === 'Celulares') {
      avatar = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80';
      memberSince = 'Miembro desde el 2023 (3 años en Publica)';
      phone = '+51 987 654 245';
    } else if (storeName.toLowerCase().includes('toyota') || selectedProductDetail.category === 'Vehículos') {
      avatar = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80';
      memberSince = 'Miembro desde el 2022 (4 años en Publica)';
      phone = '+51 987 654 245';
    } else {
      // Default charming profile
      avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80';
      memberSince = 'Miembro desde el 2024 (2 años en Publica)';
      phone = '+51 987 654 245';
    }

    return {
      name: storeName,
      avatar,
      rating: selectedProductDetail.rating || 4.8,
      verified: true,
      memberSince,
      city,
      phone
    };
  }, [selectedProductDetail]);

  const handleWhatsAppClick = () => {
    if (isRegistered) {
      // If already registered, it is active
      window.open(`https://wa.me/51987654245`, '_blank');
    } else {
      // Trigger smooth camera zoom to seller card
      setSellerCardZoomed(true);
      // Wait for a smooth zoom transition, then open dialog
      setTimeout(() => {
        setVerificationDialogOpen(true);
      }, 500);
    }
  };

  const handleCloseVerificationDialog = () => {
    setVerificationDialogOpen(false);
    setSellerCardZoomed(false);
  };

  // --- FILTERED PRODUCTS BASED ON SEARCH / CATEGORY ---
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.store && p.store.toLowerCase().includes(searchQuery.toLowerCase()));
      let matchesCategory = true;
      if (selectedCategory) {
        if (selectedCategory === 'Favoritos') {
          matchesCategory = favorites.includes(p.id);
        } else {
          matchesCategory = isProductInSelectedCategory(p.category, selectedCategory);
        }
      }
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchQuery, selectedCategory, favorites]);

  const displayedFeatured = useMemo(() => {
    return filteredProducts.filter(p => p.tag === 'Destacado').slice(0, 5);
  }, [filteredProducts]);

  const displayedVehicles = useMemo(() => {
    return filteredProducts.filter(p => p.category === 'Vehículos');
  }, [filteredProducts]);

  const displayedTech = useMemo(() => {
    return filteredProducts.filter(p => p.category === 'Tecnología');
  }, [filteredProducts]);

  const displayedNew = useMemo(() => {
    return filteredProducts.filter(p => p.condition === 'Nuevo' && p.tag !== 'Destacado');
  }, [filteredProducts]);

  const displayedUsed = useMemo(() => {
    return filteredProducts.filter(p => p.condition === 'Usado' && p.tag !== 'Destacado');
  }, [filteredProducts]);

  const productImages = useMemo(() => {
    if (!selectedProductDetail) return [];
    const mainImg = selectedProductDetail.image;
    if (!mainImg) return [];
    
    // Check category to build a beautiful relevant gallery
    const cat = selectedProductDetail.category;
    if (cat === 'Vehículos') {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      ];
    }
    if (cat === 'Tecnología' || cat === 'Celulares' || cat === 'Gaming') {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504274066654-fa2592dfb692?auto=format&fit=crop&w=800&q=80',
      ];
    }
    if (cat === 'Hogar') {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      ];
    }
    return [
      mainImg,
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    ];
  }, [selectedProductDetail]);

  // --- ACTIONS ---
  const prevVehicles = useCallback(() => {
    setVehicleIndex((prev) => {
      const maxIndex = Math.max(0, displayedVehicles.length - 5);
      return prev === 0 ? maxIndex : prev - 1;
    });
  }, [displayedVehicles.length]);

  const nextVehicles = useCallback(() => {
    setVehicleIndex((prev) => {
      const maxIndex = Math.max(0, displayedVehicles.length - 5);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  }, [displayedVehicles.length]);

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.title || !newProductForm.price) return;

    const newProduct = {
      id: 'custom_' + Date.now(),
      title: newProductForm.title,
      price: parseFloat(newProductForm.price),
      location: newProductForm.location || 'Lima, Lima',
      condition: newProductForm.condition,
      store: 'Mi Tienda',
      rating: 5.0,
      category: newProductForm.category,
      emoji: newProductForm.emoji || '📦',
      imageBg: 'from-orange-500/10 to-rose-500/10',
      description: newProductForm.description || 'Producto publicado de forma gratuita en PUBLICA.PE.'
    };

    setCustomProducts(prev => [newProduct, ...prev]);
    setIsPublishModalOpen(false);
    setPublishStep(1);
    setSelectedMainPublishCategory(null);
    setShowSuccessAlert(true);
    
    // Clear form
    setNewProductForm({
      title: '',
      price: '',
      category: 'Tecnología',
      condition: 'Nuevo',
      location: 'Lima, Lima',
      emoji: '📦',
      description: ''
    });

    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 4000);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMsg = { sender: 'me', text: currentMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    setCurrentMessage('');

    // Trigger auto simulated replies representing client-seller communication
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '¡Hola! Qué gusto saludarte. Sí, el producto está disponible y podemos coordinar la entrega inmediata de forma totalmente protegida.';
      if (chatRecipient !== 'Equipo Publica') {
        replyText = `Hola, soy de ${chatRecipient}. El producto está en perfecto estado tal cual se muestra. ¿En qué distrito te encuentras para coordinar?`;
      }
      setChatMessages(prev => [...prev, {
        sender: 'them',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  const openContactWithSeller = (sellerName: string, pTitle: string) => {
    setChatRecipient(sellerName);
    setChatMessages([
      { sender: 'them', text: `¡Hola! Gracias por comunicarte con ${sellerName}. ¿Estás interesado en mi publicación de: "${pTitle}"?`, time: 'Ahora' }
    ]);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 selection:bg-[#FF5A00] selection:text-white transition-all duration-300 antialiased font-sans">
      
      {/* SUCCESS ALERTS */}
      <AnimatePresence>
        {showSuccessAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-[99] bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-semibold text-sm"
            id="success-alert"
          >
            <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
            <span>¡Anuncio publicado correctamente con éxito!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-[40] bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">
          
          {/* Logo brand */}
          <div onClick={handleResetToHome} className="shrink-0">
            <BrandLogo />
          </div>

          {/* Categorías Dropdown in Navbar */}
          <div className="relative hidden lg:block shrink-0">
            <button 
              onClick={() => setCategoriesMenuOpen(!categoriesMenuOpen)}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl border border-gray-200 hover:border-[#FF5A00]/50 hover:bg-orange-50/20 text-gray-700 hover:text-[#FF5A00] font-black text-xs uppercase tracking-wider transition-all cursor-pointer select-none"
            >
              <LayoutGrid className="w-4 h-4 text-[#FF5A00]" />
              <span>Categorías</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Categorías Dropdown menu */}
            <AnimatePresence>
              {categoriesMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCategoriesMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute left-0 mt-3 w-[560px] bg-white rounded-2xl shadow-2xl border border-gray-150 p-6 z-50 grid grid-cols-2 gap-6"
                  >
                    {MAIN_CATEGORIES.map((main) => (
                      <div key={main.name} className="space-y-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(main.name);
                            setSearchQuery('');
                            setCategoriesMenuOpen(false);
                            setTimeout(() => {
                              const section = document.getElementById('categorias') || document.getElementById('filtered-results');
                              if (section) {
                                section.scrollIntoView({ behavior: 'smooth' });
                              }
                            }, 100);
                          }}
                          className="flex items-center gap-2 text-left font-black text-xs uppercase tracking-wider text-gray-900 hover:text-[#FF5A00] transition-colors cursor-pointer"
                        >
                          <span>{main.icon}</span>
                          <span>{main.name}</span>
                        </button>
                        
                        <div className="grid grid-cols-1 gap-1.5 pl-5 border-l border-gray-100">
                          {main.subcategories.map((sub) => (
                            <button
                              key={sub.name}
                              onClick={() => {
                                setSelectedCategory(sub.name);
                                setSearchQuery('');
                                setCategoriesMenuOpen(false);
                                setTimeout(() => {
                                  const section = document.getElementById('categorias') || document.getElementById('filtered-results');
                                  if (section) {
                                    section.scrollIntoView({ behavior: 'smooth' });
                                  }
                                }, 100);
                              }}
                              className="text-left text-[11px] font-bold text-gray-500 hover:text-[#FF5A00] transition-colors cursor-pointer py-0.5"
                            >
                              {sub.icon} {sub.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="col-span-2 border-t border-gray-100/70 pt-4 mt-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setSearchQuery('');
                          setCategoriesMenuOpen(false);
                          setTimeout(() => {
                            const section = document.getElementById('categorias');
                            if (section) {
                              section.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 100);
                        }}
                        className="w-full text-center py-2 text-[10px] font-black uppercase text-[#FF5A00] hover:bg-orange-50/50 rounded-lg transition-colors cursor-pointer tracking-wider"
                      >
                        Ver Todas las Categorías principales
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Search Bar - Exact layout matching screen */}
          <div className="flex-1 max-w-xl hidden md:flex items-center border border-gray-200 rounded-lg overflow-hidden h-12 bg-gray-50/50 hover:border-gray-300 focus-within:border-[#FF5A00] focus-within:bg-white transition-all">
            <input 
              type="search" 
              placeholder="¿Qué estás buscando?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none px-4 h-full" 
            />
            {/* Divider */}
            <div className="w-px h-6 bg-gray-200" />
            {/* Location selector dropdown */}
            <div className="flex items-center gap-1 text-xs font-bold text-gray-600 px-4 cursor-pointer shrink-0 hover:text-[#FF5A00] transition-colors">
              <MapPin className="w-4 h-4 text-[#FF5A00]" />
              <span>Perú</span>
              <ChevronRight className="w-3.5 h-3.5 rotate-90 text-gray-400" />
            </div>
            {/* Action Search button */}
            <button className="bg-[#FF5A00] hover:bg-[#E04F00] text-white h-12 w-12 flex items-center justify-center shrink-0 transition-colors">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Nav Items */}
          <div className="flex items-center gap-2.5 sm:gap-5 text-sm font-extrabold text-gray-700 tracking-wide shrink-0">
            
            {/* Ingresar solid button + Dropdown container */}
            <div className="relative">
              <button 
                onClick={() => setIngresarMenuOpen(!ingresarMenuOpen)}
                className="border border-gray-200 hover:border-[#FF5A00]/50 text-gray-700 hover:text-[#FF5A00] bg-white px-3 py-2 sm:px-4.5 sm:py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-3xs hover:shadow-2xs"
              >
                <LogIn className="w-4 h-4 text-[#FF5A00]" />
                <span className="hidden sm:inline">Ingresar</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${ingresarMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu mimicking the uploaded image exactly */}
              <AnimatePresence>
                {ingresarMenuOpen && (
                  <>
                    {/* Invisible overlay for easy closing on outside click */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIngresarMenuOpen(false)} 
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 text-left normal-case tracking-normal"
                      id="ingresar-dropdown-menu"
                    >
                      {/* Top paragraph */}
                      <p className="text-[13px] text-gray-500 font-bold leading-relaxed mb-5">
                        Ingresa y accede a los avisos que contactaste, tus favoritos y las búsquedas guardadas
                      </p>

                      {/* Main solid orange button inside the dropdown */}
                      <button 
                        onClick={() => {
                          setIngresarMenuOpen(false);
                          alert('¡Bienvenido! Has ingresado correctamente a tu cuenta de PUBLICA.PE.');
                        }}
                        className="w-full bg-[#E25C2C] hover:bg-[#D04D1B] text-white font-extrabold text-sm py-3 px-4 rounded-xl transition-all shadow-2xs text-center block"
                      >
                        Ingresar
                      </button>

                      {/* Divider */}
                      <div className="border-t border-gray-100/70 my-5" />

                      {/* List of items */}
                      <div className="space-y-4.5">
                        
                        {/* Mis contactos */}
                        <div 
                          onClick={() => {
                            setChatOpen(true);
                            setIngresarMenuOpen(false);
                          }}
                          className="flex items-center gap-3.5 text-gray-800 hover:text-[#FF5A00] cursor-pointer group/item transition-colors py-1"
                        >
                          <MessageSquare className="w-5 h-5 text-gray-400 group-hover/item:text-[#FF5A00] transition-colors" />
                          <span className="text-[13px] font-black">Mis contactos</span>
                        </div>

                        {/* Favoritos */}
                        <div 
                          onClick={() => {
                            setSelectedCategory('Favoritos');
                            setIngresarMenuOpen(false);
                            const listSection = document.getElementById('categorias') || document.getElementById('filtered-results');
                            if (listSection) {
                              listSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="flex items-center gap-3.5 text-gray-800 hover:text-[#FF5A00] cursor-pointer group/item transition-colors py-1"
                        >
                          <Heart className="w-5 h-5 text-gray-400 group-hover/item:text-[#FF5A00] transition-colors" />
                          <span className="text-[13px] font-black">Favoritos</span>
                        </div>

                        {/* Búsquedas y alertas */}
                        <div 
                          onClick={() => {
                            setIngresarMenuOpen(false);
                            alert('No tienes búsquedas guardadas ni alertas de búsqueda activas.');
                          }}
                          className="flex items-center gap-3.5 text-gray-800 hover:text-[#FF5A00] cursor-pointer group/item transition-colors py-1"
                        >
                          <Bell className="w-5 h-5 text-gray-400 group-hover/item:text-[#FF5A00] transition-colors" />
                          <span className="text-[13px] font-black">Búsquedas y alertas</span>
                        </div>

                        {/* Historial */}
                        <div 
                          onClick={() => {
                            setIngresarMenuOpen(false);
                            alert('Tu historial de navegación de publicaciones está limpio.');
                          }}
                          className="flex items-center gap-3.5 text-gray-800 hover:text-[#FF5A00] cursor-pointer group/item transition-colors py-1"
                        >
                          <Eye className="w-5 h-5 text-gray-400 group-hover/item:text-[#FF5A00] transition-colors" />
                          <span className="text-[13px] font-black">Historial</span>
                        </div>

                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-100/70 my-5" />

                      {/* Bottom list items */}
                      <div className="space-y-4">
                        <span 
                          onClick={() => {
                            setIngresarMenuOpen(false);
                            alert('Mi Cuenta: Redirigiendo a tu perfil de usuario de PUBLICA.PE...');
                          }}
                          className="text-[13px] font-black text-gray-800 hover:text-[#FF5A00] cursor-pointer block transition-colors"
                        >
                          Mi cuenta
                        </span>
                        <span 
                          onClick={() => {
                            setIngresarMenuOpen(false);
                            alert('Ajustes de notificaciones: Personaliza tus alertas por correo y notificaciones del sistema.');
                          }}
                          className="text-[13px] font-black text-gray-800 hover:text-[#FF5A00] cursor-pointer block transition-colors"
                        >
                          Ajustes de notificaciones
                        </span>
                      </div>

                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Publicar Gratis button (placed after, improved, highly polished CTA) */}
            <button 
              onClick={() => setIsPublishModalOpen(true)}
              className="bg-[#FF5A00] hover:bg-[#E04F00] text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Publicar<span className="hidden sm:inline"> Gratis</span></span>
            </button>

          </div>
        </div>
      </nav>

      {/* MOBILE SEARCH BAR */}
      <div className="p-4 md:hidden bg-white border-b border-gray-100 flex gap-2">
        <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 h-11">
          <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
          <input 
            type="search" 
            placeholder="¿Qué estás buscando?" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none" 
          />
        </div>
        <button 
          onClick={() => setIsPublishModalOpen(true)}
          className="bg-[#FF5A00] hover:bg-[#E04F00] text-white px-4 rounded-lg flex items-center justify-center text-xs font-black shrink-0 uppercase"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {selectedProductDetail ? (
        // PRODUCT DETAIL PAGE (Full Screen Page View instead of Floating Modal)
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-8 md:py-12 animate-fade-in min-h-[70vh]">
          
          <AnimatePresence mode="wait">
            {isRegistering ? (
              // PREMIUM DUAL AUTH SCREEN (Fluid Transition with custom register/login modes)
              <motion.div
                key="register-screen-v2"
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="max-w-md mx-auto my-6 animate-fade-in"
              >
                <div className="bg-white rounded-3xl border border-gray-150 p-8 sm:p-10 shadow-2xl relative space-y-6">
                  
                  {/* Brand icon / Accent logo */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 font-black text-lg text-[#FF5A00] uppercase tracking-tighter">
                      <span>publica</span>
                      <span className="text-[#5D32B8]">.pe</span>
                    </div>
                    <span className="text-[9px] bg-orange-50 text-[#FF5A00] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                      Verificación 2026
                    </span>
                  </div>

                  {/* Auth mode switcher tabs */}
                  <div className="flex bg-gray-50 border border-gray-150 p-1 rounded-xl gap-1">
                    <button 
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${authMode === 'register' ? 'bg-white text-[#FF5A00] shadow-xs border border-gray-150/50' : 'text-gray-400 hover:text-gray-700'}`}
                    >
                      Crear Cuenta
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${authMode === 'login' ? 'bg-white text-[#FF5A00] shadow-xs border border-gray-150/50' : 'text-gray-400 hover:text-gray-700'}`}
                    >
                      Iniciar Sesión
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight leading-tight">
                      {authMode === 'register' ? 'Crea tu cuenta en segundos' : 'Inicia sesión de forma segura'}
                    </h2>
                    <p className="text-xs text-gray-500 font-bold leading-relaxed">
                      {authMode === 'register' 
                        ? 'Visualiza de forma inmediata números de contacto verificados, guarda búsquedas personalizadas y chatea de forma segura con vendedores.' 
                        : 'Accede a tu cuenta de Publica.pe para revelar números de WhatsApp protegidos y contactar a anunciantes de manera confiable.'
                      }
                    </p>
                  </div>

                  <div className="h-px bg-gray-100/60" />

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setIsRegisterSubmitting(true);
                      
                      // Simulate verification and smooth return
                      setTimeout(() => {
                        setIsRegisterSubmitting(false);
                        setIsRegistered(true);
                        setIsRegistering(false);
                        setCustomToast({
                          message: authMode === 'register' 
                            ? '¡Cuenta creada con éxito! Se ha verificado tu identidad.' 
                            : '¡Sesión iniciada con éxito! Bienvenido de vuelta.',
                          type: 'success'
                        });
                      }, 1200);
                    }}
                    className="space-y-4"
                  >
                    {authMode === 'register' && (
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider">Nombre Completo</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ej: Juan Pérez"
                          value={registerForm.name}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full border border-gray-200 focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-100/50 rounded-xl px-4 py-3 text-xs font-bold transition-all focus:outline-none bg-gray-50/25 focus:bg-white"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider">Correo Electrónico</label>
                      <input 
                        type="email" 
                        required
                        placeholder="Ej: juan.perez@email.com"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full border border-gray-200 focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-100/50 rounded-xl px-4 py-3 text-xs font-bold transition-all focus:outline-none bg-gray-50/25 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider">Contraseña</label>
                      <input 
                        type="password" 
                        required
                        placeholder="Mínimo 8 caracteres"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full border border-gray-200 focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-100/50 rounded-xl px-4 py-3 text-xs font-bold transition-all focus:outline-none bg-gray-50/25 focus:bg-white"
                      />
                    </div>

                    {authMode === 'register' && (
                      <div className="flex items-start gap-2.5 pt-2">
                        <input 
                          type="checkbox" 
                          id="accept-terms-checkbox"
                          checked={registerForm.acceptedTerms}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, acceptedTerms: e.target.checked }))}
                          className="mt-0.5 rounded border-gray-300 text-[#FF5A00] focus:ring-[#FF5A00] cursor-pointer"
                        />
                        <label htmlFor="accept-terms-checkbox" className="text-[10px] text-gray-400 font-bold leading-normal cursor-pointer select-none">
                          Acepto los <span className="text-[#FF5A00] underline">Términos de Servicio</span> y la <span className="text-[#FF5A00] underline">Política de Privacidad</span> de Publica.pe para resguardar mi identidad y transacciones de forma segura.
                        </label>
                      </div>
                    )}

                    <div className="pt-4 space-y-3">
                      <button 
                        type="submit"
                        disabled={isRegisterSubmitting}
                        className="w-full bg-[#FF5A00] hover:bg-[#E04F00] text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 hover:scale-[1.01]"
                      >
                        {isRegisterSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                            <span>
                              {authMode === 'register' ? 'Creando cuenta segura...' : 'Validando credenciales...'}
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>
                              {authMode === 'register' ? 'Crear Cuenta Gratis' : 'Iniciar Sesión Seguro'}
                            </span>
                          </>
                        )}
                      </button>

                      <button 
                        type="button"
                        onClick={() => setIsRegistering(false)}
                        className="w-full bg-white hover:bg-gray-50 text-gray-500 border border-gray-200 font-black text-xs uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Volver al anuncio</span>
                      </button>
                    </div>
                  </form>

                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex gap-3 items-start">
                    <ShieldCheck className="w-5 h-5 text-[#00BA9D] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <h4 className="text-[10px] font-black text-emerald-950 uppercase tracking-wider">Protección de Datos Garantizada</h4>
                      <p className="text-[10px] text-emerald-900 leading-normal font-bold">
                        Publica.pe cuenta con certificación de seguridad SSL y cumple estrictamente con la Ley N° 29733 de Protección de Datos Personales en el Perú.
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : (
              // STANDARD PRODUCT VIEW (with stateful interactive components)
              <motion.div
                key="product-screen-v2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Breadcrumbs & Navigation */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <span className="hover:text-[#FF5A00] cursor-pointer transition-colors" onClick={() => setSelectedProductDetail(null)}>Inicio</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="hover:text-[#FF5A00] cursor-pointer transition-colors" onClick={() => { setSelectedCategory(selectedProductDetail.category); setSelectedProductDetail(null); }}>{selectedProductDetail.category}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-gray-600 truncate max-w-[200px] sm:max-w-xs">{selectedProductDetail.title}</span>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedProductDetail(null)}
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-[#FF5A00] bg-white border border-gray-100 hover:border-orange-200 px-4 py-2.5 rounded-lg shadow-3xs transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                    <span>Volver al listado</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column (8 cols): Media Gallery, specs, and details */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Product Card Image Container (Slider with Thumbnails!) */}
                    <div className="space-y-3">
                      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-2xs relative group">
                        <div className="bg-gray-50/50 h-[320px] sm:h-[480px] flex items-center justify-center relative overflow-hidden">
                          
                          {productImages.length > 0 ? (
                            <div className="relative w-full h-full">
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={activeImageIndex}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="relative w-full h-full"
                                >
                                  <Image 
                                    src={productImages[activeImageIndex]} 
                                    alt={`${selectedProductDetail.title} - Imagen ${activeImageIndex + 1}`} 
                                    fill 
                                    className="object-cover" 
                                    sizes="(max-width: 1200px) 100vw, 800px"
                                    referrerPolicy="no-referrer"
                                    priority
                                  />
                                </motion.div>
                              </AnimatePresence>

                              {/* Navigation Arrows */}
                              {productImages.length > 1 && (
                                <>
                                  <button
                                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 hover:text-[#FF5A00] p-2.5 rounded-full shadow-lg transition-all cursor-pointer select-none opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    aria-label="Imagen anterior"
                                  >
                                    <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                                  </button>
                                  <button
                                    onClick={() => setActiveImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 hover:text-[#FF5A00] p-2.5 rounded-full shadow-lg transition-all cursor-pointer select-none opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    aria-label="Siguiente imagen"
                                  >
                                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                                  </button>

                                  {/* Floating Indicators Pill */}
                                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
                                    {activeImageIndex + 1} / {productImages.length}
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <span className="text-[120px] select-none">{selectedProductDetail.emoji}</span>
                          )}
                          
                          {/* Status tags */}
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-[#FF5A00] text-white px-3.5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-3xs">
                              {selectedProductDetail.condition}
                            </span>
                            {selectedProductDetail.tag && (
                              <span className="bg-[#5D32B8] text-white px-3.5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-3xs">
                                {selectedProductDetail.tag}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Thumbnails strip below */}
                      {productImages.length > 1 && (
                        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                          {productImages.map((imgUrl, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveImageIndex(index)}
                              className={`relative w-20 h-16 sm:w-24 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${activeImageIndex === index ? 'border-[#FF5A00] shadow-sm scale-95' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                              <Image 
                                src={imgUrl}
                                alt={`Miniatura ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="96px"
                                referrerPolicy="no-referrer"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bento Specs cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col justify-between shadow-3xs">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Categoría</span>
                        <span className="text-xs font-black text-gray-800 uppercase mt-1 truncate">{selectedProductDetail.category}</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col justify-between shadow-3xs">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Condición</span>
                        <span className="text-xs font-black text-[#FF5A00] uppercase mt-1 truncate">{selectedProductDetail.condition}</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col justify-between shadow-3xs">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Ubicación</span>
                        <span className="text-xs font-black text-gray-800 uppercase mt-1 truncate">{selectedProductDetail.location}</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col justify-between shadow-3xs">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Valoración</span>
                        <span className="text-xs font-black text-amber-500 uppercase mt-1 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          {selectedProductDetail.rating || '5.0'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-3xs space-y-4">
                      <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-100/40 pb-3">Descripción de la publicación</h3>
                      <p className="text-xs text-gray-500 font-bold leading-relaxed whitespace-pre-wrap">
                        {selectedProductDetail.description || 'Este anuncio cuenta con toda la garantía ofrecida por el vendedor en PUBLICA.PE. Puedes contactar de forma segura para resolver dudas, coordinar un punto de entrega presencial seguro, o solicitar más especificaciones técnicas sobre el artículo.'}
                      </p>
                    </div>

                    {/* Safety */}
                    <div className="bg-amber-50/40 border border-amber-100/70 p-5 rounded-2xl flex gap-4 items-start shadow-3xs">
                      <ShieldCheck className="w-6 h-6 text-[#FF5A00] shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">Consejos de compra segura</h4>
                        <ul className="text-[11px] text-amber-900 font-bold space-y-1 list-disc list-inside">
                          <li>Reúnete siempre en lugares públicos concurridos y con vigilancia (centros comerciales, estaciones).</li>
                          <li>No realices pagos ni transferencias por adelantado sin antes verificar el estado real del artículo en persona.</li>
                          <li>Sospecha de ofertas que parezcan excesivamente baratas o poco realistas.</li>
                        </ul>
                      </div>
                    </div>

                  </div>

                  {/* Right Column (4 cols): Buy box, seller, actions */}
                  <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                    
                    {/* Product Info & Actions box */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-3xs space-y-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedProductDetail.condition}</span>
                          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                            Disponible
                          </span>
                        </div>
                        <h1 className="text-xl font-black text-gray-950 tracking-tight leading-snug uppercase">{selectedProductDetail.title}</h1>
                        <p className="text-[11px] text-gray-400 font-medium">{selectedProductDetail.location}</p>
                      </div>

                      <div className="h-px bg-gray-100/40" />

                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Precio especial</span>
                        <div className="flex items-baseline gap-2.5">
                          <span className="text-3xl font-black text-gray-950 tracking-tight">
                            S/ {selectedProductDetail.price.toLocaleString('es-PE')}
                          </span>
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wide">Precio único</span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <button 
                          onClick={() => openContactWithSeller(getSellerInfo?.name || 'Vendedor', selectedProductDetail.title)}
                          className="w-full bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Contactar Vendedor</span>
                        </button>

                        <button 
                          onClick={(e) => toggleFavorite(selectedProductDetail.id, e)}
                          className={`w-full border py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${favorites.includes(selectedProductDetail.id) ? 'bg-red-50/50 border-red-200 text-red-500' : 'bg-white border-gray-100 hover:border-gray-200 text-gray-700'}`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(selectedProductDetail.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          <span>{favorites.includes(selectedProductDetail.id) ? 'Guardado en Favoritos' : 'Añadir a Favoritos'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Seller details card - PREMIUM 2026 DESIGN */}
                    <div 
                      className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs space-y-5 transition-all duration-700 ease-out ${
                        sellerCardZoomed 
                          ? 'scale-105 shadow-xl ring-4 ring-orange-500/10 border-orange-200 z-10' 
                          : ''
                      }`}
                      id="vendedor-card"
                    >
                      {/* Header with Photo, Name and Rating */}
                      <div className="flex items-start gap-3.5">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-100 shrink-0 shadow-3xs">
                          {getSellerInfo?.avatar && (
                            <Image 
                              src={getSellerInfo.avatar} 
                              alt={getSellerInfo.name || ''} 
                              fill 
                              className="object-cover"
                              sizes="56px"
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-0.5 border border-emerald-100">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block animate-pulse" />
                              Miembro verificado
                            </span>
                          </div>
                          <h3 className="font-black text-gray-950 text-xs truncate uppercase mt-1.5" title={getSellerInfo?.name}>
                            {getSellerInfo?.name}
                          </h3>
                          
                          <div className="flex items-center gap-1.5 text-[10px] text-amber-500 font-extrabold mt-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>{getSellerInfo?.rating || '4.8'}</span>
                            <span className="text-gray-400 font-bold">• 124 transacciones</span>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-gray-100/40" />

                      {/* Seller stats & meta */}
                      <div className="space-y-2.5 text-xs text-gray-600 font-bold">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-gray-400 shrink-0" />
                          <span>{getSellerInfo?.memberSince}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="truncate">{getSellerInfo?.city}</span>
                        </div>
                      </div>

                      <div className="h-px bg-gray-100/40" />

                      {/* Primary messaging buttons */}
                      <div className="space-y-3.5">
                        {/* Button "Enviar mensaje" */}
                        <button 
                          onClick={() => openContactWithSeller(getSellerInfo?.name || 'Vendedor', selectedProductDetail.title)}
                          className="w-full bg-gray-50 hover:bg-[#5D32B8]/5 text-[#5D32B8] text-xs font-black uppercase tracking-wider py-3 px-4 rounded-xl border border-[#5D32B8]/10 hover:border-[#5D32B8]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <MessageSquare className="w-4.5 h-4.5" />
                          <span>Enviar mensaje</span>
                        </button>

                        {/* WhatsApp Protegido Button */}
                        <div className="space-y-2.5">
                          <button 
                            onClick={handleWhatsAppClick}
                            className={`w-full transition-all flex items-center justify-between px-4 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer shadow-3xs ${
                              isRegistered 
                                ? 'bg-[#25D366] hover:bg-[#20BA56] text-white hover:scale-[1.01]' 
                                : 'bg-[#25D366]/90 hover:bg-[#25D366] text-white hover:scale-[1.01]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 fill-white text-transparent shrink-0" />
                              <span>WhatsApp</span>
                            </div>
                            
                            {/* Number Display (Partially hidden if not registered) */}
                            <span className="font-mono text-xs tracking-wide bg-black/10 px-2.5 py-1 rounded-lg">
                              {isRegistered ? '+51 987 654 245' : '+51 987 ••• •45'}
                            </span>
                          </button>

                          {/* Verification check or prompt below */}
                          {!isRegistered ? (
                            <div className="bg-orange-50/60 border border-orange-100/40 rounded-xl p-3 flex items-start gap-2 animate-fade-in">
                              <Lock className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                              <p className="text-[10px] text-orange-800 leading-normal font-bold">
                                Regístrate o inicia sesión para ver el número completo del vendedor.
                              </p>
                            </div>
                          ) : (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-2 animate-fade-in">
                              <Check className="w-4 h-4 text-emerald-600 bg-emerald-100 p-0.5 rounded-full shrink-0" />
                              <span className="text-[11px] text-emerald-800 font-extrabold uppercase tracking-wide">
                                Número verificado
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Trust Messages & Icons */}
                      <div className="bg-gray-50/60 rounded-2xl border border-gray-100 p-4 space-y-3">
                        <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest block leading-none">Compromiso Publica.pe</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-gray-700 font-bold">
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-500 bg-emerald-50 p-0.5 rounded-full shrink-0" />
                            <span>Vendedor verificado</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-500 bg-emerald-50 p-0.5 rounded-full shrink-0" />
                            <span>WhatsApp protegido</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-500 bg-emerald-50 p-0.5 rounded-full shrink-0" />
                            <span>Compra segura</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-500 bg-emerald-50 p-0.5 rounded-full shrink-0" />
                            <span>Protección al comprador</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      ) : (
        <>
          {/* HERO SECTION - Beautiful light ambient space mimicking high-fidelity design */}
          <header className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-gray-50/40 py-16 lg:py-24 border-b border-gray-100">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial from-[#FF5A00]/5 via-[#5D32B8]/5 to-transparent blur-3xl pointer-events-none" />
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight font-sans">
              Compra y vende<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A00] via-[#5D32B8] to-[#00BA9D]">
                productos nuevos y usados
              </span><br />
              en todo el Perú
            </h1>
            
            <p className="text-base sm:text-lg text-gray-500 max-w-lg font-medium leading-relaxed">
              Miles de oportunidades cerca de ti
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => setIsPublishModalOpen(true)}
                className="bg-[#FF5A00] hover:bg-[#E04F00] text-white px-8 py-4 rounded-lg font-black shadow-md shadow-orange-500/10 hover:shadow-lg transition-all text-xs uppercase tracking-widest"
              >
                Publicar ahora
              </button>
              <a 
                href="#categorias"
                className="bg-white hover:bg-gray-50 text-[#5D32B8] hover:text-[#FF5A00] px-8 py-4 rounded-lg font-black border border-gray-200 shadow-sm transition-all text-xs uppercase tracking-widest block"
              >
                Explorar categorías
              </a>
            </div>
          </div>

          {/* Interactive overlapping visual collage */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg h-[400px] hidden sm:block">
              
              {/* Back glowing ambient shape */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-[#FF5A00]/10 to-[#5D32B8]/10 blur-3xl animate-pulse" />

              {/* OVERLAPPING HIGH-FIDELITY PRODUCT SHAPES */}
              {/* 1. Toyota SUV Card */}
              <motion.div 
                whileHover={{ y: -6, rotate: 1 }}
                className="absolute top-0 right-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100/60 w-64 z-20 cursor-pointer"
                onClick={() => setSelectedCategory('Vehículos')}
              >
                <div className="w-full h-32 rounded-xl bg-gradient-to-b from-gray-100 to-gray-200/50 flex items-center justify-center text-6xl shadow-inner relative overflow-hidden">
                  <span className="relative z-10">🚗</span>
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5A00]/5 to-[#5D32B8]/5" />
                </div>
                <div className="mt-3 flex justify-between items-start">
                  <div>
                    <div className="text-xs font-extrabold text-gray-900">Toyota Corolla 2022</div>
                    <div className="text-[10px] text-gray-400 font-bold mt-0.5">Arequipa • Usado</div>
                  </div>
                  <span className="text-xs font-black text-gray-950">S/ 76,900</span>
                </div>
              </motion.div>

              {/* 2. MacBook Card */}
              <motion.div 
                whileHover={{ y: -6, rotate: -1 }}
                className="absolute top-8 left-0 bg-white p-4 rounded-2xl shadow-xl border border-gray-100/60 w-48 z-10 cursor-pointer"
                onClick={() => setSelectedCategory('Tecnología')}
              >
                <div className="w-full h-24 rounded-xl bg-gradient-to-b from-blue-50 to-blue-100/50 flex items-center justify-center text-4xl shadow-inner">
                  <span>💻</span>
                </div>
                <div className="mt-2.5">
                  <div className="text-[11px] font-extrabold text-gray-900 truncate">MacBook Air M2 13&quot;</div>
                  <div className="text-[10px] text-gray-400 font-bold mt-0.5">S/ 4,299</div>
                </div>
              </motion.div>

              {/* 3. PS5 Card */}
              <motion.div 
                whileHover={{ y: -6, rotate: 2 }}
                className="absolute bottom-4 right-12 bg-white p-4 rounded-2xl shadow-xl border border-gray-100/60 w-44 z-30 cursor-pointer"
                onClick={() => setSelectedCategory('Gaming')}
              >
                <div className="w-full h-24 rounded-xl bg-gradient-to-b from-zinc-50 to-zinc-200/50 flex items-center justify-center text-4xl shadow-inner">
                  <span>🎮</span>
                </div>
                <div className="mt-2.5">
                  <div className="text-[11px] font-extrabold text-gray-900 truncate">PlayStation 5</div>
                  <div className="text-[10px] text-[#FF5A00] font-black mt-0.5">S/ 1,899</div>
                </div>
              </motion.div>

              {/* 4. Sofa / Couch Card */}
              <motion.div 
                whileHover={{ y: -6 }}
                className="absolute bottom-12 left-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100/60 w-48 z-10 cursor-pointer"
                onClick={() => setSelectedCategory('Hogar')}
              >
                <div className="w-full h-24 rounded-xl bg-gradient-to-b from-amber-50 to-amber-100/50 flex items-center justify-center text-4xl shadow-inner">
                  <span>🛋️</span>
                </div>
                <div className="mt-2.5">
                  <div className="text-[11px] font-extrabold text-gray-900 truncate">Sofá Seccional</div>
                  <div className="text-[10px] text-gray-400 font-bold mt-0.5">S/ 1,599</div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </header>

      {/* EXPLORA POR CATEGORÍAS */}
      <section id="categorias" className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-16 scroll-mt-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Explora por categorías</h2>
            <p className="text-sm text-gray-400 mt-1">Navega a través de nuestros sectores principales y subcategorías</p>
          </div>
          <button 
            onClick={() => setSelectedCategory(null)}
            className="text-[#5D32B8] hover:text-[#FF5A00] font-extrabold text-xs uppercase tracking-widest hover:underline transition-colors cursor-pointer"
          >
            Ver todas las categorías
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MAIN_CATEGORIES.map((main) => {
            const isMainSelected = selectedCategory === main.name;
            const bgActive = main.bgActive;
            const textActive = main.textActive;
            const ringActive = main.ringActive;
            
            return (
              <div 
                key={main.name}
                className={`bg-white border rounded-3xl p-6 transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col justify-between min-h-[300px] ${
                  isMainSelected 
                    ? `border-gray-200 ring-2 ${ringActive}` 
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div>
                  {/* Main Category Header */}
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-50">
                    <button
                      onClick={() => setSelectedCategory(isMainSelected ? null : main.name)}
                      className="flex items-center gap-3 text-left group cursor-pointer"
                      type="button"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xs transition-all duration-300 group-hover:scale-105 ${bgActive}`}>
                        {main.icon}
                      </div>
                      <div>
                        <h3 className={`text-sm font-black tracking-tight uppercase transition-colors ${
                          isMainSelected ? textActive : 'text-gray-900 group-hover:text-[#FF5A00]'
                        }`}>
                          {main.name}
                        </h3>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ver todo</span>
                      </div>
                    </button>
                  </div>

                  {/* Subcategories list */}
                  <div className="flex flex-wrap gap-2">
                    {main.subcategories.map((sub) => {
                      const isSubSelected = selectedCategory === sub.name;
                      return (
                        <button
                          key={sub.name}
                          onClick={() => setSelectedCategory(isSubSelected ? null : sub.name)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-200 cursor-pointer border ${
                            isSubSelected
                              ? `${bgActive} ${textActive} border-transparent font-extrabold shadow-3xs scale-102`
                              : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-white hover:border-gray-300 hover:text-gray-900'
                          }`}
                          type="button"
                        >
                          <span className="text-xs">{sub.icon}</span>
                          <span>{sub.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
                  <span>{main.subcategories.length} subcategorías</span>
                  <button 
                    onClick={() => setSelectedCategory(isMainSelected ? null : main.name)}
                    className="text-[#5D32B8] hover:text-[#FF5A00] transition-colors flex items-center gap-1 cursor-pointer"
                    type="button"
                  >
                    <span>Explorar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONDITIONAL MAIN CONTENT AREA */}
      {(selectedCategory || searchQuery) ? (
        // UNIFIED GRID VIEW
        <section id="filtered-results" className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-8 scroll-mt-20">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                {selectedCategory === 'Favoritos' 
                  ? 'Mis Favoritos' 
                  : selectedCategory 
                    ? selectedCategory 
                    : `Búsqueda: "${searchQuery}"`}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {selectedCategory === 'Favoritos' 
                  ? 'Tus anuncios guardados para revisar y contactar en cualquier momento' 
                  : selectedCategory
                    ? `Explora las mejores ofertas publicadas en la categoría ${selectedCategory}`
                    : `Mostrando todas las publicaciones que coinciden con tu búsqueda`}
              </p>
            </div>
            
            <button 
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FF5A00] hover:text-[#E04F00] bg-orange-50 hover:bg-orange-100 border border-orange-100 px-4 py-2.5 rounded-lg shadow-3xs transition-all cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
              <span>Limpiar filtros</span>
            </button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3.5 sm:gap-4.5 lg:gap-6">
              {filteredProducts.map((p) => {
                const isFav = favorites.includes(p.id);
                return (
                  <ProductCard 
                    key={p.id}
                    product={p}
                    isFav={isFav}
                    onToggleFavorite={toggleFavorite}
                    onClick={() => setSelectedProductDetail(p)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-3xs space-y-4">
              <span className="text-6xl block select-none">🔍</span>
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">No se encontraron resultados</h3>
              <p className="text-xs text-gray-400 font-bold leading-relaxed">
                {selectedCategory === 'Favoritos' 
                  ? 'Aún no has guardado ningún anuncio. ¡Explora las publicaciones y haz clic en el icono de corazón para guardarlo en tus favoritos!'
                  : `No hay anuncios activos que coincidan con tu criterio en este momento. ¡Sé el primero en publicar un anuncio gratis!`}
              </p>
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                  if (selectedCategory !== 'Favoritos') {
                    setIsPublishModalOpen(true);
                  }
                }}
                className="inline-flex items-center gap-2 bg-[#FF5A00] hover:bg-[#E04F00] text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm cursor-pointer"
              >
                {selectedCategory === 'Favoritos' ? 'Explorar Anuncios' : 'Publicar Gratis'}
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* PRODUCTOS DESTACADOS */}
          {displayedFeatured.length > 0 && (
            <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Productos destacados</h2>
                  <p className="text-sm text-gray-400 mt-1">Anuncios patrocinados de alta confianza</p>
                </div>
                <span className="text-[#5D32B8] hover:text-[#FF5A00] font-extrabold text-xs uppercase tracking-widest hover:underline cursor-pointer transition-colors">Ver todos</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3.5 sm:gap-4.5">
                {displayedFeatured.map((p) => {
                  const isFav = favorites.includes(p.id);
                  return (
                    <ProductCard 
                      key={p.id}
                      product={p}
                      isFav={isFav}
                      onToggleFavorite={toggleFavorite}
                      onClick={() => setSelectedProductDetail(p)}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* VEHÍCULOS PARA TI (Interactive Carousel) */}
          {displayedVehicles.length > 0 && (
            <section className="bg-gray-100/40 py-16 border-y border-gray-100/60">
              <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Vehículos para ti</h2>
                    <p className="text-sm text-gray-400 mt-1">Carros, camionetas y motocicletas en Lima y provincias</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={prevVehicles}
                      className="bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-200 text-gray-600 hover:text-[#FF5A00] p-2.5 rounded-lg shadow-xs transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={nextVehicles}
                      className="bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-200 text-gray-600 hover:text-[#FF5A00] p-2.5 rounded-lg shadow-xs transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3.5 sm:gap-4.5">
                  {displayedVehicles.slice(vehicleIndex, vehicleIndex + 5).map((p) => {
                    const isFav = favorites.includes(p.id);
                    return (
                      <ProductCard 
                        key={p.id}
                        product={p}
                        isFav={isFav}
                        onToggleFavorite={toggleFavorite}
                        onClick={() => setSelectedProductDetail(p)}
                      />
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* TECNOLOGÍA QUE BUSCAS */}
          {displayedTech.length > 0 && (
            <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Tecnología que buscas</h2>
                  <p className="text-sm text-gray-400 mt-1">Laptops, celulares, accesorios y más</p>
                </div>
                <span className="text-blue-600 font-extrabold text-xs uppercase tracking-widest hover:underline cursor-pointer">Ver todos</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3.5 sm:gap-4.5">
                {displayedTech.map((p) => {
                  const isFav = favorites.includes(p.id);
                  return (
                    <ProductCard 
                      key={p.id}
                      product={p}
                      isFav={isFav}
                      onToggleFavorite={toggleFavorite}
                      onClick={() => setSelectedProductDetail(p)}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* SIDE-BY-SIDE GRIDS: PRODUCTOS NUEVOS & PRODUCTOS USADOS */}
          <section className="bg-gray-100/30 py-16 border-t border-gray-100">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Productos Nuevos Grid */}
              <div>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      Productos nuevos
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Artículos sellados directo de distribuidor</p>
                  </div>
                  <span className="text-[#5D32B8] hover:text-[#FF5A00] font-extrabold text-xs uppercase tracking-widest hover:underline cursor-pointer transition-colors">Ver todos</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayedNew.slice(0, 8).map((p) => {
                    return (
                      <div 
                        key={p.id} 
                        onClick={() => setSelectedProductDetail(p)}
                        className="bg-white p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all duration-300 cursor-pointer flex gap-4 items-center"
                      >
                        <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 text-3xl shadow-inner border border-gray-100 relative overflow-hidden">
                          {p.image ? (
                            <Image 
                              src={p.image} 
                              alt={p.title} 
                              fill 
                              className="object-cover" 
                              sizes="64px"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            p.emoji
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900 text-xs truncate uppercase tracking-tight">{p.title}</h4>
                          <p className="font-black text-gray-950 text-sm mt-0.5">S/ {p.price.toLocaleString('es-PE')}</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-0.5">{p.location}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Productos Usados Grid */}
              <div>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
                      Productos usados
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Segunda mano verificados con entrega directa</p>
                  </div>
                  <span className="text-[#5D32B8] hover:text-[#FF5A00] font-extrabold text-xs uppercase tracking-widest hover:underline cursor-pointer transition-colors">Ver todos</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayedUsed.slice(0, 8).map((p) => {
                    return (
                      <div 
                        key={p.id} 
                        onClick={() => setSelectedProductDetail(p)}
                        className="bg-white p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all duration-300 cursor-pointer flex gap-4 items-center"
                      >
                        <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 text-3xl shadow-inner border border-gray-100 relative overflow-hidden">
                          {p.image ? (
                            <Image 
                              src={p.image} 
                              alt={p.title} 
                              fill 
                              className="object-cover" 
                              sizes="64px"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            p.emoji
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900 text-xs truncate uppercase tracking-tight">{p.title}</h4>
                          <p className="font-black text-gray-950 text-sm mt-0.5">S/ {p.price.toLocaleString('es-PE')}</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-0.5">{p.location}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </section>
        </>
      )}

      {/* TIENDAS OFICIALES */}
      <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Tiendas oficiales</h2>
            <p className="text-sm text-gray-400 mt-1">Compra con garantía directa de tus marcas favoritas</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => scrollBrands('left')}
              className="w-10 h-10 rounded-full border border-gray-100 bg-white hover:border-[#FF5A00]/20 hover:bg-orange-50/20 shadow-3xs flex items-center justify-center text-gray-600 hover:text-[#FF5A00] transition-all duration-300 cursor-pointer active:scale-95"
              title="Anterior"
              type="button"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button 
              onClick={() => scrollBrands('right')}
              className="w-10 h-10 rounded-full border border-gray-100 bg-white hover:border-[#FF5A00]/20 hover:bg-orange-50/20 shadow-3xs flex items-center justify-center text-gray-600 hover:text-[#FF5A00] transition-all duration-300 cursor-pointer active:scale-95"
              title="Siguiente"
              type="button"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        <div 
          ref={brandsRef}
          className="flex overflow-x-auto gap-5 pb-6 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {BRANDS.map((b) => (
            <div 
              key={b.name} 
              className="flex-shrink-0 w-[150px] sm:w-[175px] snap-start border border-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 bg-white hover:border-[#FF5A00] hover:shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden text-center min-h-[145px]"
              onClick={() => {
                setSearchQuery(b.name);
                setTimeout(() => {
                  const section = document.getElementById('categorias') || document.getElementById('filtered-results');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              {/* Floating Category/Slogan Icon */}
              <span className="absolute top-2.5 right-2.5 text-xs bg-gray-50/80 p-1 rounded-md opacity-80 group-hover:opacity-100 transition-opacity select-none" title={b.slogan}>
                {b.icon}
              </span>

              {/* Brand Logo Display */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black tracking-tight text-[11px] uppercase ${b.color} group-hover:scale-105 transition-all duration-300 shadow-3xs`}>
                {b.logo}
              </div>

              {/* Brand name and slogan */}
              <div className="mt-1">
                <span className="text-xs font-black text-gray-950 block group-hover:text-[#FF5A00] transition-colors uppercase tracking-tight">{b.name}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">{b.slogan}</span>
              </div>

              {/* Badge Tienda Oficial */}
              <span className="text-[8px] bg-gray-50 text-gray-400 font-extrabold px-2.5 py-0.5 rounded-full group-hover:bg-[#FF5A00]/10 group-hover:text-[#FF5A00] transition-colors uppercase tracking-widest mt-1">
                Oficial
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO ACTION BANNER - Custom smartphone layout mimicking high-fidelity screenshot */}
      <section className="bg-gradient-to-r from-[#FF5A00] via-[#5D32B8] to-[#00BA9D] py-16 text-white relative overflow-hidden rounded-2xl max-w-[1800px] mx-auto my-12 shadow-xl">
        <div className="absolute top-0 right-0 w-[500px] h-full bg-radial from-white/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Publica gratis<br />
              tus productos
            </h2>
            <p className="text-orange-50 font-medium text-sm sm:text-base">
              Miles de personas verán tu anuncio
            </p>
            <div className="pt-2">
              <button 
                onClick={() => setIsPublishModalOpen(true)}
                className="bg-white hover:bg-orange-50 text-[#FF5A00] font-black px-8 py-4 rounded-lg text-xs uppercase tracking-widest shadow-lg transition-all hover:scale-105"
              >
                Publicar ahora
              </button>
            </div>
          </div>

          {/* Smartphone Mockup matching screenshot perfectly with camera overlay buttons */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative">
              {/* Overlapping Camera pointer icon buttons mimicking high fidelity screenshot */}
              <div className="absolute -top-3 -left-6 z-20 bg-white/15 backdrop-blur-md p-2 rounded-full border border-white/20 text-white animate-bounce">
                📷
              </div>
              <div className="absolute top-1/2 -right-8 z-20 bg-white/15 backdrop-blur-md p-2.5 rounded-full border border-white/20 text-white animate-pulse">
                📸
              </div>
              <div className="absolute bottom-4 -left-8 z-20 bg-white/15 backdrop-blur-md p-2 rounded-full border border-white/20 text-white">
                💡
              </div>

              {/* Styled phone */}
              <div className="w-64 h-[320px] bg-slate-950 rounded-3xl p-3.5 border-4 border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="w-16 h-4 bg-slate-800 rounded-full mx-auto mb-4" />
                <div className="bg-white rounded-2xl h-full p-4 text-slate-800 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5A00]/10 rounded-full blur-xl pointer-events-none" />
                  
                  <div>
                    <div className="flex justify-between items-center text-[11px] font-black text-[#FF5A00] mb-2 uppercase tracking-tight">
                      <span>publica.pe</span>
                      <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[8px]">Perú</span>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="h-3 bg-slate-100 rounded-md w-full" />
                      <div className="h-3 bg-slate-100 rounded-md w-3/4" />
                      <div className="h-2 bg-slate-50 rounded-md w-1/2" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[#FF5A00] text-white rounded-lg py-2 text-center text-[9px] font-black uppercase tracking-wider shadow-sm">
                      Publicar anuncio
                    </div>
                    <div className="text-[8px] text-gray-400 text-center font-bold">Simple • Seguro • Rápido</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ¿POR QUÉ ELEGIR PUBLICA.PE? */}
      <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-16 border-t border-gray-100">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-black text-gray-900">¿Por qué elegir Publica.pe?</h2>
          <p className="text-gray-400 text-sm">Somos la red de anuncios más segura e intuitiva de todo el Perú</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex gap-4 items-start">
              <span className="text-3xl p-3 bg-gray-50 rounded-lg shrink-0">{faq.icon}</span>
              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-tight">{faq.title}</h4>
                <p className="text-xs text-gray-400 mt-1 font-semibold leading-relaxed">{faq.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
        </>
      )}

      {/* FOOTER */}
      <footer className="bg-white text-gray-600 py-16 border-t border-gray-100 mt-16">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-5 gap-12 text-sm">
          
          <div className="col-span-2 space-y-4">
            <BrandLogo onClick={handleResetToHome} />
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs font-semibold">
              La plataforma peruana para comprar y vender productos nuevos y usados de forma fácil, segura y rápida.
            </p>
            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3">
              {[
                { icon: <Facebook className="w-4 h-4" />, name: 'Facebook' },
                { icon: <Instagram className="w-4 h-4" />, name: 'Instagram' },
                { icon: <Twitter className="w-4 h-4" />, name: 'Twitter' },
                { icon: <Linkedin className="w-4 h-4" />, name: 'LinkedIn' }
              ].map((social) => (
                <div key={social.name} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-[#FF5A00] hover:text-white flex items-center justify-center text-gray-400 hover:scale-105 cursor-pointer transition-all border border-gray-100">
                  {social.icon}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Categorías</h4>
            <ul className="space-y-2 text-xs text-gray-500 font-bold">
              <li className="hover:text-[#FF5A00] cursor-pointer">Tecnología</li>
              <li className="hover:text-[#FF5A00] cursor-pointer">Celulares</li>
              <li className="hover:text-[#FF5A00] cursor-pointer">Vehículos</li>
              <li className="hover:text-[#FF5A00] cursor-pointer">Inmuebles</li>
              <li className="hover:text-[#FF5A00] cursor-pointer text-[#FF5A00] font-black">Ver todas</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Empresas</h4>
            <ul className="space-y-2 text-xs text-gray-500 font-bold">
              <li className="hover:text-[#FF5A00] cursor-pointer">Sobre nosotros</li>
              <li className="hover:text-[#FF5A00] cursor-pointer">Trabaja con nosotros</li>
              <li className="hover:text-[#FF5A00] cursor-pointer">Publicidades</li>
              <li className="hover:text-[#FF5A00] cursor-pointer">Prensa</li>
            </ul>
          </div>

          <div className="space-y-4 text-xs font-bold">
            <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Ayuda &amp; Legal</h4>
            <ul className="space-y-2 text-gray-500">
              <li className="hover:text-[#FF5A00] cursor-pointer">Centro de ayuda</li>
              <li className="hover:text-[#FF5A00] cursor-pointer">Cómo comprar/vender</li>
              <li className="hover:text-[#FF5A00] cursor-pointer">Seguridad</li>
              <li className="hover:text-[#FF5A00] cursor-pointer">Términos y condiciones</li>
              <li className="hover:text-[#FF5A00] cursor-pointer">Políticas de cookies</li>
            </ul>
          </div>

        </div>

        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-xs font-bold">
          <div>
            © 2026 Publica.pe - Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#FF5A00]" /> 01 234 5678</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#00BA9D]" /> hola@publica.pe</span>
            <span className="flex items-center gap-1"><MapPinned className="w-3.5 h-3.5 text-[#5D32B8]" /> Lima, Perú</span>
          </div>
        </div>
      </footer>

      {/* CHAT BOX IN CORNER */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen ? (
          <div className="bg-white rounded-2xl w-80 sm:w-96 shadow-2xl border border-gray-150 flex flex-col h-[420px] overflow-hidden" id="chat-box">
            
            {/* Chat header */}
            <div className="bg-[#5D32B8] text-white px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                <div>
                  <h4 className="font-black text-sm">{chatRecipient}</h4>
                  <p className="text-[10px] text-emerald-400 font-extrabold uppercase">En línea • Perú</p>
                </div>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="hover:bg-[#4C28A1] p-1.5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-200 hover:text-white" />
              </button>
            </div>

            {/* Chat messages list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-xl max-w-[85%] text-xs font-bold ${msg.sender === 'me' ? 'bg-[#FF5A00] text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-xs'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 mx-1 font-bold">{msg.time}</span>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold px-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300" />
                  <span>Escribiendo...</span>
                </div>
              )}
            </div>

            {/* Chat input footer */}
            <div className="border-t border-gray-100 p-3 bg-white flex gap-2">
              <input 
                type="text" 
                placeholder="Escribe un mensaje seguro..." 
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#FF5A00]"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-[#FF5A00] hover:bg-[#E04F00] text-white p-2.5 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          <button 
            onClick={() => setChatOpen(true)}
            className="bg-[#FF5A00] hover:bg-[#E04F00] text-white p-4 rounded-xl shadow-2xl hover:scale-105 transition-all flex items-center justify-center relative border border-white/10"
          >
            <MessageSquare className="w-6 h-6 stroke-[2]" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] rounded-full w-5 h-5 flex items-center justify-center border-2 border-white font-bold">
              1
            </span>
          </button>
        )}
      </div>

      {/* PRODUCT DETAIL RENDERED FULL PAGE ABOVE */}

      {/* VERIFICATION DIALOG MODAL (With backdrop blur effect) */}
      <AnimatePresence>
        {verificationDialogOpen && (
          <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative p-6 sm:p-8 border border-gray-150"
              id="verification-dialog"
            >
              <button 
                onClick={handleCloseVerificationDialog}
                className="absolute top-4 right-4 bg-gray-50 hover:bg-gray-100 p-2 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-4 pt-4">
                {/* Elegant Lock Icon Header */}
                <div className="w-16 h-16 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mx-auto text-orange-500 shadow-sm animate-pulse">
                  <Lock className="w-8 h-8 stroke-[2.2]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-gray-950 uppercase tracking-wide">Verifica tu cuenta para continuar</h3>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed px-2">
                    Para proteger la privacidad de nuestros vendedores y brindar una experiencia más segura, solo los usuarios registrados pueden visualizar el número completo de WhatsApp.
                  </p>
                </div>
              </div>

              <div className="h-px bg-gray-100/60 my-6" />

              {/* Interaction Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setVerificationDialogOpen(false);
                    setAuthMode('register');
                    setIsRegistering(true);
                  }}
                  className="w-full bg-[#FF5A00] hover:bg-[#E04F00] text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Crear cuenta gratis</span>
                </button>

                <button 
                  onClick={() => {
                    setVerificationDialogOpen(false);
                    setAuthMode('login');
                    setIsRegistering(true);
                  }}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Iniciar sesión</span>
                </button>
              </div>

              <p className="text-[10px] text-gray-400 font-bold text-center mt-5">
                ¿Ya eres miembro? Inicia sesión para revelar de inmediato.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: "PUBLICAR GRATIS" COMPONENT FORM */}
      <AnimatePresence>
        {isPublishModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`bg-white rounded-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 transition-all duration-300 ${publishStep === 1 ? 'max-w-2xl' : 'max-w-lg'}`}
              id="publish-modal"
            >
              <button 
                onClick={() => { setIsPublishModalOpen(false); setPublishStep(1); setSelectedMainPublishCategory(null); }}
                className="absolute top-4 right-4 bg-gray-50 hover:bg-gray-100 p-2 rounded-full text-gray-500 hover:text-gray-900 transition-colors z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {publishStep === 1 ? (
                <div>
                  <div className="mb-6 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] bg-orange-50 text-[#FF5A00] font-black px-2.5 py-1 rounded-md uppercase tracking-wider w-fit">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      <span>Paso 1 de 2</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                      {selectedMainPublishCategory ? `Subcategoría de ${selectedMainPublishCategory}` : 'Elige una categoría'}
                    </h3>
                    <p className="text-xs text-gray-400 font-bold">
                      {selectedMainPublishCategory 
                        ? 'Elige la subcategoría específica para clasificar mejor tu publicación' 
                        : 'Selecciona el sector principal donde deseas publicar tu anuncio o servicio'}
                    </p>
                  </div>

                  {selectedMainPublishCategory === null ? (
                    /* Show 4 Main Categories */
                    <div className="grid grid-cols-2 gap-4 my-6">
                      {MAIN_CATEGORIES.map((main) => {
                        const bgActive = main.bgActive || 'bg-orange-50';
                        const hoverBgStyle = main.hoverBg || 'hover:bg-[#FF5A00]/5';
                        const hoverTextStyle = main.hoverText || 'hover:text-[#FF5A00]';
                        
                        return (
                          <button
                            key={main.name}
                            type="button"
                            onClick={() => setSelectedMainPublishCategory(main.name)}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer shadow-2xs ${hoverBgStyle} min-h-[160px]`}
                          >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-all duration-300 group-hover:scale-108 ${bgActive}`}>
                              {main.icon}
                            </div>
                            <span className={`text-xs font-black text-center tracking-tight transition-colors text-gray-900 ${hoverTextStyle} uppercase mt-4`}>
                              {main.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Show Subcategories of Selected Main Category */
                    <div>
                      <button 
                        type="button"
                        onClick={() => setSelectedMainPublishCategory(null)}
                        className="mb-4 text-[#5D32B8] hover:text-[#FF5A00] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:underline transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Volver a categorías principales</span>
                      </button>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 max-h-[45vh] overflow-y-auto pr-1">
                        {MAIN_CATEGORIES.find(m => m.name === selectedMainPublishCategory)?.subcategories.map((sub) => {
                          return (
                            <button
                              key={sub.name}
                              type="button"
                              onClick={() => {
                                setNewProductForm(prev => ({ 
                                  ...prev, 
                                  category: sub.name,
                                  emoji: sub.icon 
                                }));
                                setPublishStep(2);
                              }}
                              className="flex flex-col items-center justify-center p-5 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group cursor-pointer shadow-3xs hover:bg-[#FF5A00]/5"
                            >
                              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm transition-all duration-300 group-hover:scale-110 bg-gray-50 group-hover:bg-white">
                                {sub.icon}
                              </div>
                              <span className="text-[11px] font-black text-center tracking-tight text-gray-700 group-hover:text-[#FF5A00] transition-colors uppercase mt-3">
                                {sub.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-gray-400 font-bold text-center mt-4">
                    Tu anuncio será revisado por nuestro equipo de seguridad antes de su publicación.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-6 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setPublishStep(1)}
                        className="text-[#5D32B8] hover:text-[#FF5A00] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:underline transition-colors cursor-pointer"
                        type="button"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Cambiar Categoría</span>
                      </button>
                      <span className="text-xs text-gray-300">|</span>
                      <span className="text-[9px] bg-[#5D32B8]/10 text-[#5D32B8] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                        <span>{newProductForm.emoji}</span>
                        <span>{newProductForm.category}</span>
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase pt-1.5">Completa los datos de tu anuncio</h3>
                    <p className="text-xs text-gray-400 font-bold">Tu anuncio se publicará gratis de inmediato en la categoría seleccionada</p>
                  </div>

                  <form onSubmit={handlePublishSubmit} className="space-y-4">
                    
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Título del anuncio</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej: iPhone 15 Pro de 256GB" 
                        value={newProductForm.title}
                        onChange={(e) => setNewProductForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#FF5A00]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Precio (S/)</label>
                        <input 
                          type="number" 
                          required
                          placeholder="Ej: 3200" 
                          value={newProductForm.price}
                          onChange={(e) => setNewProductForm(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#FF5A00] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Categoría confirmada</label>
                        <input 
                          type="text" 
                          disabled
                          value={newProductForm.category}
                          className="w-full border border-gray-150 bg-gray-50/70 text-gray-400 rounded-lg px-4 py-2.5 text-xs font-bold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Condición</label>
                        <div className="flex gap-2">
                          {['Nuevo', 'Usado'].map(cond => (
                            <button 
                              type="button"
                              key={cond}
                              onClick={() => setNewProductForm(prev => ({ ...prev, condition: cond }))}
                              className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase transition-all ${newProductForm.condition === cond ? 'bg-[#FF5A00] text-white shadow-sm' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}
                            >
                              {cond}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Ícono representativo</label>
                        <select 
                          value={newProductForm.emoji}
                          onChange={(e) => setNewProductForm(prev => ({ ...prev, emoji: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#FF5A00] bg-white"
                        >
                          <option value="📦">📦 Caja Genérica</option>
                          <option value="💻">💻 Computadora</option>
                          <option value="📱">📱 Celular</option>
                          <option value="🚗">🚗 Auto / Vehículo</option>
                          <option value="🏠">🏠 Inmueble</option>
                          <option value="🛋️">🛋️ Sofá / Hogar</option>
                          <option value="👕">👕 Ropa / Moda</option>
                          <option value="🎮">🎮 Gaming / Consola</option>
                          <option value="🔧">🔧 Herramientas</option>
                          <option value="🐶">🐶 Mascotas</option>
                          <option value="💼">💼 Empleo</option>
                          <option value="🚲">🚲 Deportes</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Ubicación</label>
                      <input 
                        type="text" 
                        placeholder="Ej: San Isidro, Lima" 
                        value={newProductForm.location}
                        onChange={(e) => setNewProductForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#FF5A00]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Descripción del producto</label>
                      <textarea 
                        rows={3}
                        placeholder="Describe el estado real de tu artículo, detalles, etc." 
                        value={newProductForm.description}
                        onChange={(e) => setNewProductForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#FF5A00] resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        className="w-full bg-[#FF5A00] hover:bg-[#E04F00] text-white font-black text-xs uppercase tracking-widest py-3 rounded-lg shadow-sm transition-all"
                      >
                        Publicar anuncio ahora
                      </button>
                    </div>

                  </form>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM PREMIUM FLOATING TOAST NOTIFICATION */}
      <AnimatePresence>
        {customToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-950/95 backdrop-blur-md text-white px-6 py-4 rounded-full shadow-2xl border border-white/10 max-w-sm sm:max-w-md"
          >
            <div className="w-5.5 h-5.5 bg-[#00BA9D] rounded-full flex items-center justify-center text-white font-bold shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3.5]" />
            </div>
            <p className="text-[11px] font-black tracking-wide uppercase leading-tight">{customToast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
