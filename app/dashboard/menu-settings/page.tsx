"use client";
import { useState, useEffect } from 'react';

interface MenuItem {
  _id: string;
  name: string;
  page: string;
  children?: MenuItem[];
}

interface Page {
  name: string;
  path: string;
}

interface ShopDepartment {
  name: string;
}

interface Category {
  name: string;
}

interface Brand {
  name: string;
}

const MenuSettingsPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', page: '' });
  const [newSubItem, setNewSubItem] = useState({ name: '', page: '' });
  const [pages, setPages] = useState<Page[]>([]);
  const [shopDepartments, setShopDepartments] = useState<ShopDepartment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  useEffect(() => {
    // Fetch existing menu items from the backend
    const fetchMenuItems = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menuitems`);
        const data = await res.json();
        if (data && data.data) {
          setMenuItems(data.data);
        }
      } catch (error: any) {
        console.error('Error fetching menu items:', error);
      }
    };

    // Fetch available pages
    const fetchPages = async () => {
      // In a real application, you would fetch this from your API
      const availablePages: Page[] = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/products' },
        { name: 'Blog', path: '/blogs' },
        { name: 'Contact', path: '/contact' },
      ];
      setPages(availablePages);
      setNewItem({ ...newItem, page: availablePages[0]?.path || '' });
    };

    const fetchShopDepartments = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/shopDepartments`);
        const data = await res.json();
        if (data) {
          setShopDepartments(data);
        }
      } catch (error: any) {
        console.error('Error fetching shop departments:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`);
        const data = await res.json();
        if (data) {
          setCategories(data);
        }
      } catch (error: any) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchBrands = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/brands`);
        const data = await res.json();
        if (data) {
          setBrands(data);
        }
      } catch (error: any) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchMenuItems();
    fetchPages();
    fetchShopDepartments();
    fetchCategories();
    fetchBrands();
  }, []);

  const handleAddItem = async () => {
    if (newItem.name && newItem.page) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menuitems`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });
        const data = await res.json();
        setMenuItems([...menuItems, data.data]);
        setNewItem({ name: '', page: pages[0]?.path || '' });
      } catch (error: any) {
        console.error('Error adding menu item:', error);
      }
    }
  };

  const handleAddSubItem = async (parentId: string, subItemData = newSubItem) => {
    if (subItemData.name && subItemData.page) {
      try {
        const parentItem = menuItems.find(item => item._id === parentId);
        if (!parentItem) return;
        const updatedChildren = [...(parentItem.children || []), subItemData];
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menuitems/${parentId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ children: updatedChildren }),
          }
        );
        const data = await res.json();
        setMenuItems(menuItems.map(item => item._id === parentId ? data.data : item));
        // Only reset newSubItem if it was used
        if (subItemData === newSubItem) {
          setNewSubItem({ name: '', page: pages[0]?.path || '' });
        }
      } catch (error: any) {
        console.error('Error adding submenu item:', error);
      }
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menuitems/${id}`,
        {
          method: 'DELETE',
        }
      );
      setMenuItems(menuItems.filter((item) => item._id !== id));
    } catch (error: any) {
      console.error('Error deleting menu item:', error);
    }
  };

  const handleDeleteSubItem = async (parentId: string, subItemId: string) => {
    try {
      const parentItem = menuItems.find(item => item._id === parentId);
      if (!parentItem) return;

      const updatedChildren = (parentItem.children || []).filter(child => child._id !== subItemId);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menuitems/${parentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ children: updatedChildren }),
      });

      const data = await res.json();
      setMenuItems(menuItems.map(item => item._id === parentId ? data.data : item));
    } catch (error: any) {
      console.error('Error deleting submenu item:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Menu Settings</h1>
      <div className="bg-custom-surface p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
        <div className="space-y-4">
          {menuItems.map((item) => (
            <div key={item._id} className="bg-custom-bg p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span>{item.name} - {item.page}</span>
                <button onClick={() => handleDeleteItem(item._id)} className="text-red-500 hover:text-red-700">Delete</button>
              </div>
              <div className="ml-4 mt-2 space-y-2">
                {item.children && item.children.map(child => (
                  <div key={child._id} className="flex items-center justify-between bg-custom-surface p-2 rounded-lg">
                    <span>{child.name} - {child.page}</span>
                    <button onClick={() => handleDeleteSubItem(item._id, child._id)} className="text-red-500 hover:text-red-700">Delete</button>
                  </div>
                ))}
                <div className="flex items-center space-x-2 pt-2">
                  <select
                    value={newSubItem.page}
                    onChange={(e) => setNewSubItem({ name: e.target.options[e.target.selectedIndex].text, page: e.target.value })}
                    className="p-2 border rounded-lg"
                  >
                    <option value="">Select a department</option>
                    {shopDepartments.map((dept, index) => (
                      <option key={typeof dept === 'object' ? dept.name : dept || index} value={`/shop/${typeof dept === 'object' ? dept.name : dept}`}>{typeof dept === 'object' ? dept.name : dept}</option>
                    ))}
                  </select>
                  <button onClick={() => handleAddSubItem(item._id)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Add Submenu</button>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border rounded-lg"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat, index) => (
                      <option key={typeof cat === 'object' ? cat.name : cat || index} value={typeof cat === 'object' ? cat.name : cat}>{typeof cat === 'object' ? cat.name : cat}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (selectedCategory) {
                        handleAddSubItem(item._id, { name: selectedCategory, page: `/shop/category/${selectedCategory}` });
                        setSelectedCategory('');
                      }
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Add Category Submenu
                  </button>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="p-2 border rounded-lg"
                  >
                    <option value="">Select a brand</option>
                    {brands.map((brand, index) => (
                      <option key={typeof brand === 'object' ? brand.name : brand || index} value={typeof brand === 'object' ? brand.name : brand}>{typeof brand === 'object' ? brand.name : brand}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (selectedBrand) {
                        handleAddSubItem(item._id, { name: selectedBrand, page: `/shop/brand/${selectedBrand}` });
                        setSelectedBrand('');
                      }
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Add Brand Submenu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter Menu Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="flex-grow p-2 border rounded-lg"
          />
          <select
            value={newItem.page}
            onChange={(e) => setNewItem({ ...newItem, page: e.target.value })}
            className="p-2 border rounded-lg"
          >
            {pages.map(page => (
              <option key={page.path} value={page.path}>{page.name}</option>
            ))}
          </select>
          <button onClick={handleAddItem} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Add New</button>
        </div>
      </div>
    </div>
  );
};

export default MenuSettingsPage;