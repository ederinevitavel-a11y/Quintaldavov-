/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBasket, 
  Clock, 
  MapPin, 
  Heart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  HandHeart,
  Store,
  ChevronRight,
  UtensilsCrossed
} from 'lucide-react';

// Types
interface Flavor {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  tag?: string;
}

interface CartItem {
  flavorId: string;
  quantity: number;
}

// Constants
const WHATSAPP_NUMBER = "5511965394076";
const UNIT_PRICE = 24.99; // Price for 500g package as per image

const FLAVORS: Flavor[] = [
  {
    id: 'carne',
    name: 'Carne com Carinho',
    category: 'Tradicional',
    description: 'Carne moída de primeira selecionada, temperada com cebola picadinha, ervas frescas e aquele toque de casa da vovó.',
    price: UNIT_PRICE,
    image: 'https://i.imgur.com/KAb26iV.png',
    tag: 'O Preferido'
  },
  {
    id: 'frango',
    name: 'Franguinho da Vovó',
    category: 'Caseira',
    description: 'Suculento frango desfiado com temperos naturais da horta, envolto em uma massa levíssima e douradinha.',
    price: UNIT_PRICE,
    image: 'https://i.imgur.com/5eAlIIi.png',
  },
  {
    id: 'ricota',
    name: 'Nuvem de Ricota',
    category: 'Delicada',
    description: 'Delicada ricota fresca batida com azeitonas selecionadas, trazendo o equilíbrio perfeito do salgado com a leveza.',
    price: UNIT_PRICE,
    image: 'https://i.imgur.com/9JBxkLs.png',
  }
];

export default function App() {
  const [isBakingInstructionsOpen, setIsBakingInstructionsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (flavorId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.flavorId === flavorId);
      if (existing) {
        return prev.map(item => 
          item.flavorId === flavorId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { flavorId, quantity: 1 }];
    });
  };

  const removeFromCart = (flavorId: string) => {
    setCart(prev => prev.filter(item => item.flavorId !== flavorId));
  };

  const updateQuantity = (flavorId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.flavorId === flavorId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.quantity * UNIT_PRICE), 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const sendOrder = () => {
    const messageLines = [
      "*Olá Vó Regina! Gostaria de fazer um pedido:*",
      "",
      ...cart.map(item => {
        const flavor = FLAVORS.find(f => f.id === item.flavorId);
        return `• ${item.quantity}x Pacote 500g de ${flavor?.name}`;
      }),
      "",
      `*Total: R$ ${cartTotal.toFixed(2)}*`,
      "",
      "Podem confirmar para mim? Obrigado!"
    ];
    const text = encodeURIComponent(messageLines.join('\n'));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#4A3728]">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-full overflow-hidden shadow-sm flex items-center justify-center p-1">
              <img src="https://i.imgur.com/A3BNQYF.png" alt="Logo Quintal da Vó Regina" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight">Quintal da Vó Regina</span>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 bg-[#F5E6D3] hover:bg-[#EDD1B0] rounded-full transition-colors group"
          >
            <ShoppingBasket size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8B4513] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8F0E8] text-[#3D5A3D] rounded-full text-sm font-medium"
            >
              <Heart size={14} className="fill-current" />
              <span>Delícias feitas com amor</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-bold leading-tight"
            >
              O sabor <span className="text-[#5B7B5B]">caseiro</span> que abraça o coração.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[#6B5A4E] max-w-lg leading-relaxed"
            >
              No Quintal da Vó Regina, cada esfiha é preparada seguindo a receita tradicional da família. Massa leve, recheios generosos e o carinho que só uma avó sabe dar.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-[#EDD1B0]/30 flex items-center gap-3 w-fit"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <UtensilsCrossed size={20} />
              </div>
              <p className="text-xs font-bold leading-tight text-[#8B4513]">Pacotes de 500g<br/>Prontos para assar!</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <a href="#menu" className="px-8 py-4 bg-[#5B7B5B] text-white rounded-2xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2">
                Ver Cardápio <ArrowRight size={18} />
              </a>
              <div className="flex items-center gap-3 text-sm font-medium text-[#8B4513]">
                <span>Já somos a escolha de mais de 500 famílias que amam o sabor caseiro!</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="flex-1 relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden aspect-square shadow-2xl rotate-3 border-8 border-white bg-white">
              <img 
                src="https://i.imgur.com/A3BNQYF.png" 
                alt="Esfihas Caseiras do Quintal da Vó Regina" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F5E6D3] rounded-full blur-3xl opacity-60 -z-1" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#E8F0E8] rounded-full blur-3xl opacity-60 -z-1" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-[#F5E6D3]/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-[#5B7B5B]">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold mb-1">Assa em 10 min</h3>
              <p className="text-sm text-[#6B5A4E]">Praticidade para o seu lanche ou jantar em família.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-[#8B4513]">
              <HandHeart size={24} />
            </div>
            <div>
              <h3 className="font-bold mb-1">100% Artesanal</h3>
              <p className="text-sm text-[#6B5A4E]">Sem conservantes, apenas ingredientes frescos.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-red-500">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold mb-1">Entregamos em Casa</h3>
              <p className="text-sm text-[#6B5A4E]">Consulte o valor da entrega para sua região.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold">Nossos Sabores Especiais</h2>
          <p className="text-[#6B5A4E] max-w-2xl mx-auto leading-relaxed">
            Escolha seus favoritos. Cada pacote de 500g custa apenas <strong className="text-[#8B4513]">R$ 24,99</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FLAVORS.map((flavor, idx) => (
            <motion.div 
              key={flavor.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#EDD1B0]/20"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={flavor.image} 
                  alt={flavor.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                {flavor.tag && (
                  <div className="absolute top-4 right-4 bg-[#8B4513] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {flavor.tag}
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-[#5B7B5B]">
                  {flavor.category}
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-[#4A3728]">{flavor.name}</h3>
                  <p className="text-sm text-[#6B5A4E] leading-relaxed line-clamp-3">
                    {flavor.description}
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <div className="text-xl font-bold font-serif text-[#8B4513]">
                    R$ {flavor.price.toFixed(2)}
                    <span className="text-xs font-normal text-gray-400 block mt-1">Pacote 500g</span>
                  </div>
                  <button 
                    onClick={() => addToCart(flavor.id)}
                    className="w-12 h-12 bg-[#5B7B5B] hover:bg-[#4A634A] text-white rounded-2xl flex items-center justify-center transition-all hover:rotate-90 active:scale-95 shadow-md"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4A3728] text-[#F5E6D3] py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-full overflow-hidden flex items-center justify-center p-1">
                <img src="https://i.imgur.com/A3BNQYF.png" alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <span className="text-2xl font-serif font-bold">Quintal da Vó Regina</span>
            </div>
            <p className="max-w-md text-sm opacity-80 leading-relaxed">
              Resgatando o sabor da infância em cada mordida. Nossas esfihas são assadas, congeladas e prontas para trazer alegria para a sua mesa.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#5B7B5B] hover:border-[#5B7B5B] transition-colors">
                <Heart size={18} />
              </a>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-serif font-bold text-lg">Menu Rápido</h4>
            <ul className="space-y-3 opacity-80 text-sm">
              <li>
                <button 
                  onClick={() => setIsHistoryOpen(true)} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Nossa História
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsBakingInstructionsOpen(true)} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Como Assar
                </button>
              </li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-serif font-bold text-lg">Fale com a Vovó</h4>
            <ul className="space-y-4 opacity-80 text-sm">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-[#5B7B5B]" />
                <span>Atendendo São Paulo e Região</span>
              </li>
              <li className="flex items-center gap-3">
                <WhatsappIcon size={18} className="text-[#5B7B5B]" />
                <span>(11) 96539-4076</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/10 text-center opacity-50 text-xs">
          ®2026 todos os direitos reservados a Major
        </div>
      </footer>

      {/* History Modal */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="fixed inset-0 bg-[#4A3728]/60 backdrop-blur-md z-[120]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl bg-[#FDFBF7] z-[121] shadow-2xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="md:w-1/2 h-64 md:h-auto relative">
                <img 
                  src="https://i.imgur.com/DoRgY32.png" 
                  alt="Vovó Regina e seus netos" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A3728]/40 to-transparent md:hidden" />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto space-y-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4A3728]">Nossa História</h2>
                  <button 
                    onClick={() => setIsHistoryOpen(false)}
                    className="p-2 hover:bg-[#F5E6D3] rounded-full transition-colors text-[#4A3728]"
                  >
                    <Plus size={24} className="rotate-45" />
                  </button>
                </div>
                
                <div className="space-y-6 text-[#6B5A4E] leading-relaxed">
                  <p className="italic border-l-4 border-[#EDD1B0] pl-6 py-2 text-lg">
                    "A Vó Regina não era apenas uma cozinheira; ela era o coração pulsante da nossa família."
                  </p>
                  
                  <p>
                    Era no quintal que tudo acontecia — risadas, encontros, infância livre e memórias que ficaram pra sempre. E era na cozinha dela que o simples se transformava em algo inesquecível.
                  </p>
                  
                  <p>
                    Suas receitas não eram só comida. Eram cuidado, eram presença, eram a forma mais sincera de dizer <strong>“eu te amo”</strong> sem precisar de muitas palavras.
                  </p>

                  <p>
                    Ela não fazia esfihas. Mas nos ensinou algo maior: que cozinhar é um ato de amor — e que é isso que realmente alimenta.
                  </p>

                  <p>
                    Hoje, o <strong>Quintal da Vó Regina</strong> nasce dessa história. Das lembranças no quintal, das receitas guardadas com carinho e do desejo de manter viva tudo aquilo que ela representava.
                  </p>

                  <p>
                    Cada sabor carrega um pedaço dessa memória. Cada detalhe é uma forma de homenagem. Mais do que vender comida, queremos compartilhar afeto. E convidar você a sentir um pouco do que foi crescer nesse quintal cheio de amor. 🤍
                  </p>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => setIsHistoryOpen(false)}
                    className="w-full py-4 bg-[#8B4513] text-white rounded-2xl font-bold hover:bg-[#6F370F] transition-all flex items-center justify-center gap-2"
                  >
                    <Heart size={18} className="fill-current" /> Continuar nosso legado
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Sidebar Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <ShoppingBasket size={24} className="text-[#5B7B5B]" />
                  <h2 className="text-xl font-serif font-bold">Seu Pedido</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Minus size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <ShoppingBasket size={64} strokeWidth={1} />
                    <p className="font-medium">Sua cesta está vazia.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-sm underline hover:text-[#5B7B5B]"
                    >
                      Voltar às compras
                    </button>
                  </div>
                ) : (
                  cart.map(item => {
                    const flavor = FLAVORS.find(f => f.id === item.flavorId)!;
                    return (
                      <div key={item.flavorId} className="flex gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                          <img src={flavor.image} alt={flavor.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm leading-tight">{flavor.name}</h4>
                            <button 
                              onClick={() => removeFromCart(item.flavorId)}
                              className="text-gray-300 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center bg-gray-50 rounded-lg p-1">
                              <button 
                                onClick={() => updateQuantity(item.flavorId, -1)}
                                className="w-6 h-6 flex items-center justify-center hover:text-[#5B7B5B]"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.flavorId, 1)}
                                className="w-6 h-6 flex items-center justify-center hover:text-[#5B7B5B]"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <span className="font-bold text-[#8B4513] text-sm">
                              R$ {(item.quantity * flavor.price).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-gray-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-2xl font-serif font-bold text-[#4A3728]">R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={sendOrder}
                    className="w-full py-4 bg-[#5B7B5B] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#4A634A] transition-all"
                  >
                    <WhatsappIcon size={20} />
                    Finalizar no WhatsApp
                  </button>
                  <p className="text-[10px] text-center text-gray-400 italic">
                    Ao clicar, abriremos sua conversa com a Vó Regina para confirmar os detalhes.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Baking Instructions Modal */}
      <AnimatePresence>
        {isBakingInstructionsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBakingInstructionsOpen(false)}
              className="fixed inset-0 bg-[#4A3728]/60 backdrop-blur-md z-[110]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl bg-[#FDFBF7] z-[111] shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 md:p-12 space-y-8 overflow-y-auto">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4A3728]">Como Assar suas Esfihas</h2>
                    <p className="text-[#8B4513] font-medium">Siga as dicas da Vó Regina para o melhor sabor!</p>
                  </div>
                  <button 
                    onClick={() => setIsBakingInstructionsOpen(false)}
                    className="p-2 hover:bg-[#F5E6D3] rounded-full transition-colors text-[#4A3728]"
                  >
                    <Plus size={24} className="rotate-45" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-3xl border border-[#EDD1B0]/30 space-y-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                      <Store size={24} />
                    </div>
                    <h3 className="text-xl font-serif font-bold">No Forno</h3>
                    <ul className="text-sm space-y-3 text-[#6B5A4E]">
                      <li className="flex gap-2">
                        <span className="font-bold text-[#5B7B5B]">1.</span>
                        Prê-aqueça o forno a 200°C por 10 minutos.
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-[#5B7B5B]">2.</span>
                        Coloque as esfihas em uma assadeira (não precisa untar).
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-[#5B7B5B]">3.</span>
                        Asse por 10 a 15 minutos ou até ficarem douradinhas.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-[#EDD1B0]/30 space-y-4">
                    <div className="w-12 h-12 bg-[#E8F0E8] rounded-2xl flex items-center justify-center text-[#5B7B5B]">
                      <Clock size={24} />
                    </div>
                    <h3 className="text-xl font-serif font-bold">Na Air Fryer</h3>
                    <ul className="text-sm space-y-3 text-[#6B5A4E]">
                      <li className="flex gap-2">
                        <span className="font-bold text-[#8B4513]">1.</span>
                        Ajuste para 180°C.
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-[#8B4513]">2.</span>
                        Coloque as esfihas sem sobrepor.
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-[#8B4513]">3.</span>
                        Asse por 8 a 10 minutos. Fique de olho para não queimar!
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-[#E8F0E8] p-6 rounded-3xl flex items-start gap-4">
                  <div className="p-2 bg-white rounded-full text-[#5B7B5B]">
                    <Heart size={20} className="fill-current" />
                  </div>
                  <div className="text-sm leading-relaxed text-[#3D5A3D]">
                    <strong className="block text-lg font-serif mb-1 italic text-[#5B7B5B]">Dica de Ouro da Vó:</strong>
                    "Se você gosta delas bem macias, pincele um pouquinho de azeite ou manteiga assim que tirar do forno. Fica uma delícia, meu filho!"
                  </div>
                </div>

                <button 
                  onClick={() => setIsBakingInstructionsOpen(false)}
                  className="w-full py-4 bg-[#5B7B5B] text-white rounded-2xl font-bold hover:bg-[#4A634A] transition-all"
                >
                  Entendi, Vovó!
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating CTA for Mobile */}
      {totalItems > 0 && !isCartOpen && (
        <motion.button 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 md:hidden bg-[#8B4513] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 z-40"
        >
          <ShoppingBasket size={20} />
          <span className="font-bold">Ver Pedido ({totalItems})</span>
        </motion.button>
      )}
    </div>
  );
}

// Custom components
function WhatsappIcon({ size = 20, className = "" }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  );
}
