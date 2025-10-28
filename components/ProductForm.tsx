"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Editor from './Editor'; // Import the new Editor component
import { ProductFormData } from '@/lib/interfaces';

interface ProductFormProps {
  onSubmit: (formData: ProductFormData) => Promise<boolean>;
  initialData?: Partial<ProductFormData>;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialData }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showNewBrandInput, setShowNewBrandInput] = useState(false);
  const [shopDepartments, setShopDepartments] = useState<string[]>([]);
  const [showNewShopDepartmentInput, setShowNewShopDepartmentInput] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(initialData?.gallery || []);
  const [description, setDescription] = useState(initialData?.description || '');
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [buttons, setButtons] = useState(initialData?.buttons || []);

  const handleAddButton = () => {
    setButtons([...buttons, { text: '', url: '', regularPrice: undefined, salePrice: undefined }]);
  };

  const handleRemoveButton = (index: number) => {
    const newButtons = [...buttons];
    newButtons.splice(index, 1);
    setButtons(newButtons);
  };

  const handleButtonChange = (index: number, field: string, value: string) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setButtons(newButtons);
  };

  const fetchData = async () => {
    try {
      const [categoriesRes, brandsRes, shopDepartmentsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/brands`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/shopDepartments`),
      ]);

      if (!categoriesRes.ok || !brandsRes.ok || !shopDepartmentsRes.ok) {
        throw new Error('Failed to fetch categories, brands or shop departments');
      }

      const categoriesData = await categoriesRes.json();
      const brandsData = await brandsRes.json();
      const shopDepartmentsData = await shopDepartmentsRes.json();

      console.log('Categories data:', categoriesData);

      setCategories(categoriesData.map((cat: any) => cat.name));
      setBrands(brandsData);
      setShopDepartments(shopDepartmentsData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Append new files to the existing list for upload
    setGalleryFiles(prevFiles => [...prevFiles, ...files]);

    // Generate previews for the new files and append them to the existing previews
    const newPreviews: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        // When all new files are read, update the state
        if (newPreviews.length === files.length) {
          setGalleryPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = initialData?.image || '';
    let finalGalleryUrls = initialData?.gallery || []; // Start with existing gallery URLs

    // Upload main product image
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload main image');
        }

        const data = await response.json();
        // Ensure data.urls is an array before accessing [0]
        imageUrl = (data.urls && data.urls.length > 0) ? data.urls[0] : '';
      } catch (error: any) {
        console.error('Error uploading main image:', error);
        alert('Failed to upload main image. Please try again.');
        return;
      }
    }

    // Upload new gallery images
    if (galleryFiles.length > 0) {
      const formData = new FormData();
      galleryFiles.forEach((file) => {
        formData.append(`galleryFiles`, file, file.name);
      });

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload gallery images');
        }

        const data = await response.json();
        const newGalleryUrls = data.urls || [];
        finalGalleryUrls = [...finalGalleryUrls, ...newGalleryUrls]; // Combine old and new URLs
      } catch (error: any) {
        console.error('Error uploading gallery images:', error);
        alert('Failed to upload gallery images. Please try again.');
        return;
      }
    }

    const form = formRef.current;
    if (form) {
      const formData = new FormData(form);
      const newCategoryName = formData.get('newCategory') as string;

      // If a new category is being added, save it first
      if (showNewCategoryInput && newCategoryName) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCategoryName, imageUrl: null }),
          });
        } catch (error) {
          console.error('Failed to save new category:', error);
          // Optionally, alert the user
        }
      }

      const productData = {
        title: formData.get('title') as string,
        category: showNewCategoryInput ? newCategoryName : formData.get('category') as string,
        brand: showNewBrandInput ? formData.get('newBrand') as string : formData.get('brand') as string,
        shopDepartment: showNewShopDepartmentInput ? formData.get('newShopDepartment') as string : formData.get('shopDepartment') as string,
        price: formData.get('price') as string,
        stock: formData.get('stock') as string,
        description: description,
        shortDescription: shortDescription,
        metaKeywords: formData.get('metaKeywords') as string,
        metaDescription: formData.get('metaDescription') as string,
        image: imageUrl,
        gallery: finalGalleryUrls, // Use the finalGalleryUrls
        url: formData.get('url') as string,
        buttons: buttons.map(button => ({
          text: button.text,
          url: button.url,
                  regularPrice: button.regularPrice,
                  salePrice: button.salePrice,        })),
      };

      const success = await onSubmit(productData);
      if (success) {
        fetchData(); // Re-fetch after successful submission
      }
    }
  };

  return (
    <div className="bg-custom-surface rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" name="title" placeholder="title" defaultValue={initialData?.title} className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm" />
          
          {/* Category Selection */}
          <div>
            <>
              <p className="text-white">Found {categories.length} categories.</p>
              {!showNewCategoryInput ? (
                <select 
                  name="category" 
                  defaultValue={initialData?.category} 
                  className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm text-custom-text-secondary"
                  onChange={(e) => {
                    if (e.target.value === '__addNew__') {
                      setShowNewCategoryInput(true);
                    }
                  }}
                >
                  <option value="">Choose a Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__addNew__">+ Add New Category</option>
                </select>
              ) : (
                <input 
                  type="text" 
                  name="newCategory" 
                  placeholder="Enter new category name" 
                  className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setShowNewCategoryInput(false); // Revert if empty
                    }
                  }}
                />
              )}
            </>
          </div>

          {/* Brand Selection */}
          {!showNewBrandInput ? (
            <select 
              name="brand" 
              defaultValue={initialData?.brand} 
              className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm text-custom-text-secondary"
              onChange={(e) => {
                if (e.target.value === '__addNew__') {
                  setShowNewBrandInput(true);
                }
              }}
            >
              <option value="">Choose a Brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
              <option value="__addNew__">+ Add New Brand</option>
            </select>
          ) : (
            <input 
              type="text" 
              name="newBrand" 
              placeholder="Enter new brand name" 
              className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
              onBlur={(e) => {
                if (!e.target.value) {
                  setShowNewBrandInput(false); // Revert if empty
                }
              }}
            />
          )}

          {/* Shop Department Selection */}
          {!showNewShopDepartmentInput ? (
            <select 
              name="shopDepartment" 
              defaultValue={initialData?.shopDepartment} 
              className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm text-custom-text-secondary"
              onChange={(e) => {
                if (e.target.value === '__addNew__') {
                  setShowNewShopDepartmentInput(true);
                }
              }}
            >
              <option value="">Choose a Shop Department</option>
              {shopDepartments.map((dep) => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
              <option value="__addNew__">+ Add New Shop Department</option>
            </select>
          ) : (
            <input 
              type="text" 
              name="newShopDepartment" 
              placeholder="Enter new shop department name" 
              className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
              onBlur={(e) => {
                if (!e.target.value) {
                  setShowNewShopDepartmentInput(false); // Revert if empty
                }
              }}
            />
          )}

          <input type="text" name="price" placeholder="price" defaultValue={initialData?.price} className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm" />
          <input type="number" name="stock" placeholder="stock" defaultValue={initialData?.stock} className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm" />
          
          <input type="text" name="url" placeholder="URL" defaultValue={initialData?.url} className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm" />
          <div className="md:col-span-2">
            <label htmlFor="product-image" className="block text-sm font-medium text-custom-text-secondary mb-2">Product Image</label>
            <input type="file" id="product-image" name="productImage" onChange={handleImageChange} className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm text-custom-text-secondary" />
            {imagePreview && (
              <div className="mt-4">
                <Image src={imagePreview} alt="Product image preview" width={200} height={200} className="rounded-lg" />
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="gallery-images" className="block text-sm font-medium text-custom-text-secondary mb-2">Gallery Images</label>
            <input type="file" id="gallery-images" name="galleryImages" multiple onChange={handleGalleryChange} className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm text-custom-text-secondary" />
            <div className="mt-4 flex flex-wrap gap-2">
              {galleryPreviews.map((src, index) => (
                <Image key={index} src={src} alt={`Gallery image preview ${index + 1}`} width={100} height={100} className="rounded-lg object-cover" />
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-custom-text-secondary mb-2">Description</label>
            <Editor content={description} onChange={setDescription} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-custom-text-secondary mb-2">Short Description</label>
            <Editor content={shortDescription} onChange={setShortDescription} />
          </div>
          <textarea name="metaKeywords" placeholder="Meta Keywords" rows={3} defaultValue={initialData?.metaKeywords} className="md:col-span-2 w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"></textarea>
          <textarea name="metaDescription" placeholder="Meta Description" rows={3} defaultValue={initialData?.metaDescription} className="md:col-span-2 w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"></textarea>
        </div>

        {/* Buttons Section */}
        <div className="mt-6 md:col-span-2">
          <h3 className="text-xl font-bold text-white mb-4">Custom Buttons</h3>
          {buttons.map((button, index) => (
            <div key={index} className="bg-custom-card p-4 rounded-lg mb-4 relative">
              <button
                type="button"
                onClick={() => handleRemoveButton(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                &times;
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Button Text"
                  value={button.text}
                  onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                  className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
                />
                <input
                  type="text"
                  placeholder="Button URL"
                  value={button.url}
                  onChange={(e) => handleButtonChange(index, 'url', e.target.value)}
                  className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
                />
                <input
                  type="number"
                  placeholder="Regular Price"
                  value={button.regularPrice}
                  onChange={(e) => handleButtonChange(index, 'regularPrice', e.target.value)}
                  className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
                />
                <input
                  type="number"
                  placeholder="Sale Price"
                  value={button.salePrice}
                  onChange={(e) => handleButtonChange(index, 'salePrice', e.target.value)}
                  className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddButton}
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition mt-4"
          >
            Add New Button
          </button>
        </div>
        <div className="mt-6">
          <button type="submit" className="w-full bg-custom-accent text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;