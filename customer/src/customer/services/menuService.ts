export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  variants?: { name: string; price: number }[];
  addOns?: { name: string; price: number }[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  spicyLevel?: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

// Mock data for development
const mockMenu: MenuCategory[] = [
  {
    id: 'starters',
    name: 'Starters',
    description: 'Delicious appetizers to begin your meal',
    items: [
      {
        id: 'spring-rolls',
        name: 'Spring Rolls',
        description: 'Crispy vegetable spring rolls served with sweet chili sauce',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
        category: 'starters',
        inStock: true,
        isVegetarian: true,
        addOns: [
          { name: 'Extra Sauce', price: 1.0 },
          { name: 'Side Salad', price: 2.5 },
        ],
      },
      {
        id: 'chicken-wings',
        name: 'Chicken Wings',
        description: 'Spicy buffalo wings with blue cheese dip',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop',
        category: 'starters',
        inStock: true,
        spicyLevel: 3,
        variants: [
          { name: '6 pieces', price: 12.99 },
          { name: '12 pieces', price: 22.99 },
        ],
      },
    ],
  },
  {
    id: 'mains',
    name: 'Main Course',
    description: 'Hearty main dishes',
    items: [
      {
        id: 'margherita-pizza',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
        category: 'mains',
        inStock: true,
        isVegetarian: true,
        variants: [
          { name: 'Small (10")', price: 14.99 },
          { name: 'Medium (12")', price: 18.99 },
          { name: 'Large (14")', price: 22.99 },
        ],
        addOns: [
          { name: 'Extra Cheese', price: 2.0 },
          { name: 'Mushrooms', price: 1.5 },
          { name: 'Olives', price: 1.5 },
        ],
      },
      {
        id: 'grilled-salmon',
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
        category: 'mains',
        inStock: true,
      },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet treats to end your meal',
    items: [
      {
        id: 'chocolate-lava-cake',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop',
        category: 'desserts',
        inStock: true,
        isVegetarian: true,
        addOns: [
          { name: 'Extra Ice Cream', price: 2.0 },
          { name: 'Whipped Cream', price: 1.0 },
        ],
      },
      {
        id: 'tiramisu',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
        category: 'desserts',
        inStock: true,
        isVegetarian: true,
      },
    ],
  },
  {
    id: 'beverages',
    name: 'Beverages',
    description: 'Refreshing drinks',
    items: [
      {
        id: 'mango-lassi',
        name: 'Mango Lassi',
        description: 'Creamy yogurt drink blended with fresh mango',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop',
        category: 'beverages',
        inStock: true,
        isVegetarian: true,
      },
      {
        id: 'iced-coffee',
        name: 'Iced Coffee',
        description: 'Freshly brewed coffee served over ice',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop',
        category: 'beverages',
        inStock: true,
        isVegan: true,
      },
    ],
  },
];

class MenuService {
  async getMenu(): Promise<MenuCategory[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMenu);
      }, 500);
    });
  }

  async getMenuByCategory(categoryId: string): Promise<MenuCategory | null> {
    const menu = await this.getMenu();
    return menu.find((cat) => cat.id === categoryId) || null;
  }

  async getItemById(itemId: string): Promise<MenuItem | null> {
    const menu = await this.getMenu();
    for (const category of menu) {
      const item = category.items.find((i) => i.id === itemId);
      if (item) return item;
    }
    return null;
  }
}

export const menuService = new MenuService();
