import axios from "axios";

export interface MenuItem {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  available?: boolean;
  inventoryCount?: number;
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

class MenuService {
  private apiUrl = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/menu`
    : "/api/menu";

  async getMenu(): Promise<MenuCategory[]> {
    try {
      const response = await axios.get(this.apiUrl);
      const menuItems: MenuItem[] = response.data;

      // Group items by category
      const categoriesMap = new Map<string, MenuItem[]>();

      menuItems.forEach((item) => {
        const category = item.category || "Other";
        if (!categoriesMap.has(category)) {
          categoriesMap.set(category, []);
        }

        // Map backend data to frontend format
        const mappedItem: MenuItem = {
          id: item._id || item.id,
          _id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          image:
            item.image ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
          category: item.category,
          inStock: item.available !== false && (item.inventoryCount || 0) > 0,
          available: item.available,
          inventoryCount: item.inventoryCount,
        };

        categoriesMap.get(category)!.push(mappedItem);
      });

      // Convert map to array of categories
      const categories: MenuCategory[] = Array.from(
        categoriesMap.entries()
      ).map(([categoryName, items]) => ({
        id: categoryName.toLowerCase().replace(/\s+/g, "-"),
        name: categoryName,
        description: `Delicious ${categoryName.toLowerCase()}`,
        items,
      }));

      return categories;
    } catch (error) {
      console.error("Error fetching menu:", error);
      // Return empty array on error
      return [];
    }
  }

  async getMenuByCategory(categoryId: string): Promise<MenuCategory | null> {
    const menu = await this.getMenu();
    return menu.find((cat) => cat.id === categoryId) || null;
  }

  async getItemById(itemId: string): Promise<MenuItem | null> {
    try {
      const menu = await this.getMenu();
      for (const category of menu) {
        const item = category.items.find(
          (i) => i.id === itemId || i._id === itemId
        );
        if (item) return item;
      }
      return null;
    } catch (error) {
      console.error("Error fetching item:", error);
      return null;
    }
  }
}

export const menuService = new MenuService();
