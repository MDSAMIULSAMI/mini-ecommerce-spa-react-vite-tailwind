import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Plus, Minus, X, Star, ArrowLeft, ChevronLeft, ChevronRight, Zap, Shield, Cpu, Wifi, ArrowUp, Twitter, Facebook, Instagram, Linkedin, Sun, Moon, Sunrise } from 'lucide-react';
import Swal from 'sweetalert2';

// Mock products data
const PRODUCTS = [
  {
    id: 1,
    title: "Wireless Bluetooth Headphones",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    category: "Electronics",
    rating: 4.5,
    reviews: 128,
    features: ["Noise Cancellation", "30-hour Battery", "Bluetooth 5.0", "Quick Charge"]
  },
  {
    id: 2,
    title: "Smart Fitness Watch",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    description: "Advanced fitness tracking with heart rate monitoring, GPS, and smartphone integration. Water resistant up to 50 meters.",
    category: "Wearables",
    rating: 4.7,
    reviews: 89,
    features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "7-day Battery"]
  },
  {
    id: 3,
    title: "Organic Cotton T-Shirt",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    description: "Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes.",
    category: "Clothing",
    rating: 4.3,
    reviews: 245,
    features: ["100% Organic Cotton", "Eco-Friendly", "Pre-shrunk", "Machine Washable"]
  },
  {
    id: 4,
    title: "Stainless Steel Water Bottle",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
    description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    category: "Accessories",
    rating: 4.6,
    reviews: 167,
    features: ["Double Wall Insulation", "Leak Proof", "BPA Free", "24oz Capacity"]
  },
  {
    id: 5,
    title: "Wireless Charging Pad",
    price: 39.99,
    image: "https://m.media-amazon.com/images/I/61oIAKY9s1L._AC_SL1500_.jpg",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Includes LED indicator and non-slip base.",
    category: "Electronics",
    rating: 4.4,
    reviews: 203,
    features: ["Qi Compatible", "Fast Charging", "LED Indicator", "Non-slip Base"]
  },
  {
    id: 6,
    title: "Ergonomic Office Chair",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    description: "Ergonomic office chair with lumbar support, adjustable height, and breathable mesh back for all-day comfort.",
    category: "Furniture",
    rating: 4.8,
    reviews: 156,
    features: ["Lumbar Support", "Adjustable Height", "Breathable Mesh", "360° Swivel"]
  },
  {
    id: 7,
    title: "Gaming Mechanical Keyboard",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
    description: "RGB mechanical gaming keyboard with customizable keys and lightning-fast response times.",
    category: "Electronics",
    rating: 4.6,
    reviews: 312,
    features: ["RGB Lighting", "Mechanical Switches", "Programmable Keys", "Gaming Mode"]
  },
  {
    id: 8,
    title: "Smart Home Speaker",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=300&fit=crop",
    description: "Voice-controlled smart speaker with premium sound quality and smart home integration.",
    category: "Electronics",
    rating: 4.4,
    reviews: 198,
    features: ["Voice Control", "Smart Home Hub", "Premium Audio", "Multi-room Audio"]
  }
];

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // --- Start of Theme Logic ---
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme && ['dark', 'warm'].includes(storedTheme)) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'warm';
    }
    return 'dark';
  });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    // Remove all possible theme classes first to avoid conflicts
    root.classList.remove('dark', 'warm');
    
    // Add the current theme class
    root.classList.add(theme);

    // Tailwind's dark mode variant relies on the 'dark' class on a parent element.
    // This ensures dark: utilities work correctly when our theme is 'dark'.
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
    setIsThemeMenuOpen(false);
  }

  // --- End of Theme Logic ---

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(PRODUCTS.length / ITEMS_PER_PAGE);
  const startIndex = (currentPageNum - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = PRODUCTS.slice(startIndex, endIndex);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  
  const showAlert = (title, text, icon = 'success') => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const warmConfirm = 'from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500';
    const defaultConfirm = 'from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500';
    Swal.fire({
      title, text, icon,
      confirmButtonText: 'OK',
      background: isDarkMode ? '#1f2937' : (theme === 'warm' ? '#fffaf0' : '#ffffff'),
      color: isDarkMode ? '#ffffff' : (theme === 'warm' ? '#292524' : '#1f2937'),
      confirmButtonColor: theme === 'warm' ? '#d97706' : '#06b6d4',
      customClass: {
        popup: 'rounded-2xl border',
        title: isDarkMode ? 'text-white' : (theme === 'warm' ? 'text-stone-800' : 'text-gray-900'),
        content: isDarkMode ? 'text-gray-300' : (theme === 'warm' ? 'text-stone-600' : 'text-gray-600'),
        confirmButton: `bg-gradient-to-r ${theme === 'warm' ? warmConfirm : defaultConfirm} rounded-xl px-6 py-3 font-medium transition-all duration-200 text-white`
      },
      timer: 5000,
      timerProgressBar: true,
    });
  };

  const addToCart = (product) => {
    setCart(prev => {
      const item = prev.find(i => i.id === product.id);
      return item ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQty) => setCart(prev => newQty <= 0 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = (formData) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showAlert('Order Placed!', `Thank you ${formData.name}! Your order of $${cartTotal.toFixed(2)} is on its way.`, 'success');
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
    }, 2000);
  };

  const handlePageChange = (page) => {
    setIsLoading(true);
    setCurrentPageNum(page);
    setTimeout(() => setIsLoading(false), 300);
    scrollToTop();
  };

  const ProductCard = ({ product, index }) => (
    <div 
      className={`group relative rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border  
      ${theme === 'warm' 
        ? 'bg-orange-50 border-amber-200 hover:border-amber-400 dark:bg-gradient-to-br dark:from-stone-900 dark:to-stone-800 dark:border-stone-700 dark:hover:border-amber-400 dark:hover:shadow-amber-400/20' 
        : 'bg-white border-gray-200 hover:border-cyan-400 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:border-gray-700 dark:hover:border-cyan-400 dark:hover:shadow-cyan-400/20'}`
      }
      style={{ animation: `scaleIn 0.5s ease-out both ${index * 100}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${theme === 'warm' ? 'from-amber-400/10 to-red-400/10' : 'from-cyan-400/10 to-purple-400/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className={`absolute inset-0 bg-gradient-to-r ${theme === 'warm' ? 'from-amber-400 via-red-400 to-amber-400' : 'from-cyan-400 via-purple-400 to-cyan-400'} opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500`}></div>
      <div className="relative z-10">
        <div className="relative overflow-hidden">
          <img src={product.image} alt={product.title} className="w-full h-52 object-cover cursor-pointer transform group-hover:scale-110 transition-transform duration-500" onClick={() => { setSelectedProduct(product); setCurrentPage('product'); }}/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className={`absolute top-3 right-3 backdrop-blur-sm rounded-full px-3 py-1 border ${theme === 'warm' ? 'bg-orange-100/70 border-amber-200 dark:bg-black/70 dark:border-amber-400/30' : 'bg-white/80 border-gray-300 dark:bg-black/70 dark:border-cyan-400/30'}`}>
            <div className="flex items-center text-sm"><Star className="h-4 w-4 text-yellow-400 fill-current" /><span className={`ml-1 font-medium ${theme === 'warm' ? 'text-stone-800' : 'text-gray-800'} dark:text-white`}>{product.rating}</span></div>
          </div>
          <div className={`absolute top-3 left-3 ${theme === 'warm' ? 'bg-amber-600/90' : 'bg-cyan-500/90'} backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white`}>{product.category}</div>
        </div>
        <div className="p-5">
          <h3 
             className={`text-lg font-bold mb-2 transition-colors duration-300 cursor-pointer ${
                theme === 'warm' ? 'text-stone-800 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-500' : 'text-gray-800 group-hover:text-cyan-500 dark:text-white dark:group-hover:text-cyan-400'
             }`} 
             onClick={() => { setSelectedProduct(product); setCurrentPage('product'); }}>
             {product.title}
          </h3>
          <p className={`text-sm mb-4 line-clamp-2 ${theme === 'warm' ? 'text-stone-600' : 'text-gray-600'} dark:text-gray-400`}>{product.description}</p>
          <div className="flex items-center justify-between mt-4">
            <span className={`text-2xl font-bold ${theme === 'warm' ? 'text-amber-600 dark:text-amber-500' : 'text-cyan-600 dark:text-cyan-400'}`}>${product.price}</span>
            <button onClick={(e) => { e.stopPropagation(); addToCart(product); showAlert('Added to Cart!', `${product.title} has been added to your cart.`, 'success'); }} className={`bg-gradient-to-r ${theme === 'warm' ? 'from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 hover:shadow-amber-500/40' : 'from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-500/40'} text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 shadow-lg`}><ShoppingCart className="h-4 w-4" /><span className="font-medium text-sm">Add</span></button>
          </div>
        </div>
      </div>
    </div>
  );

  const Pagination = () => {
    const chevronClasses = `p-2 sm:p-3 rounded-xl dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border dark:border-gray-600 ${
      theme === 'warm'
        ? 'bg-orange-50 text-stone-700 border-amber-200 hover:bg-amber-100 dark:bg-stone-800 dark:border-stone-700 dark:hover:bg-stone-700'
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
    }`;

    const pageNumberBaseClasses = "px-3 py-2 sm:px-4 sm:py-3 rounded-xl font-medium transition-all duration-200";

    return (
      <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-12 mb-8">
        <button onClick={() => handlePageChange(currentPageNum - 1)} disabled={currentPageNum === 1} className={chevronClasses}>
          <ChevronLeft className="h-5 w-5" />
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const isActive = currentPageNum === page;
          
          const activeClasses = `text-white shadow-lg bg-gradient-to-r ${theme === 'warm' ? 'from-amber-500 to-red-600' : 'from-cyan-500 to-purple-600'}`;
          const inactiveClasses = `dark:text-gray-300 border ${
            theme === 'warm'
              ? 'bg-orange-50 text-stone-700 border-amber-200 hover:bg-amber-100 dark:bg-stone-800 dark:border-stone-700 dark:hover:bg-stone-700'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700'
          }`;

          return (
            <button key={page} onClick={() => handlePageChange(page)} className={`${pageNumberBaseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
              {page}
            </button>
          );
        })}
        
        <button onClick={() => handlePageChange(currentPageNum + 1)} disabled={currentPageNum === totalPages} className={chevronClasses}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  const Homepage = () => {
    const heroGradient = theme === 'warm' 
      ? "from-amber-500 via-red-500 to-amber-500 dark:from-amber-400 dark:via-red-400 dark:to-amber-400" 
      : "from-cyan-600 via-purple-600 to-cyan-600 dark:from-cyan-400 dark:via-purple-400 dark:to-cyan-400";
    const heroFeatures = [
        {icon: Zap, text: 'Fast Delivery', color: theme === 'warm' ? 'text-amber-500' : 'text-cyan-500'}, 
        {icon: Shield, text: 'Secure Payments', color: theme === 'warm' ? 'text-red-500' : 'text-purple-500'}, 
        {icon: Cpu, text: 'Latest Tech', color: 'text-blue-500'}, 
        {icon: Wifi, text: 'Smart Connectivity', color: 'text-green-500'}
    ];
    const loaderContainerStyles = `bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 ${theme === 'warm' ? 'bg-orange-50 border-amber-300 dark:bg-stone-900 dark:border-amber-400/30' : 'dark:border-cyan-400/30'}`;
    const spinnerTextColor = theme === 'warm' ? 'text-stone-800 dark:text-white' : 'text-gray-800 dark:text-white';
    const spinnerBorderColor = theme === 'warm' ? 'border-amber-500 dark:border-amber-400' : 'border-cyan-500 dark:border-cyan-400';
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16 relative">
          <div className={`absolute -inset-2 bg-gradient-to-r ${theme === 'warm' ? 'from-amber-400/10 to-red-400/10' : 'from-cyan-400/10 to-purple-400/10'} blur-3xl`}></div>
          <div className="relative z-10">
            <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-6 animate-pulse ${heroGradient}`}>The Future of Tech</h1>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed ${theme === 'warm' ? 'text-stone-600' : 'text-gray-600'} dark:text-gray-300`}>Experience the future of shopping with our revolutionary products and immersive technology.</p>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-y-4 gap-x-8">
              {heroFeatures.map((item, i) => (
                <div key={i} className={`flex items-center space-x-2 ${theme === 'warm' ? 'text-stone-600 hover:text-stone-900' : 'text-gray-600 hover:text-gray-900'} dark:text-gray-400 dark:hover:text-white transition-colors duration-200`}><item.icon className={`h-6 w-6 ${item.color}`} /><span className="text-md font-medium">{item.text}</span></div>
              ))}
            </div>
          </div>
        </div>
        {isLoading && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"><div className={`${loaderContainerStyles} text-center`}><div className={`animate-spin rounded-full h-16 w-16 border-4 ${spinnerBorderColor} border-t-transparent mx-auto mb-4`}></div><p className={`${spinnerTextColor} font-medium`}>Loading products...</p></div></div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{currentProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
        <Pagination />
      </div>
    );
  };

  const ProductDetail = ({ product }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button onClick={() => setCurrentPage('home')} className={`flex items-center space-x-2 mb-8 px-4 py-2 rounded-xl border transition-all duration-200 shadow-sm ${theme === 'warm' ? 'bg-orange-50 text-amber-600 hover:text-amber-500 border-amber-200 hover:border-amber-400 dark:bg-stone-800 dark:text-amber-500 dark:hover:text-amber-400 dark:border-stone-700 dark:hover:border-amber-400' : 'bg-white text-cyan-600 hover:text-cyan-500 border-gray-200 hover:border-cyan-400 dark:bg-gray-800 dark:text-cyan-400 dark:hover:text-cyan-300 dark:border-gray-600 dark:hover:border-cyan-400'}`}><ArrowLeft className="h-5 w-5" /><span className="font-medium">Back to Products</span></button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative group"><div className={`absolute -inset-4 bg-gradient-to-r ${theme === 'warm' ? 'from-amber-400/20 to-red-400/20' : 'from-cyan-400/20 to-purple-400/20'} rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div><img src={product.image} alt={product.title} className={`relative w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-2xl border transition-all duration-500 ${theme === 'warm' ? 'border-amber-200 group-hover:border-amber-400 dark:border-stone-700 dark:group-hover:border-amber-400' : 'border-gray-200 group-hover:border-cyan-400 dark:border-gray-600 dark:group-hover:border-cyan-400'}`}/></div>
        <div className="space-y-6">
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'warm' ? 'text-stone-900' : 'text-gray-900'} dark:text-white`}>{product.title}</h1>
            <div className="flex items-center space-x-4 mb-6"><div className={`flex items-center rounded-full px-3 py-1 ${theme === 'warm' ? 'bg-amber-400/20' : 'bg-yellow-400/20 dark:bg-yellow-500/20'}`}><Star className="h-5 w-5 text-yellow-500 dark:text-yellow-400 fill-current" /><span className={`ml-1 text-lg font-medium ${theme === 'warm' ? 'text-stone-800' : 'text-gray-800'} dark:text-white`}>{product.rating}</span></div><span className="text-gray-400 dark:text-gray-500">•</span><span className={`${theme === 'warm' ? 'text-stone-600' : 'text-gray-600'} dark:text-gray-400`}>{product.reviews} reviews</span></div>
          </div>
          <div className={`rounded-2xl p-6 border ${theme === 'warm' ? 'bg-amber-100 border-amber-200 dark:bg-stone-800 dark:border-stone-700' : 'bg-gray-100 border-gray-200 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:border-gray-600'}`}><span className={`text-4xl font-bold ${theme === 'warm' ? 'text-amber-600 dark:text-amber-500' : 'text-cyan-600 dark:text-cyan-400'}`}>${product.price}</span><span className={`ml-2 ${theme === 'warm' ? 'text-stone-500' : 'text-gray-500'} dark:text-gray-400`}>USD</span></div>
          <p className={`text-lg leading-relaxed ${theme === 'warm' ? 'text-stone-600' : 'text-gray-600'} dark:text-gray-300`}>{product.description}</p>
          <div>
            <h3 className={`text-2xl font-bold mb-4 ${theme === 'warm' ? 'text-stone-900' : 'text-gray-900'} dark:text-white`}>Features:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{product.features.map((f, i) => <div key={i} className={`flex items-center space-x-3 p-3 rounded-xl border ${theme === 'warm' ? 'bg-amber-100 border-amber-200 dark:bg-stone-800 dark:border-stone-700' : 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-600'}`}><div className={`w-2 h-2 bg-gradient-to-r ${theme === 'warm' ? 'from-amber-400 to-red-400' : 'from-cyan-400 to-purple-400'} rounded-full`}></div><span className={`font-medium text-sm ${theme === 'warm' ? 'text-stone-700' : 'text-gray-700'} dark:text-gray-300`}>{f}</span></div>)}</div>
          </div>
          <button onClick={() => {addToCart(product); showAlert('Added to Cart!', `${product.title} has been added.`, 'success');}} className={`w-full bg-gradient-to-r ${theme === 'warm' ? 'from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 hover:shadow-amber-500/30 dark:hover:shadow-amber-400/25' : 'from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-500/30 dark:hover:shadow-cyan-400/25'} text-white py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg font-bold shadow-lg transform hover:scale-105`}><ShoppingCart className="h-6 w-6" /><span>Add to Cart</span></button>
        </div>
      </div>
    </div>
  );

  const CartSidebar = () => (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
      <div className={`absolute right-0 top-0 h-full w-full max-w-md shadow-2xl border-l transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col ${theme === 'warm' ? 'bg-orange-50 border-amber-200 dark:bg-stone-900 dark:border-stone-700' : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'}`}>
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'warm' ? 'border-amber-200 dark:border-stone-700' : 'border-gray-200 dark:border-gray-700'}`}><h2 className={`text-2xl font-bold ${theme === 'warm' ? 'text-stone-900' : 'text-gray-900'} dark:text-white`}>Shopping Cart</h2><button onClick={() => setIsCartOpen(false)} className={`p-2 rounded-full transition-colors duration-200 ${theme === 'warm' ? 'hover:bg-amber-100 dark:hover:bg-stone-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}><X className="h-6 w-6 text-gray-500 dark:text-gray-400" /></button></div>
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (<div className="text-center py-12 flex flex-col items-center h-full justify-center"><ShoppingCart className={`h-20 w-20 mx-auto mb-4 ${theme==='warm' ? 'text-stone-300 dark:text-stone-600':'text-gray-300 dark:text-gray-600'}`} /><p className={`${theme === 'warm' ? 'text-stone-600':'text-gray-600'} dark:text-gray-400 text-lg`}>Your cart is empty</p><p className={`${theme === 'warm' ? 'text-stone-500' : 'text-gray-500'} text-sm mt-2`}>Add some products to get started!</p></div>) : (<div className="space-y-4">{cart.map(item => (<div key={item.id} className={`flex items-center space-x-4 p-4 rounded-xl border ${theme === 'warm' ? 'bg-amber-100 border-amber-200 dark:bg-stone-800 dark:border-stone-700' : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'}`}><img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" /><div className="flex-1"><h4 className={`font-medium text-sm line-clamp-1 ${theme === 'warm' ? 'text-stone-800':'text-gray-800'} dark:text-white`}>{item.title}</h4><p className={`font-bold ${theme === 'warm' ? 'text-amber-600 dark:text-amber-500' : 'text-cyan-600 dark:text-cyan-400'}`}>${item.price}</p></div><div className="flex items-center space-x-2"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"><Minus className="h-4 w-4 text-gray-500 dark:text-gray-400" /></button><span className="w-8 text-center font-medium text-gray-800 dark:text-white">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"><Plus className="h-4 w-4 text-gray-500 dark:text-gray-400" /></button></div><button onClick={() => removeFromCart(item.id)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 dark:text-red-400 dark:hover:text-red-300 rounded-full transition-colors"><X className="h-4 w-4" /></button></div>))}</div>)}
        </div>
        {cart.length > 0 && (<div className={`p-6 border-t ${theme === 'warm' ? 'bg-amber-100/50 border-amber-200 dark:bg-stone-800/50 dark:border-stone-700' : 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700'}`}><div className="flex justify-between items-center mb-6"><span className={`text-lg font-semibold ${theme === 'warm' ? 'text-stone-800':'text-gray-800'} dark:text-white`}>Total:</span><span className={`text-3xl font-bold ${theme === 'warm' ? 'text-amber-600 dark:text-amber-500' : 'text-cyan-600 dark:text-cyan-400'}`}>${cartTotal.toFixed(2)}</span></div><button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-green-500/30 dark:hover:shadow-green-400/25 transform hover:scale-105">Proceed to Checkout</button></div>)}
      </div>
    </div>
  );

  const CheckoutModal = () => {
    const [formData, setFormData] = useState({ name: '', email: '', address: '' });
    const handleSubmit = (e) => { e.preventDefault(); if (formData.name && formData.email && formData.address) handleCheckout(formData); else showAlert('Missing Information', 'Please fill in all fields.', 'error'); };
    const focusRing = theme === 'warm' ? 'focus:ring-amber-500 dark:focus:ring-amber-400' : 'focus:ring-cyan-500 dark:focus:ring-cyan-400';
    const inputBaseClasses = `w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 placeholder-gray-500 dark:text-white`;
    const inputThemeClasses = theme === 'warm' 
        ? 'bg-amber-100 border-amber-200 text-stone-900 dark:bg-stone-800 dark:border-stone-600' 
        : 'bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600';
    
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isCheckoutOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCheckoutOpen(false)}></div>
        <div className={`relative w-full max-w-md border shadow-2xl rounded-2xl transform transition-all duration-300 ${isCheckoutOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} ${theme === 'warm' ? 'bg-orange-50 border-amber-200 dark:bg-stone-900 dark:border-stone-700' : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'}`}>
          <div className={`flex items-center justify-between p-6 border-b ${theme === 'warm' ? 'border-amber-200 dark:border-stone-700' : 'border-gray-200 dark:border-gray-700'}`}><h2 className={`text-2xl font-bold ${theme === 'warm' ? 'text-stone-900' : 'text-gray-900'} dark:text-white`}>Checkout</h2><button onClick={() => setIsCheckoutOpen(false)} className={`p-2 rounded-full ${theme === 'warm' ? 'hover:bg-amber-100 dark:hover:bg-stone-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}><X className="h-6 w-6 text-gray-500 dark:text-gray-400" /></button></div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4 mb-6">
              <div><label htmlFor="name" className={`block text-sm font-medium mb-2 ${theme === 'warm' ? 'text-stone-600':'text-gray-600'} dark:text-gray-300`}>Full Name</label><input id="name" type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`${inputBaseClasses} ${inputThemeClasses} ${focusRing}`} placeholder="Your Name"/></div>
              <div><label htmlFor="email" className={`block text-sm font-medium mb-2 ${theme === 'warm' ? 'text-stone-600':'text-gray-600'} dark:text-gray-300`}>Email Address</label><input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${inputBaseClasses} ${inputThemeClasses} ${focusRing}`} placeholder="your@email.com"/></div>
              <div><label htmlFor="address" className={`block text-sm font-medium mb-2 ${theme === 'warm' ? 'text-stone-600':'text-gray-600'} dark:text-gray-300`}>Shipping Address</label><textarea id="address" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className={`${inputBaseClasses} ${inputThemeClasses} ${focusRing} h-24 resize-none`} placeholder="123 Futura Lane, Tech City"></textarea></div>
            </div>
            <div className={`p-4 rounded-xl mb-6 border ${theme === 'warm' ? 'bg-amber-100 border-amber-200 dark:bg-gradient-to-r dark:from-stone-800 dark:to-stone-700 dark:border-stone-600' : 'bg-gray-100 border-gray-200 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 dark:border-gray-600'}`}><div className="flex justify-between items-center"><span className={`font-medium ${theme === 'warm' ? 'text-stone-800':'text-gray-800'} dark:text-white`}>Total:</span><span className={`text-2xl font-bold ${theme === 'warm' ? 'text-amber-600 dark:text-amber-500' : 'text-cyan-600 dark:text-cyan-400'}`}>${cartTotal.toFixed(2)}</span></div></div>
            <button type="submit" disabled={isLoading} className={`w-full bg-gradient-to-r ${theme === 'warm' ? 'from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 hover:shadow-amber-500/30' : 'from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-500/30'} text-white py-4 rounded-xl transition-all font-bold text-lg shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}>{isLoading ? <div className="flex items-center justify-center space-x-2"><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div><span>Processing...</span></div> : 'Place Order'}</button>
          </form>
        </div>
      </div>
    );
  };

  const Footer = () => {
    const titleGradient = theme === 'warm' ? 'from-amber-600 to-red-600 dark:from-amber-400 dark:to-red-400' : 'from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400';
    const linkHover = theme === 'warm' ? 'hover:text-amber-600 dark:hover:text-amber-400' : 'hover:text-cyan-500 dark:hover:text-cyan-400';
    return (
    <footer className={`${theme === 'warm' ? 'bg-amber-100 text-stone-600' : 'bg-gray-100 text-gray-600'} dark:bg-gray-900/70 dark:text-gray-400 border-t ${theme==='warm' ? 'border-amber-200' : 'border-gray-200'} dark:border-gray-800 mt-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <button onClick={() => { setCurrentPage('home'); scrollToTop(); }} className="flex-shrink-0 group focus:outline-none">
              <h2 className={`text-2xl font-bold bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}>Sam's TechStore</h2>
            </button>
            <p className="mt-4 text-sm">Innovating your world, one gadget at a time.</p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className={`${linkHover} transition-colors`}><span className="sr-only">Twitter</span><Twitter className="h-6 w-6" /></a>
              <a href="#" className={`${linkHover} transition-colors`}><span className="sr-only">Facebook</span><Facebook className="h-6 w-6" /></a>
              <a href="#" className={`${linkHover} transition-colors`}><span className="sr-only">Instagram</span><Instagram className="h-6 w-6" /></a>
              <a href="#" className={`${linkHover} transition-colors`}><span className="sr-only">LinkedIn</span><Linkedin className="h-6 w-6" /></a>
            </div>
          </div>
          <div className="col-span-1">
            <h3 className={`text-sm font-semibold tracking-wider uppercase ${theme==='warm' ? 'text-stone-800':'text-gray-800'} dark:text-gray-200`}>Shop</h3>
            <ul className="mt-4 space-y-2">{['Electronics', 'Wearables', 'Clothing', 'Accessories'].map(l => <li key={l}><a href="#" className={`${linkHover} transition-colors text-sm`}>{l}</a></li>)}</ul>
          </div>
          <div className="col-span-1">
            <h3 className={`text-sm font-semibold tracking-wider uppercase ${theme==='warm' ? 'text-stone-800':'text-gray-800'} dark:text-gray-200`}>Company</h3>
            <ul className="mt-4 space-y-2">{['About Us', 'Careers', 'Contact', 'Blog'].map(l => <li key={l}><a href="#" className={`${linkHover} transition-colors text-sm`}>{l}</a></li>)}</ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className={`text-sm font-semibold tracking-wider uppercase ${theme==='warm' ? 'text-stone-800':'text-gray-800'} dark:text-gray-200`}>Legal</h3>
            <ul className="mt-4 space-y-2">{['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(l => <li key={l}><a href="#" className={`${linkHover} transition-colors text-sm`}>{l}</a></li>)}</ul>
          </div>
        </div>
        <div className={`mt-12 pt-8 border-t ${theme === 'warm' ? 'border-amber-200' : 'border-gray-200'} dark:border-gray-800 text-center text-sm`}>
          <p>© {new Date().getFullYear()} Sam's TechStore. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
    )
  };

  const ThemeSwitcher = () => {
    const ThemeIcon = theme === 'dark' ? Moon : theme === 'warm' ? Sunrise : Sun;
    const accentHover = theme === 'warm' ? 'hover:border-amber-500 dark:hover:border-amber-400 group-hover:text-amber-500 dark:group-hover:text-amber-400' : 'hover:border-cyan-500 dark:hover:border-cyan-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400';
    
    const menuItemClasses = (buttonTheme) => {
        let base = "w-full text-left px-3 py-2 text-sm flex items-center space-x-2 rounded-md";
        if(theme === 'warm') {
            return `${base} text-stone-700 hover:bg-amber-100 ${buttonTheme === theme ? 'bg-amber-100' : ''}`;
        }
        return `${base} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${buttonTheme === theme && theme !== 'dark' ? 'bg-gray-100' : ''} ${buttonTheme === theme && theme === 'dark' ? 'bg-gray-700' : ''}`;
    }

    return(
      <div className="relative" ref={themeMenuRef}>
        <button onClick={() => setIsThemeMenuOpen(prev => !prev)} className={`relative p-3 rounded-full transition-all group border bg-gray-100/50 dark:bg-gray-800/50 ${accentHover} ${theme === 'warm' ? 'border-amber-200 bg-orange-100/50 dark:bg-stone-800/50' : 'border-gray-300 dark:border-gray-600'}`}>
          <ThemeIcon className={`h-6 w-6 transition-colors duration-200 ${theme === 'warm' ? 'text-amber-700' : 'text-gray-600'} dark:text-gray-300`} />
        </button>
        {isThemeMenuOpen && (
          <div className={`absolute top-full right-0 mt-2 w-36 rounded-lg shadow-lg border p-2 z-50 animate-fade-in ${theme === 'warm' ? 'bg-orange-50 border-amber-200 dark:bg-stone-800 dark:border-stone-700' : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'}`}>
            <button onClick={() => handleSetTheme('dark')} className={menuItemClasses('dark')}><Moon className="h-4 w-4" /><span>Dark</span></button>
            <button onClick={() => handleSetTheme('warm')} className={menuItemClasses('warm')}><Sunrise className="h-4 w-4" /><span>Warm</span></button>
          </div>
        )}
      </div>
    );
  }

  const titleGradient = theme === 'warm' ? 'from-amber-600 to-red-600 dark:from-amber-400 dark:to-red-400' : 'from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400';
  const titleHoverGradient = theme === 'warm' ? 'group-hover:from-red-500 group-hover:to-amber-500' : 'group-hover:from-purple-500 group-hover:to-cyan-500';

  return (
    <div className={`min-h-screen ${theme === 'warm' ? 'bg-orange-50 text-stone-800' : 'bg-gray-50 text-gray-800'} dark:bg-black dark:text-gray-200 transition-colors duration-300 flex flex-col`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)]"></div>
      </div>

      <header className={`sticky top-0 z-40 backdrop-blur-md shadow-sm dark:shadow-2xl border-b ${theme === 'warm' ? 'bg-orange-50/80 border-amber-200 dark:bg-stone-900/80 dark:border-stone-800' : 'bg-white/80 border-gray-200 dark:bg-gray-900/80 dark:border-gray-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => { setCurrentPage('home'); scrollToTop(); }} className="group focus:outline-none">
              <h1 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${titleGradient} ${titleHoverGradient}`}>
                Sam's TechStore
              </h1>
            </button>
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              <button onClick={() => setIsCartOpen(true)} className={`relative p-3 rounded-full transition-all group border bg-gray-100/50 dark:bg-gray-800/50 ${theme === 'warm' ? 'border-amber-200 bg-orange-100/50 hover:border-amber-500 dark:bg-stone-800/50 dark:hover:border-amber-400' : 'border-gray-300 dark:border-gray-600 hover:border-cyan-500 dark:hover:border-cyan-400'}`}>
                <ShoppingCart className={`h-6 w-6 transition-colors duration-200 ${theme === 'warm' ? 'text-amber-700 group-hover:text-amber-500 dark:group-hover:text-amber-400' : 'text-gray-600 group-hover:text-cyan-500 dark:text-gray-300 dark:group-hover:text-cyan-400'}`} />
                {cart.length > 0 && (
                  <span className={`absolute -top-2 -right-2 bg-gradient-to-r ${theme === 'warm' ? 'from-amber-500 to-red-600' : 'from-cyan-500 to-purple-600'} text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse`}>
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow">
        {currentPage === 'home' && <Homepage />}
        {currentPage === 'product' && selectedProduct && <ProductDetail product={selectedProduct} />}
      </main>

      <Footer />

      <button onClick={scrollToTop} className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 p-3 bg-gradient-to-r ${theme === 'warm' ? 'from-amber-500 to-red-600 hover:shadow-amber-500/40 dark:hover:shadow-amber-400/25' : 'from-cyan-500 to-purple-600 hover:shadow-cyan-500/40 dark:hover:shadow-cyan-400/25'} text-white rounded-full shadow-lg transition-all duration-300 transform z-40 ${showScrollTop ? 'scale-100' : 'scale-0'}`}>
        <ArrowUp className="h-6 w-6" />
      </button>

      <CartSidebar />
      <CheckoutModal />

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default App;