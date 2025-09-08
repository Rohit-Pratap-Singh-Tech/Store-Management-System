import React, { useState, useEffect, useRef, useCallback } from 'react';

const SupermarketMap = () => {
  const canvasRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 50, y: 850 });
  const [selectedSection, setSelectedSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [generalSearchResults, setGeneralSearchResults] = useState([]);
  const [showGeneralResults, setShowGeneralResults] = useState(false);
  const [pathToSection, setPathToSection] = useState(null);

  const mapWidth = 1400;
  const mapHeight = 900;
  const userRadius = 15;
  const moveSpeed = 5;

  // Store layout with collision boxes and products
  const storeBlocks = [
    // Top row - Aisle 1-4
    { x: 100, y: 50, w: 280, h: 120, name: "Dairy & Eggs", icon: "🥛", id: 1, 
      products: ["Milk", "Cheese", "Yogurt", "Eggs", "Butter", "Cream"] },
    { x: 410, y: 50, w: 280, h: 120, name: "Bakery", icon: "🍞", id: 2,
      products: ["Bread", "Croissants", "Muffins", "Cake", "Pastries", "Bagels"] },
    { x: 720, y: 50, w: 280, h: 120, name: "Coffee & Tea", icon: "☕️", id: 3,
      products: ["Coffee", "Tea", "Espresso", "Latte", "Cappuccino", "Matcha"] },
    { x: 1030, y: 50, w: 280, h: 120, name: "Fresh Produce", icon: "🍎", id: 4,
      products: ["Apples", "Bananas", "Oranges", "Lettuce", "Tomatoes", "Carrots"] },

    // Middle row - Aisle 5-8
    { x: 100, y: 220, w: 280, h: 120, name: "Electronics", icon: "🔌", id: 5,
      products: ["Phone Chargers", "Headphones", "Speakers", "Batteries", "Cables"] },
    { x: 410, y: 220, w: 280, h: 120, name: "Pantry Staples", icon: "🥫", id: 6,
      products: ["Rice", "Pasta", "Canned Goods", "Spices", "Oil", "Vinegar"] },
    { x: 720, y: 220, w: 280, h: 120, name: "Frozen Foods", icon: "❄️", id: 7,
      products: ["Ice Cream", "Frozen Vegetables", "Frozen Pizza", "Fish", "Chicken"] },
    { x: 1030, y: 220, w: 280, h: 120, name: "Snacks", icon: "🍫", id: 8,
      products: ["Chips", "Chocolate", "Cookies", "Nuts", "Candy", "Crackers"] },

    // Bottom row - Aisle 9-12
    { x: 100, y: 390, w: 280, h: 120, name: "Beverages", icon: "🥤", id: 9,
      products: ["Water", "Soda", "Juice", "Energy Drinks", "Sports Drinks"] },
    { x: 410, y: 390, w: 280, h: 120, name: "Wine & Spirits", icon: "🍷", id: 10,
      products: ["Wine", "Beer", "Whiskey", "Vodka", "Rum", "Champagne"] },
    { x: 720, y: 390, w: 280, h: 120, name: "Health & Wellness", icon: "🌿", id: 11,
      products: ["Vitamins", "Supplements", "Medicine", "First Aid", "Protein Powder"] },
    { x: 1030, y: 390, w: 280, h: 120, name: "Household", icon: "🧹", id: 12,
      products: ["Detergent", "Paper Towels", "Toilet Paper", "Cleaning Supplies"] },

    // Additional sections
    { x: 100, y: 560, w: 280, h: 120, name: "Butcher & Deli", icon: "🔪", id: 13,
      products: ["Fresh Meat", "Deli Meat", "Sausages", "Bacon", "Ham"] },
    { x: 410, y: 560, w: 280, h: 120, name: "Fresh Flowers", icon: "🌸", id: 14,
      products: ["Roses", "Tulips", "Bouquets", "Plants", "Flower Arrangements"] },
    { x: 720, y: 560, w: 280, h: 120, name: "Sushi & Bistro", icon: "🍣", id: 15,
      products: ["Sushi", "Prepared Meals", "Salads", "Sandwiches", "Hot Food"] },
    { x: 1030, y: 560, w: 280, h: 120, name: "Checkout", icon: "💳", id: 16,
      products: ["Cashier", "Self Checkout", "Customer Service", "Returns"] },
  ];

  // General terms and product mapping to store sections
  const generalTermsMap = {
    // Electronics Section (ID: 5)
    'fan': [5], 'fans': [5], 'electric fan': [5], 'ceiling fan': [5],
    'phone': [5], 'mobile': [5], 'smartphone': [5], 'iphone': [5], 'samsung': [5],
    'charger': [5], 'chargers': [5], 'phone charger': [5], 'cable': [5], 'cables': [5],
    'headphones': [5], 'earphones': [5], 'bluetooth': [5], 'speaker': [5], 'speakers': [5],
    'battery': [5], 'batteries': [5], 'power bank': [5],
    'electronics': [5], 'tech': [5], 'technology': [5], 'gadgets': [5],

    // Food Categories
    'food': [1, 2, 4, 6, 7, 13, 15], // Dairy, Bakery, Produce, Pantry, Frozen, Butcher, Sushi
    'groceries': [1, 2, 4, 6, 7, 13],
    
    // Dairy & Eggs (ID: 1)
    'milk': [1], 'cheese': [1], 'yogurt': [1], 'eggs': [1], 'butter': [1], 'cream': [1],
    'dairy': [1],

    // Bakery (ID: 2)
    'bread': [2], 'cake': [2], 'pastry': [2], 'pastries': [2], 'croissant': [2], 'muffin': [2],
    'bagel': [2], 'bakery': [2],

    // Fresh Produce (ID: 4)
    'apple': [4], 'apples': [4], 'banana': [4], 'bananas': [4], 'orange': [4], 'oranges': [4],
    'tomato': [4], 'tomatoes': [4], 'lettuce': [4], 'carrot': [4], 'carrots': [4],
    'fruits': [4], 'vegetables': [4], 'produce': [4], 'fresh': [1, 4, 13, 14],

    // Beverages
    'drinks': [3, 9, 10], 'beverages': [3, 9, 10],
    'coffee': [3], 'tea': [3], 'espresso': [3], 'latte': [3], 'cappuccino': [3],
    'water': [9], 'soda': [9], 'juice': [9], 'energy drink': [9],
    'alcohol': [10], 'wine': [10], 'beer': [10], 'whiskey': [10], 'vodka': [10],

    // Pantry Staples (ID: 6)
    'rice': [6], 'pasta': [6], 'oil': [6], 'vinegar': [6], 'spices': [6],
    'canned goods': [6], 'pantry': [6],

    // Frozen Foods (ID: 7)
    'ice cream': [7], 'frozen': [7], 'frozen pizza': [7], 'frozen vegetables': [7],

    // Snacks (ID: 8)
    'chips': [8], 'chocolate': [8], 'cookies': [8], 'candy': [8], 'nuts': [8],
    'snacks': [8], 'sweets': [8],

    // Health & Wellness (ID: 11)
    'vitamins': [11], 'medicine': [11], 'supplements': [11], 'health': [11],
    'wellness': [11], 'protein': [11], 'first aid': [11],

    // Household (ID: 12)
    'detergent': [12], 'cleaning': [12], 'paper towels': [12], 'toilet paper': [12],
    'household': [12], 'cleaning supplies': [12],

    // Butcher & Deli (ID: 13)
    'meat': [13], 'beef': [13], 'chicken': [13], 'pork': [13], 'ham': [13],
    'bacon': [13], 'sausage': [13], 'deli': [13], 'butcher': [13],

    // Fresh Flowers (ID: 14)
    'flowers': [14], 'roses': [14], 'tulips': [14], 'plants': [14], 'bouquet': [14],

    // Sushi & Bistro (ID: 15)
    'sushi': [15], 'prepared meals': [15], 'hot food': [15], 'salad': [15],
    'sandwich': [15], 'bistro': [15],

    // Checkout (ID: 16)
    'checkout': [16], 'payment': [16], 'cashier': [16], 'pay': [16],
  };

  // Collision detection function
  const checkCollision = (newX, newY) => {
    const userLeft = newX - userRadius;
    const userRight = newX + userRadius;
    const userTop = newY - userRadius;
    const userBottom = newY + userRadius;

    // Check boundaries
    if (newX - userRadius < 0 || newX + userRadius > mapWidth || 
        newY - userRadius < 0 || newY + userRadius > mapHeight) {
      return true;
    }

    // Check collision with store blocks
    for (const block of storeBlocks) {
      if (userRight > block.x && userLeft < block.x + block.w && 
          userBottom > block.y && userTop < block.y + block.h) {
        return true;
      }
    }

    return false;
  };

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      setGeneralSearchResults([]);
      setShowGeneralResults(false);
      return;
    }

    const results = [];
    const queryLower = query.toLowerCase().trim();
    
    // First check if it's a general term/product that maps to specific sections
    const mappedSectionIds = generalTermsMap[queryLower];
    if (mappedSectionIds) {
      const mappedSections = mappedSectionIds.map(id => 
        storeBlocks.find(block => block.id === id)
      ).filter(Boolean);
      
      mappedSections.forEach(block => {
        results.push({
          type: 'mapped_section',
          name: block.name,
          icon: block.icon,
          section: block,
          match: `"${query}" found here`,
          priority: true // Higher priority for direct mappings
        });
      });
    }

    // Then search in section names
    storeBlocks.forEach(block => {
      if (block.name.toLowerCase().includes(queryLower) && 
          !results.some(r => r.section.id === block.id)) {
        results.push({
          type: 'section',
          name: block.name,
          icon: block.icon,
          section: block,
          match: 'Section Name'
        });
      }
      
      // Search in products
      if (block.products) {
        block.products.forEach(product => {
          if (product.toLowerCase().includes(queryLower) &&
              !results.some(r => r.section.id === block.id)) {
            results.push({
              type: 'product',
              name: product,
              icon: block.icon,
              section: block,
              match: `Found in ${block.name}`
            });
          }
        });
      }
    });

    // Sort results with priority items first
    results.sort((a, b) => {
      if (a.priority && !b.priority) return -1;
      if (!a.priority && b.priority) return 1;
      return 0;
    });

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  // Navigate to search result
  const navigateToResult = (result) => {
    const section = result.section;
    setSelectedSection(section.id);
    
    // Move user near the section (but not inside it to avoid collision)
    const newX = section.x + section.w / 2;
    const newY = section.y + section.h + 50; // Position below the section
    
    if (!checkCollision(newX, newY)) {
      setCurrentPosition({ x: newX, y: newY });
    }
    
    setShowSearchResults(false);
    setSearchQuery('');
  };

  // Handle Enter key press to show path to first search result
  const handleEnterPress = () => {
    if (searchResults.length > 0) {
      const firstResult = searchResults[0];
      const section = firstResult.section;
      
      // Create path from current position to section center
      const sectionCenterX = section.x + section.w / 2;
      const sectionCenterY = section.y + section.h / 2;
      
      setPathToSection({
        from: { x: currentPosition.x, y: currentPosition.y },
        to: { x: sectionCenterX, y: sectionCenterY },
        section: section,
        searchTerm: searchQuery
      });
      
      setSelectedSection(section.id);
      setShowSearchResults(false);
    }
  };

  // Handle search input key press
  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleEnterPress();
    }
  };

  // Handle keyboard navigation
  const handleKeyPress = useCallback((event) => {
    // Don't handle navigation keys if search input is focused
    if (isSearchFocused) {
      return;
    }

    let newX = currentPosition.x;
    let newY = currentPosition.y;

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        newY -= moveSpeed;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        newY += moveSpeed;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        newX -= moveSpeed;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        newX += moveSpeed;
        break;
      default:
        return;
    }

    // Only move if no collision
    if (!checkCollision(newX, newY)) {
      setCurrentPosition({ x: newX, y: newY });
    }

    event.preventDefault();
  }, [currentPosition, isSearchFocused]);

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Canvas drawing function
  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, mapWidth, mapHeight);

    // Draw store background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, mapWidth, mapHeight);

    // Draw grid lines for navigation help
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x <= mapWidth; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, mapHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= mapHeight; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(mapWidth, y);
      ctx.stroke();
    }

    // Draw store blocks with elegant styling
    storeBlocks.forEach((block) => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(block.x, block.y, block.x, block.y + block.h);
      if (selectedSection === block.id) {
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#1d4ed8');
      } else {
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(1, '#4338ca');
      }

      // Draw shadow first
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(block.x + 4, block.y + 4, block.w, block.h);

      // Block background with gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(block.x, block.y, block.w, block.h);

      // Elegant border with rounded effect simulation
      ctx.strokeStyle = selectedSection === block.id ? '#1e40af' : '#312e81';
      ctx.lineWidth = 3;
      ctx.strokeRect(block.x, block.y, block.w, block.h);

      // Inner highlight for 3D effect
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(block.x + 2, block.y + 2, block.w - 4, block.h - 4);

      // Large icon with shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(block.icon, block.x + block.w/2 + 2, block.y + 42);

      // Main icon
      ctx.fillStyle = 'white';
      ctx.font = 'bold 32px Arial';
      ctx.fillText(block.icon, block.x + block.w/2, block.y + 40);

      // Section name with shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(block.name, block.x + block.w/2 + 1, block.y + 72);

      // Main section name
      ctx.fillStyle = 'white';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(block.name, block.x + block.w/2, block.y + 70);

      // Subtitle with product count
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '14px Arial';
      ctx.fillText(`${block.products.length} items`, block.x + block.w/2, block.y + 90);

      // Corner decoration for selected section
      if (selectedSection === block.id) {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(block.x + block.w - 20, block.y);
        ctx.lineTo(block.x + block.w, block.y);
        ctx.lineTo(block.x + block.w, block.y + 20);
        ctx.closePath();
        ctx.fill();

        // Star in corner
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('★', block.x + block.w - 10, block.y + 12);
      }
    });

    // Draw elegant entrance
    const entranceGradient = ctx.createLinearGradient(0, mapHeight - 100, 0, mapHeight);
    entranceGradient.addColorStop(0, '#10b981');
    entranceGradient.addColorStop(1, '#059669');

    // Entrance shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(4, mapHeight - 96, 100, 100);

    // Entrance background
    ctx.fillStyle = entranceGradient;
    ctx.fillRect(0, mapHeight - 100, 100, 100);

    // Entrance border
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, mapHeight - 100, 100, 100);

    // Inner highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(2, mapHeight - 98, 96, 96);

    // Large entrance icon with shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🚪', 52, mapHeight - 62);

    // Main entrance icon
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('🚪', 50, mapHeight - 60);

    // Entrance text with shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('ENTRANCE', 51, mapHeight - 32);

    // Main entrance text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('ENTRANCE', 50, mapHeight - 30);

    // Draw dotted path line if search result is selected
    if (pathToSection) {
      ctx.save();
      
      // Set up dotted line style
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 10]); // Create dotted pattern
      
      // Draw the main path line
      ctx.beginPath();
      ctx.moveTo(pathToSection.from.x, pathToSection.from.y);
      ctx.lineTo(pathToSection.to.x, pathToSection.to.y);
      ctx.stroke();
      
      // Draw arrowhead at destination
      const angle = Math.atan2(
        pathToSection.to.y - pathToSection.from.y,
        pathToSection.to.x - pathToSection.from.x
      );
      
      const arrowLength = 20;
      const arrowAngle = Math.PI / 6;
      
      ctx.setLineDash([]); // Solid line for arrow
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#1d4ed8';
      
      // Arrow tip
      ctx.beginPath();
      ctx.moveTo(pathToSection.to.x, pathToSection.to.y);
      ctx.lineTo(
        pathToSection.to.x - arrowLength * Math.cos(angle - arrowAngle),
        pathToSection.to.y - arrowLength * Math.sin(angle - arrowAngle)
      );
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(pathToSection.to.x, pathToSection.to.y);
      ctx.lineTo(
        pathToSection.to.x - arrowLength * Math.cos(angle + arrowAngle),
        pathToSection.to.y - arrowLength * Math.sin(angle + arrowAngle)
      );
      ctx.stroke();
      
      // Draw information box near the destination
      const infoText = `"${pathToSection.searchTerm}" → ${pathToSection.section.name} (Box #${pathToSection.section.id})`;
      ctx.font = 'bold 14px Arial';
      const textWidth = ctx.measureText(infoText).width;
      
      // Info box background
      const boxPadding = 8;
      const boxX = pathToSection.to.x - textWidth / 2 - boxPadding;
      const boxY = pathToSection.to.y - 60;
      const boxWidth = textWidth + boxPadding * 2;
      const boxHeight = 30;
      
      ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
      
      // Info box border
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
      
      // Info text
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(infoText, pathToSection.to.x, boxY + 20);
      
      ctx.restore();
    }

    // Draw elegant user position
    // User shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(currentPosition.x + 2, currentPosition.y + 2, userRadius, 0, 2 * Math.PI);
    ctx.fill();

    // User position with gradient
    const userGradient = ctx.createRadialGradient(
      currentPosition.x, currentPosition.y, 0,
      currentPosition.x, currentPosition.y, userRadius
    );
    userGradient.addColorStop(0, '#ef4444');
    userGradient.addColorStop(1, '#dc2626');

    ctx.fillStyle = userGradient;
    ctx.beginPath();
    ctx.arc(currentPosition.x, currentPosition.y, userRadius, 0, 2 * Math.PI);
    ctx.fill();

    // User border
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // User direction indicator with shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('👤', currentPosition.x + 1, currentPosition.y + 5);

    // Main user indicator
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('👤', currentPosition.x, currentPosition.y + 4);

    // Draw elegant position info with background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(10, 10, 320, 80);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 320, 80);

    // Position coordinates with elegant styling
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`📍 Position: (${Math.round(currentPosition.x)}, ${Math.round(currentPosition.y)})`, 20, 30);
    ctx.font = '12px Arial';
    ctx.fillStyle = '#6b7280';
    
    if (isSearchFocused) {
      ctx.fillText('⌨️ Type to search - Navigation disabled', 20, 50);
      ctx.fillText('🔍 Click outside search to enable navigation', 20, 70);
    } else {
      ctx.fillText('🎮 Use Arrow Keys or WASD to navigate', 20, 50);
      ctx.fillText('🖱️ Click sections to highlight them', 20, 70);
    }
  }, [currentPosition, selectedSection, isSearchFocused, pathToSection]);

  // Handle canvas clicks
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is on a store block
    const clickedBlock = storeBlocks.find(block => 
      x >= block.x && x <= block.x + block.w && 
      y >= block.y && y <= block.y + block.h
    );

    if (clickedBlock) {
      setSelectedSection(selectedSection === clickedBlock.id ? null : clickedBlock.id);
    }
  };

  // Redraw canvas when position or selection changes
  useEffect(() => {
    drawMap();
  }, [drawMap]);

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🗺️ Interactive Store Navigation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate through our store layout using arrow keys or WASD. The red circle represents your position, 
            and you cannot pass through store sections.
          </p>
        </div>

        {/* Navigation Canvas */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🎮 Store Floor Plan</h3>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="🔍 Search for products or sections... (e.g., 'fan', 'milk', 'electronics') - Press Enter to show path"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full px-4 py-3 pl-12 pr-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => {
                      handleSearch('');
                      setPathToSection(null);
                    }}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Clear
                  </button>
                )}
                {pathToSection && (
                  <button
                    onClick={() => setPathToSection(null)}
                    className="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors"
                  >
                    Clear Path
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div className="p-3 border-b border-gray-100 bg-blue-50">
                    <h4 className="font-semibold text-blue-900">Search Results ({searchResults.length})</h4>
                  </div>
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => navigateToResult(result)}
                      className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{result.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{result.name}</div>
                          <div className="text-sm text-gray-600">{result.match}</div>
                          {result.type === 'product' && (
                            <div className="text-xs text-blue-600 mt-1">
                              Click to navigate to {result.section.name} →
                            </div>
                          )}
                        </div>
                        <div className="text-blue-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={mapWidth}
              height={mapHeight}
              onClick={handleCanvasClick}
              className="cursor-crosshair"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>

          <div className="mt-6 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <strong>Navigation:</strong><br />
                Arrow Keys or WASD
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <strong>Selection:</strong><br />
                Click on sections
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <strong>Collision:</strong><br />
                Cannot pass through blocks
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <strong>Boundaries:</strong><br />
                Stay within store limits
              </div>
            </div>
          </div>
        </div>

        {/* Selected Section Info */}
        {selectedSection && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 mb-12">
            <div className="text-center">
              {(() => {
                const block = storeBlocks.find(b => b.id === selectedSection);
                return block ? (
                  <>
                    <div className="text-6xl mb-4">{block.icon}</div>
                    <h3 className="text-3xl font-bold mb-4">{block.name}</h3>
                    <p className="text-xl opacity-90">Section {block.id} - Interactive store management</p>
                    <button 
                      onClick={() => setSelectedSection(null)}
                      className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Close Section Info
                    </button>
                  </>
                ) : null;
              })()}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SupermarketMap;
