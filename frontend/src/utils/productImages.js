// Product images from Unsplash (Free to use)
export const productImages = {
    // Electronics
    laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    mouse: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
    phone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
    tablet: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500',
    camera: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
    smartwatch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    speaker: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
  
    // Clothing
    tshirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    jeans: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    jacket: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
    shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
    sneakers: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500',
    hoodie: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
    dress: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
    shirt: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
    cap: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500',
    backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
  
    // Books
    book: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    novel: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
    textbook: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500',
    magazine: 'https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=500',
    notebook: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=500',
  
    // Food
    coffee: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500',
    snacks: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500',
    chocolate: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500',
    cookies: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500',
    chips: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500',
    juice: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500',
    water: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500',
  
    // Toys
    toy: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500',
    lego: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500',
    puzzle: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
    doll: 'https://images.unsplash.com/photo-1558411192-d0f22e1c7a91?w=500',
    ball: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=500',
    robot: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=500',
  
    // Other
    plant: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500',
    candle: 'https://images.unsplash.com/photo-1602874801006-bf0d98a34d81?w=500',
    watch: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500',
    sunglasses: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    bottle: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    umbrella: 'https://images.unsplash.com/photo-1534984665534-3d0e437821b9?w=500',
    bag: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500',
    wallet: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
    perfume: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
    
    // Default fallback
    default: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
  };
  
  // Get image by product name or category
  export const getProductImage = (productName, category) => {
    const name = productName.toLowerCase();
    
    // Try to match by product name keywords
    for (const [key, url] of Object.entries(productImages)) {
      if (name.includes(key)) {
        return url;
      }
    }
    
    // Match by category
    const categoryImages = {
      Electronics: productImages.laptop,
      Clothing: productImages.tshirt,
      Books: productImages.book,
      Food: productImages.coffee,
      Toys: productImages.toy,
      Other: productImages.default
    };
    
    return categoryImages[category] || productImages.default;
  };